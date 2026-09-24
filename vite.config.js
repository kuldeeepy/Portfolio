import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readdirSync, readFileSync } from 'node:fs'

const SITE = 'https://kuldeeep.is-a.dev'

// Emits sitemap.xml at build from the same markdown files src/writings.js reads,
// so a new post is listed without anyone touching this.
function sitemap() {
  return {
    name: 'sitemap',
    apply: 'build',
    generateBundle() {
      const dir = 'src/content/writings'
      const posts = readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => {
        const raw = readFileSync(`${dir}/${f}`, 'utf8')
        const named = /^(\d{4}-\d{2}-\d{2})-(.+)\.md$/.exec(f)
        const slug = /^slug:\s*(.+)$/m.exec(raw)?.[1].trim() || (named ? named[2] : f.replace(/\.md$/, ''))
        const date = /^date:\s*(.+)$/m.exec(raw)?.[1].trim() || named?.[1]
        return { path: `/writings/${slug}`, date }
      })
      const urls = [{ path: '/' }, { path: '/about' }, { path: '/writings' }, ...posts]
        .map((u) => `  <url><loc>${SITE}${u.path}</loc>${u.date ? `<lastmod>${u.date}</lastmod>` : ''}</url>`)
        .join('\n')
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), sitemap()],
})
