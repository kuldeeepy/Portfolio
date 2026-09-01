import { useState } from "react";

const base = {
  width: 40, height: 40, borderRadius: 9, flexShrink: 0,
  display: "flex", alignItems: "center", justifyContent: "center",
};

export default function WorkIcon({ favicon, logo, letter }) {
  const [failed, setFailed] = useState(false);
  const src = logo || favicon;

  if (src && !failed) {
    // A real company logo is a square that already carries its own background,
    // so it fills the tile. A favicon is a small glyph and needs the padding.
    return (
      <span
        className={`work-icon-wrap${logo ? " has-logo" : ""}`}
        style={base}
      >
        <img
          src={src}
          alt=""
          style={
            logo
              ? { display: "block", width: "100%", height: "100%", objectFit: "cover" }
              : { display: "block", width: 22, height: 22, objectFit: "contain" }
          }
          onError={() => setFailed(true)}
        />
      </span>
    );
  }

  return (
    <span style={{ ...base, background: "var(--border-color)", fontSize: "0.95rem", fontWeight: 500, color: "var(--body-color-faded)" }}>
      {letter}
    </span>
  );
}
