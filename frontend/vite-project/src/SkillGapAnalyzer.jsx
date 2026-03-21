import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Sidebar      from "./components/Sidebar";
import Navbar       from "./components/Navbar";
import Toast        from "./components/Toast";

import Dashboard    from "./pages/Dashboard";
import Analyze      from "./pages/Analyze";
import Reports      from "./pages/Reports";
import LearningPath from "./pages/LearningPath";
import Profile      from "./pages/Profile";
import Settings     from "./pages/Settings";

import { useToast }       from "./hooks/useToast";
import { DUMMY_ANALYSIS } from "./data/constants";

export default function SkillGapAnalyzer() {
  const [page,        setPage]        = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode,    setDarkMode]    = useState(true);
  const [analysis,    setAnalysis]    = useState(DUMMY_ANALYSIS);
  const [profile,     setProfile]     = useState({ name: "", email: "", role: "" });

  const { toasts, addToast, dismissToast } = useToast();

  return (
    <div
      className={`min-h-screen flex flex-col ${darkMode ? "" : "light-mode"}`}
      style={{ background: "var(--bg-base)", fontFamily: "var(--font-body)", color: "var(--text-primary)" }}
    >
      <GlobalStyles />

      <div className="flex h-screen overflow-hidden">
        <Sidebar open={sidebarOpen} page={page} setPage={setPage} profile={profile} />

        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <Navbar
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            profile={profile}
            onNavigate={setPage}
          />

          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              >
                <PageRouter
                  page={page}
                  analysis={analysis}
                  setAnalysis={setAnalysis}
                  addToast={addToast}
                  profile={profile}
                  setProfile={setProfile}
                  onNavigate={setPage}
                />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <Toast toasts={toasts} dismiss={dismissToast} />
    </div>
  );
}

function PageRouter({ page, analysis, setAnalysis, addToast, profile, setProfile, onNavigate }) {
  switch (page) {
    case "dashboard": return <Dashboard analysis={analysis} loading={false} onNavigate={onNavigate} />;
    case "analyze":   return <Analyze onAnalysis={setAnalysis} addToast={addToast} />;
    case "reports":   return <Reports analysis={analysis} />;
    case "learning":  return <LearningPath analysis={analysis} onNavigate={onNavigate} />;
    case "profile":   return <Profile profile={profile} onProfileSave={setProfile} analysis={analysis} addToast={addToast} />;
    case "settings":  return <Settings profile={profile} onProfileSave={setProfile} addToast={addToast} />;
    default:          return <Dashboard analysis={analysis} loading={false} onNavigate={onNavigate} />;
  }
}

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

      /* ── Dark theme (default) ── */
      :root, .dark-mode {
        --bg-base:        #060608;
        --bg-surface:     #0d0d14;
        --bg-elevated:    #12121c;
        --bg-card:        rgba(255,255,255,0.04);
        --bg-card-hover:  rgba(255,255,255,0.07);
        --bg-sidebar:     #09090f;
        --bg-navbar:      rgba(6,6,8,0.82);
        --border:         rgba(255,255,255,0.08);
        --border-strong:  rgba(255,255,255,0.14);
        --text-primary:   #f0f0ff;
        --text-secondary: rgba(200,200,220,0.55);
        --text-muted:     rgba(200,200,220,0.3);
        --scrollbar:      rgba(255,255,255,0.08);
        --shadow-card:    0 4px 24px rgba(0,0,0,0.4);
      }

      /* ── Light theme ── */
      .light-mode {
        --bg-base:        #f4f5f9;
        --bg-surface:     #eef0f6;
        --bg-elevated:    #ffffff;
        --bg-card:        rgba(255,255,255,0.85);
        --bg-card-hover:  rgba(255,255,255,0.95);
        --bg-sidebar:     #ffffff;
        --bg-navbar:      rgba(244,245,249,0.88);
        --border:         rgba(0,0,0,0.08);
        --border-strong:  rgba(0,0,0,0.14);
        --text-primary:   #0f1117;
        --text-secondary: rgba(30,30,50,0.6);
        --text-muted:     rgba(30,30,50,0.38);
        --scrollbar:      rgba(0,0,0,0.12);
        --shadow-card:    0 4px 24px rgba(0,0,0,0.08);
      }

      /* ── Shared tokens ── */
      :root {
        --accent-blue:    #4f8ef7;
        --accent-purple:  #a855f7;
        --accent-indigo:  #6366f1;
        --accent-emerald: #10b981;
        --accent-rose:    #f43f5e;
        --accent-amber:   #f59e0b;
        --glow-blue:      rgba(79,142,247,0.15);
        --glow-purple:    rgba(168,85,247,0.12);
        --font-body:      'Outfit', sans-serif;
        --font-mono:      'JetBrains Mono', monospace;
        --radius-card:    16px;
        --radius-btn:     10px;
      }

      * { box-sizing: border-box; margin: 0; padding: 0; }

      /* Smooth theme transition on everything */
      *, *::before, *::after {
        transition: background-color 0.3s ease, border-color 0.3s ease, color 0.2s ease;
      }
      /* But keep motion snappy for transforms */
      button, a { transition: background-color 0.3s ease, border-color 0.3s ease,
        color 0.2s ease, transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease; }

      body { margin: 0; background: var(--bg-base); }

      /* Custom scrollbar */
      ::-webkit-scrollbar       { width: 4px; height: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: var(--scrollbar); border-radius: 4px; }
      ::-webkit-scrollbar-thumb:hover { background: var(--border-strong); }

      /* Light mode sidebar override */
      .light-mode aside {
        background: var(--bg-sidebar) !important;
        border-right-color: var(--border) !important;
      }

      /* Light mode navbar override */
      .light-mode header {
        background: var(--bg-navbar) !important;
        border-bottom-color: var(--border) !important;
      }

      /* Light mode floating panels */
      .light-mode [style*="#111118"] {
        background: #ffffff !important;
      }

      /* Glass card base */
      .glass {
        background: var(--bg-card);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid var(--border);
        border-radius: var(--radius-card);
      }

      /* Gradient text utility */
      .grad-text {
        background: linear-gradient(135deg, #4f8ef7 0%, #a855f7 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      /* Focus ring */
      input:focus, textarea:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(99,102,241,0.35);
      }
    `}</style>
  );
}