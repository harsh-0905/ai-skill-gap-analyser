import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, Bell, Sun, Moon, ChevronDown, LogOut, User, Settings } from "lucide-react";

const NOTIFICATIONS = [
  { text: "Analysis complete — 87.5% match found", time: "Just now",  color: "#818cf8" },
  { text: "New course: Docker for Engineers added", time: "2h ago",    color: "#10b981" },
  { text: "Weekly progress report is ready",        time: "Yesterday", color: "#a855f7" },
];

export default function Navbar({ darkMode, setDarkMode, sidebarOpen, setSidebarOpen, profile, onNavigate }) {
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const initials = (profile?.name || "?")
    .split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const closeAll = () => { setNotifOpen(false); setProfileOpen(false); };

  return (
    <header
      className="h-14 flex items-center px-4 gap-3 sticky top-0 z-30"
      style={{
        background: "rgba(6,6,8,0.82)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Hamburger */}
      <motion.button
        whileTap={{ scale: 0.93 }}
        onClick={() => setSidebarOpen(p => !p)}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/6 shrink-0"
        style={{ border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <Menu size={15} />
      </motion.button>

      {/* Search */}
      <div className="flex-1 max-w-xs">
        <div
          className="flex items-center gap-2.5 rounded-xl px-3 py-2 cursor-text group hover:border-white/15 transition-colors"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <Search size={13} className="text-white/25 group-hover:text-white/40 transition-colors shrink-0" />
          <span className="text-xs text-white/25 flex-1">Search skills, reports…</span>
          <kbd className="text-[10px] px-1.5 py-0.5 rounded text-white/20"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-2 ml-auto">

        {/* Dark mode */}
        <motion.button
          whileTap={{ scale: 0.9, rotate: 15 }}
          onClick={() => setDarkMode(p => !p)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/6 transition-colors"
          style={{ border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {darkMode ? <Sun size={14} /> : <Moon size={14} />}
        </motion.button>

        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => { setNotifOpen(p => !p); setProfileOpen(false); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/6 transition-colors relative"
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <Bell size={14} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--accent-blue)" }} />
          </motion.button>

          <AnimatePresence>
            {notifOpen && (
              <FloatingPanel className="w-80 right-0 top-11">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-white">Notifications</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{ background: "rgba(79,142,247,0.15)", color: "#93c5fd", border: "1px solid rgba(79,142,247,0.2)" }}>
                    {NOTIFICATIONS.length} new
                  </span>
                </div>
                <div className="space-y-1">
                  {NOTIFICATIONS.map((n, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
                    >
                      <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: n.color }} />
                      <div>
                        <p className="text-xs text-white/75 leading-snug">{n.text}</p>
                        <p className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>{n.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </FloatingPanel>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => { setProfileOpen(p => !p); setNotifOpen(false); }}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-white/6 transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-white shrink-0"
              style={{ background: "linear-gradient(135deg, #4f8ef7, #a855f7)" }}
            >
              {initials}
            </div>
            <ChevronDown size={12} className="text-white/30" />
          </motion.button>

          <AnimatePresence>
            {profileOpen && (
              <FloatingPanel className="w-56 right-0 top-11">
                {/* User header */}
                <div className="p-3 mb-2 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ background: "linear-gradient(135deg, #4f8ef7, #a855f7)" }}>
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {profile?.name || "Your Name"}
                      </p>
                      <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                        {profile?.email || "—"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="h-px mb-2" style={{ background: "rgba(255,255,255,0.07)" }} />

                {[
                  { label: "View Profile", id: "profile",  Icon: User },
                  { label: "Settings",     id: "settings", Icon: Settings },
                ].map(({ label, id, Icon }) => (
                  <button
                    key={id}
                    onClick={() => { onNavigate(id); closeAll(); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors text-left"
                    style={{ color: "rgba(200,200,220,0.65)" }}
                  >
                    <Icon size={14} className="text-white/25" />
                    {label}
                  </button>
                ))}

                <div className="h-px my-1.5" style={{ background: "rgba(255,255,255,0.07)" }} />

                <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium hover:bg-rose-500/10 transition-colors text-left"
                  style={{ color: "rgba(244,63,94,0.7)" }}>
                  <LogOut size={14} />
                  Sign out
                </button>
              </FloatingPanel>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

function FloatingPanel({ children, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.14, ease: [0.4, 0, 0.2, 1] }}
      className={`absolute z-50 rounded-2xl p-2 shadow-2xl ${className}`}
      style={{
        background: "#111118",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 24px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
      }}
    >
      {children}
    </motion.div>
  );
}