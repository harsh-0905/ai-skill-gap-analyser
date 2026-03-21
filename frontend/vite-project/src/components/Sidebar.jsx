import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, ScanSearch, BarChart3, GraduationCap,
  UserCircle, Settings, ChevronRight, Sparkles,
} from "lucide-react";
import { NAV_ITEMS } from "../data/constants";

const ICONS = {
  dashboard: LayoutDashboard,
  analyze:   ScanSearch,
  reports:   BarChart3,
  learning:  GraduationCap,
  profile:   UserCircle,
  settings:  Settings,
};

const MAIN_IDS   = ["dashboard", "analyze", "reports", "learning"];
const BOTTOM_IDS = ["profile", "settings"];

export default function Sidebar({ open, page, setPage, profile }) {
  const initials = (profile?.name || "?")
    .split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const mainNav   = NAV_ITEMS.filter(n => MAIN_IDS.includes(n.id));
  const bottomNav = NAV_ITEMS.filter(n => BOTTOM_IDS.includes(n.id));

  return (
    <motion.aside
      animate={{ width: open ? 240 : 64 }}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
      className="h-full flex flex-col shrink-0 overflow-hidden relative z-20"
      style={{
        background: "linear-gradient(180deg, #09090f 0%, #0b0b14 100%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* ── Subtle top glow ── */}
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%)" }} />

      {/* ── Logo ── */}
      <div className={`relative h-16 flex items-center shrink-0 ${open ? "px-5" : "justify-center"}`}
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 relative"
            style={{ background: "linear-gradient(135deg, #4f8ef7, #a855f7)" }}>
            <Sparkles size={15} className="text-white" />
          </div>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="min-w-0"
              >
                <p className="font-bold text-white text-sm leading-none tracking-tight">SkillGap AI</p>
                <p className="text-[10px] mt-0.5 font-medium" style={{ color: "var(--text-muted)" }}>
                  Career Intelligence
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Main nav ── */}
      <nav className="flex-1 py-4 flex flex-col gap-0.5 px-2.5 overflow-y-auto">
        <AnimatePresence>
          {open && (
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-[10px] font-semibold uppercase tracking-widest px-2 mb-2 mt-1"
              style={{ color: "var(--text-muted)" }}
            >
              Menu
            </motion.p>
          )}
        </AnimatePresence>
        {mainNav.map((item, i) => (
          <NavItem
            key={item.id}
            item={item}
            active={page === item.id}
            open={open}
            onClick={() => setPage(item.id)}
            delay={i * 0.04}
          />
        ))}
      </nav>

      {/* ── Bottom nav ── */}
      <div className="px-2.5 pb-3 space-y-0.5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="pt-3 space-y-0.5">
          {bottomNav.map(item => (
            <NavItem
              key={item.id}
              item={item}
              active={page === item.id}
              open={open}
              onClick={() => setPage(item.id)}
            />
          ))}
        </div>

        {/* ── User strip ── */}
        <AnimatePresence>
          {open && (
            <motion.button
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              onClick={() => setPage("profile")}
              className="w-full mt-2 flex items-center gap-3 px-3 py-2.5 rounded-xl text-left group"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
              whileHover={{ backgroundColor: "rgba(255,255,255,0.07)" }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ background: "linear-gradient(135deg, #4f8ef7, #a855f7)" }}>
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white/80 truncate">
                  {profile?.name || "Set up profile"}
                </p>
                <p className="text-[10px] truncate" style={{ color: "var(--text-muted)" }}>
                  {profile?.email || "Click to edit →"}
                </p>
              </div>
              <ChevronRight size={12} className="text-white/20 shrink-0 group-hover:text-white/40 transition-colors" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}

function NavItem({ item, active, open, onClick, delay = 0 }) {
  const Icon = ICONS[item.id] || LayoutDashboard;

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: open ? 2 : 0 }}
      whileTap={{ scale: 0.97 }}
      title={!open ? item.label : ""}
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.2 }}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-left relative group"
      style={{
        background: active
          ? "linear-gradient(135deg, rgba(79,142,247,0.18) 0%, rgba(168,85,247,0.12) 100%)"
          : "transparent",
        border: active
          ? "1px solid rgba(99,102,241,0.25)"
          : "1px solid transparent",
        color: active ? "#a5b4fc" : "rgba(200,200,220,0.45)",
      }}
    >
      {/* Active glow */}
      {active && (
        <motion.div
          layoutId="activeGlow"
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{ boxShadow: "inset 0 0 20px rgba(99,102,241,0.1)" }}
        />
      )}

      <Icon
        size={16}
        className="shrink-0 transition-colors"
        style={{ color: active ? "#818cf8" : "rgba(200,200,220,0.4)" }}
      />
      {open && (
        <span className="whitespace-nowrap truncate" style={{ color: active ? "#c7d2fe" : "rgba(200,200,220,0.6)" }}>
          {item.label}
        </span>
      )}
      {open && active && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: "linear-gradient(135deg, #4f8ef7, #a855f7)" }} />
      )}
    </motion.button>
  );
}