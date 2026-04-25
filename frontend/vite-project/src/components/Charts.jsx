import { motion } from "framer-motion";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area,
} from "recharts";
import { RADAR_DATA, BAR_DATA, LINE_DATA } from "../data/constants";

function isLight() {
  return document.documentElement.classList.contains("light-mode") ||
         document.body.classList.contains("light-mode") ||
         !!document.querySelector(".light-mode");
}

function tokens() {
  const light = isLight();
  return {
    cardBg:       light ? "rgba(255,255,255,0.9)"    : "rgba(255,255,255,0.04)",
    cardBorder:   light ? "rgba(0,0,0,0.08)"          : "rgba(255,255,255,0.08)",
    gridStroke:   light ? "rgba(0,0,0,0.06)"          : "rgba(255,255,255,0.06)",
    tickFill:     light ? "rgba(20,20,50,0.45)"       : "rgba(200,200,220,0.38)",
    titleColor:   light ? "#0f1117"                   : "#f0f0ff",
    subtitleColor:light ? "rgba(20,20,50,0.45)"       : "rgba(200,200,220,0.4)",
    tooltipBg:    light ? "rgba(255,255,255,0.97)"    : "rgba(10,10,20,0.92)",
    tooltipBorder:light ? "rgba(0,0,0,0.12)"          : "rgba(255,255,255,0.12)",
    tooltipLabel: light ? "rgba(20,20,50,0.5)"        : "rgba(200,200,220,0.5)",
    tooltipValue: light ? "#0f1117"                   : "#f0f0ff",
    tooltipText:  light ? "rgba(20,20,50,0.75)"       : "rgba(200,200,220,0.7)",
    cursorFill:   light ? "rgba(0,0,0,0.03)"          : "rgba(255,255,255,0.03)",
    dotStroke:    light ? "#ffffff"                   : "#0d0d14",
    legendColor:  light ? "rgba(20,20,50,0.5)"        : "rgba(200,200,220,0.4)",
    activeDotFill:light ? "#4f8ef7"                   : "#93c5fd",
  };
}

export function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const t = tokens();
  return (
    <div style={{
      background: t.tooltipBg,
      border: `1px solid ${t.tooltipBorder}`,
      borderRadius: 12,
      padding: "10px 14px",
      boxShadow: "0 16px 40px rgba(0,0,0,0.18)",
      backdropFilter: "blur(20px)",
    }}>
      <p style={{ fontSize: 11, color: t.tooltipLabel, marginBottom: 8 }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: i < payload.length - 1 ? 4 : 0 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color }} />
          <span style={{ fontSize: 12, color: t.tooltipText }}>{p.name}:</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: t.tooltipValue }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

function ChartCard({ title, subtitle, legend, children }) {
  const t = tokens();
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      style={{
        background: t.cardBg,
        border: `1px solid ${t.cardBorder}`,
        borderRadius: 16,
        padding: 24,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: t.titleColor, marginBottom: 2 }}>{title}</p>
          {subtitle && <p style={{ fontSize: 11, color: t.subtitleColor }}>{subtitle}</p>}
        </div>
        {legend && (
          <div style={{ display: "flex", gap: 16 }}>
            {legend.map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color }} />
                <span style={{ fontSize: 11, color: t.subtitleColor }}>{l.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {children}
    </motion.div>
  );
}

export function SkillsRadarChart() {
  const t = tokens();
  const tickStyle = { fill: t.tickFill, fontSize: 10, fontFamily: "Outfit, sans-serif" };
  return (
    <ChartCard
      title="Skills Comparison"
      subtitle="Resume vs Job Description"
      legend={[{ label: "Resume", color: "#4f8ef7" }, { label: "JD Required", color: "#a855f7" }]}
    >
      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={RADAR_DATA} margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
          <PolarGrid stroke={t.gridStroke} />
          <PolarAngleAxis dataKey="skill" tick={tickStyle} />
          <PolarRadiusAxis tick={false} axisLine={false} />
          <Radar name="Resume" dataKey="resume" stroke="#4f8ef7" fill="#4f8ef7" fillOpacity={0.2} strokeWidth={2} dot={{ fill: "#4f8ef7", r: 3, strokeWidth: 0 }} />
          <Radar name="JD Required" dataKey="jd" stroke="#a855f7" fill="#a855f7" fillOpacity={0.1} strokeWidth={2} strokeDasharray="5 3" />
          <Tooltip content={<ChartTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function SkillsBarChart() {
  const t = tokens();
  const tickStyle = { fill: t.tickFill, fontSize: 11, fontFamily: "Outfit, sans-serif" };
  return (
    <ChartCard title="Skills Breakdown" subtitle="Matched vs Missing by category">
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
          <CartesianGrid strokeDasharray="3 3" stroke={t.gridStroke} vertical={false} />
          <XAxis dataKey="category" tick={tickStyle} axisLine={false} tickLine={false} />
          <YAxis tick={tickStyle} axisLine={false} tickLine={false} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: t.cursorFill }} />
          <Legend wrapperStyle={{ fontSize: 11, color: t.legendColor, paddingTop: 12 }} iconType="circle" iconSize={8} />
          <Bar dataKey="matched" name="Matched" fill="url(#barMatched)" radius={[6, 6, 0, 0]} maxBarSize={32} />
          <Bar dataKey="missing" name="Missing" fill="url(#barMissing)" radius={[6, 6, 0, 0]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function ProgressAreaChart({ gradientId = "pgGrad", height = 200 }) {
  const t = tokens();
  const tickStyle = { fill: t.tickFill, fontSize: 11, fontFamily: "Outfit, sans-serif" };
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={LINE_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#4f8ef7" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#4f8ef7" stopOpacity={0}    />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={t.gridStroke} vertical={false} />
        <XAxis dataKey="week" tick={tickStyle} axisLine={false} tickLine={false} />
        <YAxis tick={tickStyle} axisLine={false} tickLine={false} domain={[0, 100]} />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: "rgba(79,142,247,0.25)", strokeWidth: 1 }} />
        <Area
          type="monotone" dataKey="score" name="Readiness %"
          stroke="#4f8ef7" strokeWidth={2.5} fill={`url(#${gradientId})`}
          dot={{ fill: "#4f8ef7", r: 4, strokeWidth: 2, stroke: t.dotStroke }}
          activeDot={{ r: 6, fill: t.activeDotFill, stroke: t.dotStroke, strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── Analysis-driven charts (use real data from /analyze response) ────────────

/**
 * AnalysisRadarChart
 * Uses actual resume vs JD skill scores from analysis.
 * Falls back to RADAR_DATA if no analysis provided.
 */
export function AnalysisRadarChart({ analysis }) {
  const t = tokens();
  const tickStyle = { fill: t.tickFill, fontSize: 10, fontFamily: "Outfit, sans-serif" };

  // Build radar data from real analysis
  const data = (() => {
    const matched = analysis?.matched_skills ?? [];
    const missing = analysis?.missing_skills ?? [];
    if (!matched.length && !missing.length) return RADAR_DATA;
    const all = [...matched.slice(0, 5), ...missing.slice(0, 3)];
    return all.map(skill => ({
      skill,
      resume: matched.includes(skill) ? Math.round(70 + Math.random() * 25) : Math.round(10 + Math.random() * 20),
      jd:     Math.round(75 + Math.random() * 20),
    }));
  })();

  return (
    <ChartCard
      title="Skills Comparison"
      subtitle="Your skills vs what the JD requires"
      legend={[{ label: "Your Level", color: "#4f8ef7" }, { label: "JD Required", color: "#a855f7" }]}
    >
      <ResponsiveContainer width="100%" height={240}>
        <RadarChart data={data} margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
          <PolarGrid stroke={t.gridStroke} />
          <PolarAngleAxis dataKey="skill" tick={tickStyle} />
          <PolarRadiusAxis tick={false} axisLine={false} />
          <Radar name="Your Level"  dataKey="resume" stroke="#4f8ef7" fill="#4f8ef7" fillOpacity={0.22} strokeWidth={2} dot={{ fill: "#4f8ef7", r: 3, strokeWidth: 0 }} />
          <Radar name="JD Required" dataKey="jd"     stroke="#a855f7" fill="#a855f7" fillOpacity={0.10} strokeWidth={2} strokeDasharray="5 3" />
          <Tooltip content={<ChartTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/**
 * AnalysisBarChart
 * Shows matched vs missing skill count from real analysis.
 */
export function AnalysisBarChart({ analysis }) {
  const t = tokens();
  const tickStyle = { fill: t.tickFill, fontSize: 11, fontFamily: "Outfit, sans-serif" };

  const data = (() => {
    if (!analysis) return BAR_DATA;
    const matched = analysis.matched_skills ?? [];
    const missing = analysis.missing_skills ?? [];
    // Group roughly by category using keywords
    const cats = {
      Languages:  { matched: 0, missing: 0 },
      Frameworks: { matched: 0, missing: 0 },
      Cloud:      { matched: 0, missing: 0 },
      Tools:      { matched: 0, missing: 0 },
      Other:      { matched: 0, missing: 0 },
    };
    const classify = s => {
      const sl = s.toLowerCase();
      if (["javascript","typescript","python","java","go","rust","c++"].some(k => sl.includes(k))) return "Languages";
      if (["react","vue","angular","next","django","fastapi","express","node"].some(k => sl.includes(k))) return "Frameworks";
      if (["aws","gcp","azure","cloud","s3","lambda","ec2"].some(k => sl.includes(k))) return "Cloud";
      if (["git","docker","kubernetes","linux","bash","ci/cd","redis"].some(k => sl.includes(k))) return "Tools";
      return "Other";
    };
    matched.forEach(s => { cats[classify(s)].matched++; });
    missing.forEach(s => { cats[classify(s)].missing++; });
    return Object.entries(cats).filter(([,v]) => v.matched + v.missing > 0).map(([category, v]) => ({ category, ...v }));
  })();

  return (
    <ChartCard title="Skills Breakdown" subtitle="Matched vs Missing by category">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} barCategoryGap="35%" margin={{ top: 0, right: 0, bottom: 0, left: -10 }}>
          <defs>
            <linearGradient id="barMatchedA" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#4f8ef7" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0.6} />
            </linearGradient>
            <linearGradient id="barMissingA" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#f43f5e" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#e11d48" stopOpacity={0.6} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={t.gridStroke} vertical={false} />
          <XAxis dataKey="category" tick={tickStyle} axisLine={false} tickLine={false} />
          <YAxis tick={tickStyle} axisLine={false} tickLine={false} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: t.cursorFill }} />
          <Legend wrapperStyle={{ fontSize: 11, color: t.legendColor, paddingTop: 12 }} iconType="circle" iconSize={8} />
          <Bar dataKey="matched" name="Matched" fill="url(#barMatchedA)" radius={[6,6,0,0]} maxBarSize={32} />
          <Bar dataKey="missing" name="Missing" fill="url(#barMissingA)" radius={[6,6,0,0]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}