import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Avatar, Badge, Btn, useApp } from '../../components/ui.jsx'
import { currentUser, fcfa } from '../../data.js'

const MENUS = {
  talent: [
    { group: 'Mon espace', items: [
      ['/tableau-de-bord', 'Tableau de bord', '📊'],
      ['/tableau-de-bord/profil', 'Mon profil', '👤'],
      ['/tableau-de-bord/portfolio', 'Mon portfolio', '🖼️'],
    ] },
    { group: 'Mes contenus', items: [
      ['/tableau-de-bord/mes-publications', 'Mes publications', '📝'],
      ['/tableau-de-bord/mes-creations', 'Mes créations', '🎨'],
      ['/tableau-de-bord/mes-videos', 'Mes vidéos', '🎬'],
    ] },
    { group: 'Activité', items: [
      ['/tableau-de-bord/mes-evenements', 'Mes événements', '📅'],
      ['/tableau-de-bord/mes-opportunites', 'Mes opportunités', '💼'],
      ['/tableau-de-bord/collaborations', 'Mes collaborations', '🤝', 3],
      ['/tableau-de-bord/messages', 'Messages', '✉️', 3],
      ['/tableau-de-bord/notifications', 'Notifications', '🔔', 4],
    ] },
    { group: 'Performance', items: [
      ['/tableau-de-bord/statistiques', 'Statistiques', '📈'],
      ['/tableau-de-bord/abonnement', 'Abonnement', '⭐'],
      ['/tableau-de-bord/boost', 'Horizon Boost', '🚀'],
      ['/tableau-de-bord/parametres', 'Paramètres', '⚙️'],
    ] },
  ],
  marque: [
    { group: 'Ma structure', items: [
      ['/espace-marque', 'Tableau de bord', '📊'],
      ['/tableau-de-bord/profil', 'Ma marque', '🏷️'],
      ['/espace-marque/collections', 'Collections', '🧵'],
      ['/espace-marque/produits', 'Produits', '📦'],
    ] },
    { group: 'Commerce', items: [
      ['/boutique', 'Boutique', '🛍️'],
      ['/boutique/commandes', 'Commandes', '🧾', 2],
      ['/boutique/stocks', 'Stocks', '📊'],
      ['/boutique/promotions', 'Promotions', '🏷️'],
    ] },
    { group: 'Activité', items: [
      ['/tableau-de-bord/mes-publications', 'Publications', '📝'],
      ['/tableau-de-bord/mes-videos', 'Vidéos', '🎬'],
      ['/tableau-de-bord/mes-evenements', 'Événements', '📅'],
      ['/tableau-de-bord/messages', 'Messages', '✉️', 3],
      ['/tableau-de-bord/notifications', 'Notifications', '🔔', 4],
    ] },
    { group: 'Performance', items: [
      ['/boutique/statistiques', 'Statistiques', '📈'],
      ['/tableau-de-bord/abonnement', 'Abonnement', '⭐'],
      ['/tableau-de-bord/boost', 'Horizon Boost', '🚀'],
      ['/tableau-de-bord/parametres', 'Paramètres', '⚙️'],
    ] },
  ],
  boutique: [
    { group: 'Ma boutique', items: [
      ['/boutique', 'Tableau de bord', '📊'],
      ['/boutique/ajouter', 'Ajouter un produit', '➕'],
      ['/boutique/commandes', 'Commandes', '🧾', 2],
      ['/boutique/stocks', 'Stocks', '📦'],
    ] },
    { group: 'Marketing', items: [
      ['/boutique/promotions', 'Promotions', '🏷️'],
      ['/boutique/statistiques', 'Statistiques', '📈'],
      ['/tableau-de-bord/boost', 'Horizon Boost', '🚀'],
    ] },
    { group: 'Compte', items: [
      ['/boutique/livraison', 'Paramètres de livraison', '🚚'],
      ['/tableau-de-bord/messages', 'Messages', '✉️', 3],
      ['/tableau-de-bord/abonnement', 'Abonnement', '⭐'],
      ['/tableau-de-bord/parametres', 'Paramètres', '⚙️'],
    ] },
  ],
  partenaire: [
    { group: 'Mon institution', items: [
      ['/espace-partenaire', 'Tableau de bord', '📊'],
      ['/tableau-de-bord/profil', 'Profil de l’organisation', '🏛️'],
    ] },
    { group: 'Programmes', items: [
      ['/espace-partenaire/opportunites', 'Opportunités', '💼'],
      ['/espace-partenaire/evenements', 'Événements', '📅'],
      ['/tableau-de-bord/collaborations', 'Collaborations', '🤝', 2],
      ['/espace-partenaire/talents', 'Recherche de talents', '🔍'],
    ] },
    { group: 'Pilotage', items: [
      ['/tableau-de-bord/messages', 'Messages', '✉️', 3],
      ['/tableau-de-bord/statistiques', 'Statistiques', '📈'],
      ['/tableau-de-bord/parametres', 'Paramètres', '⚙️'],
    ] },
  ],
  sponsor: [
    { group: 'Mon entreprise', items: [
      ['/espace-sponsor', 'Tableau de bord', '📊'],
      ['/tableau-de-bord/profil', 'Profil de l’entreprise', '🏢'],
      ['/espace-sponsor/campagnes', 'Campagnes', '📣'],
    ] },
    { group: 'Soutien', items: [
      ['/espace-sponsor/talents', 'Talents soutenus', '🌟'],
      ['/espace-sponsor/evenements', 'Événements sponsorisés', '📅'],
      ['/tableau-de-bord/statistiques', 'Statistiques', '📈'],
    ] },
    { group: 'Compte', items: [
      ['/tableau-de-bord/messages', 'Messages', '✉️', 3],
      ['/tableau-de-bord/parametres', 'Paramètres', '⚙️'],
    ] },
  ],
}

const SPACES = [
  ['/tableau-de-bord', 'talent', 'Espace Talent'],
  ['/espace-marque', 'marque', 'Espace Marque'],
  ['/boutique', 'boutique', 'Espace Boutique'],
  ['/espace-partenaire', 'partenaire', 'Espace Partenaire'],
  ['/espace-sponsor', 'sponsor', 'Espace Sponsor'],
  ['/administration', 'admin', 'Administration'],
]

export default function DashShell({ space = 'talent' }) {
  const [switcher, setSwitcher] = useState(false)
  const { plan, setRole } = useApp()
  const loc = useLocation()
  const menus = MENUS[space] || MENUS.talent

  return (
    <div className="container">
      <div className="dash">
        <aside className="sidebar">
          <div className="side-user">
            <Avatar src={currentUser.avatar} size="md" ring />
            <div className="stack" style={{ lineHeight: 1.2 }}>
              <b style={{ fontSize: 13.5 }}>{currentUser.name}</b>
              <span className="tiny muted">{currentUser.pro}</span>
              <Badge tone="gold">{plan}</Badge>
            </div>
          </div>

          <div className="dropdown mb-16">
            <button className="btn btn-dark btn-sm btn-block" onClick={() => setSwitcher((s) => !s)}>
              {SPACES.find((s) => s[1] === space)?.[2] || 'Espace'} ▾
            </button>
            {switcher && (
              <div className="dropdown-panel" style={{ left: 0, right: 'auto', width: '100%' }}>
                {SPACES.filter((s) => s[1] !== 'admin').map(([to, key, label]) => (
                  <Link key={key} to={to} className="dropdown-item" onClick={() => setSwitcher(false)}>{label}</Link>
                ))}
                <div className="dropdown-sep" />
                <Link to="/administration" className="dropdown-item" onClick={() => { setSwitcher(false); setRole('admin') }}>🛡️ Administration</Link>
              </div>
            )}
          </div>

          {menus.map((m) => (
            <div key={m.group} className="side-group">
              <span>{m.group}</span>
              {m.items.map(([to, label, ico, count]) => (
                <NavLink key={to + label} to={to} end={to === '/tableau-de-bord' || to === '/espace-marque' || to === '/boutique' || to === '/espace-partenaire' || to === '/espace-sponsor'}
                  className={({ isActive }) => `side-link ${isActive && loc.pathname === to ? 'active' : ''}`}>
                  <span className="ico">{ico}</span>{label}
                  {count && <span className="count">{count}</span>}
                </NavLink>
              ))}
            </div>
          ))}

          <div className="divider" />
          <div className="panel panel-tight" style={{ background: 'linear-gradient(135deg, rgba(227,176,75,0.14), rgba(196,85,46,0.1))' }}>
            <b style={{ fontSize: 13 }}>Horizon Boost</b>
            <p className="tiny mb-8 mt-8">3 Boosts disponibles ce mois-ci.</p>
            <Btn to="/tableau-de-bord/boost" size="xs" className="btn-block">Booster un contenu</Btn>
          </div>
        </aside>

        <div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export function DashHead({ title, sub, children }) {
  return (
    <div className="dash-head">
      <div>
        <h1 style={{ fontSize: 'clamp(1.4rem, 2.4vw, 1.9rem)', marginBottom: 4 }}>{title}</h1>
        {sub && <p className="mb-0 small">{sub}</p>}
      </div>
      {children && <div className="row gap-12 wrap">{children}</div>}
    </div>
  )
}

export { fcfa }
