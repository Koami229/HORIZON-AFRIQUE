/* Contrôle d'intégrité du jeu de données de démonstration (`src/data.js`).
   Un identifiant dupliqué, une catégorie hors référentiel, une date invalide ou un
   montant qui contredit la grille officielle produiraient un écran incohérent pour le
   relecteur : on les détecte ici, en amont du rendu.
   Usage : npm run check:data  */

import { existsSync } from 'node:fs'
import { join } from 'node:path'
import {
  AVAILABILITY, BOOST_DURATIONS, COUNTRIES, CREATION_CATEGORIES, EVENT_CATEGORIES, IMG,
  NEWS_CATEGORIES, OPPORTUNITY_TYPES, PRODUCT_CATEGORIES, TALENT_CATEGORIES, VIDEO_CATEGORIES,
  FREE_SHIPPING_FROM, articles, boostTargets, brands, collaborations, conversations, creations,
  currentUser, events, isKnownCountry, notifications, opportunities, orders, partners, payments,
  plans, productList, sponsors, talents, testimonials, videos,
} from '../src/data.js'

const problems = []
const fail = (rule, detail) => problems.push({ rule, detail })
let checks = 0
const tested = (label, fn) => { checks++; fn() }

const PUBLIC_DIR = join(process.cwd(), 'public')
const isNum = (v) => typeof v === 'number' && Number.isFinite(v)
const isDate = (v) => !Number.isNaN(new Date(v).getTime())
const assetExists = (src) => typeof src === 'string' && src.startsWith('/img/') && existsSync(join(PUBLIC_DIR, src.replace(/^\//, '')))

/* ------------------------------ 1. identifiants ------------------------------ */
tested('identifiants uniques', () => {
  const groups = { talents, brands, creations, videos, events, opportunities, productList, articles, partners, sponsors, conversations, notifications, testimonials }
  const seen = new Map()
  for (const [name, list] of Object.entries(groups)) {
    for (const item of list) {
      const key = `${name}:${item.id}`
      if (seen.has(key)) fail('identifiants uniques', `${key} apparaît deux fois`)
      seen.set(key, true)
    }
    const ids = list.map((i) => i.id)
    if (new Set(ids).size !== ids.length) fail('identifiants uniques', `${name} : identifiants dupliqués`)
  }
  const colIds = Object.values(collaborations).flat().map((c) => c.id)
  if (new Set(colIds).size !== colIds.length) fail('identifiants uniques', 'collaborations : identifiants dupliqués')
  const orderIds = orders.map((o) => o.id)
  if (new Set(orderIds).size !== orderIds.length) fail('identifiants uniques', 'commandes : identifiants dupliqués')
})

tested('noms uniques dans les annuaires', () => {
  for (const [name, list] of Object.entries({ talents, brands, productList, partners, sponsors })) {
    const names = list.map((i) => i.name)
    const dupes = names.filter((n, i) => names.indexOf(n) !== i)
    if (dupes.length) fail('noms uniques', `${name} : « ${[...new Set(dupes)].join(' », « ')} » en double`)
  }
})

/* ------------------------ 2. référentiels de catégories ---------------------- */
const inRef = (value, ref) => ref.includes(value)
tested('catégories conformes aux référentiels', () => {
  for (const t of talents) if (!inRef(t.category, TALENT_CATEGORIES.map((c) => c.name))) fail('catégories', `talent ${t.id} : « ${t.category} » hors TALENT_CATEGORIES`)
  for (const c of creations) if (!inRef(c.category, CREATION_CATEGORIES)) fail('catégories', `création ${c.id} : « ${c.category} » hors CREATION_CATEGORIES`)
  for (const v of videos) if (!inRef(v.category, VIDEO_CATEGORIES)) fail('catégories', `vidéo ${v.id} : « ${v.category} » hors VIDEO_CATEGORIES`)
  for (const e of events) if (!inRef(e.category, EVENT_CATEGORIES)) fail('catégories', `événement ${e.id} : « ${e.category} » hors EVENT_CATEGORIES`)
  for (const o of opportunities) if (!inRef(o.type, OPPORTUNITY_TYPES)) fail('catégories', `opportunité ${o.id} : « ${o.type} » hors OPPORTUNITY_TYPES`)
  for (const a of articles) if (!inRef(a.category, NEWS_CATEGORIES)) fail('catégories', `article ${a.id} : « ${a.category} » hors NEWS_CATEGORIES`)
  for (const p of productList) if (!inRef(p.category, PRODUCT_CATEGORIES)) fail('catégories', `produit ${p.id} : « ${p.category} » hors PRODUCT_CATEGORIES`)
  if (!inRef(currentUser.category, TALENT_CATEGORIES.map((c) => c.name))) fail('catégories', `utilisateur courant : « ${currentUser.category} » hors TALENT_CATEGORIES`)
})

tested('pays et villes cohérents', () => {
  for (const [name, list] of Object.entries({ talents, brands, productList, events, opportunities, partners, sponsors })) {
    for (const item of list) {
      // tolère les variantes d'apostrophe, refuse un pays réellement inconnu du référentiel
      if (item.country && !isKnownCountry(item.country)) fail('pays', `${name} ${item.id} : pays « ${item.country} » absent de COUNTRIES`)
    }
  }
  for (const list of [talents, brands]) {
    for (const item of list) {
      const country = COUNTRIES.find((c) => c.name === item.country)
      if (country && !country.cities.includes(item.city)) fail('villes', `${item.id} : ville « ${item.city} » absente de ${item.country}`)
    }
  }
})

/* ---------------------------- 3. liens internes ----------------------------- */
tested('références croisées valides', () => {
  const talentIds = new Set(talents.map((t) => t.id))
  const brandIds = new Set(brands.map((b) => b.id))
  for (const c of creations) {
    const source = c.authorType === 'marque' ? brandIds : talentIds
    if (!source.has(c.authorId)) fail('références croisées', `création ${c.id} : auteur ${c.authorId} inconnu`)
  }
  const productNames = new Set(productList.map((p) => p.name))
  for (const [bucket, list] of Object.entries(collaborations)) {
    if (!Array.isArray(list) || list.length === 0) fail('références croisées', `collaborations : bucket « ${bucket} » vide`)
  }
  if (productNames.size !== productList.length) fail('références croisées', 'noms de produits dupliqués')
})

tested('montants conformes à la grille officielle', () => {
  const prix = BOOST_DURATIONS.map((d) => d.price)
  for (const p of payments) {
    const boost = /Horizon Boost (\d+)h/.exec(p.type)
    if (boost) {
      const h = Number(boost[1])
      const grille = BOOST_DURATIONS.find((d) => d.h === h)
      if (!grille) fail('montants', `paiement ${p.id} : durée ${h} h hors grille Boost`)
      else if (p.amount !== grille.price) fail('montants', `paiement ${p.id} : ${p.amount} FCFA au lieu de ${grille.price} FCFA pour ${h} h`)
    }
    const abo = /Abonnement (\w+)/.exec(p.type)
    if (abo) {
      const formule = plans.find((pl) => pl.name.includes(abo[1]))
      if (!formule) fail('montants', `paiement ${p.id} : formule « ${abo[1]} » inconnue`)
      else if (p.amount !== formule.price) fail('montants', `paiement ${p.id} : ${p.amount} FCFA au lieu de ${formule.price} FCFA`)
    }
    if (!isNum(p.amount) || p.amount <= 0) fail('montants', `paiement ${p.id} : montant invalide`)
  }
  if (plans.length !== 4) fail('montants', `abonnements : ${plans.length} formules au lieu de 4`)
  const tarifs = plans.map((p) => p.price)
  if (tarifs.join(',') !== '0,5000,10000,20000') fail('montants', `tarifs des formules inattendus : ${tarifs.join(', ')}`)
  if (boostTargets.length !== 7) fail('montants', `cibles de Boost : ${boostTargets.length} au lieu de 7`)
  if (!isNum(FREE_SHIPPING_FROM) || FREE_SHIPPING_FROM <= 0) fail('montants', 'seuil de livraison offerte invalide')
  if (FREE_SHIPPING_FROM > 500000) fail('montants', `seuil de livraison offerte invraisemblable : ${FREE_SHIPPING_FROM} FCFA`)
  if (BOOST_DURATIONS.map((d) => d.h).join(',') !== '24,72,168') fail('montants', 'durées de Boost inattendues')
  if (prix.join(',') !== '1000,2700,5500') fail('montants', `tarifs de Boost inattendus : ${prix.join(', ')}`)
})

/* --------------------------- 4. valeurs et dates ---------------------------- */
tested('valeurs numériques plausibles', () => {
  for (const p of productList) {
    if (!isNum(p.price) || p.price <= 0) fail('valeurs', `produit ${p.id} : prix invalide`)
    if (!isNum(p.stock) || p.stock <= 0) fail('valeurs', `produit ${p.id} : stock invalide`)
    if (!isNum(p.shipping) || p.shipping <= 0) fail('valeurs', `produit ${p.id} : frais de livraison invalides`)
    if (!(Number(p.rating) >= 1 && Number(p.rating) <= 5)) fail('valeurs', `produit ${p.id} : note hors 1–5`)
    if (p.gallery.length < 3) fail('valeurs', `produit ${p.id} : galerie trop courte`)
  }
  for (const t of talents) {
    if (!(t.rating >= 1 && t.rating <= 5)) fail('valeurs', `talent ${t.id} : note hors 1–5`)
    if (!isNum(t.followers) || t.followers <= 0) fail('valeurs', `talent ${t.id} : abonnés invalides`)
    if (!AVAILABILITY.includes(t.availability)) fail('valeurs', `talent ${t.id} : disponibilité « ${t.availability} » inconnue`)
    if (!(t.services.length >= 1 && t.awards.length >= 1)) fail('valeurs', `talent ${t.id} : services ou récompenses manquants`)
  }
  for (const v of videos) if (!isNum(v.views) || v.views <= 0) fail('valeurs', `vidéo ${v.id} : vues invalides`)
  for (const e of events) if (!isNum(e.price) || e.price < 0) fail('valeurs', `événement ${e.id} : tarif invalide`)
  for (const o of opportunities) if (!isNum(o.applicants) || o.applicants < 0) fail('valeurs', `opportunité ${o.id} : candidats invalides`)
  for (const s of sponsors) if (!isNum(s.amount) || s.amount <= 0) fail('valeurs', `sponsor ${s.id} : montant invalide`)
  for (const o of orders) {
    if (!isNum(o.total) || o.total <= 0) fail('valeurs', `commande ${o.id} : total invalide`)
    if (!isNum(o.items) || o.items <= 0) fail('valeurs', `commande ${o.id} : nombre d’articles invalide`)
    if (!['Nouvelle', 'En cours', 'Livrée', 'Annulée'].includes(o.status)) fail('valeurs', `commande ${o.id} : statut « ${o.status} » inconnu`)
  }
  const boost = tariffsOfBoostCredits()
  if (!isNum(boost) || boost <= 0) fail('valeurs', 'crédits de Boost de l’utilisateur courant invalides')
})
function tariffsOfBoostCredits() { return currentUser.boostCredits }

tested('dates valides et ordonnées', () => {
  const now = new Date('2026-09-22T00:00:00Z')
  for (const e of events) {
    if (!isDate(e.start) || !isDate(e.end)) fail('dates', `événement ${e.id} : dates invalides`)
    else if (new Date(e.start) > new Date(e.end)) fail('dates', `événement ${e.id} : fin avant le début`)
  }
  for (const o of opportunities) if (!isDate(o.deadline)) fail('dates', `opportunité ${o.id} : échéance invalide`)
  for (const a of articles) if (new Date(a.date) > now) fail('dates', `article ${a.id} : date dans le futur`)
  for (const v of videos) if (new Date(v.date) > now) fail('dates', `vidéo ${v.id} : date dans le futur`)
  for (const c of creations) if (new Date(c.date) > now) fail('dates', `création ${c.id} : date dans le futur`)
  for (const o of orders) if (!isDate(o.date)) fail('dates', `commande ${o.id} : date invalide`)
})

/* --------------------------- 5. médias et textes ---------------------------- */
tested('images présentes sur le disque', () => {
  const used = [
    ['talent.avatar', talents.map((t) => t.avatar)], ['talent.cover', talents.map((t) => t.cover)],
    ['marque.banner', brands.map((b) => b.banner)], ['marque.avatar', brands.map((b) => b.avatar)],
    ['création.image', creations.map((c) => c.image)], ['produit.image', productList.map((p) => p.image)],
    ['vidéo.thumb', videos.map((v) => v.thumb)], ['vidéo.poster', videos.map((v) => v.poster)],
    ['événement.poster', events.map((e) => e.poster)], ['article.image', articles.map((a) => a.image)],
    ['conversation.avatar', conversations.map((c) => c.avatar)], ['témoignage.avatar', testimonials.map((t) => t.avatar)],
    ['portrait du hero', [IMG.hero]],
  ]
  for (const [label, list] of used) {
    for (const src of list) if (!assetExists(src)) fail('images', `${label} : fichier introuvable « ${src} »`)
  }
})

tested('textes renseignés', () => {
  for (const c of creations) if (!c.description || c.description.length < 40) fail('textes', `création ${c.id} : description trop courte`)
  for (const a of articles) {
    if (!a.body || a.body.length < 3) fail('textes', `article ${a.id} : corps incomplet`)
    if (!a.excerpt) fail('textes', `article ${a.id} : accroche manquante`)
  }
  for (const e of events) if (!e.description || e.programme.length < 3) fail('textes', `événement ${e.id} : description ou programme incomplet`)
  for (const o of opportunities) if (!o.description || o.missions.length < 3) fail('textes', `opportunité ${o.id} : description ou missions incomplètes`)
  for (const t of talents) if (!t.bio || t.bio.length < 90) fail('textes', `talent ${t.id} : biographie trop courte (${t.bio?.length || 0} caractères)`)
  for (const n of notifications) if (!n.title || !n.text) fail('textes', `notification ${n.id} : intitulé manquant`)
})

/* --------------------------------- rapport --------------------------------- */
console.log(`Jeu de données contrôlé : ${talents.length} talents, ${brands.length} marques, ${productList.length} produits, ${creations.length} créations, ${videos.length} vidéos, ${events.length} événements, ${opportunities.length} opportunités, ${articles.length} articles.`)
console.log(`${checks} familles de règles vérifiées.`)

if (problems.length) {
  console.log(`\n${problems.length} incohérence(s) détectée(s) :`)
  for (const { rule, detail } of problems) console.log(`  ✗ [${rule}] ${detail}`)
  process.exitCode = 1
} else {
  console.log('\n✅ Aucune incohérence : identifiants, catégories, pays, dates, montants et médias sont cohérents.')
}
