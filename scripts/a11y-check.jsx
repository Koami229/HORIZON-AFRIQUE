/* Audit d'accessibilité de base sur les écrans publics et les espaces.
   Vérifie, sur le HTML rendu de chaque écran :
     - les <img> sans attribut alt ;
     - les <button> et <a> sans intitulé accessible (texte, aria-label ou title) ;
     - les identifiants HTML dupliqués dans une même page ;
     - la structure de titres : un seul h1 par écran, aucun niveau sauté ;
     - les champs de saisie sans libellé (label, aria-label, placeholder ou title).
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

const issues = { images: [], boutons: [], liens: [], ids: [], titres: [], structure: [], champs: [] }
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

  /* --- structure de titres et libellés de champs : sur le contenu principal --- */
  const mainStart = html.indexOf('<main')
  const main = mainStart >= 0 ? html.slice(mainStart, html.indexOf('</main>')) : html

  const niveaux = [...main.matchAll(/<h([1-6])[^>]*>/g)].map((m) => Number(m[1]))
  const h1 = niveaux.filter((n) => n === 1).length
  if (h1 !== 1) issues.titres.push([route, `${h1} titre(s) h1`, niveaux.join('')])
  for (let i = 1; i < niveaux.length; i++) {
    if (niveaux[i] - niveaux[i - 1] > 1) {
      issues.structure.push([route, `niveau sauté ${niveaux[i - 1]} → ${niveaux[i]}`, niveaux.join('')])
      break
    }
  }

  for (const m of main.matchAll(/<(input|select|textarea)\b[^>]*>/g)) {
    const tag = m[0]
    if (/type="(hidden|checkbox|radio|submit)"/.test(tag)) continue
    if (/aria-label=|placeholder=|title=/.test(tag)) continue
    const before = main.slice(0, m.index)
    const bloc = before.lastIndexOf('<div class="field"')
    if (!(bloc >= 0 && before.slice(bloc).includes('<label'))) issues.champs.push([route, tag.slice(0, 100)])
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
  + report('Écrans sans un titre h1 unique', issues.titres)
  + report('Niveaux de titre sautés', issues.structure)
  + report('Champs sans libellé accessible', issues.champs)

console.log(`\n${total === 0 ? '✅ Aucun problème d’accessibilité détecté sur les critères vérifiés.' : `⚠️ ${total} cas à revoir.`}`)
process.exitCode = total ? 1 : 0
