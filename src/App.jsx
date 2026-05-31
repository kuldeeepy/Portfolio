import { useState, useEffect } from "react";

import Spotify from "./components/spotify";
import ShapesCanvas from "./components/ShapesCanvas";
import ScrambleText from "./components/ScrambleText";
import SocialIcon from "./components/SocialIcon";
import WorkIcon from "./components/WorkIcon";
import VisitorLocation from "./components/VisitorLocation";
import ThemeToggleIcon from "./components/ThemeToggleIcon";

import { projects, workHistory, connectLinks, RESUME_URL } from "./data";
import picture from "./assets/kuldeep.webp";
import billu from "./assets/billu.webp";

// ─── theme ────────────────────────────────────────────────────────────────────

function getStoredTheme() {
  const stored = localStorage.getItem("theme");
  if (stored) return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

// ─── InlineLink — auto-sets data-text for the sweep effect ───────────────────

function InlineLink({ href, children }) {
  return (
    <a
      className="inline-link"
      href={href}
      data-text={children}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

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

function Section({ children, delay = 0 }) {
  return (
    <div className="animate-section">
      <section
        style={{
          animationDelay: `${delay}s`,
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
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
      style={{
        color: "var(--body-color-faded)",
        fontSize: "0.78rem",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {time}
      {time && " · IST"}
    </span>
  );
}

// ─── PreviewLink ─────────────────────────────────────────────────────────────

function PreviewLink({ children, src, alt = "" }) {
  return (
    <a
      className="preview-link"
      data-text={children}
      href={src}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <span className="preview-tooltip">
        <img src={src} alt={alt} />
      </span>
    </a>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [theme, setTheme] = useState(getStoredTheme);
  const isLight = theme === "light";

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <div style={{ position: "relative", isolation: "isolate", minHeight: "100vh" }}>
      <div className="blur-header" aria-hidden="true" />

      <main className="page-main" style={{ position: "relative", zIndex: 1 }}>
        {/* header */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            padding: "1rem 0",
          }}
        >
          <a
            href="/"
            aria-label="Home"
            style={{
              display: "flex",
              alignItems: "center",
              color: "var(--body-color-highlighted)",
            }}
          >
            <img
              src={picture}
              alt="Kuldeep"
              style={{
                width: 45,
                height: 45,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          </a>
          <TimeCounter />
        </header>

        {/* intro */}
        <Section delay={0.1}>
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
            Kuldeep Yadav
          </ScrambleText>
          <p style={{ color: "var(--body-color)" }}>
            I am builder. professional starter of side projects. I enjoy
            creating products from the ground up and have a soft spot for
            startups, entrepreneurship & science fiction stuff.
          </p>
          <Spotify theme={theme} />
        </Section>

        <Separator />

        {/* highlights */}
        <Section delay={0.2}>
          <SectionHeading>Highlights</SectionHeading>
          <ul className="arrow-list">
            <li>Founding engineer at an early-stage fintech startup</li>
            <li>
              Building products at{" "}
              <InlineLink href="https://kim.cc">Kim.cc</InlineLink> from ground
              up.
            </li>
            <li>Experimenting with AI tooling and misc side products</li>
            <li>
              Download my <InlineLink href={RESUME_URL}>resume</InlineLink>
            </li>
          </ul>
        </Section>

        <Separator />

        {/* work life */}
        <Section delay={0.3}>
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

        {/* side quests */}
        <Section delay={0.4}>
          <SectionHeading>Side Quests</SectionHeading>
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

        {/* other activities */}
        <Section delay={0.5}>
          <SectionHeading>Other Activities</SectionHeading>
          <p style={{ color: "var(--body-color)", marginTop: "0.25rem" }}>
            Beyond work, I like to read about startups, finance, new cool tech,
            random article on medium. You&apos;ll occasionally find me watching
            travel vlogs for my next solo trip or scrolling on X (list goes on).
            and yes annoying my{" "}
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
          <footer
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <VisitorLocation />
            <button
              onClick={toggleTheme}
              aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
              className="theme-toggle-btn"
            >
              <ThemeToggleIcon isLight={isLight} />
              {isLight ? "Dark" : "Light"}
            </button>
          </footer>
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
