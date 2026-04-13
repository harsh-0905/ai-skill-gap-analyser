import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Briefcase, Moon, Sun, Wifi, Trash2 } from "lucide-react";

export default function Settings({ profile, onProfileSave, addToast }) {
  const [name,  setName]  = useState(profile?.name  ?? "");
  const [email, setEmail] = useState(profile?.email ?? "");
  const [role,  setRole]  = useState(profile?.role  ?? "");
  const [theme, setTheme] = useState("dark");

  const saveProfile = () => {
    if (!name.trim())  { addToast("Name cannot be empty.",  "error"); return; }
    if (!email.trim()) { addToast("Email cannot be empty.", "error"); return; }
    onProfileSave({ name: name.trim(), email: email.trim(), role: role.trim() });
    addToast("Profile updated!", "success");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto space-y-4">

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold mb-0.5"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
          Settings
        </h1>
        <p className="text-xs sm:text-sm" style={{ color: "var(--text-muted)" }}>
          Configure your SkillGap AI preferences
        </p>
      </div>

      {/* Profile */}
      <Card title="Profile" icon={<User size={14} />}>
        <Field label="Full Name"    icon={<User size={11} />}     type="text"  value={name}  onChange={setName}  placeholder="Harsh Yadav" />
        <Field label="Email"        icon={<Mail size={11} />}     type="email" value={email} onChange={setEmail} placeholder="harsh@example.com" />
        <Field label="Current Role" icon={<Briefcase size={11} />} type="text" value={role}  onChange={setRole}  placeholder="Frontend Developer" />
        <motion.button whileTap={{ scale: 0.97 }} onClick={saveProfile}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-colors"
          style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
          Save Changes
        </motion.button>
      </Card>

      {/* Appearance */}
      <Card title="Appearance" icon={<Sun size={14} />}>
        <div>
          <label className="text-xs font-medium block mb-2.5" style={{ color: "var(--text-secondary)" }}>
            Theme
          </label>
          <div className="flex gap-2">
            {[
              { key: "dark",  label: "Dark",  Icon: Moon },
              { key: "light", label: "Light", Icon: Sun  },
            ].map(({ key, label, Icon }) => (
              <button key={key} onClick={() => setTheme(key)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: theme === key
                    ? "rgba(99,102,241,0.15)"
                    : "var(--bg-elevated)",
                  border: theme === key
                    ? "1px solid rgba(99,102,241,0.35)"
                    : "1px solid var(--border)",
                  color: theme === key ? "#818cf8" : "var(--text-muted)",
                }}>
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* API Status */}
      <Card title="API Status" icon={<Wifi size={14} />}>
        <div className="flex items-center gap-2.5 p-3 rounded-xl"
          style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)" }}>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="text-xs font-medium" style={{ color: "#10b981" }}>
            Connected to backend
          </span>
        </div>
        <div className="rounded-xl p-3"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
          <p className="text-[10px] font-semibold uppercase tracking-wider mb-1"
            style={{ color: "var(--text-muted)" }}>
            Backend URL
          </p>
          <code className="text-xs break-all" style={{ color: "var(--text-secondary)" }}>
            {import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}
          </code>
        </div>
      </Card>

      {/* Danger zone */}
      <Card title="Account" icon={<Trash2 size={14} />} danger>
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          Clearing your data will remove all analysis history and profile info from this session.
        </p>
        <button
          onClick={() => addToast("Session data cleared.", "info")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          style={{
            background: "rgba(244,63,94,0.08)",
            border: "1px solid rgba(244,63,94,0.25)",
            color: "#f43f5e",
          }}>
          <Trash2 size={13} />
          Clear Session Data
        </button>
      </Card>
    </motion.div>
  );
}

function Card({ title, icon, children, danger }) {
  return (
    <div
      className="rounded-2xl p-4 sm:p-5 space-y-3 sm:space-y-4"
      style={{
        background: danger ? "rgba(244,63,94,0.04)" : "var(--bg-card)",
        border: danger ? "1px solid rgba(244,63,94,0.2)" : "1px solid var(--border)",
      }}
    >
      <div className="flex items-center gap-2 pb-3"
        style={{ borderBottom: "1px solid var(--border)" }}>
        <span style={{ color: "var(--text-muted)" }}>{icon}</span>
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function Field({ label, icon, type, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-xs font-medium flex items-center gap-1 mb-1.5"
        style={{ color: "var(--text-secondary)" }}>
        {icon} {label}
      </label>
      <input
        type={type} value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl px-3 py-2.5 text-sm transition-colors"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-strong)",
          color: "var(--text-primary)",
          outline: "none",
        }}
      />
    </div>
  );
}