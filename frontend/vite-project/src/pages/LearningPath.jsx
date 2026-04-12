import { motion } from "framer-motion";
import { Clock, BookOpen, ArrowRight, CheckCircle2, Flame } from "lucide-react";

import RecommendationCard from "../components/RecommendationCard";
import { LEARNING_TIMELINE } from "../data/constants";

// Parse "N weeks" or "N days" strings into a number of weeks
function parseWeeks(timeStr = "") {
  const str = timeStr.toLowerCase().trim();
  const num = parseFloat(str);
  if (isNaN(num)) return 1;
  if (str.includes("day")) return Math.ceil(num / 7);
  return num; // already weeks
}

// Calculate total weeks from all missing skill times
function calcTotalWeeks(recommendations) {
  return Object.values(recommendations).reduce((sum, data) => {
    return sum + parseWeeks(data?.time_to_learn);
  }, 0);
}

// Build week labels dynamically based on cumulative time
function buildTimeline(recommendations) {
  let cursor = 1;
  return Object.entries(recommendations).map(([skill, data]) => {
    const duration = parseWeeks(data?.time_to_learn ?? "1 week");
    const start = cursor;
    const end   = cursor + duration - 1;
    cursor      = end + 1;

    const weekLabel = duration < 1
      ? `Week ${start} (a few days)`
      : start === end
      ? `Week ${start}`
      : `Week ${start}–${end}`;

    return {
      skill,
      week: weekLabel,
      desc: data?.youtube_title
        ? `Master ${skill} fundamentals`
        : `Learn ${skill}`,
    };
  });
}

const DIFFICULTY_RULES = [
  { maxWeeks: 1,  label: "Beginner",     color: "#10b981", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.25)"  },
  { maxWeeks: 3,  label: "Intermediate", color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.25)"  },
  { maxWeeks: 99, label: "Advanced",     color: "#f43f5e", bg: "rgba(244,63,94,0.12)",   border: "rgba(244,63,94,0.25)"   },
];

function getDifficulty(timeStr) {
  const weeks = parseWeeks(timeStr);
  return DIFFICULTY_RULES.find(r => weeks <= r.maxWeeks) ?? DIFFICULTY_RULES[2];
}

export default function LearningPath({ analysis, onNavigate }) {
  const recommendations = analysis?.recommendations ?? null;

  // Empty state
  if (!recommendations || Object.keys(recommendations).length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center gap-4"
        style={{ minHeight: 320 }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "rgba(99,102,241,0.1)",
          border: "1px solid rgba(99,102,241,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28,
        }}>🗺️</div>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: 15, marginBottom: 6 }}>
            No learning path yet
          </p>
          <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>
            Upload your resume and job description to generate a personalized roadmap.
          </p>
        </div>
        {onNavigate && (
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate("analyze")}
            className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl"
            style={{ background: "linear-gradient(135deg, #4f8ef7, #6366f1)", color: "white" }}>
            Analyze Resume <ArrowRight size={11} />
          </motion.button>
        )}
      </motion.div>
    );
  }

  const timeline   = buildTimeline(recommendations);
  const totalWeeks = calcTotalWeeks(recommendations);
  const weekLabel  = totalWeeks <= 1
    ? `${totalWeeks} week`
    : `${totalWeeks} weeks`;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Learning Path
          </h1>
          <div className="px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ background: "rgba(168,85,247,0.15)", color: "#c084fc", border: "1px solid rgba(168,85,247,0.25)" }}>
            {timeline.length} skill{timeline.length !== 1 ? "s" : ""}
          </div>
        </div>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Personalized roadmap to close your skill gaps
        </p>
      </motion.div>

      {/* Resource Cards */}
      <div>
        <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--text-secondary)" }}>
          📚 Recommended Resources
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Object.entries(recommendations).map(([skill, data], i) => (
            <motion.div key={skill}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}>
              <RecommendationCard skill={skill} data={data} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>

        {/* Timeline header */}
        <div className="px-6 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {weekLabel} Learning Roadmap
              </h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                Follow this sequence for fastest results
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
              style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.2)" }}>
              <Flame size={12} style={{ color: "#fbbf24" }} />
              <span className="text-xs font-semibold" style={{ color: "#fbbf24" }}>
                {weekLabel} total
              </span>
            </div>
          </div>
        </div>

        {/* Timeline rows */}
        <div className="p-6 space-y-0">
          {timeline.map((item, i) => {
            const diff   = getDifficulty(recommendations[item.skill]?.time_to_learn);
            const isLast = i === timeline.length - 1;
            return (
              <motion.div key={item.skill}
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.1, duration: 0.4 }}
                className="flex gap-5 relative">

                {/* Spine */}
                <div className="flex flex-col items-center shrink-0 w-10">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.1, type: "spring" }}
                    className="w-9 h-9 rounded-xl flex items-center justify-center z-10 shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${diff.color}22, ${diff.color}11)`,
                      border: `1px solid ${diff.color}40`,
                    }}>
                    <span className="text-sm font-bold" style={{ color: diff.color }}>{i + 1}</span>
                  </motion.div>
                  {!isLast && (
                    <div className="flex-1 w-px mt-2"
                      style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)", minHeight: 32 }} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-6">
                  <motion.div whileHover={{ x: 4 }}
                    className="rounded-xl p-4 cursor-default"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>

                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                          {item.skill}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: "rgba(244,63,94,0.12)", color: "#fda4af", border: "1px solid rgba(244,63,94,0.22)" }}>
                          MISSING
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: diff.bg, color: diff.color, border: `1px solid ${diff.border}` }}>
                          {diff.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Clock size={11} style={{ color: "var(--text-muted)" }} />
                        <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                          {item.week}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
                      {item.desc}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <BookOpen size={11} style={{ color: "var(--text-muted)" }} />
                        <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                          {recommendations[item.skill]?.certificate_name ?? "Course available"}
                        </span>
                      </div>
                      <motion.a
                        href={recommendations[item.skill]?.youtube_link ?? "#"}
                        target="_blank" rel="noopener noreferrer"
                        whileHover={{ x: 2 }}
                        className="flex items-center gap-1 text-[11px] font-semibold"
                        style={{ color: "#4f8ef7" }}>
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
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate("analyze")}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl"
              style={{ background: "linear-gradient(135deg, #4f8ef7, #6366f1)", color: "white" }}>
              Re-analyze <ArrowRight size={11} />
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}