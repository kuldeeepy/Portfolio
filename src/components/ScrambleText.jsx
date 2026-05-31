import { useState } from "react";

const GLYPHS = "ㄅㄆㄇㄈㄉㄊㄋㄌㄍㄎㄏㄐㄑㄒㄓㄔㄕㄖㄗㄘㄙ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const glyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? "";
const makeChars = (t) => t.split("").map(() => ({ c1: glyph(), c2: glyph(), c3: glyph() }));

export default function ScrambleText({ children, as: Tag = "h2", onLoad = true, style }) {
  const [chars] = useState(() => makeChars(children));

  const retrigger = (e) => {
    const span = e.currentTarget.querySelector("[data-scramble]");
    if (!span) return;
    span.querySelectorAll("span[data-char]").forEach((el) => {
      el.style.setProperty("--char-1", `"${glyph()}"`);
      el.style.setProperty("--char-2", `"${glyph()}"`);
      el.style.setProperty("--char-3", `"${glyph()}"`);
    });
    span.classList.remove("scramble");
    void span.offsetWidth;
    span.classList.add("scramble");
  };

  return (
    <Tag onMouseEnter={retrigger} style={{ cursor: "default", ...style }}>
      <span data-scramble className={onLoad ? "scramble" : ""} aria-hidden>
        {children.split("").map((char, i) => (
          <span
            key={i}
            data-char={char}
            style={{
              "--index": i,
              "--char-1": `"${chars[i]?.c1}"`,
              "--char-2": `"${chars[i]?.c2}"`,
              "--char-3": `"${chars[i]?.c3}"`,
            }}
          >
            {char}
          </span>
        ))}
      </span>
      <span style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}>
        {children}
      </span>
    </Tag>
  );
}
