import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArticleCard, Avatar, Badge, Btn, Chip, Crumbs, EmptyState, FilterBar, PartnerCard, SectionHead,
  SponsorCard, Tabs, useApp, useFilterState,
} from '../components/ui.jsx'
import { IMG, NEWS_CATEGORIES, articles, brands, fcfa, fmtDate, fmtShort, partners, sponsors, talents } from '../data.js'

/* =====================================================================
   26. PAGE ACTUALITÉS
   ===================================================================== */
export function Actualites() {
  const [cat, setCat] = useState('Toutes')
  const filters = useMemo(() => [
    { key: 'author', label: 'Auteur', options: [...new Set(articles.map((a) => a.author))], get: (a) => a.author },
    { key: 'read', label: 'Temps de lecture', options: ['Court (< 6 min)', 'Long (≥ 6 min)'], get: (a) => (a.readTime < 6 ? 'Court (< 6 min)' : 'Long (≥ 6 min)') },
  ], [])
  const { state, setState, result } = useFilterState(filters, articles)
  const list = cat === 'Toutes' ? result : result.filter((a) => a.category === cat)
  const [hero, ...rest] = list

  return (
    <div className="container">
      <Crumbs items={[{ label: 'Actualités' }]} />
      <div className="page-head">
        <h1>Actualités</h1>
        <p>Le média de la création africaine : mode, art, artisanat, design, interviews, tendances, success stories et événements.</p>
      </div>

      <div className="pill-row mb-16">
        {['Toutes', ...NEWS_CATEGORIES].map((c) => <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>)}
      </div>

      <FilterBar filters={filters} state={state} setState={setState} count={list.length} />

      {hero && (
        <div className="split mb-32">
          <Link to={`/actualites/${hero.id}`} className="card">
            <div className="card-media card-media-wide">
              <img src={hero.image} alt={hero.title} />
              <div className="media-top"><Badge tone="terra">À la une</Badge><Badge tone="indigo">{hero.category}</Badge></div>
            </div>
            <div className="card-pad">
              <h2 style={{ fontSize: 'clamp(1.3rem, 2.2vw, 1.8rem)' }}>{hero.title}</h2>
              <p>{hero.excerpt}</p>
              <div className="row gap-12 small muted-2">
                <span>✍️ {hero.author}</span><span>📅 {fmtShort(hero.date)}</span><span>⏱ {hero.readTime} min</span>
              </div>
            </div>
          </Link>
          <aside className="stack gap-16">
            <h3 className="mb-0">Les plus lus</h3>
            {articles.slice(0, 4).map((a, i) => (
              <Link key={a.id} to={`/actualites/${a.id}`} className="row gap-12">
                <b className="muted-2" style={{ fontFamily: 'var(--display)', fontSize: 20, width: 20 }}>{i + 1}</b>
                <div className="stack">
                  <b style={{ fontSize: 13.5, lineHeight: 1.35 }}>{a.title}</b>
                  <span className="tiny muted-2">{a.category} · {fmtShort(a.date)}</span>
                </div>
              </Link>
            ))}
          </aside>
        </div>
      )}

      <div className="grid grid-3">
        {rest.map((a) => <ArticleCard key={a.id} a={a} />)}
      </div>
      {list.length === 0 && <EmptyState title="Aucun article" sub="Aucun article dans cette catégorie pour l’instant." />}

      <section className="section">
        <SectionHead eyebrow="Newsletter" title="Recevez la sélection Horizon chaque semaine" />
        <div className="panel row gap-16 wrap">
          <input className="input" style={{ maxWidth: 380 }} placeholder="Votre adresse email" defaultValue="aicha.kora@horizonafrique.com" />
          <Btn>Je m’abonne</Btn>
          <span className="small muted">Un email par semaine. Désinscription en un clic.</span>
        </div>
      </section>
    </div>
  )
}

/* =====================================================================
   27. PAGE D'UN ARTICLE
   ===================================================================== */
export function Article() {
  const { id } = useParams()
  const a = articles.find((x) => x.id === id) || articles[0]
  const { notify, saves, toggleSave } = useApp()
  const [comment, setComment] = useState('')
  const similar = articles.filter((x) => x.id !== a.id).slice(0, 3)

  return (
    <div className="container">
      <Crumbs items={[{ label: 'Actualités', to: '/actualites' }, { label: a.category }, { label: a.title.slice(0, 32) + '…' }]} />

      <article style={{ maxWidth: 880, margin: '0 auto' }}>
        <Badge tone="indigo">{a.category}</Badge>
        <h1 className="mt-16" style={{ fontSize: 'clamp(1.7rem, 3.2vw, 2.6rem)' }}>{a.title}</h1>
        <div className="row gap-16 wrap muted small mb-24">
          <span className="row gap-8"><Avatar src={IMG.people[7]} size="xs" /> {a.author}</span>
          <span>📅 {fmtDate(a.date)}</span>
          <span>⏱ {a.readTime} min de lecture</span>
          <span>👁 {a.views} vues</span>
        </div>

        <img src={a.image} alt={a.title} style={{ width: '100%', borderRadius: 'var(--radius-lg)', maxHeight: 460, objectFit: 'cover' }} />

        <div className="row gap-8 mt-16 mb-24">
          <button className="like-btn">♥ 1 284</button>
          <button className="like-btn" onClick={() => notify('Lien de l’article copié 🔗')}>↗ Partager</button>
          <button className="like-btn" onClick={() => toggleSave(a.id)}>{saves.has(a.id) ? '★ Enregistré' : '☆ Enregistrer'}</button>
        </div>

        <p style={{ fontSize: 16.5, color: '#e6e3ec' }}>{a.excerpt}</p>
        {a.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}

        <div className="grid grid-2 my-24" style={{ margin: '24px 0' }}>
          <img src={IMG.atelier[1]} alt="" className="ratio-16" loading="lazy" />
          <img src={IMG.garment[4]} alt="" className="ratio-16" loading="lazy" />
        </div>

        <blockquote className="panel" style={{ borderLeft: '3px solid var(--gold)', fontStyle: 'italic', fontSize: 16 }}>
          « La création africaine n’a plus besoin d’être traduite : elle est comprise dans le monde entier. »
        </blockquote>

        <h3 className="mt-32">Commentaires ({12})</h3>
        <div className="stack gap-12">
          {[['Koffi Mensah', 'Article très complet, merci pour cette analyse.'], ['Awa Sossou', 'Exactement le sujet qu’il fallait traiter.']].map(([n, t]) => (
            <div key={n} className="list-row">
              <Avatar src={IMG.people[8]} size="sm" />
              <div className="stack"><b style={{ fontSize: 13 }}>{n}</b><span className="small muted">{t}</span></div>
            </div>
          ))}
        </div>
        <div className="row gap-12 mt-16">
          <input className="input" placeholder="Laisser un commentaire…" value={comment} onChange={(e) => setComment(e.target.value)} />
          <Btn onClick={() => { setComment(''); notify('Commentaire publié 💬') }}>Commenter</Btn>
        </div>
      </article>

      <section className="section">
        <SectionHead eyebrow="Articles similaires" title="À lire ensuite" action="/actualites" />
        <div className="grid grid-3">{similar.map((s) => <ArticleCard key={s.id} a={s} />)}</div>
      </section>
    </div>
  )
}

/* =====================================================================
   28. PAGE PARTENAIRES
   ===================================================================== */
export function Partenaires() {
  const [domain, setDomain] = useState('Tous')
  const domains = [...new Set(partners.map((p) => p.domain))]
  const list = domain === 'Tous' ? partners : partners.filter((p) => p.domain === domain)

  return (
    <div className="container">
      <Crumbs items={[{ label: 'Partenaires' }]} />
      <div className="page-head">
        <h1>Partenaires</h1>
        <p>Institutions, écoles, incubateurs, médias et agences qui accompagnent les talents et les marques de la plateforme.</p>
      </div>

      <div className="pill-row mb-24">
        {['Tous', ...domains].map((d) => <Chip key={d} active={domain === d} onClick={() => setDomain(d)}>{d}</Chip>)}
      </div>

      <div className="grid grid-4">
        {list.map((p) => <PartnerCard key={p.id} p={p} />)}
      </div>

      <section className="section">
        <SectionHead eyebrow="Devenir partenaire" title="Rejoignez le programme Horizon Afrique" />
        <div className="panel" style={{ padding: 34 }}>
          <div className="grid grid-3">
            {[
              ['Institutions publiques', 'Soutenez la structuration des filières créatives nationales et l’accès des talents aux marchés.'],
              ['Écoles & universités', 'Offrez à vos étudiants un portfolio professionnel et un accès direct aux opportunités.'],
              ['Marques & agences', 'Accédez à un vivier de talents vérifiés et lancez vos campagnes en quelques clics.'],
            ].map(([t, d]) => (
              <div key={t}>
                <h3>{t}</h3>
                <p className="small">{d}</p>
              </div>
            ))}
          </div>
          <div className="row gap-12 mt-16">
            <Btn to="/contact">Devenir partenaire</Btn>
            <Btn to="/espace-partenaire" variant="outline">Découvrir l’espace partenaire</Btn>
          </div>
        </div>
      </section>
    </div>
  )
}

/* =====================================================================
   29. PAGE SPONSORS
   ===================================================================== */
export function Sponsors() {
  const [tab, setTab] = useState('Sponsors principaux')
  const tabs = ['Sponsors principaux', 'Sponsors d’événements', 'Sponsors de projets', 'Campagnes sponsorisées']
  const map = {
    'Sponsors principaux': sponsors.filter((s) => s.type.includes('principal')),
    'Sponsors d’événements': sponsors.filter((s) => s.type.includes('événements')),
    'Sponsors de projets': sponsors.filter((s) => s.type.includes('projets') || s.type.includes('culturel')),
  }
  const list = map[tab] || []
  const totalFunding = sponsors.reduce((n, s) => n + s.amount, 0)

  return (
    <div className="container">
      <Crumbs items={[{ label: 'Sponsors' }]} />
      <div className="page-head">
        <h1>Sponsors</h1>
        <p>Les entreprises qui financent les talents, les événements et les projets de la création africaine.</p>
      </div>

      <div className="grid grid-4 mb-24">
        {[['Contribution totale 2026', fcfa(totalFunding)], ['Sponsors actifs', sponsors.length], ['Talents soutenus', sponsors.reduce((n, s) => n + s.talents, 0)], ['Campagnes en cours', sponsors.reduce((n, s) => n + s.campaigns, 0)]].map(([a, b]) => (
          <div key={a} className="kpi"><b>{b}</b><span>{a}</span></div>
        ))}
      </div>

      <Tabs tabs={tabs} value={tab} onChange={setTab} />

      <div className="section-sm">
        {tab !== 'Campagnes sponsorisées' ? (
          <div className="grid grid-3">
            {(list.length ? list : sponsors).map((s) => <SponsorCard key={s.id} s={s} />)}
          </div>
        ) : (
          <div className="grid grid-2">
            {[
              ['Campagne « Boost Jeunes Créateurs »', 'Orange Money', '100 bourses Horizon Boost offertes à de jeunes créateurs de 8 pays.', 68],
              ['Programme « Écoles & Talents »', 'Ecobank', 'Financement de 24 ateliers de formation dans 6 capitales africaines.', 45],
              ['Fashion Week Connect', 'Bank of Africa', 'Sponsoring des défilés et des prix de création de 5 Fashion Weeks.', 82],
              ['Artisanat Export', 'Bénin Terminal', 'Logistique offerte pour l’export de 1 200 pièces artisanales.', 30],
            ].map(([title, brand, desc, progress]) => (
              <div key={title} className="panel">
                <div className="between mb-8"><b>{title}</b><Badge tone="gold">{brand}</Badge></div>
                <p className="small">{desc}</p>
                <div className="meter"><i style={{ width: `${progress}%` }} /></div>
                <div className="between tiny muted-2 mt-8"><span>Avancement</span><span>{progress}%</span></div>
              </div>
            ))}
          </div>
        )}
      </div>

      <section className="section">
        <SectionHead eyebrow="Talents soutenus" title="Les créateurs accompagnés par nos sponsors" action="/talents" />
        <div className="grid grid-4">
          {talents.slice(0, 4).map((t) => (
            <Link key={t.id} to={`/talent/${t.id}`} className="panel panel-tight row gap-12">
              <Avatar src={t.avatar} size="md" />
              <div className="stack"><b style={{ fontSize: 13.5 }}>{t.name}</b><span className="tiny muted">{t.job} · {t.flag} {t.country}</span></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="panel center-text" style={{ padding: 40, background: 'linear-gradient(135deg, rgba(74,95,168,0.16), rgba(227,176,75,0.12))' }}>
          <h2>Devenir sponsor Horizon Afrique</h2>
          <p style={{ maxWidth: '62ch', margin: '0 auto 20px' }}>
            Associez votre marque à la nouvelle génération créative africaine : visibilité sur les événements,
            campagnes ciblées, soutien de talents et reporting détaillé.
          </p>
          <div className="row gap-12 center wrap">
            <Btn to="/contact">Devenir sponsor</Btn>
            <Btn to="/espace-sponsor" variant="outline">Découvrir l’espace sponsor</Btn>
          </div>
        </div>
      </section>
    </div>
  )
}

/* =====================================================================
   49. PAGE À PROPOS (+ mentions légales)
   ===================================================================== */
export function APropos() {
  const team = [
    ['Awa Sossou', 'Directrice générale', IMG.people[0]],
    ['Sylvain Hodonou', 'Directeur produit', IMG.people[3]],
    ['Naomi Wanjiru', 'Responsable partenariats', IMG.people[4]],
    ['Kwesi Ampofo', 'Modération & conformité', IMG.people[5]],
    ['Rasoa Naina', 'Artisanat & filières', IMG.people[8]],
    ['Hosni Ben Amor', 'Développement international', IMG.people[10]],
  ]

  return (
    <div className="container">
      <Crumbs items={[{ label: 'À propos' }]} />
      <div className="page-head">
        <h1>À propos de Horizon Afrique</h1>
        <p style={{ maxWidth: '76ch' }}>
          Horizon Afrique est la plateforme professionnelle de la création africaine. Elle rassemble en un même lieu
          les talents, les marques, les boutiques, les partenaires et les sponsors, et donne à chaque profil les outils
          pour publier, vendre, collaborer et gagner en visibilité.
        </p>
      </div>

      <section className="split-2 section-sm">
        <img src={IMG.hero} alt="Créateurs" style={{ width: '100%', borderRadius: 'var(--radius-lg)', objectFit: 'cover', aspectRatio: '16/11' }} />
        <div className="stack gap-16">
          <div className="panel">
            <span className="upper gold">Vision</span>
            <h3 className="mt-8">Faire de l’Afrique la première scène créative mondiale</h3>
            <p className="mb-0">Nous croyons qu’un styliste de Cotonou, une artisane de Ségou ou un mannequin de Kigali doit pouvoir atteindre le même public qu’une maison européenne.</p>
          </div>
          <div className="panel">
            <span className="upper gold">Mission</span>
            <h3 className="mt-8">Donner des outils professionnels à chaque créateur</h3>
            <p className="mb-0">Portfolio, vitrine, boutique, paiements mobile money, statistiques, opportunités et collaborations : tout au même endroit.</p>
          </div>
        </div>
      </section>

      <section className="section-sm">
        <SectionHead eyebrow="Objectifs" title="Ce que nous construisons en 2026" />
        <div className="grid grid-4">
          {[
            ['50 000 profils vérifiés', 'Talents et marques dans 25 pays africains.'],
            ['10 000 transactions / mois', 'Marketplace avec paiement mobile money intégré.'],
            ['200 événements partenaires', 'Fashion weeks, salons, castings et expositions.'],
            ['5 000 jeunes formés', 'Ateliers de professionnalisation avec nos partenaires.'],
          ].map(([t, d]) => (
            <div key={t} className="kpi">
              <b style={{ fontSize: 18 }}>{t}</b>
              <span>{d}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-sm">
        <SectionHead eyebrow="Valeurs" title="Nos principes de travail" />
        <div className="grid grid-5">
          {[
            ['🌍', 'Panafricanisme', 'Une plateforme pensée depuis le continent, pour le continent.'],
            ['🤝', 'Équité', 'Rémunération juste des artisans et transparence des collaborations.'],
            ['🌱', 'Durabilité', 'Matières naturelles, séries courtes, production locale.'],
            ['🔍', 'Confiance', 'Vérification des profils, avis authentiques, modération active.'],
            ['🚀', 'Excellence', 'Des outils professionnels au niveau des meilleures plateformes mondiales.'],
          ].map(([ico, t, d]) => (
            <div key={t} className="panel">
              <div style={{ fontSize: 24 }}>{ico}</div>
              <b style={{ display: 'block', marginTop: 8 }}>{t}</b>
              <p className="small mb-0 mt-8">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-sm">
        <SectionHead eyebrow="Équipe" title="Les femmes et les hommes derrière Horizon Afrique" />
        <div className="grid grid-3">
          {team.map(([name, role, photo]) => (
            <div key={name} className="panel row gap-16">
              <Avatar src={photo} size="lg" />
              <div className="stack">
                <b>{name}</b>
                <span className="small muted">{role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mentions légales */}
      <section className="section" id="conditions">
        <Tabs tabs={['Conditions d’utilisation', 'Politique de confidentialité', 'Règles de la communauté']} value="Conditions d’utilisation" onChange={() => {}} />
        <div className="panel mt-16">
          <h3>Conditions d’utilisation</h3>
          <p className="small">
            L’utilisation de Horizon Afrique implique l’acceptation des présentes conditions. Les contenus publiés
            restent la propriété de leurs auteurs ; l’utilisateur garantit détenir les droits sur les images, vidéos et
            textes qu’il publie. Les abonnements sont mensuels, sans engagement, résiliables à tout moment.
          </p>
          <h3 className="mt-24" id="confidentialite">Politique de confidentialité</h3>
          <p className="small">
            Nous collectons uniquement les données nécessaires au fonctionnement du service : identité, coordonnées,
            informations professionnelles et données de transaction. Aucune donnée n’est revendue. Vous pouvez
            exporter ou supprimer vos données depuis les paramètres de votre compte.
          </p>
          <h3 className="mt-24" id="communaute">Règles de la communauté</h3>
          <p className="small">
            Sont interdits : les contenus haineux, le harcèlement, la contrefaçon, la publicité trompeuse et l’usurpation
            d’identité. Les signalements sont traités sous 48 h par l’équipe de modération, qui peut retirer un contenu,
            suspendre un compte ou bloquer un utilisateur.
          </p>
        </div>
      </section>
    </div>
  )
}

export function Legal() {
  return <APropos />
}

/* =====================================================================
   50. PAGE CONTACT
 ===================================================================== */
export function Contact() {
  const { notify } = useApp()
  const [sent, setSent] = useState(false)

  return (
    <div className="container">
      <Crumbs items={[{ label: 'Contact' }]} />
      <div className="page-head">
        <h1>Contact</h1>
        <p>Une question, une demande de partenariat, un problème technique ? Notre équipe répond en moins de 24 h.</p>
      </div>

      <div className="split">
        <div className="panel">
          {sent ? (
            <div className="center-text" style={{ padding: 30 }}>
              <div style={{ fontSize: 40 }}>✉️</div>
              <h3>Message envoyé</h3>
              <p className="small">Merci ! Notre équipe vous répondra à l’adresse indiquée dans les plus brefs délais.</p>
              <Btn variant="outline" onClick={() => setSent(false)}>Envoyer un autre message</Btn>
            </div>
          ) : (
            <>
              <h3>Formulaire de contact</h3>
              <div className="form-grid">
                <div className="field"><label>Nom complet</label><input className="input" defaultValue="Aïcha Kora" /></div>
                <div className="field"><label>Email</label><input className="input" defaultValue="aicha.kora@horizonafrique.com" /></div>
              </div>
              <div className="form-grid">
                <div className="field"><label>Pays</label><input className="input" defaultValue="Bénin" /></div>
                <div className="field"><label>Téléphone</label><input className="input" defaultValue="+229 96 45 12 88" /></div>
              </div>
              <div className="field"><label>Objet</label>
                <select className="select">
                  <option>Demande d’information générale</option>
                  <option>Support technique</option>
                  <option>Partenariat</option>
                  <option>Sponsoring</option>
                  <option>Presse</option>
                  <option>Signaler un contenu</option>
                </select>
              </div>
              <div className="field"><label>Message</label><textarea className="textarea" placeholder="Décrivez votre demande…" /></div>
              <label className="checkbox mb-16"><input type="checkbox" defaultChecked /> <span>J’accepte que mes données soient utilisées pour traiter ma demande.</span></label>
              <Btn size="lg" onClick={() => { setSent(true); notify('Message envoyé à l’équipe Horizon Afrique ✅') }}>Envoyer le message</Btn>
            </>
          )}
        </div>

        <aside className="stack gap-16">
          <div className="panel">
            <h3>Nous joindre directement</h3>
            <div className="stack gap-12 small">
              <div className="row gap-12"><span className="ico">✉️</span><div className="stack"><b>Email</b><span className="muted">contact@horizonafrique.com</span></div></div>
              <div className="row gap-12"><span className="ico">📞</span><div className="stack"><b>Téléphone</b><span className="muted">+229 21 30 44 12</span></div></div>
              <div className="row gap-12"><span className="ico">💬</span><div className="stack"><b>WhatsApp Business</b><span className="muted">+229 96 45 12 88</span></div></div>
              <div className="row gap-12"><span className="ico">📍</span><div className="stack"><b>Adresse</b><span className="muted">Immeuble Horizon, quartier Ganhi, Cotonou — Bénin</span></div></div>
            </div>
            <div className="divider" />
            <h4>Réseaux sociaux</h4>
            <div className="socials">
              {['Fb', 'Ig', 'Tk', 'In', 'Yt'].map((s) => <a key={s} className="social" href="#">{s}</a>)}
            </div>
          </div>

          <div className="panel">
            <h3>Assistance</h3>
            <div className="stack gap-12 small">
              {[['Centre d’aide', 'Guides d’utilisation et FAQ'], ['Support abonnés', 'Assistance prioritaire 7j/7'], ['Support boutique', 'Commandes, paiements et livraisons']].map(([t, d]) => (
                <div key={t} className="between">
                  <div className="stack"><b>{t}</b><span className="muted tiny">{d}</span></div>
                  <span className="link-arrow">Ouvrir →</span>
                </div>
              ))}
            </div>
          </div>

          <div className="map-mock">
            <span className="map-pin" style={{ left: '46%', top: '52%' }}>📍</span>
            <div className="panel panel-tight" style={{ position: 'absolute', bottom: 14, left: 14, maxWidth: 220 }}>
              <b style={{ fontSize: 13 }}>Horizon Afrique</b>
              <div className="tiny muted">Ganhi, Cotonou — Bénin</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
