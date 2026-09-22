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
import { existsSync } from 'node:fs'
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
    if (known(href)) continue
    if (!broken.has(href)) broken.set(href, new Set())
    broken.get(href).add(screen)
  }
}

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
if (broken.size === 0) {
  console.log('Aucun lien mort : tous les liens pointent vers une route déclarée.')
} else {
  console.log(`\n${broken.size} lien(s) sans route correspondante :`)
  for (const [href, from] of [...broken].sort()) {
    console.log(`  ✗ ${href}   (depuis : ${[...from].slice(0, 4).join(', ')}${from.size > 4 ? `, +${from.size - 4}` : ''})`)
  }
  process.exitCode = 1
}
