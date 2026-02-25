from fastapi import FastAPI, UploadFile
import json
from youtube_service import get_youtube_video
from cert_service import get_certificate
from learning_time_service import get_learning_time
   

from resume_parser import extract_text_from_pdf
from skill_extractor import extract_skills
from analyser import analyse_gap

app = FastAPI()

# load master skills
with open("all_skills.json") as f:
    ALL_SKILLS = json.load(f)

with open("courses.json") as f:
        COURSE_DB = json.load(f)    


@app.post("/analyze")
async def analyze_resume(resume: UploadFile, jd: UploadFile):

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