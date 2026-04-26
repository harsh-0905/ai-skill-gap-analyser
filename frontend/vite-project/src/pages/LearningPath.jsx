import { motion } from "framer-motion";
import { Clock, BookOpen, ArrowRight, CheckCircle2, Flame } from "lucide-react";

import RecommendationCard from "../components/RecommendationCard";
import { GanttTimelineChart } from "../components/Charts";

function parseWeeks(timeStr = "") {
  const str = timeStr.toLowerCase().trim();
  const num = parseFloat(str);
  if (isNaN(num)) return 1;
  if (str.includes("day")) return Math.ceil(num / 7);
  return num;
}

function calcTotalWeeks(recommendations) {
  return Object.values(recommendations).reduce((sum, data) => {
    return sum + parseWeeks(data?.time_to_learn);
  }, 0);
}

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
  { maxWeeks: 1,  label: "Beginner",     color: "#10b981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.2)"  },
  { maxWeeks: 3,  label: "Intermediate", color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.2)"  },
  { maxWeeks: 99, label: "Advanced",     color: "#f43f5e", bg: "rgba(244,63,94,0.1)",   border: "rgba(244,63,94,0.2)"   },
];

function getDifficulty(timeStr) {
  const weeks = parseWeeks(timeStr);
  return DIFFICULTY_RULES.find(r => weeks <= r.maxWeeks) ?? DIFFICULTY_RULES[2];
}

export default function LearningPath({ analysis, onNavigate }) {
  const recommendations = analysis?.recommendations ?? null;

  if (!recommendations || Object.keys(recommendations).length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center gap-4 p-8"
        style={{ minHeight: 320 }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28,
        }}>
          🗺️
        </div>
        <div style={{ textAlign: "center" }}>
          <p className="font-semibold text-sm mb-1.5" style={{ color: "var(--text-primary)" }}>
            No learning path yet
          </p>
          <p className="text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
            Upload your resume and job description to generate a personalized roadmap.
          </p>
        </div>
        {onNavigate && (
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate("analyze")}
            className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl text-white"
            style={{ background: "linear-gradient(135deg, #4f8ef7, #6366f1)" }}>
            Analyze Resume <ArrowRight size={11} />
          </motion.button>
        )}
      </motion.div>
    );
  }

  const timeline   = buildTimeline(recommendations);
  const totalWeeks = calcTotalWeeks(recommendations);
  const weekLabel  = `${totalWeeks} week${totalWeeks !== 1 ? "s" : ""}`;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6 sm:space-y-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-xl sm:text-2xl font-bold"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Learning Path
          </h1>
          <div className="px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ background: "rgba(168,85,247,0.12)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.2)" }}>
            {timeline.length} skill{timeline.length !== 1 ? "s" : ""}
          </div>
        </div>
        <p className="text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
          Personalized roadmap to close your skill gaps
        </p>
      </motion.div>

      {/* Resource Cards */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider mb-4"
          style={{ color: "var(--text-muted)" }}>
          Recommended Resources
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Object.entries(recommendations).map(([skill, data], i) => (
            <motion.div key={skill}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}>
              <RecommendationCard skill={skill} data={data} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Gantt Timeline Chart */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <GanttTimelineChart analysis={analysis} />
      </motion.div>

      {/* Timeline */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>

        {/* Timeline header */}
        <div className="px-5 sm:px-6 py-4 sm:py-5"
          style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {weekLabel} Learning Roadmap
              </h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                Follow this sequence for fastest results
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl shrink-0"
              style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
              <Flame size={12} style={{ color: "#f59e0b" }} />
              <span className="text-xs font-semibold" style={{ color: "#f59e0b" }}>
                {weekLabel} total
              </span>
            </div>
          </div>
        </div>

        {/* Timeline rows */}
        <div className="p-4 sm:p-6 space-y-0">
          {timeline.map((item, i) => {
            const diff   = getDifficulty(recommendations[item.skill]?.time_to_learn);
            const isLast = i === timeline.length - 1;

            return (
              <motion.div key={item.skill}
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.08, duration: 0.4 }}
                className="flex gap-4 relative">

                {/* Spine */}
                <div className="flex flex-col items-center shrink-0" style={{ width: 36 }}>
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.08, type: "spring" }}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center z-10 shrink-0"
                    style={{
                      background: diff.bg,
                      border: `1px solid ${diff.border}`,
                    }}>
                    <span className="text-xs font-bold" style={{ color: diff.color }}>{i + 1}</span>
                  </motion.div>
                  {!isLast && (
                    <div className="flex-1 w-px mt-2"
                      style={{
                        background: "linear-gradient(to bottom, var(--border-strong), transparent)",
                        minHeight: 28,
                      }} />
                  )}
                </div>

                {/* Content card */}
                <div className="flex-1 pb-4 sm:pb-6">
                  <motion.div whileHover={{ x: 3 }}
                    className="rounded-xl p-3 sm:p-4"
                    style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>

                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                          {item.skill}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: "rgba(244,63,94,0.1)", color: "#f43f5e", border: "1px solid rgba(244,63,94,0.2)" }}>
                          MISSING
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: diff.bg, color: diff.color, border: `1px solid ${diff.border}` }}>
                          {diff.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Clock size={10} style={{ color: "var(--text-muted)" }} />
                        <span className="text-[10px] sm:text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                          {item.week}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
                      {item.desc}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <BookOpen size={10} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                        <span className="text-[10px] truncate" style={{ color: "var(--text-muted)" }}>
                          {recommendations[item.skill]?.certificate_name ?? "Course available"}
                        </span>
                      </div>
                      <motion.a
                        href={recommendations[item.skill]?.youtube_link ?? "#"}
                        target="_blank" rel="noopener noreferrer"
                        whileHover={{ x: 2 }}
                        className="flex items-center gap-1 text-[11px] font-semibold shrink-0 ml-2"
                        style={{ color: "#4f8ef7" }}>
                        Start <ArrowRight size={10} />
                      </motion.a>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="px-5 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3"
          style={{ borderTop: "1px solid var(--border)", background: "var(--bg-elevated)" }}>
          <div className="flex items-center gap-2 min-w-0">
            <CheckCircle2 size={13} style={{ color: "#10b981", flexShrink: 0 }} />
            <span className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
              Complete all steps to become fully job-ready
            </span>
          </div>
          {onNavigate && (
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate("analyze")}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl text-white shrink-0"
              style={{ background: "linear-gradient(135deg, #4f8ef7, #6366f1)" }}>
              Re-analyze <ArrowRight size={10} />
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}