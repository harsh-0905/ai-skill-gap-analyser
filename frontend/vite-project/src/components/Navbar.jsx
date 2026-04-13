import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, Bell, Sun, Moon, LogOut, User,
  Settings, ChevronDown, X, Search,
  LayoutDashboard, ScanSearch, BarChart3, GraduationCap, Zap,
} from "lucide-react";

const NOTIFICATIONS = [
  { text: "Analysis complete — 87.5% match found", time: "Just now",   color: "#818cf8" },
  { text: "New course: Docker for Engineers added", time: "2h ago",    color: "#10b981" },
  { text: "Weekly progress report is ready",        time: "Yesterday", color: "#a855f7" },
];

// IDs match PageRouter in SkillGapAnalyzer.jsx exactly
const NAV_TABS = [
  { id: "dashboard", label: "Dashboard",     Icon: LayoutDashboard },
  { id: "analyze",   label: "Analyze",       Icon: ScanSearch      },
  { id: "reports",   label: "Reports",       Icon: BarChart3       },
  { id: "learning",  label: "Learning Path", Icon: GraduationCap   },
];

export default function Navbar({
  darkMode, setDarkMode,
  sidebarOpen, setSidebarOpen,
  profile, onNavigate, isDesktop,
  page,       // ← current active page from SkillGapAnalyzer state
  onSignOut,  // ← reset handler from SkillGapAnalyzer
}) {
  const [notifOpen,     setNotifOpen]     = useState(false);
  const [profileOpen,   setProfileOpen]   = useState(false);
  const [searchValue,   setSearchValue]   = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const initials = (profile?.name || "??")
    .split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const closeAll = () => { setNotifOpen(false); setProfileOpen(false); };

  const handleNav = (id) => {
    onNavigate?.(id);
    closeAll();
  };

  const handleSignOut = () => {
    closeAll();
    onSignOut?.();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700&display=swap');

        .sp-navbar *, .sp-navbar *::before, .sp-navbar *::after { box-sizing: border-box; }

        .sp-navbar {
          height: 52px; flex-shrink: 0;
          display: flex; align-items: center;
          padding: 0 10px; gap: 6px;
          background: var(--bg-navbar);
          border-bottom: 1px solid var(--border);
          position: sticky; top: 0; z-index: 40;
          overflow: visible;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .sp-navbar::after {
          content: '';
          position: absolute; top: 0; left: 50%; transform: translateX(-50%);
          width: 38%; height: 1px; pointer-events: none;
          background: linear-gradient(90deg, transparent, rgba(124,111,255,0.4), transparent);
        }

        .sp-ibtn {
          width: 34px; height: 34px; min-width: 34px;
          border-radius: 8px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: var(--bg-card);
          border: 1px solid var(--border);
          cursor: pointer; position: relative;
          color: var(--text-secondary);
          transition: background 0.15s, border-color 0.15s, color 0.15s;
          padding: 0; line-height: 1;
        }
        .sp-ibtn:hover {
          background: var(--bg-card-hover, rgba(255,255,255,0.08));
          border-color: var(--border-strong);
          color: var(--text-primary);
        }
        .sp-ibtn svg { display: block; flex-shrink: 0; stroke: currentColor; fill: none; }

        .sp-logo {
          width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0;
          background: linear-gradient(135deg, #7c6fff 0%, #c084fc 100%);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 14px rgba(124,111,255,0.3);
        }

        .sp-brand {
          font-family: 'Syne', system-ui, sans-serif;
          font-size: 15px; font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.01em; white-space: nowrap; flex-shrink: 0;
        }
        .sp-brand .accent { color: #8b7fff; }
        .sp-brand .sub {
          color: var(--text-muted);
          font-weight: 400; font-size: 11.5px; margin-left: 2px;
        }

        .sp-divider {
          width: 1px; height: 20px;
          background: var(--border); flex-shrink: 0; margin: 0 2px;
        }

        .sp-tabs { display: flex; align-items: center; gap: 1px; flex: 1; }
        .sp-tab {
          display: flex; align-items: center; gap: 5px;
          padding: 5px 10px; border-radius: 7px;
          font-size: 13px; font-weight: 400;
          color: var(--text-muted);
          background: transparent; border: none; cursor: pointer;
          white-space: nowrap; transition: background 0.14s, color 0.14s;
          font-family: inherit; line-height: 1;
        }
        .sp-tab:hover { background: var(--bg-card); color: var(--text-primary); }
        .sp-tab.active { background: rgba(124,111,255,0.15); color: #8b7fff; font-weight: 500; }
        .sp-tab svg { display: block; flex-shrink: 0; stroke: currentColor; fill: none; }

        .sp-search {
          display: flex; align-items: center; gap: 7px;
          height: 32px; width: 176px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 8px; padding: 0 10px;
          transition: border-color 0.15s, background 0.15s, width 0.2s;
          cursor: text; flex-shrink: 0;
        }
        .sp-search:hover { background: var(--bg-card-hover, rgba(255,255,255,0.07)); }
        .sp-search.focused {
          background: var(--bg-card-hover, rgba(255,255,255,0.07));
          border-color: rgba(124,111,255,0.45);
          width: 210px;
        }
        .sp-search input {
          background: transparent; border: none; outline: none;
          font-size: 12.5px; color: var(--text-primary);
          width: 100%; font-family: inherit;
        }
        .sp-search input::placeholder { color: var(--text-muted); }
        .sp-kbd {
          font-size: 10px; color: var(--text-muted);
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 4px; padding: 1px 5px;
          flex-shrink: 0; font-family: monospace;
        }

        .sp-notif-dot {
          position: absolute; top: 8px; right: 8px;
          width: 6px; height: 6px; border-radius: 50%;
          background: #7c6fff; border: 1.5px solid var(--bg-navbar);
          pointer-events: none;
        }

        .sp-avatar-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 3px 7px 3px 3px; border-radius: 9px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          cursor: pointer; flex-shrink: 0;
          transition: background 0.14s, border-color 0.14s;
        }
        .sp-avatar-btn:hover {
          background: var(--bg-card-hover, rgba(255,255,255,0.07));
          border-color: var(--border-strong);
        }
        .sp-avatar-circle {
          width: 26px; height: 26px; border-radius: 7px; flex-shrink: 0;
          background: linear-gradient(135deg, #7c6fff, #ec4899);
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 700; color: #fff;
        }

        .sp-panel {
          position: fixed;
          top: 58px; right: 8px;
          z-index: 50;
          border-radius: 14px; padding: 8px;
          background: var(--bg-elevated);
          border: 1px solid var(--border-strong);
          box-shadow: 0 20px 48px rgba(0,0,0,0.6);
        }

        .sp-nrow {
          display: flex; gap: 10px; padding: 9px 8px;
          border-radius: 9px; cursor: pointer; align-items: flex-start;
          transition: background 0.12s;
        }
        .sp-nrow:hover { background: var(--bg-card); }

        .sp-mitem {
          width: 100%; display: flex; align-items: center; gap: 10px;
          padding: 0 10px; border-radius: 9px; cursor: pointer;
          font-size: 13px; font-weight: 500; color: var(--text-secondary);
          background: transparent; border: none; min-height: 38px;
          text-align: left; transition: background 0.12s, color 0.12s;
          font-family: inherit;
        }
        .sp-mitem:hover { background: var(--bg-card); color: var(--text-primary); }
        .sp-mitem.danger { color: rgba(244,63,94,0.85); }
        .sp-mitem.danger:hover { background: rgba(244,63,94,0.09); color: rgb(244,63,94); }
        .sp-mitem svg { display: block; flex-shrink: 0; stroke: currentColor; fill: none; }

        .sp-sep { height: 1px; background: var(--border); margin: 4px 0; }

        @media (max-width: 980px) {
          .sp-tabs    { display: none !important; }
          .sp-divider { display: none !important; }
        }
        @media (max-width: 680px) {
          .sp-search { display: none !important; }
        }
      `}</style>

      <nav className="sp-navbar">

        {/* Hamburger */}
        <button className="sp-ibtn"
          onClick={() => setSidebarOpen(p => !p)}
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}>
          {!isDesktop && sidebarOpen ? <X size={15} /> : <Menu size={15} />}
        </button>

        {/* Logo + Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <div className="sp-logo">
            <Zap size={15} strokeWidth={2.5} style={{ stroke: "none", fill: "#fff" }} />
          </div>
          <span className="sp-brand">
            Skill<span className="accent">Gap</span><span className="sub">AI</span>
          </span>
        </div>

        <div className="sp-divider" />

        {/* Nav Tabs — highlights based on `page` prop, calls onNavigate on click */}
        <div className="sp-tabs">
          {NAV_TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`sp-tab${page === id ? " active" : ""}`}
              onClick={() => handleNav(id)}
              aria-current={page === id ? "page" : undefined}
            >
              <Icon size={13} strokeWidth={1.8} />
              {label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div
          className={`sp-search${searchFocused ? " focused" : ""}`}
          onClick={() => document.getElementById("sp-search-inp")?.focus()}
        >
          <Search size={13} strokeWidth={2} color={searchFocused ? "#8b7fff" : "var(--text-muted)"} />
          <input
            id="sp-search-inp" type="text" placeholder="Search skills…"
            value={searchValue} onChange={e => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
          />
          {!searchFocused && <span className="sp-kbd">⌘K</span>}
        </div>

        {/* Dark / Light mode */}
        <button className="sp-ibtn"
          onClick={() => setDarkMode?.(p => !p)}
          aria-label={darkMode ? "Light mode" : "Dark mode"}>
          {darkMode ? <Sun size={15} strokeWidth={2} /> : <Moon size={15} strokeWidth={2} />}
        </button>

        {/* Notifications */}
        <div style={{ position: "relative" }}>
          <button className="sp-ibtn"
            onClick={() => { setNotifOpen(p => !p); setProfileOpen(false); }}
            aria-label="Notifications">
            <Bell size={15} strokeWidth={2} />
            <span className="sp-notif-dot" />
          </button>

          <AnimatePresence>
            {notifOpen && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 40 }} onClick={closeAll} />
                <motion.div
                  className="sp-panel"
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.13 }}
                  style={{ width: "min(310px, calc(100vw - 16px))" }}
                >
                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "2px 4px 10px", borderBottom: "1px solid var(--border)", marginBottom: 4,
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Notifications</span>
                    <span style={{
                      fontSize: 10, padding: "2px 7px", borderRadius: 999, fontWeight: 600,
                      background: "rgba(124,111,255,0.12)", color: "#8b7fff",
                      border: "1px solid rgba(124,111,255,0.25)",
                    }}>
                      {NOTIFICATIONS.length} new
                    </span>
                  </div>
                  {NOTIFICATIONS.map((n, i) => (
                    <div key={i} className="sp-nrow">
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: n.color, flexShrink: 0, marginTop: 5 }} />
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.45, margin: 0 }}>{n.text}</p>
                        <p style={{ fontSize: 10.5, color: "var(--text-muted)", margin: "3px 0 0" }}>{n.time}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar / Profile */}
        <div style={{ position: "relative" }}>
          <button className="sp-avatar-btn"
            onClick={() => { setProfileOpen(p => !p); setNotifOpen(false); }}
            aria-label="Profile">
            <div className="sp-avatar-circle">{initials}</div>
            <ChevronDown size={10} strokeWidth={2.5} color="var(--text-muted)" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 40 }} onClick={closeAll} />
                <motion.div
                  className="sp-panel"
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.13 }}
                  style={{ width: 210 }}
                >
                  {/* User card */}
                  <div style={{
                    padding: "9px 10px", borderRadius: 10, marginBottom: 6,
                    background: "var(--bg-card)",
                    display: "flex", alignItems: "center", gap: 10,
                  }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                      background: "linear-gradient(135deg, #7c6fff, #ec4899)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700, color: "#fff",
                    }}>
                      {initials}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>
                        {profile?.name || "Your Name"}
                      </p>
                      <p style={{ fontSize: 11, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: "2px 0 0" }}>
                        {profile?.email || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="sp-sep" />

                  <button className="sp-mitem" onClick={() => handleNav("profile")}>
                    <User size={14} strokeWidth={1.8} /> View Profile
                  </button>
                  <button className="sp-mitem" onClick={() => handleNav("settings")}>
                    <Settings size={14} strokeWidth={1.8} /> Settings
                  </button>

                  <div className="sp-sep" />

                  {/* ✅ FIXED: onClick now calls handleSignOut */}
                  <button className="sp-mitem danger" onClick={handleSignOut}>
                    <LogOut size={14} strokeWidth={1.8} /> Sign out
                  </button>

                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

      </nav>
    </>
  );
}