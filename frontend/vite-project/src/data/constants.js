export const DUMMY_ANALYSIS = {
  match_percentage: 87.5,
  matched_skills: ["JavaScript", "React", "Node.js", "TypeScript", "REST APIs", "Git", "CSS", "HTML"],
  missing_skills: ["AWS", "Docker", "GraphQL", "Redis"],
  job_readiness: "87%",
  estimated_time_to_job_ready: "2 weeks",
  job_domain: "Frontend Engineering",
  recommendations: {
    AWS:     { youtube_title: "AWS Full Course 2024 – Zero to Hero",        youtube_link: "https://youtube.com", certificate_name: "AWS Solutions Architect Associate", certificate_link: "https://coursera.org", time_to_learn: "4 weeks" },
    Docker:  { youtube_title: "Docker & Kubernetes – Full Practical Guide", youtube_link: "https://youtube.com", certificate_name: "Docker Certified Associate",        certificate_link: "https://udemy.com",   time_to_learn: "2 weeks" },
    GraphQL: { youtube_title: "GraphQL Crash Course with Node.js",          youtube_link: "https://youtube.com", certificate_name: "Apollo GraphQL Developer",          certificate_link: "https://coursera.org", time_to_learn: "1 week"  },
    Redis:   { youtube_title: "Redis in 100 Seconds + Full Tutorial",       youtube_link: "https://youtube.com", certificate_name: "Redis University Certification",    certificate_link: "https://redis.com",    time_to_learn: "1 week"  },
  },
};

export const RADAR_DATA = [
  { skill: "JavaScript", resume: 95, jd: 90 },
  { skill: "React",      resume: 90, jd: 95 },
  { skill: "Node.js",    resume: 80, jd: 85 },
  { skill: "TypeScript", resume: 70, jd: 80 },
  { skill: "AWS",        resume: 20, jd: 75 },
  { skill: "Docker",     resume: 15, jd: 70 },
  { skill: "CSS",        resume: 85, jd: 80 },
  { skill: "Git",        resume: 90, jd: 85 },
];

export const BAR_DATA = [
  { category: "Languages",  matched: 3, missing: 1 },
  { category: "Frameworks", matched: 2, missing: 1 },
  { category: "Cloud",      matched: 0, missing: 2 },
  { category: "Tools",      matched: 3, missing: 1 },
  { category: "Databases",  matched: 1, missing: 1 },
];

export const LINE_DATA = [
  { week: "W1", score: 45 },
  { week: "W2", score: 52 },
  { week: "W3", score: 61 },
  { week: "W4", score: 68 },
  { week: "W5", score: 72 },
  { week: "W6", score: 80 },
  { week: "W7", score: 87 },
];

export const REPORTS_TABLE = [
  { skill: "AWS",        status: "Missing", priority: "High",   time: "4 weeks", category: "Cloud"     },
  { skill: "Docker",     status: "Missing", priority: "High",   time: "2 weeks", category: "DevOps"    },
  { skill: "GraphQL",    status: "Missing", priority: "Medium", time: "1 week",  category: "API"       },
  { skill: "Redis",      status: "Missing", priority: "Low",    time: "1 week",  category: "Database"  },
  { skill: "React",      status: "Matched", priority: "—",      time: "—",       category: "Framework" },
  { skill: "Node.js",    status: "Matched", priority: "—",      time: "—",       category: "Runtime"   },
  { skill: "TypeScript", status: "Matched", priority: "—",      time: "—",       category: "Language"  },
  { skill: "JavaScript", status: "Matched", priority: "—",      time: "—",       category: "Language"  },
];

export const LEARNING_TIMELINE = [
  { week: "Week 1–2", skill: "Docker",  desc: "Containers, volumes, networking basics"  },
  { week: "Week 2–3", skill: "GraphQL", desc: "Schema design, resolvers, Apollo client" },
  { week: "Week 3–4", skill: "Redis",   desc: "Caching strategies, pub/sub, data types" },
  { week: "Week 4–8", skill: "AWS",     desc: "EC2, S3, Lambda, IAM, and more"          },
];

export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard",      icon: "⊞" },
  { id: "analyze",   label: "Analyze Resume", icon: "◈" },
  { id: "reports",   label: "Reports",        icon: "◉" },
  { id: "learning",  label: "Learning Path",  icon: "◎" },
  { id: "profile",   label: "Profile",        icon: "⊙" },
  { id: "settings",  label: "Settings",       icon: "⚙" },
];