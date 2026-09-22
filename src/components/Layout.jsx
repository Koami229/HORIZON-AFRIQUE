import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Btn, Avatar, Badge, useApp } from './ui.jsx'
import {
  articles, brands, creations, currentUser, events, opportunities, partners, productList,
  shortNumber, sponsors, talents, videos, conversations, notifications, IMG,
} from '../data.js'

/* ------------------------------ En-tête ------------------------------- */
const primaryNav = [
  ['/', 'Accueil'],
  ['/decouvrir', 'Découvrir'],
  ['/talents', 'Talents'],
  ['/marques', 'Marques'],
  ['/creations', 'Créations'],
  ['/galerie', 'Galerie'],
  ['/videos', 'Vidéos'],
  ['/evenements', 'Événements'],
  ['/opportunites', 'Opportunités'],
  ['/marketplace', 'Marketplace'],
]

const moreNav = [
  ['/actualites', 'Actualités', '📰'],
  ['/partenaires', 'Partenaires', '🤝'],
  ['/sponsors', 'Sponsors', '💎'],
  ['/annuaire', 'Horizon Directory', '📇'],
  ['/fil', 'Fil d’actualité', '🧵'],
  ['/favoris', 'Mes favoris', '★'],
  ['/abonnements', 'Abonnements', '⭐'],
  ['/horizon-boost', 'Horizon Boost', '🚀'],
  ['/a-propos', 'À propos', '🌍'],
  ['/contact', 'Contact', '✉️'],
]

function Header({ onSearch }) {
  const [more, setMore] = useState(false)
  const [openMenu, setOpenMenu] = useState(null)
  const { notifCount, setNotifCount, cart } = useApp()
  const loc = useLocation()
  useEffect(() => { setMore(false); setOpenMenu(null) }, [loc.pathname])

  const toggle = (m) => setOpenMenu((o) => (o === m ? null : m))

  return (
    <>
      <div className="top-strip">
        🌍 Horizon Boost : mettez votre profil en avant 24 h pour 1 000 FCFA — Offre de lancement : 1 Boost offert avec Horizon Starter
      </div>
      <header className="header">
        <div className="container-wide header-inner">
          <Link to="/" className="logo">
            <span className="logo-mark">H</span>
            <span className="logo-text"><b>Horizon Afrique</b><span>Créateurs d’Afrique</span></span>
          </Link>

          <nav className="nav">
            {primaryNav.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>{label}</NavLink>
            ))}
            <div className="nav-more dropdown">
              <button className="nav-link" onClick={() => toggle('more')}>Plus ▾</button>
              {openMenu === 'more' && (
                <div className="nav-more-panel">
                  {moreNav.map(([to, label, ico]) => (
                    <Link key={to} to={to} className="nav-more-item"><span>{ico}</span>{label}</Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="header-actions">
            <button className="icon-btn burger" title="Menu" onClick={() => toggle('burger')}>☰</button>
            <button className="icon-btn" title="Rechercher" onClick={onSearch}>🔍</button>

            <div className="dropdown">
              <button className="icon-btn" title="Notifications" onClick={() => { toggle('notif'); setNotifCount(0) }}>
                🔔 {notifCount > 0 && <span className="dot-badge">{notifCount}</span>}
              </button>
              {openMenu === 'notif' && (
                <div className="dropdown-panel" style={{ minWidth: 340 }}>
                  <div className="dropdown-head between"><b>Notifications</b><Badge tone="gold">{notifications.length}</Badge></div>
                  <div className="divider" style={{ margin: '6px 0' }} />
                  {notifications.slice(0, 6).map((n) => (
                    <Link key={n.id} to="/tableau-de-bord/notifications" className="dropdown-item">
                      <Avatar src={IMG.people[3]} size="xs" />
                      <span className="stack">
                        <b style={{ fontSize: 12.5 }}>{n.title}</b>
                        <span className="tiny muted" style={{ whiteSpace: 'normal' }}>{n.text}</span>
                      </span>
                    </Link>
                  ))}
                  <div className="divider" style={{ margin: '6px 0' }} />
                  <Link to="/tableau-de-bord/notifications" className="dropdown-item gold">Tout voir →</Link>
                </div>
              )}
            </div>

            <div className="dropdown">
              <button className="icon-btn" title="Messages" onClick={() => toggle('msg')}>
                ✉️ <span className="dot-badge">3</span>
              </button>
              {openMenu === 'msg' && (
                <div className="dropdown-panel" style={{ minWidth: 340 }}>
                  <div className="dropdown-head"><b>Messages</b></div>
                  <div className="divider" style={{ margin: '6px 0' }} />
                  {conversations.slice(0, 4).map((c) => (
                    <Link key={c.id} to="/tableau-de-bord/messages" className="dropdown-item">
                      <Avatar src={c.avatar} size="xs" />
                      <span className="stack">
                        <b style={{ fontSize: 12.5 }}>{c.name}</b>
                        <span className="tiny muted" style={{ whiteSpace: 'normal', maxWidth: 230, overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>{c.last}</span>
                      </span>
                    </Link>
                  ))}
                  <div className="divider" style={{ margin: '6px 0' }} />
                  <Link to="/tableau-de-bord/messages" className="dropdown-item gold">Ouvrir la messagerie →</Link>
                </div>
              )}
            </div>

            <div className="dropdown">
              <button className="user-chip" onClick={() => toggle('user')}>
                <Avatar src={currentUser.avatar} size="sm" />
                <span className="stack hide-sm" style={{ lineHeight: 1.1 }}>
                  <b style={{ fontSize: 12.5 }}>{currentUser.name}</b>
                  <span className="tiny muted">{currentUser.plan}</span>
                </span>
                <span className="tiny muted">▾</span>
              </button>
              {openMenu === 'user' && (
                <div className="dropdown-panel">
                  <div className="dropdown-head stack">
                    <b style={{ fontSize: 13.5 }}>{currentUser.name}</b>
                    <span className="tiny muted">{currentUser.pro} · {currentUser.role}</span>
                  </div>
                  <div className="divider" style={{ margin: '6px 0' }} />
                  <Link to="/tableau-de-bord" className="dropdown-item">📊 Tableau de bord</Link>
                  <Link to="/tableau-de-bord/profil" className="dropdown-item">👤 Mon profil</Link>
                  <Link to="/tableau-de-bord/mes-publications" className="dropdown-item">📝 Mes publications</Link>
                  <Link to="/tableau-de-bord/statistiques" className="dropdown-item">📈 Statistiques</Link>
                  <Link to="/tableau-de-bord/abonnement" className="dropdown-item">⭐ Abonnement</Link>
                  <Link to="/tableau-de-bord/boost" className="dropdown-item">🚀 Horizon Boost</Link>
                  <Link to="/tableau-de-bord/parametres" className="dropdown-item">⚙️ Paramètres</Link>
                  <div className="divider" style={{ margin: '6px 0' }} />
                  <Link to="/panier" className="dropdown-item">🛒 Mon panier ({cart.length})</Link>
                  <Link to="/connexion" className="dropdown-item">↩︎ Se connecter / changer de compte</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {openMenu === 'burger' && (
          <div className="container-wide mobile-open">
            <div className="mobile-nav">
              {[...primaryNav, ...moreNav.map(([to, label]) => [to, label])].map(([to, label]) => (
                <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `chip ${isActive ? 'active' : ''}`}>{label}</NavLink>
              ))}
              <Link to="/connexion" className="chip">Connexion</Link>
              <Link to="/inscription" className="chip active">Inscription</Link>
            </div>
          </div>
        )}
      </header>
    </>
  )
}

/* ------------------------------ Recherche globale --------------------- */
function SearchOverlay({ open, onClose }) {
  const [q, setQ] = useState('')
  const nav = useNavigate()
  const results = useMemo(() => {
    if (q.trim().length < 2) return null
    const s = q.toLowerCase()
    const f = (arr, type, extra = () => ({})) =>
      arr.filter((x) => JSON.stringify(x).toLowerCase().includes(s)).slice(0, 4).map((x) => ({ type, ...x, ...extra(x) }))
    return [
      ...f(talents, 'Talent', (t) => ({ to: `/talent/${t.id}`, label: t.name, sub: `${t.job} · ${t.country}` })),
      ...f(brands, 'Marque', (b) => ({ to: `/marque/${b.id}`, label: b.name, sub: `${b.category} · ${b.country}` })),
      ...f(productList, 'Produit', (p) => ({ to: `/produit/${p.id}`, label: p.name, sub: `${p.seller}` })),
      ...f(creations, 'Création', (c) => ({ to: '/galerie', label: c.title, sub: `${c.category} · ${c.author}` })),
      ...f(videos, 'Vidéo', (v) => ({ to: `/videos/${v.id}`, label: v.title, sub: `${v.category}` })),
      ...f(events, 'Événement', (e) => ({ to: `/evenements/${e.id}`, label: e.name, sub: `${e.city}, ${e.country}` })),
      ...f(opportunities, 'Opportunité', (o) => ({ to: `/opportunites/${o.id}`, label: o.title, sub: `${o.org}` })),
      ...f(articles, 'Article', (a) => ({ to: `/actualites/${a.id}`, label: a.title, sub: `${a.category}` })),
      ...f(partners, 'Partenaire', (p) => ({ to: '/partenaires', label: p.name, sub: p.domain })),
      ...f(sponsors, 'Sponsor', (s) => ({ to: '/sponsors', label: s.name, sub: s.type })),
    ]
  }, [q])

  if (!open) return null

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-box" onClick={(e) => e.stopPropagation()}>
        <div className="between mb-16">
          <span className="upper gold">Recherche globale Horizon</span>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>
        <input
          autoFocus className="search-input-lg" placeholder="Que recherchez-vous ? Talent, marque, produit, événement…"
          value={q} onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { nav(`/recherche?q=${encodeURIComponent(q)}`); onClose() } }}
        />
        <div className="pill-row mt-16">
          {['Robe wax', 'Cotonou', 'Casting mannequin', 'Dakar Fashion Week', 'Sac cuir', 'TOURÉ.'].map((s) => (
            <button key={s} className="chip" onClick={() => setQ(s)}>{s}</button>
          ))}
        </div>
        {results && (
          <div className="panel mt-24">
            <div className="between mb-16">
              <b>Résultats ({results.length})</b>
              <Btn variant="ghost" size="xs" onClick={() => { nav(`/recherche?q=${encodeURIComponent(q)}`); onClose() }}>Voir la page recherche →</Btn>
            </div>
            <div className="grid grid-2">
              {results.map((r, i) => (
                <Link key={i} to={r.to} className="list-row" onClick={onClose}>
                  <Badge tone="indigo">{r.type}</Badge>
                  <div className="stack">
                    <b style={{ fontSize: 13.5 }}>{r.label}</b>
                    <span className="tiny muted">{r.sub}</span>
                  </div>
                </Link>
              ))}
              {results.length === 0 && <p className="small muted mb-0">Aucun résultat. Essayez « wax », « Dakar » ou « casting ».</p>}
            </div>
          </div>
        )}
        {!results && (
          <div className="grid grid-4 mt-32">
            {[
              ['Talents', '12 407 profils'], ['Marques', '1 284 maisons'], ['Produits', '9 842 références'], ['Opportunités', '418 offres actives'],
            ].map(([t, s]) => (
              <div key={t} className="panel center-text">
                <b>{t}</b><div className="small muted">{s}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ------------------------------ Pied de page -------------------------- */
function Footer() {
  const col = (title, links) => (
    <div className="footer-col">
      <h4>{title}</h4>
      {links.map(([to, label]) => <Link key={label} to={to}>{label}</Link>)}
    </div>
  )
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link to="/" className="logo mb-16">
              <span className="logo-mark">H</span>
              <span className="logo-text"><b>Horizon Afrique</b><span>Créateurs d’Afrique</span></span>
            </Link>
            <p className="small">
              La plateforme de référence des talents, marques, boutiques et institutions de la création africaine.
              Découvrez, publiez, vendez et collaborez partout sur le continent.
            </p>
            <div className="socials">
              {['Fb', 'Ig', 'Tk', 'In', 'Yt'].map((s) => <a key={s} className="social" href="#" aria-label={s}>{s}</a>)}
            </div>
          </div>
          {col('Découvrir', [
            ['/decouvrir', 'Découvrir'], ['/talents', 'Talents'], ['/marques', 'Marques'], ['/galerie', 'Galerie'],
            ['/videos', 'Vidéos'], ['/evenements', 'Événements'], ['/opportunites', 'Opportunités'],
            ['/marketplace', 'Marketplace'], ['/actualites', 'Actualités'],
          ])}
          {col('Professionnels', [
            ['/inscription', 'Créer un profil'], ['/abonnements', 'Abonnements'], ['/horizon-boost', 'Horizon Boost'],
            ['/partenaires', 'Partenaires'], ['/sponsors', 'Sponsors'], ['/annuaire', 'Annuaire'],
            ['/tableau-de-bord', 'Tableau de bord'], ['/boutique', 'Espace boutique'],
          ])}
          {col('Informations', [
            ['/a-propos', 'À propos'], ['/contact', 'Contact'],
            ['/a-propos#conditions', 'Conditions d’utilisation'],
            ['/a-propos#confidentialite', 'Politique de confidentialité'],
            ['/a-propos#communaute', 'Règles de la communauté'],
          ])}
          {col('Espaces', [
            ['/espace-marque', 'Espace marque'], ['/espace-partenaire', 'Espace partenaire'],
            ['/espace-sponsor', 'Espace sponsor'], ['/administration', 'Administration'],
            ['/recherche', 'Recherche'], ['/favoris', 'Mes favoris'], ['/panier', 'Panier'],
          ])}
        </div>
        <div className="footer-bottom">
          <span>© 2026 Horizon Afrique — Maquette de démonstration. Toutes les données sont fictives.</span>
          <span>Fait avec 🧡 à Cotonou, Bénin</span>
        </div>
      </div>
    </footer>
  )
}

/* ------------------------------ Layout -------------------------------- */
export default function Layout() {
  const [search, setSearch] = useState(false)
  const { toast } = useApp()
  const loc = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [loc.pathname])

  return (
    <div className="app">
      <Header onSearch={() => setSearch(true)} />
      <main><Outlet /></main>
      <Footer />
      <SearchOverlay open={search} onClose={() => setSearch(false)} />
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

export { shortNumber }
