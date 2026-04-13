import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, CheckCircle2, AlertCircle, Clock,
  TrendingUp, ArrowRight, RefreshCw, Route,
  Upload, Sparkles,
} from "lucide-react";

import CircularProgress from "../components/CircularProgress";
import { SkillsRadarChart, SkillsBarChart, ProgressAreaChart } from "../components/Charts";

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

function Kpi({ icon: Icon, label, value, sub, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.38 }}
      whileHover={{ y: -2 }}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        padding: "16px 14px",
        position: "relative", overflow: "hidden",
      }}
    >
      {/* glow blob */}
      <div style={{
        position: "absolute", top: -10, right: -10, width: 60, height: 60,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}44 0%, transparent 70%)`,
        filter: "blur(10px)", pointerEvents: "none",
      }} />
      <div style={{
        width: 32, height: 32, borderRadius: 9, marginBottom: 12,
        background: `${color}18`, border: `1px solid ${color}2a`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={15} style={{ color }} />
      </div>
      <p style={{ fontSize: "clamp(20px, 4vw, 26px)", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1, marginBottom: 3, letterSpacing: "-0.02em" }}>
        {value}
      </p>
      <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 2 }}>{label}</p>
      {sub && <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{sub}</p>}
    </motion.div>
  );
}

// ── Empty state shown when no analysis has been run yet ──
function EmptyHero({ onNavigate, greeting }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        borderRadius: 20, overflow: "hidden", marginBottom: 14,
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        position: "relative",
      }}
    >
      {/* top accent line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(79,142,247,0.6) 40%, rgba(168,85,247,0.6) 60%, transparent)" }} />

      <div style={{ padding: "28px 24px" }}>
        <h1 style={{ fontSize: "clamp(22px, 5vw, 34px)", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 8 }}>
          {greeting.text} {greeting.emoji}
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24, maxWidth: 420, lineHeight: 1.6 }}>
          Run your first skill-gap analysis to see how well your profile matches your target role.
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => onNavigate("analyze")}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              height: 44, padding: "0 22px", borderRadius: 12,
              background: "linear-gradient(135deg, #4f8ef7, #6366f1)",
              boxShadow: "0 8px 22px rgba(79,142,247,0.28)",
              fontSize: 13, fontWeight: 700, color: "white",
              cursor: "pointer", border: "none",
            }}
          >
            <Upload size={14} /> Upload Resume &amp; Analyze
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => onNavigate("learning")}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              height: 44, padding: "0 20px", borderRadius: 12,
              background: "var(--bg-card)",
              border: "1px solid var(--border-strong)",
              fontSize: 13, fontWeight: 600, color: "var(--text-secondary)",
              cursor: "pointer",
            }}
          >
            <Route size={14} /> Browse Learning Path <ArrowRight size={12} />
          </motion.button>
        </div>
      </div>

      {/* 3 step hint row */}
      <div style={{
        display: "flex", gap: 0,
        borderTop: "1px solid var(--border)",
        background: "var(--bg-card)",
      }}>
        {[
          { n: "1", label: "Upload your resume" },
          { n: "2", label: "Paste a job description" },
          { n: "3", label: "Get your skill gap report" },
        ].map(({ n, label }, i) => (
          <div key={n} style={{
            flex: 1, padding: "12px 14px",
            borderRight: i < 2 ? "1px solid var(--border)" : "none",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg, #4f8ef7, #a855f7)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 800, color: "#fff",
            }}>{n}</div>
            <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>{label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function Dashboard({ analysis, loading, onNavigate }) {
  const [tipIdx, setTipIdx] = useState(0);
  const [now,    setNow]    = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTipIdx(i => (i + 1) % TIPS.length), 4500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  if (loading) return <Skeleton />;

  const matched  = analysis?.matched_skills?.length ?? 0;
  const missing  = analysis?.missing_skills?.length ?? 0;
  const total    = matched + missing;
  const pct      = analysis?.match_percentage ?? 0;
  const greeting = getGreeting(now.getHours());
  const dateStr  = now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ background: "var(--bg-base)", minHeight: "100%", position: "relative" }}
    >
      {/* Ambient glows — subtle in light mode, visible in dark */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        <div style={{ position: "absolute", top: -60, left: -60, width: 280, height: 280, borderRadius: "50%", opacity: 0.12, background: "radial-gradient(circle, #4f8ef7, transparent 65%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", bottom: 0, right: -40, width: 240, height: 240, borderRadius: "50%", opacity: 0.08, background: "radial-gradient(circle, #a855f7, transparent 65%)", filter: "blur(60px)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "20px 16px 32px" }}>

        {/* ═══ HERO — show empty state if no analysis ═══ */}
        {!analysis ? (
          <EmptyHero onNavigate={onNavigate} greeting={greeting} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              borderRadius: 20, overflow: "hidden", marginBottom: 14,
              background: "linear-gradient(135deg, rgba(79,142,247,0.10) 0%, rgba(99,102,241,0.07) 50%, rgba(168,85,247,0.06) 100%)",
              border: "1px solid var(--border)",
              position: "relative",
            }}
          >
            {/* Grid texture */}
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.04, backgroundImage: "linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
            {/* Top accent line */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(79,142,247,0.6) 40%, rgba(168,85,247,0.6) 60%, transparent)" }} />

            <div style={{ padding: "22px 20px 0" }}>
              {/* Badge + date */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, background: "rgba(79,142,247,0.15)", border: "1px solid rgba(79,142,247,0.28)", fontSize: 11, fontWeight: 600, color: "#4f8ef7" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4f8ef7", boxShadow: "0 0 5px #4f8ef7" }} />
                  Live Dashboard
                </div>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{dateStr}</span>
              </div>

              {/* Text + ring */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "space-between", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <h1 style={{ fontSize: "clamp(22px, 5vw, 38px)", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 6 }}>
                    {greeting.text} {greeting.emoji}
                  </h1>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500, marginBottom: 8 }}>{greeting.msg}</p>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: 20, maxWidth: 400 }}>
                    Your profile is{" "}
                    <span style={{ fontWeight: 700, background: "linear-gradient(135deg,#4f8ef7,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                      {pct}% aligned
                    </span>
                    {" "}with your target role.{" "}
                    <span style={{ color: "#f43f5e", fontWeight: 600 }}>Close {missing} skill{missing !== 1 ? "s" : ""}</span>
                    {" "}to reach full readiness.
                  </p>

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <motion.button whileTap={{ scale: 0.96 }} onClick={() => onNavigate("analyze")}
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 44, padding: "0 20px", borderRadius: 12, background: "linear-gradient(135deg,#4f8ef7,#6366f1)", boxShadow: "0 8px 22px rgba(79,142,247,0.28)", fontSize: 13, fontWeight: 700, color: "white", cursor: "pointer", border: "none", flex: "1 1 140px", minWidth: 140 }}>
                      <RefreshCw size={14} /> Run New Analysis
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.96 }} onClick={() => onNavigate("learning")}
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 44, padding: "0 20px", borderRadius: 12, background: "var(--bg-card)", border: "1px solid var(--border-strong)", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", cursor: "pointer", flex: "1 1 140px", minWidth: 140 }}>
                      <Route size={14} /> Learning Path <ArrowRight size={12} />
                    </motion.button>
                  </div>
                </div>

                {/* Score ring */}
                <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ position: "relative", width: 124, height: 124 }}>
                    <div style={{ position: "absolute", inset: -14, borderRadius: "50%", background: "radial-gradient(circle, rgba(79,142,247,0.18) 0%, transparent 70%)", filter: "blur(14px)", pointerEvents: "none" }} />
                    <CircularProgress value={pct} size={124} stroke={11} id="hero-v3" />
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <p style={{ fontSize: 26, fontWeight: 800, lineHeight: 1, marginBottom: 3, background: "linear-gradient(135deg,#4f8ef7,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                        {pct}%
                      </p>
                      <p style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>Match</p>
                      {analysis?.job_domain && (
                        <p style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2, opacity: 0.7 }}>{analysis.job_domain}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tip ticker */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", marginTop: 20, background: "var(--bg-card)", borderTop: "1px solid var(--border)", overflow: "hidden" }}>
              <Zap size={12} style={{ color: "#f59e0b", flexShrink: 0 }} />
              <AnimatePresence mode="wait">
                <motion.p key={tipIdx} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.25 }}
                  style={{ fontSize: 12, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {TIPS[tipIdx]}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ═══ KPI GRID ═══ */}
        <div className="dash-kpi" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          <Kpi icon={TrendingUp}   label="Job Readiness"  value={analysis?.job_readiness ?? "—"}                sub={analysis?.job_domain ?? "Run analysis"}  color="#4f8ef7" delay={0}    />
          <Kpi icon={CheckCircle2} label="Skills Matched"  value={`${matched}`}                                 sub={total ? `of ${total} required` : "—"}     color="#10b981" delay={0.07} />
          <Kpi icon={AlertCircle}  label="Skills Missing"  value={`${missing}`}                                 sub={analysis ? "to be learned" : "—"}         color="#f43f5e" delay={0.14} />
          <Kpi icon={Clock}        label="Time to Ready"   value={analysis?.estimated_time_to_job_ready ?? "—"} sub={analysis ? "with focused effort" : "—"}   color="#f59e0b" delay={0.21} />
        </div>

        {/* ═══ SKILL SNAPSHOT — only when analysis exists ═══ */}
        {analysis && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: "18px 16px", marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>Skill Snapshot</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>From your last analysis</p>
              </div>
              <button onClick={() => onNavigate("analyze")} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "#4f8ef7", background: "none", border: "none", cursor: "pointer", minHeight: 32 }}>
                Re-analyze <ArrowRight size={12} />
              </button>
            </div>

            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#10b981", marginBottom: 8 }}>✓ Matched</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
              {analysis.matched_skills?.map((s, i) => (
                <motion.span key={s} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.03 }}
                  style={{ padding: "5px 11px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: "rgba(16,185,129,0.12)", color: "#10b981", border: "1px solid rgba(16,185,129,0.22)" }}>
                  {s}
                </motion.span>
              ))}
            </div>

            <div style={{ height: 1, background: "var(--border)", marginBottom: 14 }} />

            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#f43f5e", marginBottom: 8 }}>✕ Missing</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {analysis.missing_skills?.map((s, i) => (
                <motion.span key={s} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.45 + i * 0.03 }}
                  style={{ padding: "5px 11px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: "rgba(244,63,94,0.12)", color: "#f43f5e", border: "1px solid rgba(244,63,94,0.22)" }}>
                  {s}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══ CHARTS — always visible ═══ */}
        <div className="dash-charts" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14, marginBottom: 14 }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}>
            <SkillsRadarChart />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}>
            <SkillsBarChart />
          </motion.div>
        </div>

        {/* Progress chart */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44 }}
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: "18px 16px", marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>Learning Progress</p>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Readiness score over time</p>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["1W", "1M", "3M"].map(t => (
                <button key={t} style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 8, background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-muted)", cursor: "pointer", minHeight: 30 }}>{t}</button>
              ))}
            </div>
          </div>
          <ProgressAreaChart gradientId="dashGradV3" height={180} />
        </motion.div>

        {/* ═══ QUICK ACTIONS ═══ */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 10 }}>Quick Actions</p>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
            {[
              { label: "Analyze Resume", sub: "Upload & get insights",  Icon: RefreshCw,  page: "analyze",  color: "#4f8ef7" },
              { label: "View Reports",   sub: "Skill gap breakdown",     Icon: TrendingUp, page: "reports",  color: "#a855f7" },
              { label: "Start Learning", sub: "Follow 8-week roadmap",   Icon: Route,      page: "learning", color: "#10b981" },
            ].map(({ label, sub, Icon, page, color }) => (
              <motion.button key={label} onClick={() => onNavigate(page)} whileTap={{ scale: 0.96 }}
                style={{ flexShrink: 0, width: 158, padding: "16px 14px", borderRadius: 14, background: "var(--bg-card)", border: "1px solid var(--border)", cursor: "pointer", textAlign: "left", display: "flex", flexDirection: "column" }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, marginBottom: 12, background: `${color}18`, border: `1px solid ${color}28`, display: "flex", alignItems: "center", justifyContent: "center" }}>
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
      `}</style>
    </motion.div>
  );
}

function Skeleton() {
  return (
    <div style={{ padding: "20px 16px", maxWidth: 1200, margin: "0 auto" }}>
      {[260, 120, 160, 260].map((h, i) => (
        <div key={i} style={{
          height: h, borderRadius: 16, marginBottom: 14,
          background: "var(--bg-card)",
          backgroundImage: "linear-gradient(90deg, var(--bg-card) 0%, var(--bg-elevated) 50%, var(--bg-card) 100%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.8s infinite",
        }} />
      ))}
      <style>{`@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`}</style>
    </div>
  );
}