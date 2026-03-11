import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { analyzeResume } from "../services/api";

function DropZone({ label, file, onFileChange, disabled }) {
  const inputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleClick = useCallback(() => {
    if (disabled) return;
    inputRef.current?.click();
  }, [disabled]);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      if (disabled) return;
      const f = e.dataTransfer.files[0];
      if (f?.type === "application/pdf" || f?.name?.toLowerCase().endsWith(".pdf")) {
        onFileChange(f);
      }
    },
    [onFileChange, disabled]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragOver(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (e) => {
      const f = e.target.files?.[0];
      if (f) onFileChange(f);
      e.target.value = "";
    },
    [onFileChange]
  );

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-300">{label}</label>
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => e.key === "Enter" && handleClick()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative rounded-xl border-2 border-dashed p-6 text-center transition-all
          ${
            isDragOver
              ? "border-indigo-400 bg-indigo-500/10"
              : "border-slate-600 bg-slate-800/50 hover:border-slate-500"
          }
          ${disabled ? "pointer-events-none opacity-60" : "cursor-pointer"}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
          aria-hidden="true"
        />
        {file ? (
          <p className="text-indigo-400 font-medium truncate">{file.name}</p>
        ) : (
          <p className="text-slate-400">
            Drag & drop a PDF here or click to select
          </p>
        )}
      </div>
    </div>
  );
}

function UploadCard({ setResult }) {
  const [resumeFile, setResumeFile] = useState(null);
  const [jdFile, setJdFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async () => {
    if (!resumeFile || !jdFile) {
      setError("Please upload both resume and job description (PDF)");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const data = await analyzeResume(resumeFile, jdFile);
      setResult(data);
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const canAnalyze = resumeFile && jdFile && !loading;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-xl mx-auto rounded-2xl bg-slate-900/80 backdrop-blur border border-slate-700/50 p-6 shadow-xl"
    >
      <h2 className="text-lg font-semibold text-white mb-4">Upload Documents</h2>
      <div className="space-y-4">
        <DropZone
          label="Resume (PDF)"
          file={resumeFile}
          onFileChange={setResumeFile}
          disabled={loading}
        />
        <DropZone
          label="Job Description (PDF)"
          file={jdFile}
          onFileChange={setJdFile}
          disabled={loading}
        />
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 text-rose-400 text-sm"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        onClick={handleUpload}
        disabled={!canAnalyze}
        className={`
          mt-6 w-full py-3 px-4 rounded-xl font-semibold transition-all
          ${
            canAnalyze
              ? "bg-indigo-600 hover:bg-indigo-500 text-white"
              : "bg-slate-700 text-slate-400 cursor-not-allowed"
          }
        `}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Analyzing…
          </span>
        ) : (
          "Analyze Resume"
        )}
      </button>
    </motion.div>
  );
}

export default UploadCard;
