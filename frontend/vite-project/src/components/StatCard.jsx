import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

function useCounter(target, duration = 1200, delay = 0) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const numericTarget = parseFloat(String(target).replace(/[^0-9.]/g, ""));
    if (isNaN(numericTarget)) { el.textContent = target; return; }
    const suffix = String(target).replace(/[0-9.]/g, "");
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp + delay;
      const elapsed = Math.max(0, timestamp - start);
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (numericTarget * eased).toFixed(numericTarget % 1 !== 0 ? 1 : 0) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, delay]);
  return ref;
}

export default function StatCard({ icon: Icon, label, value, sub, color = "#6366f1", glowColor, delay = 0 }) {
  const counterRef = useCounter(value, 1000, delay * 1000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -4 }}
      style={{
        position: "relative",
        borderRadius: 16,
        padding: 20,
        overflow: "hidden",
        cursor: "default",
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Glow blob */}
      <div style={{
        position: "absolute", top: -24, right: -24,
        width: 96, height: 96, borderRadius: "50%",
        pointerEvents: "none",
        background: `radial-gradient(circle, ${glowColor || color}28 0%, transparent 70%)`,
        filter: "blur(16px)",
      }} />

      {/* Icon */}
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 16, flexShrink: 0,
        background: `${color}18`,
        border: `1px solid ${color}28`,
      }}>
        {Icon && <Icon size={16} style={{ color }} />}
      </div>

      {/* Animated value */}
      <p
        ref={counterRef}
        style={{
          fontSize: 24, fontWeight: 800, lineHeight: 1,
          marginBottom: 4, fontFamily: "var(--font-body)",
          color: "var(--text-primary)",
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </p>

      <p style={{
        fontSize: 12, fontWeight: 600, marginBottom: 2,
        color: "var(--text-secondary)",
      }}>
        {label}
      </p>

      {sub && (
        <p style={{ fontSize: 11, lineHeight: 1.4, color: "var(--text-muted)" }}>
          {sub}
        </p>
      )}
    </motion.div>
  );
}