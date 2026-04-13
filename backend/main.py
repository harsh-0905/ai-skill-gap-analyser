from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import json
import httpx

from dotenv import load_dotenv
load_dotenv()

from youtube_service import get_youtube_video
from cert_service import get_certificate
from learning_time_service import get_learning_time
from resume_parser import extract_text_from_pdf
from skill_extractor import extract_skills
from analyser import analyse_gap

app = FastAPI()

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(BASE_DIR, "all_skills.json")) as f:
    ALL_SKILLS = json.load(f)

with open(os.path.join(BASE_DIR, "courses.json")) as f:
    COURSE_DB = json.load(f)

RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
FRONTEND_URL   = os.getenv("FRONTEND_URL", "http://localhost:5173")


@app.post("/analyze")
async def analyze_resume(resume: UploadFile = File(...), jd: UploadFile = File(...)):
    resume_text = extract_text_from_pdf(resume.file)
    jd_text     = extract_text_from_pdf(jd.file)

    resume_skills = extract_skills(resume_text, ALL_SKILLS)
    jd_skills     = extract_skills(jd_text, ALL_SKILLS)

    result = analyse_gap(resume_skills, jd_skills)

    recommendations = {}
    for skill in result["missing_skills"]:
        youtube = get_youtube_video(skill)
        cert    = get_certificate(skill)
        recommendations[skill] = {
            "youtube_title":    youtube["title"],
            "youtube_link":     youtube["url"],
            "certificate_name": cert["name"],
            "certificate_link": cert["link"],
            "time_to_learn":    get_learning_time(skill),
        }

    result["recommendations"] = recommendations
    result["skills"]           = result["matched_skills"]

    domain = "General"
    jd_lower = [s.lower() for s in jd_skills]
    if   "docker"           in jd_lower or "kubernetes"        in jd_lower: domain = "DevOps"
    elif "machine learning" in jd_lower or "deep learning"     in jd_lower: domain = "AI/ML"
    elif "react"            in jd_lower or "javascript"        in jd_lower: domain = "Frontend"
    elif "django"           in jd_lower or "fastapi"           in jd_lower: domain = "Backend"

    result["job_domain"] = domain

    advice_map = {
        "Frontend": "Focus on React, JavaScript, performance optimization, and frontend deployments.",
        "Backend":  "Improve API design, databases, authentication, and system design.",
        "DevOps":   "Learn Docker → CI/CD → Kubernetes → Cloud and build deployment projects.",
        "AI/ML":    "Strengthen Python, ML algorithms, deep learning, and real-world model deployment.",
    }
    result["career_advice"] = advice_map.get(domain, "Build projects and strengthen core skills.")

    return result


class SendPlanRequest(BaseModel):
    email:    str
    name:     str = ""
    role:     str = ""
    analysis: dict


@app.post("/send-plan")
async def send_plan(body: SendPlanRequest):
    if not RESEND_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="Email not configured. Add RESEND_API_KEY to Render environment variables."
        )

    try:
        html = _build_email_html(body.name, body.role, body.analysis)

        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {RESEND_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "from":    "SkillGap AI <onboarding@resend.dev>",
                    "to":      [body.email],
                    "subject": f"Your Skill Gap Report — {body.analysis.get('job_domain', 'Career')} Role",
                    "html":    html,
                },
            )

        if response.status_code not in (200, 201):
            raise HTTPException(
                status_code=500,
                detail=f"Resend API error: {response.text}"
            )

        return {"status": "sent", "to": body.email}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def _build_email_html(name: str, role: str, analysis: dict) -> str:
    matched       = analysis.get("matched_skills", [])
    missing       = analysis.get("missing_skills", [])
    recs          = analysis.get("recommendations", {})
    match_pct     = analysis.get("match_percentage", 0)
    domain        = analysis.get("job_domain", "—")
    readiness     = analysis.get("job_readiness", "—")
    time_ready    = analysis.get("estimated_time_to_job_ready", "—")
    advice        = analysis.get("career_advice", "")
    learning_path = analysis.get("learning_path", [])

    greeting = f"Hi {name}," if name else "Hi,"

    matched_pills = "".join(
        f'<span style="display:inline-block;background:#d1fae5;color:#065f46;border:1px solid #6ee7b7;'
        f'padding:3px 12px;border-radius:999px;font-size:12px;margin:3px;">{s}</span>'
        for s in matched
    )

    missing_pills = "".join(
        f'<span style="display:inline-block;background:#fee2e2;color:#991b1b;border:1px solid #fca5a5;'
        f'padding:3px 12px;border-radius:999px;font-size:12px;margin:3px;">{s}</span>'
        for s in missing
    )

    rec_rows = ""
    for skill, data in recs.items():
        rec_rows += f"""
        <tr>
          <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;">
            <strong style="color:#111827;font-size:14px;">{skill.upper()}</strong><br>
            <span style="color:#6b7280;font-size:12px;">{data.get('time_to_learn','')}</span>
          </td>
          <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;">
            <a href="{data.get('youtube_link','')}" style="color:#4f46e5;font-size:13px;text-decoration:none;">
              ▶ {data.get('youtube_title','')}
            </a>
          </td>
          <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;">
            <a href="{data.get('certificate_link','')}" style="color:#4f46e5;font-size:13px;text-decoration:none;">
              🎓 {data.get('certificate_name','')}
            </a>
          </td>
        </tr>
        """

    lp_items = "".join(
        f"<li style='margin:4px 0;color:#374151;font-size:13px;'>{item}</li>"
        for item in learning_path
    )

    return f"""
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:640px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <div style="background:linear-gradient(135deg,#6366f1,#a855f7);padding:36px 32px;">
      <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">Skill Gap Report</h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,0.75);font-size:14px;">{greeting} Here's your personalised career analysis.</p>
      {f'<p style="margin:4px 0 0;color:rgba(255,255,255,0.6);font-size:13px;">Target role: {role}</p>' if role else ""}
    </div>

    <div style="background:#f5f3ff;padding:24px 32px;display:flex;gap:32px;border-bottom:1px solid #ede9fe;">
      <div style="text-align:center;">
        <div style="font-size:36px;font-weight:800;color:#6366f1;">{match_pct}%</div>
        <div style="font-size:12px;color:#6b7280;margin-top:2px;">Match Score</div>
      </div>
      <div style="text-align:center;">
        <div style="font-size:36px;font-weight:800;color:#059669;">{readiness}</div>
        <div style="font-size:12px;color:#6b7280;margin-top:2px;">Job Readiness</div>
      </div>
      <div style="text-align:center;">
        <div style="font-size:36px;font-weight:800;color:#d97706;">{time_ready}</div>
        <div style="font-size:12px;color:#6b7280;margin-top:2px;">Time to Ready</div>
      </div>
      <div style="text-align:center;">
        <div style="font-size:22px;font-weight:700;color:#374151;padding-top:6px;">{domain}</div>
        <div style="font-size:12px;color:#6b7280;margin-top:2px;">Domain</div>
      </div>
    </div>

    <div style="padding:28px 32px;">
      {f'''<div style="background:#eff6ff;border-left:4px solid #6366f1;border-radius:8px;padding:14px 16px;margin-bottom:24px;">
        <p style="margin:0;color:#1e3a5f;font-size:13px;line-height:1.6;">💡 <strong>Career Advice:</strong> {advice}</p>
      </div>''' if advice else ""}

      <h2 style="font-size:15px;font-weight:700;color:#111827;margin:0 0 10px;">✅ Matched Skills ({len(matched)})</h2>
      <div style="margin-bottom:24px;">{matched_pills or '<p style="color:#6b7280;font-size:13px;">None</p>'}</div>

      <h2 style="font-size:15px;font-weight:700;color:#111827;margin:0 0 10px;">❌ Missing Skills ({len(missing)})</h2>
      <div style="margin-bottom:24px;">{missing_pills or '<p style="color:#6b7280;font-size:13px;">None — great match!</p>'}</div>

      {f'''<h2 style="font-size:15px;font-weight:700;color:#111827;margin:0 0 10px;">🗺️ Learning Path</h2>
      <ul style="padding-left:20px;margin:0 0 24px;">{lp_items}</ul>''' if learning_path else ""}

      {f'''<h2 style="font-size:15px;font-weight:700;color:#111827;margin:0 0 12px;">📚 Recommendations</h2>
      <table style="width:100%;border-collapse:collapse;font-family:inherit;margin-bottom:24px;">
        <thead>
          <tr style="background:#f3f4f6;">
            <th style="padding:10px 16px;text-align:left;font-size:12px;color:#6b7280;font-weight:600;border-bottom:2px solid #e5e7eb;">SKILL</th>
            <th style="padding:10px 16px;text-align:left;font-size:12px;color:#6b7280;font-weight:600;border-bottom:2px solid #e5e7eb;">VIDEO</th>
            <th style="padding:10px 16px;text-align:left;font-size:12px;color:#6b7280;font-weight:600;border-bottom:2px solid #e5e7eb;">COURSE</th>
          </tr>
        </thead>
        <tbody>{rec_rows}</tbody>
      </table>''' if rec_rows else ""}
    </div>

    <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 32px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#9ca3af;">
        Sent by SkillGap AI ·
        <a href="{FRONTEND_URL}" style="color:#6366f1;text-decoration:none;">Open Dashboard</a>
      </p>
    </div>
  </div>
</body>
</html>
"""