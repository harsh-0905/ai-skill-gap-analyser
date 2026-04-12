import { useState, useRef } from "react";
import { motion } from "framer-motion";

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
        borderColor: dragging ? "#6366f1" : "var(--border-strong)",
        background:  dragging ? "rgba(99,102,241,0.08)" : "var(--bg-card)",
      }}
      style={{ borderRadius: 16, borderWidth: 2, borderStyle: "dashed", padding: "40px 24px", textAlign: "center", cursor: "pointer" }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => setFile(e.target.files[0])}
      />

      {file ? (
        <div>
          <div style={{
            width: 48, height: 48, margin: "0 auto 12px",
            borderRadius: 12,
            background: "rgba(99,102,241,0.15)",
            border: "1px solid rgba(99,102,241,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
          }}>
            📄
          </div>
          <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: 14 }}>{file.name}</p>
          <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 4 }}>
            {(file.size / 1024).toFixed(1)} KB
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); setFile(null); }}
            style={{
              marginTop: 10, fontSize: 12,
              color: "#f43f5e", background: "none", border: "none", cursor: "pointer",
            }}
          >
            Remove
          </button>
        </div>
      ) : (
        <div>
          <div style={{
            width: 48, height: 48, margin: "0 auto 12px",
            borderRadius: 12,
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
          }}>
            ⬆️
          </div>
          <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: 14 }}>{label}</p>
          <p style={{ color: "var(--text-secondary)", fontSize: 12, marginTop: 4 }}>
            Drag & drop or click to browse
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: 11, marginTop: 6 }}>
            {accept?.replace(/,/g, " / ")}
          </p>
        </div>
      )}
    </motion.div>
  );
}