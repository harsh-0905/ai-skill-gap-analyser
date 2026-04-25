import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, MapPin, Clock, ExternalLink, Search,
  Wifi, Building2, TrendingUp, ChevronRight,
  Filter, Zap, X, ArrowRight, RefreshCw,
} from "lucide-react";
import { fetchJobs } from "../api";

// ── Helpers ───────────────────────────────────────────────────────────────────
function timeAgo(iso) {
  if (!iso) return "Recently";
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// Compare job text against user's matched skills → 0-100 score
function computeMatch(job, matchedSkills = []) {
  if (!matchedSkills.length) return null;
  const userSkills = matchedSkills.map(s => s.toLowerCase());
  const jobText = [job.title, job.description, ...(job.highlights ?? [])].join(" ").toLowerCase();
  const hits = userSkills.filter(s => jobText.includes(s)).length;
  return {
    pct:   Math.min(100, Math.round((hits / userSkills.length) * 100)),
    hits,
    total: userSkills.length,
  };
}

function matchColor(pct) {
  if (pct >= 70) return "#10b981";
  if (pct >= 40) return "#f59e0b";
  return "#f43f5e";
}

// Auto-detect role from analysis domain
function domainToRole(domain = "") {
  return ({
    Frontend:  "React Developer",
    Backend:   "Node.js Developer",
    DevOps:    "DevOps Engineer",
    "AI/ML":   "Machine Learning Engineer",
    General:   "Software Developer",
  })[domain] ?? "Software Developer";
}

const ROLE_PRESETS = [
  "React Developer", "Full Stack Developer", "Node.js Developer",
  "Frontend Developer", "Backend Developer", "DevOps Engineer",
  "Python Developer", "Data Scientist",
];

const LOCATIONS = ["India", "Remote", "Bengaluru", "Mumbai", "Delhi", "Pune", "Hyderabad"];
const TYPE_TABS  = ["All", "Full-time", "Internship", "Remote", "Contract"];

export default function Jobs({ analysis }) {
  const [jobs,       setJobs]       = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const [query,      setQuery]      = useState("");
  const [location,   setLocation]   = useState("India");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selected,   setSelected]   = useState(null);
  const [searched,   setSearched]   = useState(false);

  const matchedSkills = analysis?.matched_skills ?? [];

  // Auto-search when analysis domain is available
  useEffect(() => {
    if (analysis?.job_domain) {
      const role = domainToRole(analysis.job_domain);
      setQuery(role);
      doSearch(role, "India");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysis?.job_domain]);

  const doSearch = useCallback(async (q, loc) => {
    if (!q.trim()) return;
    setLoading(true); setError(null); setSelected(null); setSearched(true);
    try {
      const data = await fetchJobs(q.trim(), loc.trim() || "India");
      setJobs(data);
    } catch (e) {
      setError("Could not fetch jobs. Check your Adzuna credentials in .env or try again.");
      setJobs([]);
    } finally { setLoading(false); }
  }, []);

  const handleSearch = () => doSearch(query, location);

  // Filter client-side by type tab
  const filtered = jobs.filter(j => {
    if (typeFilter === "All")       return true;
    if (typeFilter === "Remote")    return j.remote;
    if (typeFilter === "Internship")return j.type === "Internship";
    if (typeFilter === "Contract")  return j.type === "Contract";
    return j.type === "Full-time" && !j.remote;
  });

  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100%", padding: "20px 16px 40px", maxWidth: 1200, margin: "0 auto" }}>

      {/* ── Page header ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#4f8ef7,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Briefcase size={18} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", lineHeight: 1 }}>Job Board</h1>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3 }}>Real listings powered by Adzuna · matched to your skill profile</p>
          </div>
        </div>

        {/* Analysis context pill */}
        {analysis && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", padding: "10px 14px", borderRadius: 12, marginTop: 12, background: "rgba(79,142,247,0.08)", border: "1px solid rgba(79,142,247,0.2)" }}>
            <Zap size={13} style={{ color: "#4f8ef7", flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "rgba(200,200,220,0.7)" }}>
              Auto-searched for <strong style={{ color: "#93c5fd" }}>{domainToRole(analysis.job_domain)}</strong> based on your resume analysis.
              {" "}<span style={{ color: "rgba(200,200,220,0.4)" }}>Each card shows your personal skill match %.</span>
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* ── Search bar ── */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>

          {/* Role input */}
          <div style={{ flex: "2 1 200px", display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "0 14px", height: 48 }}>
            <Search size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
            <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder="Role — e.g. React Developer"
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14, color: "var(--text-primary)", minWidth: 0 }} />
          </div>

          {/* Location select */}
          <div style={{ flex: "1 1 130px", display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "0 14px", height: 48 }}>
            <MapPin size={13} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
            <select value={location} onChange={e => setLocation(e.target.value)}
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14, color: "var(--text-primary)", cursor: "pointer", minWidth: 0 }}>
              {LOCATIONS.map(l => <option key={l} value={l} style={{ background: "#12121c" }}>{l}</option>)}
            </select>
          </div>

          {/* Search button */}
          <motion.button whileTap={{ scale: 0.96 }} onClick={handleSearch} disabled={loading}
            style={{ height: 48, padding: "0 22px", borderRadius: 12, border: "none", fontSize: 14, fontWeight: 700, color: "white", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8, flexShrink: 0, background: loading ? "rgba(79,142,247,0.45)" : "linear-gradient(135deg,#4f8ef7,#6366f1)", boxShadow: loading ? "none" : "0 8px 20px rgba(79,142,247,0.3)" }}>
            {loading ? <Spinner /> : <Search size={14} />}
            {loading ? "Searching…" : "Search"}
          </motion.button>
        </div>

        {/* Role quick-pick chips */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {ROLE_PRESETS.map(r => (
            <button key={r} onClick={() => { setQuery(r); doSearch(r, location); }}
              style={{ padding: "5px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)", background: query === r ? "rgba(79,142,247,0.2)" : "rgba(255,255,255,0.04)", color: query === r ? "#93c5fd" : "var(--text-secondary)", transition: "all 0.15s" }}>
              {r}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Type filter tabs ── */}
      {searched && !loading && (
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
          <Filter size={13} style={{ color: "var(--text-muted)" }} />
          {TYPE_TABS.map(t => {
            const count = t === "All" ? jobs.length
              : t === "Remote"     ? jobs.filter(j => j.remote).length
              : t === "Internship" ? jobs.filter(j => j.type === "Internship").length
              : t === "Contract"   ? jobs.filter(j => j.type === "Contract").length
              : jobs.filter(j => j.type === "Full-time" && !j.remote).length;
            return (
              <button key={t} onClick={() => setTypeFilter(t)}
                style={{ padding: "5px 14px", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer", background: typeFilter === t ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.04)", border: typeFilter === t ? "1px solid rgba(99,102,241,0.35)" : "1px solid rgba(255,255,255,0.08)", color: typeFilter === t ? "#c7d2fe" : "var(--text-secondary)" }}>
                {t} <span style={{ opacity: 0.55, fontSize: 11 }}>({count})</span>
              </button>
            );
          })}
          <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--text-muted)" }}>{filtered.length} listing{filtered.length !== 1 ? "s" : ""}</span>
        </div>
      )}

      {/* ── States ── */}
      {!searched && !loading && <EmptyState onSearch={doSearch} />}
      {loading && <LoadingSkeleton />}
      {error && !loading && <ErrorState msg={error} onRetry={handleSearch} />}
      {!loading && !error && searched && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 16px" }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>🔍</p>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>No jobs match this filter. Try "All" or a different role.</p>
        </div>
      )}

      {/* ── Main layout: list + detail panel ── */}
      {!loading && !error && filtered.length > 0 && (
        <div className="jobs-layout" style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>

          {/* Job list */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((job, i) => (
              <JobCard
                key={job.id}
                job={job}
                match={computeMatch(job, matchedSkills)}
                active={selected?.id === job.id}
                delay={i * 0.04}
                onClick={() => setSelected(selected?.id === job.id ? null : job)}
              />
            ))}
          </div>

          {/* Desktop detail panel */}
          <AnimatePresence>
            {selected && (
              <motion.div key={selected.id}
                initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.2 }}
                className="job-detail-desktop"
                style={{ width: 360, flexShrink: 0, position: "sticky", top: 16, maxHeight: "calc(100vh - 100px)", overflowY: "auto", borderRadius: 18, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", padding: 22 }}>
                <DetailPanel job={selected} match={computeMatch(selected, matchedSkills)} matchedSkills={matchedSkills} onClose={() => setSelected(null)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Mobile bottom drawer */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div key="overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              style={{ position: "fixed", inset: 0, zIndex: 55, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
              className="job-detail-mobile-overlay"
            />
            <motion.div key="drawer"
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              className="job-detail-mobile"
              style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 60, borderRadius: "20px 20px 0 0", background: "#12121c", border: "1px solid rgba(255,255,255,0.1)", padding: "8px 20px 32px", maxHeight: "85vh", overflowY: "auto" }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)", margin: "8px auto 16px" }} />
              <DetailPanel job={selected} match={computeMatch(selected, matchedSkills)} matchedSkills={matchedSkills} onClose={() => setSelected(null)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .jobs-layout { flex-direction: column; }
        .job-detail-desktop { display: none !important; }
        .job-detail-mobile, .job-detail-mobile-overlay { display: block; }
        @media (min-width: 900px) {
          .jobs-layout { flex-direction: row; }
          .job-detail-desktop { display: block !important; }
          .job-detail-mobile, .job-detail-mobile-overlay { display: none !important; }
        }
      `}</style>
    </div>
  );
}

// ── Job Card ──────────────────────────────────────────────────────────────────
function JobCard({ job, match, active, delay, onClick }) {
  const mc = match ? matchColor(match.pct) : null;
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.3 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      style={{ width: "100%", textAlign: "left", cursor: "pointer", display: "block", borderRadius: 14, padding: "14px 16px", background: active ? "rgba(79,142,247,0.1)" : "rgba(255,255,255,0.04)", border: active ? "1px solid rgba(79,142,247,0.3)" : "1px solid rgba(255,255,255,0.08)", transition: "all 0.15s" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>

        {/* Company logo fallback */}
        <div style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0, background: "linear-gradient(135deg, rgba(79,142,247,0.2), rgba(168,85,247,0.15))", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Building2 size={20} style={{ color: "rgba(200,200,220,0.3)" }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.2 }}>{job.title}</p>
            {match && (
              <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 999, flexShrink: 0, background: `${mc}18`, color: mc, border: `1px solid ${mc}30` }}>
                {match.pct}% match
              </span>
            )}
          </div>

          {/* Company */}
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>{job.company}</p>

          {/* Meta row */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--text-muted)" }}>
              <MapPin size={11} />{job.location}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--text-muted)" }}>
              <Clock size={11} />{timeAgo(job.posted)}
            </span>
            {job.salary && <span style={{ fontSize: 12, fontWeight: 600, color: "#6ee7b7" }}>{job.salary}</span>}
            {job.remote && (
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 999, background: "rgba(16,185,129,0.12)", color: "#6ee7b7", border: "1px solid rgba(16,185,129,0.22)" }}>
                <Wifi size={9} />Remote
              </span>
            )}
            <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 999, background: "rgba(255,255,255,0.05)", color: "var(--text-muted)", border: "1px solid rgba(255,255,255,0.08)" }}>
              {job.type}
            </span>
            {job.source === "Demo" && (
              <span style={{ fontSize: 10, color: "var(--text-muted)", opacity: 0.6 }}>Demo</span>
            )}
          </div>
        </div>

        <ChevronRight size={14} style={{ color: "var(--text-muted)", flexShrink: 0, marginTop: 4 }} />
      </div>
    </motion.button>
  );
}

// ── Detail panel ──────────────────────────────────────────────────────────────
function DetailPanel({ job, match, matchedSkills, onClose }) {
  const mc = match ? matchColor(match.pct) : null;
  return (
    <div>
      {/* Close */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Job Details</span>
        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "4px 12px", color: "var(--text-muted)", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
          <X size={11} /> Close
        </button>
      </div>

      {/* Title */}
      <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>{job.company}</p>
      <h2 style={{ fontSize: 19, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: 10 }}>{job.title}</h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--text-secondary)" }}><MapPin size={12} />{job.location}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--text-secondary)" }}><Clock size={12} />{timeAgo(job.posted)}</span>
        {job.remote && <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 999, background: "rgba(16,185,129,0.12)", color: "#6ee7b7", border: "1px solid rgba(16,185,129,0.22)" }}>Remote</span>}
        <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 999, background: "rgba(255,255,255,0.05)", color: "var(--text-muted)", border: "1px solid rgba(255,255,255,0.08)" }}>{job.type}</span>
      </div>

      {job.salary && (
        <p style={{ fontSize: 20, fontWeight: 800, color: "#6ee7b7", marginBottom: 16 }}>{job.salary}</p>
      )}

      {/* Match score card */}
      {match && (
        <div style={{ background: `${mc}12`, border: `1px solid ${mc}28`, borderRadius: 14, padding: "16px", marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: mc, marginBottom: 2 }}>Your Skill Match</p>
              <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{match.hits} of {match.total} skills match this role</p>
            </div>
            <p style={{ fontSize: 28, fontWeight: 800, color: mc, lineHeight: 1 }}>{match.pct}%</p>
          </div>
          {/* Animated bar */}
          <div style={{ height: 7, borderRadius: 999, background: "rgba(255,255,255,0.08)", overflow: "hidden", marginBottom: 8 }}>
            <motion.div
              initial={{ width: 0 }} animate={{ width: `${match.pct}%` }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              style={{ height: "100%", borderRadius: 999, background: `linear-gradient(90deg, ${mc}, ${mc}99)` }}
            />
          </div>
          <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
            {match.pct >= 70 ? "🟢 Strong match — apply now!" : match.pct >= 40 ? "🟡 Fair match — close a few gaps first" : "🔴 Low match — complete your learning path"}
          </p>
        </div>
      )}

      {/* Requirements with skill match highlighting */}
      {job.highlights?.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 10 }}>Requirements</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {job.highlights.map((h, i) => {
              const have = matchedSkills.some(s => h.toLowerCase().includes(s.toLowerCase()));
              return (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 10px", borderRadius: 9, background: have ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.03)", border: have ? "1px solid rgba(16,185,129,0.18)" : "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontSize: 12, color: have ? "#6ee7b7" : "rgba(200,200,220,0.3)", flexShrink: 0, marginTop: 1 }}>{have ? "✓" : "·"}</span>
                  <p style={{ fontSize: 12, color: have ? "#6ee7b7" : "var(--text-secondary)", lineHeight: 1.4 }}>{h}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Description */}
      {job.description && (
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>About the Role</p>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>{job.description}…</p>
        </div>
      )}

      <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 14 }}>
        Source: {job.source}
      </p>

      {/* Apply CTA */}
      <motion.a href={job.applyUrl} target="_blank" rel="noopener noreferrer" whileTap={{ scale: 0.97 }}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 50, borderRadius: 14, width: "100%", background: "linear-gradient(135deg,#4f8ef7,#6366f1)", boxShadow: "0 8px 24px rgba(79,142,247,0.32)", color: "white", fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
        <ExternalLink size={15} /> Apply Now
      </motion.a>
    </div>
  );
}

// ── Supporting components ─────────────────────────────────────────────────────
function EmptyState({ onSearch }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "48px 16px" }}>
      <p style={{ fontSize: 48, marginBottom: 16 }}>💼</p>
      <p style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>Find Jobs Matching Your Skills</p>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 24, maxWidth: 380, margin: "0 auto 24px" }}>
        Search for any role to see real listings with your personal skill match %. Run an analysis first for best results.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
        {["React Developer", "Full Stack Developer", "Node.js Developer"].map(r => (
          <button key={r} onClick={() => onSearch(r, "India")}
            style={{ padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", background: "rgba(79,142,247,0.12)", border: "1px solid rgba(79,142,247,0.25)", color: "#93c5fd" }}>
            {r}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function ErrorState({ msg, onRetry }) {
  return (
    <div style={{ textAlign: "center", padding: "40px 16px" }}>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>⚠ {msg}</p>
      <button onClick={onRetry} style={{ padding: "10px 20px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-primary)", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
        Try again
      </button>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{ height: 86, borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", backgroundImage: "linear-gradient(90deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 100%)", backgroundSize: "200% 100%", animation: "shimmer 1.8s infinite" }} />
      ))}
      <style>{`@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}`}</style>
    </div>
  );
}

function Spinner() {
  return (
    <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.25)", borderTopColor: "white", display: "inline-block" }} />
  );
}