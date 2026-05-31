const RAYS = [
  { cx: 17, cy: 9,     delay: 0    },
  { cx: 13, cy: 15.93, delay: 0.05 },
  { cx: 5,  cy: 15.93, delay: 0.1  },
  { cx: 1,  cy: 9,     delay: 0.15 },
  { cx: 5,  cy: 2.07,  delay: 0.2  },
  { cx: 13, cy: 2.07,  delay: 0.25 },
];

export default function ThemeToggleIcon({ isLight }) {
  return (
    <svg
      viewBox="0 0 18 18"
      width="16"
      height="16"
      aria-hidden
      style={{
        display: "block",
        overflow: "visible",
        transform: isLight ? "rotate(90deg)" : "rotate(40deg)",
        transition: "transform 0.5s ease",
      }}
    >
      <mask id="moon-mask">
        <rect x="0" y="0" width="18" height="18" fill="#FFF" />
        <circle cx={isLight ? 25 : 10} cy="2" r="8" fill="black" style={{ transition: "cx 0.3s ease" }} />
      </mask>
      <circle
        cx="9" cy="9"
        r={isLight ? 5 : 8}
        fill="currentColor"
        mask="url(#moon-mask)"
        style={{ transition: "r 0.3s ease" }}
      />
      <g>
        {RAYS.map(({ cx, cy, delay }, i) => (
          <circle
            key={i}
            cx={cx} cy={cy} r="1.5"
            fill="currentColor"
            style={{
              transform: isLight ? "scale(1)" : "scale(0)",
              transformOrigin: `${cx}px ${cy}px`,
              transition: `transform 0.3s ease ${isLight ? delay : 0}s`,
            }}
          />
        ))}
      </g>
    </svg>
  );
}
