import { useEffect, useState } from "react";
import { useAuth } from "../auth";
import { useWorkouts, today, iconFor } from "../store";
import { USE_API, API_URL } from "../api";

const QUICK = [
  { name: "Push-ups", calories: 120, minutes: 10 },
  { name: "Squats", calories: 180, minutes: 15 },
  { name: "Plank", calories: 80, minutes: 5 },
  { name: "Running", calories: 300, minutes: 30 },
  { name: "Yoga", calories: 150, minutes: 25 },
  { name: "Jumping Jacks", calories: 100, minutes: 10 },
];

export default function Workouts() {
  const { user } = useAuth();
  const { workouts, add, remove, loading, error: apiErr } = useWorkouts(user.email);
  const [seconds, setSeconds] = useState(0);
  const [form, setForm] = useState({ name: "", calories: "", minutes: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.calories) return setError("Please enter exercise name and calories.");
    await add({ name: form.name.trim(), calories: Number(form.calories), minutes: Number(form.minutes || 0) });
    setForm({ name: "", calories: "", minutes: "" });
    setError("");
  };

  const todays = workouts.filter((w) => w.date === today());
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <main className="container">
      <header className="page-head">
        <div>
          <p className="tag">FITTRACK • WORKOUT TRACKER</p>
          <h1>Workouts</h1>
          <span className={USE_API ? "pill" : "pill pill-warn"} title={USE_API ? API_URL : "Set VITE_API_URL to use the database"}>
            {USE_API ? "☁️ Saving to database" : "💾 Saving in this browser only"}
          </span>
        </div>
        <div className="timer glass">
          <small>Session timer</small>
          <strong>{mm}:{ss}</strong>
        </div>
      </header>

      <section className="card glass">
        <h2>⚡ Quick Add</h2>
        <div className="chips">
          {QUICK.map((q) => (
            <button key={q.name} className="chip" onClick={() => add(q)}>
              {iconFor(q.name)} {q.name} <small>+{q.calories} kcal</small>
            </button>
          ))}
        </div>
      </section>

      <section className="card glass">
        <h2>➕ Add Exercise</h2>
        <form className="exercise-form" onSubmit={submit}>
          <input placeholder="Exercise name (e.g. Push-ups)" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input type="number" min="0" placeholder="Calories burned" value={form.calories}
            onChange={(e) => setForm({ ...form, calories: e.target.value })} />
          <input type="number" min="0" placeholder="Minutes" value={form.minutes}
            onChange={(e) => setForm({ ...form, minutes: e.target.value })} />
          <button className="btn btn-primary">Save Workout</button>
        </form>
        {(error || apiErr) && <p className="form-error">⚠️ {error || apiErr}</p>}
      </section>

      <section className="card glass">
        <div className="list-header">
          <h2>Today's Exercises</h2>
          <span className="pill">{todays.length} exercises</span>
        </div>

        {loading ? (
          <div className="empty"><span>⏳</span><p>Loading your workouts…</p></div>
        ) : todays.length === 0 ? (
          <div className="empty">
            <span>🏋️</span>
            <p>No exercises added yet. Tap a quick-add above to get started!</p>
          </div>
        ) : (
          <div className="exercise-list">
            {todays.map((w) => (
              <div className="exercise-card" key={w.id}>
                <span className="exercise-icon">{iconFor(w.name)}</span>
                <div className="exercise-info">
                  <h3>{w.name}</h3>
                  <p>🔥 {w.calories} kcal{w.minutes ? ` • ⏱️ ${w.minutes} min` : ""}</p>
                </div>
                <button className="btn btn-danger btn-sm"
                  onClick={() => remove(w.id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
