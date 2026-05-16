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

ALLOWED_ORIGINS = [
    "https://ai-skill-gap-analyser.netlify.app",
    "https://ai-skill-gap-analyser-weld.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
]

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

# ── Resend config ──────────────────────────────────────────────────────────────
RESEND_API_KEY  = os.getenv("RESEND_API_KEY", "")          # re_xxxxxxxxxxxxxxxx
FROM_EMAIL      = os.getenv("FROM_EMAIL", "onboarding@resend.dev")  # or your verified domain
FROM_NAME       = os.getenv("FROM_NAME", "SkillGap AI")
FRONTEND_URL    = os.getenv("FRONTEND_URL", "http://localhost:5173")
ADZUNA_APP_ID   = os.getenv("ADZUNA_APP_ID", "")
ADZUNA_APP_KEY  = os.getenv("ADZUNA_APP_KEY", "")


# ─────────────────────────────────────────────
# Domain signal lists
# ─────────────────────────────────────────────

DEVOPS_SIGNALS = [
    "kubernetes", "terraform", "jenkins", "ci/cd", "ansible",
    "helm", "prometheus", "grafana", "infrastructure", "pipeline",
    "gitlab", "argocd", "linux administration", "site reliability",
    "sre", "nginx", "load balancer", "cloud infrastructure"
]

AIML_SIGNALS = [
    "machine learning", "deep learning", "pytorch", "tensorflow",
    "llm", "model training", "huggingface", "transformers",
    "computer vision", "reinforcement learning", "scikit-learn",
    "neural network", "dataset", "fine-tuning", "generative ai",
    "large language models", "prompt engineering", "mlops",
    "retrieval augmented generation", "langchain", "vector db"
]

FRONTEND_SIGNALS = [
    "react", "javascript", "vue", "angular", "css", "html",
    "typescript", "next.js", "svelte", "tailwind", "redux",
    "webpack", "ui", "ux", "figma", "responsive design",
    "sass", "nuxtjs", "framer motion", "storybook"
]

BACKEND_SIGNALS = [
    "fastapi", "django", "flask", "node.js", "express",
    "postgresql", "rest api", "celery", "redis", "sqlalchemy",
    "alembic", "pydantic", "async", "websocket", "graphql",
    "microservices", "mongodb", "mysql", "api design", "spacy",
    "nlp", "tfidf", "python", "spring boot", "java", "go",
    "grpc", "rabbitmq", "kafka", "serverless"
]

QA_SIGNALS = [
    "selenium", "testing", "test cases", "manual testing", "automation testing",
    "jira", "bug tracking", "defect", "stlc", "regression testing",
    "functional testing", "integration testing", "uat", "testng", "junit",
    "postman", "api testing", "cross-browser testing", "mobile testing",
    "test plan", "test strategy", "quality assurance", "qa", "appium",
    "cypress", "playwright", "test automation", "load testing",
    "performance testing", "smoke testing", "sanity testing", "test report"
]

DATA_ENGINEERING_SIGNALS = [
    "apache spark", "airflow", "kafka", "etl", "data pipeline",
    "data warehouse", "snowflake", "databricks", "hadoop", "hive",
    "data lake", "dbt", "bigquery", "redshift", "data engineering",
    "batch processing", "stream processing", "data modeling",
    "power bi", "tableau", "looker", "data orchestration"
]

CYBERSECURITY_SIGNALS = [
    "penetration testing", "ethical hacking", "owasp", "siem",
    "vulnerability", "cybersecurity", "network security", "firewalls",
    "intrusion detection", "soc", "malware analysis", "kali linux",
    "burp suite", "metasploit", "cve", "threat analysis", "incident response",
    "security audit", "pki", "ssl", "zero trust", "devsecops"
]

CLOUD_SIGNALS = [
    "aws", "azure", "google cloud", "gcp", "cloud architect",
    "ec2", "s3", "lambda", "cloudformation", "cloud native",
    "multi-cloud", "iaas", "paas", "saas", "cloud migration",
    "cost optimization", "cloud security", "solutions architect"
]

MOBILE_SIGNALS = [
    "android", "ios", "flutter", "react native", "kotlin", "swift",
    "xcode", "android studio", "mobile app", "play store", "app store",
    "mobile ui", "jetpack compose", "swiftui", "xamarin", "ionic",
    "mobile testing", "push notifications", "firebase"
]

DATA_SCIENCE_SIGNALS = [
    "pandas", "numpy", "matplotlib", "seaborn", "data analysis",
    "statistics", "probability", "hypothesis testing", "regression",
    "classification", "clustering", "data visualization", "jupyter",
    "r programming", "scipy", "data science", "predictive modeling",
    "a/b testing", "feature engineering", "eda"
]

BLOCKCHAIN_SIGNALS = [
    "blockchain", "solidity", "smart contracts", "ethereum", "web3",
    "defi", "nft", "cryptocurrency", "truffle", "hardhat",
    "metamask", "ipfs", "consensus", "distributed ledger"
]

FULLSTACK_SIGNALS = [
    "full stack", "fullstack", "mern", "mean", "full-stack developer",
    "end to end", "frontend and backend", "react and node"
]


def detect_domain(jd_skills: list[str]) -> str:
    jd_lower = [s.lower() for s in jd_skills]

    scores = {
        "DevOps":           0,
        "AI/ML":            0,
        "Frontend":         0,
        "Backend":          0,
        "QA/Testing":       0,
        "Data Engineering": 0,
        "Cybersecurity":    0,
        "Cloud":            0,
        "Mobile":           0,
        "Data Science":     0,
        "Blockchain":       0,
        "Full Stack":       0,
    }

    for skill in jd_lower:
        if skill in DEVOPS_SIGNALS:           scores["DevOps"]           += 2
        if skill in AIML_SIGNALS:             scores["AI/ML"]            += 2
        if skill in FRONTEND_SIGNALS:         scores["Frontend"]         += 2
        if skill in BACKEND_SIGNALS:          scores["Backend"]          += 2
        if skill in QA_SIGNALS:               scores["QA/Testing"]       += 3
        if skill in DATA_ENGINEERING_SIGNALS: scores["Data Engineering"] += 3
        if skill in CYBERSECURITY_SIGNALS:    scores["Cybersecurity"]    += 3
        if skill in CLOUD_SIGNALS:            scores["Cloud"]            += 3
        if skill in MOBILE_SIGNALS:           scores["Mobile"]           += 3
        if skill in DATA_SCIENCE_SIGNALS:     scores["Data Science"]     += 2
        if skill in BLOCKCHAIN_SIGNALS:       scores["Blockchain"]       += 3
        if skill in FULLSTACK_SIGNALS:        scores["Full Stack"]       += 3

    best_domain = max(scores, key=scores.get)
    return "General" if scores[best_domain] == 0 else best_domain


# ─────────────────────────────────────────────
# Keep-alive ping (prevents Render cold starts)
# ─────────────────────────────────────────────

@app.get("/ping")
async def ping():
    return {"status": "ok"}


# ─────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────

@app.get("/jobs")
async def get_jobs(
    what: str = "Software Developer",
    where: str = "India",
    page: int = 1,
    results_per_page: int = 12
):
    if not ADZUNA_APP_ID or not ADZUNA_APP_KEY:
        raise HTTPException(status_code=500, detail="Adzuna credentials not configured.")

    url = (
        f"https://api.adzuna.com/v1/api/jobs/in/search/{page}"
        f"?app_id={ADZUNA_APP_ID}&app_key={ADZUNA_APP_KEY}"
        f"&what={what}&where={where}"
        f"&results_per_page={results_per_page}&sort_by=date"
    )

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(url)
        resp.raise_for_status()
        return resp.json()
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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

    domain = detect_domain(jd_skills)
    result["job_domain"] = domain

    advice_map = {
        "Frontend":         "Focus on React, JavaScript, performance optimization, and frontend deployments.",
        "Backend":          "Improve API design, databases, authentication, and system design.",
        "DevOps":           "Learn Docker → CI/CD → Kubernetes → Cloud and build deployment projects.",
        "AI/ML":            "Strengthen Python, ML algorithms, deep learning, and real-world model deployment.",
        "QA/Testing":       "Master Selenium WebDriver, write strong test cases, learn API testing with Postman, and explore CI integration with Jenkins.",
        "Data Engineering": "Learn Apache Spark, Airflow, dbt, and build end-to-end data pipelines on cloud platforms.",
        "Cybersecurity":    "Study OWASP Top 10, practice on HackTheBox/TryHackMe, and earn CEH or CompTIA Security+ certification.",
        "Cloud":            "Earn AWS/Azure/GCP certification, build cloud-native projects, and learn infrastructure-as-code with Terraform.",
        "Mobile":           "Build real apps on Android/iOS, publish to Play Store or App Store, and learn Flutter for cross-platform development.",
        "Data Science":     "Strengthen statistics, practice on Kaggle, build end-to-end ML projects, and learn data storytelling with visualization tools.",
        "Blockchain":       "Learn Solidity, deploy smart contracts on Ethereum testnets, and build a DeFi or NFT project.",
        "Full Stack":       "Build complete projects with a frontend framework + backend API + database, and deploy them to production.",
    }
    result["career_advice"] = advice_map.get(domain, "Build projects, strengthen core CS fundamentals, and keep learning.")

    return result


# ─────────────────────────────────────────────
# Email via Resend
# ─────────────────────────────────────────────

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
            detail="RESEND_API_KEY not configured. Add it to your Render environment variables."
        )

    html = _build_email_html(body.name, body.role, body.analysis)
    subject = f"Your Skill Gap Report — {body.analysis.get('job_domain', 'Career')} Role"

    payload = {
        "from": f"{FROM_NAME} <{FROM_EMAIL}>",
        "to":   [body.email],
        "subject": subject,
        "html": html,
    }

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {RESEND_API_KEY}",
                    "Content-Type":  "application/json",
                },
                json=payload,
            )

        if resp.status_code not in (200, 201):
            raise HTTPException(
                status_code=resp.status_code,
                detail=f"Resend error: {resp.text}"
            )

        return {"status": "sent", "to": body.email}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─────────────────────────────────────────────
# Email HTML builder (unchanged)
# ─────────────────────────────────────────────

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