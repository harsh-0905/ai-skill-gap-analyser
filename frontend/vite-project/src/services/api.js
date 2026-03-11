import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

export const analyzeResume = async (resumeFile, jdFile) => {
  const formData = new FormData();
  formData.append("resume", resumeFile);
  formData.append("jd", jdFile);

  const response = await API.post("/analyze", formData);

  return response.data;
};