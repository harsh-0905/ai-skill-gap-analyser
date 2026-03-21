import { useState } from "react";
import { motion } from "framer-motion";

import UploadBox          from "../components/UploadBox";
import SkillTag           from "../components/SkillTag";
import RecommendationCard from "../components/RecommendationCard";
import CircularProgress   from "../components/CircularProgress";
import { analyzeResume }  from "../api";

// Steps shown in the animated loading panel
const ANALYSIS_STEPS = [
  "Uploading files...",
  "Parsing resume...",
  "Extracting skills...",
  "Matching against JD...",
  "Generating recommendations...",
];

/**
 * Analyze
 * Upload resume + JD (both as files), call POST /analyze, display results.
 * Props: onAnalysis (fn), addToast (fn)
 */
export default function Analyze({ onAnalysis, addToast }) {
  const [resumeFile, setResumeFile] = useState(null);
  const [jdFile,     setJdFile]     = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [result,     setResult]     = useState(null);
  const [error,      setError]      = useState(null);

  // ── Submit handler ──────────────────────────────────────────────────────────
  const handleAnalyze = async () => {
    if (!resumeFile) { addToast("Please upload your resume.", "error"); return; }
    if (!jdFile)     { addToast("Please upload a job description file.", "error"); return; }

    setLoading(true);
    setError(null);

    try {
      const data = await analyzeResume(resumeFile, jdFile);
      setResult(data);
      onAnalysis(data);
      addToast("Analysis complete!", "success");
    } catch (err) {
      const message = buildErrorMessage(err);
      setError(message);
      addToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  // ── Reset ───────────────────────────────────────────────────────────────────
  const handleReset = () => {
    setResult(null);
    setError(null);
    setResumeFile(null);
    setJdFile(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8"
    >
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Analyze Resume</h1>
        <p className="text-white/40 text-sm">
          Upload your resume &amp; job description (PDF / DOC) to identify skill gaps
        </p>
      </div>

      {!result ? (
        <AnalyzeForm
          resumeFile={resumeFile} setResumeFile={setResumeFile}
          jdFile={jdFile}         setJdFile={setJdFile}
          loading={loading}
          error={error}
          onAnalyze={handleAnalyze}
        />
      ) : (
        <AnalyzeResults result={result} onReset={handleReset} />
      )}
    </motion.div>
  );
}

// ── Upload form ───────────────────────────────────────────────────────────────
function AnalyzeForm({
  resumeFile, setResumeFile,
  jdFile, setJdFile,
  loading, error, onAnalyze,
}) {
  return (
    <div className="space-y-6">
      {/* File upload row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-white/70 mb-3 block">
            Resume <span className="text-rose-400">*</span>
          </label>
          <UploadBox
            label="Upload Resume"
            file={resumeFile}
            setFile={setResumeFile}
            accept=".pdf,.doc,.docx"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-white/70 mb-3 block">
            Job Description <span className="text-rose-400">*</span>
          </label>
          <UploadBox
            label="Upload Job Description"
            file={jdFile}
            setFile={setJdFile}
            accept=".pdf,.doc,.docx,.txt"
          />
        </div>
      </div>

      {/* Error banner */}
      {error && <ErrorBanner message={error} />}

      {/* Analyze button */}
      <div className="flex justify-center">
        <motion.button
          onClick={onAnalyze}
          disabled={loading || !resumeFile || !jdFile}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          className="relative flex items-center gap-3 px-8 py-3.5 rounded-2xl
            bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm
            shadow-lg shadow-indigo-500/25
            disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
        >
          {loading ? <><Spinner /> Analyzing…</> : <><span>◈</span> Analyze Now</>}

          {loading && (
            <motion.div
              animate={{ x: ["0%", "200%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
            />
          )}
        </motion.button>
      </div>

      {loading && <AnalysisSteps />}
    </div>
  );
}

// ── Results view ──────────────────────────────────────────────────────────────
function AnalyzeResults({ result, onReset }) {
  const matched  = result.matched_skills ?? [];
  const missing  = result.missing_skills ?? [];
  const recs     = result.recommendations ?? {};
  const matchPct = result.match_percentage ?? 0;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

      {/* Score header */}
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-600/15 to-purple-600/10 p-6 flex flex-wrap items-center gap-8">
        <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
          <CircularProgress value={matchPct} size={96} stroke={9} />
          <div className="absolute text-center">
            <p className="text-xl font-bold text-white">{matchPct}%</p>
            <p className="text-xs text-white/40">Match</p>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-4">
          {[
            { label: "Job Domain",    value: result.job_domain                  },
            { label: "Readiness",     value: result.job_readiness               },
            { label: "Time to Ready", value: result.estimated_time_to_job_ready },
            { label: "Total Skills",  value: matched.length + missing.length    },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-white/40">{label}</p>
              <p className="text-sm font-semibold text-white mt-0.5">{value ?? "—"}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Learning path pills */}
      {result.learning_path?.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Learning Path</p>
          <div className="flex flex-wrap gap-2">
            {result.learning_path.map((item, i) => (
              <span key={i} className="text-xs bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-full">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Skill tags */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkillSection title="Matched Skills" skills={matched} matched    accentColor="emerald" />
        <SkillSection title="Missing Skills" skills={missing} matched={false} accentColor="rose" />
      </div>

      {/* Recommendations */}
      {Object.keys(recs).length > 0 && (
        <div>
          <h3 className="text-white font-semibold mb-4">Recommendations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(recs).map(([skill, data]) => (
              <RecommendationCard key={skill} skill={skill} data={data} />
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onReset}
        className="text-sm text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
      >
        ← Run new analysis
      </button>
    </motion.div>
  );
}

// ── Skill section card ────────────────────────────────────────────────────────
function SkillSection({ title, skills, matched, accentColor }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className={`w-2 h-2 rounded-full bg-${accentColor}-400`} />
        <h3 className="text-white font-semibold">{title}</h3>
        <span className={`ml-auto text-xs px-2 py-0.5 rounded-full border
          bg-${accentColor}-500/10 text-${accentColor}-300 border-${accentColor}-500/20`}>
          {skills.length}
        </span>
      </div>
      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {skills.map((s) => <SkillTag key={s} skill={s} matched={matched} />)}
        </div>
      ) : (
        <p className="text-xs text-white/30 italic">None</p>
      )}
    </div>
  );
}

// ── Error banner ──────────────────────────────────────────────────────────────
function ErrorBanner({ message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 flex items-start gap-3"
    >
      <span className="text-rose-400 mt-0.5 shrink-0">⚠</span>
      <div>
        <p className="text-sm font-medium text-rose-300">Request failed</p>
        <p className="text-xs text-rose-300/70 mt-0.5">{message}</p>
        <p className="text-xs text-white/30 mt-2">
          Make sure FastAPI is running on{" "}
          <code className="bg-white/10 px-1 py-0.5 rounded text-white/50">
            http://127.0.0.1:8000
          </code>{" "}
          and CORS is enabled.
        </p>
      </div>
    </motion.div>
  );
}

// ── Loading step list ─────────────────────────────────────────────────────────
function AnalysisSteps() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4"
    >
      {ANALYSIS_STEPS.map((step, i) => (
        <motion.div
          key={step}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.45 }}
          className="flex items-center gap-3"
        >
          <motion.div
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ repeat: Infinity, duration: 1, delay: i * 0.45 }}
            className="w-2 h-2 rounded-full bg-indigo-400 shrink-0"
          />
          <span className="text-sm text-white/50">{step}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ── Inline spinner ────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block shrink-0"
    />
  );
}

// ── Readable error messages from axios errors ─────────────────────────────────
function buildErrorMessage(err) {
  if (err.response) {
    const status = err.response.status;
    const detail = err.response.data?.detail ?? err.response.data?.message;
    if (detail) return `Server error ${status}: ${detail}`;
    return `Server returned status ${status}. Check your FastAPI logs.`;
  }
  if (err.request) {
    return "No response from server. Is FastAPI running on http://127.0.0.1:8000?";
  }
  return err.message ?? "Unknown error.";
}