import { useState } from "react";
import { motion } from "framer-motion";
import { Play, BookOpen, Clock, ExternalLink, Youtube } from "lucide-react";

// ── Extract video ID from any YouTube URL format ──────────────────────────────
function extractYouTubeId(url) {
  if (!url || typeof url !== "string") return null;
  // Handles: watch?v=, youtu.be/, /embed/, /shorts/
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return m ? m[1] : null;
}

// ── Thumbnail URL — use i.ytimg.com (CORS-safe, works from localhost) ─────────
function getThumbUrl(videoId, quality = "mqdefault") {
  // i.ytimg.com is the CDN YouTube itself uses — no CORS issues
  return videoId ? `https://i.ytimg.com/vi/${videoId}/${quality}.jpg` : null;
}

// ── Safe link opener — ensure URL has protocol ────────────────────────────────
function safeHref(url) {
  if (!url) return "#";
  return url.startsWith("http") ? url : `https://${url}`;
}

export default function RecommendationCard({ skill, data }) {
  const videoId    = extractYouTubeId(data?.youtube_link);
  const thumbUrl   = getThumbUrl(videoId);
  const thumbHq    = getThumbUrl(videoId, "hqdefault");
  const [imgErr,   setImgErr]   = useState(false);
  const [useHq,    setUseHq]    = useState(false);

  // Try hqdefault if mqdefault fails, then give up and show fallback
  const handleImgError = () => {
    if (!useHq) { setUseHq(true); }
    else { setImgErr(true); }
  };

  const youtubeUrl  = safeHref(data?.youtube_link);
  const courseUrl   = safeHref(data?.certificate_link);
  const showThumb   = (thumbUrl || thumbHq) && !imgErr;
  const currentSrc  = useHq ? thumbHq : thumbUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, boxShadow: "0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)" }}
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* ── YouTube Thumbnail ── */}
      <a
        href={youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block overflow-hidden group flex-shrink-0"
        style={{ aspectRatio: "16/9" }}
      >
        {showThumb ? (
          <img
            src={currentSrc}
            alt={data?.youtube_title ?? skill}
            onError={handleImgError}
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ display: "block" }}
          />
        ) : (
          /* Gradient fallback when image truly can't load */
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, rgba(79,142,247,0.35), rgba(168,85,247,0.25))" }}
          >
            <Youtube size={28} className="text-white/50" />
            <span className="text-xs font-medium text-white/40 capitalize">{skill}</span>
          </div>
        )}

        {/* Dark hover overlay with play button */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.45)" }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.22)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.35)",
            }}
          >
            <Play size={18} className="text-white fill-white ml-0.5" />
          </div>
        </div>

        {/* YouTube badge */}
        <div
          className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-lg"
          style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)" }}
        >
          <div className="w-3 h-3 rounded-sm flex items-center justify-center" style={{ background: "#ff0000" }}>
            <Play size={6} className="text-white fill-white" />
          </div>
          <span className="text-[10px] font-medium text-white/80">YouTube</span>
        </div>

        {/* Duration badge */}
        <div
          className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg"
          style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)" }}
        >
          <Clock size={9} className="text-white/60" />
          <span className="text-[10px] text-white/70">{data?.time_to_learn ?? "—"}</span>
        </div>
      </a>

      {/* ── Card Body ── */}
      <div className="p-4 flex flex-col flex-1 gap-3">

        {/* Skill + missing badge */}
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: "rgba(244,63,94,0.15)", color: "#fda4af", border: "1px solid rgba(244,63,94,0.25)" }}
          >
            MISSING
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "rgba(200,200,220,0.4)" }}>
            {skill}
          </span>
        </div>

        {/* Video title — clickable */}
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold leading-snug line-clamp-2 transition-colors hover:underline"
          style={{ color: "rgba(220,220,240,0.9)", textDecorationColor: "#4f8ef7" }}
        >
          {data?.youtube_title ?? `Learn ${skill}`}
        </a>

        <div className="h-px" style={{ background: "rgba(255,255,255,0.07)" }} />

        {/* Certificate row */}
        <div className="flex items-start gap-2.5 flex-1">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.2)" }}
          >
            <BookOpen size={13} style={{ color: "#c084fc" }} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold line-clamp-2 mb-1" style={{ color: "rgba(220,220,240,0.8)" }}>
              {data?.certificate_name ?? `${skill} Certification`}
            </p>
            <a
              href={courseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] flex items-center gap-1 transition-colors hover:underline"
              style={{ color: "#c084fc", textDecorationColor: "#c084fc" }}
            >
              View Course <ExternalLink size={9} />
            </a>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex gap-2 mt-auto">
          <motion.a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.97 }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-white text-xs font-bold transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #4f8ef7, #6366f1)" }}
          >
            <Play size={11} className="fill-white" />
            Watch
          </motion.a>
          <motion.a
            href={courseUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.97 }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-colors"
            style={{
              background: "rgba(168,85,247,0.15)",
              border: "1px solid rgba(168,85,247,0.3)",
              color: "#c084fc",
            }}
          >
            <BookOpen size={11} />
            Course
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}