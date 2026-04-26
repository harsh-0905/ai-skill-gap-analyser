import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, CheckCircle2, AlertCircle, Clock,
  TrendingUp, ArrowRight, RefreshCw, Route, ChevronRight,
  Upload, Briefcase,
} from "lucide-react";

import CircularProgress from "../components/CircularProgress";
import { AnalysisRadarChart, AnalysisBarChart, ProgressAreaChart } from "../components/Charts";
import { fetchJobs } from "../api";

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function getGreeting(h) {
  if (h >= 5  && h < 12) return { text: "Good morning",   emoji: "☀️",  msg: "Start your day with a quick skill check!" };
  if (h >= 12 && h < 14) return { text: "Good afternoon", emoji: "🌤️", msg: "Fuel up and keep pushing toward your goals." };
  if (h >= 14 && h < 17) return { text: "Good afternoon", emoji: "⚡", msg: "Peak focus hours — great time to learn." };
  if (h >= 17 && h < 20) return { text: "Good evening",   emoji: "🌇", msg: "Great work today. Review your progress?" };
  if (h >= 20 && h < 23) return { text: "Good evening",   emoji: "🌙", msg: "Night grind? Respect. Let's close those gaps." };
  return                         { text: "Up late?",       emoji: "🦉", msg: "True developers never sleep. Let's build." };
}

const TIPS = [
  "🔥 AI & ML skills are the #1 demand in 2025 job listings",
  "⚡ Docker + Kubernetes combo unlocks DevOps roles at 2× salary",
  "🚀 TypeScript required in 80% of Frontend job descriptions",
  "🧠 LLM fine-tuning and RAG are the hottest emerging skills right now",
  "☁️ AWS Solutions Architect is the most in-demand cloud cert globally",
  "💡 GraphQL adoption up 60% — must-have for senior API roles",
];

/* ─────────────────────────────────────────────
   Score-based static job suggestions
───────────────────────────────────────────── */
const STATIC_JOBS = {
  Frontend: [
    { id: "f1", title: "Frontend Developer Intern", company: "Razorpay",  location: "Bangalore",         url: "https://razorpay.com/jobs",       tags: ["React", "JS", "CSS"],               level: "intern" },
    { id: "f2", title: "React Developer",           company: "Meesho",    location: "Bangalore / Remote", url: "https://meesho.io/jobs",           tags: ["React", "Redux", "TypeScript"],     level: "mid"    },
    { id: "f3", title: "Junior UI Engineer",        company: "Groww",     location: "Bangalore",         url: "https://groww.in/jobs",            tags: ["JavaScript", "HTML", "CSS"],        level: "junior" },
    { id: "f4", title: "Senior Frontend Engineer",  company: "Flipkart",  location: "Bangalore",         url: "https://flipkartcareers.com",      tags: ["React", "Performance", "Vitals"],   level: "senior" },
  ],
  Backend: [
    { id: "b1", title: "Backend Developer Intern",  company: "Postman",    location: "Bangalore", url: "https://postman.com/jobs",        tags: ["Node.js", "REST APIs"],             level: "intern" },
    { id: "b2", title: "Node.js Developer",         company: "PhonePe",    location: "Bangalore", url: "https://phonepe.com/jobs",        tags: ["Node.js", "MongoDB", "AWS"],        level: "mid"    },
    { id: "b3", title: "API Developer",             company: "Freshworks", location: "Chennai",   url: "https://freshworks.com/jobs",     tags: ["Python", "FastAPI", "MySQL"],       level: "mid"    },
    { id: "b4", title: "Senior Backend Engineer",   company: "Juspay",     location: "Bangalore", url: "https://juspay.in/jobs",          tags: ["Node.js", "PostgreSQL", "Docker"], level: "senior" },
  ],
  "AI/ML": [
    { id: "m1", title: "AI/ML Intern",    company: "Ola Krutrim", location: "Bangalore", url: "https://krutrim.ai/careers",    tags: ["Python", "ML", "NLP"],           level: "intern" },
    { id: "m2", title: "ML Engineer",     company: "Sarvam AI",   location: "Bangalore", url: "https://sarvam.ai/careers",    tags: ["PyTorch", "LLMs", "Python"],     level: "mid"    },
    { id: "m3", title: "Data Scientist",  company: "Swiggy",      location: "Bangalore", url: "https://careers.swiggy.com",   tags: ["Python", "Pandas", "Sklearn"],   level: "mid"    },
    { id: "m4", title: "AI Research Engineer", company: "Google DeepMind", location: "Bangalore", url: "https://deepmind.google/careers", tags: ["PyTorch", "Research", "LLMs"], level: "senior" },
  ],
  DevOps: [
    { id: "d1", title: "DevOps Intern",    company: "Razorpay", location: "Bangalore", url: "https://razorpay.com/jobs",    tags: ["Linux", "Docker", "CI/CD"],        level: "intern" },
    { id: "d2", title: "DevOps Engineer",  company: "Infosys",  location: "Pune",      url: "https://infosys.com/careers",  tags: ["Kubernetes", "Terraform", "AWS"],  level: "mid"    },
    { id: "d3", title: "Cloud Engineer",   company: "Wipro",    location: "Bangalore", url: "https://wipro.com/careers",    tags: ["AWS", "Terraform", "Linux"],       level: "senior" },
    { id: "d4", title: "SRE Engineer",     company: "Google",   location: "Bangalore", url: "https://careers.google.com",   tags: ["Kubernetes", "SLO", "Monitoring"], level: "senior" },
  ],
  "QA/Testing": [
    { id: "q1", title: "QA Intern",             company: "Newgen Software", location: "Noida",    url: "https://newgensoft.com/company/careers/", tags: ["Selenium", "JIRA", "Manual Testing"], level: "intern" },
    { id: "q2", title: "Software Test Engineer", company: "Wipro",          location: "Pan India", url: "https://wipro.com/careers",               tags: ["Selenium", "Java", "TestNG"],         level: "junior" },
    { id: "q3", title: "QA Automation Engineer", company: "Infosys",        location: "Bangalore", url: "https://infosys.com/careers",             tags: ["Selenium", "Postman", "CI/CD"],       level: "mid"    },
    { id: "q4", title: "Senior QA Engineer",     company: "HCLTech",        location: "Pan India", url: "https://hcltech.com/careers",             tags: ["Cypress", "Playwright", "API Testing"],level: "senior" },
  ],
  "Data Engineering": [
    { id: "de1", title: "Data Engineering Intern", company: "Flipkart",  location: "Bangalore", url: "https://flipkartcareers.com",      tags: ["Python", "SQL", "Spark"],           level: "intern" },
    { id: "de2", title: "Data Engineer",           company: "Swiggy",    location: "Bangalore", url: "https://careers.swiggy.com",       tags: ["Spark", "Airflow", "BigQuery"],     level: "mid"    },
    { id: "de3", title: "Senior Data Engineer",    company: "Zomato",    location: "Gurugram",  url: "https://www.zomato.com/careers",   tags: ["Kafka", "dbt", "Databricks"],       level: "senior" },
    { id: "de4", title: "Analytics Engineer",      company: "Freshworks", location: "Chennai",  url: "https://freshworks.com/jobs",      tags: ["dbt", "Snowflake", "SQL"],          level: "mid"    },
  ],
  Cybersecurity: [
    { id: "cs1", title: "Security Analyst Intern",       company: "HCLTech",   location: "Pan India", url: "https://hcltech.com/careers",         tags: ["SIEM", "Network Security", "Linux"],       level: "intern" },
    { id: "cs2", title: "Cybersecurity Analyst",         company: "Wipro",     location: "Bangalore", url: "https://wipro.com/careers",            tags: ["OWASP", "Vulnerability", "SOC"],           level: "junior" },
    { id: "cs3", title: "Penetration Tester",            company: "Tata Elxsi",location: "Bangalore", url: "https://tataelxsi.com/careers",        tags: ["Kali Linux", "Burp Suite", "Metasploit"], level: "mid"    },
    { id: "cs4", title: "Senior Security Engineer",      company: "Razorpay",  location: "Bangalore", url: "https://razorpay.com/jobs",            tags: ["DevSecOps", "Zero Trust", "PKI"],          level: "senior" },
  ],
  Cloud: [
    { id: "cl1", title: "Cloud Intern",                  company: "TCS",       location: "Pan India", url: "https://tcs.com/careers",              tags: ["AWS", "Linux", "Networking"],              level: "intern" },
    { id: "cl2", title: "Cloud Engineer",                company: "Accenture", location: "Pan India", url: "https://accenture.com/in/careers",      tags: ["AWS", "Terraform", "Docker"],              level: "junior" },
    { id: "cl3", title: "AWS Solutions Architect",       company: "Infosys",   location: "Bangalore", url: "https://infosys.com/careers",           tags: ["AWS", "CloudFormation", "S3"],             level: "mid"    },
    { id: "cl4", title: "Senior Cloud Architect",        company: "Microsoft", location: "Hyderabad", url: "https://careers.microsoft.com",         tags: ["Azure", "Multi-Cloud", "Cost Optimization"],level: "senior" },
  ],
  Mobile: [
    { id: "mb1", title: "Android Intern",                company: "Meesho",    location: "Bangalore", url: "https://meesho.io/jobs",               tags: ["Kotlin", "Android Studio", "Firebase"],    level: "intern" },
    { id: "mb2", title: "Flutter Developer",             company: "PhonePe",   location: "Bangalore", url: "https://phonepe.com/jobs",              tags: ["Flutter", "Dart", "Firebase"],             level: "junior" },
    { id: "mb3", title: "iOS Developer",                 company: "Swiggy",    location: "Bangalore", url: "https://careers.swiggy.com",            tags: ["Swift", "SwiftUI", "Xcode"],               level: "mid"    },
    { id: "mb4", title: "Senior Mobile Engineer",        company: "Paytm",     location: "Noida",     url: "https://paytm.com/careers",             tags: ["React Native", "iOS", "Android"],          level: "senior" },
  ],
  "Data Science": [
    { id: "ds1", title: "Data Science Intern",           company: "Ola",       location: "Bangalore", url: "https://ola.com/careers",              tags: ["Python", "Pandas", "Statistics"],          level: "intern" },
    { id: "ds2", title: "Data Analyst",                  company: "Flipkart",  location: "Bangalore", url: "https://flipkartcareers.com",           tags: ["SQL", "Tableau", "Python"],                level: "junior" },
    { id: "ds3", title: "Data Scientist",                company: "Zomato",    location: "Gurugram",  url: "https://www.zomato.com/careers",        tags: ["Scikit-learn", "A/B Testing", "Python"],   level: "mid"    },
    { id: "ds4", title: "Senior Data Scientist",         company: "Google",    location: "Bangalore", url: "https://careers.google.com",            tags: ["ML", "Statistics", "BigQuery"],            level: "senior" },
  ],
  Blockchain: [
    { id: "bc1", title: "Blockchain Intern",             company: "Polygon",   location: "Bangalore / Remote", url: "https://polygon.technology/careers", tags: ["Solidity", "Ethereum", "Web3.js"],    level: "intern" },
    { id: "bc2", title: "Smart Contract Developer",      company: "CoinDCX",   location: "Bangalore", url: "https://coindcx.com/careers",           tags: ["Solidity", "Hardhat", "EVM"],              level: "junior" },
    { id: "bc3", title: "Blockchain Engineer",           company: "WazirX",    location: "Mumbai",    url: "https://wazirx.com/careers",            tags: ["Web3", "DeFi", "Solidity"],                level: "mid"    },
    { id: "bc4", title: "Senior Blockchain Architect",   company: "Infosys",   location: "Bangalore", url: "https://infosys.com/careers",           tags: ["Hyperledger", "Solidity", "Cloud"],        level: "senior" },
  ],
  "Full Stack": [
    { id: "fs1", title: "Full Stack Intern",             company: "Razorpay",  location: "Bangalore", url: "https://razorpay.com/jobs",             tags: ["React", "Node.js", "MongoDB"],             level: "intern" },
    { id: "fs2", title: "Full Stack Developer",          company: "Freshworks", location: "Chennai",  url: "https://freshworks.com/jobs",           tags: ["React", "Django", "PostgreSQL"],           level: "junior" },
    { id: "fs3", title: "MERN Stack Developer",          company: "Meesho",    location: "Bangalore", url: "https://meesho.io/jobs",                tags: ["MongoDB", "Express", "React", "Node.js"],  level: "mid"    },
    { id: "fs4", title: "Senior Full Stack Engineer",    company: "PhonePe",   location: "Bangalore", url: "https://phonepe.com/jobs",              tags: ["React", "Spring Boot", "AWS"],             level: "senior" },
  ],
  General: [
    { id: "g1", title: "SDE Intern",               company: "Ola",       location: "Bangalore", url: "https://ola.com/careers",           tags: ["DSA", "Java"],                level: "intern" },
    { id: "g2", title: "Junior Software Developer", company: "TCS",       location: "Pan India",  url: "https://tcs.com/careers",           tags: ["Java", "SQL", "OOP"],          level: "junior" },
    { id: "g3", title: "Full Stack Developer",      company: "Capgemini", location: "Pan India",  url: "https://capgemini.com/careers",     tags: ["React", "Node.js", "MongoDB"], level: "mid"    },
    { id: "g4", title: "Software Engineer",         company: "Accenture", location: "Pan India",  url: "https://accenture.com/in/careers",  tags: ["React", "Python", "SQL"],      level: "mid"    },
  ],
};

function getStaticJobs(pct, domain) {
  const pool = STATIC_JOBS[domain] ?? STATIC_JOBS.General;
  let filtered;
  if      (pct < 40) filtered = pool.filter(j => j.level === "intern");
  else if (pct < 60) filtered = pool.filter(j => ["intern", "junior"].includes(j.level));
  else if (pct < 80) filtered = pool.filter(j => ["junior", "mid"].includes(j.level));
  else               filtered = pool.filter(j => ["mid", "senior"].includes(j.level));
  return (filtered.length > 0 ? filtered : pool).slice(0, 3);
}

/* ─────────────────────────────────────────────
   KPI tile
───────────────────────────────────────────── */
function Kpi({ icon: Icon, label, value, sub, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.38 }}
      whileHover={{ y: -2 }}
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        borderRadius: 14,
        padding: "16px 14px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: -10, right: -10, width: 60, height: 60, borderRadius: "50%", background: `radial-gradient(circle, ${color}44 0%, transparent 70%)`, filter: "blur(10px)", pointerEvents: "none" }} />
      <div style={{ width: 32, height: 32, borderRadius: 9, marginBottom: 12, background: `${color}18`, border: `1px solid ${color}2a`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={15} style={{ color }} />
      </div>
      <p style={{ fontSize: "clamp(18px, 3.5vw, 26px)", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1, marginBottom: 3, letterSpacing: "-0.02em" }}>{value}</p>
      <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 2 }}>{label}</p>
      {sub && <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{sub}</p>}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Tip ticker (self-contained)
───────────────────────────────────────────── */
function TipTicker() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % TIPS.length), 4500);
    return () => clearInterval(t);
  }, []);
  return (
    <AnimatePresence mode="wait">
      <motion.p key={idx} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.25 }}
        style={{ fontSize: 12, color: "var(--tip-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {TIPS[idx]}
      </motion.p>
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────
   Empty state — shown when analysis === null
───────────────────────────────────────────── */
function EmptyState({ onNavigate }) {
  const { text, emoji, msg } = getGreeting(new Date().getHours());

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ minHeight: "100%", background: "var(--bg-base)", position: "relative" }}>

      {/* Ambient glows */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        <div style={{ position: "absolute", top: -80, left: -80, width: 320, height: 320, borderRadius: "50%", opacity: 0.12, background: "radial-gradient(circle, #4f8ef7, transparent 65%)", filter: "blur(70px)" }} />
        <div style={{ position: "absolute", bottom: 60, right: -60, width: 260, height: 260, borderRadius: "50%", opacity: 0.08, background: "radial-gradient(circle, #a855f7, transparent 65%)", filter: "blur(70px)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 480, margin: "0 auto", padding: "48px 20px 40px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>

        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          style={{ fontSize: "clamp(26px, 6vw, 38px)", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: 8 }}>
          {text} {emoji}
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}
          style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 40, lineHeight: 1.65 }}>
          {msg}
        </motion.p>

        {/* Big CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
          whileHover={{ y: -3, boxShadow: "0 20px 48px rgba(79,142,247,0.16)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate("analyze")}
          style={{ width: "100%", padding: "32px 24px", borderRadius: 20, cursor: "pointer", background: "var(--hero-bg)", border: "1px solid var(--hero-border)", position: "relative", overflow: "hidden", marginBottom: 16 }}
        >
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, var(--accent-blue) 40%, var(--accent-purple) 60%, transparent)", opacity: 0.6 }} />
          <div style={{ width: 56, height: 56, borderRadius: 16, margin: "0 auto 18px", background: "linear-gradient(135deg, var(--accent-blue), var(--accent-indigo))", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(79,142,247,0.28)" }}>
            <Upload size={24} color="#fff" />
          </div>
          <p style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8, letterSpacing: "-0.02em" }}>Analyze Your Resume</p>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: 20, maxWidth: 300, margin: "0 auto 20px" }}>
            Upload your resume + a job description. Get your skill match score, gap analysis, and personalized job recommendations.
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 22px", borderRadius: 12, background: "linear-gradient(135deg, var(--accent-blue), var(--accent-indigo))", fontSize: 14, fontWeight: 700, color: "#fff", boxShadow: "0 8px 22px rgba(79,142,247,0.26)" }}>
            Get Started <ArrowRight size={14} />
          </div>
        </motion.div>

        {/* Secondary */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}
          style={{ display: "flex", gap: 10, width: "100%", marginBottom: 28 }}>
          {[
            { label: "Browse Jobs",    icon: Briefcase, page: "jobs",     color: "var(--accent-purple)"  },
            { label: "Learning Paths", icon: Route,     page: "learning", color: "var(--accent-emerald)" },
          ].map(({ label, icon: Icon, page, color }) => (
            <button key={label} onClick={() => onNavigate(page)}
              style={{ flex: 1, padding: "14px 12px", borderRadius: 14, background: "var(--card-bg)", border: "1px solid var(--card-border)", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <Icon size={18} style={{ color }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>{label}</span>
            </button>
          ))}
        </motion.div>

        {/* Tip */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.38 }}
          style={{ width: "100%", padding: "12px 16px", borderRadius: 12, background: "var(--tip-bg)", border: "1px solid var(--tip-border)", display: "flex", alignItems: "center", gap: 8, overflow: "hidden" }}>
          <Zap size={13} style={{ color: "var(--accent-amber)", flexShrink: 0 }} />
          <TipTicker />
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Main Dashboard (shown after analysis)
───────────────────────────────────────────── */
export default function Dashboard({ analysis, loading, onNavigate }) {
  const [tipIdx,      setTipIdx]      = useState(0);
  const [now,         setNow]         = useState(new Date());
  const [liveJobs,    setLiveJobs]    = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTipIdx(i => (i + 1) % TIPS.length), 4500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  // Try Adzuna — fall back to static curated list if irrelevant
  useEffect(() => {
    if (!analysis?.job_domain) return;
    const roleMap = {
      Frontend:          "React Developer",
      Backend:           "Node.js Developer",
      DevOps:            "DevOps Engineer",
      "AI/ML":           "Machine Learning Engineer",
      "QA/Testing":      "QA Test Engineer",
      "Data Engineering":"Data Engineer",
      Cybersecurity:     "Cybersecurity Analyst",
      Cloud:             "Cloud Solutions Architect",
      Mobile:            "Mobile App Developer",
      "Data Science":    "Data Scientist",
      Blockchain:        "Blockchain Developer",
      "Full Stack":      "Full Stack Developer",
      General:           "Software Developer",
    };
    const role = roleMap[analysis.job_domain] ?? "Software Developer";
    const domainKeywords = {
      Frontend:           ["react", "frontend", "javascript", "ui", "css", "vue", "angular"],
      Backend:            ["backend", "node", "api", "server", "django", "fastapi", "express"],
      "AI/ML":            ["machine learning", "ml engineer", "ai", "data science", "nlp", "pytorch"],
      DevOps:             ["devops", "docker", "kubernetes", "ci/cd", "aws", "cloud", "terraform"],
      "QA/Testing":       ["qa", "test engineer", "selenium", "automation", "quality", "testing", "jira"],
      "Data Engineering": ["data engineer", "spark", "airflow", "etl", "pipeline", "kafka", "databricks"],
      Cybersecurity:      ["security", "cybersecurity", "penetration", "soc", "ethical hacking", "owasp"],
      Cloud:              ["cloud", "aws", "azure", "gcp", "solutions architect", "cloud native"],
      Mobile:             ["android", "ios", "flutter", "mobile", "kotlin", "swift", "react native"],
      "Data Science":     ["data scientist", "analytics", "pandas", "statistics", "visualization", "kaggle"],
      Blockchain:         ["blockchain", "solidity", "web3", "ethereum", "smart contract", "defi"],
      "Full Stack":       ["full stack", "fullstack", "mern", "mean", "end to end"],
      General:            ["software", "developer", "engineer", "sde", "programmer"],
    }[analysis.job_domain] ?? ["software"];

    setJobsLoading(true);
    fetchJobs(role, "India", 1, 3)
      .then(data => {
        const relevant = data.filter(j => {
          const text = [j.title ?? "", j.description ?? ""].join(" ").toLowerCase();
          return domainKeywords.some(kw => text.includes(kw));
        });
        setLiveJobs(relevant.length >= 2 ? relevant.slice(0, 3) : []);
      })
      .catch(() => setLiveJobs([]))
      .finally(() => setJobsLoading(false));
  }, [analysis?.job_domain]);

  if (loading) return <Skeleton />;

  // No analysis → onboarding empty state
  if (!analysis) return <EmptyState onNavigate={onNavigate} />;

  const matched     = analysis.matched_skills?.length ?? 0;
  const missing     = analysis.missing_skills?.length  ?? 0;
  const total       = matched + missing;
  const pct         = analysis.match_percentage ?? 0;
  const { text, emoji, msg } = getGreeting(now.getHours());
  const dateStr     = now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
  const isLiveJobs  = liveJobs.length > 0;
  const displayJobs = isLiveJobs ? liveJobs : getStaticJobs(pct, analysis.job_domain ?? "General");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ background: "var(--bg-base)", minHeight: "100%", position: "relative" }}>

      {/* Ambient glows */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        <div style={{ position: "absolute", top: -60, left: -60, width: 280, height: 280, borderRadius: "50%", opacity: 0.13, background: "radial-gradient(circle, #4f8ef7, transparent 65%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", bottom: 0, right: -40, width: 240, height: 240, borderRadius: "50%", opacity: 0.08, background: "radial-gradient(circle, #a855f7, transparent 65%)", filter: "blur(60px)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "20px 16px 32px" }}>

        {/* ═══ HERO ═══ */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          style={{ borderRadius: 20, overflow: "hidden", marginBottom: 14, background: "var(--hero-bg)", border: "1px solid var(--hero-border)", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.04, backgroundImage: "linear-gradient(rgba(128,100,50,1) 1px, transparent 1px), linear-gradient(90deg, rgba(128,100,50,1) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, var(--accent-blue) 40%, var(--accent-purple) 60%, transparent)", opacity: 0.7 }} />

          <div style={{ padding: "22px 20px 0" }}>
            {/* Badge + date */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, background: "rgba(79,142,247,0.14)", border: "1px solid rgba(79,142,247,0.28)", fontSize: 11, fontWeight: 600, color: "var(--accent-blue)" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-blue)", boxShadow: "0 0 5px var(--accent-blue)" }} />
                Live Dashboard
              </div>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{dateStr}</span>
            </div>

            {/* Text + ring */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "space-between", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 220 }}>
                <h1 style={{ fontSize: "clamp(22px, 5vw, 36px)", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 6 }}>
                  {text} {emoji}
                </h1>
                <p style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500, marginBottom: 8 }}>{msg}</p>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: 20, maxWidth: 400 }}>
                  Your profile is{" "}
                  <span style={{ fontWeight: 700, background: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    {pct}% aligned
                  </span>
                  {" "}with your target role.{" "}
                  <span style={{ color: "var(--accent-rose)", fontWeight: 600 }}>Close {missing} skill{missing !== 1 ? "s" : ""}</span>
                  {" "}to reach full readiness.
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <motion.button whileTap={{ scale: 0.96 }} onClick={() => onNavigate("analyze")}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 44, padding: "0 20px", borderRadius: 12, background: "linear-gradient(135deg, var(--accent-blue), var(--accent-indigo))", boxShadow: "0 8px 22px rgba(79,142,247,0.26)", fontSize: 13, fontWeight: 700, color: "white", cursor: "pointer", border: "none", flex: "1 1 140px", minWidth: 140 }}>
                    <RefreshCw size={14} /> Run New Analysis
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.96 }} onClick={() => onNavigate("learning")}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 44, padding: "0 20px", borderRadius: 12, background: "var(--card-bg)", border: "1px solid var(--card-border)", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", cursor: "pointer", flex: "1 1 140px", minWidth: 140 }}>
                    <Route size={14} /> Learning Path <ArrowRight size={12} />
                  </motion.button>
                </div>
              </div>

              {/* Score ring */}
              <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ position: "relative", width: 124, height: 124 }}>
                  <div style={{ position: "absolute", inset: -14, borderRadius: "50%", background: "radial-gradient(circle, rgba(79,142,247,0.18) 0%, transparent 70%)", filter: "blur(14px)", pointerEvents: "none" }} />
                  <CircularProgress value={pct} size={124} stroke={11} id="hero-ring" />
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <p style={{ fontSize: 26, fontWeight: 800, lineHeight: 1, marginBottom: 3, background: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                      {pct}%
                    </p>
                    <p style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>Match</p>
                    {analysis.job_domain && <p style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2, opacity: 0.7 }}>{analysis.job_domain}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tip ticker */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", marginTop: 20, background: "var(--tip-bg)", borderTop: "1px solid var(--tip-border)", overflow: "hidden" }}>
            <Zap size={12} style={{ color: "var(--accent-amber)", flexShrink: 0 }} />
            <TipTicker />
          </div>
        </motion.div>

        {/* ═══ KPI GRID ═══ */}
        <div className="dash-kpi" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          <Kpi icon={TrendingUp}   label="Job Readiness"  value={analysis.job_readiness ?? "—"}               sub={analysis.job_domain}    color="var(--accent-blue)"    delay={0}    />
          <Kpi icon={CheckCircle2} label="Skills Matched"  value={`${matched}`}                                sub={`of ${total} required`} color="var(--accent-emerald)" delay={0.07} />
          <Kpi icon={AlertCircle}  label="Skills Missing"  value={`${missing}`}                                sub="to be learned"          color="var(--accent-rose)"    delay={0.14} />
          <Kpi icon={Clock}        label="Time to Ready"   value={analysis.estimated_time_to_job_ready ?? "—"} sub="with focused effort"    color="var(--accent-amber)"   delay={0.21} />
        </div>

        {/* ═══ SKILL SNAPSHOT ═══ */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
          style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: 16, padding: "18px 16px", marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>Skill Snapshot</p>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>From your last analysis</p>
            </div>
            <button onClick={() => onNavigate("analyze")} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "var(--accent-blue)", background: "none", border: "none", cursor: "pointer", minHeight: 32 }}>
              Re-analyze <ArrowRight size={12} />
            </button>
          </div>

          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent-emerald)", marginBottom: 8 }}>✓ Matched</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
            {analysis.matched_skills?.map((s, i) => (
              <motion.span key={s} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.03 }}
                style={{ padding: "5px 11px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: "rgba(16,185,129,0.12)", color: "var(--accent-emerald)", border: "1px solid rgba(16,185,129,0.22)" }}>
                {s}
              </motion.span>
            ))}
          </div>

          <div style={{ height: 1, background: "var(--border)", marginBottom: 14 }} />

          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent-rose)", marginBottom: 8 }}>✕ Missing</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {analysis.missing_skills?.map((s, i) => (
              <motion.span key={s} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.45 + i * 0.03 }}
                style={{ padding: "5px 11px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: "rgba(244,63,94,0.12)", color: "var(--accent-rose)", border: "1px solid rgba(244,63,94,0.22)" }}>
                {s}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* ═══ CHARTS ═══ */}
        <div className="dash-charts" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14, marginBottom: 14 }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}>
            <AnalysisRadarChart analysis={analysis} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}>
            <AnalysisBarChart analysis={analysis} />
          </motion.div>
        </div>

        {/* Progress chart */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44 }}
          style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: 16, padding: "18px 16px", marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>Learning Progress</p>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Readiness score over time</p>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["1W","1M","3M"].map(t => (
                <button key={t} style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 8, background: "var(--card-bg)", border: "1px solid var(--card-border)", color: "var(--text-muted)", cursor: "pointer", minHeight: 30 }}>{t}</button>
              ))}
            </div>
          </div>
          <ProgressAreaChart gradientId="dashGradV3" height={180} analysis={analysis} />
        </motion.div>

        {/* ═══ JOBS ═══ */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.48 }} style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>🔍 Jobs for Your Profile</p>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {isLiveJobs
                  ? "Live openings — via Adzuna"
                  : `Curated for ${pct}% match · ${analysis.job_domain ?? "General"} roles`}
              </p>
            </div>
            <button onClick={() => onNavigate("jobs")}
              style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "var(--accent-blue)", background: "none", border: "none", cursor: "pointer", minHeight: 32, padding: "4px 0" }}>
              View all <ArrowRight size={12} />
            </button>
          </div>

          {/* Skeleton */}
          {jobsLoading && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ height: 72, borderRadius: 12, background: "var(--skeleton-base)", border: "1px solid var(--card-border)", backgroundImage: "linear-gradient(90deg, var(--skeleton-base) 0%, var(--skeleton-shine) 50%, var(--skeleton-base) 100%)", backgroundSize: "200% 100%", animation: "shimmer 1.8s infinite" }} />
              ))}
            </div>
          )}

          {/* Job cards */}
          {!jobsLoading && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {displayJobs.map((job, i) => {
                // Live job: compute skill match %
                let matchPct  = null;
                let matchColor = "var(--text-muted)";
                if (isLiveJobs && analysis.matched_skills?.length) {
                  const userSkills = analysis.matched_skills.map(s => s.toLowerCase());
                  const jobText    = [job.title ?? "", job.description ?? "", ...(job.highlights ?? [])].join(" ").toLowerCase();
                  const hits       = userSkills.filter(s => jobText.includes(s)).length;
                  matchPct         = Math.min(100, Math.round((hits / userSkills.length) * 100));
                  matchColor       = matchPct >= 70 ? "var(--accent-emerald)" : matchPct >= 40 ? "var(--accent-amber)" : "var(--accent-rose)";
                }

                // Static job: level badge
                const levelColor = { intern: "var(--accent-blue)", junior: "var(--accent-emerald)", mid: "var(--accent-amber)", senior: "var(--accent-purple)" }[job.level] ?? "var(--text-muted)";

                return (
                  <motion.a
                    key={job.id ?? i}
                    href={isLiveJobs ? undefined : job.url}
                    target={isLiveJobs ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    onClick={isLiveJobs ? () => onNavigate("jobs") : undefined}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    whileTap={{ scale: 0.99 }}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, background: "var(--job-card-bg)", border: "1px solid var(--job-card-border)", textDecoration: "none", cursor: "pointer" }}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0, background: "linear-gradient(135deg, rgba(79,142,247,0.16), rgba(168,85,247,0.12))", border: "1px solid var(--card-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🏢</div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{job.title}</p>
                      <p style={{ fontSize: 11, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{job.company} · {job.location}</p>
                      {/* Tags on static jobs */}
                      {!isLiveJobs && job.tags && (
                        <div style={{ display: "flex", gap: 4, marginTop: 5, flexWrap: "wrap" }}>
                          {job.tags.map(tag => (
                            <span key={tag} style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 6, background: "var(--tag-bg)", color: "var(--tag-color)" }}>{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Badge */}
                    {isLiveJobs && matchPct !== null ? (
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 999, flexShrink: 0, color: matchColor, background: matchColor + "18", border: `1px solid ${matchColor}30` }}>{matchPct}%</span>
                    ) : !isLiveJobs && job.level ? (
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 999, flexShrink: 0, color: levelColor, background: levelColor + "18", border: `1px solid ${levelColor}30`, textTransform: "capitalize" }}>{job.level}</span>
                    ) : null}

                    <ChevronRight size={13} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                  </motion.a>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* ═══ QUICK ACTIONS ═══ */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 10 }}>Quick Actions</p>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
            {[
              { label: "Analyze Resume", sub: "Upload & get insights", Icon: RefreshCw,  page: "analyze",  color: "var(--accent-blue)"    },
              { label: "View Reports",   sub: "Skill gap breakdown",   Icon: TrendingUp, page: "reports",  color: "var(--accent-purple)"  },
              { label: "Start Learning", sub: "Follow 8-week roadmap", Icon: Route,      page: "learning", color: "var(--accent-emerald)" },
            ].map(({ label, sub, Icon, page, color }) => (
              <motion.button key={label} onClick={() => onNavigate(page)} whileTap={{ scale: 0.96 }}
                style={{ flexShrink: 0, width: 158, padding: "16px 14px", borderRadius: 14, background: "var(--card-bg)", border: "1px solid var(--card-border)", cursor: "pointer", textAlign: "left", display: "flex", flexDirection: "column" }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, marginBottom: 12, background: color + "18", border: `1px solid ${color}28`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={15} style={{ color }} />
                </div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", marginBottom: 3 }}>{label}</p>
                <p style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.3 }}>{sub}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

      </div>

      <style>{`
        @media (min-width: 768px) {
          .dash-kpi    { grid-template-columns: repeat(4, 1fr) !important; }
          .dash-charts { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
      `}</style>
    </motion.div>
  );
}

function Skeleton() {
  return (
    <div style={{ padding: "20px 16px", maxWidth: 1200, margin: "0 auto" }}>
      {[260, 120, 160, 260].map((h, i) => (
        <div key={i} style={{ height: h, borderRadius: 16, marginBottom: 14, background: "var(--skeleton-base)", animation: "shimmer 1.8s infinite", backgroundImage: "linear-gradient(90deg, var(--skeleton-base) 0%, var(--skeleton-shine) 50%, var(--skeleton-base) 100%)", backgroundSize: "200% 100%" }} />
      ))}
    </div>
  );
}