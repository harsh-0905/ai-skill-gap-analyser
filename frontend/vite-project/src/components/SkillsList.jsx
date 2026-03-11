import { motion } from "framer-motion";

const TAG_COLORS = [
  "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
  "bg-amber-500/20 text-amber-400 border-amber-500/40",
  "bg-rose-500/20 text-rose-400 border-rose-500/40",
  "bg-violet-500/20 text-violet-400 border-violet-500/40",
  "bg-sky-500/20 text-sky-400 border-sky-500/40",
  "bg-cyan-500/20 text-cyan-400 border-cyan-500/40",
];

function getTagClass(index) {
  return TAG_COLORS[index % TAG_COLORS.length];
}

function SkillsList({ title, skills }) {
  if (!skills?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-slate-900/60 border border-slate-700/50 p-4"
    >
      <h3 className="text-sm font-semibold text-slate-300 mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={skill}
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getTagClass(
              index
            )}`}
          >
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default SkillsList;
