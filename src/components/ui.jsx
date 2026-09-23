import { Link } from 'react-router-dom'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { fcfa, shortNumber, fmtShort, countryFlag } from '../data.js'

/* =====================================================================
   Contexte applicatif de la maquette (interactions simulées)
   ===================================================================== */
const AppCtx = createContext(null)

export function AppProvider({ children }) {
  const [toast, setToast] = useState(null)
  const [likes, setLikes] = useState(() => new Set())
  const [saves, setSaves] = useState(() => new Set(['cre-2', 'prd-1', 'evt-1', 'tal-1']))
  const [following, setFollowing] = useState(() => new Set())
  const [cart, setCart] = useState([
    { id: 'prd-1', qty: 1 },
    { id: 'prd-6', qty: 2 },
  ])
  const [boost, setBoost] = useState({ target: null, duration: 24, content: null })
  const [role, setRole] = useState('talent')
  const [plan, setPlan] = useState('Horizon Pro')
  const [notifCount, setNotifCount] = useState(4)

  const notify = useCallback((msg) => {
    setToast(msg)
    window.clearTimeout(window.__haToast)
    window.__haToast = window.setTimeout(() => setToast(null), 2600)
  }, [])

  const toggleLike = (id) => {
    setLikes((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  const toggleSave = (id) => {
    setSaves((s) => {
      const n = new Set(s)
      if (n.has(id)) { n.delete(id); notify('Retiré des favoris') } else { n.add(id); notify('Ajouté aux favoris ✨') }
      return n
    })
  }
  const toggleFollow = (id) => {
    setFollowing((s) => {
      const n = new Set(s)
      if (n.has(id)) { n.delete(id) } else { n.add(id); notify('Vous suivez désormais ce profil') }
      return n
    })
  }
  const addToCart = (id, qty = 1) => {
    setCart((c) => {
      const found = c.find((i) => i.id === id)
      if (found) return c.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i))
      return [...c, { id, qty }]
    })
    notify('Produit ajouté au panier 🛍️')
  }
  const removeFromCart = (id) => setCart((c) => c.filter((i) => i.id !== id))
  const setQty = (id, qty) => setCart((c) => c.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)))
  const clearCart = () => setCart([])

  const value = {
    toast, notify, likes, toggleLike, saves, toggleSave, following, toggleFollow,
    cart, addToCart, removeFromCart, setQty, clearCart, boost, setBoost, role, setRole,
    plan, setPlan, notifCount, setNotifCount,
  }
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}

export const useApp = () => useContext(AppCtx)

/* =====================================================================
   Primitives
   ===================================================================== */
export const Btn = ({ to, children, variant = 'primary', size = '', className = '', ...rest }) => {
  const cls = `btn btn-${variant} ${size ? `btn-${size}` : ''} ${className}`
  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>
  return <button className={cls} {...rest}>{children}</button>
}

export const Chip = ({ active, children, ...rest }) => (
  <button className={`chip ${active ? 'active' : ''}`} {...rest}>{children}</button>
)

export const Badge = ({ tone = 'muted', children }) => <span className={`badge badge-${tone}`}>{children}</span>

export const Verify = ({ show, title = 'Profil vérifié' }) =>
  show ? <span className="verified" title={title}>✓</span> : null

export const Avatar = ({ src, size = 'md', ring, className = '' }) => (
  <img src={src} alt="" className={`avatar avatar-${size} ${ring ? 'avatar-ring' : ''} ${className}`} loading="lazy" />
)

export const Stars = ({ value = 5 }) => (
  <span className="stars">{'★'.repeat(Math.round(value))}{'☆'.repeat(5 - Math.round(value))}</span>
)

export const Meter = ({ value }) => (
  <div className="meter"><i style={{ width: `${Math.min(100, value)}%` }} /></div>
)

export const Crumbs = ({ items }) => (
  <nav className="breadcrumb">
    <Link to="/">Accueil</Link>
    {items.map((it, i) => (
      <span key={i} className="row gap-8">
        <span>/</span>
        {it.to ? <Link to={it.to}>{it.label}</Link> : <span className="muted-2">{it.label}</span>}
      </span>
    ))}
  </nav>
)

export const SectionHead = ({ eyebrow, title, sub, action, actionLabel = 'Voir tout' }) => (
  <div className="section-head">
    <div>
      {eyebrow && <div className="upper eyebrow">{eyebrow}</div>}
      <h2>{title}</h2>
      {sub && <p>{sub}</p>}
    </div>
    {action && <Link to={action} className="link-arrow">{actionLabel} →</Link>}
  </div>
)

export const Stat = ({ label, value, delta, up, icon }) => (
  <div className="kpi">
    <div className="between mb-8">
      <span className="small muted">{label}</span>
      {icon && <span className="ico">{icon}</span>}
    </div>
    <b>{value}</b>
    {delta && <span className="delta" style={{ color: up ? 'var(--green-soft)' : 'var(--terra-soft)' }}>{up ? '▲' : '▼'} {delta}</span>}
  </div>
)

export const EmptyState = ({ title, sub, action, actionLabel = 'Explorer' }) => (
  <div className="empty">
    <div style={{ fontSize: 30, marginBottom: 10 }}>🧭</div>
    <h2 className="h-sub">{title}</h2>
    <p>{sub}</p>
    {action && <Btn to={action} variant="outline" size="sm">{actionLabel}</Btn>}
  </div>
)

export const Tabs = ({ tabs, value, onChange }) => (
  <div className="tabs">
    {tabs.map((t) => (
      <button key={t} className={`tab ${value === t ? 'active' : ''}`} onClick={() => onChange(t)}>{t}</button>
    ))}
  </div>
)

export const Modal = ({ open, onClose, title, children, footer }) => {
  if (!open) return null
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="between mb-16">
          <h2 className="mb-0 h-sub">{title}</h2>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>
        {children}
        {footer && <div className="row gap-12 mt-24">{footer}</div>}
      </div>
    </div>
  )
}

export const Pagination = ({ page, pages, onPage }) => (
  <div className="row gap-8 center mt-32">
    <button className="icon-btn" disabled={page === 1} onClick={() => onPage(page - 1)}>‹</button>
    {Array.from({ length: Math.min(pages, 6) }, (_, i) => i + 1).map((p) => (
      <button key={p} className="icon-btn" style={p === page ? { borderColor: 'var(--gold)', color: 'var(--gold)' } : {}} onClick={() => onPage(p)}>{p}</button>
    ))}
    <button className="icon-btn" disabled={page >= pages} onClick={() => onPage(page + 1)}>›</button>
  </div>
)

/* =====================================================================
   Barre de filtres générique
   filters = [{ key, label, options, get(item) }]
   ===================================================================== */
export function FilterBar({ filters, state, setState, count, children }) {
  return (
    <div className="filter-bar">
      <span className="upper muted-2" style={{ marginRight: 4 }}>Filtres</span>
      {filters.map((f) => (
        <select key={f.key} aria-label={`Filtre ${f.label}`} value={state[f.key] ?? 'Tous'} onChange={(e) => setState({ ...state, [f.key]: e.target.value })}>
          <option value="Tous">{f.label} : Tous</option>
          {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ))}
      {children}
      {(state && Object.values(state).some((v) => v !== 'Tous')) && (
        <button className="chip" onClick={() => setState(Object.fromEntries(filters.map((f) => [f.key, 'Tous'])))}>✕ Réinitialiser</button>
      )}
      {count !== undefined && <span className="filter-count">{count} résultat{count > 1 ? 's' : ''}</span>}
    </div>
  )
}

export function useFilterState(filters, items, initial = {}) {
  const base = useMemo(() => Object.fromEntries(filters.map((f) => [f.key, 'Tous'])), [filters])
  const [state, setState] = useState({ ...base, ...initial })
  const result = useMemo(
    () => items.filter((it) => filters.every((f) => {
      const v = state[f.key]
      return !v || v === 'Tous' || String(f.get ? f.get(it) : it[f.key]) === v
    })),
    [items, filters, state]
  )
  return { state, setState, result }
}

/* =====================================================================
   Cartes réutilisables
   ===================================================================== */
export const TalentCard = ({ t }) => (
  <article className="card">
    <div className="card-media" style={{ aspectRatio: '4/5' }}>
      <img src={t.cover} alt={t.name} loading="lazy" />
      <div className="media-top">
        <Badge tone="indigo">{t.job}</Badge>
        {t.boost && <Badge tone="gold">✦ Boost</Badge>}
      </div>
      <div className="media-overlay">
        <div>
          <div className="row gap-8" style={{ alignItems: 'center' }}>
            <span className="card-title mb-0">{t.name}</span>
            <Verify show={t.verified} />
          </div>
          <div className="card-sub">{t.flag} {t.country} · {t.city}</div>
        </div>
      </div>
    </div>
    <div style={{ padding: '14px 18px 6px' }} className="between">
      <span className="stat-inline">👥 {shortNumber(t.followers)} abonnés</span>
      <span className="stat-inline">⭐ {t.rating}</span>
    </div>
    <div className="card-foot">
      <span className="tiny muted-2">{t.specialty}</span>
      <Btn to={`/talent/${t.id}`} variant="outline" size="xs">Voir le profil</Btn>
    </div>
  </article>
)

export const ModelCard = ({ t }) => (
  <article className="card">
    <div className="card-media" style={{ aspectRatio: '3/4' }}>
      <img src={t.cover} alt={t.name} loading="lazy" />
      <div className="media-overlay">
        <div>
          <div className="row gap-8"><span className="card-title mb-0">{t.name}</span><Verify show={t.verified} /></div>
          <div className="card-sub">{t.flag} {t.country} · {t.height} cm</div>
        </div>
      </div>
    </div>
    <div style={{ padding: 14 }} className="stack gap-8">
      <div className="between small muted">
        <span>Expérience</span><b className="strong" style={{ color: 'var(--text)' }}>{t.experience} ans</b>
      </div>
      <div className="between small muted">
        <span>Disponibilité</span><b className="strong" style={{ color: 'var(--text)' }}>{t.availability.split(' ')[0]}</b>
      </div>
      <div className="between small muted">
        <span>Style</span><b className="strong" style={{ color: 'var(--text)' }}>{t.style}</b>
      </div>
    </div>
    <div className="card-foot">
      <span className="tiny muted-2">👥 {shortNumber(t.followers)}</span>
      <Btn to={`/talent/${t.id}`} variant="primary" size="xs">Voir le book</Btn>
    </div>
  </article>
)

export const BrandCard = ({ b }) => (
  <article className="card">
    <div className="card-media" style={{ aspectRatio: '16/10' }}>
      <img src={b.banner} alt={b.name} loading="lazy" />
      <div className="media-top"><Badge tone="gold">{b.category}</Badge></div>
    </div>
    <div style={{ padding: '0 18px' }}>
      <div className="row gap-12" style={{ marginTop: -26, position: 'relative' }}>
        <div className="logo-mark" style={{ width: 52, height: 52, borderRadius: 15, fontSize: 17 }}>{b.logo}</div>
        <div className="stack" style={{ paddingTop: 26 }}>
          <span className="row gap-8"><b>{b.name}</b><Verify show={b.verified} /></span>
          <span className="card-sub">{b.flag} {b.country} · depuis {b.since}</span>
        </div>
      </div>
    </div>
    <div style={{ padding: '14px 18px' }} className="stack gap-6">
      <span className="stat-inline">👥 {shortNumber(b.followers)} abonnés</span>
      <span className="small muted">Dernière publication : <span style={{ color: 'var(--text)' }}>{b.lastPost}</span></span>
    </div>
    <div className="card-foot">
      <span className="tiny muted-2">{b.city}</span>
      <Btn to={`/marque/${b.id}`} variant="outline" size="xs">Voir la marque</Btn>
    </div>
  </article>
)

export const CreationTile = ({ c, ratio = '4/5' }) => {
  const { likes, toggleLike, saves, toggleSave } = useApp()
  const liked = likes.has(c.id)
  return (
    <article className="tile">
      <img src={c.image} alt={c.title} loading="lazy" style={{ aspectRatio: ratio.replace('/', ' / '), objectFit: 'cover', width: '100%' }} />
      <div className="media-top">
        <Badge tone="muted">{c.category}</Badge>
        {c.boost && <Badge tone="gold">✦ Boost</Badge>}
      </div>
      <div className="tile-actions">
        <div className="stack">
          <b style={{ fontSize: 13.5 }}>{c.title}</b>
          <span className="tiny muted">{c.author} · {c.flag} {c.country}</span>
        </div>
        <div className="row gap-6">
          <button className={`like-btn ${liked ? 'on' : ''}`} onClick={() => toggleLike(c.id)}>♥ {liked ? (c.likes + 1).toLocaleString('fr-FR') : shortNumber(c.likes)}</button>
          <button className="like-btn" onClick={() => toggleSave(c.id)}>{saves.has(c.id) ? '★' : '☆'}</button>
        </div>
      </div>
    </article>
  )
}

export const VideoCard = ({ v, wide }) => (
  <article className="card">
    <Link to={`/videos/${v.id}`} className="video-thumb">
      <img src={v.thumb} alt={v.title} loading="lazy" />
      <span className="play-btn">▶</span>
      <span className="duration">{v.duration}</span>
    </Link>
    <div style={{ padding: 14 }} className="stack gap-6">
      <b style={{ fontSize: 14.5, fontFamily: 'var(--font)' }}>{v.title}</b>
      <div className="between small muted">
        <span>{v.author}</span>
        <span>👁 {shortNumber(v.views)}</span>
      </div>
      {wide && <span className="tiny muted-2">{fmtShort(v.date)} · {v.category}</span>}
    </div>
  </article>
)

export const EventCard = ({ e, layout = 'grid' }) => (
  <article className="card" style={layout === 'list' ? { display: 'grid', gridTemplateColumns: '260px 1fr' } : undefined}>
    <div className="card-media" style={{ aspectRatio: layout === 'list' ? 'auto' : '16/11' }}>
      <img src={e.poster} alt={e.name} loading="lazy" style={{ height: '100%' }} />
      <div className="media-top">
        <Badge tone="terra">{e.category}</Badge>
        {e.boost && <Badge tone="gold">✦ Boost</Badge>}
      </div>
    </div>
    <div className="stack" style={{ padding: 16, gap: 10 }}>
      <div>
        <div className="row gap-8 mb-8"><span className="card-title mb-0">{e.name}</span></div>
        <div className="small muted">📅 {fmtShort(e.start)} · 📍 {e.city}, {e.flag} {e.country}</div>
      </div>
      <div className="small muted">Organisé par <span style={{ color: 'var(--text)' }}>{e.organizer}</span></div>
      <div className="between mt-8">
        <span className="strong gold">{e.price ? fcfa(e.price) : 'Entrée libre'}</span>
        <Btn to={`/evenements/${e.id}`} variant="outline" size="xs">Voir l’événement</Btn>
      </div>
    </div>
  </article>
)

export const ArticleCard = ({ a, horizontal }) => (
  <article className="card" style={horizontal ? { display: 'grid', gridTemplateColumns: '1fr 1fr' } : undefined}>
    <div className="card-media" style={{ aspectRatio: horizontal ? 'auto' : '16/10' }}>
      <img src={a.image} alt={a.title} loading="lazy" style={{ height: '100%' }} />
      <div className="media-top"><Badge tone="indigo">{a.category}</Badge></div>
    </div>
    <div className="stack gap-8" style={{ padding: 16 }}>
      <b style={{ fontFamily: 'var(--display)', fontSize: 16.5 }}>{a.title}</b>
      <p className="small mb-0" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{a.excerpt}</p>
      <div className="between small muted-2">
        <span>{a.author}</span>
        <span>{fmtShort(a.date)} · {a.readTime} min</span>
      </div>
      <Btn to={`/actualites/${a.id}`} variant="ghost" size="xs" className="mt-8">Lire l’article →</Btn>
    </div>
  </article>
)

export const ProductCard = ({ p }) => {
  const { addToCart, toggleSave, saves } = useApp()
  return (
    <article className="card">
      <Link to={`/produit/${p.id}`} className="card-media card-media-square">
        <img src={p.image} alt={p.name} loading="lazy" />
        <div className="media-top">
          {p.boost && <Badge tone="gold">✦ Boost</Badge>}
          <button className="like-btn" style={{ marginLeft: 'auto' }} onClick={(e) => { e.preventDefault(); toggleSave(p.id) }}>{saves.has(p.id) ? '★' : '☆'}</button>
        </div>
      </Link>
      <div className="stack gap-6" style={{ padding: 15 }}>
        <b style={{ fontSize: 14 }}>{p.name}</b>
        <span className="tiny muted">{p.seller} · {p.flag} {p.country}</span>
        <div className="between mt-8">
          <span className="strong gold" style={{ fontSize: 15 }}>{fcfa(p.price)}</span>
          <span className="tiny muted-2">⭐ {p.rating} ({p.reviews})</span>
        </div>
      </div>
      <div className="card-foot">
        <span className="tiny muted-2">{p.stock > 0 ? `${p.stock} en stock` : 'Rupture'}</span>
        <Btn variant="primary" size="xs" onClick={() => addToCart(p.id)}>Ajouter au panier</Btn>
      </div>
    </article>
  )
}

export const OpportunityRow = ({ o }) => (
  <div className="list-row">
    <div className="stack center" style={{ width: 52, textAlign: 'center', flexShrink: 0 }}>
      <b style={{ fontFamily: 'var(--display)', fontSize: 19 }}>{o.daysLeft}</b>
      <span className="tiny muted-2">jours</span>
    </div>
    <div className="grow">
      <div className="row gap-8 wrap mb-8">
        <b>{o.title}</b>
        {o.featured && <Badge tone="gold">✦ À la une</Badge>}
      </div>
      <div className="small muted row gap-12 wrap">
        <span>🏢 {o.org}</span><span>📍 {o.flag} {o.country} · {o.city}</span><span>💼 {o.contract}</span>
      </div>
    </div>
    <div className="stack" style={{ alignItems: 'flex-end', flexShrink: 0, gap: 6 }}>
      <Badge tone="indigo">{o.type}</Badge>
      <Btn to={`/opportunites/${o.id}`} variant="outline" size="xs">Voir l’opportunité</Btn>
    </div>
  </div>
)

export const PartnerCard = ({ p }) => (
  <article className="card card-pad">
    <div className="row gap-12 mb-16">
      <div className="logo-mark" style={{ width: 46, height: 46, borderRadius: 13, fontSize: 15 }}>{p.logo}</div>
      <div className="stack">
        <b>{p.name}</b>
        <span className="tiny muted">{p.domain} · {p.flag} {p.country}</span>
      </div>
    </div>
    <p className="small mb-16">{p.desc}</p>
    <div className="between">
      <span className="tiny muted-2">Partenaire depuis {p.since}</span>
      <Btn to="/partenaires" variant="outline" size="xs">Découvrir</Btn>
    </div>
  </article>
)

export const SponsorCard = ({ s }) => (
  <article className="card card-pad">
    <div className="between mb-16">
      <div className="logo-mark" style={{ width: 48, height: 48, borderRadius: 14, fontSize: 16 }}>{s.logo}</div>
      <Badge tone="gold">{s.type}</Badge>
    </div>
    <b style={{ fontFamily: 'var(--display)', fontSize: 17 }}>{s.name}</b>
    <p className="small mt-8 mb-16">{s.desc}</p>
    <div className="divider" />
    <div className="between small muted">
      <span>Contribution 2026</span><b className="gold">{fcfa(s.amount)}</b>
    </div>
    <div className="between small muted mt-8">
      <span>Talents soutenus</span><b style={{ color: 'var(--text)' }}>{s.talents}</b>
    </div>
  </article>
)

export const TestimonialCard = ({ t }) => (
  <article className="card card-pad">
    <Stars value={t.note} />
    <p className="mt-16" style={{ fontSize: 14.5, fontStyle: 'italic', color: '#e4e1ea' }}>« {t.quote} »</p>
    <div className="row gap-12 mt-16">
      <Avatar src={t.avatar} size="sm" />
      <div className="stack">
        <b style={{ fontSize: 13.5 }}>{t.name}</b>
        <span className="tiny muted">{t.role}</span>
      </div>
    </div>
  </article>
)

export const CountryChip = ({ name }) => {
  const flag = countryFlag(name)
  return (
    <Link to="/decouvrir" className="chip chip-soft" style={{ padding: '10px 16px' }}>
      <span style={{ fontSize: 17 }}>{flag}</span> {name}
    </Link>
  )
}
