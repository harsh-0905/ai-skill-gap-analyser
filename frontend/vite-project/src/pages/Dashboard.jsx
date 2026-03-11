import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UploadCard from "../components/UploadCard";
import SkillsList from "../components/SkillsList";

function Dashboard() {
  const [result, setResult] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-950 text-slate-100">
      <header className="border-b border-slate-800/50 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold tracking-tight">AI Skill Gap Analyzer</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <section className="flex justify-center">
          <UploadCard setResult={setResult} />
        </section>

        <AnimatePresence mode="wait">
          {result && (
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="space-y-6"
            >
              {/* Summary cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 }}
                  className="rounded-xl bg-slate-900/60 border border-slate-700/50 p-4"
                >
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Match</p>
                  <p className="text-2xl font-bold text-indigo-400">
                    {result.match_percentage ?? 0}%
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-xl bg-slate-900/60 border border-slate-700/50 p-4"
                >
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Job Readiness</p>
                  <p className="text-2xl font-bold text-emerald-400">{result.job_readiness ?? "—"}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                  className="rounded-xl bg-slate-900/60 border border-slate-700/50 p-4"
                >
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Domain</p>
                  <p className="text-lg font-semibold text-slate-200">{result.job_domain ?? "—"}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-xl bg-slate-900/60 border border-slate-700/50 p-4"
                >
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Time to Ready</p>
                  <p className="text-lg font-semibold text-slate-200">
                    {result.estimated_time_to_job_ready ?? "—"}
                  </p>
                </motion.div>
              </div>

              {/* Skills sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SkillsList title="Detected Skills" skills={result.skills ?? result.matched_skills} />
                <SkillsList title="Missing Skills" skills={result.missing_skills} />
              </div>

              {/* Learning path card */}
              {result.learning_path?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="rounded-xl bg-slate-900/60 border border-slate-700/50 p-6"
                >
                  <h3 className="text-lg font-semibold text-slate-200 mb-4">Learning Path</h3>
                  <ul className="space-y-2">
                    {result.learning_path.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-slate-300"
                      >
                        <span className="text-indigo-400 font-mono text-sm">{i + 1}.</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Recommendations per missing skill */}
              {result.recommendations && Object.keys(result.recommendations).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-slate-200">Recommendations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(result.recommendations).map(([skill, rec]) => (
                      <div
                        key={skill}
                        className="rounded-xl bg-slate-900/60 border border-slate-700/50 p-4 space-y-3"
                      >
                        <p className="font-semibold text-indigo-400">{skill}</p>
                        {rec.youtube_link && (
                          <a
                            href={rec.youtube_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm text-slate-300 hover:text-indigo-400 truncate"
                          >
                            {rec.youtube_title || "Video"}
                          </a>
                        )}
                        {rec.certificate_link && (
                          <a
                            href={rec.certificate_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm text-slate-300 hover:text-indigo-400 truncate"
                          >
                            {rec.certificate_name || "Certificate"}
                          </a>
                        )}
                        {rec.time_to_learn && (
                          <p className="text-xs text-slate-500">{rec.time_to_learn}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default Dashboard;
