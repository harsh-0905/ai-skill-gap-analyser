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

const PROFILE_KEY = "sgp_profile";
function loadProfile() {
  try { const raw = localStorage.getItem(PROFILE_KEY); if (raw) return JSON.parse(raw); } catch (_) {}
  return { name: "", email: "", role: "" };
}
function persistProfile(data) {
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(data)); } catch (_) {}
}
function clearProfile() {
  try { localStorage.removeItem(PROFILE_KEY); } catch (_) {}
}

export default function SkillGapAnalyzer() {
  const [page,        setPage]        = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode,    setDarkMode]    = useState(true);
  const [analysis,    setAnalysis]    = useState(null);
  const [profile,     setProfileState]= useState(loadProfile);

  const isDesktop = useBreakpoint();
  const { toasts, addToast, dismissToast } = useToast();

  useEffect(() => { setSidebarOpen(isDesktop); }, [isDesktop]);

  const navigate     = useCallback((p) => { setPage(p); if (!isDesktop) setSidebarOpen(false); }, [isDesktop]);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const saveProfile  = useCallback((data) => { setProfileState(data); persistProfile(data); }, []);
  const handleSignOut= useCallback(() => { setProfileState({ name: "", email: "", role: "" }); setAnalysis(null); setPage("dashboard"); clearProfile(); }, []);

  return (
    <div
      className={darkMode ? "" : "light-mode"}
      style={{ background: "var(--bg-base)", fontFamily: "var(--font-body)", color: "var(--text-primary)", height: "100svh", display: "flex", flexDirection: "column", overflow: "hidden" }}
    >
      <GlobalStyles />

      <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>
        {isDesktop ? (
          <Sidebar open={sidebarOpen} isDesktop={true} page={page} setPage={navigate} profile={profile} onClose={closeSidebar} darkMode={darkMode} />
        ) : (
          <AnimatePresence>
            {sidebarOpen && (
              <>
                <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={closeSidebar}
                  style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)" }} />
                <motion.div key="sidebar" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", stiffness: 340, damping: 34, mass: 0.8 }}
                  style={{ position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50 }}>
                  <Sidebar open={true} isDesktop={false} page={page} setPage={navigate} profile={profile} onClose={closeSidebar} darkMode={darkMode} />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        )}

        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
          <Navbar darkMode={darkMode} setDarkMode={setDarkMode} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
            profile={profile} onNavigate={navigate} isDesktop={isDesktop} page={page} onSignOut={handleSignOut} />
          <main style={{ flex: 1, overflowY: "auto", overflowX: "hidden", paddingBottom: isDesktop ? 0 : 64 }}>
            <AnimatePresence mode="wait">
              <motion.div key={page} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}>
                <PageRouter page={page} analysis={analysis} setAnalysis={setAnalysis} addToast={addToast} profile={profile} setProfile={saveProfile} onNavigate={navigate} />
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
        --bg-base:          #060608;
        --bg-surface:       #0d0d14;
        --bg-elevated:      #12121c;
        --bg-card:          rgba(255,255,255,0.04);
        --bg-card-hover:    rgba(255,255,255,0.07);
        --bg-sidebar:       #09090f;
        --bg-sidebar-hover: rgba(255,255,255,0.06);
        --bg-navbar:        rgba(6,6,8,0.90);
        --bg-bottom-nav:    rgba(6,6,8,0.97);
        --border:           rgba(255,255,255,0.08);
        --border-strong:    rgba(255,255,255,0.14);
        --text-primary:     #f0f0ff;
        --text-secondary:   rgba(200,200,220,0.55);
        --text-muted:       rgba(200,200,220,0.30);
        --scrollbar:        rgba(255,255,255,0.07);

        --accent-blue:      #4f8ef7;
        --accent-purple:    #a855f7;
        --accent-indigo:    #6366f1;
        --accent-emerald:   #10b981;
        --accent-rose:      #f43f5e;
        --accent-amber:     #f59e0b;

        --font-body:        'Outfit', sans-serif;
        --font-mono:        'JetBrains Mono', monospace;
        --tap-min:          44px;

        --card-bg:          rgba(255,255,255,0.04);
        --card-border:      rgba(255,255,255,0.08);
        --hero-bg:          linear-gradient(135deg, rgba(79,142,247,0.13) 0%, rgba(99,102,241,0.09) 50%, rgba(168,85,247,0.07) 100%);
        --hero-border:      rgba(255,255,255,0.10);
        --tip-bg:           rgba(0,0,0,0.18);
        --tip-border:       rgba(255,255,255,0.06);
        --tip-text:         rgba(200,200,220,0.50);
        --job-card-bg:      rgba(255,255,255,0.04);
        --job-card-border:  rgba(255,255,255,0.08);
        --tag-bg:           rgba(255,255,255,0.06);
        --tag-color:        rgba(200,200,220,0.55);
        --skeleton-base:    rgba(255,255,255,0.04);
        --skeleton-shine:   rgba(255,255,255,0.07);

        /* Sidebar-specific */
        --sidebar-bg:          linear-gradient(180deg, #09090f 0%, #0b0b14 100%);
        --sidebar-border:      rgba(255,255,255,0.06);
        --sidebar-glow:        rgba(99,102,241,0.13);
        --sidebar-label:       rgba(200,200,220,0.25);
        --sidebar-text:        rgba(200,200,220,0.45);
        --sidebar-text-active: #c7d2fe;
        --sidebar-icon:        rgba(200,200,220,0.40);
        --sidebar-icon-active: #818cf8;
        --sidebar-item-active-bg: linear-gradient(135deg, rgba(79,142,247,0.18), rgba(168,85,247,0.12));
        --sidebar-item-active-border: rgba(99,102,241,0.25);
        --sidebar-user-bg:     rgba(255,255,255,0.04);
        --sidebar-user-border: rgba(255,255,255,0.07);
        --sidebar-user-name:   rgba(240,240,255,0.8);
        --sidebar-user-email:  rgba(200,200,220,0.30);
        --sidebar-close-bg:    rgba(255,255,255,0.06);
        --sidebar-close-border:rgba(255,255,255,0.09);
        --sidebar-brand:       white;
        --sidebar-brand-sub:   rgba(200,200,220,0.30);
      }

      /* ── Light theme ── */
      .light-mode {
        --bg-base:          #f0f2f5;
        --bg-surface:       #e8ebf0;
        --bg-elevated:      #ffffff;
        --bg-card:          #ffffff;
        --bg-card-hover:    rgba(0,0,0,0.04);
        --bg-sidebar:       #ffffff;
        --bg-sidebar-hover: rgba(0,0,0,0.04);
        --bg-navbar:        rgba(255,255,255,0.95);
        --bg-bottom-nav:    rgba(255,255,255,0.98);
        --border:           rgba(0,0,0,0.08);
        --border-strong:    rgba(0,0,0,0.14);
        --text-primary:     #0f1117;
        --text-secondary:   rgba(15,17,23,0.60);
        --text-muted:       rgba(15,17,23,0.38);
        --scrollbar:        rgba(0,0,0,0.12);

        --accent-blue:      #2563eb;
        --accent-purple:    #9333ea;
        --accent-indigo:    #4f46e5;
        --accent-emerald:   #059669;
        --accent-rose:      #e11d48;
        --accent-amber:     #d97706;

        --card-bg:          #ffffff;
        --card-border:      rgba(0,0,0,0.08);
        --hero-bg:          linear-gradient(135deg, rgba(37,99,235,0.07) 0%, rgba(79,70,229,0.05) 50%, rgba(147,51,234,0.04) 100%);
        --hero-border:      rgba(37,99,235,0.14);
        --tip-bg:           rgba(37,99,235,0.05);
        --tip-border:       rgba(37,99,235,0.12);
        --tip-text:         rgba(15,17,23,0.55);
        --job-card-bg:      #ffffff;
        --job-card-border:  rgba(0,0,0,0.08);
        --tag-bg:           rgba(37,99,235,0.08);
        --tag-color:        #2563eb;
        --skeleton-base:    rgba(0,0,0,0.05);
        --skeleton-shine:   rgba(0,0,0,0.09);

        /* Sidebar-specific — light */
        --sidebar-bg:          linear-gradient(180deg, #ffffff 0%, #f8f9fc 100%);
        --sidebar-border:      rgba(0,0,0,0.08);
        --sidebar-glow:        rgba(79,70,229,0.06);
        --sidebar-label:       rgba(15,17,23,0.30);
        --sidebar-text:        rgba(15,17,23,0.55);
        --sidebar-text-active: #4f46e5;
        --sidebar-icon:        rgba(15,17,23,0.35);
        --sidebar-icon-active: #4f46e5;
        --sidebar-item-active-bg: linear-gradient(135deg, rgba(37,99,235,0.10), rgba(79,70,229,0.07));
        --sidebar-item-active-border: rgba(79,70,229,0.20);
        --sidebar-user-bg:     rgba(0,0,0,0.03);
        --sidebar-user-border: rgba(0,0,0,0.07);
        --sidebar-user-name:   #0f1117;
        --sidebar-user-email:  rgba(15,17,23,0.38);
        --sidebar-close-bg:    rgba(0,0,0,0.05);
        --sidebar-close-border:rgba(0,0,0,0.09);
        --sidebar-brand:       #0f1117;
        --sidebar-brand-sub:   rgba(15,17,23,0.35);
      }

      /* Reset */
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html, body { height: 100%; }
      body { background: var(--bg-base); overflow: hidden; }

      /* Theme transitions */
      *, *::before, *::after {
        transition: background-color 0.30s ease, border-color 0.30s ease, color 0.25s ease, box-shadow 0.25s ease;
      }
      button, a {
        transition: background-color 0.30s ease, border-color 0.30s ease, color 0.25s ease, transform 0.14s ease, box-shadow 0.14s ease, opacity 0.14s ease;
      }

      ::-webkit-scrollbar       { width: 3px; height: 3px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: var(--scrollbar); border-radius: 3px; }

      :focus-visible { outline: 2px solid var(--accent-indigo); outline-offset: 2px; border-radius: 8px; }
      button { -webkit-tap-highlight-color: transparent; user-select: none; touch-action: manipulation; }
      input, textarea, select { font-size: max(16px, 1em) !important; }

      .grad-text {
        background: linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-purple) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      /* Light mode overrides for recharts / chart cards */
      .light-mode .recharts-cartesian-grid line { stroke: rgba(0,0,0,0.06); }
      .light-mode .recharts-polar-grid line,
      .light-mode .recharts-polar-grid path { stroke: rgba(0,0,0,0.08); }

      @keyframes shimmer {
        0%   { background-position: -200% 0; }
        100% { background-position:  200% 0; }
      }

      @media (max-width: 400px) {
        .dash-kpi { grid-template-columns: 1fr 1fr !important; }
      }
    `}</style>
  );
}