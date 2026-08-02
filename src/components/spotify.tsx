import { useEffect, useState } from "react";
import { getLastSong } from "../services/service";

type Track = {
  title: string;
  artist: string;
  albumArt: string;
  nowPlaying: boolean;
  lastPlayedTime: string;
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
    <div style={{ display: "flex", alignItems: "flex-end", height: 12, gap: 2 }}>
      {(["eq1 0.9s", "eq2 0.7s", "eq3 1.1s"] as const).map((anim, i) => (
        <div key={i} style={{ width: 2, borderRadius: 2, background: "#1DB954", animation: `${anim} ease-in-out infinite` }} />
      ))}
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

function SpotifyWidget({ track }: { track: Track }) {
  return (
    <div className="spotify-card">
      <img
        className="spotify-art"
        src={track.albumArt}
        alt={track.title}
        width={38}
        height={38}
        draggable={false}
      />
      <div className="spotify-text">
        <span className="spotify-title">{track.title}</span>
        <span className="spotify-artist">{track.artist}</span>
      </div>
      <div className="spotify-status">
        <span>{track.nowPlaying ? "Now playing" : track.lastPlayedTime}</span>
        {track.nowPlaying ? <Equaliser /> : null}
      </div>
    </div>
  );
}

// ─── skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ theme }: { theme: "light" | "dark" }) {
  const bone = theme === "dark" ? "#2a2a2a" : "#f0f0f0";
  return (
    <div className="spotify-card">
      <div
        className="spotify-art"
        style={{ width: 38, height: 38, background: bone }}
      />
      <div className="spotify-text">
        <div
          style={{
            height: 10,
            width: "45%",
            borderRadius: 4,
            background: bone,
            marginBottom: 6,
          }}
        />
        <div style={{ height: 9, width: "30%", borderRadius: 4, background: bone }} />
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
        });
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <Skeleton theme={theme} />;
  if (!track) return null;

  return <SpotifyWidget track={track} />;
}
