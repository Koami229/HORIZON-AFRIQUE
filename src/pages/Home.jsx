import { Link } from 'react-router-dom'
import {
  ArticleCard, Badge, Btn, CountryChip, CreationTile, EventCard, OpportunityRow, PartnerCard,
  ProductCard, SectionHead, SponsorCard, TalentCard, BrandCard, TestimonialCard, VideoCard, useApp,
} from '../components/ui.jsx'
import {
  IMG, TALENT_CATEGORIES, articles, brands, creations, currentUser, fcfa, events, opportunities,
  partners, plans, productList, shortNumber, sponsors, talents, testimonials, videos,
} from '../data.js'

const boutiques = [...new Set(productList.map((p) => p.seller))].map((s, i) => {
  const p = productList.find((x) => x.seller === s)
  return { name: s, country: p.country, flag: p.flag, products: 12 + i * 7, rating: (4 + (i % 10) / 10).toFixed(1), cover: p.image }
})

export default function Home() {
  const { notify } = useApp()
  const featuredTalents = [...talents].sort((a, b) => b.followers - a.followers).slice(0, 8)
  const featuredBrands = brands.slice(0, 6)
  const newCollections = brands.slice(0, 4).flatMap((b) => b.collections.slice(0, 1)).slice(0, 4)
  const popularCreations = [...creations].sort((a, b) => b.likes - a.likes).slice(0, 8)
  const upcoming = events.slice(0, 3)
  const jobs = opportunities.slice(0, 4)
  const popularProducts = [...productList].sort((a, b) => b.sold - a.sold).slice(0, 5)

  return (
    <>
      {/* ============ 1. BIENVENUE ============ */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div>
              <span className="hero-eyebrow">🌍 La plateforme des créateurs africains</span>
              <h1>L’Afrique crée.<br /><em>Horizon Afrique</em> révèle.</h1>
              <p className="hero-lead">
                Horizon Afrique rassemble les talents, les marques, les boutiques, les partenaires et les sponsors
                du continent. Un seul espace pour publier vos créations, vendre vos produits, trouver des
                collaborations et gagner en visibilité partout en Afrique.
              </p>
              <div className="hero-actions">
                <Btn to="/decouvrir" size="lg">Découvrir la plateforme</Btn>
                <Btn to="/inscription" variant="outline" size="lg">Créer mon profil</Btn>
                <Btn to="/connexion" variant="ghost" size="lg">Connexion</Btn>
              </div>
              <div className="hero-stats">
                <div className="hero-stat"><b>48 216</b><span>Professionnels inscrits</span></div>
                <div className="hero-stat"><b>12 407</b><span>Talents vérifiés</span></div>
                <div className="hero-stat"><b>20</b><span>Pays représentés</span></div>
                <div className="hero-stat"><b>9 842</b><span>Créations publiées</span></div>
              </div>
            </div>
            <div className="hero-collage">
              <img className="c1" src={IMG.hero} alt="Créateurs africains en studio" />
              <img className="c2" src={IMG.runway[0]} alt="Défilé" />
              <img className="c3" src={IMG.atelier[2]} alt="Atelier d’artisan" />
              <div className="hero-float glass">
                <div className="row gap-12">
                  <span className="logo-mark" style={{ width: 34, height: 34, borderRadius: 11, fontSize: 15 }}>H</span>
                  <div className="stack" style={{ lineHeight: 1.15 }}>
                    <b style={{ fontSize: 13 }}>Horizon Boost</b>
                    <span className="tiny muted">+340 % de vues en 24 h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-logo-cloud">
            <span className="upper muted-2">Ils nous font confiance</span>
            {['Bank of Africa', 'MTN', 'Ecobank', 'Orange Money', 'Institut Français', 'Air Sénégal'].map((n) => (
              <span key={n}>{n}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Catégories de talents */}
      <section className="container section-sm">
        <div className="grid grid-auto-sm">
          {TALENT_CATEGORIES.slice(0, 6).map((c) => (
            <Link key={c.slug} to={c.slug === 'mannequins' ? '/mannequins' : c.slug === 'designers' ? '/designers' : c.slug === 'stylistes' ? '/stylistes' : '/talents'} className="card card-pad">
              <div className="row gap-12 mb-8">
                <span style={{ fontSize: 22 }}>{c.icon}</span>
                <b style={{ fontFamily: 'var(--display)', fontSize: 15.5 }}>{c.name}</b>
              </div>
              <p className="tiny mb-8" style={{ minHeight: 32 }}>{c.desc}</p>
              <span className="tiny gold">{c.count} profils →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ Talents en vedette ============ */}
      <section className="container section">
        <SectionHead eyebrow="Talents en vedette" title="Les visages qui font bouger la création africaine"
          sub="Stylistes, designers, mannequins, photographes, artisans : découvrez les profils les plus suivis de la saison."
          action="/talents" />
        <div className="rail">
          {featuredTalents.map((t) => <TalentCard key={t.id} t={t} />)}
        </div>
      </section>

      {/* ============ Marques en vedette ============ */}
      <section className="container section">
        <SectionHead eyebrow="Marques en vedette" title="Des maisons qui écrivent le luxe africain"
          action="/marques" />
        <div className="grid grid-3">
          {featuredBrands.map((b) => <BrandCard key={b.id} b={b} />)}
        </div>
      </section>

      {/* ============ Nouvelles collections ============ */}
      <section className="container section">
        <SectionHead eyebrow="Nouvelles collections" title="Les dernières sorties des maisons"
          action="/marques" actionLabel="Toutes les marques" />
        <div className="grid grid-4">
          {newCollections.map((c, i) => (
            <Link key={i} to={`/marque/${brands[i].id}`} className="card">
              <div className="card-media card-media-tall">
                <img src={c.cover} alt={c.name} loading="lazy" />
                <div className="media-top"><Badge tone="gold">{c.season}</Badge></div>
                <div className="media-overlay">
                  <div>
                    <b style={{ fontSize: 14 }}>{c.name}</b>
                    <div className="tiny muted">{brands[i].name} · {c.pieces} pièces</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ Créations populaires ============ */}
      <section className="container section">
        <SectionHead eyebrow="Créations populaires" title="Ce que la communauté adore cette semaine"
          action="/galerie" actionLabel="Horizon Gallery" />
        <div className="grid grid-4">
          {popularCreations.map((c) => <CreationTile key={c.id} c={c} />)}
        </div>
      </section>

      {/* ============ Vidéos récentes ============ */}
      <section className="container section">
        <SectionHead eyebrow="Vidéos récentes" title="Défilés, backstage et interviews"
          action="/videos" actionLabel="Toutes les vidéos" />
        <div className="grid grid-3">
          {videos.slice(0, 3).map((v) => <VideoCard key={v.id} v={v} wide />)}
        </div>
      </section>

      {/* ============ Dernières actualités ============ */}
      <section className="container section">
        <SectionHead eyebrow="Dernières actualités" title="Le média de la création africaine"
          sub="Analyses, interviews, tendances et success stories de l’écosystème créatif du continent."
          action="/actualites" actionLabel="Toute la rubrique" />
        <div className="split">
          <div className="stack gap-24">
            <ArticleCard a={articles[0]} horizontal />
            <div className="grid grid-2">
              {articles.slice(1, 3).map((a) => <ArticleCard key={a.id} a={a} />)}
            </div>
          </div>
          <aside className="stack gap-16">
            <h2 className="mb-0 h-sub">Les plus lus</h2>
            {articles.slice(3, 7).map((a, i) => (
              <Link key={a.id} to={`/actualites/${a.id}`} className="row gap-12">
                <b className="muted-2" style={{ fontFamily: 'var(--display)', fontSize: 20, width: 20 }}>{i + 1}</b>
                <div className="stack">
                  <b style={{ fontSize: 13.5, lineHeight: 1.35 }}>{a.title}</b>
                  <span className="tiny muted-2">{a.category} · {a.readTime} min</span>
                </div>
              </Link>
            ))}
            <div className="panel panel-tight mt-8">
              <b style={{ fontSize: 13 }}>Newsletter Horizon</b>
              <p className="tiny mb-8 mt-8">La sélection de la rédaction, chaque vendredi.</p>
              <Btn variant="outline" size="xs" className="btn-block" onClick={() => notify('Inscription à la newsletter confirmée ✉️')}>Je m’abonne</Btn>
            </div>
          </aside>
        </div>
      </section>

      {/* ============ Événements à venir ============ */}
      <section className="container section">
        <SectionHead eyebrow="Événements à venir" title="Fashion Weeks, défilés, castings et salons"
          action="/evenements" actionLabel="Agenda complet" />
        <div className="grid grid-3">
          {upcoming.map((e) => <EventCard key={e.id} e={e} />)}
        </div>
      </section>

      {/* ============ Opportunités professionnelles ============ */}
      <section className="container section">
        <div className="split">
          <div>
            <SectionHead eyebrow="Opportunités professionnelles" title="Offres, castings et appels à projets"
              sub="Des centaines d’opportunités publiées chaque semaine par les marques, institutions et agences du continent."
              action="/opportunites" />
            <div className="stack gap-12">
              {jobs.map((o) => <OpportunityRow key={o.id} o={o} />)}
            </div>
          </div>
          <aside className="panel">
            <h2 className="h-sub">Créez votre alerte</h2>
            <p className="small">Recevez par email les opportunités correspondant à votre profil et à votre pays.</p>
            <div className="stack gap-12 mt-16">
              <input className="input" placeholder="Votre adresse email" defaultValue={currentUser.email} />
              <select className="select" aria-label="Catégorie d’intérêt" defaultValue="Mode"><option>Mode</option><option>Art</option><option>Artisanat</option><option>Design</option><option>Photographie</option></select>
              <Btn onClick={() => notify('Alerte créée : vous recevrez les opportunités par email ✅')}>Créer mon alerte</Btn>
            </div>
            <div className="divider" />
            <div className="stack gap-12">
              <div className="between small"><span className="muted">Offres actives</span><b>418</b></div>
              <div className="between small"><span className="muted">Castings en cours</span><b>126</b></div>
              <div className="between small"><span className="muted">Collaborations publiées</span><b>312</b></div>
            </div>
          </aside>
        </div>
      </section>

      {/* ============ Produits populaires ============ */}
      <section className="container section">
        <SectionHead eyebrow="Produits populaires" title="La marketplace Horizon Afrique"
          sub="Achetez directement auprès des créateurs et des marques. Paiement mobile money ou carte bancaire."
          action="/marketplace" actionLabel="Toute la marketplace" />
        <div className="grid grid-5">
          {popularProducts.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* ============ Boutiques recommandées ============ */}
      <section className="container section">
        <SectionHead eyebrow="Boutiques recommandées" title="Vendeurs vérifiés et livraison fiable" action="/annuaire" actionLabel="Annuaire complet" />
        <div className="grid grid-4">
          {boutiques.slice(0, 4).map((b) => (
            <article key={b.name} className="card card-pad">
              <div className="row gap-12 mb-16">
                <img src={b.cover} alt="" className="avatar avatar-md avatar-sq" />
                <div className="stack">
                  <b>{b.name} Store</b>
                  <span className="tiny muted">{b.flag} {b.country}</span>
                </div>
              </div>
              <div className="between small muted">
                <span>📦 {b.products} produits</span><span>⭐ {b.rating}</span>
              </div>
              <div className="divider" />
              <Btn to="/marketplace" variant="outline" size="xs" className="btn-block">Voir la boutique</Btn>
            </article>
          ))}
        </div>
      </section>

      {/* ============ Pays mis en avant ============ */}
      <section className="container section">
        <SectionHead eyebrow="Pays mis en avant" title="20 pays, une seule scène créative" action="/annuaire" actionLabel="Explorer par pays" />
        <div className="pill-row">
          {['Bénin', 'Sénégal', 'Nigeria', 'Ghana', "Côte d'Ivoire", 'Mali', 'Burkina Faso', 'Togo', 'Cameroun', 'RD Congo', 'Kenya', 'Afrique du Sud', 'Rwanda', 'Maroc', 'Tunisie', 'Éthiopie', 'Gabon', 'Guinée', 'Niger', 'Madagascar'].map((c) => (
            <CountryChip key={c} name={c} />
          ))}
        </div>
      </section>

      {/* ============ Partenaires & sponsors ============ */}
      <section className="container section">
        <SectionHead eyebrow="Partenaires" title="Institutions, écoles, médias et incubateurs" action="/partenaires" />
        <div className="grid grid-4">
          {partners.slice(0, 4).map((p) => <PartnerCard key={p.id} p={p} />)}
        </div>
      </section>

      <section className="container section">
        <SectionHead eyebrow="Sponsors" title="Ils financent la nouvelle génération" action="/sponsors" />
        <div className="grid grid-4">
          {sponsors.slice(0, 4).map((s) => <SponsorCard key={s.id} s={s} />)}
        </div>
      </section>

      {/* ============ Testimonials ============ */}
      <section className="container section">
        <SectionHead eyebrow="Témoignages" title="Ils ont grandi avec Horizon Afrique" />
        <div className="grid grid-4">
          {testimonials.map((t) => <TestimonialCard key={t.id} t={t} />)}
        </div>
      </section>

      {/* ============ Abonnements ============ */}
      <section className="container section">
        <SectionHead eyebrow="Abonnements" title="Choisissez la formule adaptée à votre activité"
          sub="Horizon Free est gratuit pour toujours. Passez à Starter, Pro ou Premium pour vendre, analyser et dominer votre marché." action="/abonnements" />
        <div className="grid grid-4">
          {plans.map((p) => (
            <div key={p.name} className={`price-card ${p.name === 'Horizon Starter' ? 'featured' : ''}`}>
              {p.badge && <div style={{ position: 'absolute', top: 18, right: 18 }}><Badge tone="gold">{p.badge}</Badge></div>}
              <span className="upper muted-2">{p.tagline}</span>
              <h2 className="mt-8 h-sub">{p.name}</h2>
              <div className="amount">{p.price === 0 ? 'Gratuit' : fcfa(p.price)}</div>
              <span className="tiny muted">{p.price === 0 ? 'pour toujours' : 'par mois'}</span>
              <ul>{p.features.slice(0, 5).map((f) => <li key={f}>{f}</li>)}</ul>
              <Btn to="/abonnements" variant={p.name === 'Horizon Starter' ? 'primary' : 'outline'} className="btn-block">Choisir cette formule</Btn>
            </div>
          ))}
        </div>
      </section>

      {/* ============ Horizon Boost ============ */}
      <section className="container section">
        <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="split-2" style={{ gap: 0, alignItems: 'stretch' }}>
            <div style={{ padding: 40 }}>
              <span className="upper gold">Horizon Boost</span>
              <h2 className="mt-8">Augmentez votre visibilité dès 1 000 FCFA</h2>
              <p>
                Mettez en avant votre profil, une publication, un produit, une collection, une vidéo, un événement
                ou une opportunité. Votre contenu apparaît en tête des recommandations pendant 24 heures.
              </p>
              <div className="grid grid-3 mt-24" style={{ gap: 14 }}>
                {[['24 h', 'Durée standard'], ['x8', 'Vues moyennes'], ['1 000 FCFA', 'Prix de départ']].map(([a, b]) => (
                  <div key={a} className="kpi"><b>{a}</b><span>{b}</span></div>
                ))}
              </div>
              <div className="row gap-12 mt-24">
                <Btn to="/horizon-boost">Booster mon contenu</Btn>
                <Btn to="/abonnements" variant="outline">Voir les abonnements</Btn>
              </div>
            </div>
            <div style={{ position: 'relative', minHeight: 320 }}>
              <img src={IMG.marketplaceStory} alt="Artisan au travail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="container section">
        <div className="panel center-text" style={{ padding: 52, background: 'linear-gradient(135deg, rgba(227,176,75,0.12), rgba(196,85,46,0.12), rgba(74,95,168,0.12))' }}>
          <span className="upper gold">Rejoignez le mouvement</span>
          <h2 className="mt-8" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.8rem)' }}>Votre talent mérite un horizon plus large.</h2>
          <p style={{ maxWidth: '60ch', margin: '0 auto 26px' }}>
            Créez votre profil gratuitement, publiez vos créations et connectez-vous à des milliers de professionnels,
            marques et institutions à travers l’Afrique.
          </p>
          <div className="row gap-12 center wrap">
            <Btn to="/inscription" size="lg">Créer mon profil gratuitement</Btn>
            <Btn to="/abonnements" variant="outline" size="lg">Comparer les formules</Btn>
          </div>
        </div>
      </section>
    </>
  )
}
