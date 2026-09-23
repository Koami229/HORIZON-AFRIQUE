/* Vérifie que chaque route de la maquette se rend sans erreur (rendu SSR via react-dom/server).
   Usage : npm run check:routes  */
/* Sortie lisible : on masque les avertissements attendus de React Router en SSR. */
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

let fail = 0
for (const r of routes) {
  try {
    const html = renderToString(
      <MemoryRouter initialEntries={[r]}><AppProvider><App /></AppProvider></MemoryRouter>
    )
    console.log(`OK   ${r}  (${html.length} chars)`)
  } catch (e) {
    fail++
    console.log(`FAIL ${r}  -> ${e.message.split('\n')[0]}`)
  }
}
console.log(`\n${routes.length - fail}/${routes.length} routes rendues sans erreur`)
process.exit(fail ? 1 : 0)
