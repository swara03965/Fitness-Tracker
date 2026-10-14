import axios from "axios";

// Set VITE_API_URL (e.g. https://fittrack-api.onrender.com) in Netlify to turn on
// the real backend. When it is NOT set, the app falls back to browser-only mode.
export const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
export const USE_API = Boolean(API_URL);

export const TOKEN_KEY = "fittrack_token";

export const api = axios.create({
  baseURL: USE_API ? `${API_URL}/api` : undefined,
  timeout: 70000, // Render free tier can take ~60s to wake up
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Turn axios errors into a friendly message
export const apiError = (err) =>
  err?.response?.data?.error ||
  (err?.code === "ECONNABORTED"
    ? "The server is taking too long to respond. Please try again."
    : "Cannot reach the FitTrack server. Please try again.");
