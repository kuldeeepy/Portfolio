import { Link } from "react-router-dom";

import ScrambleText from "../components/ScrambleText";
import ShapesCanvas from "../components/ShapesCanvas";
import Footer from "../components/Footer";
import PreviewLink from "../components/PreviewLink";
import useTheme from "../useTheme";
import billu from "../assets/billu.webp";

export default function About() {
  const { theme, toggleTheme } = useTheme();

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
          <section style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
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
              About Me
            </ScrambleText>
            <p style={{ color: "var(--body-color)" }}>
              Beyond work, I like to read about startups, finance, new cool tech,
              random article on medium. You&apos;ll occasionally find me watching
              travel vlogs for my next solo trip or doing pull-ups at gym. and yes
              annoying my{" "}
              <PreviewLink src={billu} alt="Billu">
                cat
              </PreviewLink>{" "}
              🐾
            </p>
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
