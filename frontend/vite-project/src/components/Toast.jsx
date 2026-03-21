import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

const TYPES = {
  success: { Icon: CheckCircle2, color: "#10b981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.25)" },
  error:   { Icon: XCircle,      color: "#f43f5e", bg: "rgba(244,63,94,0.1)",   border: "rgba(244,63,94,0.25)"  },
  info:    { Icon: Info,          color: "#4f8ef7", bg: "rgba(79,142,247,0.1)",  border: "rgba(79,142,247,0.25)" },
};

export default function Toast({ toasts, dismiss }) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => {
          const { Icon, color, bg, border } = TYPES[t.type] ?? TYPES.info;
          return (
            <motion.div
              key={t.id}
              initial={{ x: 80, opacity: 0, scale: 0.95 }}
              animate={{ x: 0,  opacity: 1, scale: 1    }}
              exit={{   x: 80, opacity: 0, scale: 0.95  }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl min-w-72 max-w-sm"
              style={{
                background: bg,
                border: `1px solid ${border}`,
                backdropFilter: "blur(20px)",
                boxShadow: `0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)`,
              }}
            >
              <Icon size={16} style={{ color, flexShrink: 0 }} />
              <span className="flex-1 text-sm font-medium" style={{ color: "rgba(220,220,240,0.9)" }}>
                {t.msg}
              </span>
              <button
                onClick={() => dismiss(t.id)}
                className="p-0.5 rounded-lg hover:bg-white/10 transition-colors shrink-0"
              >
                <X size={13} style={{ color: "rgba(200,200,220,0.4)" }} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}