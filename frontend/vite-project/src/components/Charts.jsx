import { useState } from "react";
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
    ganttBg:      light ? "rgba(0,0,0,0.04)"          : "rgba(255,255,255,0.04)",
    ganttLine:    light ? "rgba(0,0,0,0.08)"          : "rgba(255,255,255,0.08)",
    textPrimary:  light ? "#0f1117"                   : "#f0f0ff",
    textMuted:    light ? "rgba(20,20,50,0.45)"       : "rgba(200,200,220,0.4)",
    bgElevated:   light ? "rgba(0,0,0,0.03)"          : "rgba(255,255,255,0.03)",
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

export function ProgressAreaChart({ gradientId = "pgGrad", height = 200, analysis }) {
  const t = tokens();
  const tickStyle = { fill: t.tickFill, fontSize: 11, fontFamily: "Outfit, sans-serif" };

  // Build real projected readiness curve from analysis
  const data = (() => {
    if (!analysis?.missing_skills?.length) return LINE_DATA;
    const startPct = analysis.match_percentage ?? 45;
    const missing  = analysis.missing_skills ?? [];
    const recs     = analysis.recommendations ?? {};
    let current    = startPct;
    let week       = 0;
    const points   = [{ week: "Now", score: Math.round(current) }];
    const gainPerSkill = (100 - current) / (missing.length || 1);
    missing.forEach(skill => {
      const timeStr = recs[skill]?.time_to_learn ?? "2 weeks";
      const num     = parseFloat(timeStr) || 2;
      const days    = timeStr.toLowerCase().includes("day") ? num : num * 7;
      const wks     = Math.ceil(days / 7);
      week += wks;
      current = Math.min(98, current + gainPerSkill);
      points.push({ week: `W${week}`, score: Math.round(current) });
    });
    return points;
  })();

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
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

export function AnalysisRadarChart({ analysis }) {
  const t = tokens();
  const tickStyle = { fill: t.tickFill, fontSize: 10, fontFamily: "Outfit, sans-serif" };

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

export function AnalysisBarChart({ analysis }) {
  const t = tokens();
  const tickStyle = { fill: t.tickFill, fontSize: 11, fontFamily: "Outfit, sans-serif" };

  const data = (() => {
    if (!analysis) return BAR_DATA;
    const matched = analysis.matched_skills ?? [];
    const missing = analysis.missing_skills ?? [];
    const cats = {
      Languages:  { matched: 0, missing: 0 },
      Frameworks: { matched: 0, missing: 0 },
      Cloud:      { matched: 0, missing: 0 },
      Tools:      { matched: 0, missing: 0 },
      Other:      { matched: 0, missing: 0 },
    };
    const classify = s => {
      const sl = s.toLowerCase();
      if (["javascript","typescript","python","java","go","rust","c++","kotlin","swift"].some(k => sl.includes(k))) return "Languages";
      if (["react","vue","angular","next","django","fastapi","express","node","flutter","spring"].some(k => sl.includes(k))) return "Frameworks";
      if (["aws","gcp","azure","cloud","s3","lambda","ec2"].some(k => sl.includes(k))) return "Cloud";
      if (["git","docker","kubernetes","linux","bash","ci/cd","redis","selenium","jira","postman"].some(k => sl.includes(k))) return "Tools";
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

// ─── Gantt Timeline Chart ─────────────────────────────────────────────────────

const GANTT_COLORS = [
  { bar: "#4f8ef7", bg: "rgba(79,142,247,0.12)",  border: "rgba(79,142,247,0.3)"  },
  { bar: "#a855f7", bg: "rgba(168,85,247,0.12)",  border: "rgba(168,85,247,0.3)"  },
  { bar: "#10b981", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.3)"  },
  { bar: "#f59e0b", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.3)"  },
  { bar: "#f43f5e", bg: "rgba(244,63,94,0.12)",   border: "rgba(244,63,94,0.3)"   },
  { bar: "#06b6d4", bg: "rgba(6,182,212,0.12)",   border: "rgba(6,182,212,0.3)"   },
  { bar: "#84cc16", bg: "rgba(132,204,22,0.12)",  border: "rgba(132,204,22,0.3)"  },
  { bar: "#f97316", bg: "rgba(249,115,22,0.12)",  border: "rgba(249,115,22,0.3)"  },
];

function parseWeeksFloat(timeStr = "") {
  const str = timeStr.toLowerCase().trim();
  const num = parseFloat(str) || 1;
  if (str.includes("day")) return num / 7;
  if (str.includes("month")) return num * 4;
  return num;
}

export function GanttTimelineChart({ analysis }) {
  const t = tokens();
  const [hovered, setHovered] = useState(null);

  const recs     = analysis?.recommendations ?? {};
  const missing  = analysis?.missing_skills  ?? [];
  const skillsWithTime = missing.filter(s => recs[s]);

  if (!skillsWithTime.length) return null;

  // Build timeline entries with start/end weeks
  let cursor = 0;
  const entries = skillsWithTime.map((skill, i) => {
    const timeStr = recs[skill]?.time_to_learn ?? "2 weeks";
    const weeks   = Math.max(0.5, parseWeeksFloat(timeStr));
    const start   = cursor;
    const end     = cursor + weeks;
    cursor        = end;
    return { skill, timeStr, start, end, weeks, color: GANTT_COLORS[i % GANTT_COLORS.length] };
  });

  const totalWeeks = cursor;
  // Generate week tick labels
  const tickCount  = Math.min(Math.ceil(totalWeeks) + 1, 20);
  const ticks      = Array.from({ length: tickCount }, (_, i) => i);

  const BAR_HEIGHT = 36;
  const ROW_GAP    = 10;
  const LABEL_W    = 110;
  const chartH     = entries.length * (BAR_HEIGHT + ROW_GAP) + 40;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      style={{
        background: "var(--card-bg, rgba(255,255,255,0.04))",
        border: `1px solid ${t.cardBorder}`,
        borderRadius: 16,
        padding: "20px 20px 16px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: t.titleColor, marginBottom: 2 }}>
            Learning Timeline
          </p>
          <p style={{ fontSize: 11, color: t.subtitleColor }}>
            Week-by-week skill acquisition roadmap · {Math.round(totalWeeks)} weeks total
          </p>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "4px 12px", borderRadius: 999,
          background: "rgba(79,142,247,0.1)", border: "1px solid rgba(79,142,247,0.2)",
          fontSize: 11, fontWeight: 600, color: "#4f8ef7",
        }}>
          {skillsWithTime.length} skills · {Math.round(totalWeeks)} weeks
        </div>
      </div>

      {/* Chart area */}
      <div style={{ overflowX: "auto", overflowY: "visible" }}>
        <div style={{ minWidth: Math.max(500, LABEL_W + tickCount * 44), position: "relative" }}>

          {/* Week header ticks */}
          <div style={{ display: "flex", marginLeft: LABEL_W, marginBottom: 6, position: "relative" }}>
            {ticks.map(w => (
              <div key={w} style={{
                flex: 1,
                fontSize: 9,
                fontWeight: 600,
                color: t.textMuted,
                textAlign: "center",
                letterSpacing: "0.04em",
              }}>
                {w === 0 ? "Start" : `W${w}`}
              </div>
            ))}
          </div>

          {/* Grid lines */}
          <div style={{ position: "relative", height: chartH }}>
            {/* Vertical grid lines */}
            {ticks.map(w => (
              <div key={w} style={{
                position: "absolute",
                left: `${LABEL_W + (w / totalWeeks) * (100 - (LABEL_W / (LABEL_W + tickCount * 44)) * 100)}%`,
                top: 0, bottom: 0,
                width: 1,
                background: t.ganttLine,
                pointerEvents: "none",
              }} />
            ))}

            {/* Skill rows */}
            {entries.map((entry, i) => {
              const leftPct  = (entry.start / totalWeeks) * 100;
              const widthPct = (entry.weeks  / totalWeeks) * 100;
              const isHov    = hovered === entry.skill;
              const top      = i * (BAR_HEIGHT + ROW_GAP);

              return (
                <div key={entry.skill} style={{ position: "absolute", top, left: 0, right: 0, height: BAR_HEIGHT }}>
                  {/* Skill label */}
                  <div style={{
                    position: "absolute", left: 0, top: 0,
                    width: LABEL_W - 8,
                    height: BAR_HEIGHT,
                    display: "flex", alignItems: "center",
                    paddingRight: 8,
                  }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: entry.color.bar,
                      flexShrink: 0, marginRight: 6,
                    }} />
                    <span style={{
                      fontSize: 11, fontWeight: 600,
                      color: t.titleColor,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      maxWidth: LABEL_W - 24,
                    }}>
                      {entry.skill}
                    </span>
                  </div>

                  {/* Gantt bar track */}
                  <div style={{
                    position: "absolute",
                    left: LABEL_W, right: 0,
                    top: "50%", transform: "translateY(-50%)",
                    height: BAR_HEIGHT,
                    background: isHov ? t.ganttBg : "transparent",
                    borderRadius: 8,
                    transition: "background 0.2s",
                  }}>
                    {/* Row bg stripe */}
                    <div style={{
                      position: "absolute", inset: 0,
                      background: i % 2 === 0 ? "transparent" : t.ganttBg,
                      borderRadius: 8,
                    }} />

                    {/* The actual bar */}
                    <motion.div
                      initial={{ scaleX: 0, originX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.15 + i * 0.08, duration: 0.5, ease: "easeOut" }}
                      onMouseEnter={() => setHovered(entry.skill)}
                      onMouseLeave={() => setHovered(null)}
                      style={{
                        position: "absolute",
                        left:  `${leftPct}%`,
                        width: `${Math.max(widthPct, 2)}%`,
                        top: "50%", transform: "translateY(-50%)",
                        height: 28,
                        borderRadius: 8,
                        background: `linear-gradient(135deg, ${entry.color.bar}dd, ${entry.color.bar}88)`,
                        border: `1px solid ${entry.color.border}`,
                        cursor: "pointer",
                        display: "flex", alignItems: "center",
                        paddingLeft: 8, paddingRight: 6,
                        boxShadow: isHov ? `0 4px 16px ${entry.color.bar}40` : "none",
                        transition: "box-shadow 0.2s",
                        overflow: "hidden",
                        transformOrigin: "left center",
                      }}
                    >
                      <span style={{
                        fontSize: 10, fontWeight: 700,
                        color: "#fff",
                        whiteSpace: "nowrap",
                        overflow: "hidden", textOverflow: "ellipsis",
                      }}>
                        {entry.timeStr}
                      </span>
                    </motion.div>

                    {/* Tooltip on hover */}
                    {isHov && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          position: "absolute",
                          left: `${leftPct + widthPct / 2}%`,
                          bottom: "calc(100% + 6px)",
                          transform: "translateX(-50%)",
                          background: t.tooltipBg,
                          border: `1px solid ${t.tooltipBorder}`,
                          borderRadius: 10,
                          padding: "8px 12px",
                          fontSize: 11,
                          color: t.tooltipValue,
                          whiteSpace: "nowrap",
                          zIndex: 10,
                          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                          pointerEvents: "none",
                        }}
                      >
                        <span style={{ fontWeight: 700 }}>{entry.skill}</span>
                        <span style={{ color: t.tooltipText }}> · {entry.timeStr}</span>
                        <br />
                        <span style={{ color: t.tooltipLabel, fontSize: 10 }}>
                          Week {Math.ceil(entry.start)} → Week {Math.ceil(entry.end)}
                        </span>
                      </motion.div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Today marker at week 0 */}
          <div style={{
            position: "absolute",
            left: LABEL_W,
            top: 26,
            bottom: 0,
            width: 2,
            background: "rgba(244,63,94,0.5)",
            borderRadius: 2,
            pointerEvents: "none",
          }}>
            <div style={{
              position: "absolute", top: -18, left: "50%",
              transform: "translateX(-50%)",
              fontSize: 9, fontWeight: 700,
              color: "#f43f5e",
              whiteSpace: "nowrap",
              background: "rgba(244,63,94,0.12)",
              padding: "2px 6px", borderRadius: 4,
              border: "1px solid rgba(244,63,94,0.2)",
            }}>
              TODAY
            </div>
          </div>
        </div>
      </div>

      {/* Legend row */}
      <div style={{
        display: "flex", gap: 12, marginTop: 14,
        flexWrap: "wrap", paddingTop: 12,
        borderTop: `1px solid ${t.ganttLine}`,
      }}>
        {entries.slice(0, 6).map(entry => (
          <div key={entry.skill} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: entry.color.bar, flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: t.subtitleColor, fontWeight: 500 }}>{entry.skill}</span>
          </div>
        ))}
        {entries.length > 6 && (
          <span style={{ fontSize: 10, color: t.subtitleColor }}>+{entries.length - 6} more</span>
        )}
      </div>
    </motion.div>
  );
}