import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Avatar, Badge, Btn, Chip, CreationTile, Crumbs, EmptyState, FilterBar, Modal, SectionHead, Tabs,
  TalentCard, VideoCard, useApp, useFilterState, ProductCard,
} from '../components/ui.jsx'
import {
  COUNTRIES, CREATION_CATEGORIES, IMG, VIDEO_CATEGORIES, creations, feedPosts, fmtShort, productList,
  shortNumber, talents, videos,
} from '../data.js'

/* =====================================================================
   13. PAGE CRÉATIONS
   ===================================================================== */
export function Creations() {
  const filters = useMemo(() => [
    { key: 'country', label: 'Pays', options: COUNTRIES.map((c) => c.name), get: (c) => c.country },
    { key: 'category', label: 'Catégorie', options: CREATION_CATEGORIES, get: (c) => c.category },
    { key: 'author', label: 'Créateur', options: [...new Set(creations.map((c) => c.author))], get: (c) => c.author },
    { key: 'date', label: 'Date', options: ['7 derniers jours', '30 derniers jours', 'Cette année'], get: (c) => (new Date() - new Date(c.date)) / 86400000 < 7 ? '7 derniers jours' : (new Date() - new Date(c.date)) / 86400000 < 30 ? '30 derniers jours' : 'Cette année' },
  ], [])
  const { state, setState, result } = useFilterState(filters, creations)
  const [sort, setSort] = useState('Popularité')
  const sorted = useMemo(() => {
    const r = [...result]
    if (sort === 'Popularité') r.sort((a, b) => b.likes - a.likes)
    if (sort === 'Récentes') r.sort((a, b) => new Date(b.date) - new Date(a.date))
    if (sort === 'Vues') r.sort((a, b) => b.views - a.views)
    return r
  }, [result, sort])

  return (
    <div className="container">
      <Crumbs items={[{ label: 'Créations' }]} />
      <div className="page-head">
        <h1>Créations</h1>
        <p>Toutes les créations publiées sur Horizon Afrique : mode, art, artisanat, design, décoration et accessoires.</p>
      </div>

      <div className="pill-row mb-16">
        {['Toutes', ...CREATION_CATEGORIES].map((c) => (
          <Chip key={c} active={c === 'Toutes' ? state.category === 'Tous' : state.category === c} onClick={() => setState({ ...state, category: c === 'Toutes' ? 'Tous' : c })}>{c}</Chip>
        ))}
      </div>

      <FilterBar filters={filters} state={state} setState={setState} count={sorted.length}>
        <select aria-label="Trier les créations" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option>Popularité</option><option>Récentes</option><option>Vues</option>
        </select>
      </FilterBar>

      <div className="grid grid-4">
        {sorted.map((c) => <CreationTile key={c.id} c={c} />)}
      </div>
      {sorted.length === 0 && <EmptyState title="Aucune création" sub="Modifiez les filtres pour découvrir d’autres créations." />}

      <section className="section">
        <SectionHead eyebrow="Créateurs" title="Les auteurs de ces créations" action="/talents" />
        <div className="rail">{talents.slice(0, 8).map((t) => <TalentCard key={t.id} t={t} />)}</div>
      </section>
    </div>
  )
}

/* =====================================================================
   14. HORIZON GALLERY
   ===================================================================== */
export function Galerie() {
  const [tab, setTab] = useState('Créations populaires')
  const { likes, toggleLike, saves, toggleSave, notify } = useApp()
  const [comment, setComment] = useState(null)

  const tabs = ['Créations populaires', 'Créations récentes', 'Mode', 'Art', 'Artisanat', 'Design', 'Photographie']
  const list = useMemo(() => {
    if (tab === 'Créations populaires') return [...creations].sort((a, b) => b.likes - a.likes)
    if (tab === 'Créations récentes') return [...creations].sort((a, b) => new Date(b.date) - new Date(a.date))
    if (tab === 'Photographie') return [...creations].sort((a, b) => b.views - a.views)
    return creations.filter((c) => c.category === tab)
  }, [tab])

  return (
    <div className="container-wide">
      <Crumbs items={[{ label: 'Horizon Gallery' }]} />
      <div className="page-head">
        <div className="between wrap">
          <div>
            <h1>Horizon Gallery</h1>
            <p style={{ maxWidth: '70ch' }}>
              La galerie visuelle de la création africaine. Aimez, commentez, partagez, enregistrez et découvrez
              le créateur de chaque pièce.
            </p>
          </div>
          <div className="row gap-12">
            <Btn to="/creations" variant="outline" size="sm">Toutes les créations</Btn>
            <Btn to="/tableau-de-bord/portfolio" size="sm">Publier une création</Btn>
          </div>
        </div>
      </div>

      <Tabs tabs={tabs} value={tab} onChange={setTab} />

      <div className="masonry mt-24">
        {list.map((c) => {
          const liked = likes.has(c.id)
          return (
            <article key={c.id} className="tile">
              <img src={c.image} alt={c.title} loading="lazy" />
              <div className="media-top">
                <Badge tone="muted">{c.category}</Badge>
                {c.boost && <Badge tone="gold">✦ Boost</Badge>}
              </div>
              <div className="tile-actions">
                <div className="stack">
                  <b style={{ fontSize: 13.5 }}>{c.title}</b>
                  <Link to={c.authorType === 'marque' ? `/marque/${c.authorId}` : `/talent/${talents.find((t) => t.name === c.author)?.id || 'tal-1'}`} className="tiny gold">Voir le créateur →</Link>
                </div>
                <div className="row gap-6">
                  <button className={`like-btn ${liked ? 'on' : ''}`} onClick={() => toggleLike(c.id)}>♥ {liked ? (c.likes + 1).toLocaleString('fr-FR') : shortNumber(c.likes)}</button>
                  <button className="like-btn" onClick={() => setComment(c)}>💬 {c.comments}</button>
                  <button className="like-btn" onClick={() => notify('Lien copié — partagez cette création 🔗')}>↗</button>
                  <button className="like-btn" onClick={() => toggleSave(c.id)}>{saves.has(c.id) ? '★' : '☆'}</button>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      <section className="section">
        <div className="grid grid-4">
          {[['Créations populaires', '1 284'], ['Créateurs actifs', '2 913'], ['Vues ce mois', '4,2 M'], ['J’aime', '184 k']].map(([a, b]) => (
            <div key={a} className="kpi center-text"><b>{b}</b><span>{a}</span></div>
          ))}
        </div>
      </section>

      <Modal open={!!comment} onClose={() => setComment(null)} title={comment ? comment.title : ''}>
        {comment && (
          <>
            <img src={comment.image} alt="" className="ratio-16 mb-16" />
            <div className="stack gap-12">
              {[['Sira Camara', 'Superbe travail sur les finitions, bravo !'], ['Koffi Mensah', 'Les couleurs sont incroyables 🔥'], ['Wax & Co', 'Nous aimerions échanger avec vous.']].map(([n, t]) => (
                <div key={n} className="list-row">
                  <Avatar src={IMG.people[4]} size="sm" />
                  <div className="stack"><b style={{ fontSize: 13 }}>{n}</b><span className="small muted">{t}</span></div>
                </div>
              ))}
            </div>
            <div className="row gap-12 mt-16">
              <input className="input" placeholder="Écrire un commentaire…" />
              <Btn onClick={() => { setComment(null); notify('Commentaire publié 💬') }}>Publier</Btn>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}

/* =====================================================================
   15. PAGE VIDÉOS
   ===================================================================== */
export function Videos() {
  const [cat, setCat] = useState('Toutes')
  const [q, setQ] = useState('')
  const list = videos.filter((v) => (cat === 'Toutes' || v.category === cat) && (!q || v.title.toLowerCase().includes(q.toLowerCase())))

  return (
    <div className="container">
      <Crumbs items={[{ label: 'Vidéos' }]} />
      <div className="page-head">
        <h1>Vidéos</h1>
        <p>Défilés, collections, présentations de marques, interviews, backstage, créations et tutoriels.</p>
      </div>

      <div className="pill-row mb-16">
        {['Toutes', ...VIDEO_CATEGORIES].map((c) => <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>)}
        <input className="input" style={{ maxWidth: 240, marginLeft: 'auto' }} placeholder="Rechercher une vidéo…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="split">
        <div>
          <div className="grid grid-3">{list.map((v) => <VideoCard key={v.id} v={v} wide />)}</div>
          {list.length === 0 && <EmptyState title="Aucune vidéo" sub="Essayez une autre catégorie." />}
        </div>
        <aside className="stack gap-16">
          <div className="panel">
            <h2 className="h-sub">Les plus vues</h2>
            <div className="stack gap-12">
              {[...videos].sort((a, b) => b.views - a.views).slice(0, 5).map((v, i) => (
                <Link key={v.id} to={`/videos/${v.id}`} className="row gap-12">
                  <b className="muted-2" style={{ fontFamily: 'var(--display)', fontSize: 18, width: 22 }}>{i + 1}</b>
                  <img src={v.thumb} alt="" style={{ width: 76, height: 48, objectFit: 'cover', borderRadius: 9 }} loading="lazy" />
                  <div className="stack">
                    <b style={{ fontSize: 13, lineHeight: 1.3 }}>{v.title}</b>
                    <span className="tiny muted-2">{shortNumber(v.views)} vues · {v.duration}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="panel">
            <h2 className="h-sub">Publier une vidéo</h2>
            <p className="small">Défilés, coulisses, tutoriels : partagez votre savoir-faire avec la communauté.</p>
            <Btn to="/tableau-de-bord/mes-videos" className="btn-block mt-8">Ajouter une vidéo</Btn>
          </div>
        </aside>
      </div>
    </div>
  )
}

/* ---------------------------- Détail vidéo ---------------------------- */
export function VideoDetail() {
  const { id } = useParams()
  const v = videos.find((x) => x.id === id) || videos[0]
  const { notify, likes, toggleLike } = useApp()
  const liked = likes.has(v.id)

  return (
    <div className="container">
      <Crumbs items={[{ label: 'Vidéos', to: '/videos' }, { label: v.category }, { label: v.title.slice(0, 28) + '…' }]} />
      <div className="split">
        <div>
          <div className="video-thumb" style={{ aspectRatio: '16/9' }}>
            <img src={v.poster} alt={v.title} />
            <button className="play-btn" onClick={() => notify('Lecture simulée — lecteur vidéo de la maquette ▶')}>▶</button>
            <span className="duration">{v.duration}</span>
          </div>
          <h1 className="mt-24" style={{ fontSize: 'clamp(1.4rem, 2.4vw, 2rem)' }}>{v.title}</h1>
          <div className="between wrap">
            <div className="row gap-12">
              <Avatar src={IMG.people[3]} size="sm" />
              <div className="stack"><b style={{ fontSize: 13.5 }}>{v.author}</b><span className="tiny muted">{shortNumber(v.views)} vues · {fmtShort(v.date)}</span></div>
            </div>
            <div className="row gap-8">
              <button className={`like-btn ${liked ? 'on' : ''}`} onClick={() => toggleLike(v.id)}>♥ J’aime</button>
              <button className="like-btn" onClick={() => notify('Vidéo enregistrée ★')}>☆ Enregistrer</button>
              <button className="like-btn" onClick={() => notify('Lien copié 🔗')}>↗ Partager</button>
            </div>
          </div>
          <div className="panel mt-16">
            <p className="mb-0">
              {v.title} — {v.author}. Cette vidéo fait partie de la catégorie « {v.category} » sur Horizon Afrique.
              Retrouvez l’ensemble du programme, les coulisses et les interviews des créateurs du continent.
            </p>
          </div>

          <h2 className="mt-32 h-sub">Commentaires <span className="muted small">(128)</span></h2>
          <div className="stack gap-12">
            {[['Awa Sossou', 'Quel défilé ! Les coupes sont magnifiques.'], ['Kojo Mensah', 'Merci pour le partage, très inspirant.'], ['Zola Dlamini', 'Hâte de voir la suite de la collection.']].map(([n, t]) => (
              <div key={n} className="list-row">
                <Avatar src={IMG.people[5]} size="sm" />
                <div className="stack"><b style={{ fontSize: 13 }}>{n}</b><span className="small muted">{t}</span></div>
              </div>
            ))}
          </div>
          <div className="row gap-12 mt-16">
            <input className="input" placeholder="Ajouter un commentaire…" />
            <Btn onClick={() => notify('Commentaire publié 💬')}>Publier</Btn>
          </div>
        </div>

        <aside className="stack gap-16">
          <h2 className="h-sub">À suivre</h2>
          {videos.filter((x) => x.id !== v.id).slice(0, 5).map((x) => (
            <Link key={x.id} to={`/videos/${x.id}`} className="row gap-12">
              <img src={x.thumb} alt="" style={{ width: 92, height: 58, objectFit: 'cover', borderRadius: 10 }} loading="lazy" />
              <div className="stack">
                <b style={{ fontSize: 13, lineHeight: 1.3 }}>{x.title}</b>
                <span className="tiny muted-2">{x.author} · {shortNumber(x.views)} vues</span>
              </div>
            </Link>
          ))}
        </aside>
      </div>
    </div>
  )
}

/* =====================================================================
   16. FIL D'ACTUALITÉ
   ===================================================================== */
export function Fil() {
  const [text, setText] = useState('')
  const [posts, setPosts] = useState(feedPosts)
  const { likes, toggleLike, saves, toggleSave, notify } = useApp()

  const publish = () => {
    if (!text.trim()) return
    setPosts((p) => [{
      id: `post-new-${Date.now()}`, author: 'Aïcha Kora', type: 'talent', text,
      time: 'à l’instant', avatar: IMG.people[0], image: null, likes: 0, comments: 0, shares: 0, tag: 'Publication',
    }, ...p])
    setText('')
    notify('Publication partagée sur le fil ✅')
  }

  return (
    <div className="container">
      <Crumbs items={[{ label: 'Fil d’actualité' }]} />
      <div className="page-head">
        <h1>Fil d’actualité</h1>
        <p>Le réseau professionnel de la création africaine : publications, collections, produits, réalisations et annonces.</p>
      </div>

      <div className="split">
        <div className="stack gap-24">
          {/* Publier */}
          <div className="panel">
            <div className="row gap-12 mb-16">
              <Avatar src={IMG.people[0]} size="md" />
              <input className="input" placeholder="Que souhaitez-vous partager aujourd’hui ?" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && publish()} />
            </div>
            <div className="between wrap gap-12">
              <div className="pill-row">
                {[['📷 Photo', 'Photo'], ['🎬 Vidéo', 'Vidéo'], ['🧵 Collection', 'Collection'], ['🛍️ Produit', 'Produit'], ['🏆 Réalisation', 'Réalisation'], ['📣 Annonce', 'Annonce']].map(([label, tag]) => (
                  <button key={tag} className="chip chip-soft" onClick={() => setText((t) => `${t}${t ? ' ' : ''}[${tag}] `)}>{label}</button>
                ))}
              </div>
              <Btn size="sm" onClick={publish}>Publier</Btn>
            </div>
          </div>

          {/* Publications */}
          {posts.map((p) => {
            const liked = likes.has(p.id)
            return (
              <article key={p.id} className="panel">
                <div className="between mb-16">
                  <div className="row gap-12">
                    <Avatar src={p.avatar} size="md" />
                    <div className="stack">
                      <span className="row gap-8"><b>{p.author}</b>{p.type === 'marque' && <Badge tone="gold">Marque</Badge>}</span>
                      <span className="tiny muted-2">{p.time} · {p.tag}</span>
                    </div>
                  </div>
                  {p.boost && <Badge tone="gold">✦ Boost</Badge>}
                </div>
                <p style={{ color: '#e7e4ee' }}>{p.text}</p>
                {p.image && <img src={p.image} alt="" className="ratio-16 mb-16" loading="lazy" />}
                <div className="between">
                  <div className="row gap-16 tiny muted-2">
                    <button className={`like-btn ${liked ? 'on' : ''}`} onClick={() => toggleLike(p.id)}>♥ {p.likes + (liked ? 1 : 0)}</button>
                    <span>💬 {p.comments}</span>
                    <span>↗ {p.shares}</span>
                  </div>
                  <div className="row gap-8">
                    <button className="like-btn" onClick={() => toggleSave(p.id)}>{saves.has(p.id) ? '★ Enregistré' : '☆ Enregistrer'}</button>
                    <button className="like-btn" onClick={() => notify('Partage du post effectué 🔗')}>Partager</button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <aside className="stack gap-16">
          <div className="panel">
            <h2 className="h-sub">Suggestions à suivre</h2>
            <div className="stack gap-12">
              {talents.slice(6, 10).map((t) => (
                <Link key={t.id} to={`/talent/${t.id}`} className="row gap-12">
                  <Avatar src={t.avatar} size="sm" />
                  <div className="stack"><b style={{ fontSize: 13 }}>{t.name}</b><span className="tiny muted">{t.job} · {t.country}</span></div>
                  <span className="badge badge-muted" style={{ marginLeft: 'auto' }}>Suivre</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="panel">
            <h2 className="h-sub">Tendances</h2>
            <div className="pill-row">
              {['#WaxChic', '#DakarFW26', '#MadeInAfrica', '#ArtisanatDurable', '#CotonouCrée', '#CastingMode'].map((h) => <span key={h} className="tag">{h}</span>)}
            </div>
          </div>
          <div className="panel">
            <h2 className="h-sub">Produits populaires</h2>
            <div className="grid grid-2">{productList.slice(0, 2).map((p) => <ProductCard key={p.id} p={p} />)}</div>
          </div>
        </aside>
      </div>
    </div>
  )
}
