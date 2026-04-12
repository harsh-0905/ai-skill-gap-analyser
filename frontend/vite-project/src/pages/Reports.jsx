import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Search } from "lucide-react";

import { ProgressAreaChart } from "../components/Charts";
import { REPORTS_TABLE }     from "../data/constants";

const FILTERS = ["All", "Matched", "Missing"];

const PRIORITY_STYLES = {
  High:   { bg: "rgba(244,63,94,0.1)",  text: "#fda4af", border: "rgba(244,63,94,0.2)"  },
  Medium: { bg: "rgba(245,158,11,0.1)", text: "#fcd34d", border: "rgba(245,158,11,0.2)" },
  Low:    { bg: "rgba(79,142,247,0.1)", text: "#93c5fd", border: "rgba(79,142,247,0.2)" },
};

export default function Reports() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = REPORTS_TABLE.filter(
    r => (filter === "All" || r.status === filter) &&
         r.skill.toLowerCase().includes(search.toLowerCase())
  );

  const matched = REPORTS_TABLE.filter(r => r.status === "Matched").length;
  const missing = REPORTS_TABLE.filter(r => r.status === "Missing").length;
  const total   = REPORTS_TABLE.length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="px-4 py-5 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-5">

      {/* Header — stacked on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold mb-0.5"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Reports</h1>
          <p className="text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
            Detailed skill gap analysis and progress tracking
          </p>
        </div>
        <motion.button whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-2 rounded-xl text-white text-sm font-semibold self-start sm:self-auto"
          style={{
            height: 44, paddingLeft: 16, paddingRight: 16,
            background: "linear-gradient(135deg, #4f8ef7, #6366f1)",
          }}>
          <Download size={14} /> Export PDF
        </motion.button>
      </div>

      {/* Summary cards — 2×2 on mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Skills", value: total,   color: "var(--text-primary)" },
          { label: "Matched",      value: matched,  color: "#6ee7b7" },
          { label: "Missing",      value: missing,  color: "#fda4af" },
          { label: "Match Rate",   value: `${Math.round((matched / total) * 100)}%`, color: "#93c5fd" },
        ].map(({ label, value, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="rounded-2xl p-4"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-xl sm:text-2xl font-bold mb-0.5" style={{ color }}>{value}</p>
            <p className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Table card */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 p-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          {/* Search */}
          <div className="flex items-center gap-2 flex-1 rounded-xl px-3"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", height: 40 }}>
            <Search size={13} className="text-white/30 shrink-0" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search skills…"
              className="flex-1 bg-transparent text-sm text-white placeholder-white/25 focus:outline-none"
              aria-label="Search skills"
            />
          </div>
          {/* Filter tabs */}
          <div className="flex gap-1 bg-white/5 rounded-xl p-1" role="group" aria-label="Filter by status">
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="flex-1 sm:flex-none text-xs font-semibold px-3 rounded-lg transition-all"
                style={{
                  height: 32,
                  background: filter === f ? "rgba(99,102,241,0.3)" : "transparent",
                  color: filter === f ? "#c7d2fe" : "rgba(200,200,220,0.4)",
                  border: filter === f ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent",
                }}
                aria-pressed={filter === f}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table — horizontal scroll on mobile */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ minWidth: 500 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                {["Skill", "Category", "Status", "Priority", "Time"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((row, i) => (
                  <motion.tr key={row.skill}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.025 }}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                    className="hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3.5 font-semibold text-white text-sm">{row.skill}</td>
                    <td className="px-4 py-3.5 text-xs" style={{ color: "var(--text-secondary)" }}>{row.category}</td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={row.status === "Matched"
                          ? { background: "rgba(16,185,129,0.1)", color: "#6ee7b7", border: "1px solid rgba(16,185,129,0.2)" }
                          : { background: "rgba(244,63,94,0.1)",  color: "#fda4af", border: "1px solid rgba(244,63,94,0.2)"  }}>
                        {row.status === "Matched" ? "✓" : "✕"} {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {row.priority !== "—" ? (
                        <span className="text-[11px] px-2 py-0.5 rounded-lg font-semibold"
                          style={PRIORITY_STYLES[row.priority]
                            ? { background: PRIORITY_STYLES[row.priority].bg, color: PRIORITY_STYLES[row.priority].text, border: `1px solid ${PRIORITY_STYLES[row.priority].border}` }
                            : { color: "var(--text-muted)" }}>
                          {row.priority}
                        </span>
                      ) : <span style={{ color: "var(--text-muted)" }}>—</span>}
                    </td>
                    <td className="px-4 py-3.5 text-xs" style={{ color: "var(--text-secondary)" }}>{row.time}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm" style={{ color: "var(--text-muted)" }}>
              No skills match your filter
            </div>
          )}
        </div>
      </div>

      {/* Progress chart */}
      <div className="rounded-2xl p-4 sm:p-6"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Learning Trajectory</h3>
        <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>Projected readiness over 7 weeks</p>
        <ProgressAreaChart gradientId="reportsGradMobile" height={180} />
      </div>
    </motion.div>
  );
}