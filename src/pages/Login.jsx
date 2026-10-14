import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import AuthShell from "../components/AuthShell";
import { USE_API } from "../api";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(form);
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back 👋"
      subtitle="Log in to continue your fitness journey."
      footer={
        <>
          New to FitTrack? <Link to="/register">Create an account</Link>
        </>
      }
    >
      <form onSubmit={submit} className="form">
        <label>
          Email
          <input type="email" placeholder="you@example.com" required
            value={form.email} onChange={set("email")} autoComplete="email" />
        </label>

        <label>
          Password
          <div className="pw">
            <input type={show ? "text" : "password"} placeholder="Your password" required
              value={form.password} onChange={set("password")} autoComplete="current-password" />
            <button type="button" className="pw-toggle" onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        {error && <p className="form-error">⚠️ {error}</p>}
        {busy && USE_API && <p className="hint">First request can take up to a minute while the server wakes up…</p>}

        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? "Logging in…" : "Log In →"}
        </button>
      </form>
    </AuthShell>
  );
}
