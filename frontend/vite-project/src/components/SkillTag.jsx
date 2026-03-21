import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * SkillTag — pill badge with tooltip on hover
 * Props: skill (string), matched (bool)
 */
export default function SkillTag({ skill, matched }) {
  const [hovered, setHovered] = useState(false);

  const style = matched
    ? { bg: "rgba(16,185,129,0.1)", text: "#6ee7b7", border: "rgba(16,185,129,0.25)", glow: "rgba(16,185,129,0.2)" }
    : { bg: "rgba(244,63,94,0.1)",  text: "#fda4af", border: "rgba(244,63,94,0.25)",  glow: "rgba(244,63,94,0.2)"  };

  const tooltipText = matched
    ? `✓ ${skill} is in your resume`
    : `✕ ${skill} is required but missing`;

  return (
    <div className="relative inline-block">
      <motion.span
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.06, boxShadow: `0 0 14px ${style.glow}` }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold cursor-default select-none"
        style={{
          background: style.bg,
          color: style.text,
          border: `1px solid ${style.border}`,
        }}
      >
        <span style={{ fontSize: 10 }}>{matched ? "✓" : "✕"}</span>
        {skill}
      </motion.span>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none"
          >
            <div
              className="whitespace-nowrap px-2.5 py-1.5 rounded-lg text-[11px] font-medium"
              style={{
                background: "#111118",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(220,220,240,0.85)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
              }}
            >
              {tooltipText}
            </div>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
              style={{ borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "5px solid rgba(255,255,255,0.1)" }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}