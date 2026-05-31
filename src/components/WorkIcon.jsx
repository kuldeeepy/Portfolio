import { useState } from "react";

const base = {
  width: 20, height: 20, borderRadius: 4, flexShrink: 0,
  display: "flex", alignItems: "center", justifyContent: "center",
};

export default function WorkIcon({ favicon, letter }) {
  const [failed, setFailed] = useState(false);

  if (favicon && !failed) {
    return (
      <span className="work-icon-wrap" style={base}>
        <img
          src={favicon}
          alt=""
          width={16}
          height={16}
          style={{ display: "block", objectFit: "contain" }}
          onError={() => setFailed(true)}
        />
      </span>
    );
  }

  return (
    <span style={{ ...base, background: "var(--border-color)", fontSize: "0.6rem", fontWeight: 700, color: "var(--body-color-faded)" }}>
      {letter}
    </span>
  );
}
