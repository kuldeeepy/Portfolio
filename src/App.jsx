import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Spotify from "./components/spotify";
import ShapesCanvas from "./components/ShapesCanvas";
import ScrambleText from "./components/ScrambleText";
import SocialIcon from "./components/SocialIcon";
import WorkIcon from "./components/WorkIcon";
import Footer from "./components/Footer";
import PreviewLink from "./components/PreviewLink";
import useTheme from "./useTheme";

import { projects, workHistory, connectLinks, RESUME_URL } from "./data";
import { getAllWritings, formatMonth } from "./writings";
import picture from "./assets/kuldeep2.webp";
import billu from "./assets/billu.webp";

// ─── layout primitives ────────────────────────────────────────────────────────

function Separator() {
  return (
    <div
      role="separator"
      style={{
        height: 1,
        width: "100%",
        backgroundColor: "var(--border-color)",
        flexShrink: 0,
      }}
    />
  );
}

function Section({ children, delay = 0, gap = "0.7rem" }) {
  return (
    <div className="animate-section">
      <section
        style={{
          animationDelay: `${delay}s`,
          display: "flex",
          flexDirection: "column",
          gap,
        }}
      >
        {children}
      </section>
    </div>
  );
}

function SectionHeading({ children }) {
  return (
    <ScrambleText
      as="h2"
      onLoad={false}
      style={{
        fontWeight: 500,
        fontSize: "0.95rem",
        color: "var(--body-color-highlighted)",
        lineHeight: 1,
        marginBottom: "0.25rem",
      }}
    >
      {children}
    </ScrambleText>
  );
}

function TimeCounter() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
          hour12: true,
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        }),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className="header-time"
    >
      {time}
      {time && " · IST"}
    </span>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const allWritings = getAllWritings();
  const latestWritings = allWritings.slice(0, 4);

  return (
    <div
      style={{ position: "relative", isolation: "isolate", minHeight: "100vh" }}
    >
      <div className="blur-header" aria-hidden="true" />

      <main className="page-main" style={{ position: "relative", zIndex: 1 }}>
        {/* header — avatar and name share one line with the meta links */}
        <header className="site-header">
          <div className="site-header-id">
            <img
              className="site-header-avatar"
              src={picture}
              alt="Kuldeep"
              draggable={false}
            />
            <ScrambleText
              as="h1"
              onLoad
              style={{
                fontSize: "1.05rem",
                fontWeight: 500,
                lineHeight: 1,
                color: "var(--body-color-highlighted)",
              }}
            >
              Kuldeep
            </ScrambleText>
          </div>
          <div className="site-header-meta">
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="header-link"
            >
              Resume
            </a>
            <span className="header-dot" aria-hidden="true">
              ·
            </span>
            <TimeCounter />
          </div>
        </header>

        {/* intro */}
        <Section delay={0.1} gap="1rem">
          <p className="intro-bio">
            Engineer with taste. Obsessed with building things from zero to one
            and beyond.
          </p>
          <Spotify theme={theme} />
        </Section>

        <Separator />

        {/* work life */}
        <Section delay={0.2}>
          <SectionHeading>Work Life</SectionHeading>
          <div style={{ marginLeft: -8 }}>
            {workHistory.map((w) => (
              <a
                key={w.company}
                href={w.link}
                target="_blank"
                rel="noopener noreferrer"
                className="list-row"
              >
                <WorkIcon favicon={w.favicon} letter={w.company[0]} />
                <span>{w.role}</span>
                <span className="list-row-company">{w.company}</span>
                <span
                  style={{
                    textAlign: "right",
                    fontFamily: "monospace",
                    fontSize: "0.75rem",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {w.year}
                </span>
              </a>
            ))}
          </div>
        </Section>

        <Separator />

        {/* writings */}
        {latestWritings.length > 0 && (
          <>
            <Section delay={0.3}>
              <SectionHeading>Writings</SectionHeading>
              <div
                style={{
                  marginTop: "0.25rem",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {latestWritings.map((w) => (
                  <Link
                    key={w.slug}
                    to={`/writings/${w.slug}`}
                    state={{ from: "home" }}
                    className="writing-row writing-row--compact"
                  >
                    <span className="writing-title">{w.title}</span>
                    <span className="writing-date">{formatMonth(w.date)}</span>
                  </Link>
                ))}
                {allWritings.length > latestWritings.length && (
                  <Link to="/writings" className="writing-view-all">
                    view all →
                  </Link>
                )}
              </div>
            </Section>

            <Separator />
          </>
        )}

        {/* side quests */}
        <Section delay={0.4}>
          <SectionHeading>Playground</SectionHeading>
          <div className="projects-grid">
            {projects.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="project-app"
              >
                <div className="project-app-icon">
                  <img src={p.img} alt={p.name} draggable={false} />
                </div>
                <span className="project-app-label">{p.name}</span>
              </a>
            ))}
          </div>
        </Section>

        <Separator />

        {/* about me */}
        <Section delay={0.5}>
          <SectionHeading>About Me</SectionHeading>
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
        </Section>

        <Separator />

        {/* connect */}
        <Section delay={0.6}>
          <SectionHeading>Connect</SectionHeading>
          <div style={{ marginLeft: -8 }}>
            {connectLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`list-row-connect social-${link.social}`}
              >
                <SocialIcon social={link.social} />
                <span>{link.label}</span>
                <span>{link.value}</span>
              </a>
            ))}
          </div>
        </Section>

        <Separator />

        {/* footer */}
        <Section delay={0.7}>
          <Footer theme={theme} toggleTheme={toggleTheme} />
        </Section>
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
