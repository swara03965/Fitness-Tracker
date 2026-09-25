import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [status, setStatus] = useState("Loading FitTrack...");
  const [water, setWater] = useState(4);
  const [goal, setGoal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setStatus("FitTrack loaded — ready for today's workout!");
  }, []);

  const addWater = () => {
    if (water < 8) {
      setWater(water + 1);
    }
  };

  const toggleGoal = () => {
    setGoal(!goal);
  };

  return (
    <main className="home">

      {/* Hero Section */}
      <section className="hero">
        <div>
          <p className="tag">FITTRACK • YOUR FITNESS COMPANION</p>

          <h1>{status}</h1>

          <p className="subtitle">
            Track your workouts, monitor your progress and stay consistent
            with your fitness goals.
          </p>

          <button onClick={() => navigate("/workouts")}>
            Start Workout →
          </button>
        </div>
      </section>

      {/* Today's Stats */}
      <section className="stats">
        <div className="stat-card">
          <span>🔥</span>
          <h3>300</h3>
          <p>Calories Burned</p>
        </div>

        <div className="stat-card">
          <span>💪</span>
          <h3>2</h3>
          <p>Workouts Completed</p>
        </div>

        <div className="stat-card">
          <span>⏱️</span>
          <h3>24 min</h3>
          <p>Active Time</p>
        </div>

        <div className="stat-card">
          <span>🎯</span>
          <h3>75%</h3>
          <p>Daily Goal</p>
        </div>
      </section>

      {/* Interactive Section */}
      <section className="dashboard-grid">

        {/* Water Tracker */}
        <div className="info-card">
          <h2>💧 Water Intake</h2>

          <p className="big-number">
            {water} / 8 glasses
          </p>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(water / 8) * 100}%` }}
            ></div>
          </div>

          <button onClick={addWater}>
            + Add Glass
          </button>
        </div>

        {/* Daily Goal */}
        <div className="info-card">
          <h2>🎯 Today's Goal</h2>

          <p>
            Complete at least one workout today.
          </p>

          <button onClick={toggleGoal}>
            {goal ? "✓ Goal Completed" : "Mark as Complete"}
          </button>

          {goal && (
            <p className="success">
              Great job! Keep the streak going 🔥
            </p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="info-card">
          <h2>⚡ Quick Actions</h2>

          <button onClick={() => navigate("/workouts")}>
            View Workouts
          </button>

          <button onClick={() => navigate("/progress")}>
            Check Progress
          </button>

          <button onClick={() => navigate("/profile")}>
            View Profile
          </button>
        </div>

      </section>

    </main>
  );
}