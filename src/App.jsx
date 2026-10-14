import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import "./App.css";

import { useAuth } from "./auth";
import Background from "./components/Background";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Workouts from "./pages/Workouts";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";

function Splash() {
  return (
    <main className="splash">
      <div className="spinner" />
      <p>Loading FitTrack…</p>
      <small>The server may take up to a minute to wake up on the first visit.</small>
    </main>
  );
}

// Everything inside this layout requires a logged-in user.
function ProtectedLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <Splash />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return (
    <>
      <Navbar />
      <div className="page-fade" key={location.pathname}>
        <Outlet />
      </div>
    </>
  );
}

// Login / Register: redirect away if already signed in.
function PublicOnly() {
  const { user, loading } = useAuth();
  if (loading) return <Splash />;
  if (user) return <Navigate to="/" replace />;
  return <Outlet />;
}

export default function App() {
  return (
    <>
      <Background />
      <Routes>
        <Route element={<PublicOnly />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
