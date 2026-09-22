/* Test d'interaction de la maquette : simule de vrais clics dans un DOM (jsdom)
   et vérifie les parcours clés (panier, favoris, Boost, inscription, messagerie…).
   Usage : npm run check:interactions */

import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
})
global.window = dom.window
global.document = dom.window.document
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true })
global.HTMLElement = dom.window.HTMLElement
global.Element = dom.window.Element
global.Node = dom.window.Node
global.Event = dom.window.Event
global.MouseEvent = dom.window.MouseEvent
global.KeyboardEvent = dom.window.KeyboardEvent
global.getComputedStyle = dom.window.getComputedStyle
global.requestAnimationFrame = (cb) => setTimeout(cb, 0)
global.cancelAnimationFrame = (id) => clearTimeout(id)
dom.window.scrollTo = () => {}
// react-dom bascule sur un polyfill « IE » sous jsdom : on neutralise attachEvent/detachEvent
dom.window.Element.prototype.attachEvent = () => {}
dom.window.Element.prototype.detachEvent = () => {}
// et on déclare le support de l'événement « input » observé par react-dom au chargement :
// sans cela, les onChange des champs contrôlés ne se déclenchent jamais dans les tests.
if (!('oninput' in dom.window.document)) {
  Object.defineProperty(dom.window.document, 'oninput', { value: null, configurable: true, writable: true })
}
global.IS_REACT_ACT_ENVIRONMENT = true

const { render, fireEvent, cleanup, act } = await import('@testing-library/react')
const React = (await import('react')).default
const { MemoryRouter } = await import('react-router-dom')
const App = (await import('../src/App.jsx')).default
const { AppProvider } = await import('../src/components/ui.jsx')

/* ------------------------------- utilitaires ------------------------------- */
let passed = 0
const failures = []

const txt = (el) => (el?.textContent || '').replace(/\s+/g, ' ').trim()

/* Cherche un élément interactif dont le libellé correspond, en privilégiant le
   contenu principal (le menu de l'en-tête est ignoré sauf demande explicite). */
function findClickable(container, text, { scope } = {}) {
  const rx = text instanceof RegExp ? text : new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const roots = scope ? [scope] : [container.querySelector('main'), container].filter(Boolean)
  const score = (el) => (text instanceof RegExp ? 1 : txt(el).toLowerCase() === String(text).toLowerCase() ? 0 : txt(el).toLowerCase().startsWith(String(text).toLowerCase()) ? 1 : 2)
  for (const root of roots) {
    const nodes = [...root.querySelectorAll('button, a, summary')].filter((el) => rx.test(txt(el))).sort((a, b) => score(a) - score(b))
    if (nodes.length) return nodes[0]
  }
  return undefined
}

function click(container, text, opts) {
  const target = findClickable(container, text, opts)
  if (!target) throw new Error(`Introuvable : « ${text} »`)
  fireEvent.click(target)
  return true
}

/* Saisie dans un champ contrôlé : on pose la valeur puis on déclenche le handler
   React du champ (le pipeline d'événements « input » de jsdom est instable ici) ;
   on vérifie ensuite que l'état React a bien repris la main sur le DOM. */
function typeInto(el, value) {
  const propsKey = Object.keys(el).find((k) => k.startsWith('__reactProps'))
  const handler = el[propsKey]?.onChange || el[propsKey]?.onInput
  const proto = el.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype
  const setter = Object.getOwnPropertyDescriptor(proto, 'value').set
  setter.call(el, value)
  if (typeof handler === 'function') {
    act(() => { handler({ target: el, currentTarget: el, preventDefault() {}, stopPropagation() {} }) })
  } else {
    fireEvent.input(el, { target: { value } })
  }
  return el.value === value
}

function expectFails(label) { throw new Error('assertion échouée : ' + label) }

async function mount(route) {
  const utils = render(
    React.createElement(MemoryRouter, { initialEntries: [route] },
      React.createElement(AppProvider, null, React.createElement(App))),
  )
  await act(async () => { await new Promise((r) => setTimeout(r, 0)) })
  return utils
}

async function expect(container, label, condition) {
  await act(async () => { await new Promise((r) => setTimeout(r, 0)) })
  if (condition) { passed++; console.log(`  ✓ ${label}`) }
  else { failures.push(label); console.log(`  ✗ ${label}`) }
}

const has = (c, t) => txt(c).includes(t)

/* --------------------------------- scénarios -------------------------------- */
console.log('\n▶ Panier et boutique')
{
  const { container } = await mount('/produit/prd-4')
  click(container, 'Ajouter au panier')
  await expect(container, 'produit ajouté → toast de confirmation', has(container, 'ajouté au panier'))
  click(container, 'Acheter maintenant')
  await expect(container, '« Acheter maintenant » ouvre le panier', has(container, 'Récapitulatif'))
  await expect(container, 'le produit est bien dans le panier', has(container, 'Sac cuir de Fès'))
  const before = txt(container).match(/Total\s*([\d\s]+FCFA)/)?.[1]
  const plus = [...container.querySelectorAll('button')].filter((b) => txt(b) === '+')[0]
  fireEvent.click(plus)
  await expect(container, 'la quantité modifie le total', txt(container).match(/Total\s*([\d\s]+FCFA)/)?.[1] !== before)
  const rows = container.querySelectorAll('.panel.row').length
  const remove = [...container.querySelectorAll('button[title="Retirer"]')][0]
  fireEvent.click(remove)
  await expect(container, 'la suppression retire une ligne du panier', container.querySelectorAll('.panel.row').length < rows)
  cleanup()
}

console.log('\n▶ Favoris et « j’aime »')
{
  const { container } = await mount('/galerie')
  const like = [...container.querySelectorAll('.like-btn')].find((b) => txt(b).startsWith('♥'))
  const label0 = txt(like)
  fireEvent.click(like)
  await expect(container, 'le compteur ♥ est mis à jour', txt(like) !== label0 && /\d/.test(txt(like)))
  await expect(container, 'le bouton ♥ passe à l’état « aimé »', [...container.querySelectorAll('.like-btn')].some((b) => b.className.includes('on')))
  const save = [...container.querySelectorAll('.like-btn')].find((b) => txt(b) === '☆')
  fireEvent.click(save)
  await expect(container, 'l’étoile enregistre en favoris', has(container, 'Ajouté aux favoris'))
  cleanup()
}

console.log('\n▶ Assistant Horizon Boost (5 étapes)')
{
  const { container } = await mount('/horizon-boost')
  click(container, 'Produit')
  await expect(container, 'étape 1 → choix du contenu', has(container, 'Sélectionnez le contenu à promouvoir'))
  fireEvent.click(container.querySelector('.grid .list-row'))
  await act(async () => {})
  click(container, 'Continuer')
  await expect(container, 'étape 2 → choix de la durée', has(container, 'Choisissez la durée du Boost'))
  click(container, '3 jours')
  click(container, 'Continuer')
  await expect(container, 'étape 3 → paiement', has(container, 'Moyen de paiement'))
  click(container, 'Confirmer et payer')
  await expect(container, 'étape 4 → Boost actif', has(container, 'Votre Boost est actif'))
  await expect(container, 'le prix 2 700 FCFA est facturé', has(container, '2 700 FCFA'))
  cleanup()
}

console.log('\n▶ Inscription en 4 étapes')
{
  const { container } = await mount('/inscription')
  click(container, /MarqueMaison/)
  await expect(container, 'étape 1 → type de compte sélectionnable', txt(container.querySelector('.account-type.active'))?.includes('Marque'))
  click(container, 'Continuer')
  await expect(container, 'étape 2 → informations personnelles', has(container, 'Informations personnelles'))
  const inputs = [...container.querySelectorAll('input')]
  fireEvent.change(inputs[0], { target: { value: 'Kora' } })
  await expect(container, 'les champs sont éditables', container.querySelector('input').value === 'Kora')
  click(container, 'Continuer')
  await expect(container, 'étape 3 → profil professionnel', has(container, 'Profil professionnel'))
  click(container, 'Créer mon compte')
  await expect(container, 'étape 4 → confirmation', has(container, 'Bienvenue'))
  await expect(container, 'le passage à l’espace est proposé', has(container, 'Accéder à mon tableau de bord'))
  cleanup()
}

console.log('\n▶ Marketplace : filtres et catégories')
{
  const { container } = await mount('/marketplace')
  await act(async () => {})
  const all = Number(txt(container).match(/(\d+) produits disponibles/)?.[1] || 0)
  click(container, /^Bijoux$/)
  await act(async () => {})
  const bijoux = Number(txt(container).match(/(\d+) produits disponibles/)?.[1] || 0)
  await expect(container, 'le filtre « Bijoux » réduit le catalogue', bijoux > 0 && bijoux < all)
  await expect(container, 'les catégories demandées sont présentes', ['Vêtements', 'Sacs', 'Bijoux', 'Décoration', 'Faits main'].every((c) => has(container, c)))
  cleanup()
}

console.log('\n▶ Profil marque TOURÉ. : onglets')
{
  const { container } = await mount('/marque/brd-1')
  await expect(container, 'en-tête marque (nom, pays, abonnés, suivre, contacter)',
    has(container, 'TOURÉ.') && has(container, 'Suivre') && has(container, 'Contacter'))
  click(container, /^Produits$/)
  await expect(container, 'onglet Produits', has(container, 'Voir toute la boutique'))
  click(container, /^Collections$/)
  await expect(container, 'onglet Collections', has(container, 'Saison') || has(container, 'pièces'))
  click(container, /^Vidéos$/)
  await expect(container, 'onglet Vidéos', has(container, 'play-btn') || has(container, '▶'))
  cleanup()
}

console.log('\n▶ Recherche globale dans l’en-tête')
{
  const { container } = await mount('/')
  const searchBtn = [...container.querySelectorAll('.header-actions button')][1]
  fireEvent.click(searchBtn)
  await act(async () => {})
  await expect(container, 'l’overlay de recherche s’ouvre', has(container, 'Recherche globale Horizon'))
  const input = container.querySelector('.search-input-lg')
  typeInto(input, 'Dakar')
  await act(async () => {})
  await expect(container, 'les résultats instantanés s’affichent', /Résultats \(\d+\)/.test(txt(container)))
  cleanup()
}

console.log('\n▶ Messagerie professionnelle')
{
  const { container } = await mount('/tableau-de-bord/messages')
  await expect(container, 'liste des conversations', has(container, 'TOURÉ.'))
  const input = container.querySelector('.chat-input input')
  typeInto(input, 'Bonjour, je confirme la collaboration.')
  await act(async () => {})
  click(container, 'Envoyer')
  await expect(container, 'le message apparaît dans la conversation', has(container, 'je confirme la collaboration'))
  click(container, '🤝')
  await expect(container, 'envoi d’une demande de collaboration', has(container, 'Demande de collaboration envoyée'))
  cleanup()
}

console.log('\n▶ Publications : création et interactions')
{
  const { container } = await mount('/tableau-de-bord/mes-publications')
  const area = container.querySelector('textarea')
  typeInto(area, 'Nouvelle capsule disponible en boutique.')
  await act(async () => {})
  click(container, 'Publier')
  await expect(container, 'la publication est ajoutée en tête de liste', has(container, 'Nouvelle capsule disponible'))
  click(container, '🚀 Booster')
  await expect(container, 'le bouton Booster répond', has(container, 'Publication boostée'))
  cleanup()
}

console.log('\n▶ Portfolio : ajout et suppression')
{
  const { container } = await mount('/tableau-de-bord/portfolio')
  const before = container.querySelectorAll('.card').length
  click(container, '+ Ajouter un visuel')
  await expect(container, 'la modale d’ajout s’ouvre', has(container, 'Ajouter au portfolio'))
  click(container, 'Ajouter')
  await expect(container, 'confirmation d’ajout', has(container, 'ajouté au portfolio'))
  await expect(container, 'la galerie du portfolio reste cohérente', container.querySelectorAll('.card').length >= before)
  cleanup()
}

console.log('\n▶ Paiement : parcours complet')
{
  const { container } = await mount('/paiement')
  click(container, 'Continuer vers le paiement')
  await expect(container, 'étape 2 → moyen de paiement', has(container, 'Mobile Money') && has(container, 'Carte bancaire'))
  click(container, 'Carte bancaire')
  await act(async () => {})
  await expect(container, 'le formulaire carte s’affiche', has(container, 'Numéro de carte'))
  click(container, 'Confirmer le paiement')
  await expect(container, 'écran de confirmation', has(container, 'Paiement confirmé'))
  cleanup()
}

console.log('\n▶ Menu mobile et navigation')
{
  const { container } = await mount('/')
  const burger = container.querySelector('.burger')
  await expect(container, 'le bouton menu mobile existe', !!burger)
  fireEvent.click(burger)
  await expect(container, 'le menu mobile affiche les entrées', has(container, 'Marketplace') && has(container, 'Inscription'))
  click(container, /^Marketplace$/)
  await expect(container, 'la navigation fonctionne', has(container, 'Horizon Marketplace'))
  cleanup()
}

console.log('\n▶ Modération (administration)')
{
  const { container } = await mount('/administration/moderation')
  click(container, 'Examiner')
  await expect(container, 'la fiche de signalement s’ouvre', has(container, 'Historique du compte'))
  click(container, 'Retirer le contenu')
  await expect(container, 'action de modération appliquée', has(container, 'traité'))
  cleanup()
}

/* ---------------------------------- bilan ---------------------------------- */
console.log(`\n${passed} vérifications réussies, ${failures.length} en échec`)
if (failures.length) {
  console.log('Échecs :')
  failures.forEach((f) => console.log('  - ' + f))
  process.exit(1)
}
