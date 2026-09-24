// Shared by the pages (runtime <head>) and vite.config.js (pre-rendered HTML),
// so a crawler and a browser see the same title for the same URL.
export const SITE_URL = "https://kuldeeep.is-a.dev";

export const DEFAULT_META = {
  title: "Kuldeep Yadav — Software Engineer",
  description:
    "Kuldeep Yadav, a software engineer in India with 2+ years building zero to one: AI, startups, and how things work underneath.",
};

export const PAGE_META = {
  "/about": {
    title: "About — Kuldeep Yadav",
    description:
      "Kuldeep Yadav outside of work: reading about startups, finance and new tech, planning solo trips, and annoying the cat.",
  },
  "/writings": {
    title: "Writings — Kuldeep Yadav",
    description: "Notes on how things work underneath: computers, MCP servers, side projects.",
  },
};
