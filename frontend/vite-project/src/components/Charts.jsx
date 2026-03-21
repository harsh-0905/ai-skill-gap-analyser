import { motion } from "framer-motion";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area,
} from "recharts";
import { RADAR_DATA, BAR_DATA, LINE_DATA } from "../data/constants";

// ─── Glass tooltip ────────────────────────────────────────────────────────────
export function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgba(10,10,20,0.92)",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: 12,
      padding: "10px 14px",
      boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
      backdropFilter: "blur(20px)",
    }}>
      <p style={{ fontSize: 11, color: "rgba(200,200,220,0.5)", marginBottom: 8 }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: i < payload.length - 1 ? 4 : 0 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color }} />
          <span style={{ fontSize: 12, color: "rgba(200,200,220,0.7)" }}>{p.name}:</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#f0f0ff" }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

const tickStyle = { fill: "rgba(200,200,220,0.35)", fontSize: 11, fontFamily: "Outfit, sans-serif" };

// ─── Card wrapper ─────────────────────────────────────────────────────────────
function ChartCard({ title, subtitle, legend, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: 24,
        backdropFilter: "blur(20px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#f0f0ff", marginBottom: 2 }}>{title}</p>
          {subtitle && <p style={{ fontSize: 11, color: "rgba(200,200,220,0.4)" }}>{subtitle}</p>}
        </div>
        {legend && (
          <div style={{ display: "flex", gap: 16 }}>
            {legend.map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color }} />
                <span style={{ fontSize: 11, color: "rgba(200,200,220,0.4)" }}>{l.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {children}
    </motion.div>
  );
}

// ─── Radar ────────────────────────────────────────────────────────────────────
export function SkillsRadarChart() {
  return (
    <ChartCard
      title="Skills Comparison"
      subtitle="Resume vs Job Description"
      legend={[{ label: "Resume", color: "#4f8ef7" }, { label: "JD Required", color: "#a855f7" }]}
    >
      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={RADAR_DATA} margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
          <PolarGrid stroke="rgba(255,255,255,0.06)" />
          <PolarAngleAxis dataKey="skill" tick={{ ...tickStyle, fontSize: 10 }} />
          <PolarRadiusAxis tick={false} axisLine={false} />
          <Radar
            name="Resume" dataKey="resume"
            stroke="#4f8ef7" fill="#4f8ef7" fillOpacity={0.2} strokeWidth={2}
            dot={{ fill: "#4f8ef7", r: 3, strokeWidth: 0 }}
          />
          <Radar
            name="JD Required" dataKey="jd"
            stroke="#a855f7" fill="#a855f7" fillOpacity={0.1} strokeWidth={2}
            strokeDasharray="5 3"
          />
          <Tooltip content={<ChartTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// ─── Bar ──────────────────────────────────────────────────────────────────────
export function SkillsBarChart() {
  return (
    <ChartCard
      title="Skills Breakdown"
      subtitle="Matched vs Missing by category"
    >
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={BAR_DATA} barCategoryGap="35%" margin={{ top: 0, right: 0, bottom: 0, left: -10 }}>
          <defs>
            <linearGradient id="barMatched" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#4f8ef7" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0.6} />
            </linearGradient>
            <linearGradient id="barMissing" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#f43f5e" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#e11d48" stopOpacity={0.6} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="category" tick={tickStyle} axisLine={false} tickLine={false} />
          <YAxis tick={tickStyle} axisLine={false} tickLine={false} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Legend
            wrapperStyle={{ fontSize: 11, color: "rgba(200,200,220,0.4)", paddingTop: 12 }}
            iconType="circle" iconSize={8}
          />
          <Bar dataKey="matched" name="Matched" fill="url(#barMatched)" radius={[6, 6, 0, 0]} maxBarSize={32} />
          <Bar dataKey="missing" name="Missing" fill="url(#barMissing)" radius={[6, 6, 0, 0]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// ─── Area / progress ──────────────────────────────────────────────────────────
export function ProgressAreaChart({ gradientId = "pgGrad", height = 200 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={LINE_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#4f8ef7" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#4f8ef7" stopOpacity={0}    />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis dataKey="week" tick={tickStyle} axisLine={false} tickLine={false} />
        <YAxis tick={tickStyle} axisLine={false} tickLine={false} domain={[0, 100]} />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: "rgba(79,142,247,0.2)", strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey="score"
          name="Readiness %"
          stroke="#4f8ef7"
          strokeWidth={2.5}
          fill={`url(#${gradientId})`}
          dot={{ fill: "#4f8ef7", r: 4, strokeWidth: 2, stroke: "#0d0d14" }}
          activeDot={{ r: 6, fill: "#93c5fd", stroke: "#0d0d14", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}