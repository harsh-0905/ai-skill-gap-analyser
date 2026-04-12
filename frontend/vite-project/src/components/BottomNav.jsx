import { motion } from "framer-motion";
import { LayoutDashboard, ScanSearch, BarChart3, GraduationCap, UserCircle } from "lucide-react";

const TABS = [
  { id: "dashboard", label: "Home",    Icon: LayoutDashboard },
  { id: "analyze",   label: "Analyze", Icon: ScanSearch      },
  { id: "reports",   label: "Reports", Icon: BarChart3        },
  { id: "learning",  label: "Learn",   Icon: GraduationCap   },
  { id: "profile",   label: "Profile", Icon: UserCircle      },
];

export default function BottomNav({ page, setPage }) {
  return (
    <nav
      role="navigation"
      aria-label="Bottom navigation"
      style={{
        position: "fixed",
        bottom: 0, left: 0, right: 0,
        zIndex: 40,
        background: "rgba(6,6,8,0.97)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {TABS.map(({ id, label, Icon }) => {
        const active = page === id;
        return (
          <button
            key={id}
            onClick={() => setPage(id)}
            aria-label={label}
            aria-current={active ? "page" : undefined}
            style={{
              flex: 1,
              height: 60,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              position: "relative",
              WebkitTapHighlightColor: "transparent",
              minWidth: 0,
            }}
          >
            {/* Active top pill */}
            {active && (
              <motion.div
                layoutId="bottomPill"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 28,
                  height: 2.5,
                  borderRadius: 999,
                  background: "linear-gradient(90deg, #4f8ef7, #a855f7)",
                }}
              />
            )}

            <Icon
              size={22}
              style={{ color: active ? "#818cf8" : "rgba(200,200,220,0.32)", transition: "color 0.2s" }}
            />
            <span style={{
              fontSize: 10, fontWeight: 600, lineHeight: 1,
              color: active ? "#c7d2fe" : "rgba(200,200,220,0.28)",
              transition: "color 0.2s",
            }}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}