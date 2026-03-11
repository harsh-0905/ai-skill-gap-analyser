from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os
import json
from  youtube_service import get_youtube_video
from  cert_service import get_certificate
from learning_time_service import get_learning_time
   

from resume_parser import extract_text_from_pdf
from skill_extractor import extract_skills
from analyser import analyse_gap

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# load master
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(BASE_DIR, "all_skills.json")) as f:
        ALL_SKILLS = json.load(f)



with open(os.path.join(BASE_DIR, "courses.json")) as f:
            COURSE_DB = json.load(f)    


@app.post("/analyze")
async def analyze_resume(resume: UploadFile = File(...), jd: UploadFile = File(...)):

    resume_text = extract_text_from_pdf(resume.file)
    jd_text = extract_text_from_pdf(jd.file)

    resume_skills = extract_skills(resume_text, ALL_SKILLS)
    jd_skills = extract_skills(jd_text, ALL_SKILLS)

    result = analyse_gap(resume_skills, jd_skills)
    recommendations = {}

    for skill in result["missing_skills"]:

        youtube = get_youtube_video(skill)
        cert = get_certificate(skill)

        recommendations[skill] = {
            "youtube_title": youtube["title"],
            "youtube_link": youtube["url"],
                "certificate_name": cert["name"],
                "certificate_link": cert["link"],
                "time_to_learn": get_learning_time(skill)
        
        }

    result["recommendations"] = recommendations
    result["skills"] = result["matched_skills"]  # alias for frontend

    # DOMAIN DETECTION
    domain = "General"

    if "docker" in jd_skills or "kubernetes" in jd_skills:
        domain = "DevOps"

    elif "machine learning" in jd_skills or "deep learning" in jd_skills:
        domain = "AI/ML"

    elif "react" in jd_skills or "javascript" in jd_skills:
        domain = "Frontend"

    elif "django" in jd_skills or "fastapi" in jd_skills:
        domain = "Backend"

    result["job_domain"] = domain
#  CAREER ADVICE GENERATOR

    if domain == "Frontend":
     advice = "Focus on React, JavaScript, performance optimization, and frontend deployments."
    elif domain == "Backend":
     advice = "Improve API design, databases, authentication, and system design."
    elif domain == "DevOps":
     advice = "Learn Docker → CI/CD → Kubernetes → Cloud and build deployment projects."
    elif domain == "AI/ML":
      advice = "Strengthen Python, ML algorithms, deep learning, and real-world model deployment."
    else:
     advice = "Build projects and strengthen core skills."
    return result