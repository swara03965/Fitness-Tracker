import { useEffect, useState } from "react";
import { api } from "../api";

export default function Workouts({ workouts, setWorkouts }) {
  const [seconds, setSeconds] = useState(0);

  const [exerciseName, setExerciseName] = useState("");
  const [calories, setCalories] = useState("");
  const [error, setError] = useState("");

  // Load workouts from MongoDB when page opens
  useEffect(() => {
    api
      .get("/workouts")
      .then((res) => {
        setWorkouts(res.data);
      })
      .catch(() => {
        setError("Cannot reach FitTrack API");
      });
  }, [setWorkouts]);

  // Session timer
  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(id);
  }, []);

  // Add workout to MongoDB
  const addExercise = async () => {
    if (!exerciseName.trim() || !calories) {
      alert("Please enter exercise name and calories.");
      return;
    }

    try {
      const res = await api.post("/workouts", {
        name: exerciseName,
        sets: 3,
        reps: 10,
        calories: Number(calories),
        user: "Swara",
      });

      setWorkouts([...workouts, res.data]);

      setExerciseName("");
      setCalories("");
      setError("");
    } catch (err) {
      setError("Cannot reach FitTrack API");
    }
  };

  // Delete workout from MongoDB
  const removeExercise = async (id) => {
    try {
      await api.delete("/workouts/" + id);

      setWorkouts(
        workouts.filter((workout) => workout._id !== id)
      );
    } catch (err) {
      setError("Cannot reach FitTrack API");
    }
  };

  return (
    <main className="workout-page">

      <div className="workout-header">
        <div>
          <p className="tag">FITTRACK • WORKOUT TRACKER</p>
          <h1>Workouts</h1>
          <p>
            Session timer: <strong>{seconds}s</strong>
          </p>
        </div>
      </div>

      {/* API Error */}
      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {/* Add Exercise */}

      <section className="add-workout-card">

        <h2>➕ Add Exercise</h2>

        <div className="exercise-form">

          <input
            type="text"
            placeholder="Exercise name (e.g. Push-ups)"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
          />

          <input
            type="number"
            placeholder="Calories burned"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
          />

          <button onClick={addExercise}>
            Save to MongoDB
          </button>

        </div>

      </section>

      {/* Workout List */}

      <section className="workout-list">

        <div className="list-header">
          <h2>Today's Exercises</h2>
          <span>{workouts.length} exercises</span>
        </div>

        {workouts.length === 0 ? (
          <p>No exercises added yet.</p>
        ) : (
          <div className="exercise-list">

            {workouts.map((workout) => (
              <div
                className="exercise-card"
                key={workout._id}
              >

                <div>
                  <h3>{workout.name}</h3>
                  <p>🔥 {workout.calories} kcal</p>
                </div>

                <div>
                  <span className="exercise-icon">
                    💪
                  </span>

                  <button
                    onClick={() => removeExercise(workout._id)}
                  >
                    Delete
                  </button>
                </div>

              </div>
            ))}

          </div>
        )}

      </section>

    </main>
  );
}