import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import Logo from "./Logo";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <NavLink to="/" className="nav-logo">
        <Logo />
      </NavLink>

      <nav className="nav-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/workouts">Workouts</NavLink>
        <NavLink to="/progress">Progress</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </nav>

      <div className="nav-user">
        <span className="nav-avatar">{user.name.charAt(0).toUpperCase()}</span>
        <span className="nav-name">{user.name.split(" ")[0]}</span>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => {
            navigate("/login", { replace: true });
            logout();
          }}
        >
          Log out
        </button>
      </div>
    </header>
  );
}
