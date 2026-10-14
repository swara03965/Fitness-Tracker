import Logo from "./Logo";

// Split-screen layout shared by Login + Register
export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <main className="auth">
      <section className="auth-art">
        <Logo size={42} />

        <div className="auth-art-body">
          <h2>
            Train smarter.<br />
            <span className="grad">Move stronger.</span>
          </h2>
          <p>
            Log workouts, build streaks and watch your progress grow — all in
            one beautiful dashboard.
          </p>

          <ul className="auth-points">
            <li><span>🔥</span> Track calories and active minutes</li>
            <li><span>📈</span> See weekly progress at a glance</li>
            <li><span>💧</span> Stay hydrated with daily goals</li>
          </ul>
        </div>

        {/* Decorative floating badges */}
        <div className="float-chip fc-1">💪 +3 workouts</div>
        <div className="float-chip fc-2">🔥 7 day streak</div>
        <div className="float-chip fc-3">🎯 Goal hit!</div>

        <svg className="art-rings" viewBox="0 0 400 400" fill="none">
          <circle cx="200" cy="200" r="60" />
          <circle cx="200" cy="200" r="110" />
          <circle cx="200" cy="200" r="160" />
          <circle cx="200" cy="200" r="195" />
        </svg>
      </section>

      <section className="auth-form-side">
        <div className="auth-card glass">
          <h1>{title}</h1>
          <p className="auth-sub">{subtitle}</p>
          {children}
          <p className="auth-footer">{footer}</p>
        </div>
      </section>
    </main>
  );
}
