/* Vidage du texte visible de chaque écran, pour construire l'audit de couverture.
   Script interne (non publié dans package.json) : npm run check:spec utilise les données produites. */
{
  const warn = console.warn, error = console.error
  const noise = /useLayoutEffect does nothing on the server|React Router Future Flag/
  console.warn = (...a) => { if (!noise.test(String(a[0]))) warn(...a) }
  console.error = (...a) => { if (!noise.test(String(a[0]))) error(...a) }
}
import { renderToString } from 'react-dom/server'
import { writeFileSync } from 'node:fs'
import { MemoryRouter } from 'react-router-dom'
import App from '../src/App.jsx'
import { AppProvider } from '../src/components/ui.jsx'

const routes = process.argv.slice(2)
for (const r of routes) {
  const html = renderToString(<MemoryRouter initialEntries={[r]}><AppProvider><App /></AppProvider></MemoryRouter>)
  const text = html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  const slug = r === '/' ? 'accueil' : r.replace(/^\//, '').replace(/\//g, '__')
  writeFileSync(`/tmp/rt/${slug}.txt`, text)
  const attrs = [...html.matchAll(/(?:aria-label|placeholder|title|alt)="([^"]+)"/g)].map((m) => m[1]).join(' | ')
  writeFileSync(`/tmp/rt/${slug}.attrs.txt`, attrs)
}
console.log(`${routes.length} écrans vidés dans /tmp/rt/`)
