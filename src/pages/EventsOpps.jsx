import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Avatar, Badge, Btn, Chip, Crumbs, EmptyState, EventCard, FilterBar, Modal, OpportunityRow, SectionHead,
  Tabs, useApp, useFilterState,
} from '../components/ui.jsx'
import {
  COUNTRIES, EVENT_CATEGORIES, IMG, OPPORTUNITY_TYPES, events, fcfa, fmtDate, fmtShort, opportunities,
  partners, sponsors, talents,
} from '../data.js'

const ALL_CITIES = [...new Set(COUNTRIES.flatMap((c) => c.cities))]

/* =====================================================================
   17. PAGE ÉVÉNEMENTS
   ===================================================================== */
export function Evenements() {
  const [cat, setCat] = useState('Tous les types')
  const filters = useMemo(() => [
    { key: 'country', label: 'Pays', options: COUNTRIES.map((c) => c.name), get: (e) => e.country },
    { key: 'city', label: 'Ville', options: ALL_CITIES, get: (e) => e.city },
    { key: 'period', label: 'Date', options: ['Septembre 2026', 'Octobre 2026', 'Novembre 2026', 'Décembre 2026'], get: (e) => new Date(e.start).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }).replace(/^./, (m) => m.toUpperCase()) },
    { key: 'category', label: 'Catégorie', options: EVENT_CATEGORIES, get: (e) => e.category },
  ], [])
  const { state, setState, result } = useFilterState(filters, events)
  const list = cat === 'Tous les types' ? result : result.filter((e) => e.category === cat)

  return (
    <div className="container">
      <Crumbs items={[{ label: 'Événements' }]} />
      <div className="page-head">
        <h1>Événements</h1>
        <p>Fashion Weeks, défilés, castings, concours, festivals, expositions, salons et lancements : tout l’agenda de la création africaine.</p>
      </div>

      <div className="pill-row mb-16">
        {['Tous les types', ...EVENT_CATEGORIES].map((c) => <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>)}
      </div>

      <FilterBar filters={filters} state={state} setState={setState} count={list.length} />

      <div className="grid grid-3">
        {list.map((e) => <EventCard key={e.id} e={e} />)}
      </div>
      {list.length === 0 && <EmptyState title="Aucun événement" sub="Aucun événement ne correspond à ces filtres pour le moment." />}

      <section className="section">
        <SectionHead eyebrow="Prochains temps forts" title="À ne pas manquer" action="/abonnements" actionLabel="Recevoir les alertes" />
        <div className="stack gap-16">
          {events.slice(0, 3).map((e) => <EventCard key={`l-${e.id}`} e={e} layout="list" />)}
        </div>
      </section>
    </div>
  )
}

/* ---------------------------- Détail événement ------------------------ */
export function EvenementDetail() {
  const { id } = useParams()
  const e = events.find((x) => x.id === id) || events[0]
  const { notify } = useApp()
  const [joining, setJoining] = useState(false)
  const [joined, setJoined] = useState(false)
  const [tab, setTab] = useState('Programme')

  return (
    <div className="container">
      <Crumbs items={[{ label: 'Événements', to: '/evenements' }, { label: e.category }, { label: e.name }]} />

      <div className="split">
        <div>
          <img src={e.poster} alt={e.name} style={{ width: '100%', borderRadius: 'var(--radius-lg)', maxHeight: 480, objectFit: 'cover' }} />
        </div>
        <aside className="stack gap-16">
          <div>
            <Badge tone="terra">{e.category}</Badge>
            <h1 className="mt-8" style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2.2rem)' }}>{e.name}</h1>
            <div className="stack gap-8 muted small mt-8">
              <span>📅 Du {fmtDate(e.start)} au {fmtDate(e.end)}</span>
              <span>⏰ {e.time}</span>
              <span>📍 {e.venue}, {e.city}, {e.flag} {e.country}</span>
              <span>🏢 Organisé par <b style={{ color: 'var(--text)' }}>{e.organizer}</b></span>
              <span>👥 {e.participants} participants inscrits</span>
            </div>
          </div>
          <div className="panel">
            <div className="between mb-16">
              <span className="muted small">Billet standard</span>
              <b className="gold" style={{ fontSize: 22 }}>{e.price ? fcfa(e.price) : 'Entrée libre'}</b>
            </div>
            <Btn className="btn-block" size="lg" onClick={() => setJoining(true)}>{joined ? '✓ Inscription confirmée' : 'Participer'}</Btn>
            <div className="row gap-8 mt-12">
              <Btn variant="outline" size="sm" className="grow" onClick={() => notify('Événement ajouté à votre calendrier 📅')}>Ajouter au calendrier</Btn>
              <Btn variant="dark" size="sm" className="grow" onClick={() => notify('Lien de l’événement copié 🔗')}>Partager</Btn>
            </div>
            {e.price > 0 && <Btn variant="primary" size="sm" className="btn-block mt-12" onClick={() => notify('Redirection vers le paiement du billet 🎟️')}>Acheter un billet</Btn>}
          </div>
          <div className="panel">
            <h4>Informations pratiques</h4>
            <div className="stack gap-10 small">
              <div className="between"><span className="muted">Ouverture des portes</span><b>1 h avant</b></div>
              <div className="between"><span className="muted">Dress code</span><b>Tenue africaine chic</b></div>
              <div className="between"><span className="muted">Accès</span><b>Sur présentation du billet</b></div>
              <div className="between"><span className="muted">Langues</span><b>Français / Anglais</b></div>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-32">
        <Tabs tabs={['Programme', 'Description', 'Galerie', 'Participants', 'Partenaires & sponsors']} value={tab} onChange={setTab} />
        <div className="section-sm">
          {tab === 'Programme' && (
            <div className="timeline">
              {e.programme.map((p) => (
                <div key={p.title} className="timeline-item">
                  <span className="t">{p.time}</span>
                  <div className="panel panel-tight"><b>{p.title}</b></div>
                </div>
              ))}
            </div>
          )}
          {tab === 'Description' && (
            <div className="split">
              <div>
                <h3>À propos de l’événement</h3>
                <p>{e.description}</p>
                <p>
                  L’événement réunit des professionnels de toute l’Afrique : créateurs, marques, mannequins, photographes,
                  acheteurs et institutions. Un espace showroom permet de découvrir et commander les pièces présentées.
                </p>
                <div className="grid grid-3 mt-24">
                  {[['Défilés', '12'], ['Exposants', '48'], ['Pays représentés', '14']].map(([a, b]) => (
                    <div key={a} className="kpi"><b>{b}</b><span>{a}</span></div>
                  ))}
                </div>
              </div>
              <aside className="panel">
                <h3>Organisateur</h3>
                <div className="row gap-12 mb-16">
                  <div className="logo-mark" style={{ width: 46, height: 46, borderRadius: 13, fontSize: 15 }}>{e.organizer.slice(0, 2).toUpperCase()}</div>
                  <div className="stack"><b>{e.organizer}</b><span className="tiny muted">{e.flag} {e.country}</span></div>
                </div>
                <p className="small">Organisateur de {12 + e.participants % 20} événements sur Horizon Afrique.</p>
                <Btn variant="outline" size="sm" className="btn-block" onClick={() => notify('Message envoyé à l’organisateur 💬')}>Contacter l’organisateur</Btn>
              </aside>
            </div>
          )}
          {tab === 'Galerie' && (
            <div className="grid grid-4">{e.gallery.map((g, i) => <img key={i} src={g} alt="" className="ratio-4" loading="lazy" />)}</div>
          )}
          {tab === 'Participants' && (
            <div className="grid grid-4">
              {talents.slice(0, 8).map((t) => (
                <Link key={t.id} to={`/talent/${t.id}`} className="panel panel-tight row gap-12">
                  <Avatar src={t.avatar} size="sm" />
                  <div className="stack"><b style={{ fontSize: 13 }}>{t.name}</b><span className="tiny muted">{t.job}</span></div>
                </Link>
              ))}
            </div>
          )}
          {tab === 'Partenaires & sponsors' && (
            <div className="grid grid-2">
              <div className="panel">
                <h4>Partenaires</h4>
                <div className="stack gap-12">
                  {partners.slice(0, 4).map((p) => (
                    <div key={p.id} className="row gap-12">
                      <div className="logo-mark" style={{ width: 38, height: 38, borderRadius: 11, fontSize: 13 }}>{p.logo}</div>
                      <div className="stack"><b style={{ fontSize: 13.5 }}>{p.name}</b><span className="tiny muted">{p.domain}</span></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="panel">
                <h4>Sponsors</h4>
                <div className="stack gap-12">
                  {sponsors.slice(0, 4).map((s) => (
                    <div key={s.id} className="row gap-12">
                      <div className="logo-mark" style={{ width: 38, height: 38, borderRadius: 11, fontSize: 13 }}>{s.logo}</div>
                      <div className="stack"><b style={{ fontSize: 13.5 }}>{s.name}</b><span className="tiny muted">{s.type}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <section className="section">
        <SectionHead eyebrow="Autres événements" title="Dans la même catégorie" action="/evenements" />
        <div className="grid grid-3">{events.filter((x) => x.id !== e.id).slice(0, 3).map((x) => <EventCard key={x.id} e={x} />)}</div>
      </section>

      <Modal open={joining} onClose={() => setJoining(false)} title={`Participer à ${e.name}`}
        footer={<><Btn onClick={() => { setJoining(false); setJoined(true); notify('Inscription enregistrée ✅ Un email de confirmation vous a été envoyé.') }}>Confirmer ma participation</Btn><Btn variant="ghost" onClick={() => setJoining(false)}>Annuler</Btn></>}>
        <div className="form-grid">
          <div className="field"><label>Nom complet</label><input className="input" defaultValue="Aïcha Kora" /></div>
          <div className="field"><label>Email</label><input className="input" defaultValue="aicha.kora@horizonafrique.com" /></div>
        </div>
        <div className="form-grid">
          <div className="field"><label>Type de participation</label><select className="select"><option>Visiteur</option><option>Créateur / exposant</option><option>Presse</option><option>Acheteur professionnel</option></select></div>
          <div className="field"><label>Nombre de places</label><input className="input" type="number" defaultValue={1} min={1} /></div>
        </div>
        <div className="notice gold"><span>🎟️</span><span className="small">Montant total : <b>{e.price ? fcfa(e.price) : 'Gratuit'}</b> — paiement par Mobile Money ou carte bancaire.</span></div>
      </Modal>
    </div>
  )
}

/* =====================================================================
   19. PAGE OPPORTUNITÉS
   ===================================================================== */
export function Opportunites() {
  const [type, setType] = useState('Tous les types')
  const filters = useMemo(() => [
    { key: 'country', label: 'Pays', options: COUNTRIES.map((c) => c.name), get: (o) => o.country },
    { key: 'city', label: 'Ville', options: ALL_CITIES, get: (o) => o.city },
    { key: 'domain', label: 'Domaine', options: [...new Set(opportunities.map((o) => o.domain))], get: (o) => o.domain },
    { key: 'deadline', label: 'Date limite', options: ['Moins de 15 jours', '15 à 30 jours', 'Plus de 30 jours'], get: (o) => (o.daysLeft < 15 ? 'Moins de 15 jours' : o.daysLeft <= 30 ? '15 à 30 jours' : 'Plus de 30 jours') },
    { key: 'type', label: 'Type', options: OPPORTUNITY_TYPES, get: (o) => o.type },
  ], [])
  const { state, setState, result } = useFilterState(filters, opportunities)
  const list = type === 'Tous les types' ? result : result.filter((o) => o.type === type)

  return (
    <div className="container">
      <Crumbs items={[{ label: 'Opportunités' }]} />
      <div className="page-head">
        <h1>Opportunités professionnelles</h1>
        <p>Offres d’emploi, castings, stages, concours, collaborations, appels à projets et missions pour les professionnels de la création.</p>
      </div>

      <div className="pill-row mb-16">
        {['Tous les types', ...OPPORTUNITY_TYPES].map((t) => <Chip key={t} active={type === t} onClick={() => setType(t)}>{t}</Chip>)}
      </div>

      <FilterBar filters={filters} state={state} setState={setState} count={list.length} />

      <div className="stack gap-12">
        {list.map((o) => <OpportunityRow key={o.id} o={o} />)}
      </div>
      {list.length === 0 && <EmptyState title="Aucune opportunité" sub="Revenez bientôt : de nouvelles offres sont publiées chaque semaine." action="/abonnements" actionLabel="Créer une alerte" />}

      <section className="section">
        <div className="panel" style={{ padding: 32, background: 'linear-gradient(135deg, rgba(74,95,168,0.16), rgba(227,176,75,0.1))' }}>
          <div className="between wrap gap-24">
            <div>
              <h2 className="mb-8">Vous recrutez ou vous lancez un casting ?</h2>
              <p className="mb-0" style={{ maxWidth: '62ch' }}>
                Publiez votre opportunité en quelques minutes. Elle sera diffusée aux profils correspondants et
                pourra être boostée pour toucher 8× plus de candidats.
              </p>
            </div>
            <div className="row gap-12">
              <Btn to="/tableau-de-bord/mes-opportunites">Publier une opportunité</Btn>
              <Btn to="/horizon-boost" variant="outline">Booster l’annonce</Btn>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ---------------------------- Détail opportunité ---------------------- */
export function OpportuniteDetail() {
  const { id } = useParams()
  const o = opportunities.find((x) => x.id === id) || opportunities[0]
  const { notify } = useApp()
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)

  return (
    <div className="container">
      <Crumbs items={[{ label: 'Opportunités', to: '/opportunites' }, { label: o.type }, { label: o.title.slice(0, 30) }]} />

      <div className="split">
        <div>
          <div className="panel">
            <div className="row gap-12 wrap mb-16">
              <Badge tone="indigo">{o.type}</Badge>
              {o.featured && <Badge tone="gold">✦ À la une</Badge>}
              <span className="tiny muted-2">Publiée le {fmtShort(new Date(Date.now() - 3 * 86400000))}</span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.5rem, 2.6vw, 2.1rem)' }}>{o.title}</h1>
            <div className="row gap-12 muted small wrap mb-24">
              <span>🏢 {o.org}</span>
              <span>📍 {o.flag} {o.country}, {o.city}</span>
              <span>💼 {o.contract}</span>
              <span>👥 {o.applicants} candidatures</span>
            </div>

            <h3>Description du poste</h3>
            <p>{o.description}</p>

            <h3 className="mt-24">Missions</h3>
            <ul className="stack gap-8" style={{ paddingLeft: 18 }}>
              {o.missions.map((m) => <li key={m} className="small" style={{ color: 'var(--muted)' }}>{m}</li>)}
            </ul>

            <h3 className="mt-24">Conditions</h3>
            <ul className="stack gap-8" style={{ paddingLeft: 18 }}>
              {o.conditions.map((c) => <li key={c} className="small" style={{ color: 'var(--muted)' }}>{c}</li>)}
            </ul>

            <h3 className="mt-24">Compétences recherchées</h3>
            <div className="pill-row">{o.skills.map((s) => <span key={s} className="chip chip-soft">{s}</span>)}</div>

            <div className="divider" />

            <div className="grid grid-3">
              <div className="panel"><span className="upper muted-2">Localisation</span><b style={{ display: 'block', marginTop: 8 }}>{o.city}, {o.country}</b></div>
              <div className="panel"><span className="upper muted-2">Rémunération</span><b style={{ display: 'block', marginTop: 8 }}>{o.budget}</b></div>
              <div className="panel"><span className="upper muted-2">Date limite</span><b style={{ display: 'block', marginTop: 8 }}>{fmtDate(o.deadline)}</b></div>
            </div>
          </div>
        </div>

        <aside className="stack gap-16">
          <div className="panel">
            <div className="between mb-16">
              <span className="muted small">Candidature</span>
              <Badge tone="terra">{o.daysLeft} jours restants</Badge>
            </div>
            <Btn className="btn-block" size="lg" onClick={() => setApplying(true)}>{applied ? '✓ Candidature envoyée' : 'Postuler maintenant'}</Btn>
            <div className="row gap-8 mt-12">
              <Btn variant="outline" size="sm" className="grow" onClick={() => notify('Opportunité enregistrée ★')}>☆ Enregistrer</Btn>
              <Btn variant="dark" size="sm" className="grow" onClick={() => notify('Lien copié 🔗')}>Partager</Btn>
            </div>
          </div>
          <div className="panel">
            <h4>À propos de l’organisation</h4>
            <div className="row gap-12 mb-16">
              <div className="logo-mark" style={{ width: 46, height: 46, borderRadius: 13, fontSize: 15 }}>{o.org.slice(0, 2).toUpperCase()}</div>
              <div className="stack"><b>{o.org}</b><span className="tiny muted">{o.flag} {o.country}</span></div>
            </div>
            <p className="small">Organisation vérifiée par Horizon Afrique. {8 + o.applicants % 12} opportunités publiées.</p>
            <Btn to="/annuaire" variant="outline" size="sm" className="btn-block">Voir la fiche</Btn>
          </div>
          <div className="panel">
            <h4>Statistiques de l’offre</h4>
            <div className="stack gap-12 small">
              <div className="between"><span className="muted">Vues</span><b>{1200 + o.applicants * 12}</b></div>
              <div className="between"><span className="muted">Candidatures</span><b>{o.applicants}</b></div>
              <div className="between"><span className="muted">Profils correspondants</span><b>{48 + o.applicants}</b></div>
            </div>
          </div>
        </aside>
      </div>

      <section className="section">
        <SectionHead eyebrow="Opportunités similaires" title="Autres offres qui pourraient vous intéresser" action="/opportunites" />
        <div className="stack gap-12">{opportunities.filter((x) => x.id !== o.id).slice(0, 4).map((x) => <OpportunityRow key={x.id} o={x} />)}</div>
      </section>

      <Modal open={applying} onClose={() => setApplying(false)} title={`Postuler — ${o.title}`}
        footer={<><Btn onClick={() => { setApplying(false); setApplied(true); notify('Candidature transmise ✅ Vous serez notifié de la réponse.') }}>Envoyer ma candidature</Btn><Btn variant="ghost" onClick={() => setApplying(false)}>Annuler</Btn></>}>
        <div className="form-grid">
          <div className="field"><label>Nom complet</label><input className="input" defaultValue="Aïcha Kora" /></div>
          <div className="field"><label>Email</label><input className="input" defaultValue="aicha.kora@horizonafrique.com" /></div>
        </div>
        <div className="form-grid">
          <div className="field"><label>Téléphone</label><input className="input" defaultValue="+229 96 45 12 88" /></div>
          <div className="field"><label>Années d’expérience</label><input className="input" type="number" defaultValue={6} /></div>
        </div>
        <div className="field"><label>Lettre de motivation</label><textarea className="textarea" placeholder="Présentez votre parcours et votre motivation…" /></div>
        <div className="field">
          <label>Pièces jointes</label>
          <div className="row gap-12">
            <span className="tag">CV_Aicha_Kora.pdf</span>
            <span className="tag">Portfolio_2026.pdf</span>
            <button className="chip">+ Ajouter un fichier</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
