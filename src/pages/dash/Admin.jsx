import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { DashHead } from './Shell.jsx'
import {
  Avatar, Badge, Btn, Meter, Modal, SectionHead, Stat, Tabs, useApp,
} from '../../components/ui.jsx'
import {
  COUNTRIES, IMG, PRODUCT_CATEGORIES, TALENT_CATEGORIES, adminStats, brands, creations, events, fcfa,
  fmtShort, notifications, opportunities, partners, payments, productList, reports, shortNumber, sponsors,
  stats, talents, verifications, videos,
} from '../../data.js'

/* =====================================================================
   44. ESPACE ADMINISTRATEUR — coquille + navigation
   ===================================================================== */
const ADMIN_MENU = [
  { group: 'Pilotage', items: [
    ['/administration', 'Tableau de bord', '📊'],
    ['/administration/utilisateurs', 'Utilisateurs', '👥', 4],
    ['/administration/contenus', 'Contenus & médias', '🗂️'],
    ['/administration/moderation', 'Modération & signalements', '🚩', 2],
  ] },
  { group: 'Gestion', items: [
    ['/administration/verifications', 'Vérifications', '✔️', 3],
    ['/administration/abonnements', 'Abonnements', '⭐'],
    ['/administration/paiements', 'Paiements', '💳'],
    ['/administration/boost', 'Horizon Boost', '🚀'],
  ] },
  { group: 'Référentiels', items: [
    ['/administration/referentiel', 'Pays & catégories', '🌍'],
    ['/tableau-de-bord/parametres', 'Paramètres plateforme', '⚙️'],
  ] },
]

export function AdminShell() {
  const { notify } = useApp()
  return (
    <div className="container">
      <div className="dash">
        <aside className="sidebar">
          <div className="side-user" style={{ background: 'linear-gradient(135deg, rgba(74,95,168,0.2), rgba(227,176,75,0.12))' }}>
            <span className="logo-mark" style={{ width: 42, height: 42, borderRadius: 13, fontSize: 16 }}>🛡️</span>
            <div className="stack" style={{ lineHeight: 1.2 }}>
              <b style={{ fontSize: 13.5 }}>Administration</b>
              <span className="tiny muted">Horizon Afrique</span>
              <Badge tone="indigo">Super admin</Badge>
            </div>
          </div>

          {ADMIN_MENU.map((m) => (
            <div key={m.group} className="side-group">
              <span>{m.group}</span>
              {m.items.map(([to, label, ico, count]) => (
                <NavLink key={to} to={to} end={to === '/administration'} className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}>
                  <span className="ico">{ico}</span>{label}
                  {count && <span className="count">{count}</span>}
                </NavLink>
              ))}
            </div>
          ))}

          <div className="divider" />
          <div className="panel panel-tight">
            <b style={{ fontSize: 13 }}>Actions rapides</b>
            <div className="stack gap-8 mt-8">
              <Btn variant="outline" size="xs" onClick={() => notify('Export global des données lancé 📦')}>Exporter les données</Btn>
              <Btn variant="outline" size="xs" onClick={() => notify('Rapport quotidien généré 📄')}>Rapport quotidien</Btn>
              <Btn variant="dark" size="xs" onClick={() => notify('Mode maintenance planifié 🛠️')}>Maintenance</Btn>
            </div>
          </div>
        </aside>

        <div><Outlet /></div>
      </div>
    </div>
  )
}

/* --------------------------- Tableau de bord -------------------------- */
export function AdminDashboard() {
  const max = Math.max(...stats.series)
  return (
    <>
      <DashHead title="Tableau de bord administrateur" sub="Vue générale de la plateforme : utilisateurs, contenus, revenus et modération."
        children={<><select className="input" style={{ width: 160 }} defaultValue="30 derniers jours"><option>7 derniers jours</option><option>30 derniers jours</option><option>12 derniers mois</option></select><Btn variant="outline" size="sm">Exporter le rapport</Btn></>} />

      <div className="grid grid-4 mb-24">
        {adminStats.map((s) => <Stat key={s.label} {...s} />)}
      </div>

      <div className="split mb-24">
        <div className="panel">
          <div className="panel-title"><b>Croissance de la plateforme</b><span className="tiny muted-2">nouveaux inscrits</span></div>
          <div className="bars">
            {stats.series.map((v, i) => <div key={i}><i style={{ height: `${(v / max) * 100}%` }} /><span>{stats.months[i]}</span></div>)}
          </div>
        </div>
        <div className="stack gap-16">
          <div className="panel">
            <div className="panel-title"><b>Répartition des comptes</b></div>
            <div className="ratio-bar mb-16">
              <i style={{ width: '38%', background: 'var(--gold)' }} />
              <i style={{ width: '26%', background: 'var(--terra)' }} />
              <i style={{ width: '18%', background: 'var(--indigo)' }} />
              <i style={{ width: '18%', background: 'var(--green)' }} />
            </div>
            <div className="stack gap-8 small">
              {[['Talents', '38 %', 'var(--gold)'], ['Marques & boutiques', '26 %', 'var(--terra)'], ['Partenaires', '18 %', 'var(--indigo)'], ['Sponsors & visiteurs', '18 %', 'var(--green)']].map(([l, v, c]) => (
                <div key={l} className="between"><span className="row gap-8"><i style={{ width: 10, height: 10, borderRadius: 3, background: c, display: 'inline-block' }} />{l}</span><b>{v}</b></div>
              ))}
            </div>
          </div>
          <div className="panel">
            <div className="panel-title"><b>Revenus du mois</b><Badge tone="green">+12,7 %</Badge></div>
            <div className="stack gap-10 small">
              <div className="between"><span className="muted">Abonnements</span><b>{fcfa(21400000)}</b></div>
              <div className="between"><span className="muted">Commissions marketplace</span><b>{fcfa(12800000)}</b></div>
              <div className="between"><span className="muted">Horizon Boost</span><b>{fcfa(4200000)}</b></div>
              <div className="divider" style={{ margin: '8px 0' }} />
              <div className="between"><span>Total</span><b className="gold">{fcfa(38400000)}</b></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-2 mb-24">
        <div className="panel">
          <div className="panel-title"><b>Signalements à traiter</b><Link to="/administration/moderation" className="link-arrow">Ouvrir →</Link></div>
          <div className="stack gap-12">
            {reports.slice(0, 3).map((r) => (
              <div key={r.id} className="between">
                <div className="stack"><b style={{ fontSize: 13.5 }}>{r.type}</b><span className="tiny muted">{r.target} · {fmtShort(r.date)}</span></div>
                <Badge tone={r.gravity === 'Élevée' ? 'terra' : 'muted'}>{r.gravity}</Badge>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-title"><b>Vérifications en attente</b><Link to="/administration/verifications" className="link-arrow">Valider →</Link></div>
          <div className="stack gap-12">
            {verifications.filter((v) => v.status === 'En attente').map((v) => (
              <div key={v.id} className="between">
                <div className="stack"><b style={{ fontSize: 13.5 }}>{v.name}</b><span className="tiny muted">{v.type} · {v.country}</span></div>
                <Badge tone="gold">En attente</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title"><b>Top pays par activité</b><Link to="/administration/referentiel" className="link-arrow">Référentiel →</Link></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Pays</th><th>Utilisateurs</th><th>Talents</th><th>Marques</th><th>Produits</th><th>Activité</th></tr></thead>
            <tbody>
              {[['Bénin', 8420, 2410, 186, 1420, 92], ['Nigeria', 9860, 3120, 264, 2180, 96], ['Sénégal', 6210, 1840, 142, 1180, 84], ['Ghana', 4820, 1520, 118, 940, 76], ['Côte d’Ivoire', 5240, 1680, 126, 1020, 80], ['Maroc', 3980, 1120, 96, 860, 68]].map(([c, u, t, b, p, a]) => (
                <tr key={c}>
                  <td><b>{COUNTRIES.find((x) => x.name === c)?.flag} {c}</b></td>
                  <td>{shortNumber(u)}</td>
                  <td>{t}</td>
                  <td>{b}</td>
                  <td>{p}</td>
                  <td style={{ minWidth: 130 }}><Meter value={a} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SectionHead eyebrow="Administration" title="Les 25 modules de la plateforme"
        action="/administration/referentiel" actionLabel="Référentiels" />
      <div className="grid grid-4 section-sm">
        {[
          ['📊', 'Tableau de bord', '/administration', 'Vue générale'],
          ['👥', 'Utilisateurs', '/administration/utilisateurs', '48 620 comptes'],
          ['🎨', 'Talents & profils', '/administration/utilisateurs', '12 480 profils'],
          ['🏷️', 'Marques', '/administration/utilisateurs', '964 marques'],
          ['🛍️', 'Boutiques', '/boutique', '1 240 boutiques'],
          ['🏛️', 'Partenaires', '/partenaires', '186 institutions'],
          ['✦', 'Sponsors', '/sponsors', '92 sponsors'],
          ['✔️', 'Vérifications', '/administration/verifications', '12 en attente'],
          ['📝', 'Publications', '/administration/contenus', '18 402 publications'],
          ['🖼️', 'Créations & galerie', '/administration/contenus', '32 180 médias'],
          ['🎬', 'Vidéos', '/administration/contenus', '4 210 vidéos'],
          ['💬', 'Commentaires', '/administration/moderation', '96 400 commentaires'],
          ['🚩', 'Signalements', '/administration/moderation', '24 ouverts'],
          ['🚫', 'Sanctions & rôles', '/administration/utilisateurs', '36 sanctions'],
          ['⭐', 'Abonnements', '/administration/abonnements', '8 420 abonnés'],
          ['💳', 'Paiements', '/administration/paiements', '2,4 Md FCFA'],
          ['📦', 'Commandes', '/boutique/commandes', '3 180 commandes'],
          ['🚀', 'Horizon Boost', '/administration/boost', '412 boosts actifs'],
          ['📈', 'Statistiques globales', '/administration', '12 mois'],
          ['📄', 'Rapports & exports', '/administration', 'Ces rapports'],
          ['🌍', 'Pays', '/administration/referentiel', '24 pays'],
          ['🧵', 'Catégories & métiers', '/administration/referentiel', '11 catégories'],
          ['🔔', 'Notifications globales', '/administration/referentiel', '6 modèles'],
          ['⚙️', 'Paramètres plateforme', '/tableau-de-bord/parametres', 'Règles & sécurité'],
          ['🕓', 'Journal d’activité', '/administration/moderation', 'Temps réel'],
        ].map(([ico, title, to, meta]) => (
          <Link key={title} to={to} className="panel" style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 22 }}>{ico}</div>
            <b style={{ display: 'block', marginTop: 8 }}>{title}</b>
            <span className="tiny muted">{meta}</span>
          </Link>
        ))}
      </div>
    </>
  )
}

/* ------------------------------- Utilisateurs ------------------------- */
export function AdminUtilisateurs() {
  const { notify } = useApp()
  const [tab, setTab] = useState('Talents')
  const [q, setQ] = useState('')
  const [modal, setModal] = useState(null)

  const tabs = ['Talents', 'Marques', 'Boutiques', 'Partenaires', 'Sponsors', 'Administrateurs']
  const map = {
    Talents: talents.map((t) => ({ id: t.id, name: t.name, type: t.job, country: t.country, flag: t.flag, status: t.verified ? 'Vérifié' : 'Actif', since: '2026-0' + ((t.years % 9) + 1) + '-12', avatar: t.avatar, followers: t.followers })),
    Marques: brands.map((b) => ({ id: b.id, name: b.name, type: b.category, country: b.country, flag: b.flag, status: b.verified ? 'Vérifié' : 'Actif', since: '2025-06-04', avatar: b.avatar, followers: b.followers })),
    Boutiques: productList.slice(0, 6).map((p, i) => ({ id: p.id, name: `${p.seller} Store`, type: 'Boutique', country: p.country, flag: p.flag, status: i < 4 ? 'Vérifié' : 'En attente', since: '2025-1' + (i % 9) + '-02', avatar: p.image, followers: 4200 + i * 830 })),
    Partenaires: partners.map((p) => ({ id: p.id, name: p.name, type: p.domain, country: p.country, flag: p.flag, status: 'Vérifié', since: '2024-0' + ((p.since % 9) + 1) + '-15', avatar: IMG.people[6], followers: 1200 })),
    Sponsors: sponsors.map((s) => ({ id: s.id, name: s.name, type: s.type, country: 'International', flag: '🌍', status: 'Vérifié', since: '2023-03-20', avatar: IMG.people[9], followers: 2400 })),
    Administrateurs: [
      { id: 'adm1', name: 'Awa Sossou', type: 'Super admin', country: 'Bénin', flag: '🇧🇯', status: 'Actif', since: '2023-01-10', avatar: IMG.people[0], followers: 0 },
      { id: 'adm2', name: 'Kwesi Ampofo', type: 'Modération', country: 'Ghana', flag: '🇬🇭', status: 'Actif', since: '2024-02-18', avatar: IMG.people[5], followers: 0 },
      { id: 'adm3', name: 'Naomi Wanjiru', type: 'Support', country: 'Kenya', flag: '🇰🇪', status: 'Suspendu', since: '2025-05-02', avatar: IMG.people[4], followers: 0 },
    ],
  }
  const list = map[tab].filter((x) => !q || JSON.stringify(x).toLowerCase().includes(q.toLowerCase()))

  return (
    <>
      <DashHead title="Utilisateurs" sub="Talents, marques, boutiques, partenaires, sponsors et administrateurs."
        children={<><Btn variant="outline" size="sm" onClick={() => notify('Export des utilisateurs (CSV) 📄')}>Exporter</Btn><Btn size="sm" onClick={() => notify('Invitation envoyée ✉️')}>+ Inviter un utilisateur</Btn></>} />

      <div className="grid grid-4 mb-24">
        {[['Total utilisateurs', '48 216'], ['Actifs ce mois', '31 842'], ['Suspendus', '248'], ['Nouveaux (30 j)', '1 842']].map(([a, b]) => <div key={a} className="kpi"><b>{b}</b><span>{a}</span></div>)}
      </div>

      <div className="panel mb-24"><Tabs tabs={tabs} value={tab} onChange={setTab} /></div>

      <div className="filter-bar">
        <input className="input" placeholder="Rechercher un utilisateur…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select><option>Pays : Tous</option>{COUNTRIES.map((c) => <option key={c.name}>{c.name}</option>)}</select>
        <select><option>Statut : Tous</option><option>Actif</option><option>Vérifié</option><option>En attente</option><option>Suspendu</option></select>
        <Btn size="sm">Filtrer</Btn>
      </div>

      <div className="table-wrap">
        <table>
          <thead><tr><th>Utilisateur</th><th>Type</th><th>Pays</th><th>Abonnés</th><th>Inscription</th><th>Statut</th><th>Actions</th></tr></thead>
          <tbody>
            {list.map((u) => (
              <tr key={`${tab}-${u.id}`}>
                <td>
                  <div className="row gap-12">
                    <Avatar src={u.avatar} size="sm" />
                    <b>{u.name}</b>
                  </div>
                </td>
                <td className="muted">{u.type}</td>
                <td className="muted">{u.flag} {u.country}</td>
                <td>{u.followers ? shortNumber(u.followers) : '—'}</td>
                <td className="muted">{fmtShort(u.since)}</td>
                <td><Badge tone={u.status === 'Vérifié' ? 'gold' : u.status === 'Suspendu' ? 'terra' : u.status === 'En attente' ? 'indigo' : 'green'}>{u.status}</Badge></td>
                <td>
                  <div className="table-actions">
                    <button className="btn btn-outline btn-xs" onClick={() => setModal(u)}>Profil</button>
                    <button className="btn btn-dark btn-xs" onClick={() => notify(`${u.name} — validé ✓`)}>Valider</button>
                    <button className="btn btn-danger btn-xs" onClick={() => notify(`${u.name} suspendu`)}>Suspendre</button>
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={7} className="muted" style={{ textAlign: 'center', padding: 26 }}>Aucun utilisateur trouvé.</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.name}
        footer={<><Btn onClick={() => { notify(`${modal.name} — profil validé ✓`); setModal(null) }}>Valider le profil</Btn><Btn variant="danger" onClick={() => { notify(`${modal.name} suspendu`); setModal(null) }}>Suspendre le compte</Btn><Btn variant="ghost" onClick={() => setModal(null)}>Fermer</Btn></>}>
        {modal && (
          <div className="stack gap-12">
            <div className="row gap-16">
              <Avatar src={modal.avatar} size="lg" ring />
              <div className="stack">
                <b>{modal.name}</b>
                <span className="small muted">{modal.type} · {modal.flag} {modal.country}</span>
                <Badge tone="gold">{modal.status}</Badge>
              </div>
            </div>
            <div className="divider" />
            <div className="stack gap-8 small">
              <div className="between"><span className="muted">Identifiant</span><b>{modal.id}</b></div>
              <div className="between"><span className="muted">Inscription</span><b>{fmtShort(modal.since)}</b></div>
              <div className="between"><span className="muted">Abonnés</span><b>{modal.followers}</b></div>
              <div className="between"><span className="muted">Signalements</span><b>0</b></div>
              <div className="between"><span className="muted">Documents fournis</span><b>3 / 3</b></div>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

/* --------------------------------- Contenus --------------------------- */
export function AdminContenus() {
  const { notify } = useApp()
  const [tab, setTab] = useState('Publications')
  const tabs = ['Publications', 'Créations', 'Vidéos', 'Produits', 'Commentaires', 'Événements', 'Opportunités']

  return (
    <>
      <DashHead title="Contenus & médias" sub="Supervisez l’ensemble des contenus publiés sur la plateforme."
        children={<><Btn variant="outline" size="sm" onClick={() => notify('Export des contenus lancé 📄')}>Exporter</Btn><Btn size="sm" onClick={() => setTab('Publications')}>Tout afficher</Btn></>} />

      <div className="grid grid-4 mb-24">
        {[['Publications', '184 320'], ['Créations', '12 407'], ['Vidéos', '7 918'], ['Commentaires', '96 214']].map(([a, b]) => <div key={a} className="kpi"><b>{b}</b><span>{a}</span></div>)}
      </div>

      <div className="panel mb-24"><Tabs tabs={tabs} value={tab} onChange={setTab} /></div>

      {tab === 'Publications' && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Contenu</th><th>Auteur</th><th>Type</th><th>J’aime</th><th>Signalements</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {[['La collection « Sable & Or » arrive.', 'TOURÉ.', 'Texte + image', 1284, 0, '2026-09-20'],
                ['Trois semaines de travail, une robe.', 'Aïcha Kora', 'Image', 964, 0, '2026-09-18'],
                ['Nouvelle capsule « Teranga » en boutique.', 'Wax & Co', 'Produit', 742, 1, '2026-09-16'],
                ['Retour sur un shooting incroyable à Dakar.', 'Fatou Diallo', 'Galerie', 2180, 0, '2026-09-14'],
                ['Studio Zuri — offre exceptionnelle', 'Studio Zuri', 'Annonce', 42, 3, '2026-09-13']].map(([c, a, t, l, r, d]) => (
                <tr key={c}>
                  <td><b>{c}</b></td>
                  <td className="muted">{a}</td>
                  <td className="muted">{t}</td>
                  <td>♥ {shortNumber(l)}</td>
                  <td>{r > 0 ? <Badge tone="terra">{r}</Badge> : <span className="muted">0</span>}</td>
                  <td className="muted">{fmtShort(d)}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-outline btn-xs" onClick={() => notify('Contenu prévisualisé 👁️')}>Voir</button>
                      <button className="btn btn-dark btn-xs" onClick={() => notify('Contenu masqué temporairement 🙈')}>Masquer</button>
                      <button className="btn btn-danger btn-xs" onClick={() => notify('Contenu supprimé 🗑️')}>Supprimer</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Créations' && (
        <div className="grid grid-4">
          {creations.slice(0, 8).map((c) => (
            <div key={c.id} className="card">
              <div className="card-media card-media-tall"><img src={c.image} alt="" loading="lazy" /><div className="media-top"><Badge tone="muted">{c.category}</Badge></div></div>
              <div className="card-pad">
                <b style={{ fontSize: 13.5 }}>{c.title}</b>
                <div className="tiny muted">{c.author} · {fmtShort(c.date)}</div>
              </div>
              <div className="card-foot">
                <button className="btn btn-dark btn-xs" onClick={() => notify('Création validée ✓')}>Valider</button>
                <button className="btn btn-danger btn-xs" onClick={() => notify('Création retirée 🗑️')}>Retirer</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'Vidéos' && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Vidéo</th><th>Créateur</th><th>Catégorie</th><th>Vues</th><th>Durée</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {videos.slice(0, 6).map((v) => (
                <tr key={v.id}>
                  <td>
                    <div className="row gap-12">
                      <img src={v.thumb} alt="" style={{ width: 62, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                      <b>{v.title}</b>
                    </div>
                  </td>
                  <td className="muted">{v.author}</td>
                  <td className="muted">{v.category}</td>
                  <td>{shortNumber(v.views)}</td>
                  <td className="muted">{v.duration}</td>
                  <td className="muted">{fmtShort(v.date)}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-outline btn-xs" onClick={() => notify('Vidéo approuvée ✓')}>Approuver</button>
                      <button className="btn btn-danger btn-xs" onClick={() => notify('Vidéo supprimée 🗑️')}>Supprimer</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Produits' && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Produit</th><th>Vendeur</th><th>Catégorie</th><th>Prix</th><th>Stock</th><th>Statut</th><th>Actions</th></tr></thead>
            <tbody>
              {productList.slice(0, 8).map((p, i) => (
                <tr key={p.id}>
                  <td><div className="row gap-12"><img src={p.image} alt="" style={{ width: 42, height: 42, borderRadius: 9, objectFit: 'cover' }} /><b>{p.name}</b></div></td>
                  <td className="muted">{p.seller}</td>
                  <td className="muted">{p.category}</td>
                  <td><b className="gold">{fcfa(p.price)}</b></td>
                  <td>{p.stock}</td>
                  <td><Badge tone={i % 5 === 4 ? 'indigo' : 'green'}>{i % 5 === 4 ? 'En attente' : 'Publié'}</Badge></td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-dark btn-xs" onClick={() => notify('Produit approuvé ✓')}>Approuver</button>
                      <button className="btn btn-danger btn-xs" onClick={() => notify('Produit retiré de la marketplace')}>Retirer</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Commentaires' && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Commentaire</th><th>Auteur</th><th>Sur</th><th>Signalé</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {[['Superbe travail sur les finitions !', 'Sira Camara', 'Robe « Azalaï »', false, '2026-09-21'],
                ['Les couleurs sont incroyables 🔥', 'Koffi Mensah', 'Collection Sable & Or', false, '2026-09-20'],
                ['Contactez-moi en privé pour une offre', 'Compte #88213', 'Publication — Wax & Co', true, '2026-09-19'],
                ['Boutique sérieuse, merci beaucoup !', 'Fatou Diallo', 'Sac cuir de Fès', false, '2026-09-18'],
                ['Spam : promotion externe', 'Compte #71204', 'Vidéo — Lagos FW', true, '2026-09-17']].map(([t, a, on, flag, d]) => (
                <tr key={t}>
                  <td style={{ maxWidth: 320 }}>{t}</td>
                  <td className="muted">{a}</td>
                  <td className="muted">{on}</td>
                  <td>{flag ? <Badge tone="terra">Signalé</Badge> : <span className="muted">—</span>}</td>
                  <td className="muted">{fmtShort(d)}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-dark btn-xs" onClick={() => notify('Commentaire approuvé ✓')}>Approuver</button>
                      <button className="btn btn-danger btn-xs" onClick={() => notify('Commentaire supprimé 🗑️')}>Supprimer</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Événements' && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Événement</th><th>Organisateur</th><th>Ville</th><th>Date</th><th>Participants</th><th>Statut</th><th>Actions</th></tr></thead>
            <tbody>
              {events.map((e, i) => (
                <tr key={e.id}>
                  <td><b>{e.name}</b></td>
                  <td className="muted">{e.organizer}</td>
                  <td className="muted">{e.city}, {e.country}</td>
                  <td className="muted">{fmtShort(e.start)}</td>
                  <td>{e.participants}</td>
                  <td><Badge tone={i % 4 === 3 ? 'indigo' : 'green'}>{i % 4 === 3 ? 'En attente' : 'Validé'}</Badge></td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-dark btn-xs" onClick={() => notify('Événement mis en avant 🎉')}>Mettre en avant</button>
                      <button className="btn btn-danger btn-xs" onClick={() => notify('Événement retiré')}>Retirer</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Opportunités' && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Opportunité</th><th>Organisation</th><th>Type</th><th>Candidatures</th><th>Limite</th><th>Statut</th><th>Actions</th></tr></thead>
            <tbody>
              {opportunities.map((o, i) => (
                <tr key={o.id}>
                  <td><b>{o.title}</b></td>
                  <td className="muted">{o.org}</td>
                  <td><Badge tone="indigo">{o.type}</Badge></td>
                  <td>{o.applicants}</td>
                  <td className="muted">{fmtShort(o.deadline)}</td>
                  <td><Badge tone={i % 5 === 4 ? 'terra' : 'green'}>{i % 5 === 4 ? 'Signalée' : 'Publiée'}</Badge></td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-dark btn-xs" onClick={() => notify('Opportunité validée ✓')}>Valider</button>
                      <button className="btn btn-danger btn-xs" onClick={() => notify('Opportunité clôturée')}>Clôturer</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

/* =====================================================================
   45. MODÉRATION
   ===================================================================== */
export function AdminModeration() {
  const { notify } = useApp()
  const [tab, setTab] = useState('Signalements')
  const [modal, setModal] = useState(null)

  return (
    <>
      <DashHead title="Modération" sub="Signalements, contenus sensibles, comptes suspendus et validations."
        children={<><Btn variant="outline" size="sm" onClick={() => notify('Journal de modération exporté 📄')}>Journal</Btn><Btn size="sm" onClick={() => notify('Règles de modération mises à jour')}>Règles de la communauté</Btn></>} />

      <div className="grid grid-4 mb-24">
        {[['Signalements ouverts', '42'], ['Traités cette semaine', '186'], ['Comptes suspendus', '248'], ['Contenus supprimés (30 j)', '1 204']].map(([a, b]) => <div key={a} className="kpi"><b>{b}</b><span>{a}</span></div>)}
      </div>

      <div className="panel mb-24"><Tabs tabs={['Signalements', 'Comptes suspendus', 'Validations de profils', 'Vérification des marques', 'Commentaires']} value={tab} onChange={setTab} /></div>

      {tab === 'Signalements' && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Réf.</th><th>Type</th><th>Cible</th><th>Signalé par</th><th>Gravité</th><th>Date</th><th>Statut</th><th>Actions</th></tr></thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id}>
                  <td><b>{r.id}</b></td>
                  <td>{r.type}</td>
                  <td className="muted">{r.target}</td>
                  <td className="muted">{r.author}</td>
                  <td><Badge tone={r.gravity === 'Élevée' ? 'terra' : r.gravity === 'Moyenne' ? 'gold' : 'muted'}>{r.gravity}</Badge></td>
                  <td className="muted">{fmtShort(r.date)}</td>
                  <td><Badge tone={r.status === 'À traiter' ? 'terra' : r.status === 'En cours' ? 'indigo' : 'green'}>{r.status}</Badge></td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-outline btn-xs" onClick={() => setModal(r)}>Examiner</button>
                      <button className="btn btn-dark btn-xs" onClick={() => notify(`Signalement ${r.id} classé sans suite`)}>Classer</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Comptes suspendus' && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Compte</th><th>Motif</th><th>Durée</th><th>Depuis</th><th>Statut</th><th>Actions</th></tr></thead>
            <tbody>
              {[['Studio Zuri', 'Faux profil / usurpation', 'Définitive', '2026-09-21', 'Bloqué'],
                ['Compte #88213', 'Spam et démarchage abusif', '30 jours', '2026-09-19', 'Suspendu'],
                ['Aso Kente Off', 'Vente de contrefaçons', 'Définitive', '2026-09-12', 'Bloqué'],
                ['Compte #71204', 'Contenu inapproprié', '7 jours', '2026-09-10', 'Suspendu'],
                ['Kinshasa Deals', 'Non-respect des règles', '14 jours', '2026-09-04', 'Levée']].map(([c, m, d, s, st]) => (
                <tr key={c}>
                  <td><b>{c}</b></td>
                  <td className="muted">{m}</td>
                  <td className="muted">{d}</td>
                  <td className="muted">{fmtShort(s)}</td>
                  <td><Badge tone={st === 'Bloqué' ? 'terra' : st === 'Suspendu' ? 'gold' : 'green'}>{st}</Badge></td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-outline btn-xs" onClick={() => notify(`${c} — suspension levée`)}>Lever</button>
                      <button className="btn btn-danger btn-xs" onClick={() => notify(`${c} bloqué définitivement`)}>Bloquer</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Validations de profils' && (
        <div className="grid grid-3">
          {talents.slice(0, 6).map((t) => (
            <div key={t.id} className="panel">
              <div className="row gap-12 mb-16">
                <Avatar src={t.avatar} size="md" ring />
                <div className="stack"><b>{t.name}</b><span className="tiny muted">{t.job} · {t.flag} {t.country}</span></div>
              </div>
              <div className="stack gap-8 small mb-16">
                <div className="between"><span className="muted">Pièce d’identité</span><Badge tone="green">Fournie</Badge></div>
                <div className="between"><span className="muted">Justificatif pro.</span><Badge tone={t.verified ? 'green' : 'gold'}>{t.verified ? 'Fourni' : 'À vérifier'}</Badge></div>
                <div className="between"><span className="muted">Portfolio</span><b>{t.portfolio.length} visuels</b></div>
              </div>
              <div className="row gap-8">
                <button className="btn btn-primary btn-xs grow" onClick={() => notify(`${t.name} — profil validé ✓`)}>Valider</button>
                <button className="btn btn-danger btn-xs" onClick={() => notify(`${t.name} — demande refusée`)}>Refuser</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'Vérification des marques' && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Marque</th><th>Pays</th><th>Documents</th><th>Demande</th><th>Statut</th><th>Actions</th></tr></thead>
            <tbody>
              {brands.slice(0, 8).map((b, i) => (
                <tr key={b.id}>
                  <td><div className="row gap-12"><div className="logo-mark" style={{ width: 36, height: 36, borderRadius: 11, fontSize: 13 }}>{b.logo}</div><b>{b.name}</b></div></td>
                  <td className="muted">{b.flag} {b.country}</td>
                  <td className="muted">{3 + (i % 3)} / 4</td>
                  <td className="muted">{fmtShort(new Date(Date.now() - i * 3 * 86400000))}</td>
                  <td><Badge tone={i % 3 === 2 ? 'gold' : 'green'}>{i % 3 === 2 ? 'En attente' : 'Vérifiée'}</Badge></td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-outline btn-xs" onClick={() => notify('Documents consultés 📄')}>Documents</button>
                      <button className="btn btn-dark btn-xs" onClick={() => notify(`${b.name} — marque vérifiée ✓`)}>Vérifier</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Commentaires' && <AdminContenus />}

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal ? `Signalement ${modal.id}` : ''}
        footer={<><Btn onClick={() => { notify(`Contenu retiré — signalement ${modal.id} traité ✓`); setModal(null) }}>Retirer le contenu</Btn><Btn variant="danger" onClick={() => { notify('Utilisateur bloqué'); setModal(null) }}>Bloquer l’utilisateur</Btn><Btn variant="ghost" onClick={() => setModal(null)}>Classer sans suite</Btn></>}>
        {modal && (
          <div className="stack gap-12 small">
            <div className="between"><span className="muted">Type</span><b>{modal.type}</b></div>
            <div className="between"><span className="muted">Cible</span><b>{modal.target}</b></div>
            <div className="between"><span className="muted">Signalé par</span><b>{modal.author}</b></div>
            <div className="between"><span className="muted">Gravité</span><Badge tone={modal.gravity === 'Élevée' ? 'terra' : 'gold'}>{modal.gravity}</Badge></div>
            <div className="between"><span className="muted">Date</span><b>{fmtShort(modal.date)}</b></div>
            <div className="divider" />
            <div className="panel panel-tight">
              <b style={{ fontSize: 13 }}>Historique du compte</b>
              <p className="small mb-0 mt-8">3 signalements sur les 90 derniers jours · 1 avertissement envoyé · aucun blocage antérieur.</p>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

/* ------------------------------- Vérifications ------------------------ */
export function AdminVerifications() {
  const { notify } = useApp()
  const [tab, setTab] = useState('En attente')

  return (
    <>
      <DashHead title="Vérifications" sub="Validez les profils, marques, boutiques, partenaires et sponsors."
        children={<Btn variant="outline" size="sm" onClick={() => notify('Grille de vérification ouverte 📋')}>Critères de vérification</Btn>} />

      <div className="grid grid-4 mb-24">
        {[['En attente', verifications.filter((v) => v.status === 'En attente').length], ['Validées (30 j)', '142'], ['Refusées (30 j)', '18'], ['Délai moyen', '1,4 jour']].map(([a, b]) => <div key={a} className="kpi"><b>{b}</b><span>{a}</span></div>)}
      </div>

      <div className="panel mb-24"><Tabs tabs={['En attente', 'Validées', 'Refusées']} value={tab} onChange={setTab} /></div>

      <div className="table-wrap">
        <table>
          <thead><tr><th>Réf.</th><th>Nom</th><th>Type</th><th>Pays</th><th>Documents</th><th>Demande</th><th>Statut</th><th>Actions</th></tr></thead>
          <tbody>
            {verifications.filter((v) => (tab === 'En attente' ? v.status === 'En attente' : tab === 'Validées' ? v.status === 'Validé' : false)).map((v) => (
              <tr key={v.id}>
                <td><b>{v.id}</b></td>
                <td>{v.name}</td>
                <td><Badge tone="indigo">{v.type}</Badge></td>
                <td className="muted">{v.country}</td>
                <td className="muted">{v.docs} / 5</td>
                <td className="muted">{fmtShort(v.date)}</td>
                <td><Badge tone={v.status === 'Validé' ? 'green' : 'gold'}>{v.status}</Badge></td>
                <td>
                  <div className="table-actions">
                    <button className="btn btn-outline btn-xs" onClick={() => notify('Documents consultés 📄')}>Documents</button>
                    <button className="btn btn-dark btn-xs" onClick={() => notify(`${v.name} vérifié ✓`)}>Valider</button>
                    <button className="btn btn-danger btn-xs" onClick={() => notify(`${v.name} — demande refusée`)}>Refuser</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

/* --------------------------- Abonnements / Paiements / Boost ---------- */
export function AdminFinances({ tab = 'abonnements' }) {
  const { notify } = useApp()
  const [section, setSection] = useState(tab)
  const tabs = ['abonnements', 'paiements', 'boost']
  const labels = { abonnements: 'Abonnements', paiements: 'Paiements', boost: 'Horizon Boost' }

  return (
    <>
      <DashHead title="Abonnements, paiements & Boost" sub="Suivez les revenus, les facturations et les campagnes de visibilité."
        children={<><Btn variant="outline" size="sm" onClick={() => notify('Export comptable généré 📄')}>Export comptable</Btn><Btn size="sm" onClick={() => notify('Relance envoyée aux impayés ✉️')}>Relancer les impayés</Btn></>} />

      <div className="grid grid-4 mb-24">
        {[['Revenus du mois', fcfa(38400000), '+12,7 %', true], ['Abonnements actifs', '6 402', '+418', true], ['Encours à recouvrer', fcfa(1840000), '-8 %', true], ['Boosts vendus (30 j)', '1 218', '+96', true]].map(([l, v, d, up]) => <Stat key={l} label={l} value={v} delta={d} up={up} />)}
      </div>

      <div className="panel mb-24"><Tabs tabs={tabs.map((t) => labels[t])} value={labels[section]} onChange={(v) => setSection(tabs.find((t) => labels[t] === v))} /></div>

      {section === 'abonnements' && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Formule</th><th>Abonnés</th><th>Prix</th><th>Revenus mensuels</th><th>Part des revenus</th><th>Tendance</th></tr></thead>
            <tbody>
              {[['Horizon Free', 38214, 0, 0, 0, '+2 %'],
                ['Horizon Starter', 3120, 5000, 15600000, 41, '+6 %'],
                ['Horizon Pro', 2418, 10000, 24180000, 63, '+9 %'],
                ['Horizon Premium', 864, 20000, 17280000, 45, '+14 %']].map(([n, a, p, r, part, t]) => (
                <tr key={n}>
                  <td><b>{n}</b></td>
                  <td>{shortNumber(a)}</td>
                  <td>{p ? fcfa(p) : 'Gratuit'}</td>
                  <td><b className="gold">{r ? fcfa(r) : '—'}</b></td>
                  <td style={{ minWidth: 140 }}>{part ? <Meter value={part} /> : <span className="muted">—</span>}</td>
                  <td><Badge tone="green">{t}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {section === 'paiements' && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Réf.</th><th>Utilisateur</th><th>Objet</th><th>Montant</th><th>Moyen</th><th>Date</th><th>Statut</th><th>Actions</th></tr></thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td><b>{p.id}</b></td>
                  <td>{p.user}</td>
                  <td className="muted">{p.type}</td>
                  <td><b className="gold">{fcfa(p.amount)}</b></td>
                  <td className="muted">{p.method}</td>
                  <td className="muted">{fmtShort(p.date)}</td>
                  <td><Badge tone={p.status === 'Payé' ? 'green' : p.status === 'En attente' ? 'gold' : 'terra'}>{p.status}</Badge></td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-outline btn-xs" onClick={() => notify(`Facture ${p.id} téléchargée 🧾`)}>Facture</button>
                      <button className="btn btn-dark btn-xs" onClick={() => notify(`Paiement ${p.id} marqué comme reçu ✓`)}>Marquer reçu</button>
                      <button className="btn btn-danger btn-xs" onClick={() => notify(`Paiement ${p.id} remboursé`)}>Rembourser</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {section === 'boost' && (
        <>
          <div className="split mb-24">
            <div className="panel">
              <div className="panel-title"><b>Campagnes Boost actives</b><Badge tone="green">1 218</Badge></div>
              <div className="stack gap-12">
                {[['Aïcha Kora — Profil', 24, 1000, 'En cours'], ['TOURÉ. — Collection Sable & Or', 72, 2700, 'En cours'],
                  ['Wax & Co — Produit Teranga', 24, 1000, 'En cours'], ['Nairobi Street — Événement', 168, 5500, 'En cours']].map(([n, d, p, st]) => (
                  <div key={n} className="list-row">
                    <span style={{ fontSize: 18 }}>🚀</span>
                    <div className="grow stack"><b style={{ fontSize: 13.5 }}>{n}</b><span className="tiny muted">Durée {d} h · {fcfa(p)}</span></div>
                    <Badge tone="green">{st}</Badge>
                    <button className="btn btn-danger btn-xs" onClick={() => notify(`Boost « ${n} » interrompu`)}>Arrêter</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="panel">
              <div className="panel-title"><b>Revenus Boost</b><Badge tone="gold">{fcfa(4200000)}</Badge></div>
              <div className="stack gap-16">
                {[['24 heures — 1 000 FCFA', 72], ['3 jours — 2 700 FCFA', 24], ['7 jours — 5 500 FCFA', 12]].map(([l, v]) => (
                  <div key={l}><div className="between small"><span className="muted">{l}</span><b>{v}%</b></div><Meter value={v} /></div>
                ))}
              </div>
              <div className="divider" />
              <div className="between small"><span className="muted">Panier moyen Boost</span><b className="gold">{fcfa(1840)}</b></div>
              <div className="between small mt-8"><span className="muted">Taux de rachat</span><b>64 %</b></div>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead><tr><th>Réf.</th><th>Utilisateur</th><th>Contenu</th><th>Durée</th><th>Montant</th><th>Vues</th><th>Statut</th></tr></thead>
              <tbody>
                {[['BST-4412', 'Aïcha Kora', 'Profil', '24 h', 1000, 1284, 'Terminé'],
                  ['BST-4411', 'TOURÉ.', 'Collection', '72 h', 2700, 4820, 'En cours'],
                  ['BST-4410', 'Sahara Loom', 'Produit', '24 h', 1000, 968, 'Terminé'],
                  ['BST-4409', 'Nairobi Street', 'Événement', '168 h', 5500, 12400, 'En cours'],
                  ['BST-4408', 'Adire House', 'Vidéo', '24 h', 1000, 742, 'Terminé']].map(([id, u, c, d, m, v, st]) => (
                  <tr key={id}>
                    <td><b>{id}</b></td>
                    <td>{u}</td>
                    <td className="muted">{c}</td>
                    <td className="muted">{d}</td>
                    <td>{fcfa(m)}</td>
                    <td>{shortNumber(v)}</td>
                    <td><Badge tone={st === 'En cours' ? 'green' : 'muted'}>{st}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="grid grid-3 mt-24">
        {[['🏦', 'Rapprochement Mobile Money', 'Les paiements MTN, Moov, Orange et Wave sont rapprochés automatiquement chaque nuit.'],
          ['📄', 'Conformité fiscale', 'Factures conformes UEMOA, export comptable mensuel au format SYSCOHADA.'],
          ['🔐', 'Sécurité des paiements', 'Aucune donnée bancaire n’est stockée sur nos serveurs (PCI-DSS niveau 1).']].map(([ico, t, d]) => (
          <div key={t} className="panel">
            <div style={{ fontSize: 22 }}>{ico}</div>
            <b style={{ display: 'block', marginTop: 8 }}>{t}</b>
            <p className="small mb-0 mt-8">{d}</p>
          </div>
        ))}
      </div>
    </>
  )
}

/* --------------------------- Référentiels ---------------------------- */
export function AdminReferentiel() {
  const { notify } = useApp()
  const [tab, setTab] = useState('Pays')
  const tabs = ['Pays', 'Catégories', 'Notifications', 'Paramètres']

  return (
    <>
      <DashHead title="Référentiels & paramètres" sub="Gérez les pays, les catégories, les notifications globales et les paramètres de la plateforme."
        children={<Btn size="sm" onClick={() => notify('Référentiel enregistré ✅')}>Enregistrer</Btn>} />

      <div className="panel mb-24"><Tabs tabs={tabs} value={tab} onChange={setTab} /></div>

      {tab === 'Pays' && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Pays</th><th>Villes couvertes</th><th>Utilisateurs</th><th>Devise</th><th>Paiement mobile</th><th>Statut</th><th>Actions</th></tr></thead>
            <tbody>
              {COUNTRIES.map((c, i) => (
                <tr key={c.name}>
                  <td><b>{c.flag} {c.name}</b></td>
                  <td className="muted">{c.cities.join(', ')}</td>
                  <td>{shortNumber(1200 + i * 640)}</td>
                  <td className="muted">{['XOF', 'XOF', 'XOF', 'NGN', 'GHS', 'XOF', 'XOF', 'XOF', 'XAF', 'CDF', 'KES', 'ZAR', 'RWF', 'MAD', 'TND', 'ETB', 'XAF', 'GNF', 'XOF', 'MGA'][i]}</td>
                  <td>{i % 4 === 3 ? <Badge tone="gold">Partiel</Badge> : <Badge tone="green">Disponible</Badge>}</td>
                  <td><Badge tone="green">Actif</Badge></td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-dark btn-xs" onClick={() => notify(`${c.name} — villes mises à jour`)}>Modifier</button>
                      <button className="btn btn-danger btn-xs" onClick={() => notify(`${c.name} désactivé`)}>Désactiver</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Catégories' && (
        <div className="grid grid-2">
          <div className="panel">
            <div className="panel-title"><b>Catégories de talents</b><Btn variant="outline" size="xs" onClick={() => notify('Nouvelle catégorie créée')}>+ Ajouter</Btn></div>
            <div className="stack gap-8">
              {TALENT_CATEGORIES.map((c) => (
                <div key={c.slug} className="list-row">
                  <span style={{ fontSize: 18 }}>{c.icon}</span>
                  <div className="grow stack"><b style={{ fontSize: 13.5 }}>{c.name}</b><span className="tiny muted">{c.count} profils · /{c.slug}</span></div>
                  <button className="btn btn-dark btn-xs" onClick={() => notify(`${c.name} modifiée`)}>Modifier</button>
                </div>
              ))}
            </div>
          </div>
          <div className="stack gap-16">
            <div className="panel">
              <div className="panel-title"><b>Catégories de produits</b><Btn variant="outline" size="xs" onClick={() => notify('Catégorie produit ajoutée')}>+ Ajouter</Btn></div>
              <div className="pill-row">{PRODUCT_CATEGORIES.map((c) => <span key={c} className="chip chip-soft">{c}</span>)}</div>
            </div>
            <div className="panel">
              <div className="panel-title"><b>Types d’événements</b></div>
              <div className="pill-row">{['Fashion Week', 'Défilés', 'Castings', 'Concours', 'Festivals', 'Expositions', 'Salons', 'Lancements'].map((c) => <span key={c} className="chip chip-soft">{c}</span>)}</div>
            </div>
            <div className="panel">
              <div className="panel-title"><b>Types d’opportunités</b></div>
              <div className="pill-row">{['Offre d’emploi', 'Casting', 'Stage', 'Concours', 'Collaboration', 'Appel à projets', 'Mission'].map((c) => <span key={c} className="chip chip-soft">{c}</span>)}</div>
            </div>
            <div className="panel">
              <div className="panel-title"><b>Formules d’abonnement</b></div>
              <div className="stack gap-8 small">
                {[['Horizon Free', 'Gratuit'], ['Horizon Starter', '5 000 FCFA'], ['Horizon Pro', '10 000 FCFA'], ['Horizon Premium', '20 000 FCFA']].map(([n, p]) => (
                  <div key={n} className="between"><span className="muted">{n}</span><b>{p}</b></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'Notifications' && (
        <div className="grid grid-2">
          <div className="panel">
            <h3>Envoyer une notification globale</h3>
            <div className="field"><label>Cible</label>
              <select className="select"><option>Tous les utilisateurs</option><option>Talents uniquement</option><option>Marques et boutiques</option><option>Partenaires et sponsors</option><option>Abonnés payants</option></select>
            </div>
            <div className="field"><label>Titre</label><input className="input" defaultValue="Nouvelle version de l’application mobile" /></div>
            <div className="field"><label>Message</label><textarea className="textarea" defaultValue="Découvrez les nouveautés : messagerie améliorée, statistiques détaillées et paiement Wave disponible." /></div>
            <div className="row gap-12">
              <Btn onClick={() => notify('Notification envoyée à 48 216 utilisateurs 🔔')}>Envoyer maintenant</Btn>
              <Btn variant="outline" onClick={() => notify('Notification programmée 📅')}>Programmer</Btn>
            </div>
          </div>
          <div className="panel">
            <h3>Dernières notifications envoyées</h3>
            <div className="stack gap-12">
              {notifications.slice(0, 5).map((n) => (
                <div key={n.id} className="list-row">
                  <span style={{ fontSize: 17 }}>🔔</span>
                  <div className="grow stack"><b style={{ fontSize: 13.5 }}>{n.title}</b><span className="tiny muted">{n.text.slice(0, 60)}…</span></div>
                  <span className="tiny muted-2">{n.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'Paramètres' && (
        <div className="grid grid-2">
          <div className="panel">
            <h3>Paramètres généraux</h3>
            <div className="field"><label>Nom de la plateforme</label><input className="input" defaultValue="Horizon Afrique" /></div>
            <div className="form-grid">
              <div className="field"><label>Devise par défaut</label><select className="select"><option>FCFA (XOF)</option><option>USD</option><option>EUR</option></select></div>
              <div className="field"><label>Commission marketplace</label><input className="input" defaultValue="5 %" /></div>
            </div>
            <div className="form-grid">
              <div className="field"><label>Prix du Boost 24 h</label><input className="input" defaultValue="1 000 FCFA" /></div>
              <div className="field"><label>Commission par pays</label><select className="select"><option>Uniforme (5 %)</option><option>Par pays</option></select></div>
            </div>
            <div className="field"><label>Email de support</label><input className="input" defaultValue="support@horizonafrique.com" /></div>
            <Btn onClick={() => notify('Paramètres enregistrés ✅')}>Enregistrer</Btn>
          </div>
          <div className="panel">
            <h3>Modération & sécurité</h3>
            <div className="stack gap-12">
              {[['Validation manuelle des nouveaux profils', true], ['Vérification obligatoire des marques', true], ['Filtrage automatique des mots interdits', true], ['Modération des commentaires avant publication', false], ['Double authentification obligatoire (admin)', true]].map(([l, on]) => (
                <div key={l} className="list-row">
                  <div className="grow"><b style={{ fontSize: 13.5 }}>{l}</b></div>
                  <button className={`switch ${on ? 'on' : ''}`} onClick={() => notify(`${l} — ${on ? 'désactivé' : 'activé'}`)} />
                </div>
              ))}
            </div>
            <div className="divider" />
            <h4>Journal d’activité admin</h4>
            <div className="stack gap-8 small">
              {[['Awa Sossou', 'a validé 12 profils', 'il y a 2 h'], ['Kwesi Ampofo', 'a supprimé 3 contenus', 'il y a 5 h'], ['Système', 'sauvegarde quotidienne terminée', 'hier']].map(([w, a, t2]) => (
                <div key={a} className="between"><span className="muted"><b style={{ color: 'var(--text)' }}>{w}</b> {a}</span><span className="tiny muted-2">{t2}</span></div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
