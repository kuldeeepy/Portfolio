import { Link } from "react-router-dom";

import ScrambleText from "../components/ScrambleText";
import ShapesCanvas from "../components/ShapesCanvas";
import Footer from "../components/Footer";
import useTheme from "../useTheme";
import { getAllWritings, formatMonth } from "../writings";

export default function WritingsList() {
  const { theme, toggleTheme } = useTheme();
  const writings = getAllWritings();

  return (
    <div style={{ position: "relative", isolation: "isolate", minHeight: "100vh" }}>
      <div className="blur-header" aria-hidden="true" />

      <main className="page-main" style={{ position: "relative", zIndex: 1 }}>
        <header style={{ padding: "1rem 0" }}>
          <Link to="/" className="header-link">
            ← Home
          </Link>
        </header>

        <div className="animate-section">
          <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <ScrambleText
              as="h1"
              onLoad
              style={{
                fontSize: "1.125rem",
                fontWeight: 500,
                lineHeight: 1,
                color: "var(--body-color-highlighted)",
              }}
            >
              Writings
            </ScrambleText>
            <p style={{ color: "var(--body-color)" }}>
              Thinking out loud about building, startups, and whatever interesting is
              keeping me up at night.
            </p>

            <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column" }}>
              {writings.map((w) => (
                <Link key={w.slug} to={`/writings/${w.slug}`} className="writing-row">
                  <span className="writing-row-main">
                    <span className="writing-title">{w.title}</span>
                    {w.summary && <span className="writing-summary">{w.summary}</span>}
                  </span>
                  <span className="writing-date">{formatMonth(w.date)}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div
          role="separator"
          style={{
            height: 1,
            width: "100%",
            backgroundColor: "var(--border-color)",
            flexShrink: 0,
          }}
        />
        <div className="animate-section">
          <Footer theme={theme} toggleTheme={toggleTheme} />
        </div>
      </main>

      {/* physics canvas at bottom */}
      <div
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <div style={{ pointerEvents: "auto" }}>
          <ShapesCanvas theme={theme} />
        </div>
      </div>
    </div>
  );
}
