import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Avatar, Badge, BrandCard, Btn, CreationTile, Crumbs, EmptyState, EventCard, FilterBar, Meter, Modal,
  ProductCard, SectionHead, Stars, Tabs, TalentCard, VideoCard, Verify, useApp, useFilterState,
} from '../components/ui.jsx'
import {
  COUNTRIES, IMG, articles, brands, creations, events, fcfa, fmtShort, productList, shortNumber, talents, videos,
} from '../data.js'

const ALL_CITIES = [...new Set(COUNTRIES.flatMap((c) => c.cities))]

/* =====================================================================
   10. PAGE MARQUES
   ===================================================================== */
export function Marques() {
  const filters = useMemo(() => [
    { key: 'country', label: 'Pays', options: COUNTRIES.map((c) => c.name), get: (b) => b.country },
    { key: 'city', label: 'Ville', options: ALL_CITIES, get: (b) => b.city },
    { key: 'category', label: 'Catégorie', options: [...new Set(brands.map((b) => b.category))], get: (b) => b.category },
  ], [])
  const { state, setState, result } = useFilterState(filters, brands)

  return (
    <div className="container">
      <Crumbs items={[{ label: 'Marques' }]} />
      <div className="page-head">
        <h1>Marques</h1>
        <p>Découvrez les maisons présentes sur Horizon Afrique : logo, pays, catégorie, nombre d’abonnés et dernière publication. Chaque marque dispose de sa page dédiée.</p>
      </div>

      <FilterBar filters={filters} state={state} setState={setState} count={result.length} />

      <div className="grid grid-3">
        {result.map((b) => <BrandCard key={b.id} b={b} />)}
      </div>
      {result.length === 0 && <EmptyState title="Aucune marque trouvée" sub="Essayez un autre pays ou une autre catégorie." />}

      <section className="section">
        <SectionHead eyebrow="À la une" title="TOURÉ. — la maison béninoise de référence" />
        <article className="panel" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="split-2" style={{ gap: 0, alignItems: 'stretch' }}>
            <img src={IMG.brandBanner} alt="TOURÉ." style={{ width: '100%', height: '100%', minHeight: 280, objectFit: 'cover' }} />
            <div style={{ padding: 32 }}>
              <div className="row gap-12 mb-16">
                <div className="logo-mark" style={{ width: 50, height: 50, borderRadius: 15, fontSize: 17 }}>TO</div>
                <div className="stack">
                  <span className="row gap-8"><b style={{ fontFamily: 'var(--display)', fontSize: 20 }}>TOURÉ.</b><Verify show /></span>
                  <span className="tiny muted">🇧🇯 Bénin · Cotonou · depuis 2016</span>
                </div>
              </div>
              <p className="small">{brands[0].bio}</p>
              <div className="grid grid-3 mt-16" style={{ gap: 12 }}>
                <div className="kpi"><b>{shortNumber(brands[0].followers)}</b><span>Abonnés</span></div>
                <div className="kpi"><b>24</b><span>Pièces / collection</span></div>
                <div className="kpi"><b>3</b><span>Collections</span></div>
              </div>
              <div className="row gap-12 mt-24">
                <Btn to={`/marque/${brands[0].id}`}>Voir la marque</Btn>
                <Btn to="/inscription" variant="outline">Créer une marque</Btn>
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>
  )
}

/* =====================================================================
   11. PAGE PROFIL D'UNE MARQUE
   ===================================================================== */
export function BrandProfile() {
  const { id } = useParams()
  const b = brands.find((x) => x.id === id) || brands[0]
  const [tab, setTab] = useState('Accueil')
  const [contactOpen, setContactOpen] = useState(false)
  const { following, toggleFollow, notify } = useApp()
  const isFollowing = following.has(b.id)

  const tabs = ['Accueil', 'À propos', 'Publications', 'Collections', 'Galerie', 'Vidéos', 'Produits', 'Événements', 'Avis']
  const brandProducts = productList.filter((p) => p.seller === b.name).concat(productList.slice(2, 6)).slice(0, 8)
  const brandEvents = events.slice(0, 3)
  const brandVideos = videos.slice(0, 3)

  return (
    <div className="container">
      <Crumbs items={[{ label: 'Marques', to: '/marques' }, { label: b.name }]} />

      {/* En-tête */}
      <div className="profile-cover" style={{ height: 300 }}>
        <img src={b.banner} alt={b.name} />
      </div>
      <div className="profile-head">
        <div className="logo-mark" style={{ width: 118, height: 118, borderRadius: 30, fontSize: 38, border: '3px solid var(--ink)', boxShadow: '0 0 0 2px var(--gold)' }}>{b.logo}</div>
        <div className="profile-meta">
          <div className="row gap-8 wrap">
            <h1 className="mb-0" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>{b.name}</h1>
            <Verify show={b.verified} />
            <Badge tone="gold">{b.category}</Badge>
          </div>
          <div className="row gap-12 muted small wrap mt-8">
            <span>📍 {b.city}, {b.flag} {b.country}</span>
            <span>👥 {shortNumber(b.followers)} abonnés</span>
            <span>🏷️ Maison fondée en {b.since}</span>
          </div>
        </div>
        <div className="profile-actions">
          <Btn variant={isFollowing ? 'dark' : 'primary'} onClick={() => toggleFollow(b.id)}>{isFollowing ? '✓ Abonné' : '+ Suivre'}</Btn>
          <Btn variant="outline" onClick={() => setContactOpen(true)}>Contacter</Btn>
          <Btn variant="dark" onClick={() => notify('Lien de la marque copié 🔗')}>Partager</Btn>
        </div>
      </div>

      <div className="mt-24">
        <Tabs tabs={tabs} value={tab} onChange={setTab} />

        <div className="section-sm">
          {tab === 'Accueil' && (
            <>
              <div className="split mb-32">
                <div className="panel">
                  <div className="between mb-16">
                    <h2 className="mb-0 h-sub">Dernière publication</h2>
                    <Badge tone="gold">✦ Boost</Badge>
                  </div>
                  <div className="row gap-16">
                    <img src={IMG.garment[0]} alt="" className="ratio-1" style={{ width: 130, flexShrink: 0 }} loading="lazy" />
                    <div>
                      <b>{b.lastPost}</b>
                      <p className="small mt-8">
                        La collection « Sable & Or » arrive. 24 pièces en coton bio et broderies réalisées à la main
                        dans notre atelier de {b.city}. Disponible en ligne et sur rendez-vous.
                      </p>
                      <div className="row gap-12 tiny muted-2"><span>♥ 1 284</span><span>💬 96</span><span>↗ 214</span></div>
                    </div>
                  </div>
                  <div className="divider" />
                  <div className="grid grid-3">
                    {creations.slice(0, 3).map((c) => <CreationTile key={c.id} c={c} ratio="1/1" />)}
                  </div>
                </div>

                <aside className="stack gap-16">
                  <div className="panel">
                    <h3 className="card-h">Informations</h3>
                    <div className="stack gap-10 small">
                      <div className="between"><span className="muted">Catégorie</span><b>{b.category}</b></div>
                      <div className="between"><span className="muted">Pays</span><b>{b.flag} {b.country}</b></div>
                      <div className="between"><span className="muted">Ville</span><b>{b.city}</b></div>
                      <div className="between"><span className="muted">Collections</span><b>{b.collections.length}</b></div>
                      <div className="between"><span className="muted">Produits</span><b>{brandProducts.length}</b></div>
                      <div className="between"><span className="muted">Temps de réponse</span><b>~ 2 h</b></div>
                    </div>
                    <div className="divider" />
                    <div className="stack gap-8 small">
                      <span className="muted">🌐 {b.contact.website}</span>
                      <span className="muted">✉️ {b.contact.email}</span>
                      <span className="muted">📞 {b.contact.phone}</span>
                    </div>
                  </div>
                  <div className="panel" style={{ background: 'linear-gradient(135deg, rgba(227,176,75,0.12), rgba(196,85,46,0.1))' }}>
                    <h3 className="card-h">Booster cette marque</h3>
                    <p className="small">Gagnez jusqu’à 8× plus de vues sur vos publications et collections pendant 24 h.</p>
                    <Btn to="/horizon-boost" variant="primary" size="sm" className="btn-block">Horizon Boost — 1 000 FCFA</Btn>
                  </div>
                </aside>
              </div>

              <SectionHead eyebrow="Collections" title="Les collections de la maison" action="/marketplace" actionLabel="Marketplace" />
              <div className="grid grid-3">
                {b.collections.map((c) => (
                  <div key={c.name} className="card">
                    <div className="card-media card-media-tall">
                      <img src={c.cover} alt={c.name} loading="lazy" />
                      <div className="media-top"><Badge tone="gold">{c.season}</Badge></div>
                    </div>
                    <div className="card-pad">
                      <b>{c.name}</b>
                      <div className="small muted">{c.pieces} pièces · série limitée</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'À propos' && (
            <div className="split">
              <div>
                <h2 className="h-sub">Notre histoire</h2>
                <p>{b.bio}</p>
                <p>
                  Depuis {b.since}, la maison développe une production locale et responsable : matières tracées,
                  teintures naturelles, séries courtes et rémunération juste des artisans. Chaque pièce est numérotée
                  et accompagnée d’un certificat d’authenticité.
                </p>
                <div className="grid grid-3 mt-24">
                  {[['Savoir-faire', 'Broderie main, tissage, teinture'], ['Production', 'Atelier local — 34 artisans'], ['Engagement', 'Coton bio et teintures naturelles']].map(([a, c]) => (
                    <div key={a} className="panel"><b>{a}</b><p className="small mb-0 mt-8">{c}</p></div>
                  ))}
                </div>
                <h2 className="mt-32 h-sub">Nos valeurs</h2>
                <div className="row gap-12 wrap">
                  {['Traçabilité', 'Artisanat local', 'Séries limitées', 'Éco-responsable', 'Made in Africa'].map((v) => <span key={v} className="chip chip-soft">{v}</span>)}
                </div>
              </div>
              <aside className="panel">
                <h2 className="h-sub">Contact</h2>
                <div className="stack gap-12 small">
                  <div className="between"><span className="muted">Email</span><b>{b.contact.email}</b></div>
                  <div className="between"><span className="muted">Téléphone</span><b>{b.contact.phone}</b></div>
                  <div className="between"><span className="muted">Site web</span><b>{b.contact.website}</b></div>
                  <div className="between"><span className="muted">Adresse</span><b>Quartier Ganhi, {b.city}</b></div>
                </div>
                <div className="divider" />
                <Btn onClick={() => setContactOpen(true)} className="btn-block">Envoyer un message</Btn>
              </aside>
            </div>
          )}

          {tab === 'Publications' && (
            <div className="stack gap-24">
              {[0, 1, 2].map((i) => (
                <div key={i} className="panel">
                  <div className="row gap-12 mb-16">
                    <div className="logo-mark" style={{ width: 42, height: 42, borderRadius: 13, fontSize: 15 }}>{b.logo}</div>
                    <div className="stack">
                      <span className="row gap-8"><b>{b.name}</b><Verify show={b.verified} /></span>
                      <span className="tiny muted-2">il y a {i + 1} jour{i ? 's' : ''} · {b.city}</span>
                    </div>
                    {i === 0 && <Badge tone="gold" >✦ Boost</Badge>}
                  </div>
                  <p>
                    {[
                      'La collection « Sable & Or » arrive. Rendez-vous le 3 octobre au Bénin Fashion Show pour la première présentation officielle.',
                      'Coulisses d’atelier : trois semaines de travail, sept essayages et une broderie entièrement réalisée main.',
                      'Merci à toutes les personnes qui ont soutenu notre dernier défilé. Les commandes sur mesure sont ouvertes.',
                    ][i]}
                  </p>
                  <img src={IMG.garment[i]} alt="" className="ratio-16" loading="lazy" />
                  <div className="row gap-16 tiny muted-2 mt-16">
                    <span>♥ {980 - i * 210}</span><span>💬 {64 - i * 12}</span><span>↗ {120 - i * 30}</span><span>☆ Enregistrer</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'Collections' && (
            <div className="grid grid-3">
              {b.collections.concat(b.collections).slice(0, 6).map((c, i) => (
                <div key={i} className="card">
                  <div className="card-media card-media-tall">
                    <img src={c.cover} alt={c.name} loading="lazy" />
                    <div className="media-top"><Badge tone="gold">{c.season}</Badge></div>
                    <div className="media-overlay">
                      <div><b style={{ fontSize: 14 }}>{c.name}</b><div className="tiny muted">{c.pieces} pièces</div></div>
                      <Btn variant="primary" size="xs" onClick={() => notify('Collection ajoutée à vos favoris ★')}>☆</Btn>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'Galerie' && (
            <div className="grid grid-4">
              {[...IMG.garment, ...IMG.runway].slice(0, 12).map((src, i) => (
                <img key={i} src={src} alt="" className="ratio-4" loading="lazy" style={{ cursor: 'pointer' }} />
              ))}
            </div>
          )}

          {tab === 'Vidéos' && <div className="grid grid-3">{brandVideos.map((v) => <VideoCard key={v.id} v={v} />)}</div>}

          {tab === 'Produits' && (
            <>
              <div className="between mb-16">
                <span className="muted small">{brandProducts.length} produits en vente</span>
                <Btn to="/marketplace" variant="outline" size="sm">Voir toute la boutique</Btn>
              </div>
              <div className="grid grid-4">{brandProducts.map((p) => <ProductCard key={p.id} p={p} />)}</div>
            </>
          )}

          {tab === 'Événements' && (
            <div className="grid grid-3">{brandEvents.map((e) => <EventCard key={e.id} e={e} />)}</div>
          )}

          {tab === 'Avis' && (
            <div className="split">
              <div className="stack gap-16">
                {[
                  ['Fatou Diallo', 'Des pièces sublimes et un service client très réactif. Ma robe de cérémonie était parfaite.', 5, '2026-08-30'],
                  ['Ngozi Okafor', 'Qualité des finitions impressionnante. Livraison rapide vers Lagos.', 5, '2026-07-18'],
                  ['Amadou Keïta', 'Très bon accueil à l’atelier. Les délais ont été respectés à la journée près.', 4, '2026-05-04'],
                ].map(([n, t, note, d]) => (
                  <div key={n} className="panel">
                    <div className="between mb-8"><b>{n}</b><Stars value={note} /></div>
                    <p className="small mb-8">« {t} »</p>
                    <span className="tiny muted-2">{fmtShort(d)}</span>
                  </div>
                ))}
              </div>
              <aside className="panel">
                <h2 className="h-sub">Satisfaction clients</h2>
                <div className="row gap-16 mb-16">
                  <b style={{ fontFamily: 'var(--display)', fontSize: 42 }}>4,8</b>
                  <div className="stack"><Stars value={5} /><span className="tiny muted">312 avis vérifiés</span></div>
                </div>
                <div className="divider" />
                <div className="stack gap-10 small">
                  <div className="between"><span className="muted">Qualité</span><b>4,9</b></div>
                  <Meter value={98} />
                  <div className="between"><span className="muted">Délais</span><b>4,7</b></div>
                  <Meter value={94} />
                  <div className="between"><span className="muted">Communication</span><b>4,8</b></div>
                  <Meter value={96} />
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>

      <section className="section">
        <SectionHead eyebrow="Talents de la maison" title="L’équipe créative" action="/talents" />
        <div className="grid grid-4">{talents.slice(0, 4).map((t) => <TalentCard key={t.id} t={t} />)}</div>
      </section>

      <section className="section">
        <SectionHead eyebrow="Actualités" title="La marque dans la presse" action="/actualites" />
        <div className="grid grid-3">
          {articles.slice(0, 3).map((a) => (
            <div key={a.id} className="card">
              <img src={a.image} alt="" className="ratio-16" loading="lazy" />
              <div className="card-pad">
                <Badge tone="indigo">{a.category}</Badge>
                <b className="mt-8" style={{ display: 'block', fontFamily: 'var(--display)', fontSize: 15.5 }}>{a.title}</b>
                <span className="tiny muted-2">{fmtShort(a.date)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Modal open={contactOpen} onClose={() => setContactOpen(false)} title={`Contacter ${b.name}`}
        footer={<><Btn onClick={() => { setContactOpen(false); notify('Message envoyé à la marque 💬') }}>Envoyer</Btn><Btn variant="ghost" onClick={() => setContactOpen(false)}>Annuler</Btn></>}>
        <div className="row gap-12 mb-16">
          <Avatar src={IMG.people[2]} size="sm" />
          <div className="stack"><b>{b.name}</b><span className="tiny muted">Répond en moyenne en 2 heures</span></div>
        </div>
        <div className="field"><label>Objet</label>
          <select className="select" aria-label="Objet de la demande"><option>Demande d’information</option><option>Commande sur mesure</option><option>Collaboration</option><option>Presse</option></select>
        </div>
        <div className="field"><label>Message</label><textarea className="textarea" placeholder="Bonjour, je souhaiterais…" /></div>
      </Modal>
    </div>
  )
}
