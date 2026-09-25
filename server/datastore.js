let profile = { name: "Swara", goal: "Muscle Gain", weightKg: 58, weeklyTarget: 2000 };
let exercises = [
  { id: 1, name: "Push-ups", muscle: "Chest", calories: 120 },
  { id: 2, name: "Squats", muscle: "Legs", calories: 180 },
  { id: 3, name: "Burpees", muscle: "Full body", calories: 250 }
];
let workouts = [];
let goals = [
  { id: 1, title: "Hit 2000 kcal this week", done: false }
];
module.exports = { profile, exercises, workouts, goals };