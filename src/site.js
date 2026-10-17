// Shared by the pages (runtime <head>) and vite.config.js (pre-rendered HTML),
// so a crawler and a browser see the same title for the same URL.
export const SITE_URL = "https://kuldeeep.is-a.dev";

export const DEFAULT_META = {
  title: "Kuldeep Yadav — Software Engineer",
  description:
    "Kuldeep Yadav, an engineer who makes things pretty, then finds out why they're slow. Side projects and writing.",
};

export const PAGE_META = {
  "/about": {
    title: "About — Kuldeep Yadav",
    description:
      "Kuldeep Yadav outside of work: travel vlogs for a solo trip he keeps postponing, pull-ups, and annoying the cat.",
  },
  "/writings": {
    title: "Writings — Kuldeep Yadav",
    description: "Notes on how things work underneath: computers, MCP servers, side projects.",
  },
};
