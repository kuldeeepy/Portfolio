// One list of what this page can do, consumed twice:
//   - by an agent, via WebMCP (src/webmcp.js)
//   - by a human, via the ⌘K palette (src/components/CommandPalette.jsx)
//
// That's the whole bet. Writing tools for agents is speculative work today;
// writing them once and getting a command palette out of it is not.

import {
  projects,
  workHistory,
  connectLinks,
  RESUME_URL,
  GIT_USER,
} from "./data";
import { getAllWritings } from "./writings";
import { getLastSong } from "./services/service";

const json = (value) => JSON.stringify(value, null, 2);

const open = (url) => {
  window.open(url, "_blank", "noopener,noreferrer");
  return `Opened ${url}`;
};

/**
 * ctx carries the handful of things a tool can't reach on its own —
 * app state and the router.
 */
export function buildTools(ctx) {
  return [
    // ── Reads ────────────────────────────────────────────────────────────
    {
      name: "get_projects",
      kind: "read",
      title: "List projects",
      description:
        "List Kuldeep's side projects. Each has a short description and, where they exist, a live demo URL and a source code URL.",
      inputSchema: { type: "object", properties: {} },
      run: () =>
        json(
          projects.map((p) => ({
            name: p.name,
            description: p.short,
            demo: p.demo ?? null,
            code: p.code ?? null,
          })),
        ),
    },
    {
      name: "get_writings",
      kind: "read",
      title: "List writings",
      description:
        "List the posts Kuldeep has written, newest first, with publication date and the path to read them.",
      inputSchema: { type: "object", properties: {} },
      run: () =>
        json(
          getAllWritings().map((w) => ({
            title: w.title,
            date: w.date,
            path: `/writings/${w.slug}`,
          })),
        ),
    },
    {
      name: "get_experience",
      kind: "read",
      title: "List work experience",
      description: "Kuldeep's work history: company, role, location and dates.",
      inputSchema: { type: "object", properties: {} },
      run: () =>
        json(
          workHistory.map((w) => ({
            company: w.company,
            role: w.role,
            location: w.location,
            from: w.from,
            to: w.to,
            url: w.link,
          })),
        ),
    },
    {
      name: "get_now_playing",
      kind: "read",
      title: "What's playing",
      description:
        "The track Kuldeep is listening to on Spotify right now, or the last one he played.",
      inputSchema: { type: "object", properties: {} },
      run: async () => {
        const r = await getLastSong();
        if (!r?.success) return "Couldn't reach the music service.";
        const t = r.song;
        return json({
          title: t.name,
          artist: t.artist?.["#text"],
          nowPlaying: t["@attr"]?.nowplaying === "true",
          url: t.url ?? null,
        });
      },
    },

    // ── Actions ──────────────────────────────────────────────────────────
    {
      name: "open_now_playing",
      kind: "act",
      title: "Open current track on Spotify",
      description:
        "Open the track Kuldeep is currently playing (or last played) on Spotify.",
      inputSchema: { type: "object", properties: {} },
      run: async () => {
        const r = await getLastSong();
        const url = r?.success && r.song?.url;
        return url ? open(url) : "No track link available.";
      },
    },
    {
      name: "open_social",
      kind: "act",
      title: "Open a social profile",
      description:
        "Open one of Kuldeep's profiles or his resume in a new tab.",
      inputSchema: {
        type: "object",
        properties: {
          platform: {
            type: "string",
            description: "Which profile to open",
            enum: [...connectLinks.map((l) => l.label), "Resume"],
          },
        },
        required: ["platform"],
      },
      run: ({ platform }) => {
        if (platform === "Resume") return open(RESUME_URL);
        const link = connectLinks.find(
          (l) => l.label.toLowerCase() === String(platform).toLowerCase(),
        );
        return link ? open(link.href) : `No profile called "${platform}".`;
      },
    },
    {
      name: "open_project",
      kind: "act",
      title: "Open a project",
      description:
        "Open a project's live demo, or its source if there is no demo.",
      inputSchema: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Project name",
            enum: projects.map((p) => p.name),
          },
        },
        required: ["name"],
      },
      run: ({ name }) => {
        const p = projects.find(
          (x) => x.name.toLowerCase() === String(name).toLowerCase(),
        );
        return p ? open(p.demo || p.code) : `No project called "${name}".`;
      },
    },
    {
      name: "read_writing",
      kind: "act",
      title: "Read a post",
      description: "Navigate to one of Kuldeep's posts.",
      inputSchema: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Post title",
            enum: getAllWritings().map((w) => w.title),
          },
        },
        required: ["title"],
      },
      run: ({ title }) => {
        const w = getAllWritings().find(
          (x) => x.title.toLowerCase() === String(title).toLowerCase(),
        );
        if (!w) return `No post called "${title}".`;
        ctx.navigate(`/writings/${w.slug}`);
        return `Opening "${w.title}".`;
      },
    },
    {
      name: "open_github",
      kind: "act",
      title: "Open GitHub profile",
      description: "Open Kuldeep's GitHub profile.",
      inputSchema: { type: "object", properties: {} },
      run: () => open(`https://github.com/${GIT_USER}`),
    },
    {
      name: "toggle_theme",
      kind: "act",
      title: "Switch theme",
      description:
        "Switch the site between light and dark mode. Takes no arguments — it flips whichever mode is active.",
      inputSchema: { type: "object", properties: {} },
      run: () => {
        const current = document.documentElement.getAttribute("data-theme");
        ctx.toggleTheme();
        return `Theme is now ${current === "dark" ? "light" : "dark"}.`;
      },
    },
  ];
}
