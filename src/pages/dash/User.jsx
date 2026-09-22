import { useState } from 'react'
import { Link } from 'react-router-dom'
import DashShell, { DashHead } from './Shell.jsx'
import {
  Avatar, Badge, Btn, CreationTile, EmptyState, EventCard, Meter, Modal, OpportunityRow, ProductCard,
  SectionHead, Stat, Stars, Tabs, VideoCard, useApp,
} from '../../components/ui.jsx'
import {
  AVAILABILITY, COUNTRIES, IMG, STYLES, TALENT_CATEGORIES, collaborations, conversations, creations,
  currentUser, events, fcfa, fmtDate, fmtShort, notifications, opportunities, orders, plans, productList,
  shortNumber, stats, talents, videos,
} from '../../data.js'

export { DashShell }

/* =====================================================================
   32. TABLEAU DE BORD
   ===================================================================== */
export function TableauDeBord() {
  const { notify } = useApp()
  const max = Math.max(...stats.series)

  return (
    <>
      <DashHead title={`Bonjour ${currentUser.firstName} 👋`} sub="Voici ce qui se passe sur votre espace aujourd’hui."
        children={<><Btn variant="outline" size="sm" to="/tableau-de-bord/portfolio">Ajouter une création</Btn><Btn size="sm" to="/tableau-de-bord/boost">🚀 Booster</Btn></>} />

      <div className="grid grid-4 mb-24">
        {stats.overview.map((s) => <Stat key={s.label} {...s} />)}
      </div>

      <div className="split mb-24">
        <div className="panel">
          <div className="panel-title">
            <b>Évolution de la visibilité</b>
            <span className="tiny muted-2">12 derniers mois</span>
          </div>
          <div className="bars">
            {stats.series.map((v, i) => (
              <div key={i}>
                <i style={{ height: `${(v / max) * 100}%` }} />
                <span>{stats.months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="stack gap-16">
          <div className="panel">
            <div className="panel-title"><b>Objectifs du mois</b><Badge tone="gold">68 %</Badge></div>
            <div className="stack gap-16">
              {[['Abonnés (+1 500)', 78], ['Créations publiées (8)', 62], ['Collaborations (3)', 66], ['Boosts utilisés (3)', 33]].map(([l, v]) => (
                <div key={l}>
                  <div className="between small"><span className="muted">{l}</span><b>{v}%</b></div>
                  <Meter value={v} />
                </div>
              ))}
            </div>
          </div>
          <div className="panel">
            <div className="panel-title"><b>Prochain événement</b></div>
            <div className="row gap-12">
              <img src={events[2].poster} alt="" className="ratio-1" style={{ width: 62, borderRadius: 11 }} />
              <div className="stack">
                <b style={{ fontSize: 13.5 }}>{events[2].name}</b>
                <span className="tiny muted">{fmtShort(events[2].start)} · {events[2].city}</span>
              </div>
            </div>
            <Btn to={`/evenements/${events[2].id}`} variant="outline" size="sm" className="btn-block mt-16">Voir l’événement</Btn>
          </div>
        </div>
      </div>

      <div className="grid grid-2 mb-24">
        <div className="panel">
          <div className="panel-title"><b>Demandes de collaboration</b><Link to="/tableau-de-bord/collaborations" className="link-arrow">Tout voir →</Link></div>
          <div className="stack gap-12">
            {collaborations.received.map((c) => (
              <div key={c.id} className="list-row">
                <Avatar src={IMG.people[c.id.length + 1]} size="sm" />
                <div className="grow stack">
                  <b style={{ fontSize: 13.5 }}>{c.name}</b>
                  <span className="tiny muted">{c.type} · {fcfa(Number(c.budget.replace(/\D/g, '')))}</span>
                </div>
                <Btn size="xs" variant="primary" onClick={() => notify(`Collaboration avec ${c.name} acceptée ✅`)}>Accepter</Btn>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-title"><b>Publications populaires</b><Link to="/tableau-de-bord/statistiques" className="link-arrow">Statistiques →</Link></div>
          <div className="stack gap-12">
            {stats.topPosts.map(([title, views, likes, shares]) => (
              <div key={title} className="between">
                <div className="stack">
                  <b style={{ fontSize: 13.5 }}>{title}</b>
                  <span className="tiny muted-2">👁 {shortNumber(views)} · ♥ {likes} · ↗ {shares}</span>
                </div>
                <Badge tone="indigo">Top</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title"><b>Dernières notifications</b><Link to="/tableau-de-bord/notifications" className="link-arrow">Tout voir →</Link></div>
        <div className="stack gap-12">
          {notifications.slice(0, 4).map((n) => (
            <div key={n.id} className="row gap-12">
              <Avatar src={IMG.people[2]} size="xs" />
              <div className="grow stack"><b style={{ fontSize: 13 }}>{n.title}</b><span className="tiny muted">{n.text}</span></div>
              <span className="tiny muted-2 nowrap">{n.time}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

/* =====================================================================
   33. PAGE MON PROFIL
   ===================================================================== */
export function MonProfil() {
  const { notify } = useApp()
  const [form, setForm] = useState({
    firstName: currentUser.firstName, lastName: currentUser.lastName, pro: currentUser.pro,
    bio: 'Maison de couture béninoise spécialisée dans le wax chic, les pièces de soirée et les collections capsules produites en séries limitées.',
    job: 'Styliste', specialty: 'Wax chic', city: 'Cotonou', country: 'Bénin',
    email: currentUser.email, phone: currentUser.phone, instagram: '@aichakora', tiktok: '@aichakora', website: 'maisonkora.africa',
    availability: AVAILABILITY[0], style: 'Wax chic',
  })
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <>
      <DashHead title="Mon profil" sub="Gérez les informations visibles par la communauté et les marques."
        children={<Btn size="sm" onClick={() => notify('Profil mis à jour ✅')}>Enregistrer les modifications</Btn>} />

      <div className="split">
        <div className="stack gap-24">
          <div className="panel">
            <h2 className="h-sub">Informations personnelles</h2>
            <div className="row gap-16 mb-24">
              <Avatar src={currentUser.avatar} size="xl" ring />
              <div className="stack gap-8">
                <div className="row gap-8"><Btn variant="outline" size="sm">Changer la photo</Btn><Btn variant="ghost" size="sm">Supprimer</Btn></div>
                <span className="tiny muted-2">JPG ou PNG, 4 Mo maximum. 400 × 400 px recommandé.</span>
              </div>
            </div>
            <div className="form-grid">
              <div className="field"><label>Prénom</label><input className="input" value={form.firstName} onChange={set('firstName')} /></div>
              <div className="field"><label>Nom</label><input className="input" value={form.lastName} onChange={set('lastName')} /></div>
            </div>
            <div className="field"><label>Nom professionnel / structure</label><input className="input" value={form.pro} onChange={set('pro')} /></div>
            <div className="field"><label>Biographie</label><textarea className="textarea" value={form.bio} onChange={set('bio')} /><span className="hint">300 caractères maximum conseillés.</span></div>
            <div className="form-grid">
              <div className="field"><label>Profession</label>
                <select className="select" value={form.job} onChange={set('job')}>{['Styliste', 'Designer', 'Mannequin', 'Photographe', 'Artisan', 'Artiste', 'Maquilleuse', 'Coiffeur'].map((j) => <option key={j}>{j}</option>)}</select>
              </div>
              <div className="field"><label>Spécialité</label>
                <select className="select" value={form.specialty} onChange={set('specialty')}>{['Wax chic', 'Contemporain', 'Haute couture', 'Streetwear', 'Bijoux', 'Vannerie'].map((s) => <option key={s}>{s}</option>)}</select>
              </div>
            </div>
            <div className="form-grid">
              <div className="field"><label>Pays</label>
                <select className="select" value={form.country} onChange={set('country')}>{COUNTRIES.map((c) => <option key={c.name}>{c.name}</option>)}</select>
              </div>
              <div className="field"><label>Ville</label><input className="input" value={form.city} onChange={set('city')} /></div>
            </div>
            <div className="form-grid">
              <div className="field"><label>Style signature</label>
                <select className="select" value={form.style} onChange={set('style')}>{STYLES.map((s) => <option key={s}>{s}</option>)}</select>
              </div>
              <div className="field"><label>Disponibilité</label>
                <select className="select" value={form.availability} onChange={set('availability')}>{AVAILABILITY.map((s) => <option key={s}>{s}</option>)}</select>
              </div>
            </div>
          </div>

          <div className="panel">
            <h2 className="h-sub">Coordonnées</h2>
            <div className="form-grid">
              <div className="field"><label>Adresse email</label><input className="input" value={form.email} onChange={set('email')} /></div>
              <div className="field"><label>Téléphone</label><input className="input" value={form.phone} onChange={set('phone')} /></div>
            </div>
            <div className="form-grid-3">
              <div className="field"><label>Instagram</label><input className="input" value={form.instagram} onChange={set('instagram')} /></div>
              <div className="field"><label>TikTok</label><input className="input" value={form.tiktok} onChange={set('tiktok')} /></div>
              <div className="field"><label>Site web</label><input className="input" value={form.website} onChange={set('website')} /></div>
            </div>
          </div>
        </div>

        <aside className="stack gap-16">
          <div className="panel">
            <h2 className="h-sub">Aperçu public</h2>
            <img src={IMG.garment[0]} alt="" className="ratio-16 mb-16" />
            <div className="row gap-12">
              <Avatar src={currentUser.avatar} size="md" ring />
              <div className="stack"><b>{form.firstName} {form.lastName}</b><span className="tiny muted">{form.job} · {form.country}</span></div>
            </div>
            <p className="small mt-16">{form.bio.slice(0, 120)}…</p>
            <Btn to="/talent/tal-1" variant="outline" size="sm" className="btn-block">Voir mon profil public</Btn>
          </div>
          <div className="panel">
            <h2 className="h-sub">Complétion du profil</h2>
            <div className="between mb-8"><span className="small muted">Progression</span><b className="gold">85 %</b></div>
            <Meter value={85} />
            <div className="stack gap-8 small mt-16">
              {[['Photo de profil', true], ['Biographie', true], ['Portfolio (6/8 visuels)', false], ['Réseaux sociaux', true], ['Vérification d’identité', false]].map(([l, ok]) => (
                <div key={l} className="between">
                  <span className="muted">{l}</span>
                  <span style={{ color: ok ? 'var(--green)' : 'var(--terra)' }}>{ok ? '✓' : '!'}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="panel" style={{ background: 'linear-gradient(135deg, rgba(227,176,75,0.14), rgba(74,95,168,0.12))' }}>
            <h3 className="card-h">Devenir profil vérifié</h3>
            <p className="small">Obtenez le badge ✓ et jusqu’à 3× plus de demandes de collaboration.</p>
            <Btn to="/tableau-de-bord/abonnement" size="sm" className="btn-block">Passer à Horizon Pro</Btn>
          </div>
        </aside>
      </div>
    </>
  )
}

/* =====================================================================
   34. PAGE PORTFOLIO
   ===================================================================== */
export function Portfolio() {
  const { notify } = useApp()
  const [items, setItems] = useState(currentUser ? creations.slice(0, 8) : [])
  const [modal, setModal] = useState(false)
  const [edit, setEdit] = useState(null)
  const [tab, setTab] = useState('Tous les visuels')
  const cols = { 'Tous les visuels': items, 'Photos': items.slice(0, 5), 'Vidéos': [], 'Créations': items.slice(2), 'Collections': [] }
  const list = cols[tab] ?? items

  const openNew = () => { setEdit(null); setModal(true) }
  const remove = (id) => { setItems((s) => s.filter((i) => i.id !== id)); notify('Élément supprimé du portfolio') }

  return (
    <>
      <DashHead title="Mon portfolio" sub="Ajoutez photos, vidéos, créations et collections pour construire votre book professionnel."
        children={<><Btn variant="outline" size="sm" onClick={() => setModal(true)}>Créer une collection</Btn><Btn size="sm" onClick={openNew}>+ Ajouter un visuel</Btn></>} />

      <div className="panel mb-24">
        <div className="between wrap gap-16">
          <Tabs tabs={['Tous les visuels', 'Photos', 'Vidéos', 'Créations', 'Collections']} value={tab} onChange={setTab} />
          <span className="tiny muted-2">{list.length} élément(s)</span>
        </div>
      </div>

      <div className="grid grid-4">
        {list.map((c) => (
          <div key={c.id} className="card">
            <div className="card-media card-media-tall">
              <img src={c.image} alt={c.title} loading="lazy" />
              <div className="media-top"><Badge tone="muted">{c.category}</Badge></div>
            </div>
            <div className="card-pad">
              <span className="row gap-8"><span className="card-title mb-0">{c.title}</span></span>
              <div className="between tiny muted-2 mt-8"><span>♥ {c.likes}</span><span>👁 {shortNumber(c.views)}</span></div>
            </div>
            <div className="card-foot">
              <button className="btn btn-dark btn-xs" onClick={() => { setEdit(c); setModal(true) }}>Modifier</button>
              <button className="btn btn-danger btn-xs" onClick={() => remove(c.id)}>Supprimer</button>
            </div>
          </div>
        ))}
        <button className="card card-pad center-text" style={{ borderStyle: 'dashed', minHeight: 280 }} onClick={openNew}>
          <div>
            <div style={{ fontSize: 30 }}>＋</div>
            <b>Ajouter un élément</b>
            <p className="small mb-0 mt-8">Photo, vidéo ou création</p>
          </div>
        </button>
      </div>

      <div className="grid grid-3 section-sm">
        {[['📷', 'Ajouter une photo', 'JPG, PNG — 5 Mo max'], ['🎬', 'Ajouter une vidéo', 'MP4 — 200 Mo max, 3 min'], ['🧵', 'Créer une collection', 'Regroupez vos pièces par thème']].map(([ico, t, d]) => (
          <button key={t} className="panel" style={{ textAlign: 'left' }} onClick={openNew}>
            <div style={{ fontSize: 24 }}>{ico}</div>
            <b style={{ display: 'block', marginTop: 8 }}>{t}</b>
            <span className="tiny muted">{d}</span>
          </button>
        ))}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={edit ? 'Modifier l’élément' : 'Ajouter au portfolio'}
        footer={<><Btn onClick={() => { setModal(false); notify(edit ? 'Élément mis à jour ✅' : 'Élément ajouté au portfolio ✅') }}>{edit ? 'Enregistrer' : 'Ajouter'}</Btn><Btn variant="ghost" onClick={() => setModal(false)}>Annuler</Btn></>}>
        <div className="field"><label>Titre</label><input className="input" defaultValue={edit?.title || ''} placeholder="Ex : Robe « Azalaï »" /></div>
        <div className="form-grid">
          <div className="field"><label>Catégorie</label><select className="select">{['Mode', 'Art', 'Artisanat', 'Design', 'Décoration', 'Accessoires'].map((c) => <option key={c}>{c}</option>)}</select></div>
          <div className="field"><label>Type</label><select className="select"><option>Photo</option><option>Vidéo</option><option>Création</option><option>Collection</option></select></div>
        </div>
        <div className="field"><label>Description</label><textarea className="textarea" placeholder="Décrivez votre pièce, les matières et le contexte de création…" /></div>
        <div className="field">
          <label>Fichiers</label>
          <div className="row gap-12"><Btn variant="outline" size="sm">Téléverser</Btn><span className="tiny muted-2">Glissez-déposez ou cliquez pour choisir</span></div>
        </div>
        <label className="checkbox"><input type="checkbox" defaultChecked /> <span>Publier immédiatement dans Horizon Gallery</span></label>
      </Modal>
    </>
  )
}

/* =====================================================================
   35. PAGE PUBLICATIONS
   ===================================================================== */
export function MesPublications() {
  const { notify, likes } = useApp()
  const [text, setText] = useState('')
  const [scheduled, setScheduled] = useState(false)
  const [posts, setPosts] = useState([
    { id: 'pub1', text: 'La collection « Sable & Or » arrive le 3 octobre. 24 pièces, coton bio et broderies main.', img: IMG.garment[0], date: '2026-09-20', likes: 1284, comments: 96, shares: 214, views: 18420, status: 'Publiée' },
    { id: 'pub2', text: 'Coulisses d’atelier : trois semaines de travail, sept essayages, une robe.', img: IMG.atelier[0], date: '2026-09-16', likes: 964, comments: 62, shares: 118, views: 12100, status: 'Publiée' },
    { id: 'pub3', text: 'Ouverture des commandes sur mesure pour la saison 2027.', img: IMG.garment[3], date: '2026-09-11', likes: 742, comments: 51, shares: 90, views: 9800, status: 'Publiée' },
  ])

  const publish = () => {
    if (!text.trim()) return
    setPosts((p) => [{ id: `pub${Date.now()}`, text, img: null, date: new Date().toISOString().slice(0, 10), likes: 0, comments: 0, shares: 0, views: 0, status: 'Publiée' }, ...p])
    setText('')
    notify('Publication mise en ligne ✅')
  }

  return (
    <>
      <DashHead title="Mes publications" sub="Créez, programmez et suivez les performances de vos publications."
        children={<Btn size="sm" onClick={() => notify('Publication programmée 📅')}>📅 Programmer</Btn>} />

      <div className="panel mb-24">
        <h2 className="h-sub">Créer une publication</h2>
        <textarea className="textarea" placeholder="Que souhaitez-vous partager aujourd’hui ?" value={text} onChange={(e) => setText(e.target.value)} />
        <div className="between wrap gap-12 mt-12">
          <div className="pill-row">
            {['📷 Ajouter une image', '🎬 Ajouter une vidéo', '🧵 Collection', '🛍️ Produit'].map((l) => (
              <button key={l} className="chip chip-soft" onClick={() => notify(`${l.replace(/^\S+\s/, '')} — sélecteur de fichier simulé`)}>{l}</button>
            ))}
          </div>
          <Btn onClick={publish}>Publier</Btn>
        </div>
      </div>

      <div className="between mb-16">
        <span className="muted small">{posts.length} publications · {shortNumber(posts.reduce((n, p) => n + p.views, 0))} vues cumulées</span>
        <label className="checkbox" style={{ alignItems: 'center' }}>
          <input type="checkbox" checked={scheduled} onChange={(e) => setScheduled(e.target.checked)} />
          <span>Publication programmée</span>
        </label>
      </div>

      <div className="stack gap-16">
        {posts.map((p) => (
          <div key={p.id} className="panel">
            <div className="between mb-16">
              <div className="row gap-12">
                <Avatar src={currentUser.avatar} size="sm" />
                <div className="stack"><b style={{ fontSize: 13.5 }}>{currentUser.name}</b><span className="tiny muted-2">{fmtShort(p.date)}</span></div>
              </div>
              <Badge tone="green">{p.status}</Badge>
            </div>
            <p style={{ color: '#e7e4ee' }}>{p.text}</p>
            {p.img && <img src={p.img} alt="" className="ratio-16 mb-16" loading="lazy" />}
            <div className="between wrap">
              <div className="row gap-16 small muted-2">
                <span>♥ {p.likes}</span><span>💬 {p.comments}</span><span>↗ {p.shares}</span><span>👁 {shortNumber(p.views)}</span>
              </div>
              <div className="row gap-8">
                <button className="like-btn" onClick={() => notify('Statistiques détaillées disponibles prochainement 📈')}>Voir les interactions</button>
                <button className="like-btn" onClick={() => notify('Publication boostée 🚀')}>🚀 Booster</button>
                <button className="like-btn" onClick={() => { setPosts((s) => s.filter((x) => x.id !== p.id)); notify('Publication supprimée') }}>🗑️</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

/* =====================================================================
   MES CRÉATIONS
   ===================================================================== */
export function MesCreations() {
  const { notify } = useApp()
  const list = creations.slice(0, 6)

  return (
    <>
      <DashHead title="Mes créations" sub="Les pièces publiées dans Horizon Gallery et sur votre profil."
        children={<Btn size="sm" onClick={() => notify('Nouvelle création ajoutée 🎨')}>+ Ajouter une création</Btn>} />

      <div className="grid grid-4 mb-24">
        {[['Créations publiées', '6'], ['J’aime reçus', '14 820'], ['Vues', '48 210'], ['Enregistrements', '912']].map(([a, b]) => (
          <div key={a} className="kpi"><b>{b}</b><span>{a}</span></div>
        ))}
      </div>

      <div className="grid grid-4">
        {list.map((c) => (
          <div key={c.id} className="card">
            <div className="card-media card-media-tall">
              <img src={c.image} alt={c.title} loading="lazy" />
              <div className="media-top"><Badge tone="muted">{c.category}</Badge>{c.boost && <Badge tone="gold">✦ Boost</Badge>}</div>
            </div>
            <div className="card-pad">
              <b>{c.title}</b>
              <div className="between tiny muted-2 mt-8"><span>♥ {shortNumber(c.likes)}</span><span>👁 {shortNumber(c.views)}</span></div>
            </div>
            <div className="card-foot">
              <button className="btn btn-dark btn-xs" onClick={() => notify('Création modifiée ✏️')}>Modifier</button>
              <button className="btn btn-danger btn-xs" onClick={() => notify('Création supprimée')}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

/* =====================================================================
   MES VIDÉOS
   ===================================================================== */
export function MesVideos() {
  const { notify } = useApp()
  const list = videos.slice(0, 6)

  return (
    <>
      <DashHead title="Mes vidéos" sub="Défilés, tutoriels, backstage et présentations de collections."
        children={<Btn size="sm" onClick={() => notify('Vidéo téléversée 🎬 (simulation)')}>+ Téléverser une vidéo</Btn>} />

      <div className="grid grid-4 mb-24">
        {[['Vidéos', '6'], ['Vues totales', '182 400'], ['Durée moyenne', '8:12'], ['Taux de complétion', '62 %']].map(([a, b]) => (
          <div key={a} className="kpi"><b>{b}</b><span>{a}</span></div>
        ))}
      </div>

      <div className="grid grid-3">
        {list.map((v) => (
          <div key={v.id} className="card">
            <div className="video-thumb"><img src={v.thumb} alt="" loading="lazy" /><span className="play-btn">▶</span><span className="duration">{v.duration}</span></div>
            <div className="card-pad">
              <b style={{ fontSize: 14 }}>{v.title}</b>
              <div className="between tiny muted-2 mt-8"><span>👁 {shortNumber(v.views)}</span><span>{fmtShort(v.date)}</span></div>
            </div>
            <div className="card-foot">
              <button className="btn btn-dark btn-xs" onClick={() => notify('Vidéo modifiée ✏️')}>Modifier</button>
              <button className="btn btn-danger btn-xs" onClick={() => notify('Vidéo supprimée')}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

/* =====================================================================
   MES ÉVÉNEMENTS
   ===================================================================== */
export function MesEvenements() {
  const { notify } = useApp()
  return (
    <>
      <DashHead title="Mes événements" sub="Événements auxquels vous participez ou que vous organisez."
        children={<Btn size="sm" onClick={() => notify('Formulaire de création d’événement ouvert 📅')}>+ Créer un événement</Btn>} />

      <div className="panel mb-24">
        <div className="panel-title"><b>Événements que j’organise</b><Badge tone="gold">2</Badge></div>
        <div className="stack gap-16">
          {events.slice(2, 4).map((e) => (
            <div key={e.id} className="list-row">
              <img src={e.poster} alt="" className="ratio-1" style={{ width: 64, borderRadius: 11 }} />
              <div className="grow stack">
                <b style={{ fontSize: 14 }}>{e.name}</b>
                <span className="tiny muted">{fmtShort(e.start)} · {e.venue}, {e.city} · {e.participants} participants</span>
              </div>
              <div className="table-actions">
                <button className="btn btn-dark btn-xs" onClick={() => notify('Événement modifié ✏️')}>Modifier</button>
                <Link to={`/evenements/${e.id}`} className="btn btn-outline btn-xs">Voir</Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="panel-title"><b>Mes participations</b><Badge tone="indigo">3</Badge></div>
        <div className="grid grid-3">{events.slice(0, 3).map((e) => <EventCard key={e.id} e={e} />)}</div>
      </div>
    </>
  )
}

/* =====================================================================
   MES OPPORTUNITÉS
   ===================================================================== */
export function MesOpportunites() {
  const { notify } = useApp()
  return (
    <>
      <DashHead title="Mes opportunités" sub="Publiez des offres, castings, stages, concours ou appels à projets."
        children={<Btn size="sm" onClick={() => notify('Nouvelle opportunité publiée 💼')}>+ Publier une opportunité</Btn>} />

      <div className="grid grid-4 mb-24">
        {[['Opportunités actives', '4'], ['Candidatures reçues', '168'], ['Taux de réponse', '82 %'], ['Vues moyennes', '1 240']].map(([a, b]) => (
          <div key={a} className="kpi"><b>{b}</b><span>{a}</span></div>
        ))}
      </div>

      <div className="stack gap-12 mb-24">
        {opportunities.slice(0, 4).map((o) => (
          <div key={o.id} className="list-row">
            <div className="grow stack">
              <div className="row gap-8 wrap"><b>{o.title}</b><Badge tone="indigo">{o.type}</Badge>{o.featured && <Badge tone="gold">✦ Boost</Badge>}</div>
              <span className="tiny muted">{o.city}, {o.country} · date limite {fmtShort(o.deadline)} · {o.applicants} candidatures</span>
            </div>
            <div className="table-actions">
              <button className="btn btn-dark btn-xs" onClick={() => notify('Candidatures ouvertes 📂')}>Candidatures</button>
              <button className="btn btn-dark btn-xs" onClick={() => notify('Opportunité modifiée ✏️')}>Modifier</button>
              <button className="btn btn-danger btn-xs" onClick={() => notify('Opportunité clôturée')}>Clôturer</button>
            </div>
          </div>
        ))}
      </div>

      <div className="panel">
        <h2 className="h-sub">Candidatures récentes</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Candidat</th><th>Profil</th><th>Opportunité</th><th>Date</th><th>Statut</th><th>Actions</th></tr></thead>
            <tbody>
              {talents.slice(0, 5).map((t, i) => (
                <tr key={t.id}>
                  <td>
                    <div className="row gap-8"><Avatar src={t.avatar} size="xs" /><b>{t.name}</b></div>
                  </td>
                  <td className="muted">{t.job} · {t.city}</td>
                  <td className="muted">{opportunities[i % 4].title.slice(0, 28)}…</td>
                  <td className="muted">{fmtShort(new Date(Date.now() - i * 86400000))}</td>
                  <td><Badge tone={['green', 'indigo', 'terra'][i % 3]}>{['Retenue', 'À étudier', 'Nouvelle'][i % 3]}</Badge></td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-outline btn-xs" onClick={() => notify(`${t.name} — profil consulté`)}>Voir</button>
                      <button className="btn btn-dark btn-xs" onClick={() => notify(`Message envoyé à ${t.name} 💬`)}>Message</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

/* =====================================================================
   36. PAGE COLLABORATIONS
   ===================================================================== */
export function MesCollaborations() {
  const { notify } = useApp()
  const [tab, setTab] = useState('Demandes reçues')
  const tabs = ['Demandes reçues', 'Demandes envoyées', 'Collaborations en cours', 'Collaborations terminées']
  const groups = {
    'Demandes reçues': collaborations.received,
    'Demandes envoyées': collaborations.sent,
    'Collaborations en cours': collaborations.ongoing,
    'Collaborations terminées': collaborations.done,
  }
  const list = groups[tab]

  return (
    <>
      <DashHead title="Mes collaborations" sub="Gérez les demandes reçues, envoyées, en cours et terminées."
        children={<Btn size="sm" onClick={() => notify('Nouvelle demande de collaboration envoyée 🤝')}>+ Nouvelle demande</Btn>} />

      <div className="grid grid-4 mb-24">
        {[['Demandes reçues', collaborations.received.length, 3], ['Demandes envoyées', collaborations.sent.length, 0], ['En cours', collaborations.ongoing.length, 0], ['Terminées', collaborations.done.length, 0]].map(([a, b, c]) => (
          <div key={a} className="kpi">
            <div className="between"><span className="small muted">{a}</span>{c > 0 && <Badge tone="terra">{c} nouvelles</Badge>}</div>
            <b>{b}</b>
          </div>
        ))}
      </div>

      <div className="panel mb-24"><Tabs tabs={tabs} value={tab} onChange={setTab} /></div>

      <div className="stack gap-16">
        {list.map((c) => (
          <div key={c.id} className="panel">
            <div className="split-2">
              <div className="stack gap-12">
                <div className="row gap-12">
                  <div className="logo-mark" style={{ width: 44, height: 44, borderRadius: 13, fontSize: 15 }}>{c.name.slice(0, 2).toUpperCase()}</div>
                  <div className="stack">
                    <b>{c.name}</b>
                    <span className="tiny muted">{c.type} · demandé le {fmtShort(c.date)}</span>
                  </div>
                </div>
                <p className="small mb-0">{c.desc}</p>
                <div className="row gap-12 small muted">
                  <span>💰 {c.budget || '—'}</span>
                  {c.progress !== undefined && <span>📈 {c.progress} % réalisé</span>}
                  {c.note && <span>⭐ {c.note} / 5</span>}
                </div>
                {c.progress !== undefined && <Meter value={c.progress} />}
              </div>
              <div className="stack gap-12" style={{ justifyContent: 'center' }}>
                {tab === 'Demandes reçues' && (
                  <div className="row gap-8 wrap">
                    <Btn size="sm" onClick={() => notify(`Collaboration avec ${c.name} acceptée ✅`)}>Accepter</Btn>
                    <Btn size="sm" variant="outline" onClick={() => notify('Demande refusée')}>Refuser</Btn>
                    <Btn size="sm" variant="dark" to="/tableau-de-bord/messages">Discuter</Btn>
                  </div>
                )}
                {tab === 'Demandes envoyées' && (
                  <div className="row gap-8 wrap">
                    <Badge tone="indigo">En attente de réponse</Badge>
                    <Btn size="sm" variant="dark" to="/tableau-de-bord/messages">Relancer</Btn>
                  </div>
                )}
                {tab === 'Collaborations en cours' && (
                  <div className="row gap-8 wrap">
                    <Btn size="sm" variant="outline" onClick={() => notify('Livrable marqué comme terminé ✅')}>Marquer terminé</Btn>
                    <Btn size="sm" variant="dark" to="/tableau-de-bord/messages">Discuter</Btn>
                  </div>
                )}
                {tab === 'Collaborations terminées' && (
                  <div className="row gap-8 wrap">
                    <Stars value={Number(c.note)} />
                    <Btn size="sm" variant="outline" onClick={() => notify('Avis publié ⭐')}>Laisser un avis</Btn>
                    <Btn size="sm" variant="dark" onClick={() => notify('Facture téléchargée 🧾')}>Facture</Btn>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

/* =====================================================================
   37. PAGE MESSAGES
   ===================================================================== */
export function Messages() {
  const { notify } = useApp()
  const [active, setActive] = useState(conversations[0])
  const [msgs, setMsgs] = useState(conversations[0].messages)
  const [text, setText] = useState('')
  const [q, setQ] = useState('')

  const openChat = (c) => { setActive(c); setMsgs(c.messages) }
  const send = () => {
    if (!text.trim()) return
    setMsgs((m) => [...m, { me: true, text, time: 'à l’instant' }])
    setText('')
  }

  return (
    <>
      <DashHead title="Messages" sub="Messagerie professionnelle : échangez avec les marques, talents et organisations."
        children={<Btn variant="outline" size="sm" onClick={() => notify('Nouvelle conversation créée ✉️')}>+ Nouveau message</Btn>} />

      <div className="chat">
        <div className="chat-list">
          <div style={{ padding: 14, borderBottom: '1px solid var(--line)' }}>
            <input className="input" placeholder="Rechercher une conversation…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          {conversations.filter((c) => !q || c.name.toLowerCase().includes(q.toLowerCase())).map((c) => (
            <div key={c.id} className={`chat-item ${active.id === c.id ? 'active' : ''}`} onClick={() => openChat(c)}>
              <div style={{ position: 'relative' }}>
                <Avatar src={c.avatar} size="md" />
                {c.online && <span style={{ position: 'absolute', bottom: 2, right: 2, width: 10, height: 10, borderRadius: '50%', background: 'var(--green)', border: '2px solid var(--surface)' }} />}
              </div>
              <div className="stack" style={{ minWidth: 0 }}>
                <div className="between">
                  <b style={{ fontSize: 13.5 }}>{c.name}</b>
                  <span className="tiny muted-2">{c.time}</span>
                </div>
                <span className="tiny muted" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 210 }}>{c.last}</span>
              </div>
              {c.unread > 0 && <span className="dot-badge" style={{ position: 'static', marginLeft: 'auto' }}>{c.unread}</span>}
            </div>
          ))}
        </div>

        <div className="chat-main">
          <div className="chat-head">
            <Avatar src={active.avatar} size="md" />
            <div className="stack">
              <b>{active.name}</b>
              <span className="tiny muted">{active.online ? 'En ligne' : 'Vu il y a 2 h'} · répond en moyenne en 2 h</span>
            </div>
            <div className="row gap-8" style={{ marginLeft: 'auto' }}>
              <button className="icon-btn" onClick={() => notify('Appel simulé 📞')}>📞</button>
              <button className="icon-btn" onClick={() => notify('Demande de collaboration envoyée 🤝')}>🤝</button>
            </div>
          </div>

          <div className="chat-body">
            {msgs.map((m, i) => (
              <div key={i} className={`bubble ${m.me ? 'me' : 'them'}`}>
                {m.text}
                <span className="t">{m.time}</span>
              </div>
            ))}
            {active.files?.length > 0 && (
              <div className="stack gap-8">
                {active.files.map((f) => (
                  <div key={f} className="bubble them row gap-8">
                    <span>📎</span><span className="small">{f}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="chat-input">
            <input className="input" placeholder="Écrire un message…" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} />
            <button className="icon-btn" onClick={() => notify('Pièce jointe ajoutée 📎')}>📎</button>
            <Btn onClick={send}>Envoyer</Btn>
          </div>
        </div>
      </div>
    </>
  )
}

/* =====================================================================
   38. PAGE NOTIFICATIONS
   ===================================================================== */
export function Notifications() {
  const { notify } = useApp()
  const [tab, setTab] = useState('Toutes')
  const types = ['Toutes', 'Abonnés', 'J’aime', 'Commentaires', 'Messages', 'Collaborations', 'Opportunités', 'Événements', 'Commandes']
  const list = tab === 'Toutes' ? notifications : notifications.filter((n) => n.title.toLowerCase().includes(tab.toLowerCase().slice(0, 4)))

  return (
    <>
      <DashHead title="Notifications" sub="Tout ce qui se passe sur votre compte et vos contenus."
        children={<><Btn variant="outline" size="sm" onClick={() => notify('Toutes les notifications marquées comme lues ✓')}>Tout marquer comme lu</Btn><Btn variant="dark" size="sm" to="/tableau-de-bord/parametres">Préférences</Btn></>} />

      <div className="panel mb-24"><Tabs tabs={types} value={tab} onChange={setTab} /></div>

      <div className="stack gap-12">
        {list.map((n) => (
          <div key={n.id} className="list-row" style={{ background: n.read ? undefined : 'rgba(227,176,75,0.05)' }}>
            <span style={{ fontSize: 19 }}>{{
              abonnes: '👥', likes: '♥', commentaires: '💬', messages: '✉️',
              collaborations: '🤝', opportunites: '💼', evenements: '📅', commandes: '🧾',
            }[n.type]}</span>
            <div className="grow stack">
              <b style={{ fontSize: 13.5 }}>{n.title}</b>
              <span className="small muted">{n.text}</span>
            </div>
            <span className="tiny muted-2 nowrap">{n.time}</span>
            {!n.read && <Badge tone="gold">Nouveau</Badge>}
          </div>
        ))}
      </div>
    </>
  )
}

/* =====================================================================
   39. PAGE STATISTIQUES
   ===================================================================== */
/* `embedded` : la page est affichée dans un espace (boutique, partenaire, sponsor) qui a
   déjà son propre titre h1 — on n'en ajoute pas un second. */
export function Statistiques({ embedded = false }) {
  const max = Math.max(...stats.series)
  return (
    <>
      {!embedded && <DashHead title="Statistiques" sub="Analysez la performance de votre profil, de vos contenus et de votre boutique."
        children={<><select className="input" aria-label="Période analysée" style={{ width: 150 }} defaultValue="30 derniers jours"><option>7 derniers jours</option><option>30 derniers jours</option><option>3 derniers mois</option><option>12 derniers mois</option></select><Btn variant="outline" size="sm">Exporter en CSV</Btn></>} />}
      {embedded && (
        <div className="between mb-16">
          <span className="muted small">Analysez la performance de votre activité sur la période choisie.</span>
          <select className="input" aria-label="Période analysée" style={{ width: 150 }} defaultValue="30 derniers jours"><option>7 derniers jours</option><option>30 derniers jours</option><option>3 derniers mois</option><option>12 derniers mois</option></select>
        </div>
      )}

      <div className="grid grid-4 mb-24">
        {stats.overview.map((s) => <Stat key={s.label} {...s} />)}
      </div>

      <div className="split mb-24">
        <div className="panel">
          <div className="panel-title"><b>Évolution de la visibilité</b><span className="tiny muted-2">vues du profil</span></div>
          <div className="bars">
            {stats.series.map((v, i) => <div key={i}><i style={{ height: `${(v / max) * 100}%` }} /><span>{stats.months[i]}</span></div>)}
          </div>
        </div>
        <div className="panel">
          <div className="panel-title"><b>Répartition des visiteurs</b></div>
          <div className="ratio-bar mb-16">
            <i style={{ width: '42%', background: 'var(--gold)' }} />
            <i style={{ width: '26%', background: 'var(--terra)' }} />
            <i style={{ width: '18%', background: 'var(--indigo)' }} />
            <i style={{ width: '14%', background: 'var(--green)' }} />
          </div>
          <div className="stack gap-10 small">
            {[['Bénin', '42 %', 'var(--gold)'], ['Nigeria', '26 %', 'var(--terra)'], ['Sénégal', '18 %', 'var(--indigo)'], ['Autres pays', '14 %', 'var(--green)']].map(([c, v, col]) => (
              <div key={c} className="between">
                <span className="row gap-8"><i style={{ width: 10, height: 10, borderRadius: 3, background: col, display: 'inline-block' }} />{c}</span>
                <b>{v}</b>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-2 mb-24">
        <div className="panel">
          <div className="panel-title"><b>Publications populaires</b><Link to="/tableau-de-bord/mes-publications" className="link-arrow">Gérer →</Link></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Publication</th><th>Vues</th><th>J’aime</th><th>Partages</th></tr></thead>
              <tbody>
                {stats.topPosts.map(([t, v, l, s]) => (
                  <tr key={t}><td><b>{t}</b></td><td>{shortNumber(v)}</td><td>{l}</td><td>{s}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <div className="panel-title"><b>Performance boutique</b><Badge tone="green">+18 %</Badge></div>
          <div className="grid grid-2 mb-16" style={{ gap: 12 }}>
            {stats.shop.sales.slice(0, 4).map((s) => (
              <div key={s.label} className="kpi"><b style={{ fontSize: 19 }}>{s.value}</b><span>{s.label}</span></div>
            ))}
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Produit</th><th>Ventes</th><th>Revenus</th></tr></thead>
              <tbody>
                {stats.shop.topProducts.map(([n, v, r]) => (
                  <tr key={n}><td><b>{n}</b></td><td>{v}</td><td>{fcfa(r)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title"><b>Engagement par type de contenu</b></div>
        <div className="grid grid-4">
          {[['Photos', 92], ['Vidéos', 78], ['Produits', 65], ['Publications texte', 48]].map(([l, v]) => (
            <div key={l}>
              <div className="between small"><span className="muted">{l}</span><b>{v}%</b></div>
              <Meter value={v} />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

/* =====================================================================
   MON ABONNEMENT
   ===================================================================== */
export function MonAbonnement() {
  const { plan, setPlan, notify } = useApp()
  const current = plans.find((p) => p.name === plan) || plans[2]

  return (
    <>
      <DashHead title="Mon abonnement" sub="Gérez votre formule, vos moyens de paiement et vos factures."
        children={<Btn variant="outline" size="sm" onClick={() => notify('Factures téléchargées 🧾')}>Télécharger les factures</Btn>} />

      <div className="panel mb-24" style={{ background: 'linear-gradient(135deg, rgba(227,176,75,0.14), rgba(74,95,168,0.12))' }}>
        <div className="between wrap gap-24">
          <div>
            <Badge tone="gold">Formule actuelle</Badge>
            <h2 className="mt-8 mb-0">{current.name}</h2>
            <p className="mb-0 mt-8">
              {current.price === 0 ? 'Gratuit pour toujours' : `${fcfa(current.price)} par mois`} · prochain prélèvement le {fmtDate(new Date(Date.now() + 18 * 86400000))}
            </p>
          </div>
          <div className="row gap-12">
            <Btn onClick={() => notify('Redirection vers la mise à niveau ⭐')}>Améliorer ma formule</Btn>
            <Btn variant="outline" onClick={() => { setPlan('Horizon Free'); notify('Abonnement annulé à la fin de la période') }}>Résilier</Btn>
          </div>
        </div>
        <div className="grid grid-4 mt-24">
          {[['Publications', 'Illimité'], ['Portfolio', '100 visuels'], ['Boosts offerts', '3 / mois'], ['Commission', '5 %']].map(([a, b]) => (
            <div key={a} className="kpi"><b style={{ fontSize: 18 }}>{b}</b><span>{a}</span></div>
          ))}
        </div>
      </div>

      <SectionHead eyebrow="Changer de formule" title="Toutes les formules disponibles" />
      <div className="grid grid-4 mb-32">
        {plans.map((p) => (
          <div key={p.name} className={`price-card ${p.name === plan ? 'featured' : ''}`}>
            {p.badge && <div style={{ position: 'absolute', top: 18, right: 18 }}><Badge tone="gold">{p.badge}</Badge></div>}
            <span className="upper muted-2">{p.tagline}</span>
            <h2 className="mt-8 h-sub">{p.name}</h2>
            <div className="amount" style={{ fontSize: 30 }}>{p.price === 0 ? 'Gratuit' : fcfa(p.price)}</div>
            <ul>{p.features.slice(0, 4).map((f) => <li key={f}>{f}</li>)}</ul>
            <Btn variant={p.name === plan ? 'dark' : 'outline'} className="btn-block" onClick={() => { setPlan(p.name); notify(`Formule ${p.name} activée ✅`) }}>
              {p.name === plan ? '✓ Formule actuelle' : 'Choisir cette formule'}
            </Btn>
          </div>
        ))}
      </div>

      <div className="grid grid-2">
        <div className="panel">
          <div className="panel-title"><b>Historique de facturation</b></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Date</th><th>Formule</th><th>Montant</th><th>Moyen</th><th>Statut</th></tr></thead>
              <tbody>
                {[0, 1, 2, 3].map((i) => (
                  <tr key={i}>
                    <td>{fmtShort(new Date(Date.now() - i * 30 * 86400000))}</td>
                    <td>{plan}</td>
                    <td>{fcfa(current.price || 10000)}</td>
                    <td className="muted">Mobile Money</td>
                    <td><Badge tone="green">Payé</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="panel">
          <div className="panel-title"><b>Moyen de paiement</b></div>
          <div className="stack gap-12">
            <div className="list-row">
              <span style={{ fontSize: 19 }}>📱</span>
              <div className="grow stack"><b style={{ fontSize: 13.5 }}>MTN Mobile Money</b><span className="tiny muted">+229 96 45 12 88 · par défaut</span></div>
              <Badge tone="green">Actif</Badge>
            </div>
            <div className="list-row">
              <span style={{ fontSize: 19 }}>💳</span>
              <div className="grow stack"><b style={{ fontSize: 13.5 }}>Visa •••• 4242</b><span className="tiny muted">Expire 09/2028</span></div>
              <Btn variant="ghost" size="xs">Retirer</Btn>
            </div>
            <Btn variant="outline" size="sm" onClick={() => notify('Nouveau moyen de paiement ajouté 💳')}>+ Ajouter un moyen de paiement</Btn>
          </div>
        </div>
      </div>
    </>
  )
}

/* =====================================================================
   MON BOOST
   ===================================================================== */
export function MonBoost() {
  const { notify, setBoost } = useApp()
  const [tab, setTab] = useState('Campagnes actives')

  const active = [
    { name: 'Profil — Aïcha Kora', type: 'Profil', ends: '2026-09-23', views: 1284, clicks: 214, spent: 1000, status: 'En cours' },
    { name: 'Robe « Azalaï »', type: 'Produit', ends: '2026-09-24', views: 968, clicks: 143, spent: 1000, status: 'En cours' },
  ]
  const done = [
    { name: 'Collection Sable & Or', type: 'Collection', ends: '2026-09-10', views: 4820, clicks: 612, spent: 2700, status: 'Terminé' },
    { name: 'Coulisses atelier', type: 'Publication', ends: '2026-08-28', views: 2310, clicks: 288, spent: 1000, status: 'Terminé' },
    { name: 'Défilé Bénin Fashion Show', type: 'Événement', ends: '2026-08-15', views: 3120, clicks: 402, spent: 2700, status: 'Terminé' },
  ]
  const list = tab === 'Campagnes actives' ? active : done

  return (
    <>
      <DashHead title="Horizon Boost" sub="Vos campagnes de visibilité : suivez les performances et relancez en un clic."
        children={<Btn size="sm" to="/horizon-boost">+ Nouveau Boost — 1 000 FCFA</Btn>} />

      <div className="grid grid-4 mb-24">
        {[['Boosts offerts', '3 / 3'], ['Vues générées', '12 502'], ['Clics', '1 659'], ['Budget dépensé', fcfa(8400)]].map(([a, b]) => (
          <div key={a} className="kpi"><b>{b}</b><span>{a}</span></div>
        ))}
      </div>

      <div className="panel mb-24"><Tabs tabs={['Campagnes actives', 'Historique']} value={tab} onChange={setTab} /></div>

      <div className="table-wrap mb-32">
        <table>
          <thead><tr><th>Contenu</th><th>Type</th><th>Fin</th><th>Vues</th><th>Clics</th><th>Dépensé</th><th>Statut</th><th>Actions</th></tr></thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.name}>
                <td><b>{c.name}</b></td>
                <td><Badge tone="indigo">{c.type}</Badge></td>
                <td className="muted">{fmtShort(c.ends)}</td>
                <td>{shortNumber(c.views)}</td>
                <td>{c.clicks}</td>
                <td>{fcfa(c.spent)}</td>
                <td><Badge tone={c.status === 'En cours' ? 'green' : 'muted'}>{c.status}</Badge></td>
                <td>
                  <div className="table-actions">
                    <button className="btn btn-outline btn-xs" onClick={() => notify('Rapport de performance téléchargé 📈')}>Rapport</button>
                    <button className="btn btn-dark btn-xs" onClick={() => { setBoost({ target: c.type.toLowerCase(), duration: 24, content: c.name }); notify('Boost relancé 🚀') }}>Relancer</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-2">
        <div className="panel">
          <h2 className="h-sub">Ce qui fonctionne le mieux</h2>
          <div className="stack gap-16">
            {[['Produits', 92], ['Collections', 78], ['Profil', 64], ['Publications', 52]].map(([l, v]) => (
              <div key={l}><div className="between small"><span className="muted">{l}</span><b>{v}%</b></div><Meter value={v} /></div>
            ))}
          </div>
        </div>
        <div className="panel" style={{ background: 'linear-gradient(135deg, rgba(227,176,75,0.14), rgba(196,85,46,0.1))' }}>
          <h2 className="h-sub">Conseil Horizon</h2>
          <p className="small">Vos produits boostés génèrent 3× plus de clics que vos publications. Programmez un Boost de 3 jours sur votre prochaine collection pour maximiser les ventes du lancement.</p>
          <Btn size="sm" to="/horizon-boost" className="btn-block">Programmer un Boost de 3 jours</Btn>
        </div>
      </div>
    </>
  )
}

/* =====================================================================
   48. PARAMÈTRES
 ===================================================================== */
export function Parametres() {
  const { notify } = useApp()
  const [tab, setTab] = useState('Informations personnelles')
  const [switches, setSwitches] = useState({ email: true, push: true, sms: false, news: true, publique: true, messages: true, offres: false, deuxfa: false })
  const t = (k) => setSwitches((s) => ({ ...s, [k]: !s[k] }))

  const tabs = ['Informations personnelles', 'Sécurité', 'Notifications', 'Confidentialité', 'Langue', 'Abonnement', 'Paiement']

  return (
    <>
      <DashHead title="Paramètres" sub="Gérez votre compte, votre sécurité et vos préférences."
        children={<Btn size="sm" onClick={() => notify('Paramètres enregistrés ✅')}>Enregistrer</Btn>} />

      <div className="panel mb-24"><Tabs tabs={tabs} value={tab} onChange={setTab} /></div>

      {tab === 'Informations personnelles' && (
        <div className="panel">
          <h2 className="h-sub">Informations personnelles</h2>
          <div className="form-grid">
            <div className="field"><label>Prénom</label><input className="input" defaultValue={currentUser.firstName} /></div>
            <div className="field"><label>Nom</label><input className="input" defaultValue={currentUser.lastName} /></div>
          </div>
          <div className="form-grid">
            <div className="field"><label>Email</label><input className="input" defaultValue={currentUser.email} /></div>
            <div className="field"><label>Téléphone</label><input className="input" defaultValue={currentUser.phone} /></div>
          </div>
          <div className="form-grid">
            <div className="field"><label>Pays</label><select className="select">{COUNTRIES.map((c) => <option key={c.name}>{c.name}</option>)}</select></div>
            <div className="field"><label>Ville</label><input className="input" defaultValue={currentUser.city} /></div>
          </div>
          <div className="divider" />
          <h3 className="card-h">Suppression du compte</h3>
          <p className="small">La suppression est définitive : profil, publications et statistiques seront effacés sous 30 jours.</p>
          <Btn variant="danger" size="sm" onClick={() => notify('Demande de suppression enregistrée — un email de confirmation vous a été envoyé')}>Demander la suppression de mon compte</Btn>
        </div>
      )}

      {tab === 'Sécurité' && (
        <div className="grid grid-2">
          <div className="panel">
            <h2 className="h-sub">Mot de passe</h2>
            <div className="field"><label>Mot de passe actuel</label><input className="input" type="password" placeholder="••••••••" /></div>
            <div className="field"><label>Nouveau mot de passe</label><input className="input" type="password" placeholder="8 caractères minimum" /></div>
            <div className="field"><label>Confirmer le nouveau mot de passe</label><input className="input" type="password" /></div>
            <Btn size="sm" onClick={() => notify('Mot de passe mis à jour 🔒')}>Mettre à jour le mot de passe</Btn>
          </div>
          <div className="panel">
            <h2 className="h-sub">Double authentification</h2>
            <div className="list-row mb-16">
              <span style={{ fontSize: 19 }}>🔐</span>
              <div className="grow stack"><b style={{ fontSize: 13.5 }}>Validation en deux étapes</b><span className="tiny muted">Code envoyé par SMS à {currentUser.phone}</span></div>
              <button className={`switch ${switches.deuxfa ? 'on' : ''}`} onClick={() => t('deuxfa')} />
            </div>
            <h3 className="mt-24 card-h">Sessions actives</h3>
            <div className="stack gap-12">
              {[['Chrome — Cotonou, Bénin', 'Session actuelle'], ['Application mobile — Android', 'il y a 2 jours']].map(([d, t2]) => (
                <div key={d} className="between small">
                  <span className="muted">{d}</span><span className="tiny muted-2">{t2}</span>
                </div>
              ))}
            </div>
            <Btn variant="outline" size="sm" className="mt-16" onClick={() => notify('Toutes les autres sessions ont été déconnectées')}>Déconnecter les autres sessions</Btn>
          </div>
        </div>
      )}

      {tab === 'Notifications' && (
        <div className="panel">
          <h2 className="h-sub">Préférences de notification</h2>
          <div className="stack gap-12">
            {[['email', 'Notifications par email', 'Abonnés, j’aime, commentaires et messages'], ['push', 'Notifications push', 'Sur votre navigateur et votre application mobile'], ['sms', 'Notifications par SMS', 'Uniquement les messages importants'], ['news', 'Newsletter hebdomadaire', 'Sélection de la rédaction Horizon']].map(([k, l, d]) => (
              <div key={k} className="list-row">
                <div className="grow stack"><b style={{ fontSize: 13.5 }}>{l}</b><span className="tiny muted">{d}</span></div>
                <button className={`switch ${switches[k] ? 'on' : ''}`} onClick={() => t(k)} />
              </div>
            ))}
          </div>
          <div className="divider" />
          <h3 className="card-h">Recevoir des alertes pour</h3>
          <div className="pill-row">
            {['Nouveaux abonnés', 'J’aime', 'Commentaires', 'Messages', 'Collaborations', 'Opportunités', 'Événements', 'Commandes'].map((l) => <span key={l} className="chip chip-soft">{l}</span>)}
          </div>
        </div>
      )}

      {tab === 'Confidentialité' && (
        <div className="panel">
          <h2 className="h-sub">Confidentialité</h2>
          <div className="stack gap-12">
            {[['publique', 'Profil public', 'Votre profil apparaît dans les recherches et l’annuaire'], ['messages', 'Accepter les messages de tous', 'Sinon, seuls les profils vérifiés peuvent vous écrire'], ['offres', 'Partager mon email avec les marques', 'Pour recevoir des propositions de collaboration']].map(([k, l, d]) => (
              <div key={k} className="list-row">
                <div className="grow stack"><b style={{ fontSize: 13.5 }}>{l}</b><span className="tiny muted">{d}</span></div>
                <button className={`switch ${switches[k] ? 'on' : ''}`} onClick={() => t(k)} />
              </div>
            ))}
          </div>
          <div className="divider" />
          <h3 className="card-h">Mes données</h3>
          <div className="row gap-12">
            <Btn variant="outline" size="sm" onClick={() => notify('Export de vos données en préparation 📦')}>Exporter mes données</Btn>
            <Btn variant="ghost" size="sm">Consulter la politique de confidentialité</Btn>
          </div>
        </div>
      )}

      {tab === 'Langue' && (
        <div className="panel">
          <h2 className="h-sub">Langue et région</h2>
          <div className="form-grid">
            <div className="field"><label>Langue de l’interface</label><select className="select"><option>Français</option><option>English</option><option>Português</option><option>Swahili</option><option>العربية</option></select></div>
            <div className="field"><label>Devise d’affichage</label><select className="select"><option>FCFA (XOF)</option><option>Naira (NGN)</option><option>Cedi (GHS)</option><option>Dirham (MAD)</option><option>Dollar (USD)</option></select></div>
          </div>
          <div className="form-grid">
            <div className="field"><label>Format de date</label><select className="select"><option>JJ/MM/AAAA</option><option>MM/JJ/AAAA</option></select></div>
            <div className="field"><label>Fuseau horaire</label><select className="select"><option>GMT+1 — Afrique de l’Ouest</option><option>GMT+2</option><option>GMT+3</option></select></div>
          </div>
        </div>
      )}

      {tab === 'Abonnement' && (
        <div className="panel">
          <h2 className="h-sub">Abonnement</h2>
          <div className="between mb-16">
            <div className="stack"><b style={{ fontSize: 15 }}>{currentUser.plan}</b><span className="small muted">10 000 FCFA par mois · renouvellement automatique</span></div>
            <Badge tone="green">Actif</Badge>
          </div>
          <div className="row gap-12">
            <Btn to="/tableau-de-bord/abonnement" size="sm">Gérer mon abonnement</Btn>
            <Btn to="/abonnements" variant="outline" size="sm">Comparer les formules</Btn>
          </div>
        </div>
      )}

      {tab === 'Paiement' && (
        <div className="panel">
          <h2 className="h-sub">Moyens de paiement</h2>
          <div className="stack gap-12">
            <div className="list-row">
              <span style={{ fontSize: 19 }}>📱</span>
              <div className="grow stack"><b style={{ fontSize: 13.5 }}>MTN Mobile Money</b><span className="tiny muted">+229 96 45 12 88</span></div>
              <Badge tone="green">Par défaut</Badge>
            </div>
            <div className="list-row">
              <span style={{ fontSize: 19 }}>💳</span>
              <div className="grow stack"><b style={{ fontSize: 13.5 }}>Visa •••• 4242</b><span className="tiny muted">Expire 09/2028</span></div>
              <Btn variant="ghost" size="xs">Retirer</Btn>
            </div>
          </div>
          <Btn variant="outline" size="sm" className="mt-16" onClick={() => notify('Moyen de paiement ajouté 💳')}>+ Ajouter un moyen de paiement</Btn>
        </div>
      )}
    </>
  )
}
