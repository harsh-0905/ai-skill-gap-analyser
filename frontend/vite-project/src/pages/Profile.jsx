import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Edit3, Check, X, Send, User, Briefcase, AlertCircle, CheckCircle } from "lucide-react";
import { sendLearningPlan } from "../api";

export default function Profile({ profile, onProfileSave, analysis, addToast }) {
  const [name,      setName]      = useState(profile?.name  ?? "");
  const [email,     setEmail]     = useState(profile?.email ?? "");
  const [role,      setRole]      = useState(profile?.role  ?? "");
  const [editing,   setEditing]   = useState(false);
  const [sending,   setSending]   = useState(false);
  const [sent,      setSent]      = useState(false);
  const [sendError, setSendError] = useState(null);

  const initials = (name || "U").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const matched  = analysis?.matched_skills?.length ?? 0;
  const missing  = analysis?.missing_skills?.length ?? 0;
  const matchPct = analysis?.match_percentage ?? 0;

  const handleSave = () => {
    if (!name.trim())  { addToast("Name cannot be empty.", "error");  return; }
    if (!email.trim()) { addToast("Email cannot be empty.", "error"); return; }
    onProfileSave({ name: name.trim(), email: email.trim(), role: role.trim() });
    setEditing(false);
    addToast("Profile saved!", "success");
  };

  const handleSendPlan = async () => {
    if (!email.trim()) { addToast("Add your email first.", "error"); return; }
    if (!analysis)     { addToast("Run an analysis first.", "error"); return; }
    setSending(true); setSendError(null);
    try {
      await sendLearningPlan(email.trim(), analysis, { name, role });
      setSent(true);
      addToast(`Learning plan sent to ${email}!`, "success");
      setTimeout(() => setSent(false), 6000);
    } catch (err) {
      let msg = "Failed to send email.";
      if (err.response) {
        const detail = err.response.data?.detail ?? err.response.data?.message;
        msg = detail ? `${detail}` : `Server returned ${err.response.status}.`;
      } else if (err.request) {
        msg = "No response from server. Try again in a moment.";
      }
      setSendError(msg);
      addToast(msg, "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-4 sm:space-y-5">

      {/* Page header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold mb-0.5"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
          Profile
        </h1>
        <p className="text-xs sm:text-sm" style={{ color: "var(--text-muted)" }}>
          Manage your identity and send your learning plan
        </p>
      </div>

      {/* ── Profile card ── */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>

        {/* Cover */}
        <div className="h-20 sm:h-24 relative"
          style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.6), rgba(168,85,247,0.5), rgba(59,130,246,0.4))" }}>
          <div className="absolute inset-0"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)" }} />
        </div>

        <div className="px-5 sm:px-6 pb-5 sm:pb-6">
          {/* Avatar + actions */}
          <div className="flex items-end justify-between -mt-10 sm:-mt-12 mb-4">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #a855f7)",
                  fontSize: 22,
                  border: "3px solid var(--bg-card)",
                }}>
                {initials}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500"
                style={{ border: "2px solid var(--bg-card)" }} />
            </div>

            <div className="flex gap-2 mb-1">
              {!editing ? (
                <motion.button whileTap={{ scale: 0.96 }} onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
                  style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-strong)",
                    color: "var(--text-secondary)",
                  }}>
                  <Edit3 size={12} /> Edit Profile
                </motion.button>
              ) : (
                <>
                  <motion.button whileTap={{ scale: 0.96 }} onClick={handleSave}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white"
                    style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
                    <Check size={12} /> Save
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.96 }} onClick={() => setEditing(false)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                    <X size={12} />
                  </motion.button>
                </>
              )}
            </div>
          </div>

          {/* Info / edit form */}
          <AnimatePresence mode="wait">
            {!editing ? (
              <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="text-base sm:text-lg font-bold mb-0.5"
                  style={{ color: "var(--text-primary)" }}>
                  {name || "Your Name"}
                </h2>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  {role && (
                    <span className="flex items-center gap-1 text-xs"
                      style={{ color: "var(--text-secondary)" }}>
                      <Briefcase size={11} /> {role}
                    </span>
                  )}
                  {email && (
                    <span className="flex items-center gap-1 text-xs"
                      style={{ color: "var(--text-muted)" }}>
                      <Mail size={11} /> {email}
                    </span>
                  )}
                  {!role && !email && (
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      Click Edit Profile to add your details
                    </span>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Full Name"    icon={<User size={12} />}     type="text"  value={name}  onChange={setName}  placeholder="e.g. Harsh Yadav" />
                <Field label="Email"        icon={<Mail size={12} />}     type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
                <Field label="Current Role" icon={<Briefcase size={12} />} type="text" value={role}  onChange={setRole}  placeholder="e.g. Frontend Developer" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {[
          { label: "Match Score", value: `${matchPct}%`, color: "#6366f1", bg: "rgba(99,102,241,0.08)",   border: "rgba(99,102,241,0.2)"  },
          { label: "Matched",     value: matched,        color: "#10b981", bg: "rgba(16,185,129,0.08)",   border: "rgba(16,185,129,0.2)"  },
          { label: "Missing",     value: missing,        color: "#f43f5e", bg: "rgba(244,63,94,0.08)",    border: "rgba(244,63,94,0.2)"   },
        ].map(({ label, value, color, bg, border }) => (
          <motion.div key={label} whileHover={{ y: -2 }}
            className="rounded-xl p-3 sm:p-4 text-center"
            style={{ background: bg, border: `1px solid ${border}` }}>
            <p className="text-xl sm:text-2xl font-bold mb-0.5" style={{ color }}>{value}</p>
            <p className="text-[10px] sm:text-xs font-medium" style={{ color: "var(--text-muted)" }}>{label}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Send learning plan ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>

        {/* Header */}
        <div className="flex items-center gap-3 px-5 sm:px-6 py-4 sm:py-5"
          style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)" }}>
            <Send size={15} style={{ color: "#6366f1" }} />
          </div>
          <div>
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Send My Learning Plan
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              Get the full report delivered to your inbox
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-4">

          {/* Steps */}
          <div className="flex items-center gap-2 flex-wrap">
            {["Enter email", "Click Send", "Check inbox"].map((label, i) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                  style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
                  {i + 1}
                </div>
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{label}</span>
                {i < 2 && <span className="text-xs" style={{ color: "var(--text-muted)" }}>→</span>}
              </div>
            ))}
          </div>

          {/* Email input + button */}
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Your email address
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative min-w-0">
                <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-muted)" }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setSendError(null); setSent(false); }}
                  placeholder="you@example.com"
                  className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm"
                  style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-strong)",
                    color: "var(--text-primary)",
                    outline: "none",
                  }}
                />
              </div>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleSendPlan}
                disabled={sending || !email.trim() || !analysis}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white shrink-0 relative overflow-hidden"
                style={{
                  background: sent
                    ? "linear-gradient(135deg, #10b981, #059669)"
                    : "linear-gradient(135deg, #6366f1, #a855f7)",
                  opacity: (sending || !email.trim() || !analysis) ? 0.5 : 1,
                  cursor: (sending || !email.trim() || !analysis) ? "not-allowed" : "pointer",
                  minWidth: 100,
                  justifyContent: "center",
                }}>
                {sending ? (
                  <><Spinner /> Sending…</>
                ) : sent ? (
                  <><Check size={13} /> Sent!</>
                ) : (
                  <><Send size={13} /> Send</>
                )}
                {sending && (
                  <motion.div
                    animate={{ x: ["0%", "300%"] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                    className="absolute inset-y-0 w-8 -skew-x-12"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }}
                  />
                )}
              </motion.button>
            </div>
            <p className="text-[11px] mt-1.5" style={{ color: "var(--text-muted)" }}>
              Sent only to the address you enter above.
            </p>
          </div>

          {/* No analysis warning */}
          {!analysis && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl"
              style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}>
              <AlertCircle size={14} style={{ color: "#f59e0b", flexShrink: 0 }} />
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                No analysis yet — go to <strong style={{ color: "var(--text-primary)" }}>Analyze Resume</strong> first.
              </p>
            </div>
          )}

          {/* Success */}
          {sent && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 p-3 rounded-xl"
              style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <CheckCircle size={14} style={{ color: "#10b981", flexShrink: 0, marginTop: 1 }} />
              <div>
                <p className="text-xs font-semibold" style={{ color: "#10b981" }}>Sent successfully!</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                  Check <strong>{email}</strong> — also check spam.
                </p>
              </div>
            </motion.div>
          )}

          {/* Error */}
          {sendError && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2.5 p-3 rounded-xl"
              style={{ background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.2)" }}>
              <AlertCircle size={14} style={{ color: "#f43f5e", flexShrink: 0, marginTop: 1 }} />
              <div>
                <p className="text-xs font-semibold" style={{ color: "#f43f5e" }}>Failed to send</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{sendError}</p>
              </div>
            </motion.div>
          )}

          {/* What's included */}
          <div>
            <p className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>
              What's included:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[
                { icon: "📊", label: "Match Score" },
                { icon: "❌", label: "Missing Skills" },
                { icon: "🗺️", label: "8-Week Roadmap" },
                { icon: "▶",  label: "Video Courses" },
                { icon: "🎓", label: "Certificates" },
                { icon: "💡", label: "Career Advice" },
              ].map(({ icon, label }) => (
                <span key={label}
                  className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-medium"
                  style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    color: "var(--text-secondary)",
                  }}>
                  {icon} {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Skill Portfolio ── */}
      {analysis && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl p-5 sm:p-6"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>

          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
            Skill Portfolio
          </h3>

          {/* Progress bar */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>Overall Readiness</span>
              <span className="text-xs font-semibold" style={{ color: "#6366f1" }}>{matchPct}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--border-strong)" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${matchPct}%` }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #6366f1, #a855f7)" }}
              />
            </div>
          </div>

          {/* Skills list */}
          <div className="space-y-2.5">
            {analysis.matched_skills?.map((skill, i) => (
              <motion.div key={skill}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.04 }}
                className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#10b981" }} />
                <div className="flex-1 flex items-center justify-between min-w-0">
                  <span className="text-xs sm:text-sm capitalize truncate" style={{ color: "var(--text-secondary)" }}>
                    {skill}
                  </span>
                  <div className="flex items-center gap-2 shrink-0 ml-3" style={{ width: 100 }}>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${80 + Math.floor(i * 7) % 20}%` }}
                        transition={{ duration: 0.8, delay: 0.4 + i * 0.04 }}
                        className="h-full rounded-full"
                        style={{ background: "rgba(16,185,129,0.7)" }}
                      />
                    </div>
                    <span className="text-[10px] font-bold" style={{ color: "#10b981" }}>✓</span>
                  </div>
                </div>
              </motion.div>
            ))}
            {analysis.missing_skills?.map((skill, i) => (
              <motion.div key={skill}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (matched + i) * 0.04 }}
                className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "rgba(244,63,94,0.5)" }} />
                <div className="flex-1 flex items-center justify-between min-w-0">
                  <span className="text-xs sm:text-sm capitalize truncate" style={{ color: "var(--text-muted)" }}>
                    {skill}
                  </span>
                  <div className="flex items-center gap-2 shrink-0 ml-3" style={{ width: 100 }}>
                    <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--border)" }} />
                    <span className="text-[10px] font-bold" style={{ color: "rgba(244,63,94,0.6)" }}>✕</span>
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
        className="w-full rounded-xl px-3 py-2.5 text-sm"
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

function Spinner() {
  return (
    <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      className="inline-block rounded-full border-2 shrink-0"
      style={{ width: 13, height: 13, borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }} />
  );
}