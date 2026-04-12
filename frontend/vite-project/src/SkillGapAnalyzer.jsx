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
import Profile      from "./pages/Profile";
import Settings     from "./pages/Settings";

import { useToast }       from "./hooks/useToast";
import { DUMMY_ANALYSIS } from "./data/constants";

// Breakpoint: anything under 1024px = mobile/tablet (sidebar overlays)
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

export default function SkillGapAnalyzer() {
  const [page,        setPage]        = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode,    setDarkMode]    = useState(true);
  const [analysis,    setAnalysis]    = useState(DUMMY_ANALYSIS);
  const [profile,     setProfile]     = useState({ name: "", email: "", role: "" });

  const isDesktop = useBreakpoint();
  const { toasts, addToast, dismissToast } = useToast();

  // On desktop resize: auto-open sidebar; on mobile: close it
  useEffect(() => {
    setSidebarOpen(isDesktop);
  }, [isDesktop]);

  const navigate = useCallback((p) => {
    setPage(p);
    if (!isDesktop) setSidebarOpen(false); // always close on mobile after nav
  }, [isDesktop]);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div
      className={darkMode ? "" : "light-mode"}
      style={{
        background: "var(--bg-base)",
        fontFamily: "var(--font-body)",
        color: "var(--text-primary)",
        height: "100svh",           // svh = small viewport height (handles mobile browser chrome)
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <GlobalStyles />

      {/*
        Layout strategy:
        ─ Mobile/tablet (< 1024px):
            Sidebar is FIXED OVERLAY — it sits on top of content, never pushes it.
            Bottom nav handles primary navigation.
            Backdrop dims the page behind the open sidebar.

        ─ Desktop (≥ 1024px):
            Sidebar is IN-FLOW — takes up space to the left of main content.
            Bottom nav is hidden.
      */}

      <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>

        {/* ── Sidebar ── */}
        {isDesktop ? (
          /* Desktop: in-flow, always rendered, animated width */
          <Sidebar
            open={sidebarOpen}
            isDesktop={true}
            page={page}
            setPage={navigate}
            profile={profile}
            onClose={closeSidebar}
          />
        ) : (
          /* Mobile/tablet: fixed overlay, animated x position */
          <AnimatePresence>
            {sidebarOpen && (
              <>
                {/* Backdrop */}
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
                {/* Sidebar panel */}
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

        {/* ── Main column ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
          <Navbar
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            profile={profile}
            onNavigate={navigate}
            isDesktop={isDesktop}
          />

          <main
            style={{
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
              // Leave room for bottom nav on mobile
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
                  setProfile={setProfile}
                  onNavigate={navigate}
                />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Bottom nav — mobile only */}
      {!isDesktop && <BottomNav page={page} setPage={navigate} />}

      <Toast toasts={toasts} dismiss={dismissToast} />
    </div>
  );
}

function PageRouter({ page, analysis, setAnalysis, addToast, profile, setProfile, onNavigate }) {
  switch (page) {
    case "dashboard": return <Dashboard   analysis={analysis} loading={false} onNavigate={onNavigate} />;
    case "analyze":   return <Analyze     onAnalysis={setAnalysis} addToast={addToast} />;
    case "reports":   return <Reports     analysis={analysis} />;
    case "learning":  return <LearningPath analysis={analysis} onNavigate={onNavigate} />;
    case "profile":   return <Profile     profile={profile} onProfileSave={setProfile} analysis={analysis} addToast={addToast} />;
    case "settings":  return <Settings    profile={profile} onProfileSave={setProfile} addToast={addToast} />;
    default:          return <Dashboard   analysis={analysis} loading={false} onNavigate={onNavigate} />;
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
      }

      /* ── Light theme ── */
      .light-mode {
        --bg-base:        #f3f4f8;
        --bg-surface:     #eaecf4;
        --bg-elevated:    #ffffff;
        --bg-card:        rgba(255,255,255,0.88);
        --bg-sidebar:     #ffffff;
        --bg-navbar:      rgba(243,244,248,0.92);
        --bg-bottom-nav:  rgba(248,249,252,0.98);
        --border:         rgba(0,0,0,0.08);
        --border-strong:  rgba(0,0,0,0.14);
        --text-primary:   #0f1117;
        --text-secondary: rgba(20,20,50,0.60);
        --text-muted:     rgba(20,20,50,0.36);
        --scrollbar:      rgba(0,0,0,0.10);
      }

      /* Reset */
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html, body { height: 100%; }
      body { background: var(--bg-base); overflow: hidden; }

      /* Theme transitions */
      * { transition: background-color 0.25s ease, border-color 0.25s ease, color 0.2s ease; }
      button, a { transition: background-color 0.25s ease, border-color 0.25s ease,
        color 0.2s ease, transform 0.14s ease, box-shadow 0.14s ease, opacity 0.14s ease; }

      /* Scrollbar */
      ::-webkit-scrollbar       { width: 3px; height: 3px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: var(--scrollbar); border-radius: 3px; }

      /* Focus ring for keyboard nav */
      :focus-visible { outline: 2px solid var(--accent-indigo); outline-offset: 2px; border-radius: 8px; }

      /* Mobile UX */
      button { -webkit-tap-highlight-color: transparent; user-select: none; touch-action: manipulation; }

      /* Prevent iOS zoom on input focus */
      input, textarea, select { font-size: max(16px, 1em) !important; }

      /* Gradient text utility */
      .grad-text {
        background: linear-gradient(135deg, #4f8ef7 0%, #a855f7 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      /* Light mode sidebar / navbar overrides */
      .light-mode aside  { background: var(--bg-sidebar) !important; }
      .light-mode header { background: var(--bg-navbar)  !important; }
    `}</style>
  );
}