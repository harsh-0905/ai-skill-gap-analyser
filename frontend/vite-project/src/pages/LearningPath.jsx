import { motion } from "framer-motion";
import { Clock, BookOpen, ArrowRight, CheckCircle2, Circle, Flame } from "lucide-react";

import RecommendationCard from "../components/RecommendationCard";
import { DUMMY_ANALYSIS, LEARNING_TIMELINE } from "../data/constants";

const DIFFICULTY = {
  Docker:  { label: "Beginner",     color: "#10b981", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.25)"  },
  GraphQL: { label: "Intermediate", color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.25)"  },
  Redis:   { label: "Intermediate", color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.25)"  },
  AWS:     { label: "Advanced",     color: "#f43f5e", bg: "rgba(244,63,94,0.12)",   border: "rgba(244,63,94,0.25)"   },
};

export default function LearningPath({ analysis, onNavigate }) {
  // Use real analysis data if available, else fall back to dummy
  const recommendations = analysis?.recommendations ?? DUMMY_ANALYSIS.recommendations;
  const timeline = analysis
    ? Object.entries(recommendations).map(([skill], i) => {
        const weeks = ["Week 1–2", "Week 2–3", "Week 3–4", "Week 4–8"];
        const descs = {
          aws:     "EC2, S3, Lambda, IAM, and cloud deployments",
          docker:  "Containers, volumes, networking basics",
          graphql: "Schema design, resolvers, Apollo client",
          redis:   "Caching strategies, pub/sub, data types",
        };
        return {
          week: weeks[i] ?? `Week ${i + 1}`,
          skill,
          desc: descs[skill.toLowerCase()] ?? `Master ${skill} fundamentals`,
        };
      })
    : LEARNING_TIMELINE;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8"
    >
      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Learning Path
          </h1>
          <div className="px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ background: "rgba(168,85,247,0.15)", color: "#c084fc", border: "1px solid rgba(168,85,247,0.25)" }}>
            {timeline.length} skills
          </div>
        </div>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Personalized roadmap to close your skill gaps
        </p>
      </motion.div>

      {/* ── Resource Cards ── */}
      <div>
        <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--text-secondary)" }}>
          📚 Recommended Resources
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Object.entries(recommendations).map(([skill, data], i) => (
            <motion.div
              key={skill}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <RecommendationCard skill={skill} data={data} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Timeline ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        {/* Timeline header */}
        <div className="px-6 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                8-Week Learning Roadmap
              </h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                Follow this sequence for fastest results
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
              style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.2)" }}>
              <Flame size={12} style={{ color: "#fbbf24" }} />
              <span className="text-xs font-semibold" style={{ color: "#fbbf24" }}>8 weeks total</span>
            </div>
          </div>
        </div>

        {/* Timeline rows */}
        <div className="p-6 space-y-0">
          {timeline.map((item, i) => {
            const diff = DIFFICULTY[item.skill] ?? DIFFICULTY["Docker"];
            const isLast = i === timeline.length - 1;
            return (
              <motion.div
                key={item.skill}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.1, duration: 0.4 }}
                className="flex gap-5 relative"
              >
                {/* Timeline spine */}
                <div className="flex flex-col items-center shrink-0 w-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.1, type: "spring" }}
                    className="w-9 h-9 rounded-xl flex items-center justify-center z-10 shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${diff.color}22, ${diff.color}11)`,
                      border: `1px solid ${diff.color}40`,
                    }}
                  >
                    <span className="text-sm font-bold" style={{ color: diff.color }}>{i + 1}</span>
                  </motion.div>
                  {!isLast && (
                    <div className="flex-1 w-px mt-2 mb-0"
                      style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)", minHeight: 32 }} />
                  )}
                </div>

                {/* Content card */}
                <div className={`flex-1 pb-6 ${isLast ? "" : ""}`}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="rounded-xl p-4 group cursor-default"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                          {item.skill}
                        </span>
                        {/* Missing badge */}
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: "rgba(244,63,94,0.12)", color: "#fda4af", border: "1px solid rgba(244,63,94,0.22)" }}>
                          MISSING
                        </span>
                        {/* Difficulty badge */}
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
                          style={{ background: diff.bg, color: diff.color, border: `1px solid ${diff.border}` }}>
                          {diff.label}
                        </span>
                      </div>
                      {/* Week label */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Clock size={11} style={{ color: "var(--text-muted)" }} />
                        <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                          {item.week}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
                      {item.desc}
                    </p>

                    {/* Footer row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <BookOpen size={11} style={{ color: "var(--text-muted)" }} />
                        <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                          {recommendations[item.skill]?.certificate_name ?? "Course available"}
                        </span>
                      </div>
                      <motion.a
                        href={recommendations[item.skill]?.youtube_link ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ x: 2 }}
                        className="flex items-center gap-1 text-[11px] font-semibold transition-colors"
                        style={{ color: "#4f8ef7" }}
                        onClick={e => { if (!recommendations[item.skill]?.youtube_link) e.preventDefault(); }}
                      >
                        Start Now <ArrowRight size={11} />
                      </motion.a>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="px-6 py-4 flex items-center justify-between"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(79,142,247,0.04)" }}>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} style={{ color: "#10b981" }} />
            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Complete all steps to become fully job-ready
            </span>
          </div>
          {onNavigate && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate("analyze")}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl"
              style={{ background: "linear-gradient(135deg, #4f8ef7, #6366f1)", color: "white" }}
            >
              Re-analyze <ArrowRight size={11} />
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}