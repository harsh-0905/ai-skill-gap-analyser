import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
});

// ─── POST /analyze ────────────────────────────────────────────────────────────
export async function analyzeResume(resumeFile, jdFile) {
  const formData = new FormData();
  formData.append("resume", resumeFile);
  formData.append("jd", jdFile);
  const response = await apiClient.post("/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

// ─── POST /send-plan ──────────────────────────────────────────────────────────
/**
 * sendLearningPlan
 * Sends the analysis result + recipient email to the backend.
 * Backend is responsible for composing and dispatching the email.
 *
 * @param {string} email      — recipient address
 * @param {object} analysis   — full analysis result from /analyze
 * @param {object} profile    — { name, role } for personalisation
 */
export async function sendLearningPlan(email, analysis, profile) {
  const response = await apiClient.post("/send-plan", {
    email,
    name:    profile?.name  ?? "",
    role:    profile?.role  ?? "",
    analysis,
  });
  return response.data;
}