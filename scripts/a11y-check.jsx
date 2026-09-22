/* Audit d'accessibilité de base sur les écrans publics et les espaces.
   Vérifie, sur le HTML rendu de chaque écran :
     - les <img> sans attribut alt ;
     - les <button> et <a> sans intitulé accessible (texte, aria-label ou title) ;
     - les identifiants HTML dupliqués dans une même page.
   Usage : npm run check:a11y  */
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
  '/', '/decouvrir', '/talents', '/stylistes', '/designers', '/mannequins', '/talent/tal-3',
  '/marques', '/marque/brd-1', '/creations', '/galerie', '/videos', '/videos/vid-2', '/fil',
  '/evenements', '/evenements/evt-4', '/opportunites', '/opportunites/opp-2', '/annuaire',
  '/marketplace', '/produit/prd-3', '/panier', '/paiement', '/actualites', '/actualites/art-2',
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

const issues = { images: [], boutons: [], liens: [], ids: [] }
const strip = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim()

for (const route of routes) {
  let html
  try {
    html = renderToString(
      <MemoryRouter initialEntries={[route]}><AppProvider><App /></AppProvider></MemoryRouter>
    )
  } catch (e) {
    issues.boutons.push([route, `rendu impossible : ${e.message.split('\n')[0]}`])
    continue
  }

  for (const tag of html.match(/<img[^>]*>/g) || []) {
    if (!/\salt=/.test(tag)) issues.images.push([route, tag.slice(0, 90)])
  }

  for (const tag of html.match(/<button[^>]*>[\s\S]*?<\/button>/g) || []) {
    const attrs = tag.slice(0, tag.indexOf('>'))
    const label = strip(tag)
    if (!label && !/aria-label=|title=/.test(attrs)) issues.boutons.push([route, attrs.slice(0, 110)])
  }

  for (const tag of html.match(/<a\s[^>]*>[\s\S]*?<\/a>/g) || []) {
    const attrs = tag.slice(0, tag.indexOf('>'))
    if (/href="\/(videos|galerie|produit|marque|talent)\//.test(attrs) && /aria-label=|title=/.test(attrs)) continue
    const label = strip(tag)
    if (!label && !/aria-label=|title=/.test(attrs)) issues.liens.push([route, attrs.slice(0, 110)])
  }

  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])
  const dupes = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))]
  if (dupes.length) issues.ids.push([route, dupes.join(', ')])
}

const report = (label, list) => {
  console.log(`\n${label} : ${list.length === 0 ? 'aucun problème' : `${list.length} cas`}`)
  const grouped = new Map()
  for (const [route, detail] of list) {
    if (!grouped.has(detail)) grouped.set(detail, [])
    grouped.get(detail).push(route)
  }
  for (const [detail, where] of [...grouped].slice(0, 12)) {
    console.log(`  • ${detail}`)
    console.log(`    écrans : ${where.slice(0, 5).join(', ')}${where.length > 5 ? ` (+${where.length - 5})` : ''}`)
  }
  if (grouped.size > 12) console.log(`  … et ${grouped.size - 12} autres variantes`)
  return list.length
}

console.log(`${routes.length} écrans audités`)
const total = report('Images sans alt', issues.images)
  + report('Boutons sans intitulé accessible', issues.boutons)
  + report('Liens sans intitulé accessible', issues.liens)
  + report('Identifiants HTML dupliqués', issues.ids)

console.log(`\n${total === 0 ? '✅ Aucun problème d’accessibilité détecté sur les critères vérifiés.' : `⚠️ ${total} cas à revoir.`}`)
process.exitCode = total ? 1 : 0
