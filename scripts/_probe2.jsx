/* Sonde : comportement des fiches détail quand l'identifiant n'existe pas dans le dataset. */
{
  const warn = console.warn, error = console.error
  const noise = /useLayoutEffect does nothing on the server|React Router Future Flag|not wrapped in act/
  console.warn = (...a) => { if (!noise.test(String(a[0]))) warn(...a) }
  console.error = (...a) => { if (!noise.test(String(a[0]))) error(...a) }
}
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import App from '../src/App.jsx'
import { AppProvider } from '../src/components/ui.jsx'

const routes = [
  '/talent/tal-99', '/marque/brd-99', '/produit/prd-99', '/videos/vid-99', '/evenements/evt-99',
  '/opportunites/opp-99', '/actualites/art-99', '/videos/inconnu', '/talent/xyz',
]
const strip = (h) => h.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ').replace(/\s+/g, ' ').trim()

for (const route of routes) {
  try {
    const html = renderToString(<MemoryRouter initialEntries={[route]}><AppProvider><App /></AppProvider></MemoryRouter>)
    const main = html.slice(Math.max(html.indexOf('<main'), 0), html.indexOf('</main>'))
    const text = strip(main)
    console.log(`${route.padEnd(22)} ${String(text.length).padStart(5)} car.  « ${text.slice(0, 90)} »`)
  } catch (e) {
    console.log(`${route.padEnd(22)} ✗ ERREUR : ${e.message.split('\n')[0].slice(0, 110)}`)
  }
}
