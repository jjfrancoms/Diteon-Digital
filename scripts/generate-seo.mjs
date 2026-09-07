import { loadEnv } from 'vite'
import { readFile, writeFile, rm } from 'node:fs/promises'

// Use only an explicitly configured origin or Vercel's project production hostname.
// Never publish relative sitemap URLs or guess the company's purchased domain.
const env = { ...loadEnv('production', process.cwd(), ''), ...process.env }
const configured =
  env.VITE_SITE_URL?.trim() ||
  (env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL.trim()}`
    : '')
let origin = ''
if (configured) {
  const url = new URL(configured)
  if (
    url.protocol !== 'https:' ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== '/'
  ) {
    throw new Error(
      'VITE_SITE_URL debe ser el origen público HTTPS, sin ruta, credenciales, parámetros ni fragmentos.',
    )
  }
  origin = url.origin
}
const robots = `User-agent: *\nAllow: /\n${origin ? `\nSitemap: ${origin}/sitemap.xml\n` : ''}`
await writeFile('dist/robots.txt', robots)
if (origin) {
  const locations = ['/', '/privacidad.html', '/terminos.html']
    .map((route) => `  <url><loc>${origin}${route}</loc></url>`)
    .join('\n')
  await writeFile(
    'dist/sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${locations}\n</urlset>\n`,
  )
  const html = await readFile('dist/index.html', 'utf8')
  await writeFile(
    'dist/index.html',
    html.replace(
      '</head>',
      `    <link rel="canonical" href="${origin}/" />\n    <meta property="og:url" content="${origin}/" />\n  </head>`,
    ),
  )
  console.log('SEO: canonical y sitemap generados con el origen configurado.')
} else {
  await rm('dist/sitemap.xml', { force: true })
  console.log(
    'SEO: origen público no configurado; robots válido, sin sitemap ni canonical inventados.',
  )
}
