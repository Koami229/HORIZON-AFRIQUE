/* Audit des liens internes de la maquette.
   Rend chaque écran en SSR, extrait tous les href internes et vérifie qu'ils
   correspondent à une route déclarée (aucun lien mort, aucune faute de frappe).
   Usage : npm run check:links  */
/* Sortie lisible : on masque les avertissements attendus de React Router en SSR. */
{
  const warn = console.warn, error = console.error
  const noise = /useLayoutEffect does nothing on the server|React Router Future Flag|not wrapped in act/
  console.warn = (...a) => { if (!noise.test(String(a[0]))) warn(...a) }
  console.error = (...a) => { if (!noise.test(String(a[0]))) error(...a) }
}

import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import App from '../src/App.jsx'
import { AppProvider } from '../src/components/ui.jsx'

/* Toutes les routes de la maquette, avec leurs paramètres dynamiques. */
const routes = [
  '/', '/decouvrir', '/talents', '/stylistes', '/designers', '/mannequins', '/talent/:id',
  '/marques', '/marque/:id', '/creations', '/galerie', '/videos', '/videos/:id', '/fil',
  '/evenements', '/evenements/:id', '/opportunites', '/opportunites/:id', '/annuaire',
  '/marketplace', '/produit/:id', '/panier', '/paiement', '/actualites', '/actualites/:id',
  '/partenaires', '/sponsors', '/abonnements', '/horizon-boost', '/recherche', '/favoris',
  '/a-propos', '/contact', '/connexion', '/inscription', '/type-de-compte', '/mot-de-passe-oublie',
  '/tableau-de-bord', '/tableau-de-bord/profil', '/tableau-de-bord/portfolio',
  '/tableau-de-bord/mes-publications', '/tableau-de-bord/mes-creations', '/tableau-de-bord/mes-videos',
  '/tableau-de-bord/mes-evenements', '/tableau-de-bord/mes-opportunites',
  '/tableau-de-bord/collaborations', '/tableau-de-bord/messages', '/tableau-de-bord/notifications',
  '/tableau-de-bord/statistiques', '/tableau-de-bord/abonnement', '/tableau-de-bord/boost',
  '/tableau-de-bord/parametres',
  '/espace-marque', '/espace-marque/collections', '/espace-marque/produits',
  '/espace-partenaire', '/espace-partenaire/opportunites', '/espace-partenaire/evenements', '/espace-partenaire/talents',
  '/espace-sponsor', '/espace-sponsor/campagnes', '/espace-sponsor/talents', '/espace-sponsor/evenements',
  '/boutique', '/boutique/ajouter', '/boutique/commandes', '/boutique/stocks', '/boutique/promotions',
  '/boutique/statistiques', '/boutique/livraison',
  '/administration', '/administration/utilisateurs', '/administration/contenus', '/administration/moderation',
  '/administration/abonnements', '/administration/paiements', '/administration/boost',
  '/administration/verifications', '/administration/referentiel',
]

const screens = routes.filter((r) => !r.includes(':'))

const matchers = routes.map((r) => ({
  route: r,
  re: new RegExp(`^${r.replace(/:[^/]+/g, '[^/]+').replace(/\/$/, '')}/?$`),
}))

const known = (href) => matchers.some((m) => m.re.test(href.split('#')[0].split('?')[0]))

const PUBLIC_DIR = join(process.cwd(), 'public')   // npm run s'exécute depuis la racine du projet
const seen = new Set()          // tous les hrefs internes rencontrés dans le rendu
const broken = new Map()
const missingAssets = new Map()
let total = 0
let assets = 0

for (const screen of screens) {
  let html
  try {
    html = renderToString(
      <MemoryRouter initialEntries={[screen]}><AppProvider><App /></AppProvider></MemoryRouter>
    )
  } catch (e) {
    console.log(`FAIL ${screen}  -> ${e.message.split('\n')[0]}`)
    process.exitCode = 1
    continue
  }
  for (const asset of new Set([...html.matchAll(/(?:src|href)="(\/img\/[^"]+)"/g)].map((m) => m[1]))) {
    assets++
    if (!existsSync(join(PUBLIC_DIR, asset.replace(/^\//, '')))) {
      if (!missingAssets.has(asset)) missingAssets.set(asset, new Set())
      missingAssets.get(asset).add(screen)
    }
  }

  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1])
  for (const href of hrefs) {
    if (!href.startsWith('/') || href.startsWith('/img/')) continue   // externe, ancre ou média
    total++
    seen.add(href.split('#')[0].split('?')[0])
    if (known(href)) continue
    if (!broken.has(href)) broken.set(href, new Set())
    broken.get(href).add(screen)
  }
}

/* ------------------- contrôle inverse : routes atteignables -------------------
   Un lien mort n'est pas le seul défaut possible : une route peut exister sans
   qu'aucun écran n'y mène. On cherche donc chaque route déclarée dans les hrefs
   rendus, puis dans les littéraux `to="…"` du JSX (certains liens vivent dans un
   panneau qui ne s'affiche qu'après un clic). */
const jsxFiles = []
;(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full)
    else if (/\.jsx?$/.test(full)) jsxFiles.push(full)
  }
})(join(process.cwd(), 'src'))

const escapeRe = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const sources = jsxFiles.map((f) => ({ file: f.replace(process.cwd() + '/', ''), src: readFileSync(f, 'utf8') }))
const literalRoutes = []
const addLiteral = (lit, file) => {
  if (!/^\/[A-Za-z0-9\-_/]*$/.test(lit) && !/^\/[A-Za-z0-9\-_/]*\$\{/.test(lit)) return   // chemin interne plausible
  const re = new RegExp('^' + lit.replace(/\$\{[^}]*\}/g, '\u0000').split('\u0000').map(escapeRe).join('[^/]+').replace(/\/$/, '') + '/?$')
  literalRoutes.push({ lit, file, re })
}
for (const { file, src } of sources) {
  // liens JSX (`to="…"`, `to={`…`}`, `to={'…'}`)
  for (const m of src.matchAll(/to=(?:"([^"]+)"|\{\s*`([^`]+)`\s*\}|\{\s*'([^']+)'\s*\})/g)) {
    addLiteral(m[1] ?? m[2] ?? m[3] ?? '', file)
  }
  // chemins déclarés dans les données de navigation (tableaux de menus, pied de page…)
  for (const m of src.matchAll(/(?:^|[\s,\[(])'((?:\/[A-Za-z0-9\-_/]*|\$\{[^}]*\}\/[A-Za-z0-9\-_/]*))'/g)) {
    if (m[1].startsWith('/')) addLiteral(m[1], file)
  }
}

const reachable = (route) =>
  [...seen].some((href) => {
    const re = new RegExp(`^${escapeRe(route).replace(/:[^/]+/g, '\\\\[^/\\\\]+')}/?$`)
    return re.test(href.split('#')[0].split('?')[0])
  }) || literalRoutes.some(({ re }) => re.test(route))

const orphans = [...new Set(routes)].filter((r) => !reachable(r))

console.log(`${screens.length} écrans analysés — ${total} liens internes et ${assets} références d'images parcourus`)
if (missingAssets.size) {
  console.log(`\n${missingAssets.size} image(s) introuvable(s) dans public/ :`)
  for (const [asset, from] of [...missingAssets].sort()) {
    console.log(`  ✗ ${asset}   (depuis : ${[...from].slice(0, 3).join(', ')})`)
  }
  process.exitCode = 1
} else {
  console.log('Toutes les images référencées existent dans public/img/.')
}
if (orphans.length) {
  console.log(`\n${orphans.length} route(s) déclarée(s) sans aucun lien entrant :`)
  for (const r of orphans) console.log(`  ✗ ${r}`)
  process.exitCode = 1
} else {
  console.log(`${routes.length} routes déclarées — toutes atteignables depuis au moins un lien (${literalRoutes.length} références de chemin dans le JSX).`)
}
if (broken.size === 0) {
  console.log('Aucun lien mort : tous les liens pointent vers une route déclarée.')
} else {
  console.log(`\n${broken.size} lien(s) sans route correspondante :`)
  for (const [href, from] of [...broken].sort()) {
    console.log(`  ✗ ${href}   (depuis : ${[...from].slice(0, 4).join(', ')}${from.size > 4 ? `, +${from.size - 4}` : ''})`)
  }
  process.exitCode = 1
}
