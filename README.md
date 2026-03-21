<div align="center">

<img src="https://img.shields.io/badge/SkillGap-AI-6366f1?style=for-the-badge&logo=sparkles&logoColor=white" alt="SkillGap AI" />

# SkillGap AI — Career Intelligence Platform

**Upload your resume + job description. Get an instant AI-powered skill gap analysis, personalized learning path, and course recommendations.**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-10-FF0055?style=flat-square&logo=framer)](https://www.framer.com/motion)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python)](https://python.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

<br />

![Dashboard Preview](https://placehold.co/900x500/0d0d14/6366f1?text=SkillGap+AI+Dashboard&font=raleway)

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🧠 Overview

**SkillGap AI** is a full-stack SaaS web application that analyzes the gap between a candidate's current skill set and the requirements of a target job description. It uses NLP-based skill extraction to compare a resume against a JD, generates a match score, identifies missing skills, and provides personalized YouTube video and certification course recommendations for each gap.

> Built as an MCA Final Year Project — designed to premium SaaS standards (Vercel / Linear / Stripe aesthetic).

---

## ✨ Features

| Feature | Description |
|---|---|
| 📄 **Resume + JD Upload** | Drag & drop PDF/DOC upload for both resume and job description |
| 🎯 **Match Score** | Animated circular progress ring showing % alignment |
| 🔍 **Skill Extraction** | NLP-powered extraction of skills from unstructured text |
| ✅ **Matched / Missing Skills** | Color-coded pill badges with hover tooltips |
| 📚 **Course Recommendations** | YouTube video + Coursera/Udemy certification per missing skill |
| 🗺️ **Learning Path** | 8-week personalized roadmap with difficulty badges and timeline UI |
| 📊 **Analytics Dashboard** | Radar, Bar, and Area charts (Recharts) with glass tooltips |
| 📧 **Email Report** | Send full HTML skill gap report to any email via Gmail SMTP |
| 👤 **Profile Page** | Avatar, editable info, skill portfolio with progress bars |
| 🌗 **Dark / Light Mode** | Smooth CSS variable-based theme switching |
| 📱 **Responsive** | Mobile-friendly collapsible sidebar and adaptive layouts |
| 🔔 **Toast Notifications** | Spring-animated bottom-right notifications |
| ⚡ **Animated Counters** | StatCards count up from 0 on mount |
| 💡 **Time-aware Greeting** | Dynamic greeting + motivational message based on time of day |

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** + Vite | Component framework + dev server |
| **Tailwind CSS** | Utility-first styling |
| **Framer Motion** | Page transitions, card animations, counters |
| **Recharts** | Radar, Bar, and Area charts |
| **Lucide React** | Icon library |
| **Axios** | HTTP client for API calls |
| **Outfit** (Google Fonts) | Premium display typography |

### Backend
| Technology | Purpose |
|---|---|
| **FastAPI** | REST API framework |
| **pdfplumber** | Extract text from PDF resumes and JDs |
| **python-dotenv** | Load environment variables from `.env` |
| **smtplib** | Gmail SMTP email sending |
| **youtube-search-python** | Fetch YouTube video recommendations |
| **uvicorn** | ASGI server |

---

## 📁 Project Structure

```
skill-gap-analyser/
│
├── backend/                        # FastAPI backend
│   ├── main.py                     # Entry point — /analyze + /send-plan routes
│   ├── resume_parser.py            # PDF text extraction
│   ├── skill_extractor.py          # NLP skill matching
│   ├── analyser.py                 # Gap analysis + match % logic
│   ├── youtube_service.py          # YouTube video recommendations
│   ├── cert_service.py             # Certificate course lookup
│   ├── learning_time_service.py    # Estimated learning durations
│   ├── all_skills.json             # Master skill database
│   ├── courses.json                # Course database
│   ├── requirements.txt            # Python dependencies
│   └── .env                        # ← you create this (never commit)
│
└── frontend/
    └── vite-project/
        ├── src/
        │   ├── App.jsx
        │   ├── SkillGapAnalyzer.jsx   # Root shell + global styles + theme
        │   ├── api.js                 # Axios API layer (analyzeResume, sendLearningPlan)
        │   │
        │   ├── data/
        │   │   └── constants.js       # Dummy data, chart data, nav items
        │   │
        │   ├── hooks/
        │   │   └── useToast.js        # Toast notification state hook
        │   │
        │   ├── components/
        │   │   ├── Sidebar.jsx        # Collapsible nav with Lucide icons
        │   │   ├── Navbar.jsx         # Sticky top bar with search + dropdowns
        │   │   ├── StatCard.jsx       # Animated metric tile (glassmorphism)
        │   │   ├── CircularProgress.jsx  # Gradient SVG progress ring
        │   │   ├── Charts.jsx         # Radar, Bar, Area charts (Recharts)
        │   │   ├── SkillTag.jsx       # Skill pill with hover tooltip
        │   │   ├── RecommendationCard.jsx  # YouTube thumbnail + course CTA
        │   │   ├── UploadBox.jsx      # Drag & drop file upload
        │   │   ├── Toast.jsx          # Spring-animated notifications
        │   │   └── Skeleton.jsx       # Shimmer loading placeholder
        │   │
        │   └── pages/
        │       ├── Dashboard.jsx      # Hero + KPIs + charts + skill snapshot
        │       ├── Analyze.jsx        # Upload form + results view
        │       ├── Reports.jsx        # Filterable skills table + export
        │       ├── LearningPath.jsx   # Timeline roadmap + resource cards
        │       ├── Profile.jsx        # Avatar + email plan sender
        │       └── Settings.jsx       # Profile + API config + appearance
        │
        ├── package.json
        └── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- A Gmail account (for email sending)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/skill-gap-analyser.git
cd skill-gap-analyser
```

### 2. Set up the Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create your .env file (see Environment Variables section)
cp .env.example .env
# Edit .env and fill in your Gmail credentials

# Start the server
uvicorn main:app --reload
```

Backend runs at → `http://127.0.0.1:8000`
Interactive API docs → `http://127.0.0.1:8000/docs`

### 3. Set up the Frontend

```bash
cd frontend/vite-project

# Install dependencies
npm install

# Install Lucide icons (required)
npm install lucide-react

# Start dev server
npm run dev
```

Frontend runs at → `http://localhost:5173`

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
# Gmail SMTP — used to send learning plan emails
# Get an App Password at: https://myaccount.google.com/apppasswords
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_gmail@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop
```

> ⚠️ `SMTP_PASSWORD` must be a **16-character Gmail App Password**, not your real Gmail password.
> Spaces in the password are automatically stripped — paste it exactly as Google shows it.

---

## 📡 API Reference

### `POST /analyze`

Analyzes a resume against a job description.

**Request** — `multipart/form-data`

| Field | Type | Description |
|---|---|---|
| `resume` | `File` | Resume PDF or DOC |
| `jd` | `File` | Job Description PDF or DOC |

**Response**

```json
{
  "match_percentage": 87.5,
  "matched_skills": ["javascript", "react", "node", "git"],
  "missing_skills": ["aws", "docker"],
  "job_readiness": "87%",
  "estimated_time_to_job_ready": "2 weeks",
  "job_domain": "Frontend",
  "career_advice": "Focus on React, performance optimization, and frontend deployments.",
  "learning_path": ["aws → 4 weeks", "docker → 2 weeks"],
  "recommendations": {
    "aws": {
      "youtube_title": "AWS Full Course 2024 – Zero to Hero",
      "youtube_link": "https://www.youtube.com/watch?v=...",
      "certificate_name": "AWS Solutions Architect Associate",
      "certificate_link": "https://coursera.org/...",
      "time_to_learn": "4 weeks"
    }
  }
}
```

---

### `POST /send-plan`

Sends the full skill gap report as an HTML email.

**Request** — `application/json`

```json
{
  "email": "user@example.com",
  "name": "Harsh Yadav",
  "role": "Frontend Developer",
  "analysis": { ... }
}
```

**Response**

```json
{ "status": "sent", "to": "user@example.com" }
```

---

## 🌐 Deployment

| Service | Platform | Free |
|---|---|---|
| Frontend | [Vercel](https://vercel.com) | ✅ |
| Backend | [Render](https://render.com) | ✅ |

### Frontend → Vercel

```bash
# Build locally to verify
npm run build

# Push to GitHub, then import on vercel.com
# Add environment variable in Vercel dashboard:
# VITE_API_URL = https://your-backend.onrender.com
```

Update `src/api.js`:
```js
const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
```

### Backend → Render

1. Add a `Procfile` to `backend/`:
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

2. Push to GitHub → New Web Service on Render
3. Add environment variables: `SMTP_USER`, `SMTP_PASSWORD`
4. Add your Vercel URL to CORS `allow_origins` in `main.py`

---

## 📸 Screenshots

| Page | Preview |
|---|---|
| Dashboard | Hero banner · KPI cards · Skill snapshot · Charts |
| Analyze | Drag & drop upload · Loading steps · Results with skill tags |
| Learning Path | Timeline roadmap · YouTube cards · Difficulty badges |
| Profile | Avatar · Send plan to email · Skill portfolio bars |
| Reports | Filterable table · Progress chart · Export PDF |

---

## 🤝 Contributing

Contributions are welcome!

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
# Open a Pull Request
```

Please follow conventional commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`

---

## 👤 Author

**Harsh Yadav**
MCA Semester IV

[![GitHub](https://img.shields.io/badge/GitHub-harshyadav-181717?style=flat-square&logo=github)](https://github.com/harsh-0905)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/harshyadav95-dev/)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ and a lot of ☕

⭐ Star this repo if you found it helpful!

</div>
