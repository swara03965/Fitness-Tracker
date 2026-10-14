import { createContext, useContext, useEffect, useState } from "react";
import { api, apiError, USE_API, TOKEN_KEY } from "./api";

/*
  Two modes, chosen automatically:
  • API mode   (VITE_API_URL is set): accounts live in MongoDB, login uses JWT.
  • Local mode (no VITE_API_URL):     accounts live in this browser's localStorage
                                      (salted SHA-256 hash) — demo only.
*/

const USERS_KEY = "fittrack_users";
const SESSION_KEY = "fittrack_session";

/* ---------------- local mode helpers ---------------- */
const readUsers = () => {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || {}; } catch { return {}; }
};
const writeUsers = (u) => localStorage.setItem(USERS_KEY, JSON.stringify(u));

async function hash(password, salt) {
  const data = new TextEncoder().encode(salt + password);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
const randomSalt = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(16))).map((b) => b.toString(16).padStart(2, "0")).join("");

const publicLocal = (u) => ({ name: u.name, email: u.email, profile: u.profile });

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (USE_API) return null; // verified with the server below
    const email = localStorage.getItem(SESSION_KEY);
    const u = email && readUsers()[email];
    return u ? publicLocal(u) : null;
  });
  const [loading, setLoading] = useState(USE_API && !!localStorage.getItem(TOKEN_KEY));

  // API mode: restore the session from a saved token.
  useEffect(() => {
    if (!USE_API || !localStorage.getItem(TOKEN_KEY)) return;
    api.get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch((err) => {
        // Only drop the token if the server rejected it (not on network errors)
        if (err?.response?.status === 401) localStorage.removeItem(TOKEN_KEY);
      })
      .finally(() => setLoading(false));
  }, []);

  const finishApiAuth = ({ token, user }) => {
    localStorage.setItem(TOKEN_KEY, token);
    setUser(user);
  };

  const register = async ({ name, email, password, profile }) => {
    if (USE_API) {
      try {
        finishApiAuth((await api.post("/auth/register", { name, email, password, profile })).data);
      } catch (err) { throw new Error(apiError(err)); }
      return;
    }
    const key = email.trim().toLowerCase();
    const all = readUsers();
    if (all[key]) throw new Error("An account with this email already exists.");
    const salt = randomSalt();
    all[key] = { name: name.trim(), email: key, salt, hash: await hash(password, salt), profile };
    writeUsers(all);
    localStorage.setItem(SESSION_KEY, key);
    setUser(publicLocal(all[key]));
  };

  const login = async ({ email, password }) => {
    if (USE_API) {
      try {
        finishApiAuth((await api.post("/auth/login", { email, password })).data);
      } catch (err) { throw new Error(apiError(err)); }
      return;
    }
    const key = email.trim().toLowerCase();
    const found = readUsers()[key];
    if (!found) throw new Error("No account found with this email.");
    if ((await hash(password, found.salt)) !== found.hash) throw new Error("Incorrect password.");
    localStorage.setItem(SESSION_KEY, key);
    setUser(publicLocal(found));
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const updateProfile = async (profile) => {
    if (USE_API) {
      try {
        setUser((await api.put("/auth/profile", profile)).data.user);
      } catch (err) { throw new Error(apiError(err)); }
      return;
    }
    const all = readUsers();
    const key = user.email;
    all[key].profile = { ...all[key].profile, ...profile };
    writeUsers(all);
    setUser(publicLocal(all[key]));
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
