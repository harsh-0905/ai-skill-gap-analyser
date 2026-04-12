import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard, ScanSearch, BarChart3, GraduationCap,
  UserCircle, Settings, ChevronRight, Sparkles, X,
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

/**
 * Sidebar
 * Desktop: in-flow, animates between 64px (collapsed) ↔ 240px (expanded).
 * Mobile:  full 280px wide, always "open" state, rendered as overlay by parent.
 *
 * Props:
 *   open       — bool: expanded on desktop / always true on mobile (parent controls)
 *   isDesktop  — bool: determines icon-only vs label mode on collapse
 *   page       — string: current active page id
 *   setPage    — fn
 *   profile    — { name, email }
 *   onClose    — fn: closes the sidebar (mobile only)
 */
export default function Sidebar({ open, isDesktop, page, setPage, profile, onClose }) {
  const initials = (profile?.name || "?")
    .split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const mainNav   = NAV_ITEMS.filter(n => MAIN_IDS.includes(n.id));
  const bottomNav = NAV_ITEMS.filter(n => BOTTOM_IDS.includes(n.id));

  // On mobile the sidebar is always "expanded" (labels visible)
  const showLabels = !isDesktop || open;
  const sidebarWidth = isDesktop ? (open ? 240 : 64) : 280;

  const inner = (
    <aside
      style={{
        width: sidebarWidth,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "linear-gradient(180deg, #09090f 0%, #0b0b14 100%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        position: "relative",
        flexShrink: 0,
      }}
    >
      {/* Top glow */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 120, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.13) 0%, transparent 70%)",
      }} />

      {/* ── Logo row ── */}
      <div style={{
        height: 56,
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        flexShrink: 0,
        gap: 12,
      }}>
        {/* Logo mark */}
        <div style={{
          width: 32, height: 32,
          borderRadius: 10,
          background: "linear-gradient(135deg, #4f8ef7, #a855f7)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <Sparkles size={15} color="white" />
        </div>

        {/* Brand name — show on mobile always, or when desktop open */}
        {showLabels && (
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ fontWeight: 700, color: "white", fontSize: 13, lineHeight: 1, letterSpacing: "-0.02em" }}>
              SkillGap AI
            </p>
            <p style={{ fontSize: 10, color: "rgba(200,200,220,0.3)", marginTop: 3 }}>
              Career Intelligence
            </p>
          </div>
        )}

        {/* Close button — mobile only */}
        {!isDesktop && (
          <button
            onClick={onClose}
            aria-label="Close menu"
            style={{
              width: 32, height: 32, borderRadius: 8, marginLeft: "auto",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.09)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", flexShrink: 0,
              color: "rgba(200,200,220,0.5)",
            }}
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* ── Main nav ── */}
      <nav
        role="navigation"
        aria-label="Main navigation"
        style={{ flex: 1, overflowY: "auto", padding: "12px 10px 8px", display: "flex", flexDirection: "column", gap: 2 }}
      >
        {showLabels && (
          <p style={{
            fontSize: 10, fontWeight: 600, letterSpacing: "0.08em",
            textTransform: "uppercase", padding: "0 8px 6px",
            color: "rgba(200,200,220,0.25)",
          }}>
            Menu
          </p>
        )}
        {mainNav.map((item, i) => (
          <NavItem
            key={item.id}
            item={item}
            active={page === item.id}
            showLabel={showLabels}
            onClick={() => setPage(item.id)}
            delay={i * 0.04}
          />
        ))}
      </nav>

      {/* ── Bottom nav ── */}
      <div style={{ padding: "8px 10px 12px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: 2 }}>
        {bottomNav.map(item => (
          <NavItem
            key={item.id}
            item={item}
            active={page === item.id}
            showLabel={showLabels}
            onClick={() => setPage(item.id)}
          />
        ))}

        {/* User strip */}
        {showLabels && (
          <button
            onClick={() => setPage("profile")}
            aria-label="View profile"
            style={{
              marginTop: 6,
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 12,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              cursor: "pointer", textAlign: "left",
              minHeight: 48,
              width: "100%",
            }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              background: "linear-gradient(135deg, #4f8ef7, #a855f7)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, color: "white",
            }}>
              {initials}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(240,240,255,0.8)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {profile?.name || "Set up profile"}
              </p>
              <p style={{ fontSize: 10, color: "rgba(200,200,220,0.3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 1 }}>
                {profile?.email || "Tap to edit →"}
              </p>
            </div>
            <ChevronRight size={12} color="rgba(255,255,255,0.18)" style={{ flexShrink: 0 }} />
          </button>
        )}
      </div>
    </aside>
  );

  // Desktop: wrap in motion.div for width animation
  if (isDesktop) {
    return (
      <motion.div
        animate={{ width: open ? 240 : 64 }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        style={{ flexShrink: 0, height: "100%", overflow: "hidden" }}
      >
        {inner}
      </motion.div>
    );
  }

  // Mobile: no motion wrapper needed (parent AnimatePresence handles x animation)
  return inner;
}

function NavItem({ item, active, showLabel, onClick, delay = 0 }) {
  const Icon = ICONS[item.id] || LayoutDashboard;

  return (
    <button
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      title={!showLabel ? item.label : undefined}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: showLabel ? "0 12px" : "0",
        justifyContent: showLabel ? "flex-start" : "center",
        borderRadius: 10,
        minHeight: 44,
        width: "100%",
        cursor: "pointer",
        textAlign: "left",
        background: active
          ? "linear-gradient(135deg, rgba(79,142,247,0.18), rgba(168,85,247,0.12))"
          : "transparent",
        border: active ? "1px solid rgba(99,102,241,0.25)" : "1px solid transparent",
        color: active ? "#a5b4fc" : "rgba(200,200,220,0.45)",
        position: "relative",
        transition: "background 0.15s, border-color 0.15s, color 0.15s",
      }}
    >
      <Icon
        size={17}
        style={{ flexShrink: 0, color: active ? "#818cf8" : "rgba(200,200,220,0.4)" }}
      />
      {showLabel && (
        <span style={{
          fontSize: 13, fontWeight: 500,
          color: active ? "#c7d2fe" : "rgba(200,200,220,0.6)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>
          {item.label}
        </span>
      )}
      {showLabel && active && (
        <span style={{
          marginLeft: "auto",
          width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, #4f8ef7, #a855f7)",
        }} />
      )}
    </button>
  );
}