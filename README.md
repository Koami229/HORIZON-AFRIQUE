# HORIZON AFRIQUE — Maquette navigable

Maquette complète et interactive de la plateforme **Horizon Afrique** : le réseau professionnel des
talents, marques, boutiques, partenaires et sponsors de la création africaine.

> Toutes les données (profils, produits, paiements, statistiques…) sont **fictives** et servent à illustrer
> les écrans. Aucun back-end n’est requis : les interactions sont simulées côté client.

## Démarrer

```bash
npm install
npm run dev             # http://localhost:5173
npm run build           # build de production dans dist/
npm run preview         # prévisualiser le build
npm run check                # les huit contrôles ci-dessous, à la suite
npm run check:routes         # 79/79 : chaque route se rend sans erreur (rendu SSR)
npm run check:spec           # 187/187 : les 51 sections du cahier des charges sont présentes
npm run check:data           # intégrité du jeu de données : identifiants, catégories, dates, montants, médias
npm run check:links          # 4 601 liens internes + 362 images : aucun lien mort, aucune route orpheline
npm run check:a11y           # 8 critères : alt, intitulés, identifiants, titres h1→h3, champs, typographie
npm run check:contrast       # contraste WCAG 2.1 AA des couples texte / fond du système de design
npm run check:css            # classes manquantes, CSS mort et couverture responsive des grilles
npm run check:interactions   # 132/132 : parcours cliquables vérifiés sous jsdom
```

### Ce que couvre `check:css`

Trois vérifications sur `src/styles.css` contre les 19 fichiers JSX : les classes utilisées dans
le JSX mais absentes de la feuille de style (aucune), les classes définies mais jamais employées
(jetons de bibliothèque conservés : `gap-4`, `grid-6`, `gradient-text`, `stepper`…), et la
**couverture responsive** : toute mise en page qui empile deux colonnes fractionnaires ou
réserve une colonne fixe de 200 px et plus doit être reprise dans une media query, sinon la
maquette déborderait sur téléphone. Les grilles `auto-fill`/`minmax` et les colonnes d'icône
sont fluides et exemptées. Les points de rupture déclarés sont 1180, 1080, 980 et 640 px.
Le contrôle vérifie aussi le **mouvement réduit** : dès qu'une transition est déclarée, un bloc
`@media (prefers-reduced-motion: reduce)` doit neutraliser animations et transitions.

### Ce que couvre `check:contrast`

La palette est lue directement dans `src/styles.css` (`:root`) et chaque couple texte / fond
réellement utilisé par les composants est évalué selon WCAG 2.1 AA : 4,5:1 pour le texte
courant, 3:1 pour les éléments d'interface et le grand texte. Les jetons décoratifs
(`--terra`, `--green`, `--indigo`, `--rose`) sont réservés aux fonds, dégradés et barres ;
les jetons clairs correspondants (`--terra-soft`, `--green-soft`, `--indigo-soft`) portent
le texte. Le contraste du texte tertiaire (`--muted-2`) a été relevé à 4,78:1 sur le fond le
plus clair du thème.

### Ce que couvre `check:data`

Dix familles de règles sur `src/data.js`, pour qu'aucun écran ne montre une donnée incohérente :
identifiants et noms uniques, catégories comprises dans les référentiels officiels (11 catégories
de talents, 7 de créations, 8 d'événements, 7 d'opportunités, 8 d'actualités, 11 de produits,
7 de vidéos), pays et villes présents dans `COUNTRIES` (apostrophes tolérées), références
croisées valides (auteur d'une création dans les talents ou les marques), **montants conformes aux
grilles** (abonnements 0 / 5 000 / 10 000 / 20 000 FCFA, Boost 1 000 / 2 700 / 5 500 FCFA),
valeurs numériques plausibles, dates valides et ordonnées, images réellement présentes dans
`public/img/`, textes renseignés (bios ≥ 90 caractères, articles, programmes, missions).

### Ce que couvrent `check:links` et `check:a11y`

- **Liens** : les 4 599 liens internes du rendu pointent tous vers une route déclarée, les
  362 images référencées existent dans `public/img/`, et **les 79 routes sont atteignables** —
  aucun écran n'est orphelin (contrôle inverse : chaque route est cherchée dans les `href`
  rendus puis dans les chemins écrits dans le JSX, y compris les tableaux de navigation).
- **Accessibilité**, huit critères sur les 79 écrans : `alt` des images, intitulés de boutons
  et de liens, identifiants HTML uniques, **un seul `h1` par écran**, **aucun niveau de titre
  sauté** (h1 → h2 → h3, la feuille de style conservant les tailles d'origine via `.h-sub` et
  `.card-h`) et **aucun champ de saisie sans libellé** (`label`, `aria-label`, `placeholder`
  ou `title`).

### Ce que couvre `check:spec`

Chaque section du cahier des charges est vérifiée sur le HTML réellement rendu : intitulés,
boutons et champs attendus, mais aussi les décomptes annoncés — 16 entrées de menu latéral,
9 onglets d'espace partenaire, 7 onglets d'espace sponsor, 25 modules d'administration,
12 puces de catégories Marketplace, 8 entrées d'espace boutique, 9 files de notifications,
5 groupes de liens et 5 réseaux sociaux au pied de page, 4 boutons « Choisir cette formule ».
Les éléments qui n'apparaissent qu'après un clic (étapes d'inscription, de paiement, de Boost,
pouvoirs de modération) sont marqués « interaction » et couverts par `check:interactions`.

### Ce que couvre `check:interactions`

27 parcours réels rendus sous jsdom, avec clics, saisies et assertions sur le DOM :
panier (ajout, quantité, suppression), favoris et « j'aime », assistant Horizon Boost en
5 étapes (1 000 / 2 700 / 5 500 FCFA), inscription en 4 étapes, filtres Marketplace et par pays,
onglets du profil marque TOURÉ., suivi et désabonnement d'une marque, prise de contact,
choix d'une formule d'abonnement, recherche globale (résultats puis navigation),
messagerie et demande de collaboration, publications, portfolio, paiement (Mobile Money
et carte), filtre des commandes, menu mobile et modération côté administration, filtre par pays de
l'annuaire (apostrophes comprises), **et un balayage de toutes les pages de liste** : pour
chacune, un filtre réduit bien la liste affichée puis le bouton « Réinitialiser » ramène la
liste complète (ou, pour les pages à puces de catégorie, la puce active réduit la liste).
S'y ajoutent la pagination de l'annuaire (12 fiches par page, 40 fiches, retour en page 1 dès
qu'un filtre change), l'inscription à un événement, l'ajout au calendrier, l'achat d'un billet,
la candidature à une offre et l'ouverture d'un book depuis la liste des mannequins. L'inscription
contrôle aussi la confirmation du mot de passe et la conservation des informations saisies ; le
panier vérifie l'arithmétique (total = sous-total + livraison, +1 unité = +1 prix) et la
**livraison offerte au-delà de 250 000 FCFA** dans les deux sens.

## Stack

| Élément | Choix |
| --- | --- |
| Framework | React 18 |
| Build | Vite 5 |
| Routage | React Router 6 (79 routes) |
| Styles | CSS design-system maison (`src/styles.css`) |
| Polices | Fraunces (titres) + Plus Jakarta Sans (texte) |
| Images | 45 visuels locaux optimisés dans `public/img/` |

## Structure

```
src/
  App.jsx              ← toutes les routes (site public, auth, espaces, admin)
  main.jsx             ← point d’entrée (BrowserRouter + AppProvider)
  data.js              ← jeu de données de démonstration (talents, marques, produits…)
  styles.css           ← design system (thème sombre, or sahélien, terracotta, indigo)
  components/
    Layout.jsx         ← en-tête (menu, recherche, notifications, messages, profil) + pied de page + recherche globale
    ui.jsx             ← contexte applicatif (likes, favoris, panier, boost, toasts) + cartes réutilisables
  pages/
    Home.jsx           ← page de bienvenue (17 sections)
    Discover.jsx       ← Découvrir · Recherche globale · Horizon Directory · Favoris
    Talents.jsx        ← Talents · Stylistes · Designers · Mannequins · Profil talent
    Brands.jsx         ← Marques · Profil d’une marque (TOURÉ.)
    Creative.jsx       ← Créations · Horizon Gallery · Vidéos · Fil d’actualité
    EventsOpps.jsx     ← Événements · Détail événement · Opportunités · Détail opportunité
    Market.jsx         ← Marketplace · Produit · Panier · Paiement
    Editorial.jsx      ← Actualités · Article · Partenaires · Sponsors · À propos · Contact
    Pricing.jsx        ← Abonnements · Horizon Boost
    Auth.jsx           ← Connexion · Inscription · Type de compte · Mot de passe oublié
    dash/Shell.jsx     ← coquille des espaces utilisateurs (menu latéral)
    dash/User.jsx      ← tableau de bord, profil, portfolio, publications, collaborations, messages, stats…
    dash/Pro.jsx       ← espaces marque, boutique, commandes, partenaire, sponsor
    dash/Admin.jsx     ← administration, modération, vérifications, abonnements, paiements
public/img/            ← visuels (people, textures, atelier, runway, decor, products, art, gen)
```

## Parcours de démonstration conseillé

1. **Accueil** `/` — hero, talents et marques en vedette, collections, créations, vidéos, événements,
   opportunités, marketplace, boutiques, pays, partenaires, sponsors, témoignages, abonnements, Boost.
2. **Inscription** `/inscription` — 4 étapes : type de compte (Talent, Marque, Boutique, Partenaire, Sponsor),
   informations, profil professionnel, confirmation.
3. **Profil marque** `/marque/brd-1` — l’exemple **TOURÉ.** : bannière, onglets (Accueil, À propos, Publications,
   Collections, Galerie, Vidéos, Produits, Événements, Avis), suivre/contacter.
4. **Profil talent** `/talent/tal-1` — suivi, contact, proposition de collaboration, 10 onglets de contenu.
5. **Achat** `/marketplace` → `/produit/prd-1` → `/panier` → `/paiement` (Mobile Money ou carte).
6. **Horizon Boost** `/horizon-boost` — assistant 5 étapes : cible, contenu, durée (1 000 / 2 700 / 5 500 FCFA),
   paiement, confirmation.
7. **Espaces** — `/tableau-de-bord` (talent), `/espace-marque`, `/boutique`, `/espace-partenaire`,
   `/espace-sponsor`, `/administration`.
8. **Recherche globale** — icône 🔍 dans l’en-tête : résultats instantanés par type de contenu.

## Repères clés

- Le menu principal de l’en-tête reprend les 13 entrées demandées, les 3 dernières (Actualités, Partenaires,
  Sponsors) étant rangées dans le menu **« Plus »** avec l’annuaire, le fil, les abonnements et Horizon Boost.
- Les abonnements : **Free (0)**, **Starter (5 000 FCFA)**, **Pro (10 000 FCFA)**, **Premium (20 000 FCFA)**.
- Horizon Boost : **1 000 FCFA / 24 h** (variantes 3 jours 2 700 FCFA, 7 jours 5 500 FCFA).
- Le panier, les favoris, les « j’aime », les abonnements et les toasts sont conservés en mémoire pendant
  la navigation (contexte React), pour rendre la maquette vivante.
