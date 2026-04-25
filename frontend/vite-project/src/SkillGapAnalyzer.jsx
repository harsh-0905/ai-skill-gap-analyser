import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Sidebar      from "./components/Sidebar";
import Navbar       from "./components/Navbar";
import BottomNav    from "./components/BottomNav";
import Toast        from "./components/Toast";

import Dashboard    from "./pages/Dashboard";
import Analyze      from "./pages/Analyze";
import Reports      from "./pages/Reports";
import LearningPath from "./pages/LearningPath";
import Jobs         from "./pages/Jobs";
import Profile      from "./pages/Profile";
import Settings     from "./pages/Settings";

import { useToast } from "./hooks/useToast";

const DESKTOP_BP = 1024;

function useBreakpoint() {
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= DESKTOP_BP);
  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= DESKTOP_BP);
    const mq = window.matchMedia(`(min-width: ${DESKTOP_BP}px)`);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isDesktop;
}

// ── localStorage helpers ──────────────────────────────────────────────────────
const PROFILE_KEY = "sgp_profile";

function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return { name: "", email: "", role: "" };
}

function persistProfile(data) {
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(data)); } catch (_) {}
}

function clearProfile() {
  try { localStorage.removeItem(PROFILE_KEY); } catch (_) {}
}
// ─────────────────────────────────────────────────────────────────────────────

export default function SkillGapAnalyzer() {
  const [page,        setPage]        = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode,    setDarkMode]    = useState(true);
  const [analysis,    setAnalysis]    = useState(null);

  // ── FIX 1: init profile from localStorage so name persists across refreshes ──
  const [profile, setProfile] = useState(loadProfile);

  const isDesktop = useBreakpoint();
  const { toasts, addToast, dismissToast } = useToast();

  useEffect(() => {
    setSidebarOpen(isDesktop);
  }, [isDesktop]);

  const navigate = useCallback((p) => {
    setPage(p);
    if (!isDesktop) setSidebarOpen(false);
  }, [isDesktop]);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  // ── FIX 2: persist profile to localStorage on every save ────────────────────
  const saveProfile = useCallback((data) => {
    setProfile(data);
    persistProfile(data);
  }, []);

  // ── FIX 3: sign out — clear state + localStorage + return to dashboard ───────
  const handleSignOut = useCallback(() => {
    setProfile({ name: "", email: "", role: "" });
    setAnalysis(null);
    setPage("dashboard");
    clearProfile();
  }, []);

  return (
    <div
      className={darkMode ? "" : "light-mode"}
      style={{
        background: "var(--bg-base)",
        fontFamily: "var(--font-body)",
        color: "var(--text-primary)",
        height: "100svh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <GlobalStyles />

      <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>

        {isDesktop ? (
          <Sidebar
            open={sidebarOpen}
            isDesktop={true}
            page={page}
            setPage={navigate}
            profile={profile}
            onClose={closeSidebar}
          />
        ) : (
          <AnimatePresence>
            {sidebarOpen && (
              <>
                <motion.div
                  key="backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={closeSidebar}
                  style={{
                    position: "fixed", inset: 0, zIndex: 40,
                    background: "rgba(0,0,0,0.65)",
                    backdropFilter: "blur(3px)",
                    WebkitBackdropFilter: "blur(3px)",
                  }}
                />
                <motion.div
                  key="sidebar"
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", stiffness: 340, damping: 34, mass: 0.8 }}
                  style={{ position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50 }}
                >
                  <Sidebar
                    open={true}
                    isDesktop={false}
                    page={page}
                    setPage={navigate}
                    profile={profile}
                    onClose={closeSidebar}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        )}

        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

          {/* ── FIX 4: pass page + onSignOut — both were missing before ── */}
          <Navbar
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            profile={profile}
            onNavigate={navigate}
            isDesktop={isDesktop}
            page={page}
            onSignOut={handleSignOut}
          />

          <main
            style={{
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
              paddingBottom: isDesktop ? 0 : 64,
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
              >
                <PageRouter
                  page={page}
                  analysis={analysis}
                  setAnalysis={setAnalysis}
                  addToast={addToast}
                  profile={profile}
                  setProfile={saveProfile}   // ← uses saveProfile so localStorage stays in sync
                  onNavigate={navigate}
                />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {!isDesktop && <BottomNav page={page} setPage={navigate} />}
      <Toast toasts={toasts} dismiss={dismissToast} />
    </div>
  );
}

function PageRouter({ page, analysis, setAnalysis, addToast, profile, setProfile, onNavigate }) {
  switch (page) {
    case "dashboard": return <Dashboard    analysis={analysis}  loading={false} onNavigate={onNavigate} />;
    case "analyze":   return <Analyze      onAnalysis={setAnalysis} addToast={addToast} />;
    case "reports":   return <Reports      analysis={analysis} />;
    case "learning":  return <LearningPath analysis={analysis} onNavigate={onNavigate} />;
    case "profile":   return <Profile      profile={profile} onProfileSave={setProfile} analysis={analysis} addToast={addToast} />;
    case "jobs":      return <Jobs         analysis={analysis} />;
    case "settings":  return <Settings     profile={profile} onProfileSave={setProfile} addToast={addToast} />;
    default:          return <Dashboard    analysis={analysis}  loading={false} onNavigate={onNavigate} />;
  }
}

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

      /* ── Dark theme (default) ── */
      :root {
        --bg-base:        #060608;
        --bg-surface:     #0d0d14;
        --bg-elevated:    #12121c;
        --bg-card:        rgba(255,255,255,0.04);
        --bg-sidebar:     #09090f;
        --bg-navbar:      rgba(6,6,8,0.90);
        --bg-bottom-nav:  rgba(6,6,8,0.97);
        --border:         rgba(255,255,255,0.08);
        --border-strong:  rgba(255,255,255,0.14);
        --text-primary:   #f0f0ff;
        --text-secondary: rgba(200,200,220,0.55);
        --text-muted:     rgba(200,200,220,0.30);
        --scrollbar:      rgba(255,255,255,0.07);
        --accent-blue:    #4f8ef7;
        --accent-purple:  #a855f7;
        --accent-indigo:  #6366f1;
        --accent-emerald: #10b981;
        --accent-rose:    #f43f5e;
        --accent-amber:   #f59e0b;
        --font-body:      'Outfit', sans-serif;
        --font-mono:      'JetBrains Mono', monospace;
        --tap-min:        44px;

        --card-bg:        rgba(255,255,255,0.04);
        --card-border:    rgba(255,255,255,0.08);
        --hero-bg:        linear-gradient(135deg, rgba(79,142,247,0.13) 0%, rgba(99,102,241,0.09) 50%, rgba(168,85,247,0.07) 100%);
        --hero-border:    rgba(255,255,255,0.10);
        --tip-bg:         rgba(0,0,0,0.18);
        --tip-border:     rgba(255,255,255,0.06);
        --tip-text:       rgba(200,200,220,0.50);
        --job-card-bg:    rgba(255,255,255,0.04);
        --job-card-border:rgba(255,255,255,0.08);
        --tag-bg:         rgba(255,255,255,0.06);
        --tag-color:      rgba(200,200,220,0.55);
        --empty-icon-bg:  rgba(79,142,247,0.10);
        --skeleton-base:  rgba(255,255,255,0.04);
        --skeleton-shine: rgba(255,255,255,0.07);
      }

      /* ── Light / Warm theme ── */
      .light-mode {
        --bg-base:        #faf7f2;
        --bg-surface:     #f4f0e8;
        --bg-elevated:    #ffffff;
        --bg-card:        rgba(255,255,255,0.92);
        --bg-sidebar:     #ffffff;
        --bg-navbar:      rgba(250,247,242,0.94);
        --bg-bottom-nav:  rgba(255,253,248,0.98);
        --border:         rgba(180,160,120,0.18);
        --border-strong:  rgba(140,110,70,0.22);
        --text-primary:   #1c1409;
        --text-secondary: rgba(60,40,15,0.62);
        --text-muted:     rgba(60,40,15,0.38);
        --scrollbar:      rgba(140,110,70,0.18);
        --accent-blue:    #2563eb;
        --accent-purple:  #9333ea;
        --accent-indigo:  #4f46e5;
        --accent-emerald: #059669;
        --accent-rose:    #e11d48;
        --accent-amber:   #d97706;
        --card-bg:        rgba(255,255,255,0.80);
        --card-border:    rgba(180,150,100,0.18);
        --hero-bg:        linear-gradient(135deg, rgba(251,191,36,0.10) 0%, rgba(245,158,11,0.07) 50%, rgba(217,119,6,0.05) 100%);
        --hero-border:    rgba(217,119,6,0.18);
        --tip-bg:         rgba(254,243,199,0.70);
        --tip-border:     rgba(217,119,6,0.15);
        --tip-text:       rgba(120,70,10,0.70);
        --job-card-bg:    rgba(255,255,255,0.85);
        --job-card-border:rgba(180,150,100,0.18);
        --tag-bg:         rgba(0,0,0,0.05);
        --tag-color:      rgba(60,40,15,0.62);
        --empty-icon-bg:  rgba(37,99,235,0.08);
        --skeleton-base:  rgba(0,0,0,0.05);
        --skeleton-shine: rgba(0,0,0,0.09);
      }

      /* Reset */
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html, body { height: 100%; }
      body { background: var(--bg-base); overflow: hidden; }

      /* Theme transitions */
      *, *::before, *::after {
        transition:
          background-color 0.30s ease,
          border-color     0.30s ease,
          color            0.25s ease,
          box-shadow       0.25s ease;
      }
      button, a {
        transition:
          background-color 0.30s ease,
          border-color     0.30s ease,
          color            0.25s ease,
          transform        0.14s ease,
          box-shadow       0.14s ease,
          opacity          0.14s ease;
      }

      /* Scrollbar */
      ::-webkit-scrollbar       { width: 3px; height: 3px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: var(--scrollbar); border-radius: 3px; }

      /* Focus */
      :focus-visible { outline: 2px solid var(--accent-indigo); outline-offset: 2px; border-radius: 8px; }

      /* Mobile UX */
      button { -webkit-tap-highlight-color: transparent; user-select: none; touch-action: manipulation; }

      /* Prevent iOS zoom */
      input, textarea, select { font-size: max(16px, 1em) !important; }

      /* Gradient text utility */
      .grad-text {
        background: linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-purple) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      /* Light mode structural overrides */
      .light-mode aside  { background: var(--bg-sidebar) !important; border-right: 1px solid var(--border) !important; }
      .light-mode header { background: var(--bg-navbar)  !important; border-bottom: 1px solid var(--border) !important; }

      .light-mode .dash-kpi > div,
      .light-mode .dash-charts > div {
        background: var(--card-bg) !important;
        border-color: var(--card-border) !important;
      }

      /* Shimmer animation */
      @keyframes shimmer {
        0%   { background-position: -200% 0; }
        100% { background-position:  200% 0; }
      }

      /* Mobile responsive helpers */
      @media (max-width: 400px) {
        .dash-kpi { grid-template-columns: 1fr 1fr !important; }
      }
    `}</style>
  );
}