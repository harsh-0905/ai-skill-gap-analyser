import { useState } from "react";
import { motion } from "framer-motion";
import { Play, BookOpen, Clock, ExternalLink, Youtube } from "lucide-react";

function extractYouTubeId(url) {
  if (!url || typeof url !== "string") return null;
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return m ? m[1] : null;
}

function getThumbUrl(videoId, quality = "mqdefault") {
  return videoId ? `https://i.ytimg.com/vi/${videoId}/${quality}.jpg` : null;
}

function safeHref(url) {
  if (!url) return "#";
  return url.startsWith("http") ? url : `https://${url}`;
}

export default function RecommendationCard({ skill, data }) {
  const videoId  = extractYouTubeId(data?.youtube_link);
  const thumbUrl = getThumbUrl(videoId);
  const thumbHq  = getThumbUrl(videoId, "hqdefault");
  const [imgErr, setImgErr] = useState(false);
  const [useHq,  setUseHq]  = useState(false);

  const handleImgError = () => {
    if (!useHq) setUseHq(true);
    else setImgErr(true);
  };

  const youtubeUrl = safeHref(data?.youtube_link);
  const courseUrl  = safeHref(data?.certificate_link);
  const showThumb  = (thumbUrl || thumbHq) && !imgErr;
  const currentSrc = useHq ? thumbHq : thumbUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(99,102,241,0.2)" }}
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Thumbnail */}
      <a href={youtubeUrl} target="_blank" rel="noopener noreferrer"
        className="relative block overflow-hidden group flex-shrink-0"
        style={{ aspectRatio: "16/9" }}>
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
          <div className="w-full h-full flex flex-col items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, rgba(79,142,247,0.25), rgba(168,85,247,0.18))" }}>
            <Youtube size={28} style={{ color: "rgba(255,255,255,0.5)" }} />
            <span className="text-xs font-medium capitalize"
              style={{ color: "rgba(255,255,255,0.4)" }}>{skill}</span>
          </div>
        )}

        {/* Play overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.4)" }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)" }}>
            <Play size={18} style={{ color: "white", fill: "white", marginLeft: 2 }} />
          </div>
        </div>

        {/* YouTube badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-lg"
          style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="w-3 h-3 rounded-sm flex items-center justify-center" style={{ background: "#ff0000" }}>
            <Play size={6} style={{ color: "white", fill: "white" }} />
          </div>
          <span className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>YouTube</span>
        </div>

        {/* Duration badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg"
          style={{ background: "rgba(0,0,0,0.7)" }}>
          <Clock size={9} style={{ color: "rgba(255,255,255,0.6)" }} />
          <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.7)" }}>
            {data?.time_to_learn ?? "—"}
          </span>
        </div>
      </a>

      {/* Card body */}
      <div className="p-4 flex flex-col flex-1 gap-3">

        {/* Skill badge */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: "rgba(244,63,94,0.12)", color: "#e11d48", border: "1px solid rgba(244,63,94,0.2)" }}>
            MISSING
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}>
            {skill}
          </span>
        </div>

        {/* Video title */}
        <a href={youtubeUrl} target="_blank" rel="noopener noreferrer"
          className="text-sm font-semibold leading-snug line-clamp-2 transition-colors hover:underline"
          style={{ color: "var(--text-primary)", textDecorationColor: "#4f8ef7" }}>
          {data?.youtube_title ?? `Learn ${skill}`}
        </a>

        <div className="h-px" style={{ background: "var(--border)" }} />

        {/* Certificate row */}
        <div className="flex items-start gap-2.5 flex-1">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.2)" }}>
            <BookOpen size={13} style={{ color: "#a855f7" }} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold line-clamp-2 mb-1"
              style={{ color: "var(--text-secondary)" }}>
              {data?.certificate_name ?? `${skill} Certification`}
            </p>
            <a href={courseUrl} target="_blank" rel="noopener noreferrer"
              className="text-[10px] flex items-center gap-1 hover:underline"
              style={{ color: "#a855f7" }}>
              View Course <ExternalLink size={9} />
            </a>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex gap-2 mt-auto">
          <motion.a href={youtubeUrl} target="_blank" rel="noopener noreferrer"
            whileTap={{ scale: 0.97 }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-white text-xs font-bold"
            style={{ background: "linear-gradient(135deg, #4f8ef7, #6366f1)" }}>
            <Play size={11} style={{ fill: "white" }} />
            Watch
          </motion.a>
          <motion.a href={courseUrl} target="_blank" rel="noopener noreferrer"
            whileTap={{ scale: 0.97 }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold"
            style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)", color: "#a855f7" }}>
            <BookOpen size={11} />
            Course
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}