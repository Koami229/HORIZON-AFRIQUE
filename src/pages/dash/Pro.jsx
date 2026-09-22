import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DashHead } from './Shell.jsx'
import { Statistiques } from './User.jsx'
import {
  Avatar, Badge, Btn, EventCard, Meter, Modal, ProductCard, SectionHead, Stat, Tabs, TalentCard, useApp,
} from '../../components/ui.jsx'
import {
  IMG, PRODUCT_CATEGORIES, brands, creations, events, fcfa, fmtDate, fmtShort, opportunities, orders, productList,
  shortNumber, sponsors, stats, talents,
} from '../../data.js'

/* =====================================================================
   32bis. ESPACE MARQUE
   ===================================================================== */
export function EspaceMarque({ tab }) {
  const { notify } = useApp()
  const brand = brands[0]
  const [section, setSection] = useState(tab || 'vue')
  const prod = productList.slice(0, 6)

  return (
    <>
      <DashHead title="Espace marque" sub={`${brand.name} — gérez vos collections, produits, boutique et commandes.`}
        children={<><Btn variant="outline" size="sm" to={`/marque/${brand.id}`}>Voir ma page publique</Btn><Btn size="sm" onClick={() => notify('Nouvelle collection créée 🧵')}>+ Nouvelle collection</Btn></>} />

      <div className="grid grid-4 mb-24">
        {[['Abonnés', shortNumber(brand.followers), '+1 284', true], ['Vues de page', '48 210', '+12,4 %', true], ['Produits actifs', '24', '+3', true], ['Ventes du mois', fcfa(3276000), '+18,2 %', true]].map(([l, v, d, up]) => (
          <Stat key={l} label={l} value={v} delta={d} up={up} />
        ))}
      </div>

      <div className="panel mb-24">
        <Tabs tabs={['Vue d’ensemble', 'Collections', 'Produits', 'Boutique', 'Commandes']} value={section} onChange={setSection} />
      </div>

      {section === 'Vue d’ensemble' && (
        <>
          <div className="split mb-24">
            <div className="panel">
              <div className="panel-title"><b>Ventes des 12 derniers mois</b><Badge tone="green">+18,2 %</Badge></div>
              <div className="bars">
                {stats.series.map((v, i) => <div key={i}><i style={{ height: `${(v / Math.max(...stats.series)) * 100}%` }} /><span>{stats.months[i]}</span></div>)}
              </div>
            </div>
            <div className="panel">
              <div className="panel-title"><b>Meilleures ventes</b></div>
              <div className="stack gap-12">
                {stats.shop.topProducts.map(([n, v, r], i) => (
                  <div key={n} className="between">
                    <div className="row gap-12">
                      <b className="muted-2" style={{ width: 18 }}>{i + 1}</b>
                      <div className="stack"><b style={{ fontSize: 13.5 }}>{n}</b><span className="tiny muted-2">{v} ventes</span></div>
                    </div>
                    <b className="gold">{fcfa(r)}</b>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-3">
            {[['Commandes à traiter', '2', '/boutique/commandes'], ['Messages non lus', '3', '/tableau-de-bord/messages'], ['Boosts actifs', '2', '/tableau-de-bord/boost']].map(([l, v, to]) => (
              <Link key={l} to={to} className="panel">
                <div className="between"><span className="small muted">{l}</span><b style={{ fontFamily: 'var(--display)', fontSize: 26 }}>{v}</b></div>
                <span className="link-arrow">Traiter →</span>
              </Link>
            ))}
          </div>
        </>
      )}

      {section === 'Collections' && (
        <div className="grid grid-3">
          {brand.collections.map((c) => (
            <div key={c.name} className="card">
              <div className="card-media card-media-tall">
                <img src={c.cover} alt={c.name} loading="lazy" />
                <div className="media-top"><Badge tone="gold">{c.season}</Badge></div>
              </div>
              <div className="card-pad">
                <b>{c.name}</b>
                <div className="small muted">{c.pieces} pièces · 12 en vente</div>
              </div>
              <div className="card-foot">
                <button className="btn btn-dark btn-xs" onClick={() => notify('Collection modifiée ✏️')}>Modifier</button>
                <button className="btn btn-outline btn-xs" onClick={() => notify('Produits ajoutés à la collection 🧵')}>+ Produits</button>
              </div>
            </div>
          ))}
          <button className="card card-pad center-text" style={{ borderStyle: 'dashed', minHeight: 300 }} onClick={() => notify('Nouvelle collection créée 🧵')}>
            <div style={{ fontSize: 30 }}>＋</div><b>Créer une collection</b>
          </button>
        </div>
      )}

      {section === 'Produits' && (
        <>
          <div className="between mb-16">
            <span className="muted small">{prod.length} produits publiés</span>
            <div className="row gap-8">
              <Btn variant="outline" size="sm" onClick={() => notify('Import CSV lancé 📄')}>Importer</Btn>
              <Btn size="sm" to="/boutique/ajouter">+ Ajouter un produit</Btn>
            </div>
          </div>
          <div className="grid grid-4">{prod.map((p) => <ProductCard key={p.id} p={p} />)}</div>
        </>
      )}

      {section === 'Boutique' && <EspaceBoutique />}

      {section === 'Commandes' && <Commandes />}
    </>
  )
}

/* =====================================================================
   40. PAGE BOUTIQUE
   ===================================================================== */
export function EspaceBoutique({ tab }) {
  const { notify } = useApp()
  const [section, setSection] = useState(tab || 'vue')
  const [products, setProducts] = useState(productList.slice(0, 8))

  const sections = ['Tableau de bord', 'Mes produits', 'Ajouter un produit', 'Commandes', 'Stocks', 'Promotions', 'Statistiques', 'Paramètres de livraison']
  const keyOf = (s) => ({ 'Tableau de bord': 'vue', 'Mes produits': 'produits', 'Ajouter un produit': 'ajouter', 'Commandes': 'commandes', 'Stocks': 'stocks', 'Promotions': 'promotions', 'Statistiques': 'stats', 'Paramètres de livraison': 'livraison' }[s])
  const labelOf = (k) => sections.find((s) => keyOf(s) === k) || 'Tableau de bord'

  return (
    <>
      <DashHead title="Ma boutique" sub="Gérez vos produits, vos commandes, vos stocks et vos promotions."
        children={<><Btn variant="outline" size="sm" to="/marketplace">Voir la boutique publique</Btn><Btn size="sm" onClick={() => setSection('ajouter')}>+ Ajouter un produit</Btn></>} />

      <div className="grid grid-4 mb-24">
        {stats.shop.sales.map((s) => <Stat key={s.label} {...s} />)}
      </div>

      <div className="panel mb-24">
        <Tabs tabs={sections} value={labelOf(section)} onChange={(v) => setSection(keyOf(v))} />
      </div>

      {section === 'vue' && (
        <div className="split">
          <div className="panel">
            <div className="panel-title"><b>Ventes du mois</b><span className="tiny muted-2">en FCFA</span></div>
            <div className="bars">
              {[32, 45, 38, 52, 61, 55, 72, 68, 84, 79, 92, 104].map((v, i) => <div key={i}><i style={{ height: `${v}%` }} /><span>{stats.months[i]}</span></div>)}
            </div>
            <div className="divider" />
            <div className="grid grid-3">
              {[['Vues produits', '48 210'], ['Taux de conversion', '4,2 %'], ['Panier moyen', '27 200 FCFA']].map(([a, b]) => (
                <div key={a} className="kpi"><b style={{ fontSize: 19 }}>{b}</b><span>{a}</span></div>
              ))}
            </div>
          </div>
          <div className="stack gap-16">
            <div className="panel">
              <div className="panel-title"><b>Alertes stock</b><Badge tone="terra">3</Badge></div>
              <div className="stack gap-12">
                {products.slice(0, 3).map((p) => (
                  <div key={p.id} className="between">
                    <div className="row gap-12">
                      <img src={p.image} alt="" style={{ width: 40, height: 40, borderRadius: 9, objectFit: 'cover' }} />
                      <div className="stack"><b style={{ fontSize: 13 }}>{p.name}</b><span className="tiny muted-2">{p.stock} en stock</span></div>
                    </div>
                    <Btn variant="outline" size="xs" onClick={() => notify('Stock réapprovisionné 📦')}>Réappro.</Btn>
                  </div>
                ))}
              </div>
            </div>
            <div className="panel">
              <div className="panel-title"><b>Derniers avis</b></div>
              <div className="stack gap-12 small">
                <div className="stack"><b>Fatou Diallo — ⭐ 5</b><span className="muted">« Qualité au rendez-vous, je recommande. »</span></div>
                <div className="stack"><b>Koffi Mensah — ⭐ 4</b><span className="muted">« Belle finition, livraison un peu lente. »</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {section === 'produits' && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Produit</th><th>Catégorie</th><th>Prix</th><th>Stock</th><th>Vendus</th><th>Note</th><th>Actions</th></tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="row gap-12">
                      <img src={p.image} alt="" style={{ width: 42, height: 42, borderRadius: 9, objectFit: 'cover' }} />
                      <b>{p.name}</b>
                    </div>
                  </td>
                  <td className="muted">{p.category}</td>
                  <td><b className="gold">{fcfa(p.price)}</b></td>
                  <td><Badge tone={p.stock < 6 ? 'terra' : 'green'}>{p.stock}</Badge></td>
                  <td>{p.sold}</td>
                  <td>⭐ {p.rating}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-dark btn-xs" onClick={() => notify('Produit modifié ✏️')}>Modifier</button>
                      <button className="btn btn-outline btn-xs" onClick={() => notify('Produit boosté 🚀')}>Booster</button>
                      <button className="btn btn-danger btn-xs" onClick={() => { setProducts((s) => s.filter((x) => x.id !== p.id)); notify('Produit retiré') }}>Retirer</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {section === 'ajouter' && (
        <div className="split">
          <div className="panel">
            <h3>Ajouter un produit</h3>
            <div className="field"><label>Nom du produit</label><input className="input" placeholder="Ex : Robe « Azalaï »" defaultValue="Robe « Azalaï »" /></div>
            <div className="form-grid">
              <div className="field"><label>Catégorie</label><select className="select">{PRODUCT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>
              <div className="field"><label>Prix (FCFA)</label><input className="input" type="number" defaultValue={78000} /></div>
            </div>
            <div className="form-grid">
              <div className="field"><label>Stock</label><input className="input" type="number" defaultValue={12} /></div>
              <div className="field"><label>Poids (kg)</label><input className="input" type="number" defaultValue={1} step="0.1" /></div>
            </div>
            <div className="field"><label>Description</label><textarea className="textarea" defaultValue="Pièce fabriquée à la main en série limitée, matières naturelles et teintures écologiques." /></div>
            <div className="field">
              <label>Options (tailles)</label>
              <div className="pill-row">{['S', 'M', 'L', 'XL'].map((s) => <span key={s} className="chip chip-soft">{s}</span>)}<button className="chip">+ Ajouter</button></div>
            </div>
            <div className="field">
              <label>Photos du produit</label>
              <div className="grid grid-4" style={{ gap: 10 }}>
                {productList.slice(0, 3).map((p, i) => <img key={i} src={p.image} alt="" className="ratio-1" />)}
                <button className="card center-text" style={{ borderStyle: 'dashed', background: 'none' }}>+<br /><span className="tiny">Ajouter</span></button>
              </div>
            </div>
            <div className="row gap-12">
              <Btn onClick={() => { notify('Produit publié dans la marketplace ✅') }}>Publier le produit</Btn>
              <Btn variant="outline" onClick={() => notify('Brouillon enregistré 💾')}>Enregistrer en brouillon</Btn>
            </div>
          </div>

          <aside className="stack gap-16">
            <div className="panel">
              <h3>Aperçu de la fiche</h3>
              <img src={productList[0].image} alt="" className="ratio-1 mb-16" />
              <b>Robe « Azalaï »</b>
              <div className="row gap-8 mt-8"><b className="gold">{fcfa(78000)}</b><span className="tiny muted-2">Stock : 12</span></div>
            </div>
            <div className="notice gold"><span>💡</span><span className="small">Les produits avec 4 photos ou plus se vendent 2,4× mieux. Ajoutez également une vidéo courte.</span></div>
          </aside>
        </div>
      )}

      {section === 'commandes' && <Commandes />}

      {section === 'stocks' && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Produit</th><th>Stock</th><th>Seuil d’alerte</th><th>État</th><th>Ajuster</th></tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td><b>{p.name}</b></td>
                  <td>{p.stock}</td>
                  <td className="muted">5</td>
                  <td><Badge tone={p.stock < 6 ? 'terra' : p.stock < 15 ? 'gold' : 'green'}>{p.stock < 6 ? 'Stock faible' : p.stock < 15 ? 'À surveiller' : 'Disponible'}</Badge></td>
                  <td>
                    <div className="row gap-8">
                      <input className="input" style={{ width: 74, padding: '6px 10px' }} type="number" defaultValue={p.stock} />
                      <button className="btn btn-dark btn-xs" onClick={() => notify('Stock mis à jour 📦')}>Mettre à jour</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {section === 'promotions' && (
        <>
          <div className="between mb-16">
            <span className="muted small">2 promotions actives · 1 programmée</span>
            <Btn size="sm" onClick={() => notify('Nouvelle promotion créée 🏷️')}>+ Créer une promotion</Btn>
          </div>
          <div className="grid grid-3">
            {[
              ['Soldes Saison Sèche', '-20 %', '12 produits', 'Jusqu’au 30 septembre', 'Active'],
              ['Pack Collection Sable & Or', '-15 %', '4 produits', 'Jusqu’au 15 octobre', 'Active'],
              ['Black Friday Horizon', '-35 %', 'Tous les produits', 'Du 25 au 30 novembre', 'Programmée'],
            ].map(([n, d, p, period, status]) => (
              <div key={n} className="panel">
                <div className="between mb-8"><b>{n}</b><Badge tone={status === 'Active' ? 'green' : 'indigo'}>{status}</Badge></div>
                <div className="row gap-12"><b className="gold" style={{ fontFamily: 'var(--display)', fontSize: 24 }}>{d}</b><span className="small muted">sur {p}</span></div>
                <span className="tiny muted-2">{period}</span>
                <div className="divider" />
                <div className="between small"><span className="muted">Ventes générées</span><b>{fcfa(1240000)}</b></div>
              </div>
            ))}
          </div>
        </>
      )}

      {section === 'stats' && <Statistiques />}

      {section === 'livraison' && (
        <div className="split">
          <div className="panel">
            <h3>Zones et frais de livraison</h3>
            <div className="stack gap-12">
              {[['Cotonou et environs', 1500, '24 h'], ['Bénin (hors Cotonou)', 2500, '48 h'], ['UEMOA (Togo, Nigéria, Niger…)', 6500, '3-5 jours'], ['Reste de l’Afrique', 12000, '5-9 jours'], ['International', 25000, '7-14 jours']].map(([z, f, d]) => (
                <div key={z} className="list-row">
                  <div className="grow stack"><b style={{ fontSize: 13.5 }}>{z}</b><span className="tiny muted">Délai : {d}</span></div>
                  <b className="gold">{fcfa(f)}</b>
                  <button className="btn btn-dark btn-xs" onClick={() => notify(`Tarif ${z} modifié`)}>Modifier</button>
                </div>
              ))}
            </div>
            <Btn variant="outline" size="sm" className="mt-16" onClick={() => notify('Nouvelle zone ajoutée 🚚')}>+ Ajouter une zone</Btn>
          </div>
          <aside className="panel">
            <h3>Transporteurs partenaires</h3>
            <div className="stack gap-12">
              {[['DHL Express', 'International'], ['Speedaf', 'Afrique de l’Ouest'], ['Transporteurs locaux', 'Cotonou & Bénin']].map(([n, z]) => (
                <div key={n} className="list-row">
                  <span style={{ fontSize: 19 }}>🚚</span>
                  <div className="grow stack"><b style={{ fontSize: 13.5 }}>{n}</b><span className="tiny muted">{z}</span></div>
                  <Badge tone="green">Connecté</Badge>
                </div>
              ))}
            </div>
            <div className="divider" />
            <h4>Retours</h4>
            <div className="checkbox mb-8"><input type="checkbox" defaultChecked /><span className="small">Autoriser les retours sous 14 jours</span></div>
            <div className="checkbox"><input type="checkbox" defaultChecked /><span className="small">Retour gratuit pour l’acheteur</span></div>
          </aside>
        </div>
      )}
    </>
  )
}

/* =====================================================================
   41. PAGE COMMANDES
   ===================================================================== */
export function Commandes() {
  const { notify } = useApp()
  const [tab, setTab] = useState('Nouvelles')
  const tabs = ['Nouvelles', 'En cours', 'Livrées', 'Annulées']
  const list = orders.filter((o) => o.status === tab)
  const totalOf = (s) => orders.filter((o) => o.status === s).reduce((n, o) => n + o.total, 0)

  return (
    <>
      <DashHead title="Commandes" sub="Suivez et traitez les commandes de votre boutique."
        children={<><Btn variant="outline" size="sm" onClick={() => notify('Bordereaux d’expédition imprimés 🖨️')}>Imprimer les bordereaux</Btn><Btn size="sm" onClick={() => notify('Export des commandes au format CSV 📄')}>Exporter</Btn></>} />

      <div className="grid grid-4 mb-24">
        {[['Nouvelles', orders.filter((o) => o.status === 'Nouvelle').length, 'terra'], ['En cours', orders.filter((o) => o.status === 'En cours').length, 'indigo'], ['Livrées', orders.filter((o) => o.status === 'Livrée').length, 'green'], ['Chiffre d’affaires', fcfa(orders.reduce((n, o) => n + o.total, 0)), 'gold']].map(([l, v, tone]) => (
          <div key={l} className="kpi">
            <div className="between mb-8"><span className="small muted">{l}</span><Badge tone={tone}>•</Badge></div>
            <b>{v}</b>
          </div>
        ))}
      </div>

      <div className="panel mb-24"><Tabs tabs={tabs} value={tab} onChange={setTab} /></div>

      <div className="table-wrap">
        <table>
          <thead><tr><th>Commande</th><th>Client</th><th>Pays</th><th>Articles</th><th>Total</th><th>Date</th><th>Statut</th><th>Actions</th></tr></thead>
          <tbody>
            {list.map((o) => (
              <tr key={o.id}>
                <td><b>#{o.id}</b></td>
                <td>{o.client}</td>
                <td className="muted">{o.country}</td>
                <td>{o.items}</td>
                <td><b className="gold">{fcfa(o.total)}</b></td>
                <td className="muted">{fmtShort(o.date)}</td>
                <td><Badge tone={o.status === 'Nouvelle' ? 'terra' : o.status === 'En cours' ? 'indigo' : o.status === 'Livrée' ? 'green' : 'muted'}>{o.status}</Badge></td>
                <td>
                  <div className="table-actions">
                    <button className="btn btn-outline btn-xs" onClick={() => notify(`Détail de la commande #${o.id}`)}>Détail</button>
                    {o.status === 'Nouvelle' && <button className="btn btn-dark btn-xs" onClick={() => notify(`Commande #${o.id} acceptée — préparation en cours 📦`)}>Accepter</button>}
                    {o.status === 'En cours' && <button className="btn btn-dark btn-xs" onClick={() => notify(`Commande #${o.id} marquée comme expédiée 🚚`)}>Expédier</button>}
                    {o.status !== 'Annulée' && <button className="btn btn-danger btn-xs" onClick={() => notify(`Commande #${o.id} annulée`)}>Annuler</button>}
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={8} className="muted" style={{ textAlign: 'center', padding: 30 }}>Aucune commande dans cette catégorie.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="grid grid-3 mt-24">
        {[['Délai moyen de préparation', '1,4 jour'], ['Taux de livraison à temps', '96 %'], ['Satisfaction clients', '4,8 / 5']].map(([a, b]) => (
          <div key={a} className="kpi"><b style={{ fontSize: 20 }}>{b}</b><span>{a}</span></div>
        ))}
      </div>
    </>
  )
}

/* =====================================================================
   42. ESPACE PARTENAIRE
   ===================================================================== */
/* 42. Espace Partenaire — 9 modules */
const PARTNER_TABS = [
  'Tableau de bord', 'Profil de l’organisation', 'Programmes & appels', 'Opportunités', 'Événements',
  'Collaborations', 'Recherche de talents', 'Statistiques', 'Paramètres',
]
const keyOfPartner = (v) => ({
  'Tableau de bord': 'vue', 'Profil de l’organisation': 'profil', 'Programmes & appels': 'programmes',
  'Opportunités': 'opportunites', 'Événements': 'evenements', 'Collaborations': 'collaborations',
  'Recherche de talents': 'talents', 'Statistiques': 'stats', 'Paramètres': 'parametres',
}[v])
const labelOfPartner = (k) => PARTNER_TABS.find((t) => keyOfPartner(t) === k) || 'Tableau de bord'

export function EspacePartenaire({ tab }) {
  const { notify } = useApp()
  const [section, setSection] = useState(keyOfPartner(({ opportunites: 'Opportunités', evenements: 'Événements', talents: 'Recherche de talents' }[tab]) || 'Tableau de bord') || tab || 'vue')

  return (
    <>
      <DashHead title="Espace partenaire" sub="Ministère de la Culture du Bénin — opportunités, événements, collaborations et recherche de talents."
        children={<><Btn variant="outline" size="sm" to="/partenaires">Voir mon profil public</Btn><Btn size="sm" onClick={() => notify('Nouvelle opportunité publiée 💼')}>+ Publier une opportunité</Btn></>} />

      <div className="grid grid-4 mb-24">
        {[['Talents accompagnés', '248', '+32', true], ['Opportunités publiées', '18', '+4', true], ['Candidatures reçues', '1 284', '+186', true], ['Événements organisés', '6', '+1', true]].map(([l, v, d, up]) => <Stat key={l} label={l} value={v} delta={d} up={up} />)}
      </div>

      <div className="panel mb-24">
        <Tabs tabs={PARTNER_TABS}
          value={labelOfPartner(section)}
          onChange={(v) => setSection(keyOfPartner(v))} />
      </div>

      {section === 'vue' && (
        <>
          <div className="split mb-24">
            <div className="panel">
              <div className="panel-title"><b>Candidatures reçues</b><span className="tiny muted-2">6 derniers mois</span></div>
              <div className="bars">
                {[18, 24, 31, 42, 38, 56, 62, 74, 68, 82, 96, 118].map((v, i) => <div key={i}><i style={{ height: `${v}%` }} /><span>{stats.months[i]}</span></div>)}
              </div>
            </div>
            <div className="panel">
              <div className="panel-title"><b>Répartition par domaine</b></div>
              <div className="stack gap-16">
                {[['Mode & couture', 46], ['Artisanat', 28], ['Art & design', 16], ['Communication', 10]].map(([l, v]) => (
                  <div key={l}><div className="between small"><span className="muted">{l}</span><b>{v}%</b></div><Meter value={v} /></div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-3">
            {[['Candidatures à traiter', '128', '/espace-partenaire/opportunites'], ['Messages', '3', '/tableau-de-bord/messages'], ['Collaborations en cours', '2', '/tableau-de-bord/collaborations']].map(([l, v, to]) => (
              <Link key={l} to={to} className="panel">
                <div className="between"><span className="small muted">{l}</span><b style={{ fontFamily: 'var(--display)', fontSize: 26 }}>{v}</b></div>
                <span className="link-arrow">Traiter →</span>
              </Link>
            ))}
          </div>
        </>
      )}

      {section === 'profil' && (
        <div className="split">
          <div className="panel">
            <h3>Profil de l’organisation</h3>
            <div className="field"><label>Nom de l’organisation</label><input className="input" defaultValue="Ministère de la Culture du Bénin" /></div>
            <div className="form-grid">
              <div className="field"><label>Type</label><select className="select"><option>Institution publique</option><option>École / université</option><option>Incubateur</option><option>Média</option><option>Agence</option></select></div>
              <div className="field"><label>Pays</label><input className="input" defaultValue="Bénin" /></div>
            </div>
            <div className="field"><label>Présentation</label><textarea className="textarea" defaultValue="Soutien aux industries créatives, formation des talents et structuration des filières culturelles au Bénin." /></div>
            <div className="form-grid">
              <div className="field"><label>Site web</label><input className="input" defaultValue="culture.gouv.bj" /></div>
              <div className="field"><label>Email de contact</label><input className="input" defaultValue="contact@culture.gouv.bj" /></div>
            </div>
            <Btn onClick={() => notify('Profil de l’organisation mis à jour ✅')}>Enregistrer</Btn>
          </div>
          <aside className="panel">
            <h3>Visibilité du partenaire</h3>
            <div className="stack gap-12 small">
              <div className="between"><span className="muted">Vues du profil</span><b>12 408</b></div>
              <div className="between"><span className="muted">Talents suivis</span><b>248</b></div>
              <div className="between"><span className="muted">Événements publiés</span><b>6</b></div>
              <div className="between"><span className="muted">Score de confiance</span><b className="gold">92 / 100</b></div>
            </div>
            <div className="divider" />
            <Badge tone="green">Organisation vérifiée ✓</Badge>
          </aside>
        </div>
      )}

      {section === 'opportunites' && (
        <>
          <div className="between mb-16">
            <span className="muted small">18 opportunités publiées · 1 284 candidatures</span>
            <Btn size="sm" onClick={() => notify('Nouvelle opportunité publiée 💼')}>+ Publier</Btn>
          </div>
          <div className="stack gap-12">
            {opportunities.slice(0, 5).map((o) => (
              <div key={o.id} className="list-row">
                <div className="grow stack">
                  <div className="row gap-8 wrap"><b>{o.title}</b><Badge tone="indigo">{o.type}</Badge></div>
                  <span className="tiny muted">{o.city}, {o.country} · {o.applicants} candidatures · limite {fmtShort(o.deadline)}</span>
                </div>
                <div className="table-actions">
                  <button className="btn btn-outline btn-xs" onClick={() => notify('Liste des candidatures ouverte 📂')}>Candidatures</button>
                  <button className="btn btn-dark btn-xs" onClick={() => notify('Opportunité modifiée ✏️')}>Modifier</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {section === 'evenements' && (
        <>
          <div className="between mb-16">
            <span className="muted small">6 événements organisés · 1 480 participants cumulés</span>
            <Btn size="sm" to="/tableau-de-bord/mes-evenements">Gérer les événements</Btn>
          </div>
          <div className="grid grid-3">{events.slice(0, 3).map((e) => <EventCard key={e.id} e={e} />)}</div>
        </>
      )}

      {section === 'collaborations' && (
        <div className="stack gap-16">
          {[['TOURÉ.', 'Programme d’export 2027', 'Accompagnement de 12 maisons béninoises vers les marchés européens.', 45],
            ['École des Arts de Dakar', 'Formation modélisme', 'Ateliers de professionnalisation pour 60 jeunes créateurs.', 70],
            ['Kigali Innovation Hub', 'Résidence croisée', 'Échange de 8 designers entre Cotonou et Kigali.', 20]].map(([n, t, d, p]) => (
            <div key={n} className="panel">
              <div className="between mb-8"><b>{n}</b><Badge tone="indigo">{t}</Badge></div>
              <p className="small">{d}</p>
              <Meter value={p} />
              <div className="between tiny muted-2 mt-8"><span>Avancement</span><span>{p}%</span></div>
            </div>
          ))}
        </div>
      )}

      {section === 'talents' && (
        <>
          <div className="filter-bar">
            <input className="input" placeholder="Rechercher un talent (métier, ville, spécialité…)" />
            <select><option>Profession : Toutes</option>{['Styliste', 'Designer', 'Mannequin', 'Photographe', 'Artisan'].map((p) => <option key={p}>{p}</option>)}</select>
            <select><option>Pays : Tous</option><option>Bénin</option><option>Sénégal</option><option>Nigeria</option></select>
            <Btn size="sm">Rechercher</Btn>
          </div>
          <div className="grid grid-4">{talents.slice(0, 8).map((t) => <TalentCard key={t.id} t={t} />)}</div>
        </>
      )}

      {section === 'programmes' && (
        <>
          <SectionHead eyebrow="Soutien aux créateurs" title="Programmes & appels à candidatures"
            action="/opportunites" actionLabel="Voir les opportunités publiques" />
          <div className="grid grid-3">
            {[
              ['Bourses Création 2027', 'Financement', '15 bourses de 1 500 000 FCFA', 'Ouvert jusqu’au 30 novembre', 'Bourses'],
              ['Résidence d’atelier — Ouidah', 'Formation', '3 mois d’accompagnement en atelier', '12 places', 'Bourses'],
              ['Appel à projets Mode durable', 'Subvention', 'Subventions de 500 000 à 3 000 000 FCFA', 'Dossier en ligne', 'Appels'],
              ['Programme Jeunes Marques', 'Accélération', 'Structuration et accès aux salons', '8 marques retenues', 'Programmes'],
              ['Fonds Artisanat & Territoire', 'Financement', 'Équipement des coopératives', 'Clôture le 15 octobre', 'Dons'],
              ['Prix de l’Innovation Textile', 'Concours', 'Doté de 2 000 000 FCFA', 'Cérémonie en décembre', 'Concours'],
            ].map(([name, type, desc, meta, tag]) => (
              <div key={name} className="panel">
                <div className="between"><Badge tone="gold">{tag}</Badge><span className="tiny muted-2">{type}</span></div>
                <b style={{ display: 'block', marginTop: 10 }}>{name}</b>
                <p className="small muted mt-8 mb-12">{desc}</p>
                <div className="between small"><span className="muted-2">{meta}</span><button className="link-arrow" onClick={() => notify(`Candidatures — ${name}`)}>Candidater →</button></div>
              </div>
            ))}
          </div>
        </>
      )}

      {section === 'stats' && <Statistiques />}

      {section === 'parametres' && (
        <div className="split">
          <div className="panel">
            <h3>Paramètres de l’organisation</h3>
            <div className="field"><label>Visibilité du profil</label><select className="select"><option>Public</option><option>Visible des talents vérifiés</option><option>Privé</option></select></div>
            <div className="field"><label>Notifications</label><select className="select"><option>Toutes les candidatures</option><option>Candidatures qualifiées uniquement</option><option>Aucune</option></select></div>
            <div className="field"><label>Adresse de contact</label><input className="input" defaultValue="contact@culture.bj" /></div>
            <div className="field"><label>Signature des publications</label><input className="input" defaultValue="Ministère de la Culture du Bénin — Horizon Afrique" /></div>
            <Btn onClick={() => notify('Paramètres du partenaire enregistrés ✅')}>Enregistrer</Btn>
          </div>
          <div className="panel">
            <h3>Équipe & rôles</h3>
            <div className="stack gap-12">
              {[['Awa Sossou', 'Administratrice', 'Accès complet'], ['Kwesi Ampofo', 'Chargé de programmes', 'Programmes et candidatures'], ['Naomi Wanjiru', 'Communication', 'Publications et événements']].map(([n, r, a]) => (
                <div key={n} className="between">
                  <div className="stack"><b style={{ fontSize: 13.5 }}>{n}</b><span className="tiny muted">{r}</span></div>
                  <span className="tiny muted-2">{a}</span>
                </div>
              ))}
            </div>
            <div className="divider" />
            <Btn variant="outline" size="sm" onClick={() => notify('Invitation envoyée à un membre de l’équipe ✉️')}>+ Inviter un membre</Btn>
          </div>
        </div>
      )}
    </>
  )
}

/* =====================================================================
   43. ESPACE SPONSOR — 7 modules
   ===================================================================== */
export function EspaceSponsor({ tab }) {
  const { notify } = useApp()
  const [section, setSection] = useState(tab || 'vue')
  const s = sponsors[1]

  const tabs = ['Tableau de bord', 'Profil de l’entreprise', 'Campagnes', 'Talents soutenus', 'Événements sponsorisés', 'Statistiques', 'Facturation']
  const keyOf = (v) => ({ 'Tableau de bord': 'vue', 'Profil de l’entreprise': 'profil', 'Campagnes': 'campagnes', 'Talents soutenus': 'talents', 'Événements sponsorisés': 'evenements', 'Statistiques': 'stats', 'Facturation': 'facturation' }[v])
  const labelOf = (k) => tabs.find((t) => keyOf(t) === k) || 'Tableau de bord'

  return (
    <>
      <DashHead title="Espace sponsor" sub={`${s.name} — campagnes, talents soutenus et événements sponsorisés.`}
        children={<><Btn variant="outline" size="sm" to="/sponsors">Voir la page sponsors</Btn><Btn size="sm" onClick={() => notify('Nouvelle campagne créée 📣')}>+ Créer une campagne</Btn></>} />

      <div className="grid grid-4 mb-24">
        {[['Budget engagé 2026', fcfa(s.amount), '+12 %', true], ['Campagnes actives', s.campaigns, '+2', true], ['Talents soutenus', s.talents, '+6', true], ['Impressions', '4,2 M', '+18 %', true]].map(([l, v, d, up]) => <Stat key={l} label={l} value={v} delta={d} up={up} />)}
      </div>

      <div className="panel mb-24"><Tabs tabs={tabs} value={labelOf(section)} onChange={(v) => setSection(keyOf(v))} /></div>

      {section === 'vue' && (
        <div className="split">
          <div className="panel">
            <div className="panel-title"><b>Portée des campagnes</b><span className="tiny muted-2">impressions / mois</span></div>
            <div className="bars">
              {[42, 55, 61, 74, 68, 82, 91, 88, 104, 118, 126, 142].map((v, i) => <div key={i}><i style={{ height: `${v}%` }} /><span>{stats.months[i]}</span></div>)}
            </div>
          </div>
          <div className="panel">
            <div className="panel-title"><b>Campagnes en cours</b></div>
            <div className="stack gap-12">
              {[['Boost Jeunes Créateurs', 68], ['Fashion Week Connect', 82], ['Écoles & Talents', 45]].map(([n, v]) => (
                <div key={n}><div className="between small"><span className="muted">{n}</span><b>{v}%</b></div><Meter value={v} /></div>
              ))}
            </div>
            <div className="divider" />
            <div className="between small"><span className="muted">Retour sur investissement estimé</span><b className="gold">×3,4</b></div>
          </div>
        </div>
      )}

      {section === 'profil' && (
        <div className="split">
          <div className="panel">
            <h3>Profil de l’entreprise</h3>
            <div className="field"><label>Nom de l’entreprise</label><input className="input" defaultValue={s.name} /></div>
            <div className="form-grid">
              <div className="field"><label>Type de sponsoring</label><select className="select"><option>Sponsor principal</option><option>Sponsor d’événements</option><option>Sponsor de projets</option><option>Sponsor culturel</option></select></div>
              <div className="field"><label>Secteur</label><input className="input" defaultValue="Télécommunications" /></div>
            </div>
            <div className="field"><label>Présentation</label><textarea className="textarea" defaultValue={s.desc} /></div>
            <div className="form-grid">
              <div className="field"><label>Site web</label><input className="input" defaultValue="mtn.com" /></div>
              <div className="field"><label>Contact presse</label><input className="input" defaultValue="presse@mtn.com" /></div>
            </div>
            <Btn onClick={() => notify('Profil entreprise mis à jour ✅')}>Enregistrer</Btn>
          </div>
          <aside className="panel">
            <h3>Impact du sponsoring</h3>
            <div className="stack gap-12 small">
              <div className="between"><span className="muted">Talents accompagnés</span><b>{s.talents}</b></div>
              <div className="between"><span className="muted">Événements soutenus</span><b>9</b></div>
              <div className="between"><span className="muted">Bourses attribuées</span><b>42</b></div>
              <div className="between"><span className="muted">Mentions presse</span><b>128</b></div>
            </div>
            <div className="divider" />
            <Badge tone="gold">Sponsor depuis {s.since}</Badge>
          </aside>
        </div>
      )}

      {section === 'campagnes' && (
        <div className="grid grid-3">
          {[
            ['Boost Jeunes Créateurs', '100 bourses Horizon Boost', 68, 'Active'],
            ['Fashion Week Connect', 'Sponsoring de 5 Fashion Weeks', 82, 'Active'],
            ['Écoles & Talents', '24 ateliers de formation', 45, 'Active'],
            ['Artisanat Export', 'Logistique export offerte', 30, 'Programmée'],
            ['Prix de la Création 2026', 'Dotation de 10 M FCFA', 12, 'En préparation'],
          ].map(([n, d, p, st]) => (
            <div key={n} className="panel">
              <div className="between mb-8"><b>{n}</b><Badge tone={st === 'Active' ? 'green' : 'indigo'}>{st}</Badge></div>
              <p className="small">{d}</p>
              <Meter value={p} />
              <div className="between tiny muted-2 mt-8"><span>Avancement</span><span>{p}%</span></div>
              <div className="divider" />
              <div className="between small"><span className="muted">Budget</span><b>{fcfa(4500000)}</b></div>
            </div>
          ))}
        </div>
      )}

      {section === 'talents' && (
        <>
          <div className="between mb-16">
            <span className="muted small">{s.talents} talents soutenus — bourses, matériel, formation et visibilité</span>
            <Btn size="sm" onClick={() => notify('Nouveau talent ajouté au programme de soutien 🌟')}>+ Soutenir un talent</Btn>
          </div>
          <div className="grid grid-4">
            {talents.slice(0, 8).map((t) => (
              <div key={t.id} className="panel">
                <div className="row gap-12 mb-12">
                  <Avatar src={t.avatar} size="md" ring />
                  <div className="stack"><b style={{ fontSize: 13.5 }}>{t.name}</b><span className="tiny muted">{t.job} · {t.flag} {t.country}</span></div>
                </div>
                <div className="between small"><span className="muted">Bourse 2026</span><b className="gold">{fcfa(500000)}</b></div>
              </div>
            ))}
          </div>
        </>
      )}

      {section === 'evenements' && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Événement</th><th>Ville</th><th>Date</th><th>Montant</th><th>Visibilité</th><th>Statut</th></tr></thead>
            <tbody>
              {events.slice(0, 5).map((e, i) => (
                <tr key={e.id}>
                  <td><b>{e.name}</b></td>
                  <td className="muted">{e.city}, {e.country}</td>
                  <td className="muted">{fmtShort(e.start)}</td>
                  <td>{fcfa([5000000, 3000000, 2500000, 1500000, 4500000][i])}</td>
                  <td className="muted">{['Logo principal + stand', 'Logo secondaire', 'Bannières', 'Stand', 'Logo principal'][i]}</td>
                  <td><Badge tone={i < 3 ? 'green' : 'muted'}>{i < 3 ? 'Actif' : 'Terminé'}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {section === 'stats' && <Statistiques />}

      {section === 'facturation' && (
        <>
          <SectionHead eyebrow="Budget sponsoring" title="Facturation & engagements"
            action="/abonnements" actionLabel="Voir les formules" />
          <div className="grid grid-4 section-sm">
            {[['Budget annuel', fcfa(s.amount)], ['Engagé', fcfa(Math.round(s.amount * 0.68))], ['Factures réglées', '9 / 12'], ['Prochaine échéance', '15 octobre']].map(([l, v]) => (
              <div key={l} className="kpi"><b style={{ fontSize: 19 }}>{v}</b><span>{l}</span></div>
            ))}
          </div>
          <div className="panel">
            <div className="panel-title"><b>Factures et conventions</b><Btn variant="outline" size="sm" onClick={() => notify('Facture PDF téléchargée 📄')}>Télécharger</Btn></div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Référence</th><th>Objet</th><th>Période</th><th>Montant</th><th>Statut</th></tr></thead>
                <tbody>
                  {[['FA-2026-041', 'Campagne Boost Jeunes Créateurs', 'Janvier — Mars', 3400000, 'Réglée'],
                    ['FA-2026-058', 'Fashion Week Connect', 'Avril — Juin', 5200000, 'Réglée'],
                    ['FA-2026-071', 'Écoles & Talents', 'Juillet — Septembre', 2800000, 'En cours'],
                    ['FA-2026-084', 'Prix de l’Innovation Textile', 'Octobre — Décembre', 4100000, 'À venir']].map(([ref, obj, per, amount, status]) => (
                    <tr key={ref}>
                      <td><b>{ref}</b></td>
                      <td>{obj}</td>
                      <td className="muted">{per}</td>
                      <td>{fcfa(amount)}</td>
                      <td><Badge tone={status === 'Réglée' ? 'green' : status === 'En cours' ? 'gold' : 'muted'}>{status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  )
}


