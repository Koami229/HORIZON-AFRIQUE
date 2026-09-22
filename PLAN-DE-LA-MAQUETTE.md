# HORIZON AFRIQUE — Plan de la maquette (51 écrans)

Correspondance entre le contenu demandé et les écrans réellement réalisés.
Toutes les URL ci-dessous sont visibles dans la maquette navigable.

## Partie 1 — Site public

| # | Écran demandé | URL | Fichier |
| --- | --- | --- | --- |
| 1 | Page de bienvenue / Landing | `/` | `pages/Home.jsx` |
| 2 | Menu principal | en-tête de toutes les pages | `components/Layout.jsx` |
| 5 | Découvrir (filtres + 5 sections) | `/decouvrir` | `pages/Discover.jsx` |
| 6 | Talents (11 catégories) | `/talents` | `pages/Talents.jsx` |
| 7 | Stylistes | `/stylistes` | `pages/Talents.jsx` |
| 8 | Designers | `/designers` | `pages/Talents.jsx` |
| 9 | Mannequins | `/mannequins` | `pages/Talents.jsx` |
| 10 | Marques | `/marques` | `pages/Brands.jsx` |
| 11 | Profil d’une marque | `/marque/brd-1` (ex. **TOURÉ.**) | `pages/Brands.jsx` |
| 12 | Profil talent | `/talent/tal-1` | `pages/Talents.jsx` |
| 13 | Créations | `/creations` | `pages/Creative.jsx` |
| 14 | Horizon Gallery | `/galerie` | `pages/Creative.jsx` |
| 15 | Vidéos (+ détail) | `/videos`, `/videos/vid-1` | `pages/Creative.jsx` |
| 16 | Fil d’actualité | `/fil` | `pages/Creative.jsx` |
| 17 | Événements | `/evenements` | `pages/EventsOpps.jsx` |
| 18 | Détail d’un événement | `/evenements/evt-1` | `pages/EventsOpps.jsx` |
| 19 | Opportunités | `/opportunites` | `pages/EventsOpps.jsx` |
| 20 | Détail d’une opportunité | `/opportunites/opp-1` | `pages/EventsOpps.jsx` |
| 21 | Horizon Directory | `/annuaire` | `pages/Discover.jsx` |
| 22 | Horizon Marketplace | `/marketplace` | `pages/Market.jsx` |
| 23 | Page produit | `/produit/prd-1` | `pages/Market.jsx` |
| 24 | Panier | `/panier` | `pages/Market.jsx` |
| 25 | Paiement | `/paiement` | `pages/Market.jsx` |
| 26 | Actualités | `/actualites` | `pages/Editorial.jsx` |
| 27 | Page d’un article | `/actualites/art-1` | `pages/Editorial.jsx` |
| 28 | Partenaires | `/partenaires` | `pages/Editorial.jsx` |
| 29 | Sponsors | `/sponsors` | `pages/Editorial.jsx` |
| 30 | Abonnements | `/abonnements` | `pages/Pricing.jsx` |
| 31 | Horizon Boost | `/horizon-boost` | `pages/Pricing.jsx` |
| 46 | Recherche globale | `/recherche` + overlay 🔍 | `pages/Discover.jsx` |
| 47 | Favoris | `/favoris` | `pages/Discover.jsx` |
| 49 | À propos (+ mentions légales) | `/a-propos` | `pages/Editorial.jsx` |
| 50 | Contact | `/contact` | `pages/Editorial.jsx` |
| 51 | Footer | bas de toutes les pages | `components/Layout.jsx` |

## Partie 2 — Authentification

| # | Écran demandé | URL |
| --- | --- | --- |
| 3 | Inscription (choix du type de compte + 8 champs + catégorie/spécialité) | `/inscription` |
| 4 | Connexion | `/connexion` |
| — | Choix du type de compte | `/type-de-compte` |
| — | Mot de passe oublié | `/mot-de-passe-oublie` |

Types de comptes proposés : **Talent, Marque, Boutique, Partenaire, Sponsor**.
Champs : nom, prénom, nom professionnel / structure, email, téléphone, pays, ville, mot de passe, catégorie, spécialité.

## Partie 3 — Espaces utilisateurs

| # | Écran demandé | URL |
| --- | --- | --- |
| 32 | Tableau de bord (+ menu latéral complet) | `/tableau-de-bord` |
| 33 | Mon profil | `/tableau-de-bord/profil` |
| 34 | Portfolio (ajouter / modifier / supprimer) | `/tableau-de-bord/portfolio` |
| 35 | Publications (créer, programmer, interactions) | `/tableau-de-bord/mes-publications` |
| — | Mes créations | `/tableau-de-bord/mes-creations` |
| — | Mes vidéos | `/tableau-de-bord/mes-videos` |
| — | Mes événements | `/tableau-de-bord/mes-evenements` |
| — | Mes opportunités | `/tableau-de-bord/mes-opportunites` |
| 36 | Collaborations (reçues, envoyées, en cours, terminées) | `/tableau-de-bord/collaborations` |
| 37 | Messages (messagerie professionnelle) | `/tableau-de-bord/messages` |
| 38 | Notifications | `/tableau-de-bord/notifications` |
| 39 | Statistiques (profil + boutique) | `/tableau-de-bord/statistiques` |
| — | Abonnement | `/tableau-de-bord/abonnement` |
| — | Horizon Boost (campagnes) | `/tableau-de-bord/boost` |
| 48 | Paramètres (7 onglets) | `/tableau-de-bord/parametres` |

## Partie 4 — Espaces professionnels

| # | Écran demandé | URL |
| --- | --- | --- |
| 32b | Espace marque (ma marque, collections, produits, boutique, commandes) | `/espace-marque` |
| 40 | Espace boutique (produits, ajouter, commandes, stocks, promotions, stats, livraison) | `/boutique` |
| 41 | Commandes (nouvelles, en cours, livrées, annulées) | `/boutique/commandes` |
| 42 | Espace partenaire (tableau de bord, organisation, opportunités, événements, collaborations, recherche de talents) | `/espace-partenaire` |
| 43 | Espace sponsor (campagnes, talents soutenus, événements sponsorisés, statistiques) | `/espace-sponsor` |

## Partie 5 — Administration

| # | Écran demandé | URL |
| --- | --- | --- |
| 44 | Tableau de bord général (22 indicateurs) | `/administration` |
| 44 | Utilisateurs (talents, marques, boutiques, partenaires, sponsors, admins) | `/administration/utilisateurs` |
| 44 | Contenus & médias (publications, créations, vidéos, produits, commentaires, événements, opportunités) | `/administration/contenus` |
| 45 | Modération (signalements, suspensions, validations, vérification des marques, commentaires) | `/administration/moderation` |
| 44 | Abonnements / Paiements / Horizon Boost | `/administration/abonnements`, `/administration/paiements`, `/administration/boost` |
| 44 | Vérifications | `/administration/verifications` |
| 44 | Pays, catégories, notifications globales, paramètres | `/administration/referentiel` |

## Rappels de contenu

- **Abonnements** : Horizon Free (gratuit), Horizon Starter 5 000 FCFA/mois, Horizon Pro 10 000 FCFA/mois,
  Horizon Premium 20 000 FCFA/mois — avantages listés et bouton « Choisir cette formule ».
- **Horizon Boost** : 1 000 FCFA / 24 h ; cibles : profil, publication, produit, collection, vidéo, événement,
  opportunité ; étapes aperçu → durée → prix → paiement → confirmation.
- **Landing page** : logo, slogan, menu, Connexion, Inscription, grand visuel, présentation courte,
  « Découvrir la plateforme », « Créer mon profil », puis les 17 sections (talents, marques, collections,
  créations, actualités, vidéos, événements, opportunités, produits, boutiques, pays, partenaires, sponsors,
  témoignages, abonnements, Horizon Boost, footer).

## Contrôles automatiques

| Commande | Portée | Résultat |
| --- | --- | --- |
| `npm run check:routes` | les 79 écrans rendus en SSR | 79/79 sans erreur |
| `npm run check:spec` | les 51 sections du cahier des charges, marqueurs et décomptes | 186/186 points conformes |
| `npm run check:links` | 4 598 liens internes et 362 références d'images sur 72 écrans | aucun lien mort, aucun visuel manquant |
| `npm run check:a11y` | alt, intitulés de boutons et de liens, identifiants uniques | aucun problème détecté |
| `npm run check:css` | 219 classes utilisées dans le JSX, 244 définies dans la feuille de style | aucune classe manquante |
| `npm run check:interactions` | 19 parcours cliquables sous jsdom | 55/55 vérifications réussies |

`npm run check` enchaîne les six ; `npm run build` produit `dist/` (559 kB de JS, 29,6 kB de CSS).
