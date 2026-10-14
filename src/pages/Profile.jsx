import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { useWorkouts, calcStreak } from "../store";

const GOALS = ["Weight Loss", "Muscle Gain", "Fitness & Toning", "Endurance"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const { workouts } = useWorkouts(user.email);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(user.profile);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const p = user.profile;
  const bmi = p.height && p.weight ? (p.weight / (p.height / 100) ** 2).toFixed(1) : null;
  const totalCal = workouts.reduce((s, w) => s + Number(w.calories || 0), 0);

  const save = async () => {
    try {
      await updateProfile(draft);
    } catch (err) {
      return setError(err.message);
    }
    setError("");
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const info = [
    { icon: "🎂", label: "Age", value: p.age ? `${p.age} years` : "—" },
    { icon: "📏", label: "Height", value: p.height ? `${p.height} cm` : "—" },
    { icon: "⚖️", label: "Weight", value: p.weight ? `${p.weight} kg` : "—" },
    { icon: "🎯", label: "Fitness Goal", value: p.goal },
    { icon: "🧮", label: "BMI", value: bmi || "—" },
    { icon: "⚡", label: "Current Streak", value: `${calcStreak(workouts)} days` },
  ];

  return (
    <main className="container">
      <header className="page-head">
        <div>
          <p className="tag">FITTRACK PROFILE</p>
          <h1>{user.name.split(" ")[0]}'s Profile</h1>
          <p className="muted">Manage your fitness information and track your goals.</p>
        </div>
        <button className="btn btn-ghost" onClick={() => { navigate("/login", { replace: true }); logout(); }}>Log out</button>
      </header>

      <section className="profile-card glass">
        <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
        <div className="profile-who">
          <h2>{user.name}</h2>
          <p className="muted">{user.email}</p>
          <div className="badges">
            <span className="level-badge">{p.level}</span>
            <span className="goal-badge">{p.goal}</span>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => { setDraft(p); setEditing(!editing); }}>
          {editing ? "Cancel" : "✏️ Edit Profile"}
        </button>
      </section>

      {saved && <p className="success banner">✓ Profile updated</p>}

      {editing && (
        <section className="card glass form">
          <h2>Edit details</h2>
          <div className="row-3">
            <label>Age<input type="number" value={draft.age} onChange={(e) => setDraft({ ...draft, age: e.target.value })} /></label>
            <label>Height (cm)<input type="number" value={draft.height} onChange={(e) => setDraft({ ...draft, height: e.target.value })} /></label>
            <label>Weight (kg)<input type="number" value={draft.weight} onChange={(e) => setDraft({ ...draft, weight: e.target.value })} /></label>
          </div>
          <div className="row-2">
            <label>Goal
              <select value={draft.goal} onChange={(e) => setDraft({ ...draft, goal: e.target.value })}>
                {GOALS.map((g) => <option key={g}>{g}</option>)}
              </select>
            </label>
            <label>Level
              <select value={draft.level} onChange={(e) => setDraft({ ...draft, level: e.target.value })}>
                {LEVELS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </label>
          </div>
          {error && <p className="form-error">⚠️ {error}</p>}
          <button className="btn btn-primary" onClick={save}>Save changes</button>
        </section>
      )}

      <section className="profile-grid">
        {info.map((i) => (
          <div className="profile-info glass" key={i.label}>
            <span>{i.icon}</span>
            <h3>{i.label}</h3>
            <p>{i.value}</p>
          </div>
        ))}
      </section>

      <section className="card glass">
        <h2>All-time Summary</h2>
        <div className="summary-row">
          <div><strong>{workouts.length}</strong><span>Workouts Logged</span></div>
          <div><strong>{totalCal}</strong><span>Calories Burned</span></div>
          <div><strong>{calcStreak(workouts)}</strong><span>Day Streak</span></div>
        </div>
      </section>
    </main>
  );
}
