import { useEffect, useState } from "react";

const progressData = {
  Swara: {
    workouts: 3,
    calories: 380,
    time: "42 min",
    streak: 7,
    completed: ["Push-ups", "Squats", "Plank"],
  },

  Tanisha: {
    workouts: 4,
    calories: 450,
    time: "48 min",
    streak: 5,
    completed: ["Squats", "Lunges", "Jumping Jacks", "Plank"],
  },

  Vedant: {
    workouts: 6,
    calories: 720,
    time: "75 min",
    streak: 12,
    completed: ["Bench Press", "Pull-ups", "Squats", "Deadlift", "Plank"],
  },

  Sayali: {
    workouts: 4,
    calories: 510,
    time: "55 min",
    streak: 8,
    completed: ["Yoga", "Lunges", "Squats", "Plank"],
  },

  Sakshi: {
    workouts: 3,
    calories: 360,
    time: "38 min",
    streak: 6,
    completed: ["Walking", "Squats", "Jumping Jacks"],
  },
};

export default function Progress({ workouts }) {
  const [selectedUser, setSelectedUser] = useState(
    localStorage.getItem("selectedUser") || "Swara"
  );

  const [totalCalories, setTotalCalories] = useState(0);

  // Existing user selection
  useEffect(() => {
    const updateUser = () => {
      setSelectedUser(
        localStorage.getItem("selectedUser") || "Swara"
      );
    };

    window.addEventListener("storage", updateUser);

    return () => {
      window.removeEventListener("storage", updateUser);
    };
  }, []);

  // Fetch workouts from MongoDB API
  useEffect(() => {
    fetch("http://localhost:5000/api/workouts")
      .then((response) => response.json())
      .then((data) => {
        const total = data.reduce(
          (sum, workout) => sum + Number(workout.calories || 0),
          0
        );

        setTotalCalories(total);
      })
      .catch(() => {
        setTotalCalories(0);
      });
  }, []);

  const data = progressData[selectedUser];

  return (
    <main className="progress-page">

      <p className="tag">FITTRACK • PROGRESS</p>

      <h1>{selectedUser}'s Progress</h1>

      <p className="progress-subtitle">
        Here's your current fitness performance.
      </p>

      <section className="progress-stats">

        <div>
          <span>🏋️</span>
          <strong>{data.workouts}</strong>
          <p>Workouts</p>
        </div>

        <div>
          <span>🔥</span>
          <strong>{totalCalories}</strong>
          <p>Calories</p>
        </div>

        <div>
          <span>⏱️</span>
          <strong>{data.time}</strong>
          <p>Active Time</p>
        </div>

        <div>
          <span>🔥</span>
          <strong>{data.streak}</strong>
          <p>Day Streak</p>
        </div>

      </section>

      <section className="progress-summary">

        <h2>Workout Summary</h2>

        {data.completed.map((exercise, index) => (
          <div className="progress-exercise" key={index}>
            <span>✓</span>
            <p>{exercise}</p>
          </div>
        ))}

      </section>

      <section className="weekly-progress">

        <h2>Weekly Goal</h2>

        <div className="weekly-bar">
          <div
            style={{
              width: `${Math.min((data.workouts / 5) * 100, 100)}%`,
            }}
          ></div>
        </div>

        <p>
          {data.workouts} / 5 workouts completed this week
        </p>

      </section>

    </main>
  );
}