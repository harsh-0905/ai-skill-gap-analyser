import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { ProgressAreaChart } from "../components/Charts";
import { REPORTS_TABLE }     from "../data/constants";

const FILTERS = ["All", "Matched", "Missing"];

const PRIORITY_STYLES = {
  High:   "bg-rose-500/10 text-rose-300 border-rose-500/20",
  Medium: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  Low:    "bg-blue-500/10 text-blue-300 border-blue-500/20",
};

/**
 * Reports
 * Searchable/filterable skills gap table + progress chart + PDF export.
 */
export default function Reports() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = REPORTS_TABLE.filter(
    (r) =>
      (filter === "All" || r.status === filter) &&
      r.skill.toLowerCase().includes(search.toLowerCase())
  );

  const matched = REPORTS_TABLE.filter((r) => r.status === "Matched").length;
  const missing = REPORTS_TABLE.filter((r) => r.status === "Missing").length;
  const total   = REPORTS_TABLE.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8"
    >
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Reports</h1>
          <p className="text-white/40 text-sm">Detailed skill gap analysis and progress tracking</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
        >
          ⬇ Export PDF
        </motion.button>
      </div>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Skills", value: total,   color: "text-white" },
          { label: "Matched",      value: matched,  color: "text-emerald-300" },
          { label: "Missing",      value: missing,  color: "text-rose-300" },
          { label: "Match Rate",   value: `${Math.round((matched / total) * 100)}%`, color: "text-indigo-300" },
        ].map(({ label, value, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <p className={`text-2xl font-bold mb-1 ${color}`}>{value}</p>
            <p className="text-xs text-white/40">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Skills gap table ── */}
      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        {/* Table toolbar */}
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-white/8">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills..."
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white
              placeholder-white/30 focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
          <div className="flex gap-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all
                  ${filter === f
                    ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/30"
                    : "text-white/40 hover:text-white/60 hover:bg-white/5"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                {["Skill", "Category", "Status", "Priority", "Time to Learn"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-6 py-3 text-white/40 font-medium text-xs uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((row, i) => (
                  <motion.tr
                    key={row.skill}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-3.5 font-medium text-white">{row.skill}</td>
                    <td className="px-6 py-3.5 text-white/50">{row.category}</td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-6 py-3.5">
                      {row.priority !== "—" ? (
                        <span className={`text-xs px-2 py-1 rounded-lg border ${PRIORITY_STYLES[row.priority]}`}>
                          {row.priority}
                        </span>
                      ) : (
                        <span className="text-white/20">—</span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-white/50">{row.time}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-white/30 text-sm">
              No skills match your filter
            </div>
          )}
        </div>
      </div>

      {/* ── Progress chart ── */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-white font-semibold mb-2">Learning Trajectory</h3>
        <p className="text-white/40 text-xs mb-6">Projected readiness over 7 weeks</p>
        <ProgressAreaChart gradientId="reportsGrad" height={200} />
      </div>
    </motion.div>
  );
}

// ── Status pill ───────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const isMatched = status === "Matched";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
        ${isMatched
          ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
          : "bg-rose-500/10 text-rose-300 border-rose-500/30"}`}
    >
      {isMatched ? "✓" : "✕"} {status}
    </span>
  );
}