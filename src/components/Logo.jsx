export default function Logo({ size = 34 }) {
  return (
    <span className="logo">
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <defs>
          <linearGradient id="lg" x1="0" y1="0" x2="48" y2="48">
            <stop stopColor="#4ade80" />
            <stop offset="1" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <rect width="48" height="48" rx="14" fill="url(#lg)" />
        <path
          d="M10 24h4m20 0h4M14 17v14m20-14v14M18 20v8m12-8v8M18 24h12"
          stroke="#052e16"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <span>
        Fit<b>Track</b>
      </span>
    </span>
  );
}
