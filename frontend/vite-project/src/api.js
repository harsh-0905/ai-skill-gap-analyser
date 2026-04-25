import axios from "axios";

// ─── FastAPI Backend ──────────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL || "https://ai-skill-gap-analyser-1.onrender.com";
const apiClient = axios.create({ baseURL: BASE_URL, timeout: 60000 });

export async function analyzeResume(resumeFile, jdFile) {
  const formData = new FormData();
  formData.append("resume", resumeFile);
  formData.append("jd",     jdFile);
  const res = await apiClient.post("/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function sendLearningPlan(email, analysis, profile) {
  const res = await apiClient.post("/send-plan", {
    email,
    name:     profile?.name ?? "",
    role:     profile?.role ?? "",
    analysis,
  });
  return res.data;
}

// ─── Adzuna Jobs API (proxied through FastAPI backend) ────────────────────────
// Keys live in backend .env only — never exposed to the browser.

// Country code map — Adzuna has separate endpoints per country
const COUNTRY_MAP = {
  india: "in", in: "in",
  uk: "gb", "united kingdom": "gb", gb: "gb",
  us: "us", usa: "us", "united states": "us",
  canada: "ca", ca: "ca",
  australia: "au", au: "au",
  remote: "in",
};

function getCountryCode(location = "") {
  const l = location.toLowerCase().trim();
  for (const [key, code] of Object.entries(COUNTRY_MAP)) {
    if (l.includes(key)) return code;
  }
  return "in";
}

/**
 * fetchJobs
 * Fetches real job listings via FastAPI /jobs proxy → Adzuna.
 *
 * @param {string} what      - job title / keywords  e.g. "React Developer"
 * @param {string} location  - location string       e.g. "India", "Bengaluru"
 * @param {number} page      - page number (1-based)
 * @param {number} results   - results per page (max 50)
 */
export async function fetchJobs(what = "Software Developer", location = "India", page = 1, results = 12) {
  try {
    const params = {
      what,
      where:            location.toLowerCase().includes("remote") ? undefined : location,
      page,
      results_per_page: results,
    };

    const res = await apiClient.get("/jobs", { params });
    const jobs = res.data?.results ?? [];

    if (jobs.length === 0) return getMockJobs(what);

    return jobs.map(normalizeAdzuna);
  } catch (err) {
    console.warn("fetchJobs failed, falling back to mock data:", err.message);
    return getMockJobs(what);
  }
}

function normalizeAdzuna(j) {
  const minSal = j.salary_min;
  const maxSal = j.salary_max;
  const salaryStr = minSal && maxSal
    ? `₹${(minSal / 100000).toFixed(1)}L – ₹${(maxSal / 100000).toFixed(1)}L`
    : minSal
    ? `From ₹${(minSal / 100000).toFixed(1)}L`
    : null;

  return {
    id:          j.id,
    title:       j.title,
    company:     j.company?.display_name ?? "Company",
    logo:        null,
    location:    j.location?.display_name ?? j.location?.area?.[1] ?? "India",
    type:        j.contract_time === "part_time" ? "Part-time"
               : j.contract_type === "contract"  ? "Contract"
               : "Full-time",
    remote:      /remote/i.test(j.title + " " + (j.description ?? "")),
    salary:      salaryStr,
    posted:      j.created,
    applyUrl:    j.redirect_url,
    description: j.description?.replace(/<[^>]+>/g, "").slice(0, 320) ?? "",
    highlights:  extractHighlights(j.description ?? ""),
    source:      "Adzuna",
    category:    j.category?.label ?? "",
  };
}

function extractHighlights(desc) {
  const clean = desc.replace(/<[^>]+>/g, " ");
  const lines = clean.split(/[.\n•\-]/).map(s => s.trim()).filter(s => s.length > 20 && s.length < 120);
  return lines.slice(0, 4);
}

// ─── Mock data (fallback when backend/Adzuna is unavailable) ──────────────────
function getMockJobs(what = "Developer") {
  const role = what.split(" ")[0];
  return [
    {
      id: "m1", title: `${what}`, company: "Razorpay",
      logo: null, location: "Bengaluru, Karnataka", type: "Full-time", remote: false,
      salary: "₹18L – ₹32L", posted: new Date(Date.now() - 1 * 86400000).toISOString(),
      applyUrl: "https://razorpay.com/jobs", source: "Demo",
      description: "Build scalable payment systems used by 8M+ businesses. Work with a top-tier engineering team on high-impact infra and product features.",
      highlights: ["3+ years experience", "React / Node.js", "Distributed systems", "REST + GraphQL APIs"],
      category: "IT Jobs",
    },
    {
      id: "m2", title: `Senior ${what}`, company: "Swiggy",
      logo: null, location: "Bengaluru, Karnataka", type: "Full-time", remote: false,
      salary: "₹28L – ₹48L", posted: new Date(Date.now() - 2 * 86400000).toISOString(),
      applyUrl: "https://swiggy.com/careers", source: "Demo",
      description: "Lead engineering on the world's largest food-delivery platform. Own architecture decisions and drive technical excellence across product teams.",
      highlights: ["5+ years experience", "Team leadership", "Microservices", "Kafka / Redis"],
      category: "IT Jobs",
    },
    {
      id: "m3", title: `${what} (Remote)`, company: "Postman",
      logo: null, location: "Remote — India", type: "Full-time", remote: true,
      salary: "₹20L – ₹38L", posted: new Date(Date.now() - 1 * 86400000).toISOString(),
      applyUrl: "https://postman.com/jobs", source: "Demo",
      description: "Help build the world's leading API platform. Work remotely with a global team of 900+ engineers solving real-world developer experience problems.",
      highlights: ["React + TypeScript", "Node.js", "GraphQL", "AWS Lambda"],
      category: "IT Jobs",
    },
    {
      id: "m4", title: `${role} Intern`, company: "CRED",
      logo: null, location: "Bengaluru, Karnataka", type: "Internship", remote: false,
      salary: "₹60K – ₹90K/month", posted: new Date(Date.now() - 3 * 86400000).toISOString(),
      applyUrl: "https://cred.club/careers", source: "Demo",
      description: "6-month internship with direct mentorship from senior engineers. Real product ownership from day one in a fast-paced fintech environment.",
      highlights: ["Fresher / 0–1 year", "JavaScript basics", "React", "CS fundamentals"],
      category: "IT Jobs",
    },
    {
      id: "m5", title: `${what}`, company: "Zepto",
      logo: null, location: "Mumbai, Maharashtra", type: "Full-time", remote: false,
      salary: "₹22L – ₹40L", posted: new Date(Date.now() - 2 * 86400000).toISOString(),
      applyUrl: "https://zepto.com/careers", source: "Demo",
      description: "Join India's fastest-growing quick-commerce startup. Build high-throughput systems serving millions of real-time orders across 10+ cities.",
      highlights: ["3+ years experience", "TypeScript", "System design", "PostgreSQL"],
      category: "IT Jobs",
    },
    {
      id: "m6", title: `${what} — Startup`, company: "Setu (Pine Labs)",
      logo: null, location: "Bengaluru, Karnataka", type: "Full-time", remote: false,
      salary: "₹15L – ₹28L", posted: new Date(Date.now() - 4 * 86400000).toISOString(),
      applyUrl: "https://setu.co/careers", source: "Demo",
      description: "Build open fintech infrastructure powering payments for India's top banks and fintechs. Small team, high ownership, massive impact.",
      highlights: ["2+ years experience", "Node.js", "PostgreSQL", "Payment APIs"],
      category: "IT Jobs",
    },
    {
      id: "m7", title: `Junior ${what}`, company: "LambdaTest",
      logo: null, location: "Noida, UP", type: "Full-time", remote: true,
      salary: "₹8L – ₹15L", posted: new Date(Date.now() - 3 * 86400000).toISOString(),
      applyUrl: "https://lambdatest.com/careers", source: "Demo",
      description: "Work on a globally used cloud testing platform. Fresher-friendly team with strong mentorship culture and structured onboarding.",
      highlights: ["0–2 years experience", "JavaScript", "React", "Good communication"],
      category: "IT Jobs",
    },
    {
      id: "m8", title: `${what} Lead`, company: "PhonePe",
      logo: null, location: "Bengaluru, Karnataka", type: "Full-time", remote: false,
      salary: "₹38L – ₹65L", posted: new Date(Date.now() - 1 * 86400000).toISOString(),
      applyUrl: "https://phonepe.com/careers", source: "Demo",
      description: "Lead a team building India's #1 payments app used by 500M+ users. Drive architecture, mentor engineers, and ship at massive scale.",
      highlights: ["7+ years experience", "Tech leadership", "High-scale systems", "Java / Go"],
      category: "IT Jobs",
    },
  ];
}