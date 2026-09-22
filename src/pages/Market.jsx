import { useMemo, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  Avatar, Badge, BrandCard, Btn, Chip, Crumbs, EmptyState, FilterBar, ProductCard, SectionHead, Stars,
  Tabs, useApp, useFilterState,
} from '../components/ui.jsx'
import {
  COUNTRIES, IMG, PRODUCT_CATEGORIES, brands, fcfa, fmtShort, productList, shortNumber,
} from '../data.js'

const STORES = [...new Set(productList.map((p) => p.shop))]

/* =====================================================================
   22. HORIZON MARKETPLACE
   ===================================================================== */
export function Marketplace() {
  const [cat, setCat] = useState('Toutes')
  const filters = useMemo(() => [
    { key: 'country', label: 'Pays', options: COUNTRIES.map((c) => c.name), get: (p) => p.country },
    { key: 'seller', label: 'Boutique', options: [...new Set(productList.map((p) => p.seller))], get: (p) => p.seller },
    { key: 'price', label: 'Prix', options: ['Moins de 50 000 FCFA', '50 000 — 150 000 FCFA', 'Plus de 150 000 FCFA'], get: (p) => (p.price < 50000 ? 'Moins de 50 000 FCFA' : p.price <= 150000 ? '50 000 — 150 000 FCFA' : 'Plus de 150 000 FCFA') },
  ], [])
  const { state, setState, result } = useFilterState(filters, productList)
  const list = cat === 'Toutes' ? result : result.filter((p) => p.category === cat)

  const { cart } = useApp()

  return (
    <div className="container">
      <Crumbs items={[{ label: 'Marketplace' }]} />
      <div className="page-head">
        <div className="between wrap">
          <div>
            <h1>Horizon Marketplace</h1>
            <p style={{ maxWidth: '70ch' }}>
              Achetez directement auprès des créateurs, artisans et marques africaines. Paiement par Mobile Money ou
              carte bancaire, livraison partout en Afrique.
            </p>
          </div>
          <div className="row gap-12">
            <Btn to="/panier" variant="outline" size="sm">🛒 Panier ({cart.length})</Btn>
            <Btn to="/boutique" size="sm">Ouvrir une boutique</Btn>
          </div>
        </div>
      </div>

      {/* Bandeau */}
      <div className="panel mb-24" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="split-2" style={{ gap: 0, alignItems: 'stretch' }}>
          <div style={{ padding: 32 }}>
            <Badge tone="gold">✦ Nouveauté</Badge>
            <h2 className="mt-8">Créations artisanales, faites main</h2>
            <p className="mb-16">Soutenez directement les artisans du continent : vannerie raphia, bijoux filigranes, cuir tanné naturellement.</p>
            <div className="row gap-12">
              <Btn onClick={() => setCat('Artisanat')}>Voir les produits artisanaux</Btn>
              <Btn to="/horizon-boost" variant="outline">Booster ma boutique</Btn>
            </div>
          </div>
          <img src={IMG.marketplaceStory} alt="" style={{ width: '100%', height: '100%', minHeight: 240, objectFit: 'cover' }} />
        </div>
      </div>

      <div className="pill-row mb-16">
        {['Toutes', ...PRODUCT_CATEGORIES].map((c) => <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>)}
      </div>

      <FilterBar filters={filters} state={state} setState={setState} count={list.length} />

      <section className="section-sm">
        <SectionHead eyebrow="Produits populaires" title="Les plus demandés cette semaine" />
        <div className="grid grid-5">{[...list].sort((a, b) => b.sold - a.sold).slice(0, 5).map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </section>

      <section className="section-sm">
        <SectionHead eyebrow="Nouveautés" title="Les dernières pièces publiées" />
        <div className="grid grid-5">{list.slice(0, 5).map((p) => <ProductCard key={`n-${p.id}`} p={p} />)}</div>
      </section>

      <section className="section-sm">
        <SectionHead eyebrow="Meilleures ventes" title="Le top des ventes" />
        <div className="grid grid-5">{[...list].sort((a, b) => b.reviews - a.reviews).slice(0, 5).map((p) => <ProductCard key={`b-${p.id}`} p={p} />)}</div>
      </section>

      <section className="section-sm">
        <SectionHead eyebrow="Créations artisanales" title="Faits main par des artisans" action="/annuaire" actionLabel="Annuaire des artisans" />
        <div className="grid grid-4">{list.filter((p) => ['Artisanat', 'Décoration', 'Poterie', 'Textile', 'Bijoux'].includes(p.category)).slice(0, 4).map((p) => <ProductCard key={`a-${p.id}`} p={p} />)}</div>
      </section>

      <section className="section-sm">
        <SectionHead eyebrow="Marques recommandées" title="Boutiques officielles" action="/marques" />
        <div className="grid grid-3">{brands.slice(0, 3).map((b) => <BrandCard key={b.id} b={b} />)}</div>
      </section>

      <section className="section">
        <SectionHead eyebrow="Tout le catalogue" title={`${list.length} produits disponibles`} />
        <div className="grid grid-5">{list.map((p) => <ProductCard key={`all-${p.id}`} p={p} />)}</div>
        {list.length === 0 && <EmptyState title="Aucun produit" sub="Aucun produit ne correspond à ces filtres." />}
      </section>
    </div>
  )
}

/* =====================================================================
   23. PAGE PRODUIT
   ===================================================================== */
export function Produit() {
  const { id } = useParams()
  const nav = useNavigate()
  const p = productList.find((x) => x.id === id) || productList[0]
  const { addToCart, toggleSave, saves, notify } = useApp()
  const [size, setSize] = useState(p.options[0])
  const [color, setColor] = useState(p.colors[0])
  const [qty, setQty] = useState(1)
  const [img, setImg] = useState(p.image)
  const [tab, setTab] = useState('Description')

  const reviews = [
    ['Fatou Diallo', 5, 'Pièce magnifique, tissu de très bonne qualité. Livraison rapide à Dakar.', '2026-08-22'],
    ['Koffi Mensah', 4, 'Très satisfait, la taille correspond exactement au guide.', '2026-08-05'],
    ['Ngozi Okafor', 5, 'Le travail artisanal est remarquable. Je recommande vivement.', '2026-07-19'],
  ]

  return (
    <div className="container">
      <Crumbs items={[{ label: 'Marketplace', to: '/marketplace' }, { label: p.category, to: '/marketplace' }, { label: p.name }]} />

      <div className="split">
        <div className="stack gap-16">
          <img src={img} alt={p.name} style={{ width: '100%', borderRadius: 'var(--radius)', aspectRatio: '1', objectFit: 'cover' }} />
          <div className="grid grid-4" style={{ gap: 12 }}>
            {p.gallery.map((g, i) => (
              <button key={i} onClick={() => setImg(g)} aria-label={`Afficher la photo ${i + 1} de ${p.name}`} title={`Photo ${i + 1}`} style={{ padding: 0, border: img === g ? '2px solid var(--gold)' : '1px solid var(--line)', borderRadius: 12, overflow: 'hidden', background: 'none' }}>
                <img src={g} alt="" className="ratio-1" style={{ borderRadius: 10 }} loading="lazy" />
              </button>
            ))}
          </div>
          {p.id === 'prd-1' && (
            <div className="notice gold">
              <span>🎬</span>
              <div><b>Vidéo du produit disponible</b><p className="small mb-0">Découvrez la pièce portée et filmée dans l’atelier de Cotonou.</p></div>
              <Btn to="/videos" variant="outline" size="sm" className="nowrap">Regarder</Btn>
            </div>
          )}
        </div>

        <aside className="stack gap-16">
          <div>
            <div className="row gap-8 mb-8">
              <Badge tone="indigo">{p.category}</Badge>
              {p.boost && <Badge tone="gold">✦ Boost</Badge>}
              <Badge tone="green">Stock : {p.stock}</Badge>
            </div>
            <h1 style={{ fontSize: 'clamp(1.5rem, 2.4vw, 2rem)' }}>{p.name}</h1>
            <div className="row gap-12 mb-8">
              <Stars value={Number(p.rating)} />
              <span className="small muted">{p.rating} · {p.reviews} avis · {p.sold} vendus</span>
            </div>
            <div className="row gap-12" style={{ alignItems: 'baseline' }}>
              <b className="gold" style={{ fontFamily: 'var(--display)', fontSize: 34 }}>{fcfa(p.price)}</b>
              <span className="muted small" style={{ textDecoration: 'line-through' }}>{fcfa(Math.round(p.price * 1.2))}</span>
            </div>
          </div>

          <div className="panel panel-tight">
            <div className="row gap-12">
              <Avatar src={IMG.people[4]} size="sm" />
              <div className="stack">
                <span className="row gap-8"><b style={{ fontSize: 13.5 }}>{p.seller}</b><Badge tone="gold">Marque vérifiée</Badge></span>
                <span className="tiny muted">{p.flag} {p.country} · réponse en ~2 h</span>
              </div>
            </div>
          </div>

          <div>
            <span className="upper muted-2">Taille / format</span>
            <div className="pill-row mt-8">{p.options.map((o) => <Chip key={o} active={size === o} onClick={() => setSize(o)}>{o}</Chip>)}</div>
          </div>

          <div>
            <span className="upper muted-2">Couleur</span>
            <div className="pill-row mt-8">{p.colors.map((c) => <Chip key={c} active={color === c} onClick={() => setColor(c)}>{c}</Chip>)}</div>
          </div>

          <div className="row gap-12">
            <div className="row gap-8">
              <button className="icon-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <b style={{ width: 34, textAlign: 'center' }}>{qty}</b>
              <button className="icon-btn" onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
            <span className="small muted">Livraison : {fcfa(p.shipping)}</span>
          </div>

          <div className="stack gap-12">
            <Btn size="lg" onClick={() => addToCart(p.id, qty)}>Ajouter au panier</Btn>
            <Btn variant="terra" size="lg" onClick={() => { addToCart(p.id, qty); nav('/panier') }}>Acheter maintenant</Btn>
            <div className="row gap-12">
              <Btn variant="outline" className="grow" onClick={() => toggleSave(p.id)}>
                {saves.has(p.id) ? '★ Dans mes favoris' : '☆ Ajouter aux favoris'}
              </Btn>
              <button className="icon-btn" title="Partager la fiche produit" aria-label="Partager la fiche produit" onClick={() => notify('Lien du produit copié 🔗')}>↗</button>
            </div>
            <Btn variant="outline" onClick={() => notify('Message envoyé au vendeur 💬')}>Contacter le vendeur</Btn>
          </div>

          <div className="panel panel-tight">
            <div className="stack gap-10 small">
              <span>🚚 Expédition sous 48 h</span>
              <span>↩️ Retour gratuit sous 14 jours</span>
              <span>🔒 Paiement sécurisé Mobile Money & carte bancaire</span>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-32">
        <Tabs tabs={['Description', 'Avis clients', 'Livraison & retours']} value={tab} onChange={setTab} />
        <div className="section-sm">
          {tab === 'Description' && (
            <div className="split">
              <div>
                <h3>À propos de cette pièce</h3>
                <p>{p.description}</p>
                <p>
                  Chaque pièce est numérotée et accompagnée d’un certificat d’authenticité. Les teintures sont réalisées
                  à la main selon des techniques traditionnelles transmises depuis plusieurs générations.
                </p>
                <div className="grid grid-3 mt-24">
                  {[['Matières', 'Coton bio, wax naturel'], ['Origine', `${p.flag} ${p.country}`], ['Créateur', p.seller]].map(([a, b]) => (
                    <div key={a} className="panel"><span className="upper muted-2">{a}</span><b style={{ display: 'block', marginTop: 8 }}>{b}</b></div>
                  ))}
                </div>
              </div>
              <aside className="panel">
                <h3>Fiche technique</h3>
                <div className="stack gap-10 small">
                  <div className="between"><span className="muted">Référence</span><b>{p.id.toUpperCase()}</b></div>
                  <div className="between"><span className="muted">Stock</span><b>{p.stock} unités</b></div>
                  <div className="between"><span className="muted">Options</span><b>{p.options.join(', ')}</b></div>
                  <div className="between"><span className="muted">Couleurs</span><b>{p.colors.join(', ')}</b></div>
                  <div className="between"><span className="muted">Livraison</span><b>{fcfa(p.shipping)}</b></div>
                </div>
              </aside>
            </div>
          )}
          {tab === 'Avis clients' && (
            <div className="split">
              <div className="stack gap-16">
                {reviews.map(([n, note, t, d]) => (
                  <div key={n} className="panel">
                    <div className="between mb-8"><b>{n}</b><Stars value={note} /></div>
                    <p className="small mb-8">« {t} »</p>
                    <span className="tiny muted-2">{fmtShort(d)}</span>
                  </div>
                ))}
              </div>
              <aside className="panel">
                <h3>Note globale</h3>
                <div className="row gap-16">
                  <b style={{ fontFamily: 'var(--display)', fontSize: 42 }}>{p.rating}</b>
                  <div className="stack"><Stars value={Number(p.rating)} /><span className="tiny muted">{p.reviews} avis</span></div>
                </div>
                <div className="divider" />
                <div className="stack gap-8 small">
                  <div className="between"><span className="muted">Qualité</span><b>4,9</b></div>
                  <div className="between"><span className="muted">Conformité</span><b>4,7</b></div>
                  <div className="between"><span className="muted">Délai</span><b>4,6</b></div>
                </div>
              </aside>
            </div>
          )}
          {tab === 'Livraison & retours' && (
            <div className="grid grid-2">
              <div className="panel">
                <h3>Livraison</h3>
                <p className="small">Expédition sous 48 h ouvrées depuis {p.country}. Délais indicatifs : 2 à 4 jours en Afrique de l’Ouest, 5 à 9 jours pour le reste du continent, 7 à 14 jours à l’international.</p>
                <div className="stack gap-8 small">
                  <div className="between"><span className="muted">Cotonou → Abidjan</span><b>3 jours</b></div>
                  <div className="between"><span className="muted">Cotonou → Dakar</span><b>4 jours</b></div>
                  <div className="between"><span className="muted">Cotonou → Lagos</span><b>2 jours</b></div>
                </div>
              </div>
              <div className="panel">
                <h3>Retours</h3>
                <p className="small">Retour gratuit sous 14 jours si la pièce n’a pas été portée et conserve son étiquette. Les pièces sur mesure ne sont pas éligibles au retour.</p>
                <div className="pill-row">
                  {['14 jours', 'Frais offerts', 'Remboursement 72 h'].map((t) => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <section className="section">
        <SectionHead eyebrow="Produits similaires" title="Dans la même catégorie" action="/marketplace" />
        <div className="grid grid-4">{productList.filter((x) => x.category === p.category && x.id !== p.id).concat(productList.slice(0, 2)).slice(0, 4).map((x) => <ProductCard key={x.id} p={x} />)}</div>
      </section>

      <section className="section">
        <SectionHead eyebrow="Boutiques recommandées" title="Autres vendeurs vérifiés" action="/annuaire" />
        <div className="grid grid-4">
          {STORES.slice(0, 4).map((s, i) => (
            <div key={s} className="panel panel-tight row gap-12">
              <img src={IMG.bags[i]} alt="" className="avatar avatar-md avatar-sq" />
              <div className="stack"><b style={{ fontSize: 13.5 }}>{s}</b><span className="tiny muted">⭐ {(4 + i / 10).toFixed(1)} · {12 + i * 6} produits</span></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

/* =====================================================================
   24. PANIER
   ===================================================================== */
export function Panier() {
  const { cart, setQty, removeFromCart } = useApp()
  const items = cart.map((c) => ({ ...c, product: productList.find((p) => p.id === c.id) })).filter((c) => c.product)
  const subtotal = items.reduce((n, i) => n + i.product.price * i.qty, 0)
  const shipping = items.reduce((n, i) => n + i.product.shipping, 0)
  const total = subtotal + shipping

  return (
    <div className="container">
      <Crumbs items={[{ label: 'Marketplace', to: '/marketplace' }, { label: 'Panier' }]} />
      <div className="page-head"><h1>Mon panier</h1><p>{items.length} article{items.length > 1 ? 's' : ''} sélectionné{items.length > 1 ? 's' : ''}</p></div>

      {items.length === 0 ? (
        <EmptyState title="Votre panier est vide" sub="Parcourez la marketplace et ajoutez des créations africaines à votre panier." action="/marketplace" actionLabel="Aller à la marketplace" />
      ) : (
        <div className="split">
          <div className="stack gap-16">
            {items.map((i) => (
              <div key={i.id} className="panel row gap-16 wrap">
                <img src={i.product.image} alt="" className="ratio-1" style={{ width: 96, borderRadius: 12 }} />
                <div className="grow">
                  <Link to={`/produit/${i.product.id}`}><b>{i.product.name}</b></Link>
                  <div className="small muted">{i.product.seller} · {i.product.flag} {i.product.country}</div>
                  <div className="tiny muted-2">Taille M · {i.product.colors[0]}</div>
                </div>
                <div className="row gap-8">
                  <button className="icon-btn" onClick={() => setQty(i.id, i.qty - 1)}>−</button>
                  <b style={{ width: 30, textAlign: 'center' }}>{i.qty}</b>
                  <button className="icon-btn" onClick={() => setQty(i.id, i.qty + 1)}>+</button>
                </div>
                <b className="gold" style={{ minWidth: 120, textAlign: 'right' }}>{fcfa(i.product.price * i.qty)}</b>
                <button className="icon-btn" onClick={() => removeFromCart(i.id)} title="Retirer">✕</button>
              </div>
            ))}

            <div className="panel">
              <h4>Code promotionnel</h4>
              <div className="row gap-12">
                <input className="input" placeholder="Ex : HORIZON10" />
                <Btn variant="outline">Appliquer</Btn>
              </div>
            </div>

            <div className="notice"><span>🚚</span><span className="small">Livraison calculée selon le poids et la destination. Offerte à partir de 250 000 FCFA d’achat.</span></div>
          </div>

          <aside className="panel">
            <h3>Récapitulatif</h3>
            <div className="stack gap-12 small">
              <div className="between"><span className="muted">Sous-total</span><b>{fcfa(subtotal)}</b></div>
              <div className="between"><span className="muted">Frais de livraison</span><b>{fcfa(shipping)}</b></div>
              <div className="between"><span className="muted">Remise</span><b className="green">— 0 FCFA</b></div>
            </div>
            <div className="divider" />
            <div className="between">
              <span>Total</span>
              <b className="gold" style={{ fontFamily: 'var(--display)', fontSize: 26 }}>{fcfa(total)}</b>
            </div>
            <Btn to="/paiement" size="lg" className="btn-block mt-16">Passer au paiement</Btn>
            <Btn to="/marketplace" variant="ghost" size="sm" className="btn-block mt-8">Continuer mes achats</Btn>
            <div className="divider" />
            <div className="stack gap-8 tiny muted-2">
              <span>🔒 Paiement sécurisé</span>
              <span>📱 Mobile Money & carte bancaire</span>
              <span>↩️ Retour gratuit sous 14 jours</span>
            </div>
          </aside>
        </div>
      )}

      <section className="section">
        <SectionHead eyebrow="Vous aimerez aussi" title="Complétez votre commande" action="/marketplace" />
        <div className="grid grid-4">{productList.slice(8, 12).map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </section>
    </div>
  )
}

/* =====================================================================
   25. PAGE PAIEMENT
   ===================================================================== */
export function Paiement() {
  const nav = useNavigate()
  const { cart, clearCart, notify } = useApp()
  const items = cart.map((c) => ({ ...c, product: productList.find((p) => p.id === c.id) })).filter((c) => c.product)
  const subtotal = items.reduce((n, i) => n + i.product.price * i.qty, 0)
  const shipping = items.length ? items.reduce((n, i) => n + i.product.shipping, 0) : 0
  const total = subtotal + shipping

  const [step, setStep] = useState(1)
  const [delivery, setDelivery] = useState('Standard (3-5 jours)')
  const [payment, setPayment] = useState('Mobile Money')
  const [done, setDone] = useState(false)

  const steps = ['Livraison', 'Paiement', 'Confirmation']

  if (done) {
    return (
      <div className="container">
        <div className="panel center-text section" style={{ padding: 54 }}>
          <div style={{ fontSize: 46 }}>✅</div>
          <h1>Paiement confirmé</h1>
          <p style={{ maxWidth: '56ch', margin: '0 auto' }}>
            Votre commande <b>#HA-2292</b> a été enregistrée. Un email de confirmation et un suivi de livraison
            vous seront envoyés. Merci de soutenir la création africaine !
          </p>
          <div className="row gap-12 center wrap mt-16">
            <Btn onClick={() => nav('/tableau-de-bord')}>Aller à mon espace</Btn>
            <Btn to="/marketplace" variant="outline">Continuer mes achats</Btn>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <Crumbs items={[{ label: 'Panier', to: '/panier' }, { label: 'Paiement' }]} />
      <div className="page-head"><h1>Paiement sécurisé</h1></div>

      <div className="stepper-h mb-24">
        {steps.map((s, i) => (
          <span key={s} className="row gap-8" style={{ alignItems: 'center' }}>
            <span className={`s ${step >= i + 1 ? 'on' : ''}`}><b>{i + 1}</b>{s}</span>
            {i < steps.length - 1 && <span style={{ width: 40, height: 1, background: 'var(--line)' }} />}
          </span>
        ))}
      </div>

      <div className="split">
        <div>
          {step === 1 && (
            <div className="panel">
              <h3>Adresse de livraison</h3>
              <div className="form-grid">
                <div className="field"><label>Nom complet</label><input className="input" defaultValue="Aïcha Kora" /></div>
                <div className="field"><label>Téléphone</label><input className="input" defaultValue="+229 96 45 12 88" /></div>
              </div>
              <div className="form-grid">
                <div className="field"><label>Pays</label>
                  <select className="select">{COUNTRIES.map((c) => <option key={c.name}>{c.name}</option>)}</select>
                </div>
                <div className="field"><label>Ville</label><input className="input" defaultValue="Cotonou" /></div>
              </div>
              <div className="field"><label>Adresse complète</label><input className="input" placeholder="Quartier, rue, repère…" defaultValue="Quartier Fidjrossè, rue des Artisans" /></div>
              <div className="field"><label>Instructions de livraison (optionnel)</label><input className="input" placeholder="Ex : appeler avant de livrer" /></div>

              <h3 className="mt-24">Mode de livraison</h3>
              <div className="stack gap-12">
                {[['Standard (3-5 jours)', 2500], ['Express (24-48 h)', 6500], ['Retrait en boutique', 0]].map(([label, price]) => (
                  <button key={label} className="list-row" style={{ borderColor: delivery === label ? 'var(--gold)' : undefined, background: delivery === label ? 'rgba(227,176,75,0.08)' : undefined }} onClick={() => setDelivery(label)}>
                    <span style={{ fontSize: 18 }}>{price === 0 ? '🏬' : '🚚'}</span>
                    <div className="grow stack"><b style={{ fontSize: 13.5 }}>{label}</b><span className="tiny muted">{price === 0 ? 'Disponible à Cotonou' : 'Livraison à domicile'}</span></div>
                    <b className="gold">{price === 0 ? 'Gratuit' : fcfa(price)}</b>
                  </button>
                ))}
              </div>
              <Btn size="lg" className="mt-24" onClick={() => setStep(2)}>Continuer vers le paiement</Btn>
            </div>
          )}

          {step === 2 && (
            <div className="panel">
              <h3>Moyen de paiement</h3>
              <div className="grid grid-2 mb-24">
                {[['Mobile Money', '📱', 'MTN MoMo, Moov Money, Orange Money'], ['Carte bancaire', '💳', 'Visa, Mastercard, GIM-UEMOA']].map(([label, ico, sub]) => (
                  <button key={label} className="account-type" style={{ borderColor: payment === label ? 'var(--gold)' : undefined, background: payment === label ? 'rgba(227,176,75,0.08)' : undefined }} onClick={() => setPayment(label)}>
                    <span className="icon">{ico}</span>
                    <span className="stack"><b>{label}</b><span className="tiny muted">{sub}</span></span>
                  </button>
                ))}
              </div>

              {payment === 'Mobile Money' ? (
                <>
                  <div className="form-grid">
                    <div className="field"><label>Opérateur</label><select className="select"><option>MTN Mobile Money</option><option>Moov Money</option><option>Orange Money</option><option>Wave</option></select></div>
                    <div className="field"><label>Numéro de téléphone</label><input className="input" defaultValue="+229 96 45 12 88" /></div>
                  </div>
                  <div className="notice gold"><span>📲</span><span className="small">Vous recevrez une demande de confirmation sur votre téléphone. Saisissez votre code secret pour valider le paiement.</span></div>
                </>
              ) : (
                <>
                  <div className="field"><label>Numéro de carte</label><input className="input" placeholder="4242 4242 4242 4242" /></div>
                  <div className="form-grid-3">
                    <div className="field"><label>Expiration</label><input className="input" placeholder="MM/AA" /></div>
                    <div className="field"><label>CVC</label><input className="input" placeholder="123" /></div>
                    <div className="field"><label>Nom sur la carte</label><input className="input" placeholder="A. KORA" /></div>
                  </div>
                  <div className="notice"><span>🔒</span><span className="small">Vos données bancaires sont chiffrées. Aucune information n’est conservée par Horizon Afrique.</span></div>
                </>
              )}

              <div className="row gap-12 mt-24">
                <Btn variant="outline" onClick={() => setStep(1)}>← Retour</Btn>
                <Btn size="lg" onClick={() => { setStep(3); clearCart(); setDone(true); notify('Paiement effectué avec succès ✅') }}>Confirmer le paiement</Btn>
              </div>
            </div>
          )}
        </div>

        <aside className="panel">
          <h3>Votre commande</h3>
          {items.length === 0 && <p className="small muted">Panier vide — commande de démonstration.</p>}
          <div className="stack gap-12">
            {(items.length ? items : productList.slice(0, 2).map((p) => ({ id: p.id, qty: 1, product: p }))).map((i) => (
              <div key={i.id} className="row gap-12">
                <img src={i.product.image} alt="" className="ratio-1" style={{ width: 54, borderRadius: 10 }} />
                <div className="grow stack">
                  <b style={{ fontSize: 13 }}>{i.product.name}</b>
                  <span className="tiny muted">Qté {i.qty} · {i.product.seller}</span>
                </div>
                <b style={{ fontSize: 13 }}>{fcfa(i.product.price * i.qty)}</b>
              </div>
            ))}
          </div>
          <div className="divider" />
          <div className="stack gap-12 small">
            <div className="between"><span className="muted">Sous-total</span><b>{fcfa(subtotal || 120000)}</b></div>
            <div className="between"><span className="muted">Livraison</span><b>{fcfa(shipping || 2500)}</b></div>
            <div className="between"><span className="muted">Total TTC</span><b className="gold">{fcfa((total || 122500))}</b></div>
          </div>
          <div className="divider" />
          <div className="stack gap-8 tiny muted-2">
            <span>🔒 Transaction sécurisée SSL</span>
            <span>📞 Support : +229 21 30 44 12</span>
            <span>↩️ Retour gratuit sous 14 jours</span>
          </div>
        </aside>
      </div>
    </div>
  )
}
