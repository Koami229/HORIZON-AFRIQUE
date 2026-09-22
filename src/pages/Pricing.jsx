import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Avatar, Badge, Btn, Chip, Crumbs, SectionHead, Tabs, useApp } from '../components/ui.jsx'
import { IMG, boostTargets, creations, currentUser, events, fcfa, productList, products, videos } from '../data.js'

/* =====================================================================
   30. PAGE ABONNEMENTS
   ===================================================================== */
export function Abonnements() {
  const { notify, plan: currentPlan, setPlan } = useApp()
  const [cycle, setCycle] = useState('Mensuel')

  const plans = [
    {
      name: 'Horizon Free', price: 0, tagline: 'Gratuit — pour découvrir',
      features: ['Profil public complet', '3 publications par mois', 'Accès illimité à la galerie et aux vidéos', 'Messagerie limitée à 5 conversations', 'Participation aux événements', '0 Boost inclus'],
      cta: 'Choisir cette formule',
    },
    {
      name: 'Horizon Starter', price: 5000, tagline: '5 000 FCFA / mois', badge: 'Populaire',
      features: ['Tout Horizon Free', 'Publications illimitées', 'Portfolio jusqu’à 30 visuels', 'Statistiques de base', 'Badge Starter sur votre profil', '1 Boost offert par mois', 'Accès aux opportunités'],
      cta: 'Choisir cette formule',
    },
    {
      name: 'Horizon Pro', price: 10000, tagline: '10 000 FCFA / mois',
      features: ['Tout Horizon Starter', 'Boutique en ligne activée', 'Commandes et paiements en ligne', 'Statistiques détaillées et export', 'Badge vérifié ✓', '3 Boost offerts par mois', 'Mise en avant dans l’annuaire', '0 % de commission les 3 premiers mois'],
      cta: 'Choisir cette formule',
    },
    {
      name: 'Horizon Premium', price: 20000, tagline: '20 000 FCFA / mois',
      features: ['Tout Horizon Pro', 'Multi-utilisateurs (5 comptes)', 'Collections et campagnes illimitées', 'Accès API et export de données', 'Page marque personnalisée', '10 Boost offerts par mois', 'Accompagnement dédié', 'Mise en avant sur la page d’accueil'],
      cta: 'Choisir cette formule',
    },
  ]

  return (
    <div className="container">
      <Crumbs items={[{ label: 'Abonnements' }]} />
      <div className="page-head center-text">
        <span className="upper gold">Abonnements Horizon Afrique</span>
        <h1>Choisissez la formule qui fait grandir votre activité</h1>
        <p style={{ maxWidth: '70ch', margin: '0 auto' }}>
          Toutes les formules incluent l’accès à la plateforme, la messagerie professionnelle et les opportunités.
          Sans engagement, résiliable à tout moment, paiement par Mobile Money ou carte bancaire.
        </p>
        <div className="row gap-8 center mt-16">
          <Chip active={cycle === 'Mensuel'} onClick={() => setCycle('Mensuel')}>Mensuel</Chip>
          <Chip active={cycle === 'Annuel (-20 %)'} onClick={() => setCycle('Annuel (-20 %)')}>Annuel (-20 %)</Chip>
        </div>
      </div>

      <div className="grid grid-4 section-sm">
        {plans.map((p) => {
          const price = cycle.includes('Annuel') ? Math.round(p.price * 12 * 0.8) : p.price
          return (
            <div key={p.name} className={`price-card ${p.badge ? 'featured' : ''}`}>
              {p.badge && <div style={{ position: 'absolute', top: 18, right: 18 }}><Badge tone="gold">{p.badge}</Badge></div>}
              <span className="upper muted-2">{p.tagline}</span>
              <h2 className="mt-8 h-sub">{p.name}</h2>
              <div className="amount">{p.price === 0 ? 'Gratuit' : fcfa(price)}</div>
              <span className="tiny muted">{p.price === 0 ? 'pour toujours' : cycle.includes('Annuel') ? 'par an (facturé annuellement)' : 'par mois'}</span>
              <ul>{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
              {currentPlan === p.name && <div className="mb-8"><Badge tone="green">✓ Formule actuelle</Badge></div>}
              <Btn
                variant={p.badge ? 'primary' : 'outline'} className="btn-block"
                onClick={() => { setPlan(p.name); notify(`Formule ${p.name} sélectionnée — redirection vers le paiement 💳`) }}
              >
                {p.cta}
              </Btn>
            </div>
          )
        })}
      </div>

      <section className="section-sm">
        <SectionHead eyebrow="Comparatif" title="Ce que chaque formule débloque" />
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Fonctionnalité</th><th>Free</th><th>Starter</th><th>Pro</th><th>Premium</th></tr>
            </thead>
            <tbody>
              {[
                ['Publications par mois', '3', 'Illimité', 'Illimité', 'Illimité'],
                ['Portfolio', '10 visuels', '30 visuels', '100 visuels', 'Illimité'],
                ['Boutique en ligne', '—', '—', '✓', '✓'],
                ['Statistiques', 'Basiques', 'Basiques', 'Détaillées', 'Avancées + API'],
                ['Badge', '—', 'Starter', 'Vérifié', 'Vérifié + Premium'],
                ['Boost offerts / mois', '0', '1', '3', '10'],
                ['Commission marketplace', '10 %', '7 %', '5 %', '3 %'],
                ['Comptes utilisateurs', '1', '1', '1', '5'],
              ].map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) => <td key={i} style={i === 0 ? { fontWeight: 600 } : { color: cell === '✓' ? 'var(--gold)' : undefined }}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section-sm">
        <div className="grid grid-3">
          {[
            ['💳', 'Paiement flexible', 'Mobile Money (MTN, Moov, Orange, Wave) ou carte bancaire. Facture automatique.'],
            ['🔄', 'Sans engagement', 'Changez de formule ou résiliez à tout moment depuis vos paramètres.'],
            ['🛡️', 'Garantie 30 jours', 'Satisfait ou remboursé sous 30 jours sur les formules payantes.'],
          ].map(([ico, t, d]) => (
            <div key={t} className="panel">
              <div style={{ fontSize: 24 }}>{ico}</div>
              <b style={{ display: 'block', marginTop: 8 }}>{t}</b>
              <p className="small mb-0 mt-8">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-sm">
        <SectionHead eyebrow="Questions fréquentes" title="Tout ce qu’il faut savoir" />
        <div className="stack gap-12">
          {[
            ['Puis-je changer de formule en cours de mois ?', 'Oui. Le changement est immédiat et le montant est ajusté au prorata sur la facture suivante.'],
            ['Quels moyens de paiement acceptez-vous ?', 'Mobile Money (MTN, Moov, Orange, Wave) et cartes bancaires (Visa, Mastercard, GIM-UEMOA).'],
            ['L’abonnement est-il obligatoire pour vendre ?', 'Non. La boutique est disponible à partir de la formule Horizon Pro ; en dessous, vous pouvez publier des créations sans vendre.'],
            ['Comment fonctionne Horizon Boost ?', '1 000 FCFA pour 24 h de mise en avant. Les formules Starter, Pro et Premium incluent des Boosts offerts chaque mois.'],
            ['Puis-je annuler à tout moment ?', 'Oui, sans frais. L’accès reste actif jusqu’à la fin de la période payée.'],
          ].map(([q, a]) => (
            <details key={q} className="panel panel-tight">
              <summary style={{ cursor: 'pointer', fontWeight: 600 }}>{q}</summary>
              <p className="small mt-8 mb-0">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  )
}

/* =====================================================================
   31. PAGE HORIZON BOOST
   ===================================================================== */
export function HorizonBoost() {
  const { notify } = useApp()
  const [step, setStep] = useState(1)
  const [target, setTarget] = useState(null)
  const [content, setContent] = useState(null)
  const [duration, setDuration] = useState(24)
  const [pay, setPay] = useState('Mobile Money')

  const durations = [
    { h: 24, price: 1000, label: '24 h — 1 jour', desc: 'Boost standard — idéal pour une publication ou un produit.' },
    { h: 72, price: 2700, label: '72 h — 3 jours', desc: 'Bon rapport durée / prix pour une collection ou un événement.' },
    { h: 168, price: 5500, label: '168 h — 7 jours', desc: 'Visibilité longue durée pour un profil, une marque ou une campagne.' },
  ]
  const price = durations.find((d) => d.h === duration).price

  const contents = {
    profil: [{ id: 'me', label: `${currentUser.name} — profil ${currentUser.category}`, img: currentUser.cover }],
    publication: [{ id: 'p1', label: 'Nouvelle collection « Sable & Or »', img: IMG.garment[0] }, { id: 'p2', label: 'Coulisses d’atelier à Cotonou', img: IMG.atelier[0] }],
    produit: productList.slice(0, 4).map((p) => ({ id: p.id, label: `${p.name} — ${fcfa(p.price)}`, img: p.image })),
    collection: creations.slice(0, 3).map((c) => ({ id: c.id, label: c.title, img: c.image })),
    video: videos.slice(0, 3).map((v) => ({ id: v.id, label: v.title, img: v.thumb })),
    evenement: events.slice(0, 3).map((e) => ({ id: e.id, label: `${e.name} — ${e.city}`, img: e.poster })),
    opportunite: [{ id: 'o1', label: 'Casting mannequins — Bénin Fashion Show', img: IMG.runway[2] }, { id: 'o2', label: 'Styliste senior — prêt-à-porter', img: IMG.garment[3] }],
  }

  const steps = ['Type de contenu', 'Contenu à promouvoir', 'Durée', 'Paiement', 'Confirmation']

  const reset = () => { setStep(1); setTarget(null); setContent(null); setDuration(24) }

  return (
    <div className="container">
      <Crumbs items={[{ label: 'Horizon Boost' }]} />
      <div className="page-head center-text">
        <span className="upper gold">Horizon Boost</span>
        <h1>Augmentez votre visibilité sur Horizon Afrique</h1>
        <p style={{ maxWidth: '68ch', margin: '0 auto' }}>
          Votre contenu est placé en tête des recommandations, du fil d’actualité, de la marketplace et des résultats
          de recherche. Résultats visibles en moins de 30 minutes.
        </p>
        <div className="row gap-12 center wrap mt-16">
          <Badge tone="gold">1 000 FCFA / 24 h</Badge>
          <Badge tone="indigo">×8 de vues en moyenne</Badge>
          <Badge tone="green">Paiement Mobile Money</Badge>
        </div>
      </div>

      <div className="grid grid-4 section-sm">
        {[['12 400', 'Boosts réalisés'], ['×8,4', 'Vues moyennes'], ['+340 %', 'Interactions en 24 h'], ['30 min', 'Mise en ligne']].map(([a, b]) => (
          <div key={b} className="kpi center-text"><b>{a}</b><span>{b}</span></div>
        ))}
      </div>

      <section className="section-sm">
        <div className="panel" style={{ padding: 30 }}>
          <div className="stepper-h mb-24">
            {steps.map((s, i) => (
              <span key={s} className="row gap-8" style={{ alignItems: 'center' }}>
                <span className={`s ${step >= i + 1 ? 'on' : ''}`}><b>{i + 1}</b>{s}</span>
                {i < steps.length - 1 && <span style={{ width: 26, height: 1, background: 'var(--line)' }} />}
              </span>
            ))}
          </div>

          {step === 1 && (
            <>
              <h2 className="h-sub">Que souhaitez-vous promouvoir ?</h2>
              <div className="grid grid-4">
                {boostTargets.map((t) => (
                  <button key={t.key} className={`boost-card ${target === t.key ? 'active' : ''}`} onClick={() => { setTarget(t.key); setStep(2) }}>
                    <div className="icon">{t.icon}</div>
                    <b>{t.label}</b>
                    <p className="tiny mb-0 mt-8">{t.desc}</p>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && target && (
            <>
              <div className="between mb-16">
                <h2 className="mb-0 h-sub">Sélectionnez le contenu à promouvoir</h2>
                <Badge tone="gold">{boostTargets.find((t) => t.key === target)?.label}</Badge>
              </div>
              <div className="grid grid-3">
                {contents[target].map((c) => (
                  <button key={c.id} className="list-row" style={{ borderColor: content === c.id ? 'var(--gold)' : undefined, background: content === c.id ? 'rgba(227,176,75,0.08)' : undefined }} onClick={() => setContent(c.id)}>
                    <img src={c.img} alt="" className="ratio-1" style={{ width: 62, borderRadius: 10 }} />
                    <div className="stack"><b style={{ fontSize: 13, textAlign: 'left' }}>{c.label}</b><span className="tiny muted">Prêt à être boosté</span></div>
                  </button>
                ))}
              </div>
              <div className="row gap-12 mt-24">
                <Btn variant="outline" onClick={() => setStep(1)}>← Retour</Btn>
                <Btn disabled={!content} onClick={() => setStep(3)}>Continuer</Btn>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="h-sub">Choisissez la durée du Boost</h2>
              <div className="grid grid-3">
                {durations.map((d) => (
                  <button key={d.h} className={`boost-card ${duration === d.h ? 'active' : ''}`} onClick={() => setDuration(d.h)}>
                    <div className="between">
                      <b style={{ fontFamily: 'var(--display)', fontSize: 20 }}>{d.label}</b>
                      <b className="gold">{fcfa(d.price)}</b>
                    </div>
                    <p className="tiny mb-0 mt-8">{d.desc}</p>
                  </button>
                ))}
              </div>
              <div className="notice gold mt-24">
                <span>🚀</span>
                <span className="small">Aperçu : votre contenu apparaîtra en première position des recommandations pendant <b>{durations.find((d) => d.h === duration).label}</b>.</span>
              </div>
              <div className="row gap-12 mt-24">
                <Btn variant="outline" onClick={() => setStep(2)}>← Retour</Btn>
                <Btn onClick={() => setStep(4)}>Continuer</Btn>
              </div>
            </>
          )}

          {step === 4 && (
            <div className="split">
              <div>
                <h2 className="h-sub">Moyen de paiement</h2>
                <div className="grid grid-2 mb-24">
                  {[['Mobile Money', '📱'], ['Carte bancaire', '💳']].map(([m, ico]) => (
                    <button key={m} className="account-type" style={{ borderColor: pay === m ? 'var(--gold)' : undefined, background: pay === m ? 'rgba(227,176,75,0.08)' : undefined }} onClick={() => setPay(m)}>
                      <span className="icon">{ico}</span><span className="stack"><b>{m}</b><span className="tiny muted">Paiement immédiat et sécurisé</span></span>
                    </button>
                  ))}
                </div>
                {pay === 'Mobile Money' ? (
                  <div className="form-grid">
                    <div className="field"><label>Opérateur</label><select className="select"><option>MTN Mobile Money</option><option>Moov Money</option><option>Orange Money</option><option>Wave</option></select></div>
                    <div className="field"><label>Numéro</label><input className="input" defaultValue="+229 96 45 12 88" /></div>
                  </div>
                ) : (
                  <div className="form-grid">
                    <div className="field"><label>Numéro de carte</label><input className="input" placeholder="4242 4242 4242 4242" /></div>
                    <div className="field"><label>Expiration / CVC</label><input className="input" placeholder="MM/AA — 123" /></div>
                  </div>
                )}
                <div className="row gap-12 mt-24">
                  <Btn variant="outline" onClick={() => setStep(3)}>← Retour</Btn>
                  <Btn onClick={() => setStep(5)}>Confirmer et payer {fcfa(price)}</Btn>
                </div>
              </div>

              <aside className="panel">
                <h2 className="h-sub">Aperçu de votre Boost</h2>
                {content && (
                  <img src={contents[target].find((c) => c.id === content)?.img} alt="" className="ratio-16 mb-16" />
                )}
                <div className="stack gap-10 small">
                  <div className="between"><span className="muted">Type de contenu</span><b>{boostTargets.find((t) => t.key === target)?.label}</b></div>
                  <div className="between"><span className="muted">Durée</span><b>{durations.find((d) => d.h === duration).label}</b></div>
                  <div className="between"><span className="muted">Paiement</span><b>{pay}</b></div>
                  <div className="between"><span className="muted">Début</span><b>Immédiat</b></div>
                </div>
                <div className="divider" />
                <div className="between"><span>Total</span><b className="gold" style={{ fontFamily: 'var(--display)', fontSize: 24 }}>{fcfa(price)}</b></div>
              </aside>
            </div>
          )}

          {step === 5 && (
            <div className="center-text" style={{ padding: 30 }}>
              <div style={{ fontSize: 46 }}>🚀</div>
              <h2>Votre Boost est actif</h2>
              <p style={{ maxWidth: '60ch', margin: '0 auto 20px' }}>
                Le contenu sélectionné est mis en avant pour <b>{durations.find((d) => d.h === duration).label}</b>.
                Vous recevrez un rapport de performance à la fin de la campagne.
              </p>
              <div className="grid grid-3 mb-24">
                <div className="kpi center-text"><b>1 284</b><span>Vues estimées</span></div>
                <div className="kpi center-text"><b>96</b><span>Interactions estimées</span></div>
                <div className="kpi center-text"><b>{fcfa(price)}</b><span>Montant payé</span></div>
              </div>
              <div className="row gap-12 center wrap">
                <Btn to="/tableau-de-bord/boost">Suivre mes Boosts</Btn>
                <Btn variant="outline" onClick={reset}>Booster un autre contenu</Btn>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="section-sm">
        <SectionHead eyebrow="Ils ont boosté" title="Cas concrets" />
        <div className="grid grid-3">
          {[
            ['Aïcha Kora', 'Styliste — Bénin', 'Un Boost de 24 h sur mon profil m’a apporté 12 demandes de collaboration en une journée.', '+340 %'],
            ['Wax & Co', 'Marque — Sénégal', 'Nous boostons chaque nouvelle collection. Les ventes du premier jour ont doublé.', '+180 %'],
            ['Anifa Rasoanaivo', 'Artisane — Madagascar', 'Le Boost de ma collection raphia m’a ouvert un premier client à l’export.', '+220 %'],
          ].map(([n, r, t, kpi]) => (
            <div key={n} className="panel">
              <div className="between mb-16">
                <div className="row gap-12">
                  <Avatar src={IMG.people[2]} size="sm" />
                  <div className="stack"><b style={{ fontSize: 13.5 }}>{n}</b><span className="tiny muted">{r}</span></div>
                </div>
                <Badge tone="green">{kpi}</Badge>
              </div>
              <p className="small mb-0">« {t} »</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-sm">
        <div className="panel center-text" style={{ padding: 36 }}>
          <h2 className="mb-8">Besoin de visibilité en continu ?</h2>
          <p style={{ maxWidth: '62ch', margin: '0 auto 20px' }}>
            Les formules Starter, Pro et Premium incluent 1, 3 et 10 Boosts offerts chaque mois — jusqu’à 55 000 FCFA
            de visibilité offerte par an avec Horizon Premium.
          </p>
          <div className="row gap-12 center wrap">
            <Btn to="/abonnements">Comparer les abonnements</Btn>
            <Link to="/tableau-de-bord/abonnement" className="link-arrow">Voir mon abonnement actuel →</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
