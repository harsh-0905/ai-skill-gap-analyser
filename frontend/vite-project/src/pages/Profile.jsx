import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sendLearningPlan } from "../api";

/**
 * Profile
 * Complete profile page: avatar, editable info, stats, send plan to email.
 * Props: profile, onProfileSave, analysis, addToast
 */
export default function Profile({ profile, onProfileSave, analysis, addToast }) {
  const [name,      setName]      = useState(profile?.name  ?? "");
  const [email,     setEmail]     = useState(profile?.email ?? "");
  const [role,      setRole]      = useState(profile?.role  ?? "");
  const [editing,   setEditing]   = useState(false);
  const [sending,   setSending]   = useState(false);
  const [sent,      setSent]      = useState(false);
  const [sendError, setSendError] = useState(null);

  const initials = (name || "U").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const handleSave = () => {
    if (!name.trim())  { addToast("Name cannot be empty.", "error");  return; }
    if (!email.trim()) { addToast("Email cannot be empty.", "error"); return; }
    onProfileSave({ name: name.trim(), email: email.trim(), role: role.trim() });
    setEditing(false);
    addToast("Profile saved!", "success");
  };

  const handleSendPlan = async () => {
    if (!email.trim())  { addToast("Add your email first.", "error"); return; }
    if (!analysis)      { addToast("Run an analysis first — nothing to send yet.", "error"); return; }

    setSending(true);
    setSendError(null);

    try {
      await sendLearningPlan(email.trim(), analysis, { name, role });
      setSent(true);
      addToast(`Learning plan sent to ${email}!`, "success");
      setTimeout(() => setSent(false), 6000);
    } catch (err) {
      // Build a readable message from the axios error
      let msg = "Failed to send email.";
      if (err.response) {
        const detail = err.response.data?.detail ?? err.response.data?.message;
        msg = detail
          ? `Server error: ${detail}`
          : `Server returned ${err.response.status}. Check FastAPI logs.`;
      } else if (err.request) {
        msg = "No response from server — is FastAPI running on http://127.0.0.1:8000?";
      }
      setSendError(msg);
      addToast(msg, "error");
    } finally {
      setSending(false);
    }
  };

  const matched = analysis?.matched_skills?.length ?? 0;
  const missing = analysis?.missing_skills?.length ?? 0;
  const matchPct = analysis?.match_percentage ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Profile</h1>
        <p className="text-white/40 text-sm">Manage your identity and send your learning plan</p>
      </div>

      {/* ── Profile card ── */}
      <div className="rounded-3xl border border-white/10 overflow-hidden"
        style={{ background: "rgba(255,255,255,0.03)" }}>

        {/* Cover gradient */}
        <div className="h-28 relative"
          style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.5) 0%, rgba(168,85,247,0.4) 50%, rgba(59,130,246,0.3) 100%)" }}>
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 60%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.05) 0%, transparent 60%)" }} />
        </div>

        <div className="px-8 pb-8">
          {/* Avatar row */}
          <div className="flex flex-wrap items-end justify-between gap-4 -mt-12 mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl border-4 border-[#0a0a0f] flex items-center justify-center text-3xl font-bold text-white"
                style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
                {initials}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#0a0a0f]" />
            </div>
            <div className="flex gap-2 mb-1">
              {!editing ? (
                <motion.button whileTap={{ scale: 0.96 }} onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/8 hover:bg-white/12 border border-white/15 text-white/80 text-sm font-medium transition-colors">
                  ✎ Edit Profile
                </motion.button>
              ) : (
                <>
                  <motion.button whileTap={{ scale: 0.96 }} onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors">
                    ✓ Save
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.96 }} onClick={() => setEditing(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 text-sm font-medium transition-colors hover:text-white/80">
                    Cancel
                  </motion.button>
                </>
              )}
            </div>
          </div>

          {/* Name / role display or edit */}
          <AnimatePresence mode="wait">
            {!editing ? (
              <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="text-xl font-bold text-white">{name || "Your Name"}</h2>
                <p className="text-white/40 text-sm mt-0.5">{role || "Add your role…"}</p>
                <p className="text-white/30 text-sm mt-0.5">{email || "your@email.com"}</p>
              </motion.div>
            ) : (
              <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name"    type="text"  value={name}  onChange={setName}  placeholder="e.g. Harsh Yadav" />
                <Field label="Email"        type="email" value={email} onChange={setEmail} placeholder="you@example.com"  />
                <Field label="Current Role" type="text"  value={role}  onChange={setRole}  placeholder="e.g. Frontend Developer" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Match Score", value: `${matchPct}%`, color: "text-indigo-300",  icon: "◎", bg: "from-indigo-600/15 to-indigo-600/5", border: "border-indigo-500/20" },
          { label: "Matched",     value: matched,        color: "text-emerald-300", icon: "✓", bg: "from-emerald-600/15 to-emerald-600/5", border: "border-emerald-500/20" },
          { label: "Missing",     value: missing,        color: "text-rose-300",    icon: "✕", bg: "from-rose-600/15 to-rose-600/5",       border: "border-rose-500/20" },
        ].map(({ label, value, color, icon, bg, border }) => (
          <motion.div key={label} whileHover={{ y: -2 }}
            className={`rounded-2xl border ${border} bg-gradient-to-br ${bg} p-5 text-center`}>
            <p className={`text-2xl font-bold ${color} mb-1`}>{value}</p>
            <p className="text-xs text-white/40">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Send learning plan card ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-indigo-500/25 overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(168,85,247,0.08) 100%)" }}
      >
        {/* Card header */}
        <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-white/8">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xl shrink-0">
            📬
          </div>
          <div>
            <h3 className="text-white font-semibold">Send My Learning Plan</h3>
            <p className="text-white/40 text-xs mt-0.5">
              Enter <span className="text-indigo-300 font-medium">your email</span> below — we'll send the full report directly to your inbox.
            </p>
          </div>
        </div>

        <div className="p-6 space-y-5">

          {/* Step indicator */}
          <div className="flex items-center gap-3">
            {[
              { n: "1", label: "Enter your email" },
              { n: "2", label: "Click Send" },
              { n: "3", label: "Check your inbox" },
            ].map(({ n, label }, i) => (
              <div key={n} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-indigo-500/30 border border-indigo-500/40 flex items-center justify-center text-[10px] font-bold text-indigo-300 shrink-0">
                  {n}
                </div>
                <span className="text-xs text-white/40">{label}</span>
                {i < 2 && <span className="text-white/20 text-xs ml-1">→</span>}
              </div>
            ))}
          </div>

          {/* Email input */}
          <div>
            <label className="text-xs text-white/50 block mb-1.5">
              Your email address <span className="text-indigo-400">(recipient)</span>
            </label>
            <div className="flex gap-3">
              <div className="flex-1 relative min-w-0">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 text-sm">✉</span>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setSendError(null); setSent(false); }}
                  placeholder="you@example.com"
                  className="w-full bg-white/5 border border-white/15 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white
                    placeholder-white/25 focus:outline-none focus:border-indigo-500/60 transition-colors"
                />
              </div>
              <motion.button
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.02 }}
                onClick={handleSendPlan}
                disabled={sending || !email.trim() || !analysis}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white
                  disabled:opacity-40 disabled:cursor-not-allowed shrink-0 transition-all relative overflow-hidden"
                style={{
                  background: sent
                    ? "linear-gradient(135deg, #10b981, #059669)"
                    : "linear-gradient(135deg, #6366f1, #a855f7)",
                }}
              >
                {sending ? (
                  <><Spinner /> Sending…</>
                ) : sent ? (
                  <>✓ Sent to you!</>
                ) : (
                  <>✉ Send to Me</>
                )}
                {sending && (
                  <motion.div
                    animate={{ x: ["0%", "300%"] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                    className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                  />
                )}
              </motion.button>
            </div>
            <p className="text-[11px] text-white/25 mt-1.5 ml-1">
              This report will be sent <span className="text-white/40">only to the address you enter above</span>.
            </p>
          </div>

          {/* No analysis warning */}
          {!analysis && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-amber-400 shrink-0">⚠</span>
              <p className="text-xs text-amber-300/80">
                No analysis data yet — go to <strong>Analyze Resume</strong> first, then come back to send your report.
              </p>
            </motion.div>
          )}

          {/* Success confirmation */}
          {sent && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25"
            >
              <span className="text-emerald-400 text-lg shrink-0">✓</span>
              <div>
                <p className="text-sm font-semibold text-emerald-300">Email sent successfully!</p>
                <p className="text-xs text-emerald-300/60 mt-0.5">
                  Your learning plan has been delivered to <strong>{email}</strong>. Check your inbox (and spam folder just in case).
                </p>
              </div>
            </motion.div>
          )}

          {/* Error message */}
          {sendError && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2.5 p-4 rounded-xl bg-rose-500/10 border border-rose-500/25"
            >
              <span className="text-rose-400 shrink-0 mt-0.5">⚠</span>
              <div>
                <p className="text-xs font-semibold text-rose-300">Failed to send email</p>
                <p className="text-xs text-rose-300/60 mt-0.5 leading-relaxed">{sendError}</p>
                <p className="text-xs text-white/25 mt-2">
                  Check that <code className="bg-white/8 px-1 rounded">SMTP_USER</code> and <code className="bg-white/8 px-1 rounded">SMTP_PASSWORD</code> are set in your FastAPI <code className="bg-white/8 px-1 rounded">.env</code> file.
                </p>
              </div>
            </motion.div>
          )}

          {/* What's included chips */}
          <div>
            <p className="text-xs text-white/30 mb-2">What's included in the email:</p>
            <div className="flex flex-wrap gap-2">
              {[
                { icon: "📊", label: "Match Score Report" },
                { icon: "❌", label: "Missing Skills List" },
                { icon: "🗺️", label: "8-Week Roadmap" },
                { icon: "▶",  label: "YouTube Course Links" },
                { icon: "🎓", label: "Certificate Links" },
                { icon: "💡", label: "Career Advice" },
              ].map(({ icon, label }) => (
                <span key={label}
                  className="text-xs bg-white/5 border border-white/10 text-white/45 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <span>{icon}</span>{label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Skills owned ── */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-white/10 p-6"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <h3 className="text-white font-semibold mb-4">Your Skill Portfolio</h3>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/40">Overall Readiness</span>
              <span className="text-xs text-indigo-300 font-medium">{matchPct}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/8 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${matchPct}%` }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #6366f1, #a855f7)" }}
              />
            </div>
          </div>

          <div className="space-y-3">
            {analysis.matched_skills?.map((skill, i) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="flex items-center gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-sm text-white/70 capitalize">{skill}</span>
                  <div className="flex items-center gap-2 w-32">
                    <div className="flex-1 h-1.5 rounded-full bg-white/8">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${75 + Math.random() * 25}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + i * 0.05 }}
                        className="h-full rounded-full bg-emerald-500/60"
                      />
                    </div>
                    <span className="text-xs text-emerald-400/60 shrink-0">✓</span>
                  </div>
                </div>
              </motion.div>
            ))}
            {analysis.missing_skills?.map((skill, i) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + (matched + i) * 0.05 }}
                className="flex items-center gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-rose-400/50 shrink-0" />
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-sm text-white/30 capitalize">{skill}</span>
                  <div className="flex items-center gap-2 w-32">
                    <div className="flex-1 h-1.5 rounded-full bg-white/8">
                      <div className="h-full w-0 rounded-full bg-rose-500/30" />
                    </div>
                    <span className="text-xs text-rose-400/40 shrink-0">✕</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
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

function Spinner() {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block shrink-0"
    />
  );
}