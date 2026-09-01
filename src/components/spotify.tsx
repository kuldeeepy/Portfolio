import { useEffect, useRef, useState } from "react";
import { getLastSong } from "../services/service";

type Track = {
  title: string;
  artist: string;
  albumArt: string;
  nowPlaying: boolean;
  lastPlayedTime: string;
  url: string;
};

// ─── helpers ─────────────────────────────────────────────────────────────────

// `uts` is a UTC epoch (seconds) from LastFM — timezone-agnostic, so we can
// render it in whatever timezone the visitor's browser is in.
function formatTime(uts: string): string {
  if (!uts) return "";
  const date = new Date(Number(uts) * 1000);
  if (Number.isNaN(date.getTime())) return "";

  const timePart = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isToday = date.toDateString() === new Date().toDateString();
  if (isToday) return `Today, ${timePart}`;

  const datePart = date.toLocaleDateString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return `${datePart}, ${timePart}`;
}

// ─── sub-components ───────────────────────────────────────────────────────────

function Equaliser() {
  return (
    <span className="spotify-eq" aria-hidden="true">
      <i /><i /><i /><i />
    </span>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

function SpotifyMark() {
  return (
    <svg className="spotify-mark" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.24-.899-.6-.12-.421.24-.781.6-.901 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.241 1.082zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

function SpotifyWidget({ track }: { track: Track }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLAnchorElement & HTMLDivElement>(null);

  // Tap anywhere else to put it back into the edge.
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  const Tag = (track.url ? "a" : "div") as "a" | "div";
  return (
    <Tag
      ref={ref}
      className={`spotify-card${open ? " is-open" : ""}`}
      onClick={(e) => {
        // No hover on touch: first tap slides it out, second opens the track.
        if (!window.matchMedia("(hover: hover)").matches && !open) {
          e.preventDefault();
          setOpen(true);
        }
      }}
      {...(track.url
        ? { href: track.url, target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {/* Ambient wash pulled from the artwork, like a story background. Two
          layers: the blurred art, then a scrim to hold text contrast. */}
      <span
        className="spotify-wash"
        style={{ backgroundImage: `url(${track.albumArt})` }}
        aria-hidden="true"
      />
      <span className="spotify-scrim" aria-hidden="true" />

      {/* The artwork is printed on the disc, so the part that pokes out of the
          page edge reads as a CD rather than a square. */}
      <span className={`spotify-disc${track.nowPlaying ? " is-spinning" : ""}`}>
        <img
          className="spotify-art"
          src={track.albumArt}
          alt={track.title}
          draggable={false}
        />
        <span className="spotify-disc-sheen" />
        <span className="spotify-disc-hole" />
      </span>
      <div className="spotify-text">
        <span className="spotify-label">
          {track.nowPlaying ? <Equaliser /> : null}
          {track.nowPlaying ? "Now playing" : track.lastPlayedTime}
        </span>
        <span className="spotify-title">{track.title}</span>
        <span className="spotify-artist">{track.artist}</span>
      </div>
      <SpotifyMark />
    </Tag>
  );
}

// ─── skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ theme }: { theme: "light" | "dark" }) {
  const bone = theme === "dark" ? "#2a2a2a" : "#f0f0f0";
  return (
    <div className="spotify-card">
      <span className="spotify-disc" style={{ background: bone }} />
      <div className="spotify-text">
        <div style={{ height: 8, width: "40%", borderRadius: 4, background: bone, marginBottom: 5 }} />
        <div style={{ height: 10, width: "62%", borderRadius: 4, background: bone, marginBottom: 5 }} />
        <div style={{ height: 9, width: "34%", borderRadius: 4, background: bone }} />
      </div>
    </div>
  );
}

// ─── container ────────────────────────────────────────────────────────────────

export default function Spotify({
  theme = "light",
}: {
  theme?: "light" | "dark";
}) {
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLastSong().then((result) => {
      if (result?.success) {
        const t = result.song;
        const nowPlaying = t["@attr"]?.nowplaying === "true";
        setTrack({
          title: t.name,
          artist: t.artist["#text"],
          albumArt: t.image[3]?.["#text"] || t.image[2]?.["#text"] || "",
          nowPlaying,
          lastPlayedTime: formatTime(t.date?.uts ?? ""),
          url: t.url ?? "",
        });
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <Skeleton theme={theme} />;
  if (!track) return null;

  return <SpotifyWidget track={track} />;
}
