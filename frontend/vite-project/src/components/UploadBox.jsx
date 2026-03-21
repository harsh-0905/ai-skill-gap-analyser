import { useState, useRef } from "react";
import { motion } from "framer-motion";

/**
 * UploadBox
 * Drag-and-drop (or click-to-browse) file upload area.
 * Props: label, file, setFile, accept
 */
export default function UploadBox({ label, file, setFile, accept }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  return (
    <motion.div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      animate={{
        borderColor: dragging ? "#6366f1" : "rgba(255,255,255,0.1)",
        background:  dragging ? "rgba(99,102,241,0.08)" : "rgba(255,255,255,0.03)",
      }}
      className="rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all
        hover:border-indigo-500/50 hover:bg-white/5"
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => setFile(e.target.files[0])}
      />

      {file ? (
        /* ── File selected state ── */
        <div>
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-indigo-500/20 flex items-center justify-center text-2xl">
            📄
          </div>
          <p className="text-white font-medium">{file.name}</p>
          <p className="text-white/40 text-sm mt-1">{(file.size / 1024).toFixed(1)} KB</p>
          <button
            onClick={(e) => { e.stopPropagation(); setFile(null); }}
            className="mt-3 text-xs text-rose-400 hover:text-rose-300"
          >
            Remove
          </button>
        </div>
      ) : (
        /* ── Empty / prompt state ── */
        <div>
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-white/5 flex items-center justify-center text-2xl">
            ⬆️
          </div>
          <p className="text-white/80 font-medium">{label}</p>
          <p className="text-white/40 text-sm mt-1">Drag & drop or click to browse</p>
          <p className="text-white/30 text-xs mt-2">{accept?.replace(/,/g, " / ")}</p>
        </div>
      )}
    </motion.div>
  );
}