import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import { Decouvrir, Recherche, Annuaire, Favoris } from './pages/Discover.jsx'
import { Talents, Stylistes, Designers, Mannequins, TalentProfile } from './pages/Talents.jsx'
import { Marques, BrandProfile } from './pages/Brands.jsx'
import { Creations, Galerie, Videos, VideoDetail, Fil } from './pages/Creative.jsx'
import { Evenements, EvenementDetail, Opportunites, OpportuniteDetail } from './pages/EventsOpps.jsx'
import { Marketplace, Produit, Panier, Paiement } from './pages/Market.jsx'
import { Actualites, Article, Partenaires, Sponsors, APropos, Contact, Legal } from './pages/Editorial.jsx'
import { Abonnements, HorizonBoost } from './pages/Pricing.jsx'
import { Connexion, Inscription, MotDePasseOublie, TypeDeCompte } from './pages/Auth.jsx'
import {
  DashShell, TableauDeBord, MonProfil, Portfolio, MesPublications, MesCreations, MesVideos,
  MesEvenements, MesOpportunites, MesCollaborations, Messages, Notifications, Statistiques,
  MonAbonnement, MonBoost, Parametres,
} from './pages/dash/User.jsx'
import { EspaceMarque, EspaceBoutique, Commandes, EspacePartenaire, EspaceSponsor } from './pages/dash/Pro.jsx'
import { AdminShell, AdminDashboard, AdminUtilisateurs, AdminContenus, AdminModeration, AdminFinances, AdminVerifications, AdminReferentiel } from './pages/dash/Admin.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* 1 — Site public */}
        <Route path="/" element={<Home />} />
        <Route path="/decouvrir" element={<Decouvrir />} />
        <Route path="/talents" element={<Talents />} />
        <Route path="/stylistes" element={<Stylistes />} />
        <Route path="/designers" element={<Designers />} />
        <Route path="/mannequins" element={<Mannequins />} />
        <Route path="/talent/:id" element={<TalentProfile />} />
        <Route path="/marques" element={<Marques />} />
        <Route path="/marque/:id" element={<BrandProfile />} />
        <Route path="/creations" element={<Creations />} />
        <Route path="/galerie" element={<Galerie />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/videos/:id" element={<VideoDetail />} />
        <Route path="/fil" element={<Fil />} />
        <Route path="/evenements" element={<Evenements />} />
        <Route path="/evenements/:id" element={<EvenementDetail />} />
        <Route path="/opportunites" element={<Opportunites />} />
        <Route path="/opportunites/:id" element={<OpportuniteDetail />} />
        <Route path="/annuaire" element={<Annuaire />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/produit/:id" element={<Produit />} />
        <Route path="/panier" element={<Panier />} />
        <Route path="/paiement" element={<Paiement />} />
        <Route path="/actualites" element={<Actualites />} />
        <Route path="/actualites/:id" element={<Article />} />
        <Route path="/partenaires" element={<Partenaires />} />
        <Route path="/sponsors" element={<Sponsors />} />
        <Route path="/abonnements" element={<Abonnements />} />
        <Route path="/horizon-boost" element={<HorizonBoost />} />
        <Route path="/recherche" element={<Recherche />} />
        <Route path="/favoris" element={<Favoris />} />
        <Route path="/a-propos" element={<APropos />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/contact" element={<Contact />} />

        {/* 2 — Authentification */}
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/type-de-compte" element={<TypeDeCompte />} />
        <Route path="/mot-de-passe-oublie" element={<MotDePasseOublie />} />

        {/* 3 — Espace utilisateur */}
        <Route path="/tableau-de-bord" element={<DashShell space="talent" />}>
          <Route index element={<TableauDeBord />} />
          <Route path="profil" element={<MonProfil />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="mes-publications" element={<MesPublications />} />
          <Route path="mes-creations" element={<MesCreations />} />
          <Route path="mes-videos" element={<MesVideos />} />
          <Route path="mes-evenements" element={<MesEvenements />} />
          <Route path="mes-opportunites" element={<MesOpportunites />} />
          <Route path="collaborations" element={<MesCollaborations />} />
          <Route path="messages" element={<Messages />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="statistiques" element={<Statistiques />} />
          <Route path="abonnement" element={<MonAbonnement />} />
          <Route path="boost" element={<MonBoost />} />
          <Route path="parametres" element={<Parametres />} />
        </Route>

        {/* 4 — Espaces professionnels */}
        <Route path="/espace-marque" element={<DashShell space="marque" />}>
          <Route index element={<EspaceMarque />} />
          <Route path="collections" element={<EspaceMarque tab="collections" />} />
          <Route path="produits" element={<EspaceMarque tab="produits" />} />
        </Route>
        <Route path="/espace-partenaire" element={<DashShell space="partenaire" />}>
          <Route index element={<EspacePartenaire />} />
          <Route path="opportunites" element={<EspacePartenaire tab="opportunites" />} />
          <Route path="evenements" element={<EspacePartenaire tab="evenements" />} />
          <Route path="talents" element={<EspacePartenaire tab="talents" />} />
        </Route>
        <Route path="/espace-sponsor" element={<DashShell space="sponsor" />}>
          <Route index element={<EspaceSponsor />} />
          <Route path="campagnes" element={<EspaceSponsor tab="campagnes" />} />
          <Route path="talents" element={<EspaceSponsor tab="talents" />} />
          <Route path="evenements" element={<EspaceSponsor tab="evenements" />} />
        </Route>
        <Route path="/boutique" element={<DashShell space="boutique" />}>
          <Route index element={<EspaceBoutique />} />
          <Route path="ajouter" element={<EspaceBoutique tab="ajouter" />} />
          <Route path="commandes" element={<Commandes />} />
          <Route path="stocks" element={<EspaceBoutique tab="stocks" />} />
          <Route path="promotions" element={<EspaceBoutique tab="promotions" />} />
          <Route path="statistiques" element={<EspaceBoutique tab="stats" />} />
          <Route path="livraison" element={<EspaceBoutique tab="livraison" />} />
        </Route>

        {/* 5 — Administration */}
        <Route path="/administration" element={<AdminShell />}>
          <Route index element={<AdminDashboard />} />
          <Route path="utilisateurs" element={<AdminUtilisateurs />} />
          <Route path="contenus" element={<AdminContenus />} />
          <Route path="moderation" element={<AdminModeration />} />
          <Route path="abonnements" element={<AdminFinances tab="abonnements" />} />
          <Route path="paiements" element={<AdminFinances tab="paiements" />} />
          <Route path="boost" element={<AdminFinances tab="boost" />} />
          <Route path="verifications" element={<AdminVerifications />} />
          <Route path="referentiel" element={<AdminReferentiel />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
