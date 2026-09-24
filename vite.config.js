import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { marked } from 'marked'
import { SITE_URL, DEFAULT_META, PAGE_META } from './src/site.js'

const esc = (s = '') =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Same rules as src/writings.js (which can't be imported here: it uses import.meta.glob).
function readPosts() {
  const dir = 'src/content/writings'
  return readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => {
    const raw = readFileSync(`${dir}/${f}`, 'utf8')
    const [, head = '', body = raw] = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/.exec(raw) || []
    const meta = {}
    for (const line of head.split('\n')) {
      const i = line.indexOf(':')
      if (i !== -1) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim()
    }
    const named = /^(\d{4}-\d{2}-\d{2})-(.+)\.md$/.exec(f)
    return {
      slug: meta.slug || (named ? named[2] : f.replace(/\.md$/, '')),
      date: meta.date || named?.[1] || '',
      title: meta.title || f,
      summary: meta.summary || '',
      body,
    }
  }).sort((a, b) => (a.date < b.date ? 1 : -1))
}

// Build-time output for crawlers that don't run JS (LinkedIn, X, Slack, Bing):
// sitemap.xml, rss.xml, and an index.html per route with its own <head>.
// Vercel serves these files before the SPA rewrite kicks in.
function staticPages() {
  return {
    name: 'static-pages',
    apply: 'build',
    generateBundle() {
      const posts = readPosts()
      const urls = [{ path: '/' }, { path: '/about' }, { path: '/writings' },
        ...posts.map((p) => ({ path: `/writings/${p.slug}`, date: p.date }))]
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
          .map((u) => `  <url><loc>${SITE_URL}${u.path}</loc>${u.date ? `<lastmod>${u.date}</lastmod>` : ''}</url>`)
          .join('\n')}\n</urlset>\n`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'rss.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Kuldeep Yadav — Writings</title>
  <link>${SITE_URL}/writings</link>
  <description>${esc(PAGE_META['/writings'].description)}</description>
  <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${posts.map((p) => `  <item>
    <title>${esc(p.title)}</title>
    <link>${SITE_URL}/writings/${p.slug}</link>
    <guid>${SITE_URL}/writings/${p.slug}</guid>
    <pubDate>${new Date(p.date).toUTCString()}</pubDate>
    <description>${esc(p.summary)}</description>
  </item>`).join('\n')}
</channel>
</rss>
`,
      })
    },
    closeBundle() {
      const template = readFileSync('dist/index.html', 'utf8')
      const page = (path, { title, description }, { type = 'website', body = '' } = {}) => {
        const url = SITE_URL + path
        const html = template
          .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
          .replace(/(<meta\s+name="description"\s+content=")[^"]*/, `$1${esc(description)}`)
          .replace(/(<link rel="canonical" href=")[^"]*/, `$1${url}`)
          .replace(/(property="og:type" content=")[^"]*/, `$1${type}`)
          .replace(/(property="og:title" content=")[^"]*/, `$1${esc(title)}`)
          .replace(/(property="og:description" content=")[^"]*/, `$1${esc(description)}`)
          .replace(/(property="og:url" content=")[^"]*/, `$1${url}`)
          .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
        mkdirSync(`dist${path}`, { recursive: true })
        writeFileSync(`dist${path}/index.html`, html)
      }

      for (const path of ['/about', '/writings']) page(path, PAGE_META[path])
      for (const p of readPosts()) {
        // The article itself goes in #root so no-JS crawlers can read it; React
        // replaces it on mount with the same content in the real layout.
        page(`/writings/${p.slug}`, { title: `${p.title} — Kuldeep Yadav`, description: p.summary || DEFAULT_META.description }, {
          type: 'article',
          body: `<main class="page-main"><article><h1>${esc(p.title)}</h1><div class="prose">${marked.parse(p.body)}</div></article></main>`,
        })
      }
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), staticPages()],
})
