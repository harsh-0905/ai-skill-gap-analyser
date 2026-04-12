import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, RotateCcw, CheckCircle2 } from "lucide-react";

import UploadBox          from "../components/UploadBox";
import SkillTag           from "../components/SkillTag";
import RecommendationCard from "../components/RecommendationCard";
import CircularProgress   from "../components/CircularProgress";
import { analyzeResume }  from "../api";

const ANALYSIS_STEPS = [
  "Uploading files…",
  "Parsing resume…",
  "Extracting skills…",
  "Matching against JD…",
  "Generating recommendations…",
];

export default function Analyze({ onAnalysis, addToast }) {
  const [resumeFile, setResumeFile] = useState(null);
  const [jdFile,     setJdFile]     = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [result,     setResult]     = useState(null);
  const [error,      setError]      = useState(null);
  const [step,       setStep]       = useState(0);

  const handleAnalyze = async () => {
    if (!resumeFile) { addToast("Please upload your resume.", "error"); return; }
    if (!jdFile)     { addToast("Please upload a job description.", "error"); return; }

    setLoading(true); setError(null); setStep(0);

    const stepTimer = setInterval(() => setStep(s => Math.min(s + 1, ANALYSIS_STEPS.length - 1)), 500);

    try {
      const data = await analyzeResume(resumeFile, jdFile);
      setResult(data); onAnalysis(data);
      addToast("Analysis complete!", "success");
    } catch (err) {
      const msg = buildErrorMessage(err);
      setError(msg); addToast(msg, "error");
    } finally {
      clearInterval(stepTimer);
      setLoading(false); setStep(0);
    }
  };

  const handleReset = () => {
    setResult(null); setError(null);
    setResumeFile(null); setJdFile(null);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="px-4 py-5 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-5">

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold mb-1"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
          Analyze Resume
        </h1>
        <p className="text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
          Upload your resume & job description to identify skill gaps
        </p>
      </div>

      {!result ? (
        <div className="space-y-4">
          {/* File uploads */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold mb-2 flex items-center gap-1.5"
                style={{ color: "var(--text-secondary)" }}>
                <FileText size={13} /> Resume <span style={{ color: "#f43f5e" }}>*</span>
              </label>
              <UploadBox label="Upload Resume" file={resumeFile} setFile={setResumeFile} accept=".pdf,.doc,.docx" />
            </div>
            <div>
              <label className="text-xs font-semibold mb-2 flex items-center gap-1.5"
                style={{ color: "var(--text-secondary)" }}>
                <FileText size={13} /> Job Description <span style={{ color: "#f43f5e" }}>*</span>
              </label>
              <UploadBox label="Upload Job Description" file={jdFile} setFile={setJdFile} accept=".pdf,.doc,.docx,.txt" />
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 p-4 rounded-xl"
              style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.3)" }}>
              <span style={{ color: "#f43f5e", flexShrink: 0, marginTop: 2 }}>⚠</span>
              <div>
                <p className="text-xs font-semibold" style={{ color: "#f43f5e" }}>Request failed</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{error}</p>
              </div>
            </motion.div>
          )}

          {/* Analyze button */}
          <div className="flex justify-center">
            <motion.button
              onClick={handleAnalyze}
              disabled={loading || !resumeFile || !jdFile}
              whileTap={{ scale: 0.97 }}
              className="relative flex items-center justify-center gap-2.5 rounded-2xl text-white font-semibold text-sm overflow-hidden w-full sm:w-auto sm:px-10"
              style={{
                height: 52,
                background: "linear-gradient(135deg, #4f8ef7, #a855f7)",
                boxShadow: "0 8px 24px rgba(79,142,247,0.3)",
                opacity: (!resumeFile || !jdFile || loading) ? 0.5 : 1,
                cursor: (!resumeFile || !jdFile || loading) ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (<><Spinner /> Analyzing…</>) : (<><Upload size={16} /> Analyze Now</>)}
              {loading && (
                <motion.div
                  animate={{ x: ["0%", "300%"] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute inset-y-0 w-12 -skew-x-12"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }}
                />
              )}
            </motion.button>
          </div>

          {/* Loading steps */}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="rounded-2xl p-5 space-y-3"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              {ANALYSIS_STEPS.map((s, i) => (
                <motion.div key={s} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.4 }} className="flex items-center gap-3">
                  {i < step ? (
                    <CheckCircle2 size={14} style={{ color: "#10b981", flexShrink: 0 }} />
                  ) : i === step ? (
                    <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}
                      className="w-3.5 h-3.5 rounded-full shrink-0" style={{ background: "#4f8ef7" }} />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{ background: "var(--border-strong)" }} />
                  )}
                  <span className="text-xs"
                    style={{ color: i <= step ? "var(--text-primary)" : "var(--text-muted)" }}>
                    {s}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      ) : (
        <AnalyzeResults result={result} onReset={handleReset} />
      )}
    </motion.div>
  );
}

function AnalyzeResults({ result, onReset }) {
  const matched  = result.matched_skills ?? [];
  const missing  = result.missing_skills ?? [];
  const recs     = result.recommendations ?? {};
  const matchPct = result.match_percentage ?? 0;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

      {/* Score header */}
      <div className="rounded-2xl p-5 sm:p-6"
        style={{
          background: "linear-gradient(135deg, rgba(79,142,247,0.12) 0%, rgba(168,85,247,0.08) 100%)",
          border: "1px solid rgba(99,102,241,0.2)",
        }}>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Ring */}
          <div className="relative flex items-center justify-center shrink-0"
            style={{ width: 100, height: 100 }}>
            <CircularProgress value={matchPct} size={100} stroke={9} id="result" />
            <div className="absolute text-center">
              <p className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{matchPct}%</p>
              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Match</p>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 flex-1 w-full">
            {[
              { label: "Job Domain",    value: result.job_domain },
              { label: "Readiness",     value: result.job_readiness },
              { label: "Time to Ready", value: result.estimated_time_to_job_ready },
              { label: "Total Skills",  value: matched.length + missing.length },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl p-3"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{label}</p>
                <p className="text-sm font-semibold mt-0.5" style={{ color: "var(--text-primary)" }}>
                  {value ?? "—"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Career advice */}
      {result.career_advice && (
        <div className="rounded-2xl p-4"
          style={{ background: "rgba(79,142,247,0.06)", border: "1px solid rgba(79,142,247,0.15)" }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "#4f8ef7" }}>
            Career Advice
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {result.career_advice}
          </p>
        </div>
      )}

      {/* Learning path */}
      {result.learning_path?.length > 0 && (
        <div className="rounded-2xl p-4"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3"
            style={{ color: "var(--text-muted)" }}>
            Learning Path
          </p>
          <div className="flex flex-wrap gap-2">
            {result.learning_path.map((item, i) => (
              <span key={i} className="text-xs px-3 py-1.5 rounded-full font-medium"
                style={{ background: "rgba(79,142,247,0.12)", color: "#4f8ef7", border: "1px solid rgba(79,142,247,0.2)" }}>
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SkillSection title="Matched Skills" skills={matched} matched accentColor="emerald" />
        <SkillSection title="Missing Skills"  skills={missing} matched={false} accentColor="rose" />
      </div>

      {/* Recommendations */}
      {Object.keys(recs).length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
            Recommendations
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible sm:pb-0">
            {Object.entries(recs).map(([skill, data]) => (
              <div key={skill} className="shrink-0 sm:shrink" style={{ minWidth: 240 }}>
                <RecommendationCard skill={skill} data={data} />
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={onReset}
        className="flex items-center gap-2 text-sm font-medium"
        style={{ color: "#4f8ef7", minHeight: 44 }}>
        <RotateCcw size={14} /> Run new analysis
      </button>
    </motion.div>
  );
}

function SkillSection({ title, skills, matched, accentColor }) {
  const colors = {
    emerald: { dot: "#10b981", bg: "rgba(16,185,129,0.1)",  text: "#059669", border: "rgba(16,185,129,0.2)",  countBg: "rgba(16,185,129,0.12)", countText: "#059669" },
    rose:    { dot: "#f43f5e", bg: "rgba(244,63,94,0.1)",   text: "#e11d48", border: "rgba(244,63,94,0.2)",   countBg: "rgba(244,63,94,0.1)",   countText: "#e11d48" },
  };
  const c = colors[accentColor];

  return (
    <div className="rounded-2xl p-4 sm:p-5"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c.dot }} />
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{title}</h3>
        <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: c.countBg, color: c.countText, border: `1px solid ${c.border}` }}>
          {skills.length}
        </span>
      </div>
      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {skills.map(s => <SkillTag key={s} skill={s} matched={matched} />)}
        </div>
      ) : (
        <p className="text-xs italic" style={{ color: "var(--text-muted)" }}>None</p>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      className="inline-block rounded-full border-2 shrink-0"
      style={{ width: 16, height: 16, borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }} />
  );
}

function buildErrorMessage(err) {
  if (err.response) {
    const detail = err.response.data?.detail ?? err.response.data?.message;
    return detail ? `Server error: ${detail}` : `Server returned ${err.response.status}.`;
  }
  if (err.request) return "No response from server. Is FastAPI running?";
  return err.message ?? "Unknown error.";
}