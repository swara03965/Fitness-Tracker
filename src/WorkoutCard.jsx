export default function WorkoutCard({ name, sets, reps, calories }) {
  return (
    <article style={{ border: "1px solid #22c55e", margin: "12px 0", padding: 12, background: "#fff", color: "#0f172a", borderRadius: 8 }}>
      <h3>{name}</h3>
      <p>Sets: {sets} | Reps: {reps}</p>
      <p>Calories: {calories} kcal</p>
    </article>
  );
}
