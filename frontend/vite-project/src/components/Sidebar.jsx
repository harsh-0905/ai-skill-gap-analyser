import { motion } from "framer-motion";
import {
  Briefcase, LayoutDashboard, ScanSearch, BarChart3, GraduationCap,
  UserCircle, Settings, ChevronRight, Sparkles, X,
} from "lucide-react";
import { NAV_ITEMS } from "../data/constants";

const ICONS = {
  jobs:      Briefcase,
  dashboard: LayoutDashboard,
  analyze:   ScanSearch,
  reports:   BarChart3,
  learning:  GraduationCap,
  profile:   UserCircle,
  settings:  Settings,
};

const MAIN_IDS   = ["dashboard", "analyze", "reports", "learning"];
const BOTTOM_IDS = ["profile", "settings"];

export default function Sidebar({ open, isDesktop, page, setPage, profile, onClose }) {
  const initials = (profile?.name || "?")
    .split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const mainNav   = NAV_ITEMS.filter(n => MAIN_IDS.includes(n.id));
  const bottomNav = NAV_ITEMS.filter(n => BOTTOM_IDS.includes(n.id));

  const showLabels  = !isDesktop || open;
  const sidebarWidth = isDesktop ? (open ? 240 : 64) : 280;

  const inner = (
    <aside style={{
      width: sidebarWidth,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      background: "var(--sidebar-bg)",
      borderRight: "1px solid var(--sidebar-border)",
      position: "relative",
      flexShrink: 0,
    }}>
      {/* Top glow */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 120, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 0%, var(--sidebar-glow) 0%, transparent 70%)",
      }} />

      {/* ── Logo row ── */}
      <div style={{
        height: 56, display: "flex", alignItems: "center",
        padding: "0 16px", borderBottom: "1px solid var(--sidebar-border)",
        flexShrink: 0, gap: 12,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10, flexShrink: 0,
          background: "linear-gradient(135deg, #4f8ef7, #a855f7)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Sparkles size={15} color="white" />
        </div>

        {showLabels && (
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ fontWeight: 700, color: "var(--sidebar-brand)", fontSize: 13, lineHeight: 1, letterSpacing: "-0.02em" }}>
              SkillGap AI
            </p>
            <p style={{ fontSize: 10, color: "var(--sidebar-brand-sub)", marginTop: 3 }}>
              Career Intelligence
            </p>
          </div>
        )}

        {!isDesktop && (
          <button onClick={onClose} aria-label="Close menu" style={{
            width: 32, height: 32, borderRadius: 8, marginLeft: "auto",
            background: "var(--sidebar-close-bg)",
            border: "1px solid var(--sidebar-close-border)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", flexShrink: 0,
            color: "var(--text-muted)",
          }}>
            <X size={15} />
          </button>
        )}
      </div>

      {/* ── Main nav ── */}
      <nav role="navigation" aria-label="Main navigation"
        style={{ flex: 1, overflowY: "auto", padding: "12px 10px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
        {showLabels && (
          <p style={{
            fontSize: 10, fontWeight: 600, letterSpacing: "0.08em",
            textTransform: "uppercase", padding: "0 8px 6px",
            color: "var(--sidebar-label)",
          }}>
            Menu
          </p>
        )}
        {mainNav.map((item, i) => (
          <NavItem key={item.id} item={item} active={page === item.id}
            showLabel={showLabels} onClick={() => setPage(item.id)} delay={i * 0.04} />
        ))}
      </nav>

      {/* ── Bottom nav ── */}
      <div style={{ padding: "8px 10px 12px", borderTop: "1px solid var(--sidebar-border)", display: "flex", flexDirection: "column", gap: 2 }}>
        {bottomNav.map(item => (
          <NavItem key={item.id} item={item} active={page === item.id}
            showLabel={showLabels} onClick={() => setPage(item.id)} />
        ))}

        {showLabels && (
          <button onClick={() => setPage("profile")} aria-label="View profile" style={{
            marginTop: 6, display: "flex", alignItems: "center", gap: 10,
            padding: "10px 12px", borderRadius: 12,
            background: "var(--sidebar-user-bg)",
            border: "1px solid var(--sidebar-user-border)",
            cursor: "pointer", textAlign: "left", minHeight: 48, width: "100%",
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              background: "linear-gradient(135deg, #4f8ef7, #a855f7)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, color: "white",
            }}>
              {initials}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "var(--sidebar-user-name)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {profile?.name || "Set up profile"}
              </p>
              <p style={{ fontSize: 10, color: "var(--sidebar-user-email)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 1 }}>
                {profile?.email || "Tap to edit →"}
              </p>
            </div>
            <ChevronRight size={12} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
          </button>
        )}
      </div>
    </aside>
  );

  if (isDesktop) {
    return (
      <motion.div animate={{ width: open ? 240 : 64 }} transition={{ type: "spring", stiffness: 320, damping: 32 }}
        style={{ flexShrink: 0, height: "100%", overflow: "hidden" }}>
        {inner}
      </motion.div>
    );
  }

  return inner;
}

function NavItem({ item, active, showLabel, onClick }) {
  const Icon = ICONS[item.id] || LayoutDashboard;
  return (
    <button onClick={onClick} aria-current={active ? "page" : undefined} title={!showLabel ? item.label : undefined}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: showLabel ? "0 12px" : "0",
        justifyContent: showLabel ? "flex-start" : "center",
        borderRadius: 10, minHeight: 44, width: "100%",
        cursor: "pointer", textAlign: "left",
        background: active ? "var(--sidebar-item-active-bg)" : "transparent",
        border: active ? "1px solid var(--sidebar-item-active-border)" : "1px solid transparent",
        position: "relative",
        transition: "background 0.15s, border-color 0.15s, color 0.15s",
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = "var(--bg-sidebar-hover)"; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
    >
      <Icon size={17} style={{ flexShrink: 0, color: active ? "var(--sidebar-icon-active)" : "var(--sidebar-icon)" }} />
      {showLabel && (
        <span style={{
          fontSize: 13, fontWeight: active ? 600 : 500,
          color: active ? "var(--sidebar-text-active)" : "var(--sidebar-text)",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {item.label}
        </span>
      )}
      {showLabel && active && (
        <span style={{
          marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, #4f8ef7, #a855f7)",
        }} />
      )}
    </button>
  );
}