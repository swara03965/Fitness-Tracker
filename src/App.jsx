import { useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import Workouts from "./pages/Workouts";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";

export default function App() {
  const [workouts, setWorkouts] = useState([
    { id: 1, name: "Push-ups", calories: 120 },
    { id: 2, name: "Squats", calories: 180 }
  ]);
  return (
    <>
      <nav>
        <NavLink to="/">Home</NavLink> |{" "}
        <NavLink to="/workouts">Workouts</NavLink> |{" "}
        <NavLink to="/progress">Progress</NavLink> |{" "}
        <NavLink to="/profile">Profile</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workouts" element={<Workouts workouts={workouts} setWorkouts={setWorkouts} />} />
        <Route path="/progress" element={<Progress workouts={workouts} />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}