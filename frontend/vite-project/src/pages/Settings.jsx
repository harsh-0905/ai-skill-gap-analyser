import { useState } from "react";
import { motion } from "framer-motion";

export default function Settings({ profile, onProfileSave, addToast }) {
  const [name,   setName]   = useState(profile?.name  ?? "");
  const [email,  setEmail]  = useState(profile?.email ?? "");
  const [role,   setRole]   = useState(profile?.role  ?? "");
  const [apiUrl, setApiUrl] = useState("http://127.0.0.1:8000");
  const [theme,  setTheme]  = useState("dark");

  const saveProfile = () => {
    if (!name.trim())  { addToast("Name cannot be empty.",  "error"); return; }
    if (!email.trim()) { addToast("Email cannot be empty.", "error"); return; }
    onProfileSave({ name: name.trim(), email: email.trim(), role: role.trim() });
    addToast("Profile updated!", "success");
  };

  const saveApi = () => {
    if (!apiUrl.trim()) { addToast("API URL cannot be empty.", "error"); return; }
    addToast("API URL saved!", "success");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 lg:p-8 max-w-2xl mx-auto space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
        <p className="text-white/40 text-sm">Configure your SkillGap AI preferences</p>
      </div>

      {/* Profile */}
      <Card title="Profile" icon="⊙">
        <Field label="Full Name"    type="text"  value={name}  onChange={setName}  placeholder="Harsh Yadav" />
        <Field label="Email"        type="email" value={email} onChange={setEmail} placeholder="harsh@example.com" />
        <Field label="Current Role" type="text"  value={role}  onChange={setRole}  placeholder="Frontend Developer" />
        <SaveBtn onClick={saveProfile} />
      </Card>

      {/* API */}
      <Card title="API Configuration" icon="◈">
        <Field label="Backend API URL" type="text" value={apiUrl} onChange={setApiUrl} placeholder="http://127.0.0.1:8000" />
        <p className="text-xs text-white/30">
          Make sure CORS is enabled in your FastAPI server for <code className="bg-white/8 px-1 rounded">http://localhost:5173</code>
        </p>
        <SaveBtn onClick={saveApi} />
      </Card>

      {/* Appearance */}
      <Card title="Appearance" icon="◑">
        <div>
          <label className="text-xs text-white/50 block mb-3">Theme</label>
          <div className="flex gap-3">
            {["dark", "light"].map(t => (
              <button key={t} onClick={() => setTheme(t)}
                className={`flex-1 py-3 rounded-xl border text-sm font-medium capitalize transition-all
                  ${theme === t
                    ? "border-indigo-500/50 bg-indigo-600/20 text-indigo-300"
                    : "border-white/10 bg-white/5 text-white/40 hover:text-white/60"}`}>
                {t === "dark" ? "🌙 Dark" : "☀️ Light"}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Danger zone */}
      <Card title="Account" icon="⚠" danger>
        <p className="text-xs text-white/40">Clearing your data will remove all analysis history and profile info from this session.</p>
        <button
          onClick={() => addToast("Session data cleared.", "info")}
          className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-sm font-medium transition-colors">
          Clear Session Data
        </button>
      </Card>
    </motion.div>
  );
}

function Card({ title, icon, children, danger }) {
  return (
    <div className={`rounded-2xl border p-6 space-y-4 ${danger ? "border-rose-500/20 bg-rose-500/5" : "border-white/10"}`}
      style={!danger ? { background: "rgba(255,255,255,0.03)" } : {}}>
      <div className="flex items-center gap-2 border-b border-white/8 pb-3">
        <span className="text-white/40">{icon}</span>
        <h3 className="text-white font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Field({ label, type, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-xs text-white/50 block mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white
          placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-colors"
      />
    </div>
  );
}

function SaveBtn({ onClick }) {
  return (
    <motion.button whileTap={{ scale: 0.97 }} onClick={onClick}
      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors">
      Save Changes
    </motion.button>
  );
}