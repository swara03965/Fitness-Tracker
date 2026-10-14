import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { useLocalState, today, useWorkouts, calcStreak } from "../store";
import Ring from "../components/Ring";

const DAILY_TARGET = 3; // workouts per day goal ring

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
};

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { workouts } = useWorkouts(user.email);
  const [water, setWater] = useLocalState(`fittrack_water_${user.email}_${today()}`, 0);
  const [goalDone, setGoalDone] = useLocalState(`fittrack_goal_${user.email}_${today()}`, false);

  const todays = workouts.filter((w) => w.date === today());
  const calories = todays.reduce((s, w) => s + Number(w.calories || 0), 0);
  const minutes = todays.reduce((s, w) => s + Number(w.minutes || 0), 0);
  const dailyPct = Math.min(100, Math.round((todays.length / DAILY_TARGET) * 100));
  const streak = calcStreak(workouts);

  const stats = [
    { icon: "🔥", value: calories, label: "Calories Burned", tint: "orange" },
    { icon: "💪", value: todays.length, label: "Workouts Today", tint: "green" },
    { icon: "⏱️", value: `${minutes} min`, label: "Active Time", tint: "cyan" },
    { icon: "⚡", value: `${streak} day${streak === 1 ? "" : "s"}`, label: "Current Streak", tint: "violet" },
  ];

  return (
    <main className="container">
      {/* Hero */}
      <section className="hero glass">
        <div className="hero-copy">
          <p className="tag">FITTRACK • YOUR FITNESS COMPANION</p>
          <h1>
            {greeting()}, <span className="grad">{user.name.split(" ")[0]}</span>!
          </h1>
          <p className="subtitle">
            {todays.length === 0
              ? "No workouts logged yet today. Let's get that first one in!"
              : `You've logged ${todays.length} workout${todays.length > 1 ? "s" : ""} today. Keep the momentum going.`}
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => navigate("/workouts")}>Start Workout →</button>
            <button className="btn btn-ghost" onClick={() => navigate("/progress")}>View Progress</button>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <Ring percent={dailyPct} size={170} sub="daily goal" />
          <span className="hero-emoji he-1">🏋️</span>
          <span className="hero-emoji he-2">🥗</span>
          <span className="hero-emoji he-3">👟</span>
        </div>
      </section>

      {/* Stats */}
      <section className="stats">
        {stats.map((s) => (
          <div key={s.label} className={`stat-card glass tint-${s.tint}`}>
            <span className="stat-icon">{s.icon}</span>
            <h3>{s.value}</h3>
            <p>{s.label}</p>
          </div>
        ))}
      </section>

      {/* Widgets */}
      <section className="dashboard-grid">
        <div className="info-card glass">
          <h2>💧 Water Intake</h2>
          <p className="big-number">{water} <small>/ 8 glasses</small></p>

          <div className="glasses">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className={i < water ? "glass-cup full" : "glass-cup"} />
            ))}
          </div>

          <div className="btn-row">
            <button className="btn btn-primary btn-sm" onClick={() => setWater(Math.min(8, water + 1))}>+ Add Glass</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setWater(Math.max(0, water - 1))}>− Remove</button>
          </div>
        </div>

        <div className="info-card glass">
          <h2>🎯 Today's Goal</h2>
          <p className="muted">Complete at least one workout today.</p>
          <button
            className={goalDone ? "btn btn-done" : "btn btn-primary"}
            onClick={() => setGoalDone(!goalDone)}
          >
            {goalDone ? "✓ Goal Completed" : "Mark as Complete"}
          </button>
          {goalDone && <p className="success">Great job! Keep the streak going 🔥</p>}
        </div>

        <div className="info-card glass">
          <h2>⚡ Quick Actions</h2>
          <div className="quick">
            <button className="btn btn-ghost" onClick={() => navigate("/workouts")}>🏋️ View Workouts</button>
            <button className="btn btn-ghost" onClick={() => navigate("/progress")}>📈 Check Progress</button>
            <button className="btn btn-ghost" onClick={() => navigate("/profile")}>👤 View Profile</button>
          </div>
        </div>
      </section>
    </main>
  );
}
