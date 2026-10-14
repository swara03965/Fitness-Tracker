import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import AuthShell from "../components/AuthShell";
import { USE_API } from "../api";

const GOALS = ["Weight Loss", "Muscle Gain", "Fitness & Toning", "Endurance"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirm: "",
    age: "", height: "", weight: "",
    goal: GOALS[0], level: LEVELS[0],
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");

    setBusy(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        profile: {
          age: form.age, height: form.height, weight: form.weight,
          goal: form.goal, level: form.level,
        },
      });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Create your account 🚀"
      subtitle="Join FitTrack and start tracking in under a minute."
      footer={
        <>
          Already have an account? <Link to="/login">Log in</Link>
        </>
      }
    >
      <form onSubmit={submit} className="form">
        <label>
          Full name
          <input required placeholder="Your name" value={form.name} onChange={set("name")} autoComplete="name" />
        </label>

        <label>
          Email
          <input type="email" required placeholder="you@example.com" value={form.email}
            onChange={set("email")} autoComplete="email" />
        </label>

        <div className="row-2">
          <label>
            Password
            <div className="pw">
              <input type={show ? "text" : "password"} required placeholder="Min 6 chars"
                value={form.password} onChange={set("password")} autoComplete="new-password" />
            </div>
          </label>
          <label>
            Confirm
            <input type={show ? "text" : "password"} required placeholder="Repeat"
              value={form.confirm} onChange={set("confirm")} autoComplete="new-password" />
          </label>
        </div>
        <button type="button" className="link-btn" onClick={() => setShow(!show)}>
          {show ? "Hide passwords" : "Show passwords"}
        </button>

        <div className="row-3">
          <label>Age
            <input type="number" min="10" max="100" placeholder="20" value={form.age} onChange={set("age")} />
          </label>
          <label>Height (cm)
            <input type="number" min="100" max="250" placeholder="165" value={form.height} onChange={set("height")} />
          </label>
          <label>Weight (kg)
            <input type="number" min="25" max="300" placeholder="58" value={form.weight} onChange={set("weight")} />
          </label>
        </div>

        <div className="row-2">
          <label>Goal
            <select value={form.goal} onChange={set("goal")}>
              {GOALS.map((g) => <option key={g}>{g}</option>)}
            </select>
          </label>
          <label>Level
            <select value={form.level} onChange={set("level")}>
              {LEVELS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </label>
        </div>

        {error && <p className="form-error">⚠️ {error}</p>}
        {busy && USE_API && <p className="hint">First request can take up to a minute while the server wakes up…</p>}

        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? "Creating account…" : "Create Account →"}
        </button>
      </form>
    </AuthShell>
  );
}
