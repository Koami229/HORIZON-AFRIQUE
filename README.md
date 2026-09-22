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
npm run check:routes         # 79/79 : chaque route se rend sans erreur (rendu SSR)
npm run check:interactions   # 43/43 : parcours cliquables vérifiés sous jsdom
```

### Ce que couvre `check:interactions`

13 parcours réels rendus sous jsdom, avec clics, saisies et assertions sur le DOM :
panier (ajout, quantité, suppression), favoris et « j'aime », assistant Horizon Boost en
5 étapes (1 000 / 2 700 / 5 500 FCFA), inscription en 4 étapes, filtres Marketplace,
onglets du profil marque TOURÉ., recherche globale, messagerie, publications, portfolio,
paiement (Mobile Money et carte), menu mobile et modération côté administration.

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
