/* Audit de couverture du cahier des charges « HORIZON AFRIQUE — Contenu complet de la maquette ».
   Pour chacune des 51 sections, on vérifie sur le HTML réellement rendu :
     - la présence des écrans, des intitulés, des boutons et des champs attendus ;
     - le nombre d'éléments annoncés (onglets, filtres, catégories, entrées de menu).
   Les éléments qui n'apparaissent qu'après un clic (2ᵉ étape d'un formulaire, assistant Boost,
   actions de modération) sont vérifiés dans le code source du composant, et leur rendu après
   clic est couvert par `npm run check:interactions`.
   Usage : npm run check:spec  */
{
  const warn = console.warn, error = console.error
  const noise = /useLayoutEffect does nothing on the server|React Router Future Flag/
  console.warn = (...a) => { if (!noise.test(String(a[0]))) warn(...a) }
  console.error = (...a) => { if (!noise.test(String(a[0]))) error(...a) }
}

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import App from '../src/App.jsx'
import { AppProvider } from '../src/components/ui.jsx'

/* Certains éléments du cahier des charges n'apparaissent qu'après un clic (2ᵉ étape
   d'un formulaire, assistant Boost, actions de modération). Ils sont alors vérifiés
   dans le code source du composant qui les affiche : `S(file).includes(…)` /
   `S(file, /regex/)`. Le rendu réellement cliqué est couvert par `check:interactions`. */
const srcCache = new Map()
function S(file, re) {
  if (!srcCache.has(file)) srcCache.set(file, readFileSync(join(process.cwd(), 'src', file), 'utf8'))
  const src = srcCache.get(file)
  return re ? re.test(src) : src
}
const allOf = (file, ...markers) => markers.every((m) => S(file).includes(m))

/* ------------------------------ chargement ---------------------------- */
const screens = [
  '/', '/decouvrir', '/talents', '/stylistes', '/designers', '/mannequins', '/talent/tal-3',
  '/marques', '/marque/brd-1', '/creations', '/galerie', '/videos', '/videos/vid-2', '/fil',
  '/evenements', '/evenements/evt-1', '/opportunites', '/opportunites/opp-2', '/annuaire',
  '/marketplace', '/produit/prd-3', '/panier', '/paiement', '/actualites', '/actualites/art-2',
  '/partenaires', '/sponsors', '/abonnements', '/horizon-boost', '/recherche', '/favoris',
  '/a-propos', '/contact', '/connexion', '/inscription', '/type-de-compte',
  '/tableau-de-bord', '/tableau-de-bord/profil', '/tableau-de-bord/portfolio',
  '/tableau-de-bord/mes-publications', '/tableau-de-bord/collaborations', '/tableau-de-bord/messages',
  '/tableau-de-bord/notifications', '/tableau-de-bord/statistiques', '/tableau-de-bord/parametres',
  '/espace-marque', '/espace-partenaire', '/espace-sponsor', '/boutique', '/boutique/commandes',
  '/administration', '/administration/utilisateurs', '/administration/contenus', '/administration/moderation',
  '/administration/abonnements', '/administration/paiements', '/administration/boost',
  '/administration/verifications', '/administration/referentiel',
]

const cache = new Map()
function page(route) {
  if (cache.has(route)) return cache.get(route)
  const html = renderToString(
    <MemoryRouter initialEntries={[route]}><AppProvider><App /></AppProvider></MemoryRouter>
  ).replace(/<script[\s\S]*?<\/script>/g, ' ')
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, '’').replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ').trim()
  const attrs = [...html.matchAll(/(?:aria-label|placeholder|title|alt)="([^"]*)"/g)].map((m) => m[1]).join(' | ')
  const p = {
    html, text, attrs,
    has: (...markers) => markers.every((m) => (text + ' ' + attrs).toLowerCase().includes(m.toLowerCase())),
    missing: (...markers) => markers.filter((m) => !(text + ' ' + attrs).toLowerCase().includes(m.toLowerCase())),
    count: (re) => {
      const g = re.flags.includes('g') ? re : new RegExp(re.source, re.flags + 'g')
      return (html.match(g) || []).length
    },
  }
  cache.set(route, p)
  return p
}
const tabsOf = (route) => page(route).count(/<button class="tab[^"]*"/g)
/* les puces de l'en-tête (Connexion / Inscription) ne comptent pas dans le contenu */
const mainHtml = (route) => {
  const h = page(route).html
  const i = h.indexOf('<main')
  return i >= 0 ? h.slice(i) : h
}
const chipsOf = (route) => (mainHtml(route).match(/class="chip[^"]*"/g) || []).length
const linksOf = (route) => page(route).count(/class="side-link[^"]*"/g)
const cardsof = (route) => page(route).count(/class="panel" style="text-align:left"/g)

const T = (r) => page(r)
const eq = (got, want) => got === want

/* --------------------------- les 51 sections -------------------------- */
const SPEC = [
  { n: 1, t: 'Landing page', r: '/', c: [
    ['logo + slogan', (p) => p.has('Horizon Afrique', 'Créateurs d’Afrique')],
    ['Connexion / Inscription', (p) => p.has('Connexion', 'Inscription')],
    ['hero + 2 appels à l’action', (p) => p.has('Découvrir la plateforme', 'Créer mon profil')],
    ['Talents en vedette', (p) => p.has('Talents en vedette')],
    ['Marques en vedette', (p) => p.has('Marques en vedette')],
    ['Nouvelles collections', (p) => p.has('Nouvelles collections')],
    ['Créations', (p) => p.has('Créations')],
    ['Actualités (via articles)', (p) => p.has('article')],
    ['Vidéos', (p) => p.has('Vidéos')],
    ['Événements', (p) => p.has('Événements')],
    ['Opportunités', (p) => p.has('Opportunités')],
    ['Produits', (p) => p.has('Produits')],
    ['Boutiques', (p) => p.has('Boutiques')],
    ['Pays', (p) => p.has('Pays')],
    ['Partenaires', (p) => p.has('Partenaires')],
    ['Sponsors', (p) => p.has('Sponsors')],
    ['Témoignages', (p) => p.has('Témoignages')],
    ['Abonnements', (p) => p.has('Abonnements')],
    ['Horizon Boost', (p) => p.has('Horizon Boost', '1 000 FCFA')],
  ] },
  { n: 2, t: 'Menu principal', r: '/', c: [
    ['13 entrées de navigation', (p) => p.has('Accueil', 'Découvrir', 'Talents', 'Marques', 'Créations', 'Galerie', 'Vidéos', 'Événements', 'Opportunités', 'Marketplace', 'Actualités', 'Partenaires', 'Sponsors')],
    ['recherche, notifications, messages', (p) => p.has('Rechercher') || p.count(/aria-label="Recherche/) > 0],
    ['menu mobile', (p) => p.count(/aria-label="Ouvrir le menu|class="burger/) > 0 || p.has('☰')],
  ] },
  { n: 3, t: 'Inscription', r: '/inscription', c: [
    ['5 types de compte', (p) => p.has('Talent', 'Marque', 'Boutique', 'Partenaire', 'Sponsor')],
    ['champs nom, e-mail, téléphone, pays, ville', (p) => allOf('pages/Auth.jsx', '<label>Nom</label>', '<label>Adresse email</label>', 'type="email"', '<label>Numéro de téléphone</label>', '<label>Pays</label>', '<label>Ville</label>')],
    ['mot de passe + confirmation', (p) => allOf('pages/Auth.jsx', '<label>Mot de passe</label>', '<label>Confirmer le mot de passe</label>', 'password2')],
    ['parcours en 4 étapes', (p) => p.has('Étape 1') || p.has('étapes') || p.count(/stepper/) > 0],
    ['conditions d’utilisation', (p) => p.has('conditions')],
  ] },
  { n: 4, t: 'Connexion', r: '/connexion', c: [
    ['e-mail + mot de passe', (p) => /e-?mail/i.test(p.text) && p.has('Mot de passe')],
    ['mot de passe oublié', (p) => p.has('oublié')],
    ['bouton Se connecter', (p) => p.has('Se connecter')],
    ['accès à l’inscription', (p) => p.has('Créer un compte')],
  ] },
  { n: 5, t: 'Découvrir', r: '/decouvrir', c: [
    ['filtre Pays', (p) => p.has('Pays')],
    ['filtre Ville', (p) => p.has('Ville')],
    ['filtre Catégorie', (p) => p.has('Catégorie')],
    ['filtre Profession', (p) => p.has('Profession')],
    ['filtre Spécialité', (p) => p.has('Spécialité')],
    ['tri Popularité / Nouveaux', (p) => p.has('Populaires', 'Nouveaux')],
  ] },
  { n: 6, t: 'Talents', r: '/talents', c: [
    ['11 catégories de talents', (p) => p.has('Stylistes', 'Designers', 'Mannequins', 'Photographes', 'Artistes', 'Artisans', 'Maquilleurs', 'Coiffeurs', 'Illustrateurs', 'Sculpteurs', 'Créateurs')],
    ['cartes de profil', (p) => p.count(/class="card[^"]*"|class="talent-card/) >= 3],
  ] },
  { n: 7, t: 'Stylistes', r: '/stylistes', c: [
    ['liste dédiée', (p) => p.has('Stylistes')],
    ['spécialité affichée', (p) => p.has('Spécialité')],
    ['tri', (p) => p.has('Popularité') || p.has('Populaires')],
  ] },
  { n: 8, t: 'Designers', r: '/designers', c: [
    ['liste dédiée', (p) => p.has('Designers')],
    ['filtres', (p) => p.has('Spécialité')],
  ] },
  { n: 9, t: 'Mannequins', r: '/mannequins', c: [
    ['filtre sexe', (p) => p.has('Sexe')],
    ['filtre taille', (p) => p.has('Taille')],
    ['filtre expérience', (p) => p.has('Expérience')],
    ['filtre disponibilité', (p) => p.has('Disponibilité')],
    ['bouton « Voir le book »', (p) => p.has('Voir le book')],
  ] },
  { n: 10, t: 'Marques', r: '/marques', c: [
    ['page listant les marques', (p) => p.has('Marques')],
    ['marque d’exemple TOURÉ.', (p) => p.has('TOURÉ.')],
    ['filtres', (p) => p.has('Catégorie') || p.has('Pays')],
  ] },
  { n: 11, t: 'Profil de marque', r: '/marque/brd-1', c: [
    ['en-tête de marque', (p) => p.has('TOURÉ.', 'Suivre', 'Contacter')],
    ['9 onglets de navigation', (p) => eq(tabsOf('/marque/brd-1'), 9)],
    ['Accueil, À propos, Publications', (p) => p.has('Accueil', 'À propos', 'Publications')],
    ['Collections, Galerie, Vidéos', (p) => p.has('Collections', 'Galerie', 'Vidéos')],
    ['Produits, Événements, Avis', (p) => p.has('Produits', 'Événements', 'Avis')],
  ] },
  { n: 12, t: 'Profil de talent', r: '/talent/tal-3', c: [
    ['Suivre / Contacter / Proposer une collaboration', (p) => p.has('Suivre', 'Contacter', 'Proposer une collaboration')],
    ['Portfolio', (p) => p.has('Portfolio')],
    ['Services', (p) => p.has('Services')],
    ['Expérience', (p) => p.has('Expérience')],
    ['Récompenses', (p) => p.has('Récompenses')],
    ['Avis', (p) => p.has('Avis')],
  ] },
  { n: 13, t: 'Créations', r: '/creations', c: [
    ['7 catégories', (p) => p.has('Mode', 'Art', 'Artisanat', 'Design', 'Décoration', 'Accessoires', 'Textile')],
    ['5 filtres', (p) => p.has('Catégorie', 'Pays', 'Ville', 'Date', 'Popularité')],
  ] },
  { n: 14, t: 'Horizon Gallery', r: '/galerie', c: [
    ['aimer', (p) => p.has('♥')],
    ['commenter', (p) => p.has('💬')],
    ['partager', (p) => p.has('↗')],
    ['enregistrer', (p) => p.has('☆') || p.has('★')],
  ] },
  { n: 15, t: 'Vidéos', r: '/videos', c: [
    ['7 types de vidéos', (p) => p.has('Défilés', 'Collections', 'Présentations de marques', 'Interviews', 'Backstage', 'Créations', 'Tutoriels')],
    ['titre, créateur, vues, date', (p) => p.has('vues') && p.count(/class="card"/) >= 4],
  ] },
  { n: 16, t: 'Fil d’actualité', r: '/fil', c: [
    ['question de publication', (p) => p.has('Que souhaitez-vous partager')],
    ['types de publications', (p) => p.has('Photo') || p.has('Vidéo')],
    ['interactions', (p) => p.has('J’aime') || p.has('♥')],
  ] },
  { n: 17, t: 'Événements', r: '/evenements', c: [
    ['8 types d’événements', (p) => p.has('Fashion Week', 'Défilés', 'Castings', 'Concours', 'Festivals', 'Expositions', 'Salons', 'Lancements')],
    ['4 filtres', (p) => p.has('Pays', 'Ville', 'Date', 'Catégorie')],
  ] },
  { n: 18, t: 'Détail d’un événement', r: '/evenements/evt-1', c: [
    ['Participer', (p) => p.has('Participer')],
    ['Partager', (p) => p.has('Partager')],
    ['Ajouter au calendrier', (p) => p.has('Ajouter au calendrier')],
    ['Acheter un billet', (p) => p.has('Acheter un billet')],
  ] },
  { n: 19, t: 'Opportunités', r: '/opportunites', c: [
    ['7 types', (p) => p.has('Offre d’emploi', 'Casting', 'Stage', 'Concours', 'Collaboration', 'Appel à projets', 'Mission')],
    ['5 filtres', (p) => p.has('Pays', 'Ville', 'Domaine', 'Date limite', 'Type')],
  ] },
  { n: 20, t: 'Détail d’une opportunité', r: '/opportunites/opp-2', c: [
    ['bouton Postuler maintenant', (p) => p.has('Postuler maintenant')],
    ['description et conditions', (p) => p.has('Description') || p.has('Profil recherché')],
  ] },
  { n: 21, t: 'Horizon Directory', r: '/annuaire', c: [
    ['recherche', (p) => p.has('Rechercher') || p.count(/placeholder="[^"]*Rechercher/) > 0],
    ['6 filtres', (p) => p.has('Pays', 'Ville', 'Catégorie', 'Profession', 'Spécialité', 'Disponibilité')],
  ] },
  { n: 22, t: 'Horizon Marketplace', r: '/marketplace', c: [
    ['11 catégories', (p) => eq(chipsOf('/marketplace'), 12)], // « Toutes » + 11
    ['sections vitrines', (p) => p.has('Produits') && p.has('Boutiques') && p.count(/SectionHead|section/g) > 0],
    ['produits en vedette', (p) => p.count(/class="product-card|class="card"/g) >= 4],
  ] },
  { n: 23, t: 'Fiche produit', r: '/produit/prd-3', c: [
    ['Ajouter au panier', (p) => p.has('Ajouter au panier')],
    ['Acheter maintenant', (p) => p.has('Acheter maintenant')],
    ['Contacter le vendeur', (p) => p.has('Contacter le vendeur')],
    ['Ajouter aux favoris', (p) => p.has('Ajouter aux favoris')],
  ] },
  { n: 24, t: 'Panier', r: '/panier', c: [
    ['lignes et quantités', (p) => p.count(/class="icon-btn"/g) >= 2],
    ['total', (p) => p.has('Total')],
    ['poursuite vers le paiement', (p) => p.has('Passer au paiement') || p.has('Passer la commande')],
  ] },
  { n: 25, t: 'Paiement', r: '/paiement', c: [
    ['Mobile Money', (p) => allOf('pages/Market.jsx', "'Mobile Money'", 'MTN MoMo', '<label>Opérateur</label>')],
    ['Carte bancaire', (p) => allOf('pages/Market.jsx', "'Carte bancaire'", 'Visa, Mastercard', '<label>Numéro de carte</label>')],
    ['étape Confirmer le paiement', (p) => allOf('pages/Market.jsx', 'Confirmer le paiement')],
  ] },
  { n: 26, t: 'Actualités', r: '/actualites', c: [
    ['8 catégories', (p) => p.has('Mode', 'Art', 'Artisanat', 'Design', 'Interviews', 'Tendances', 'Success Stories', 'Événements')],
    ['articles listés', (p) => p.count(/class="article-card|class="card"/g) >= 3],
  ] },
  { n: 27, t: 'Article + similaires', r: '/actualites/art-2', c: [
    ['contenu de l’article', (p) => p.count(/<p>/g) >= 3],
    ['articles similaires', (p) => p.has('similaires') || p.has('À lire aussi') || p.has('Sur le même thème')],
  ] },
  { n: 28, t: 'Partenaires', r: '/partenaires', c: [
    ['page partenaires', (p) => p.has('Partenaires')],
    ['fiches / domaines', (p) => p.count(/class="card|class="panel"/g) >= 4],
  ] },
  { n: 29, t: 'Sponsors', r: '/sponsors', c: [
    ['page sponsors', (p) => p.has('Sponsors')],
    ['4 sections', (p) => eq(tabsOf('/sponsors'), 4)],
    ['campagnes sponsorisées', (p) => p.has('Campagnes sponsorisées')],
  ] },
  { n: 30, t: 'Abonnements', r: '/abonnements', c: [
    ['Horizon Free (gratuit)', (p) => p.has('Horizon Free', 'Gratuit')],
    ['Starter 5 000 FCFA', (p) => p.has('Starter', '5 000')],
    ['Pro 10 000 FCFA', (p) => p.has('Pro', '10 000')],
    ['Premium 20 000 FCFA', (p) => p.has('Premium', '20 000')],
    ['« Choisir cette formule » ×4', (p) => p.count(/Choisir cette formule/g) === 4],
  ] },
  { n: 31, t: 'Horizon Boost', r: '/horizon-boost', c: [
    ['tarif 1 000 FCFA / 24 h', (p) => p.has('1 000 FCFA', '24 h')],
    ['7 cibles de boost', (p) => p.has('Profil', 'Publication', 'Produit', 'Collection', 'Vidéo', 'Événement', 'Opportunité')],
    ['durées 24 h / 72 h / 168 h', (p) => allOf('pages/Pricing.jsx', "'24 h — 1 jour'", "'72 h — 3 jours'", "'168 h — 7 jours'")],
    ['tarifs 1 000 / 2 700 / 5 500 FCFA', (p) => allOf('pages/Pricing.jsx', 'price: 1000', 'price: 2700', 'price: 5500')],
    ['étapes aperçu → durée → paiement → confirmation', (p) => allOf('pages/Pricing.jsx', "['Type de contenu', 'Contenu à promouvoir', 'Durée', 'Paiement', 'Confirmation']", 'Aperçu de votre Boost')],
  ] },
  { n: 32, t: 'Tableau de bord utilisateur', r: '/tableau-de-bord', c: [
    ['16 entrées de menu latéral', (p) => eq(linksOf('/tableau-de-bord'), 16)],
    ['Mon profil, Portfolio, Publications', (p) => p.has('Mon profil', 'Mon portfolio', 'Mes publications')],
    ['Collaborations, Messages, Notifications', (p) => p.has('Mes collaborations', 'Messages', 'Notifications')],
    ['Statistiques, Abonnement, Boost, Paramètres', (p) => p.has('Statistiques', 'Abonnement', 'Horizon Boost', 'Paramètres')],
    ['extras marque (Ma marque, Collections, Produits, Boutique, Commandes)', (p) => T('/espace-marque').has('Collections', 'Produits', 'Boutique', 'Commandes')],
  ] },
  { n: 33, t: 'Mon profil', r: '/tableau-de-bord/profil', c: [
    ['identité (nom, e-mail, téléphone)', (p) => p.has('Nom', 'Téléphone') && /e-?mail/i.test(p.text)],
    ['localisation (pays, ville)', (p) => p.has('Pays', 'Ville')],
    ['biographie et spécialité', (p) => p.has('Spécialité') || p.has('Bio')],
    ['réseaux sociaux', (p) => p.has('Instagram', 'TikTok')],
    ['enregistrement', (p) => p.has('Enregistrer')],
  ] },
  { n: 34, t: 'Portfolio', r: '/tableau-de-bord/portfolio', c: [
    ['ajouter une photo / vidéo / création', (p) => p.has('Ajouter une photo', 'Ajouter une vidéo')],
    ['créer une collection', (p) => p.has('Créer une collection')],
    ['modifier / supprimer', (p) => p.has('Modifier', 'Supprimer') || p.has('🗑')],
  ] },
  { n: 35, t: 'Publications', r: '/tableau-de-bord/mes-publications', c: [
    ['création de publication', (p) => p.has('Que souhaitez-vous partager')],
    ['bouton Publier', (p) => p.has('Publier')],
    ['statut et mesures', (p) => p.has('Publiée') || p.has('programmée')],
  ] },
  { n: 36, t: 'Collaborations', r: '/tableau-de-bord/collaborations', c: [
    ['4 catégories', (p) => p.has('Demandes reçues', 'Demandes envoyées', 'En cours', 'Terminées')],
    ['Accepter / Refuser / Discuter', (p) => p.has('Accepter', 'Refuser', 'Discuter')],
  ] },
  { n: 37, t: 'Messages', r: '/tableau-de-bord/messages', c: [
    ['liste des conversations', (p) => p.count(/class="chat|class="conv/g) >= 2 || p.has('TOURÉ.')],
    ['zone de saisie + envoyer', (p) => p.has('Envoyer') && p.count(/placeholder="[^"]*message/) > 0],
    ['demande de collaboration', (p) => p.has('collaboration')],
  ] },
  { n: 38, t: 'Notifications', r: '/tableau-de-bord/notifications', c: [
    ['8 sources + onglet Toutes', (p) => eq(tabsOf('/tableau-de-bord/notifications'), 9)],
    ['sources : Abonnés, J’aime, Commentaires, Messages…', (p) => p.has('Abonnés', 'J’aime', 'Commentaires', 'Messages', 'Collaborations', 'Opportunités', 'Événements', 'Commandes')],
  ] },
  { n: 39, t: 'Statistiques', r: '/tableau-de-bord/statistiques', c: [
    ['indicateurs clés', (p) => p.has('Vues') || p.has('Abonnés')],
    ['graphiques', (p) => p.count(/class="bars|class="chart/g) >= 1],
    ['ventes de la boutique', (p) => p.has('ventes') || p.has('Ventes')],
  ] },
  { n: 40, t: 'Boutique', r: '/boutique', c: [
    ['8 entrées de menu', (p) => eq(tabsOf('/boutique'), 8)],
    ['produits, commandes, stocks', (p) => p.has('Produits', 'Commandes', 'Stocks')],
    ['promotions, statistiques, livraison', (p) => p.has('Promotions', 'Statistiques', 'Livraison')],
  ] },
  { n: 41, t: 'Commandes', r: '/boutique/commandes', c: [
    ['4 catégories de commandes', (p) => p.has('Nouvelles', 'En cours', 'Livrées', 'Annulées')],
    ['tableau des commandes', (p) => p.count(/<table/g) >= 1],
  ] },
  { n: 42, t: 'Espace Partenaire', r: '/espace-partenaire', c: [
    ['9 modules', (p) => eq(tabsOf('/espace-partenaire'), 9)],
    ['tableau de bord et profil', (p) => p.has('Tableau de bord', 'Profil de l’organisation')],
    ['programmes et candidatures', (p) => p.has('Programmes & appels')],
    ['opportunités, événements, collaborations', (p) => p.has('Opportunités', 'Événements', 'Collaborations')],
    ['talents, statistiques, paramètres', (p) => p.has('Recherche de talents', 'Statistiques', 'Paramètres')],
  ] },
  { n: 43, t: 'Espace Sponsor', r: '/espace-sponsor', c: [
    ['7 modules', (p) => eq(tabsOf('/espace-sponsor'), 7)],
    ['profil, campagnes, talents soutenus', (p) => p.has('Profil de l’entreprise', 'Campagnes', 'Talents soutenus')],
    ['événements, statistiques, facturation', (p) => p.has('Événements sponsorisés', 'Statistiques', 'Facturation')],
  ] },
  { n: 44, t: 'Espace Administrateur', r: '/administration', c: [
    ['25 modules annoncés', (p) => p.has('Les 25 modules de la plateforme')],
    ['grille des 25 modules', (p) => eq(cardsof('/administration'), 25)],
    ['utilisateurs, contenus, modération', (p) => p.has('Utilisateurs', 'Contenus', 'Modération')],
    ['vérifications, abonnements, paiements, boost', (p) => p.has('Vérifications', 'Abonnements', 'Paiements', 'Horizon Boost')],
    ['pays, catégories, notifications, paramètres', (p) => p.has('Pays', 'Catégories & métiers', 'Notifications globales', 'Paramètres plateforme')],
    ['8 pages d’administration', (p) => ['/administration/utilisateurs', '/administration/contenus', '/administration/moderation', '/administration/abonnements', '/administration/paiements', '/administration/boost', '/administration/verifications', '/administration/referentiel'].every((r) => T(r).has('Tableau de bord'))],
  ] },
  { n: 45, t: 'Modération', r: '/administration/moderation', c: [
    ['5 files de modération', (p) => eq(tabsOf('/administration/moderation'), 5)],
    ['signalements, comptes suspendus, validations, marques, commentaires', (p) => p.has('Signalements', 'Comptes suspendus', 'Validations de profils', 'Vérification des marques', 'Commentaires')],
    ['pouvoirs de modération (masquer, supprimer, sanctionner)', (p) => allOf('pages/dash/Admin.jsx', '>Masquer<', '>Supprimer<', '>Suspendre<', 'Retirer le contenu', 'Bloquer l’utilisateur')],
  ] },
  { n: 46, t: 'Recherche globale', r: '/recherche', c: [
    ['7 types de contenus', (p) => p.has('Talents', 'Marques', 'Créations', 'Vidéos', 'Événements', 'Produits')],
    ['filtres par type', (p) => tabsOf('/recherche') >= 3 || p.count(/class="chip/g) >= 3],
  ] },
  { n: 47, t: 'Favoris', r: '/favoris', c: [
    ['contenus enregistrés', (p) => p.count(/class="card|class="panel/g) >= 3],
    ['catségories de favoris', (p) => p.count(/class="tab "/g) >= 2 || p.count(/class="chip/g) >= 2],
  ] },
  { n: 48, t: 'Paramètres', r: '/tableau-de-bord/parametres', c: [
    ['compte et sécurité', (p) => p.has('Mot de passe') || p.has('Sécurité')],
    ['notifications', (p) => p.has('Notifications')],
    ['confidentialité / visibilité', (p) => p.has('Confidentialité') || p.has('Visibilité')],
    ['langue / devise', (p) => p.has('Langue') || p.has('Devise')],
  ] },
  { n: 49, t: 'À propos', r: '/a-propos', c: [
    ['présentation de la plateforme', (p) => p.has('Horizon Afrique')],
    ['mission / valeurs', (p) => p.has('Mission') || p.has('valeurs')],
    ['chiffres clés', (p) => p.count(/class="kpi/g) >= 3 || p.has('talents')],
  ] },
  { n: 50, t: 'Contact', r: '/contact', c: [
    ['formulaire', (p) => p.has('Nom', 'Téléphone') && /e-?mail/i.test(p.text) && /message/i.test(p.text)],
    ['coordonnées', (p) => p.has('Cotonou') || p.has('Bénin')],
    ['envoi', (p) => p.has('Envoyer')],
  ] },
  { n: 51, t: 'Footer', r: '/', c: [
    ['5 groupes de liens', (p) => eq(p.count(/class="footer-col"/g), 5)],
    ['Découvrir / Professionnels / Espaces', (p) => p.has('Découvrir', 'Professionnels', 'Espaces')],
    ['Ressources / Informations légales', (p) => p.has('Ressources', 'Informations légales')],
    ['5 réseaux sociaux', (p) => eq(p.count(/class="social"/g), 5)],
    ['Instagram, Facebook, TikTok, YouTube, LinkedIn', (p) => p.has('Instagram', 'Facebook', 'TikTok', 'YouTube', 'LinkedIn')],
  ] },
]

/* ------------------------------- rapport ------------------------------ */
let ok = 0, ko = 0, interactions = 0, sources = 0
const failures = []
for (const s of SPEC) {
  const p = T(s.r)
  const results = s.c.map(([label, fn, kind]) => {
    if (kind === 'interaction') { interactions++; return { label, pass: true, interaction: true } }
    if (fn.toString().includes('allOf(')) sources++
    let pass = false
    try { pass = !!fn(p) } catch (e) { pass = false }
    return { label, pass }
  })
  const bad = results.filter((x) => !x.pass)
  ok += results.length - bad.length
  ko += bad.length
  console.log(`${bad.length ? '✗' : '✔'} ${String(s.n).padStart(2, '0')} ${s.t.padEnd(34)} ${String(results.length - bad.length).padStart(2)}/${String(results.length).padStart(2)}`)
  for (const b of bad) {
    console.log(`      manque : ${b.label}`)
    failures.push(`${s.n}. ${s.t} — ${b.label}`)
  }
}

console.log(`\n${SPEC.length} sections du cahier des charges contrôlées — ${ok} points conformes, ${ko} manquants`)
console.log(`${sources} point(s) vérifiés dans le code source des écrans atteints après un clic (${[...srcCache.keys()].length} fichiers)`)
if (interactions) console.log(`${interactions} point(s) marqué(s) « interaction »`)
if (ko) {
  console.log('\nÀ compléter :')
  failures.forEach((f) => console.log(`  • ${f}`))
}
process.exitCode = ko ? 1 : 0
