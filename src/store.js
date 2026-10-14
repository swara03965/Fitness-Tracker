import { useEffect, useState } from "react";
import { api, apiError, USE_API } from "./api";

// Small helper: state that persists in localStorage.
export function useLocalState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? initial : JSON.parse(raw);
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export const today = () => new Date().toISOString().slice(0, 10);

export const dayKey = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return d.toISOString().slice(0, 10);
};

// Consecutive days (ending today or yesterday) that have a workout.
export function calcStreak(workouts) {
  const days = new Set(workouts.map((w) => w.date));
  let offset = days.has(dayKey(0)) ? 0 : 1;
  let streak = 0;
  while (days.has(dayKey(offset))) {
    streak++;
    offset++;
  }
  return streak;
}

// Per-user workouts: [{id,name,calories,minutes,sets,reps,date}]
// Uses the backend when VITE_API_URL is set, otherwise localStorage.
export function useWorkouts(email) {
  const [local, setLocal] = useLocalState(`fittrack_workouts_${email}`, []);
  const [remote, setRemote] = useState([]);
  const [loading, setLoading] = useState(USE_API);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!USE_API) return;
    let alive = true;
    setLoading(true);
    api.get("/workouts")
      .then((res) => alive && (setRemote(res.data), setError("")))
      .catch((err) => alive && setError(apiError(err)))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [email]);

  const add = async (w) => {
    if (USE_API) {
      try {
        const res = await api.post("/workouts", { sets: 3, reps: 10, date: today(), ...w });
        setRemote((list) => [res.data, ...list]);
        setError("");
      } catch (err) { setError(apiError(err)); }
      return;
    }
    setLocal((list) => [{ id: Date.now() + Math.random(), sets: 3, reps: 10, date: today(), ...w }, ...list]);
  };

  const remove = async (id) => {
    if (USE_API) {
      try {
        await api.delete(`/workouts/${id}`);
        setRemote((list) => list.filter((x) => x.id !== id));
        setError("");
      } catch (err) { setError(apiError(err)); }
      return;
    }
    setLocal((list) => list.filter((x) => x.id !== id));
  };

  return { workouts: USE_API ? remote : local, add, remove, loading, error };
}

export const iconFor = (name = "") => {
  const n = name.toLowerCase();
  if (/run|jog|walk|cardio|jump|skip|cycl|bike/.test(n)) return "🏃";
  if (/yoga|stretch|plank|pilates/.test(n)) return "🧘";
  if (/swim/.test(n)) return "🏊";
  if (/squat|lunge|deadlift|leg/.test(n)) return "🦵";
  return "💪";
};
