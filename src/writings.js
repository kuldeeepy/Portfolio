import { marked } from "marked";

// Auto-discovers every markdown file in ./content/writings at build time.
// To publish: drop a `YYYY-MM-DD-slug.md` file in that folder and push.
const files = import.meta.glob("./content/writings/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

// Splits `--- frontmatter --- body` into { meta, body }.
function parse(raw) {
  const match = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/.exec(raw);
  if (!match) return { meta: {}, body: raw };

  const meta = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return { meta, body: match[2] };
}

const writings = Object.entries(files)
  .map(([path, raw]) => {
    const { meta, body } = parse(raw);
    const file = path.split("/").pop().replace(/\.md$/, "");
    const named = /^(\d{4}-\d{2}-\d{2})-(.+)$/.exec(file); // YYYY-MM-DD-slug

    return {
      slug: meta.slug || (named ? named[2] : file),
      date: meta.date || (named ? named[1] : ""),
      title: meta.title || file,
      summary: meta.summary || "",
      body,
    };
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1)); // newest first

export function getAllWritings() {
  return writings;
}

export function getWriting(slug) {
  return writings.find((w) => w.slug === slug);
}

export function renderMarkdown(body) {
  return marked.parse(body);
}

// "2026-07-10" -> "Jul 2026"
export function formatMonth(date) {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d)) return date;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

// "2026-07-10" -> "July 10, 2026"
export function formatFull(date) {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d)) return date;
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
