import { useState } from "react";

const users = {
  Swara: {
    age: 20,
    height: "165 cm",
    weight: "58 kg",
    goal: "Muscle Gain",
    level: "Intermediate",
    workouts: 4,
    streak: 7,
    calories: 420,
  },

  Tanisha: {
    age: 20,
    height: "160 cm",
    weight: "55 kg",
    goal: "Weight Loss",
    level: "Beginner",
    workouts: 3,
    streak: 5,
    calories: 310,
  },

  Vedant: {
    age: 21,
    height: "178 cm",
    weight: "72 kg",
    goal: "Muscle Gain",
    level: "Advanced",
    workouts: 5,
    streak: 12,
    calories: 560,
  },

  Sayali: {
    age: 20,
    height: "162 cm",
    weight: "57 kg",
    goal: "Fitness & Toning",
    level: "Intermediate",
    workouts: 4,
    streak: 8,
    calories: 390,
  },

  Sakshi: {
    age: 20,
    height: "158 cm",
    weight: "53 kg",
    goal: "Weight Loss",
    level: "Beginner",
    workouts: 3,
    streak: 6,
    calories: 340,
  },
};

export default function Profile() {
  const [selectedUser, setSelectedUser] = useState(
    localStorage.getItem("selectedUser") || "Swara"
  );

  const user = users[selectedUser];

  const changeUser = (name) => {
    setSelectedUser(name);
    localStorage.setItem("selectedUser", name);
  };

  return (
    <main className="profile-page">

      <div className="profile-header">
        <div>
          <p className="tag">FITTRACK PROFILE</p>
          <h1>{selectedUser}'s Profile</h1>
          <p>Manage your fitness information and track your goals.</p>
        </div>

        <select
          value={selectedUser}
          onChange={(e) => changeUser(e.target.value)}
        >
          {Object.keys(users).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <section className="profile-card">

        <div className="avatar">
          {selectedUser.charAt(0)}
        </div>

        <div>
          <h2>{selectedUser}</h2>
          <p className="profile-goal">{user.goal}</p>
          <span className="level-badge">{user.level}</span>
        </div>

      </section>

      <section className="profile-grid">

        <div className="profile-info">
          <span>🎂</span>
          <h3>Age</h3>
          <p>{user.age} years</p>
        </div>

        <div className="profile-info">
          <span>📏</span>
          <h3>Height</h3>
          <p>{user.height}</p>
        </div>

        <div className="profile-info">
          <span>⚖️</span>
          <h3>Weight</h3>
          <p>{user.weight}</p>
        </div>

        <div className="profile-info">
          <span>🎯</span>
          <h3>Fitness Goal</h3>
          <p>{user.goal}</p>
        </div>

        <div className="profile-info">
          <span>🏋️</span>
          <h3>Workouts / Week</h3>
          <p>{user.workouts}</p>
        </div>

        <div className="profile-info">
          <span>🔥</span>
          <h3>Current Streak</h3>
          <p>{user.streak} days</p>
        </div>

      </section>

      <section className="profile-summary">

        <h2>Weekly Summary</h2>

        <div className="summary-row">
          <div>
            <strong>{user.workouts}</strong>
            <span>Workouts / Week</span>
          </div>

          <div>
            <strong>{user.calories}</strong>
            <span>Calories Burned</span>
          </div>

          <div>
            <strong>{user.streak}</strong>
            <span>Day Streak</span>
          </div>
        </div>

      </section>

    </main>
  );
}