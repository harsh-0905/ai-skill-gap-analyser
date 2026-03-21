import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/**
 * Animated number counter hook
 */
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
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = (numericTarget * eased).toFixed(numericTarget % 1 !== 0 ? 1 : 0) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, delay]);
  return ref;
}

/**
 * StatCard — premium glass metric tile with animated counter
 * Props: icon (Lucide component), label, value, sub, color, delay
 */
export default function StatCard({ icon: Icon, label, value, sub, color = "#6366f1", glowColor, delay = 0 }) {
  const counterRef = useCounter(value, 1000, delay * 1000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{
        y: -4,
        boxShadow: `0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)`,
      }}
      className="relative rounded-2xl p-5 overflow-hidden cursor-default"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Glow blob */}
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${glowColor || color}33 0%, transparent 70%)`,
          filter: "blur(16px)",
        }}
      />

      {/* Icon */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 shrink-0"
        style={{ background: `${color}18`, border: `1px solid ${color}28` }}
      >
        {Icon && <Icon size={16} style={{ color }} />}
      </div>

      {/* Value with animated counter */}
      <p
        ref={counterRef}
        className="text-2xl font-bold mb-0.5 tabular-nums"
        style={{ color: "var(--text-primary)", fontFamily: "var(--font-body)" }}
      >
        {value}
      </p>

      <p className="text-xs font-semibold mb-0.5" style={{ color: "rgba(200,200,220,0.6)" }}>
        {label}
      </p>
      {sub && (
        <p className="text-[11px] leading-snug" style={{ color: "var(--text-muted)" }}>
          {sub}
        </p>
      )}
    </motion.div>
  );
}