import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

import Spotify from "./components/spotify";
import ShapesCanvas from "./components/ShapesCanvas";
import ScrambleText from "./components/ScrambleText";
import SocialIcon from "./components/SocialIcon";
import WorkRow from "./components/WorkRow";
import Footer from "./components/Footer";
import PreviewLink from "./components/PreviewLink";
import PlaygroundCanvas from "./components/PlaygroundCanvas";
import Contributions from "./components/Contributions";
import useTheme from "./useTheme";
import { registerWebMcpTools } from "./webmcp";
import { buildTools } from "./tools";
import CommandPalette, { MOD_KEY } from "./components/CommandPalette";

import {
  projects,
  playground,
  workHistory,
  connectLinks,
  RESUME_URL,
  GIT_USER,
  LINKEDIN_URL,
} from "./data";
import { getAllWritings, formatMonth } from "./writings";
import picture from "./assets/kuldeep2.webp";
import billu from "./assets/billu.webp";

// ─── layout primitives ────────────────────────────────────────────────────────

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
        fontWeight: 400,
        fontSize: "1rem",
        color: "var(--body-color-highlighted)",
        lineHeight: 1.5,
        marginBottom: "0.25rem",
      }}
    >
      {children}
    </ScrambleText>
  );
}

// The little hand-drawn arrow next to "open to work". Decorative only — the
// buttons it points at carry the meaning.
function Scribble() {
  return (
    <svg
      className="cta-arrow"
      viewBox="0 0 57 23"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path className="cta-arrow-tail" d="M2 2.5c16 1 34 6 51 18" />
      <path className="cta-arrow-head" d="M44 20.2 53 20.5" />
      <path className="cta-arrow-head" d="M49.4 12 53 20.5" />
    </svg>
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

  if (!time) return <span className="header-time" />;

  return (
    <span className="header-time">
      <span className="header-live" aria-hidden="true" />
      {time} IST
    </span>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [paletteOpen, setPaletteOpen] = useState(false);

  // One list, two consumers: the ⌘K palette below and any agent that supports
  // WebMCP. Registration is a no-op where the API is missing.
  const tools = useMemo(
    () => buildTools({ navigate, toggleTheme }),
    [navigate, toggleTheme],
  );

  useEffect(() => {
    registerWebMcpTools(tools);
  }, [tools]);

  // The shortcut has to live here so the header chip and the key open the
  // same thing. Nobody discovers ⌘K on a stranger's site without a hint.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
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
                fontSize: "1rem",
                fontWeight: 500,
                lineHeight: 1.5,
                color: "var(--body-color-highlighted)",
              }}
            >
              Kuldeep
            </ScrambleText>
          </div>
          <div className="site-header-meta">
            <TimeCounter />
            <button
              type="button"
              className="cmdk-chip"
              onClick={() => setPaletteOpen(true)}
              aria-label="Open command palette"
              title="Command palette"
            >
              <kbd>{MOD_KEY}</kbd>
              <kbd>K</kbd>
            </button>
          </div>
        </header>

        {/* icons only, sitting right under the profile */}
        <div className="social-row">
          {[...connectLinks, { label: "Resume", href: RESUME_URL, social: "cv" }].map(
            (link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`icon-link social-${link.social}`}
                aria-label={link.label}
                title={link.label}
              >
                <SocialIcon social={link.social} />
              </a>
            ),
          )}
        </div>

        {/* intro */}
        <Section delay={0.1} gap="1rem">
          <p className="intro-bio">
            Engineer based in India, with 2+ years of experience building zero&nbsp;to&nbsp;one,
            obsessed with building things, AI, startups and how things work underneath.
          </p>
          <div className="cta-row">
            <span className="cta-note" aria-hidden="true">
              <span className="cta-note-text">open to work</span>
              <Scribble />
            </span>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn"
            >
              <SocialIcon social="linkedin" />
              Message me
            </a>
          </div>

        </Section>


        {/* github contribution calendar */}
        <Section delay={0.15}>
          <SectionHeading>Activity</SectionHeading>
          <Contributions user={GIT_USER} />
        </Section>


        {/* work life */}
        <Section delay={0.2}>
          <SectionHeading>Work Life</SectionHeading>
          <div className="work-list">
            {workHistory.map((w) => (
              <WorkRow key={w.company} job={w} />
            ))}
          </div>
        </Section>


        {/* writings */}
        {latestWritings.length > 0 && (
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
        )}

        {/* projects — four that get the real estate */}
        <Section delay={0.4}>
          <SectionHeading>Side Projects</SectionHeading>
          <div className="proj-grid">
            {projects.map((p) => (
              <a
                key={p.name}
                href={p.demo || p.code}
                target="_blank"
                rel="noopener noreferrer"
                className="proj-card"
              >
                <span className="proj-shot">
                  <span className={`proj-frame proj-frame--${p.frame}`}>
                    <img src={p.shot} alt="" loading="lazy" draggable={false} />
                  </span>
                </span>
                <span className="proj-body">
                  <span className="proj-head">
                    <span className="proj-name">{p.name}</span>
                    {p.tag && <span className="proj-tag">{p.tag}</span>}
                    <svg
                      className="proj-arrow"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M7 17 17 7" />
                      <path d="M8 7h9v9" />
                    </svg>
                  </span>
                  <span className="proj-short">{p.short}</span>
                  <span className="proj-foot">
                    {p.code && <span className="proj-link">code</span>}
                    {p.demo && <span className="proj-link">demo &rarr;</span>}
                  </span>
                </span>
              </a>
            ))}
          </div>
        </Section>


        {/* playground — small things, thrown into the physics canvas */}
        <Section delay={0.45}>
          <div className="pg-head">
            <SectionHeading>Playground</SectionHeading>
            <span className="pg-hint">drag them around</span>
          </div>
          <PlaygroundCanvas items={playground} theme={theme} />
        </Section>


        {/* about me */}
        <Section delay={0.5}>
          <p style={{ color: "var(--body-color)" }}>
            Beyond work, you&apos;ll occasionally find me watching travel vlogs
            for my next solo trip or doing pull-ups at the gym. And yes,
            annoying my{" "}
            <PreviewLink src={billu} alt="Billu">
              cat
            </PreviewLink>{" "}
            🐾
          </p>
        </Section>


        <Spotify theme={theme} />

        {/* footer — location, socials and theme toggle on one line */}
        <Section delay={0.6}>
          <Footer theme={theme} toggleTheme={toggleTheme} />
        </Section>
      </main>

      <CommandPalette
        tools={tools}
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
      />

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
