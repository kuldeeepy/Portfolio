import { useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";

import ScrambleText from "../components/ScrambleText";
import ShapesCanvas from "../components/ShapesCanvas";
import Footer from "../components/Footer";
import useTheme from "../useTheme";
import { getWriting, renderMarkdown, formatFull } from "../writings";

export default function WritingPost() {
  const { slug } = useParams();
  const { state } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const post = getWriting(slug);

  // Back link points wherever you came from; direct loads fall back to the list.
  const back =
    state?.from === "home"
      ? { to: "/", label: "← Back" }
      : { to: "/writings", label: "← All writings" };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  return (
    <div style={{ position: "relative", isolation: "isolate", minHeight: "100vh" }}>
      <div className="blur-header" aria-hidden="true" />

      <main className="page-main" style={{ position: "relative", zIndex: 1 }}>
        <header style={{ padding: "1rem 0" }}>
          <Link to={back.to} className="header-link">
            {back.label}
          </Link>
        </header>

        {!post ? (
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
                Not found
              </ScrambleText>
              <p style={{ color: "var(--body-color)" }}>
                This piece doesn&apos;t exist (yet). Head{" "}
                <Link to="/writings" className="header-link">
                  back to writings
                </Link>
                .
              </p>
            </section>
          </div>
        ) : (
          <article className="animate-section">
            <section style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <ScrambleText
                as="h1"
                onLoad
                style={{
                  fontSize: "1.35rem",
                  fontWeight: 500,
                  lineHeight: 1.3,
                  color: "var(--body-color-highlighted)",
                }}
              >
                {post.title}
              </ScrambleText>
              <span className="writing-date">{formatFull(post.date)}</span>
            </section>

            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }}
            />
          </article>
        )}

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
