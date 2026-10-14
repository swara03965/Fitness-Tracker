import { useAuth } from "../auth";
import { useWorkouts, calcStreak, dayKey, iconFor } from "../store";
import Ring from "../components/Ring";

const WEEKLY_GOAL = 5;

export default function Progress() {
  const { user } = useAuth();
  const { workouts, loading, error } = useWorkouts(user.email);

  // last 7 days (oldest -> newest)
  const week = Array.from({ length: 7 }, (_, i) => {
    const key = dayKey(6 - i);
    const items = workouts.filter((w) => w.date === key);
    return {
      key,
      label: new Date(key + "T00:00:00").toLocaleDateString(undefined, { weekday: "short" }),
      calories: items.reduce((s, w) => s + Number(w.calories || 0), 0),
      count: items.length,
    };
  });

  const weekItems = workouts.filter((w) => w.date >= week[0].key);
  const totalCalories = weekItems.reduce((s, w) => s + Number(w.calories || 0), 0);
  const totalMinutes = weekItems.reduce((s, w) => s + Number(w.minutes || 0), 0);
  const streak = calcStreak(workouts);
  const max = Math.max(...week.map((d) => d.calories), 1);
  const goalPct = Math.min(100, (weekItems.length / WEEKLY_GOAL) * 100);

  const stats = [
    { icon: "🏋️", value: weekItems.length, label: "Workouts (7d)" },
    { icon: "🔥", value: totalCalories, label: "Calories (7d)" },
    { icon: "⏱️", value: `${totalMinutes} min`, label: "Active Time" },
    { icon: "⚡", value: streak, label: "Day Streak" },
  ];

  const recent = [...workouts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);

  return (
    <main className="container">
      <header className="page-head">
        <div>
          <p className="tag">FITTRACK • PROGRESS</p>
          <h1>{user.name.split(" ")[0]}'s Progress</h1>
          <p className="muted">Here's your fitness performance over the last 7 days.</p>
        </div>
      </header>

      {error && <p className="form-error">⚠️ {error}</p>}
      {loading && <p className="muted">Loading your workouts…</p>}

      <section className="stats">
        {stats.map((s) => (
          <div className="stat-card glass" key={s.label}>
            <span className="stat-icon">{s.icon}</span>
            <h3>{s.value}</h3>
            <p>{s.label}</p>
          </div>
        ))}
      </section>

      <section className="progress-grid">
        <div className="card glass">
          <h2>Calories this week</h2>
          <div className="bars">
            {week.map((d) => (
              <div className="bar-col" key={d.key}>
                <span className="bar-val">{d.calories || ""}</span>
                <div className="bar-track">
                  <div className="bar-fill" style={{ height: `${(d.calories / max) * 100}%` }} />
                </div>
                <span className="bar-label">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card glass goal-card">
          <h2>Weekly Goal</h2>
          <Ring percent={goalPct} size={150} label={`${weekItems.length}/${WEEKLY_GOAL}`} sub="workouts" />
          <p className="muted">
            {weekItems.length >= WEEKLY_GOAL
              ? "🎉 Weekly goal smashed!"
              : `${WEEKLY_GOAL - weekItems.length} more to hit your weekly goal`}
          </p>
        </div>
      </section>

      <section className="card glass">
        <h2>Recent Workouts</h2>
        {recent.length === 0 ? (
          <div className="empty"><span>📈</span><p>Log a workout to see your progress here.</p></div>
        ) : (
          recent.map((w) => (
            <div className="progress-exercise" key={w.id}>
              <span className="check">✓</span>
              <p>{iconFor(w.name)} {w.name}</p>
              <small>{w.calories} kcal • {w.date}</small>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
