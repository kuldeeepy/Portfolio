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

function formatTime(raw: string): string {
  if (!raw) return "";
  // LastFM format: "31 May 2026, 16:56"
  const [datePart, timePart] = raw.split(", ");
  if (!timePart) return raw;

  const today = new Date();
  const todayStr = today
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(",", "");

  const isToday =
    datePart.trim() === todayStr.trim() ||
    new Date(datePart).toDateString() === today.toDateString();

  return isToday ? `Today, ${timePart}` : `${datePart}, ${timePart}`;
}

// ─── sub-components ───────────────────────────────────────────────────────────

function Equaliser() {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", height: 18, gap: 2 }}>
      {(["eq1 0.9s", "eq2 0.7s", "eq3 1.1s"] as const).map((anim, i) => (
        <div key={i} style={{ width: 3, borderRadius: 2, background: "#1DB954", animation: `${anim} ease-in-out infinite` }} />
      ))}
    </div>
  );
}

function LiveDot() {
  return (
    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.7)", animation: "pulse-dot 1.4s ease-in-out infinite", flexShrink: 0 }} />
  );
}

// ─── main component ───────────────────────────────────────────────────────────

function SpotifyWidget({
  track,
  theme,
}: {
  track: Track;
  theme: "light" | "dark";
}) {
  const dark = theme === "dark";

  const card = {
    background: dark ? "#1e1e1e" : "#ffffff",
    border: dark
      ? "0.5px solid rgba(255,255,255,0.08)"
      : "0.5px solid rgba(0,0,0,0.1)",
    borderRadius: 12,
    overflow: "hidden",
    width: "100%",
  } as const;

  const titleColor = dark ? "#f0f0f0" : "#111111";
  const artistColor = dark ? "#666666" : "#888888";
  const timeColor = dark ? "#444444" : "#bbbbbb";

  const footerLive = {
    background: "#1DB954",
    color: "#ffffff",
  };
  const footerPast = dark
    ? {
        background: "#181818",
        borderTop: "0.5px solid rgba(255,255,255,0.05)",
        color: "#555555",
      }
    : { background: "#f0f0f0", color: "#999999" };

  return (
    <div style={card}>
      {/* top section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 14px",
        }}
      >
        <img
          src={track.albumArt}
          alt={track.title}
          width={44}
          height={44}
          style={{
            borderRadius: 8,
            objectFit: "cover",
            flexShrink: 0,
            display: "block",
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: titleColor,
              lineHeight: 1.3,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {track.title}
          </div>
          <div
            style={{
              fontSize: 12,
              color: artistColor,
              lineHeight: 1.3,
              marginTop: 2,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {track.artist}
          </div>
        </div>
        {track.nowPlaying && <Equaliser />}
      </div>

      {/* footer strip */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: track.nowPlaying ? "flex-start" : "space-between",
          flexWrap: "wrap",
          gap: "2px 6px",
          padding: "5px 14px",
          fontSize: 11,
          fontWeight: 500,
          ...(track.nowPlaying ? footerLive : footerPast),
        }}
      >
        {track.nowPlaying ? (
          <>
            <LiveDot />
            <span>Now playing on Spotify</span>
          </>
        ) : (
          <>
            <span>Last played on Spotify</span>
            <span style={{ opacity: 0.7 }}>{track.lastPlayedTime}</span>
          </>
        )}
      </div>
    </div>
  );
}

// ─── skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ theme }: { theme: "light" | "dark" }) {
  const dark = theme === "dark";
  const bg = dark ? "#1e1e1e" : "#ffffff";
  const bone = dark ? "#2a2a2a" : "#f0f0f0";
  return (
    <div
      style={{
        background: bg,
        border: dark
          ? "0.5px solid rgba(255,255,255,0.08)"
          : "0.5px solid rgba(0,0,0,0.1)",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 14px",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 8,
            background: bone,
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1 }}>
          <div
            style={{
              height: 12,
              width: "55%",
              borderRadius: 4,
              background: bone,
              marginBottom: 8,
            }}
          />
          <div
            style={{
              height: 10,
              width: "35%",
              borderRadius: 4,
              background: bone,
            }}
          />
        </div>
      </div>
      <div style={{ height: 28, background: bone }} />
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
          lastPlayedTime: formatTime(t.date?.["#text"] ?? ""),
        });
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <Skeleton theme={theme} />;
  if (!track) return null;

  return <SpotifyWidget track={track} theme={theme} />;
}
