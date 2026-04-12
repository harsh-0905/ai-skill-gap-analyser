import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, Bell, Sun, Moon, LogOut, User,
  Settings, ChevronDown, X, Search,
  LayoutDashboard, Route, BarChart2, TrendingUp, Zap,
} from "lucide-react";

// ─── Static data ──────────────────────────────────────────────────────────────
const NOTIFICATIONS = [
  { text: "Analysis complete — 87.5% match found", time: "Just now",  color: "#818cf8" },
  { text: "New course: Docker for Engineers added", time: "2h ago",   color: "#10b981" },
  { text: "Weekly progress report is ready",        time: "Yesterday",color: "#a855f7" },
];

const NAV_TABS = [
  { id: "dashboard",     label: "Dashboard",     Icon: LayoutDashboard },
  { id: "learning-path", label: "Learning Path", Icon: Route           },
  { id: "progress",      label: "Progress",      Icon: BarChart2       },
  { id: "analytics",     label: "Analytics",     Icon: TrendingUp      },
];

// ─── Main component ───────────────────────────────────────────────────────────
export default function Navbar({
  darkMode, setDarkMode,
  sidebarOpen, setSidebarOpen,
  profile, onNavigate, isDesktop,
  activeTab = "dashboard", onTabChange,
}) {
  const [notifOpen,     setNotifOpen]     = useState(false);
  const [profileOpen,   setProfileOpen]   = useState(false);
  const [searchValue,   setSearchValue]   = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const initials = (profile?.name || "HY")
    .split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const closeAll = () => { setNotifOpen(false); setProfileOpen(false); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700&display=swap');

        /* ── Reset ── */
        .sp-navbar *, .sp-navbar *::before, .sp-navbar *::after {
          box-sizing: border-box;
        }

        /* ── Navbar shell ── */
        .sp-navbar {
          height: 52px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          padding: 0 10px;
          gap: 6px;
          background: #0a0a12;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          position: sticky;
          top: 0;
          z-index: 30;
          overflow: visible;
        }

        .sp-navbar::after {
          content: '';
          position: absolute;
          top: 0; left: 50%; transform: translateX(-50%);
          width: 38%; height: 1px; pointer-events: none;
          background: linear-gradient(90deg, transparent, rgba(124,111,255,0.5), transparent);
        }

        /* ── Shared icon button ── */
        .sp-ibtn {
          width: 34px;
          height: 34px;
          min-width: 34px;
          border-radius: 8px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.10);
          cursor: pointer;
          position: relative;
          color: rgba(210,210,230,0.75);
          transition: background 0.15s, border-color 0.15s, color 0.15s;
          padding: 0;
          line-height: 1;
        }
        .sp-ibtn:hover {
          background: rgba(255,255,255,0.11);
          border-color: rgba(255,255,255,0.18);
          color: rgba(230,230,255,0.95);
        }
        .sp-ibtn svg {
          display: block;
          flex-shrink: 0;
          stroke: currentColor;
          fill: none;
        }

        /* ── Logo ── */
        .sp-logo {
          width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0;
          background: linear-gradient(135deg, #7c6fff 0%, #c084fc 100%);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 14px rgba(124,111,255,0.5);
        }
        .sp-logo svg { stroke: none; fill: #fff; }

        /* ── Brand ── */
        .sp-brand {
          font-family: 'Syne', system-ui, sans-serif;
          font-size: 15px; font-weight: 700;
          color: rgba(240,238,255,0.95);
          letter-spacing: -0.01em; white-space: nowrap; flex-shrink: 0;
        }
        .sp-brand .accent { color: #8b7fff; }
        .sp-brand .sub {
          color: rgba(200,200,220,0.45);
          font-weight: 400; font-size: 11.5px; margin-left: 2px;
        }

        /* ── Divider ── */
        .sp-divider {
          width: 1px; height: 20px;
          background: rgba(255,255,255,0.08); flex-shrink: 0;
          margin: 0 2px;
        }

        /* ── Nav tabs ── */
        .sp-tabs { display: flex; align-items: center; gap: 1px; flex: 1; }
        .sp-tab {
          display: flex; align-items: center; gap: 5px;
          padding: 5px 10px; border-radius: 7px;
          font-size: 13px; font-weight: 400;
          color: rgba(200,200,220,0.45);
          background: transparent; border: none; cursor: pointer;
          white-space: nowrap; transition: background 0.14s, color 0.14s;
          font-family: inherit; line-height: 1;
        }
        .sp-tab:hover { background: rgba(255,255,255,0.07); color: rgba(225,225,255,0.88); }
        .sp-tab.active { background: rgba(124,111,255,0.18); color: #b8b0ff; font-weight: 500; }
        .sp-tab svg { display: block; flex-shrink: 0; stroke: currentColor; fill: none; }

        /* ── Search ── */
        .sp-search {
          display: flex; align-items: center; gap: 7px;
          height: 32px; width: 176px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px; padding: 0 10px;
          transition: border-color 0.15s, background 0.15s, width 0.2s;
          cursor: text; flex-shrink: 0;
        }
        .sp-search:hover { background: rgba(255,255,255,0.08); }
        .sp-search.focused {
          background: rgba(255,255,255,0.08);
          border-color: rgba(124,111,255,0.45);
          width: 210px;
        }
        .sp-search svg { display: block; flex-shrink: 0; }
        .sp-search input {
          background: transparent; border: none; outline: none;
          font-size: 12.5px; color: rgba(220,220,255,0.9);
          width: 100%; font-family: inherit;
        }
        .sp-search input::placeholder { color: rgba(200,200,220,0.28); }
        .sp-kbd {
          font-size: 10px; color: rgba(200,200,220,0.25);
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 4px; padding: 1px 5px;
          flex-shrink: 0; font-family: monospace;
        }

        /* ── Notification dot ── */
        .sp-notif-dot {
          position: absolute; top: 8px; right: 8px;
          width: 6px; height: 6px; border-radius: 50%;
          background: #7c6fff; border: 1.5px solid #0a0a12;
          pointer-events: none;
        }

        /* ── Go Pro ── */
        .sp-pro {
          display: flex; align-items: center; gap: 5px;
          height: 32px; padding: 0 12px; flex-shrink: 0;
          background: rgba(124,111,255,0.15);
          border: 1px solid rgba(124,111,255,0.32);
          border-radius: 8px; font-size: 12.5px; font-weight: 500;
          color: #c4bbff; cursor: pointer; white-space: nowrap;
          transition: background 0.15s, border-color 0.15s;
          font-family: inherit;
        }
        .sp-pro:hover { background: rgba(124,111,255,0.24); border-color: rgba(124,111,255,0.55); }
        .sp-pro svg { display: block; flex-shrink: 0; }

        /* ── Avatar button ── */
        .sp-avatar-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 3px 7px 3px 3px; border-radius: 9px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          cursor: pointer; flex-shrink: 0;
          transition: background 0.14s, border-color 0.14s;
        }
        .sp-avatar-btn:hover { background: rgba(255,255,255,0.09); border-color: rgba(255,255,255,0.16); }
        .sp-avatar-circle {
          width: 26px; height: 26px; border-radius: 7px; flex-shrink: 0;
          background: linear-gradient(135deg, #7c6fff, #ec4899);
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 700; color: #fff;
          font-family: 'Syne', system-ui, sans-serif;
        }

        /* ── Floating panel ── */
        .sp-panel {
          position: absolute; z-index: 50;
          border-radius: 14px; padding: 8px;
          background: #10101e;
          border: 1px solid rgba(255,255,255,0.10);
          box-shadow: 0 20px 48px rgba(0,0,0,0.75);
          overflow: visible;
        }

        /* ── Notif row ── */
        .sp-nrow {
          display: flex; gap: 10px; padding: 9px 8px;
          border-radius: 9px; cursor: pointer; align-items: flex-start;
          transition: background 0.12s;
        }
        .sp-nrow:hover { background: rgba(255,255,255,0.05); }

        /* ── Menu items ── */
        .sp-mitem {
          width: 100%; display: flex; align-items: center; gap: 10px;
          padding: 0 10px; border-radius: 9px; cursor: pointer;
          font-size: 13px; font-weight: 500; color: rgba(200,200,220,0.72);
          background: transparent; border: none; min-height: 38px;
          text-align: left; transition: background 0.12s, color 0.12s;
          font-family: inherit;
        }
        .sp-mitem:hover { background: rgba(255,255,255,0.06); color: rgba(225,225,255,0.92); }
        .sp-mitem.danger { color: rgba(244,63,94,0.78); }
        .sp-mitem.danger:hover { background: rgba(244,63,94,0.08); color: rgba(244,63,94,0.98); }
        .sp-mitem svg { display: block; flex-shrink: 0; stroke: currentColor; fill: none; }

        .sp-sep { height: 1px; background: rgba(255,255,255,0.07); margin: 4px 0; }

        /* ── Responsive ── */
        @media (max-width: 980px)  { .sp-tabs  { display: none !important; } .sp-divider { display: none !important; } }
        @media (max-width: 680px)  { .sp-search { display: none !important; } .sp-pro { display: none !important; } }
      `}</style>

      <nav className="sp-navbar">

        {/* Hamburger */}
        <button className="sp-ibtn" onClick={() => setSidebarOpen(p => !p)}
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

        {/* Nav Tabs */}
        <div className="sp-tabs">
          {NAV_TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`sp-tab${activeTab === id ? " active" : ""}`}
              onClick={() => { onTabChange?.(id); closeAll(); }}
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
          <Search
            size={13}
            strokeWidth={2}
            color={searchFocused ? "#8b7fff" : "rgba(200,200,220,0.3)"}
          />
          <input
            id="sp-search-inp"
            type="text"
            placeholder="Search skills…"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {!searchFocused && <span className="sp-kbd">⌘K</span>}
        </div>

        {/* Dark mode */}
        <button className="sp-ibtn" onClick={() => setDarkMode?.(p => !p)}
          aria-label={darkMode ? "Light mode" : "Dark mode"}>
          {darkMode
            ? <Sun  size={15} strokeWidth={2} />
            : <Moon size={15} strokeWidth={2} />}
        </button>

        {/* Bell */}
        <div style={{ position: "relative" }}>
          <button className="sp-ibtn"
            onClick={() => { setNotifOpen(p => !p); setProfileOpen(false); }}
            aria-label="Notifications" aria-expanded={notifOpen}>
            <Bell size={15} strokeWidth={2} />
            <span className="sp-notif-dot" />
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                className="sp-panel"
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                transition={{ duration: 0.13 }}
                style={{ width: "min(310px, calc(100vw - 20px))", right: 0, top: 42 }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "2px 4px 10px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(230,230,255,0.9)" }}>Notifications</span>
                  <span style={{
                    fontSize: 10, padding: "2px 7px", borderRadius: 999, fontWeight: 600,
                    background: "rgba(124,111,255,0.16)", color: "#b8b0ff",
                    border: "1px solid rgba(124,111,255,0.28)",
                  }}>
                    {NOTIFICATIONS.length} new
                  </span>
                </div>
                <div style={{ paddingTop: 4 }}>
                  {NOTIFICATIONS.map((n, i) => (
                    <div key={i} className="sp-nrow">
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: n.color, flexShrink: 0, marginTop: 5 }} />
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 12.5, color: "rgba(215,215,240,0.82)", lineHeight: 1.45, margin: 0 }}>{n.text}</p>
                        <p style={{ fontSize: 10.5, color: "rgba(200,200,220,0.3)", marginTop: 3, margin: "3px 0 0" }}>{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Go Pro */}
        <button className="sp-pro">
          <Zap size={12} strokeWidth={2.5} style={{ stroke: "none", fill: "#c4bbff" }} />
          Go Pro
        </button>

        {/* Avatar */}
        <div style={{ position: "relative" }}>
          <button
            className="sp-avatar-btn"
            onClick={() => { setProfileOpen(p => !p); setNotifOpen(false); }}
            aria-label="Profile" aria-expanded={profileOpen}
          >
            <div className="sp-avatar-circle">{initials}</div>
            <ChevronDown size={10} strokeWidth={2.5} color="rgba(255,255,255,0.35)" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                className="sp-panel"
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                transition={{ duration: 0.13 }}
                style={{ width: 210, right: 0, top: 42 }}
              >
                {/* User card */}
                <div style={{
                  padding: "9px 10px", borderRadius: 10, marginBottom: 6,
                  background: "rgba(255,255,255,0.05)",
                  display: "flex", alignItems: "center", gap: 10,
                }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                    background: "linear-gradient(135deg, #7c6fff, #ec4899)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700, color: "#fff",
                    fontFamily: "'Syne', system-ui, sans-serif",
                  }}>
                    {initials}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(235,235,255,0.92)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>
                      {profile?.name || "Your Name"}
                    </p>
                    <p style={{ fontSize: 11, color: "rgba(200,200,220,0.35)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: "2px 0 0" }}>
                      {profile?.email || "—"}
                    </p>
                  </div>
                </div>

                <div className="sp-sep" />

                {[
                  { label: "View Profile", id: "profile",  Icon: User     },
                  { label: "Settings",     id: "settings", Icon: Settings },
                ].map(({ label, id, Icon }) => (
                  <button key={id} className="sp-mitem"
                    onClick={() => { onNavigate?.(id); closeAll(); }}>
                    <Icon size={14} strokeWidth={1.8} color="rgba(200,200,220,0.35)" />
                    {label}
                  </button>
                ))}

                <div className="sp-sep" />

                <button className="sp-mitem danger">
                  <LogOut size={14} strokeWidth={1.8} />
                  Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </nav>
    </>
  );
}