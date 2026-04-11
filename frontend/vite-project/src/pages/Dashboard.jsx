import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, CheckCircle2, AlertCircle, Clock, TrendingUp, ArrowRight, RefreshCw, Route } from "lucide-react";

import CircularProgress  from "../components/CircularProgress";
import StatCard          from "../components/StatCard";
import Skeleton          from "../components/Skeleton";
import { SkillsRadarChart, SkillsBarChart, ProgressAreaChart } from "../components/Charts";

// ── Time-aware greeting ───────────────────────────────────────────────────────
function getGreeting(hour) {
  if (hour >= 5  && hour < 12) return { text: "Good morning",   emoji: "☀️",  msg: "Start your day with a quick skill check!" };
  if (hour >= 12 && hour < 14) return { text: "Good afternoon", emoji: "🌤️", msg: "Fuel up and keep pushing toward your goals." };
  if (hour >= 14 && hour < 17) return { text: "Good afternoon", emoji: "⚡", msg: "Peak focus hours — great time to learn something new." };
  if (hour >= 17 && hour < 20) return { text: "Good evening",   emoji: "🌇", msg: "Great work today. Review your progress?" };
  if (hour >= 20 && hour < 23) return { text: "Good evening",   emoji: "🌙", msg: "Night grind? Respect. Let's close those skill gaps." };
  return                               { text: "Up late?",       emoji: "🦉", msg: "True developers never sleep. Let's keep building." };
}

const TIPS = [
  "🔥 AI & ML skills are the #1 demand in 2025 job listings",
  "⚡ Docker + Kubernetes combo unlocks DevOps roles at 2x salary",
  "🚀 TypeScript is now required in 80% of Frontend job descriptions",
  "🧠 LLM fine-tuning and RAG are the hottest emerging skills right now",
  "☁️ AWS Solutions Architect is the most in-demand cloud cert globally",
  "💡 GraphQL adoption is up 60% — a must-have for senior API roles",
];

export default function Dashboard({ analysis, loading, onNavigate }) {
  const [tipIndex, setTipIndex] = useState(0);
  const [now,      setNow]      = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTipIndex(i => (i + 1) % TIPS.length), 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  if (loading) return <DashboardSkeleton />;

  const matched  = analysis?.matched_skills?.length ?? 0;
  const missing  = analysis?.missing_skills?.length ?? 0;
  const total    = matched + missing;
  const matchPct = analysis?.match_percentage ?? 0;
  const hour = now.getHours();
  const { text: greetingText, emoji, msg: greetingMsg } = getGreeting(hour);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-full"
      style={{ background: "var(--bg-base)" }}
    >
      {/* ── Ambient background glows ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #4f8ef7, transparent 65%)", filter: "blur(80px)" }} />
        <div className="absolute top-1/2 -right-32 w-80 h-80 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #a855f7, transparent 65%)", filter: "blur(80px)" }} />
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #6366f1, transparent 65%)", filter: "blur(80px)" }} />
      </div>

      <div className="relative z-10 p-6 lg:p-8 max-w-7xl mx-auto space-y-6">

        {/* ── Hero Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(79,142,247,0.15) 0%, rgba(99,102,241,0.12) 40%, rgba(168,85,247,0.1) 100%)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {/* Grid pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.07]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }} />

          {/* Gradient border top */}
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(79,142,247,0.5), rgba(168,85,247,0.5), transparent)" }} />

          <div className="relative p-8 flex flex-col lg:flex-row items-start lg:items-center gap-8">
            {/* Left — text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background: "rgba(79,142,247,0.15)", border: "1px solid rgba(79,142,247,0.25)", color: "#93c5fd" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  Live Dashboard
                </div>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
                </span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold mb-1" style={{ letterSpacing: "-0.02em" }}>
                <span style={{ color: "var(--text-primary)" }}>{greetingText} </span>
                <span>{emoji}</span>
              </h1>

              <p className="text-sm font-medium mb-3" style={{ color: "rgba(200,200,220,0.45)" }}>
                {greetingMsg}
              </p>

              <p className="text-sm mb-5 max-w-lg leading-relaxed" style={{ color: "rgba(200,200,220,0.55)" }}>
                Your profile is{" "}
                <span className="font-semibold" style={{
                  background: "linear-gradient(135deg, #4f8ef7, #a855f7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                  {matchPct}% aligned
                </span>{" "}
                with your target role. Close{" "}
                <span style={{ color: "#fda4af", fontWeight: 600 }}>{missing} skill{missing !== 1 ? "s" : ""}</span>{" "}
                to reach full job readiness.
              </p>

              <div className="flex flex-wrap gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onNavigate("analyze")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #4f8ef7, #6366f1)", boxShadow: "0 8px 24px rgba(79,142,247,0.3)" }}
                >
                  <RefreshCw size={14} />
                  Run New Analysis
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onNavigate("learning")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    color: "rgba(220,220,240,0.8)",
                  }}
                >
                  <Route size={14} />
                  View Learning Path
                  <ArrowRight size={13} />
                </motion.button>
              </div>
            </div>

            {/* Right — score ring */}
            <div className="relative flex items-center justify-center shrink-0">
              <div className="absolute inset-0 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(79,142,247,0.2) 0%, transparent 70%)", filter: "blur(24px)" }} />
              <div className="relative w-40 h-40 flex items-center justify-center">
                <CircularProgress value={matchPct} size={160} stroke={12} id="hero" />
                <div className="absolute text-center">
                  <p className="text-4xl font-bold tabular-nums" style={{
                    background: "linear-gradient(135deg, #4f8ef7, #a855f7)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}>
                    {matchPct}%
                  </p>
                  <p className="text-xs font-medium mt-0.5" style={{ color: "var(--text-muted)" }}>Match Score</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "rgba(200,200,220,0.35)" }}>
                    {analysis?.job_domain}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Ticker bar */}
          <div className="relative px-8 py-3 flex items-center gap-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.2)" }}>
            <div className="flex items-center gap-1.5 shrink-0">
              <Zap size={11} style={{ color: "#fbbf24" }} />
              <span className="text-[11px] font-semibold" style={{ color: "#fbbf24" }}>Tip</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={tipIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className="text-[11px]"
                style={{ color: "rgba(200,200,220,0.5)" }}
              >
                {TIPS[tipIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── KPI cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={TrendingUp}
            label="Job Readiness"
            value={analysis?.job_readiness ?? "—"}
            sub={analysis?.job_domain}
            color="#4f8ef7"
            delay={0}
          />
          <StatCard
            icon={CheckCircle2}
            label="Skills Matched"
            value={`${matched}`}
            sub={`of ${total} required`}
            color="#10b981"
            delay={0.08}
          />
          <StatCard
            icon={AlertCircle}
            label="Skills Missing"
            value={`${missing}`}
            sub="need to be learned"
            color="#f43f5e"
            delay={0.16}
          />
          <StatCard
            icon={Clock}
            label="Time to Ready"
            value={analysis?.estimated_time_to_job_ready ?? "—"}
            sub="with focused effort"
            color="#f59e0b"
            delay={0.24}
          />
        </div>

        {/* ── Skill snapshot ── */}
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Skill Snapshot</h3>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>From your last analysis</p>
              </div>
              <button
                onClick={() => onNavigate("analyze")}
                className="flex items-center gap-1.5 text-xs font-medium hover:text-blue-300 transition-colors"
                style={{ color: "#4f8ef7" }}
              >
                Re-analyze <ArrowRight size={12} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2.5" style={{ color: "#6ee7b7" }}>
                  ✓ Matched Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {analysis.matched_skills?.map((s, i) => (
                    <motion.span
                      key={s}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.35 + i * 0.04 }}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold"
                      style={{ background: "rgba(16,185,129,0.1)", color: "#6ee7b7", border: "1px solid rgba(16,185,129,0.2)" }}
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>
              </div>

              <div className="h-px" style={{ background: "rgba(255,255,255,0.06)" }} />

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2.5" style={{ color: "#fda4af" }}>
                  ✕ Missing Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {analysis.missing_skills?.map((s, i) => (
                    <motion.span
                      key={s}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.04 }}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold"
                      style={{ background: "rgba(244,63,94,0.1)", color: "#fda4af", border: "1px solid rgba(244,63,94,0.2)" }}
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Charts ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
            <SkillsRadarChart />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.42 }}>
            <SkillsBarChart />
          </motion.div>
        </div>

        {/* ── Progress chart ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl p-6"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Learning Progress</h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Readiness score over time</p>
            </div>
            <div className="flex gap-1.5">
              {["1W", "1M", "3M"].map(t => (
                <button key={t} className="text-[11px] px-2.5 py-1 rounded-lg font-medium transition-colors"
                  style={{ background: "rgba(255,255,255,0.05)", color: "rgba(200,200,220,0.4)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <ProgressAreaChart gradientId="dashGrad" height={200} />
        </motion.div>

        {/* ── Quick action cards ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.58 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            { label: "Analyze Resume",    sub: "Upload & get instant insights",  icon: RefreshCw, page: "analyze",  color: "#4f8ef7" },
            { label: "View Reports",      sub: "Detailed skill gap breakdown",    icon: TrendingUp, page: "reports", color: "#a855f7" },
            { label: "Start Learning",    sub: "Follow your 8-week roadmap",      icon: Route,     page: "learning", color: "#10b981" },
          ].map(({ label, sub, icon: Icon, page, color }) => (
            <motion.button
              key={label}
              onClick={() => onNavigate(page)}
              whileHover={{ y: -3, boxShadow: `0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px ${color}22` }}
              whileTap={{ scale: 0.98 }}
              className="p-5 rounded-2xl text-left group transition-all"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${color}18`, border: `1px solid ${color}28` }}>
                <Icon size={16} style={{ color }} />
              </div>
              <p className="text-sm font-semibold mb-0.5 group-hover:text-white transition-colors"
                style={{ color: "rgba(220,220,240,0.8)" }}>{label}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{sub}</p>
            </motion.button>
          ))}
        </motion.div>

      </div>
    </motion.div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <Skeleton className="h-52 w-full" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
      </div>
      <Skeleton className="h-40 w-full" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-72" />)}
      </div>
      <Skeleton className="h-56 w-full" />
    </div>
  );
}