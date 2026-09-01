// Tabler Icons (MIT), outline set — stroked rather than filled, so the row
// reads as one family instead of five different brand glyphs.
const wrap = {
  width: 17,
  height: 17,
  flexShrink: 0,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const paths = {
  twitter: [
    "M4 4l11.733 16h4.267l-11.733 -16l-4.267 0",
    "M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772",
  ],
  github: [
    "M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5",
  ],
  linkedin: [
    "M8 11v5",
    "M8 8v.01",
    "M12 16v-5",
    "M16 16v-3a2 2 0 1 0 -4 0",
    "M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4l0 -10",
  ],
  leetcode: [
    "M12 13h7.5",
    "M9.424 7.268l4.999 -4.999",
    "M16.633 16.644l-2.402 2.415a3.189 3.189 0 0 1 -4.524 0l-3.77 -3.787a3.223 3.223 0 0 1 0 -4.544l3.77 -3.787a3.189 3.189 0 0 1 4.524 0l2.302 2.313",
  ],
  mail: ["M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10", "M3 7l9 6l9 -6"],
  cv: [
    "M14 3v4a1 1 0 0 0 1 1h4",
    "M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2",
    "M11 12.5a1.5 1.5 0 0 0 -3 0v3a1.5 1.5 0 0 0 3 0",
    "M13 11l1.5 6l1.5 -6",
  ],
};

export default function SocialIcon({ social }) {
  const d = paths[social];
  if (!d) return null;
  return (
    <svg style={wrap} viewBox="0 0 24 24">
      {d.map((p) => (
        <path key={p} d={p} />
      ))}
    </svg>
  );
}
