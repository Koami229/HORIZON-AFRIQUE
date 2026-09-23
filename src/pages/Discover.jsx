import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ArticleCard, Badge, Btn, BrandCard, Chip, CountryChip, CreationTile, Crumbs, EmptyState, EventCard,
  FilterBar, Pagination, ProductCard, SectionHead, Tabs, TalentCard, useApp, useFilterState, VideoCard,
} from '../components/ui.jsx'
import {
  COUNTRIES, CREATION_CATEGORIES, IMG, STYLES, TALENT_CATEGORIES, articles, brands, creations, events,
  opportunities, productList, shortNumber, talents, videos, AVAILABILITY,
} from '../data.js'

const ALL_CITIES = [...new Set(COUNTRIES.flatMap((c) => c.cities))]
const JOBS = [...new Set(talents.map((t) => t.job))]
const SPECIALTIES = [...new Set(talents.map((t) => t.specialty))]

/* =====================================================================
   5. PAGE DÉCOUVRIR
   ===================================================================== */
export function Decouvrir() {
  const filters = useMemo(() => [
    { key: 'country', label: 'Pays', options: COUNTRIES.map((c) => c.name), get: (t) => t.country },
    { key: 'city', label: 'Ville', options: ALL_CITIES, get: (t) => t.city },
    { key: 'job', label: 'Profession', options: JOBS, get: (t) => t.job },
    { key: 'specialty', label: 'Spécialité', options: SPECIALTIES, get: (t) => t.specialty },
    { key: 'style', label: 'Style', options: STYLES, get: (t) => t.style },
  ], [])
  const { state, setState, result } = useFilterState(filters, talents)
  const [pop, setPop] = useState('Populaires')

  const popular = [...result].sort((a, b) => b.followers - a.followers)
  const recent = [...result].sort((a, b) => b.years - a.years)
  const filteredBrands = brands.filter((b) => state.country === 'Tous' || b.country === state.country)
  const trendCreations = [...creations].sort((a, b) => b.views - a.views).slice(0, 8)

  return (
    <div className="container">
      <Crumbs items={[{ label: 'Découvrir' }]} />
      <div className="page-head">
        <h1>Découvrir la création africaine</h1>
        <p style={{ maxWidth: '70ch' }}>
          Explorez l’ensemble des contenus et des professionnels de la plateforme : talents, marques, créateurs,
          boutiques et institutions, filtrables par pays, ville, catégorie, profession et spécialité.
        </p>
      </div>

      <FilterBar
        filters={filters} state={state} setState={setState} count={result.length}
      >
        <div className="row gap-8">
          <Chip active={pop === 'Populaires'} onClick={() => setPop('Populaires')}>🔥 Populaires</Chip>
          <Chip active={pop === 'Nouveaux'} onClick={() => setPop('Nouveaux')}>✨ Nouveaux profils</Chip>
        </div>
      </FilterBar>

      <section className="section-sm">
        <SectionHead eyebrow="Talents populaires" title="Les profils les plus suivis" action="/talents" />
        <div className="rail">{(pop === 'Populaires' ? popular : recent).slice(0, 8).map((t) => <TalentCard key={t.id} t={t} />)}</div>
      </section>

      <section className="section-sm">
        <SectionHead eyebrow="Nouveaux talents" title="Fraîchement arrivés sur la plateforme" action="/talents" />
        <div className="rail">{recent.slice(0, 8).map((t) => <TalentCard key={`n-${t.id}`} t={t} />)}</div>
      </section>

      <section className="section-sm">
        <SectionHead eyebrow="Marques populaires" title="Les maisons les plus suivies" action="/marques" />
        <div className="grid grid-3">{filteredBrands.slice(0, 3).map((b) => <BrandCard key={b.id} b={b} />)}</div>
      </section>

      <section className="section-sm">
        <SectionHead eyebrow="Créateurs à découvrir" title="Profils recommandés pour vous" action="/annuaire" />
        <div className="grid grid-4">{popular.slice(0, 4).map((t) => <TalentCard key={`c-${t.id}`} t={t} />)}</div>
      </section>

      <section className="section-sm">
        <SectionHead eyebrow="Créations tendance" title="Ce qui monte en ce moment" action="/galerie" />
        <div className="grid grid-4">{trendCreations.map((c) => <CreationTile key={c.id} c={c} />)}</div>
      </section>

      <section className="section">
        <SectionHead eyebrow="Pays" title="Parcourir par pays" />
        <div className="pill-row">
          {COUNTRIES.map((c) => <CountryChip key={c.name} name={c.name} />)}
        </div>
      </section>
    </div>
  )
}

/* =====================================================================
   46. PAGE RECHERCHE GLOBALE
   ===================================================================== */
export function Recherche() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const [term, setTerm] = useState(q)
  const [tab, setTab] = useState('Tout')

  const results = useMemo(() => {
    const s = (q || '').toLowerCase().trim()
    const match = (x) => !s || JSON.stringify(x).toLowerCase().includes(s)
    return {
      Talents: talents.filter(match),
      Marques: brands.filter(match),
      Produits: productList.filter(match),
      Créations: creations.filter(match),
      Vidéos: videos.filter(match),
      Événements: events.filter(match),
      Opportunités: opportunities.filter(match),
      Articles: articles.filter(match),
    }
  }, [q])

  const total = Object.values(results).reduce((n, r) => n + r.length, 0)

  const submit = (e) => { e.preventDefault(); setParams(term ? { q: term } : {}) }

  return (
    <div className="container">
      <Crumbs items={[{ label: 'Recherche' }]} />
      <div className="page-head">
        <h1>Recherche globale</h1>
        <p>Talents, marques, produits, créations, vidéos, événements et opportunités — tout Horizon Afrique en une recherche.</p>
      </div>

      <form className="row gap-12 mb-16" onSubmit={submit}>
        <input className="input" placeholder="Que recherchez-vous ?" value={term} onChange={(e) => setTerm(e.target.value)} style={{ fontSize: 16 }} />
        <Btn type="submit">Rechercher</Btn>
      </form>

      <div className="pill-row mb-24">
        {['Robe wax', 'Cotonou', 'Marque', 'Casting', 'Dakar Fashion Week', 'Bijoux', 'Sénégal'].map((s) => (
          <Chip key={s} onClick={() => { setTerm(s); setParams({ q: s }) }}>{s}</Chip>
        ))}
      </div>

      <div className="between mb-16">
        <span className="muted small">{total} résultat{total > 1 ? 's' : ''} {q && <>pour « <b className="gold">{q}</b> »</>}</span>
        <span className="tiny muted-2">Recherche instantanée</span>
      </div>

      <Tabs tabs={['Tout', ...Object.keys(results)]} value={tab} onChange={setTab} />
      <div className="section-sm">
        {total === 0 && <EmptyState title="Aucun résultat" sub="Essayez un autre mot-clé : « wax », « Dakar », « casting », « bijoux »." action="/decouvrir" />}

        {total > 0 && (tab === 'Tout' || tab === 'Talents') && results.Talents.length > 0 && (
          <>
            <h2 className="mt-24 h-sub">Talents <span className="muted small">({results.Talents.length})</span></h2>
            <div className="grid grid-4">{results.Talents.slice(0, tab === 'Tout' ? 4 : 30).map((t) => <TalentCard key={t.id} t={t} />)}</div>
          </>
        )}
        {total > 0 && (tab === 'Tout' || tab === 'Marques') && results.Marques.length > 0 && (
          <>
            <h2 className="mt-32 h-sub">Marques <span className="muted small">({results.Marques.length})</span></h2>
            <div className="grid grid-3">{results.Marques.slice(0, tab === 'Tout' ? 3 : 30).map((b) => <BrandCard key={b.id} b={b} />)}</div>
          </>
        )}
        {total > 0 && (tab === 'Tout' || tab === 'Produits') && results.Produits.length > 0 && (
          <>
            <h2 className="mt-32 h-sub">Produits <span className="muted small">({results.Produits.length})</span></h2>
            <div className="grid grid-4">{results.Produits.slice(0, tab === 'Tout' ? 4 : 30).map((p) => <ProductCard key={p.id} p={p} />)}</div>
          </>
        )}
        {total > 0 && (tab === 'Tout' || tab === 'Créations') && results.Créations.length > 0 && (
          <>
            <h2 className="mt-32 h-sub">Créations <span className="muted small">({results.Créations.length})</span></h2>
            <div className="grid grid-4">{results.Créations.slice(0, tab === 'Tout' ? 4 : 30).map((c) => <CreationTile key={c.id} c={c} />)}</div>
          </>
        )}
        {total > 0 && (tab === 'Tout' || tab === 'Vidéos') && results.Vidéos.length > 0 && (
          <>
            <h2 className="mt-32 h-sub">Vidéos <span className="muted small">({results.Vidéos.length})</span></h2>
            <div className="grid grid-3">{results.Vidéos.slice(0, tab === 'Tout' ? 3 : 30).map((v) => <VideoCard key={v.id} v={v} />)}</div>
          </>
        )}
        {total > 0 && (tab === 'Tout' || tab === 'Événements') && results.Événements.length > 0 && (
          <>
            <h2 className="mt-32 h-sub">Événements <span className="muted small">({results.Événements.length})</span></h2>
            <div className="grid grid-3">{results.Événements.slice(0, tab === 'Tout' ? 3 : 30).map((e) => <EventCard key={e.id} e={e} />)}</div>
          </>
        )}
        {total > 0 && (tab === 'Tout' || tab === 'Opportunités') && results.Opportunités.length > 0 && (
          <>
            <h2 className="mt-32 h-sub">Opportunités <span className="muted small">({results.Opportunités.length})</span></h2>
            <div className="stack gap-12">{results.Opportunités.slice(0, tab === 'Tout' ? 4 : 30).map((o) => (
              <Link key={o.id} to={`/opportunites/${o.id}`} className="list-row">
                <div className="grow"><b>{o.title}</b><div className="tiny muted">{o.org} · {o.flag} {o.country} · {o.city}</div></div>
                <Badge tone="indigo">{o.type}</Badge>
              </Link>
            ))}</div>
          </>
        )}
        {total > 0 && (tab === 'Tout' || tab === 'Articles') && results.Articles.length > 0 && (
          <>
            <h2 className="mt-32 h-sub">Articles <span className="muted small">({results.Articles.length})</span></h2>
            <div className="grid grid-3">{results.Articles.slice(0, tab === 'Tout' ? 3 : 30).map((a) => <ArticleCard key={a.id} a={a} />)}</div>
          </>
        )}
      </div>
    </div>
  )
}

/* =====================================================================
   21. HORIZON DIRECTORY (annuaire professionnel)
   ===================================================================== */
export function Annuaire() {
  const [q, setQ] = useState('')
  const filters = useMemo(() => [
    { key: 'country', label: 'Pays', options: COUNTRIES.map((c) => c.name), get: (x) => x.country },
    { key: 'city', label: 'Ville', options: ALL_CITIES, get: (x) => x.city },
    { key: 'category', label: 'Catégorie', options: [...new Set(talents.map((t) => t.category))], get: (x) => x.category },
    { key: 'specialty', label: 'Spécialité', options: SPECIALTIES, get: (x) => x.specialty },
    { key: 'availability', label: 'Disponibilité', options: AVAILABILITY, get: (x) => x.availability },
  ], [])

  const entries = useMemo(() => [
    ...talents.map((t) => ({ ...t, kind: 'Talent', label: t.name, sub: `${t.job} · ${t.specialty}`, to: `/talent/${t.id}`, image: t.cover })),
    ...brands.map((b) => ({ ...b, kind: 'Marque', label: b.name, sub: `${b.category}`, to: `/marque/${b.id}`, image: b.banner, city: b.city, category: b.category, specialty: b.category, availability: 'Sur rendez-vous' })),
  ], [])

  const { state, setState, result } = useFilterState(filters, entries)
  const searched = result.filter((x) => !q || JSON.stringify(x).toLowerCase().includes(q.toLowerCase()))

  /* Annuaire paginé : 12 fiches par page, comme sur l'écran réel (40 entrées au total). */
  const PAR_PAGE = 12
  const [page, setPage] = useState(1)
  const pages = Math.max(1, Math.ceil(searched.length / PAR_PAGE))
  useEffect(() => { setPage(1) }, [q, state])
  const pageItems = searched.slice((Math.min(page, pages) - 1) * PAR_PAGE, Math.min(page, pages) * PAR_PAGE)

  return (
    <div className="container">
      <Crumbs items={[{ label: 'Horizon Directory' }]} />
      <div className="page-head">
        <h1>Horizon Directory</h1>
        <p>Le grand annuaire professionnel de la création africaine : talents, marques et entreprises vérifiées.</p>
      </div>

      <div className="panel mb-16">
        <div className="row gap-12">
          <input className="input" placeholder="Rechercher un talent, une marque ou une entreprise" value={q} onChange={(e) => setQ(e.target.value)} />
          <Btn>Rechercher</Btn>
        </div>
      </div>

      <FilterBar filters={filters} state={state} setState={setState} count={searched.length} />

      <div className="grid grid-4">
        {pageItems.map((x) => (
          <article key={`${x.kind}-${x.id}`} className="card">
            <div className="card-media card-media-tall">
              <img src={x.image} alt={x.label} loading="lazy" />
              <div className="media-top"><Badge tone={x.kind === 'Marque' ? 'gold' : 'indigo'}>{x.kind}</Badge></div>
              <div className="media-overlay">
                <div>
                  <b style={{ fontSize: 14 }}>{x.label}</b>
                  <div className="tiny muted">{x.flag} {x.country} · {x.city}</div>
                </div>
              </div>
            </div>
            <div className="stack gap-6" style={{ padding: 14 }}>
              <span className="tiny muted">{x.sub}</span>
              <div className="between tiny muted-2">
                <span>👥 {shortNumber(x.followers)}</span>
                <span>{x.availability}</span>
              </div>
            </div>
            <div className="card-foot">
              <span className="tiny muted-2">{x.kind === 'Marque' ? 'Entreprise' : 'Professionnel'}</span>
              <Btn to={x.to} variant="outline" size="xs">Voir la fiche</Btn>
            </div>
          </article>
        ))}
      </div>
      {searched.length === 0 && <EmptyState title="Aucun profil trouvé" sub="Modifiez vos filtres ou élargissez la recherche." />}
      {searched.length > PAR_PAGE && (
        <>
          <Pagination page={Math.min(page, pages)} pages={pages} onPage={setPage} />
          <p className="tiny muted-2 center-text mt-8">
            Page {Math.min(page, pages)} sur {pages} — {searched.length} fiches au total
          </p>
        </>
      )}
    </div>
  )
}

/* =====================================================================
   47. PAGE FAVORIS
   ===================================================================== */
export function Favoris() {
  const { saves } = useApp()
  const [tab, setTab] = useState('Profils enregistrés')
  const savedTalents = talents.filter((t) => saves.has(t.id))
  const savedProducts = productList.filter((p) => saves.has(p.id))
  const savedCreations = creations.filter((c) => saves.has(c.id))
  const savedEvents = events.filter((e) => saves.has(e.id) || ['evt-1', 'evt-3'].includes(e.id))

  const tabs = ['Profils enregistrés', 'Produits enregistrés', 'Créations enregistrées', 'Événements enregistrés']
  const counts = [savedTalents.length, savedProducts.length, savedCreations.length, savedEvents.length]

  return (
    <div className="container">
      <Crumbs items={[{ label: 'Mes favoris' }]} />
      <div className="page-head">
        <h1>Mes favoris</h1>
        <p>Retrouvez ici tous les contenus que vous avez enregistrés depuis n’importe quelle page de la plateforme.</p>
      </div>

      <Tabs tabs={tabs.map((t, i) => `${t} (${counts[i]})`)} value={tabs.map((t, i) => `${t} (${counts[i]})`)[tabs.indexOf(tab)]} onChange={(v) => setTab(v.replace(/ \(\d+\)$/, ''))} />

      <div className="section-sm">
        {tab === 'Profils enregistrés' && (savedTalents.length
          ? <div className="grid grid-4">{savedTalents.map((t) => <TalentCard key={t.id} t={t} />)}</div>
          : <EmptyState title="Aucun profil enregistré" sub="Enregistrez des profils pour les retrouver ici." action="/talents" actionLabel="Explorer les talents" />)}
        {tab === 'Produits enregistrés' && (savedProducts.length
          ? <div className="grid grid-4">{savedProducts.map((p) => <ProductCard key={p.id} p={p} />)}</div>
          : <EmptyState title="Aucun produit enregistré" sub="Ajoutez des produits à vos favoris depuis la marketplace." action="/marketplace" actionLabel="Aller à la marketplace" />)}
        {tab === 'Créations enregistrées' && (savedCreations.length
          ? <div className="grid grid-4">{savedCreations.map((c) => <CreationTile key={c.id} c={c} />)}</div>
          : <EmptyState title="Aucune création enregistrée" sub="Parcourez Horizon Gallery et enregistrez vos coups de cœur." action="/galerie" actionLabel="Ouvrir la galerie" />)}
        {tab === 'Événements enregistrés' && (savedEvents.length
          ? <div className="grid grid-3">{savedEvents.map((e) => <EventCard key={e.id} e={e} />)}</div>
          : <EmptyState title="Aucun événement enregistré" sub="Suivez l’agenda et enregistrez les événements à venir." action="/evenements" actionLabel="Voir l’agenda" />)}
      </div>

      <section className="section">
        <SectionHead eyebrow="Recommandations" title="Inspiré par vos favoris" action="/decouvrir" />
        <div className="rail">{creations.slice(3, 9).map((c) => <CreationTile key={`r-${c.id}`} c={c} />)}</div>
      </section>
    </div>
  )
}
