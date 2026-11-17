
export default function MatchChart() {
  return (
    <div className="relative w-full max-w-[560px] mx-auto">
      <svg
        viewBox="0 0 560 330"
        className="w-full overflow-visible"
        role="img"
        aria-label="Decorative semicircular job market analytics graphic"
      >
        <defs>
          <linearGradient id="outerArc" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f1f1ef" />
            <stop offset="100%" stopColor="#ff8b78" />
          </linearGradient>

          <linearGradient id="innerArc" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#eeeeec" />
            <stop offset="100%" stopColor="#ffc1b5" />
          </linearGradient>
        </defs>

        {/* Outer semicircle */}
        <path
          d="M 65 275 A 215 215 0 0 1 495 275"
          fill="none"
          stroke="url(#outerArc)"
          strokeWidth="48"
          strokeLinecap="round"
        />

        {/* Inner semicircle */}
        <path
          d="M 145 275 A 135 135 0 0 1 415 275"
          fill="none"
          stroke="url(#innerArc)"
          strokeWidth="42"
          strokeLinecap="round"
        />

        {/* Inner decorative area */}
        <path
          d="M 65 275 A 215 215 0 0 1 280 60"
          fill="none"
          stroke="#d8d8d4"
          strokeWidth="1"
          strokeDasharray="3 5"
        />

        <path
          d="M 145 275 A 135 135 0 0 1 280 140"
          fill="none"
          stroke="#d0d0cc"
          strokeWidth="1"
          strokeDasharray="3 5"
        />

        {/* Chart labels */}
        <g fill="#555" fontSize="13" fontWeight="500">
          <text x="75" y="115">10k+</text>
          <text x="195" y="48">60k+</text>
          <text x="370" y="45">100k+</text>
          <text x="65" y="310" fontSize="11" fill="#999">2025</text>
          <text x="465" y="310" fontSize="11" fill="#999">2026</text>
        </g>

        <text
          x="280"
          y="318"
          textAnchor="middle"
          fill="#777"
          fontSize="12"
        >
          Career opportunities on the platform
        </text>
      </svg>
    </div>
  );
}
