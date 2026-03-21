import { useState, useEffect } from "react";

/**
 * CircularProgress
 * Animated SVG ring with gradient stroke.
 * Props: value (0-100), size, stroke, colorStart, colorEnd
 */
export default function CircularProgress({
  value,
  size = 120,
  stroke = 10,
  colorStart = "#4f8ef7",
  colorEnd = "#a855f7",
  id = "cp",
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(value), 200);
    return () => clearTimeout(t);
  }, [value]);

  const offset = circ - (animated / 100) * circ;
  const gradId = `grad-${id}`;

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={colorStart} />
          <stop offset="100%" stopColor={colorEnd}   />
        </linearGradient>
      </defs>
      {/* Track */}
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={stroke}
      />
      {/* Filled arc */}
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)" }}
      />
    </svg>
  );
}