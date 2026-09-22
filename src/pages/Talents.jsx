import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Avatar, Badge, BrandCard, Btn, CreationTile, Crumbs, EmptyState, FilterBar, Meter, Modal, ProductCard,
  SectionHead, Stars, Tabs, TalentCard, ModelCard, VideoCard, Verify, useApp, useFilterState,
} from '../components/ui.jsx'
import {
  AVAILABILITY, COUNTRIES, IMG, STYLES, TALENT_CATEGORIES, brands, creations, fcfa, fmtShort,
  productList, shortNumber, talents, videos, countryFlag,
} from '../data.js'

const ALL_CITIES = [...new Set(COUNTRIES.flatMap((c) => c.cities))]
const SPECIALTIES = [...new Set(talents.map((t) => t.specialty))]
const JOBS = [...new Set(talents.map((t) => t.job))]

/* =====================================================================
   6. PAGE TALENTS
   ===================================================================== */
export function Talents() {
  const [cat, setCat] = useState('Toutes les catégories')
  const filters = useMemo(() => [
    { key: 'country', label: 'Pays', options: COUNTRIES.map((c) => c.name), get: (t) => t.country },
    { key: 'city', label: 'Ville', options: ALL_CITIES, get: (t) => t.city },
    { key: 'specialty', label: 'Spécialité', options: SPECIALTIES, get: (t) => t.specialty },
    { key: 'style', label: 'Style', options: STYLES, get: (t) => t.style },
  ], [])
  const { state, setState, result } = useFilterState(filters, talents)
  const list = cat === 'Toutes les catégories' ? result : result.filter((t) => t.category === cat)

  return (
    <div className="container">
      <Crumbs items={[{ label: 'Talents' }]} />
      <div className="page-head">
        <h1>Talents</h1>
        <p>Tous les professionnels de la création africaine : stylistes, designers, mannequins, photographes, artistes, artisans, maquilleurs, coiffeurs, illustrateurs, sculpteurs et créateurs.</p>
      </div>

      <section className="section-sm">
        <div className="grid grid-auto-sm">
          {TALENT_CATEGORIES.map((c) => (
            <button key={c.slug} className="card card-pad" style={{ textAlign: 'left', borderColor: cat === c.name ? 'var(--gold)' : undefined, background: cat === c.name ? 'rgba(227,176,75,0.08)' : undefined }} onClick={() => setCat(cat === c.name ? 'Toutes les catégories' : c.name)}>
              <div className="row gap-12 mb-8"><span style={{ fontSize: 20 }}>{c.icon}</span><b style={{ fontFamily: 'var(--display)', fontSize: 15 }}>{c.name}</b></div>
              <span className="tiny muted">{c.count} profils</span>
            </button>
          ))}
        </div>
      </section>

      <FilterBar filters={filters} state={state} setState={setState} count={list.length} />

      <div className="grid grid-4">
        {list.map((t) => <TalentCard key={t.id} t={t} />)}
      </div>
      {list.length === 0 && <EmptyState title="Aucun talent dans cette catégorie" sub="Essayez une autre catégorie ou réinitialisez les filtres." />}

      <section className="section">
        <SectionHead eyebrow="Catégories en vedette" title="Explorer par métier" />
        <div className="grid grid-4">
          {[
            ['Stylistes', '/stylistes', 'Silhouettes, couture et direction artistique'],
            ['Designers', '/designers', 'Textile, produit, espace et identité'],
            ['Mannequins', '/mannequins', 'Books, mesures et disponibilités'],
            ['Annuaire complet', '/annuaire', 'Talents et entreprises vérifiés'],
          ].map(([t, to, s]) => (
            <Link key={t} to={to} className="card card-pad">
              <b style={{ fontFamily: 'var(--display)', fontSize: 16 }}>{t}</b>
              <p className="small mb-0 mt-8">{s}</p>
              <span className="link-arrow mt-16" style={{ display: 'inline-flex' }}>Découvrir →</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

/* =====================================================================
   7. PAGE STYLISTES
   ===================================================================== */
export function Stylistes() {
  const list = talents.filter((t) => ['Styliste', 'Créateur'].includes(t.job))
  const filters = useMemo(() => [
    { key: 'country', label: 'Pays', options: COUNTRIES.map((c) => c.name), get: (t) => t.country },
    { key: 'city', label: 'Ville', options: ALL_CITIES, get: (t) => t.city },
    { key: 'specialty', label: 'Spécialité', options: [...new Set(list.map((t) => t.specialty))], get: (t) => t.specialty },
    { key: 'style', label: 'Style', options: STYLES, get: (t) => t.style },
  ], [list])
  const { state, setState, result } = useFilterState(filters, list)
  const [sort, setSort] = useState('Popularité')

  const sorted = useMemo(() => {
    const r = [...result]
    if (sort === 'Popularité') r.sort((a, b) => b.followers - a.followers)
    if (sort === 'Nouveaux') r.sort((a, b) => a.years - b.years)
    if (sort === 'A → Z') r.sort((a, b) => a.name.localeCompare(b.name))
    return r
  }, [result, sort])

  return (
    <div className="container">
      <Crumbs items={[{ label: 'Talents', to: '/talents' }, { label: 'Stylistes' }]} />
      <div className="page-head">
        <h1>Stylistes</h1>
        <p>Couturiers, stylistes et directeurs artistiques. Filtrez par pays, ville, spécialité, style et popularité.</p>
      </div>

      <FilterBar filters={filters} state={state} setState={setState} count={sorted.length}>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option>Popularité</option><option>Nouveaux</option><option>A → Z</option>
        </select>
      </FilterBar>

      <div className="grid grid-3">
        {sorted.map((t) => (
          <article key={t.id} className="card">
            <div className="card-media" style={{ aspectRatio: '16/10' }}>
              <img src={t.cover} alt={t.name} loading="lazy" />
              <div className="media-top">
                <Badge tone="gold">{t.specialty}</Badge>
                {t.verified && <Badge tone="green">✓ Vérifié</Badge>}
              </div>
            </div>
            <div style={{ padding: 18 }} className="stack gap-12">
              <div className="row gap-12">
                <Avatar src={t.avatar} size="md" />
                <div className="stack">
                  <span className="row gap-8"><b style={{ fontFamily: 'var(--display)', fontSize: 16 }}>{t.name}</b><Verify show={t.verified} /></span>
                  <span className="tiny muted">{t.job} · {t.flag} {t.country} · {t.city}</span>
                </div>
              </div>
              <div className="grid grid-4" style={{ gap: 6 }}>
                {t.portfolio.slice(0, 4).map((p, i) => (
                  <img key={i} src={p} alt="" className="ratio-1" style={{ borderRadius: 9, cursor: 'pointer' }} loading="lazy" />
                ))}
              </div>
              <div className="between small muted">
                <span>👥 {shortNumber(t.followers)} abonnés</span>
                <span>⭐ {t.rating} ({t.reviews} avis)</span>
              </div>
            </div>
            <div className="card-foot">
              <span className="tiny muted-2">{t.years} ans d’expérience</span>
              <Btn to={`/talent/${t.id}`} variant="primary" size="xs">Voir le profil</Btn>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

/* =====================================================================
   8. PAGE DESIGNERS
   ===================================================================== */
export function Designers() {
  const list = talents.filter((t) => ['Designer', 'Illustrateur'].includes(t.job))
  const filters = useMemo(() => [
    { key: 'country', label: 'Pays', options: COUNTRIES.map((c) => c.name), get: (t) => t.country },
    { key: 'domain', label: 'Domaine', options: [...new Set(list.map((t) => t.specialty))], get: (t) => t.specialty },
    { key: 'style', label: 'Spécialité', options: STYLES, get: (t) => t.style },
  ], [list])
  const { state, setState, result } = useFilterState(filters, list)

  return (
    <div className="container">
      <Crumbs items={[{ label: 'Talents', to: '/talents' }, { label: 'Designers' }]} />
      <div className="page-head">
        <h1>Designers</h1>
        <p>Design textile, produit, espace et identité visuelle. Chaque profil présente son portfolio, ses spécialités et ses réalisations.</p>
      </div>

      <FilterBar filters={filters} state={state} setState={setState} count={result.length} />

      <div className="stack gap-24">
        {result.map((t) => (
          <article key={t.id} className="panel">
            <div className="split-2">
              <div className="stack gap-16">
                <div className="row gap-16">
                  <Avatar src={t.avatar} size="lg" ring />
                  <div className="stack">
                    <span className="row gap-8"><h2 className="mb-0" style={{ fontSize: 24 }}>{t.name}</h2><Verify show={t.verified} /></span>
                    <span className="muted small">{t.job} · {t.specialty} · {t.flag} {t.country}, {t.city}</span>
                    <span className="row gap-12 small muted-2">
                      <span>👥 {shortNumber(t.followers)} abonnés</span><span>⭐ {t.rating}</span><span>{t.years} ans d’expérience</span>
                    </span>
                  </div>
                </div>
                <p className="small mb-0">{t.bio}</p>
                <div className="pill-row">
                  {t.services.map((s) => <span key={s.name} className="tag">{s.name}</span>)}
                </div>
                <div className="row gap-12">
                  <Btn to={`/talent/${t.id}`} variant="primary" size="sm">Voir le profil complet</Btn>
                  <Btn to={`/talent/${t.id}`} variant="outline" size="sm">Portfolio ({t.portfolio.length})</Btn>
                </div>
              </div>
              <div>
                <span className="upper muted-2">Réalisations</span>
                <div className="grid grid-3 mt-8" style={{ gap: 8 }}>
                  {t.portfolio.slice(0, 6).map((p, i) => (
                    <img key={i} src={p} alt="" className="ratio-1" style={{ borderRadius: 11 }} loading="lazy" />
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
      {result.length === 0 && <EmptyState title="Aucun designer trouvé" sub="Ajustez les filtres pour élargir la recherche." />}
    </div>
  )
}

/* =====================================================================
   9. PAGE MANNEQUINS
   ===================================================================== */
export function Mannequins() {
  const list = talents.filter((t) => t.job === 'Mannequin')
  const more = talents.filter((t) => ['Photographe', 'Coiffeur', 'Maquilleuse'].includes(t.job)).map((t) => ({ ...t, job: 'Mannequin' }))
  const pool = [...list, ...more]

  const filters = useMemo(() => [
    { key: 'country', label: 'Pays', options: COUNTRIES.map((c) => c.name), get: (t) => t.country },
    { key: 'city', label: 'Ville', options: ALL_CITIES, get: (t) => t.city },
    { key: 'gender', label: 'Sexe', options: ['Femme', 'Homme'], get: (t) => t.gender },
    { key: 'height', label: 'Taille', options: ['< 175 cm', '175 — 180 cm', '> 180 cm'], get: (t) => (t.height < 175 ? '< 175 cm' : t.height <= 180 ? '175 — 180 cm' : '> 180 cm') },
    { key: 'experience', label: 'Expérience', options: ['Débutant (< 3 ans)', 'Confirmé (3-8 ans)', 'Expert (> 8 ans)'], get: (t) => (t.experience < 3 ? 'Débutant (< 3 ans)' : t.experience <= 8 ? 'Confirmé (3-8 ans)' : 'Expert (> 8 ans)') },
    { key: 'availability', label: 'Disponibilité', options: AVAILABILITY, get: (t) => t.availability },
  ], [])
  const { state, setState, result } = useFilterState(filters, pool)

  return (
    <div className="container">
      <Crumbs items={[{ label: 'Talents', to: '/talents' }, { label: 'Mannequins' }]} />
      <div className="page-head">
        <h1>Mannequins</h1>
        <p>Consultez les books, les mensurations et les disponibilités des mannequins de la plateforme. Filtrez par pays, ville, sexe, taille, expérience et disponibilité.</p>
      </div>

      <FilterBar filters={filters} state={state} setState={setState} count={result.length} />

      <div className="grid grid-4">
        {result.map((t) => <ModelCard key={t.id} t={t} />)}
      </div>
      {result.length === 0 && <EmptyState title="Aucun mannequin ne correspond" sub="Essayez d’élargir les critères de recherche." />}

      <section className="section-sm">
        <div className="notice gold">
          <span style={{ fontSize: 20 }}>💡</span>
          <div>
            <b>Vous organisez un casting ?</b>
            <p className="small mb-0">Publiez une opportunité de type « Casting » : elle sera visible par tous les mannequins disponibles dans le pays concerné.</p>
          </div>
          <Btn to="/opportunites" variant="outline" size="sm" className="nowrap">Publier un casting</Btn>
        </div>
      </section>
    </div>
  )
}

/* =====================================================================
   12. PAGE PROFIL TALENT
   ===================================================================== */
export function TalentProfile() {
  const { id } = useParams()
  const t = talents.find((x) => x.id === id) || talents[0]
  const [tab, setTab] = useState('À propos')
  const [collab, setCollab] = useState(false)
  const { following, toggleFollow, notify, saves, toggleSave } = useApp()
  const isFollowing = following.has(t.id)

  const tabs = ['À propos', 'Portfolio', 'Photos', 'Vidéos', 'Réalisations', 'Services', 'Expérience', 'Récompenses', 'Avis', 'Publications']
  const related = talents.filter((x) => x.category === t.category && x.id !== t.id).slice(0, 4)
  const products = productList.slice(0, 4)

  return (
    <div className="container">
      <Crumbs items={[{ label: 'Talents', to: '/talents' }, { label: t.category, to: '/talents' }, { label: t.name }]} />

      <div className="profile-cover">
        <img src={t.cover} alt={t.name} />
      </div>

      <div className="profile-head">
        <Avatar src={t.avatar} size="xl" ring />
        <div className="profile-meta">
          <div className="row gap-8 wrap">
            <h1 className="mb-0" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>{t.name}</h1>
            <Verify show={t.verified} />
            {t.boost && <Badge tone="gold">✦ Boost actif</Badge>}
          </div>
          <div className="row gap-12 muted small wrap mt-8">
            <span>🎨 {t.job}</span>
            <span>📍 {t.city}, {t.flag} {t.country}</span>
            <span>⏱ {t.availability}</span>
            <span>⭐ {t.rating} ({t.reviews} avis)</span>
          </div>
        </div>
        <div className="profile-actions">
          <Btn variant={isFollowing ? 'dark' : 'primary'} onClick={() => toggleFollow(t.id)}>{isFollowing ? '✓ Abonné' : '+ Suivre'}</Btn>
          <Btn variant="outline" onClick={() => notify(`Message envoyé à ${t.name} 💬`)}>Contacter</Btn>
          <Btn variant="dark" onClick={() => setCollab(true)}>Proposer une collaboration</Btn>
          <button className="icon-btn" title="Enregistrer" onClick={() => toggleSave(t.id)}>{saves.has(t.id) ? '★' : '☆'}</button>
        </div>
      </div>

      <div className="panel mt-24">
        <div className="profile-stats">
          <div className="profile-stat"><b>{shortNumber(t.followers)}</b><span>Abonnés</span></div>
          <div className="profile-stat"><b>{t.portfolio.length + 42}</b><span>Créations</span></div>
          <div className="profile-stat"><b>{t.years}</b><span>Années d’expérience</span></div>
          <div className="profile-stat"><b>{12 + t.reviews}</b><span>Collaborations</span></div>
          <div className="profile-stat"><b>{t.height} cm</b><span>Taille</span></div>
        </div>
      </div>

      <div className="mt-24">
        <Tabs tabs={tabs} value={tab} onChange={setTab} />

        <div className="section-sm">
          {tab === 'À propos' && (
            <div className="split">
              <div>
                <h3>Biographie</h3>
                <p>{t.bio}</p>
                <p>Basé(e) à {t.city} ({t.country}), {t.name} travaille avec des marques, institutions et médias à travers le continent. Le studio collabore régulièrement avec des artisans locaux pour garantir des pièces produites de manière responsable.</p>
                <div className="grid grid-2 mt-24">
                  <div className="panel"><span className="upper muted-2">Spécialité</span><h3 className="mb-0 mt-8">{t.specialty}</h3></div>
                  <div className="panel"><span className="upper muted-2">Style signature</span><h3 className="mb-0 mt-8">{t.style}</h3></div>
                </div>
              </div>
              <aside className="panel">
                <h3>Informations</h3>
                <div className="stack gap-12 small">
                  <div className="between"><span className="muted">Profession</span><b>{t.job}</b></div>
                  <div className="between"><span className="muted">Pays</span><b>{t.flag} {t.country}</b></div>
                  <div className="between"><span className="muted">Ville</span><b>{t.city}</b></div>
                  <div className="between"><span className="muted">Disponibilité</span><b>{t.availability}</b></div>
                  <div className="between"><span className="muted">Langues</span><b>Français, Anglais</b></div>
                  <div className="between"><span className="muted">Membre depuis</span><b>2024</b></div>
                </div>
                <div className="divider" />
                <h4 className="mb-8">Réseaux</h4>
                <div className="pill-row">
                  <span className="tag">Instagram {t.social.instagram}</span>
                  <span className="tag">TikTok {t.social.tiktok}</span>
                </div>
              </aside>
            </div>
          )}

          {tab === 'Portfolio' && (
            <div className="grid grid-4">{t.portfolio.map((p, i) => <CreationTile key={i} c={{ id: `${t.id}-p${i}`, title: `${t.name} — création ${i + 1}`, category: t.job, author: t.name, country: t.country, flag: t.flag, image: p, likes: 200 + i * 40, boost: i === 0 }} />)}</div>
          )}

          {tab === 'Photos' && (
            <div className="grid grid-4">{t.portfolio.concat(t.portfolio).map((p, i) => <img key={i} src={p} className="ratio-4" alt="" loading="lazy" />)}</div>
          )}

          {tab === 'Vidéos' && (
            <div className="grid grid-3">{videos.slice(0, 3).map((v) => <VideoCard key={v.id} v={v} />)}</div>
          )}

          {tab === 'Réalisations' && (
            <div className="grid grid-3">
              {[...creations].slice(0, 6).map((c) => <CreationTile key={c.id} c={c} />)}
            </div>
          )}

          {tab === 'Services' && (
            <div className="stack gap-16">
              {t.services.map((s) => (
                <div key={s.name} className="list-row">
                  <div className="grow">
                    <b>{s.name}</b>
                    <div className="small muted">Délai : {s.delay}</div>
                  </div>
                  <span className="gold strong">{s.price}</span>
                  <Btn variant="outline" size="xs" onClick={() => setCollab(true)}>Demander un devis</Btn>
                </div>
              ))}
            </div>
          )}

          {tab === 'Expérience' && (
            <div className="timeline">
              {[
                ['2024 — 2026', 'Direction artistique', `Collection signature produite en série limitée à ${t.city}.`],
                ['2022 — 2024', 'Chef d’atelier', 'Encadrement d’une équipe de 12 artisans et modélistes.'],
                ['2020 — 2022', 'Créateur indépendant', 'Premières collections présentées lors de défilés et salons régionaux.'],
                ['2018 — 2020', 'Formation', 'École des arts appliqués — spécialité création et modélisme.'],
              ].map(([period, title, desc]) => (
                <div key={period} className="timeline-item">
                  <span className="t">{period}</span>
                  <div className="panel panel-tight">
                    <b>{title}</b>
                    <p className="small mb-0 mt-8">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'Récompenses' && (
            <div className="grid grid-3">
              {t.awards.map((a, i) => (
                <div key={a} className="panel center-text">
                  <div style={{ fontSize: 26 }}>🏆</div>
                  <b>{a}</b>
                  <div className="tiny muted mt-8">{2023 + i}</div>
                </div>
              ))}
            </div>
          )}

          {tab === 'Avis' && (
            <div className="split">
              <div className="stack gap-16">
                {[
                  ['TOURÉ.', 'Collaboration impeccable, respect des délais et grande créativité. Nous recommandons sans hésiter.', 5, '2026-08-14'],
                  ['Wax & Co', 'Un travail d’une finesse rare. Les finitions ont été saluées par nos clients.', 5, '2026-06-02'],
                  ['Bénin Créatif', 'Professionnalisme exemplaire pendant tout l’événement.', 4, '2026-03-21'],
                ].map(([name, text, note, date], i) => (
                  <div key={i} className="panel">
                    <div className="between mb-8">
                      <b>{name}</b><Stars value={note} />
                    </div>
                    <p className="small mb-8">« {text} »</p>
                    <span className="tiny muted-2">{fmtShort(date)}</span>
                  </div>
                ))}
              </div>
              <aside className="panel">
                <h3>Note globale</h3>
                <div className="row gap-16">
                  <b style={{ fontFamily: 'var(--display)', fontSize: 42 }}>{t.rating}</b>
                  <div className="stack">
                    <Stars value={Number(t.rating)} />
                    <span className="tiny muted">{t.reviews} avis vérifiés</span>
                  </div>
                </div>
                <div className="divider" />
                {[5, 4, 3, 2, 1].map((n, i) => (
                  <div key={n} className="row gap-12 mb-8 small">
                    <span style={{ width: 26 }}>{n}★</span>
                    <div className="grow"><Meter value={[78, 16, 4, 1, 1][i]} /></div>
                    <span className="tiny muted-2" style={{ width: 34, textAlign: 'right' }}>{[78, 16, 4, 1, 1][i]}%</span>
                  </div>
                ))}
              </aside>
            </div>
          )}

          {tab === 'Publications' && (
            <div className="grid grid-4">
              {t.portfolio.slice(0, 4).map((p, i) => (
                <div key={i} className="card">
                  <img src={p} alt="" className="ratio-1" loading="lazy" />
                  <div className="card-pad">
                    <span className="tiny muted">{['Nouvelle création disponible', 'Coulisses d’atelier', 'Merci pour vos messages', 'Prochain défilé confirmé'][i]}</span>
                    <div className="between tiny muted-2 mt-8"><span>♥ {120 + i * 34}</span><span>💬 {8 + i * 3}</span></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <section className="section">
        <SectionHead eyebrow="Boutique du créateur" title="Produits disponibles" action="/marketplace" />
        <div className="grid grid-4">{products.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </section>

      <section className="section">
        <SectionHead eyebrow="Profils similaires" title={`Autres ${t.category.toLowerCase()}`} action="/talents" />
        <div className="grid grid-4">{related.map((r) => <TalentCard key={r.id} t={r} />)}</div>
      </section>

      <Modal
        open={collab} onClose={() => setCollab(false)} title={`Proposer une collaboration à ${t.name}`}
        footer={<><Btn onClick={() => { setCollab(false); notify('Demande de collaboration envoyée ✅') }}>Envoyer la demande</Btn><Btn variant="ghost" onClick={() => setCollab(false)}>Annuler</Btn></>}
      >
        <div className="field"><label>Type de collaboration</label>
          <select className="select"><option>Collection capsule</option><option>Shooting éditorial</option><option>Défilé</option><option>Formation / atelier</option><option>Autre</option></select>
        </div>
        <div className="form-grid">
          <div className="field"><label>Budget estimé</label><input className="input" placeholder="Ex : 1 500 000 FCFA" /></div>
          <div className="field"><label>Date souhaitée</label><input className="input" type="date" defaultValue="2026-10-15" /></div>
        </div>
        <div className="field"><label>Description du projet</label><textarea className="textarea" placeholder="Décrivez votre projet, les livrables attendus et le contexte…" /></div>
        <div className="notice"><span>ℹ️</span><span className="small">La demande sera envoyée dans la messagerie et apparaîtra dans vos « Collaborations envoyées ».</span></div>
      </Modal>
    </div>
  )
}
