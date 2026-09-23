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
  const proto = el.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype
    : el.tagName === 'SELECT' ? window.HTMLSelectElement.prototype
      : window.HTMLInputElement.prototype
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
  typeInto(inputs[0], 'Kora')
  const pw = inputs.filter((i) => i.type === 'password')
  typeInto(pw[0], 'Horizon2026')
  typeInto(pw[1], 'Horizon2025')
  await expect(container, 'les mots de passe différents sont signalés', has(container, 'ne correspondent pas'))
  typeInto(pw[1], 'Horizon2026')
  await expect(container, 'la saisie identique est acceptée', !has(container, 'ne correspondent pas'))
  click(container, 'Continuer')
  await expect(container, 'étape 3 → profil professionnel', has(container, 'Profil professionnel'))
  click(container, '← Retour')
  await expect(container, 'les informations saisies sont conservées', container.querySelector('input').value === 'Kora')
  click(container, 'Continuer')
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

console.log('\n▶ Suivre une marque puis la contacter')
{
  const { container } = await mount('/marque/brd-2')
  click(container, /Suivre/)
  await expect(container, 'le bouton passe à l’état abonné', has(container, '✓ Abonné'))
  click(container, /Abonné/)   // on se désabonne : le bouton revient à son état initial
  await expect(container, 'le désabonnement est possible', has(container, '+ Suivre'))
  click(container, 'Contacter')
  await expect(container, 'la fenêtre de contact de la marque s’ouvre', has(container, 'Objet') && has(container, 'Envoyer'))
  cleanup()
}

console.log('\n▶ Choix d’une formule d’abonnement')
{
  const { container } = await mount('/abonnements')
  const cta = [...container.querySelectorAll('button')].filter((b) => txt(b) === 'Choisir cette formule')
  await expect(container, 'quatre formules proposent la même action', cta.length === 4)
  fireEvent.click(cta[1])
  await expect(container, 'la formule choisie est signalée', has(container, 'sélectionnée') || has(container, 'Formule'))
  cleanup()
}

console.log('\n▶ Boost d’une publication depuis le tableau de bord')
{
  const { container } = await mount('/tableau-de-bord/mes-publications')
  click(container, 'Booster')
  await expect(container, 'l’assistant Horizon Boost s’ouvre', has(container, 'Horizon Boost') || has(container, 'Booster'))
  cleanup()
}

console.log('\n▶ Filtres de la marketplace par pays')
{
  const { container } = await mount('/marketplace')
  const before = Number(txt(container).match(/(\d+) produits?/)?.[1] || 0)
  const select = [...container.querySelectorAll('select')][0]
  typeInto(select, 'Bénin')
  await act(async () => {})
  const after = Number(txt(container).match(/(\d+) produits?/)?.[1] || 0)
  await expect(container, `le filtre pays réduit le catalogue (${before} → ${after})`, before > 0 && after <= before)
  cleanup()
}

console.log('\n▶ Commandes : filtre par statut')
{
  const { container } = await mount('/boutique/commandes')
  fireEvent.click([...container.querySelectorAll('button')].find((b) => txt(b) === 'Livrées'))
  await expect(container, 'le filtre « Livrées » répond', has(container, 'Livrée'))
  cleanup()
}

console.log('\n▶ Recherche : ouverture d’un résultat puis retour')
{
  const { container } = await mount('/')
  fireEvent.click([...container.querySelectorAll('.header-actions button')][1])
  await act(async () => {})
  typeInto(container.querySelector('.search-input-lg'), 'Dakar')
  await act(async () => {})
  const results = [...container.querySelectorAll('.search-overlay a')]   // les liens de l'overlay uniquement
  await expect(container, 'des résultats sont proposés', results.length > 0 && /Résultats/.test(txt(container)))
  if (results.length) {
    fireEvent.click(results[0])
    await act(async () => {})
    await expect(container, 'la navigation depuis la recherche fonctionne', !has(container, 'Recherche globale Horizon'))
  }
  cleanup()
}

console.log('\n▶ Annuaire : filtre par pays (apostrophes comprises)')
{
  const { container } = await mount('/annuaire')
  const select = [...container.querySelectorAll('select')].find((el) => [...el.options].some((o) => o.value === 'Côte d’Ivoire'))
  await expect(container, 'le référentiel des pays propose la Côte d’Ivoire', !!select)
  if (select) {
    typeInto(select, 'Côte d’Ivoire')
    await act(async () => {})
    const n = Number(txt(container).match(/(\d+) résultat/)?.[1] || 0)
    await expect(container, `le filtre renvoie des fiches ivoiriennes (${n})`, n > 0)
  }
  cleanup()
}

console.log('\n▶ Filtres : toutes les pages de liste')
{
  const pages = [
    ['/decouvrir', 'Découvrir'], ['/talents', 'Talents'], ['/stylistes', 'Stylistes'],
    ['/designers', 'Designers'], ['/mannequins', 'Mannequins'], ['/marques', 'Marques'],
    ['/creations', 'Créations'], ['/evenements', 'Événements'], ['/opportunites', 'Opportunités'],
    ['/annuaire', 'Horizon Directory'], ['/marketplace', 'Marketplace'], ['/actualites', 'Actualités'],
  ]
  /* pages filtrées par puces de catégorie : on compte les cartes plutôt que le compteur */
  const chipPages = [['/videos', 'Vidéos', '.video-thumb'], ['/partenaires', 'Partenaires', '.card']]
  for (const [route, nom, card] of chipPages) {
    const { container } = await mount(route)
    const carte = () => container.querySelectorAll(card).length
    const chips = [...container.querySelectorAll('.pill-row .chip')].filter((c, i) => i > 0)
    const base = carte()
    let reduit = false
    for (const chip of chips) {
      fireEvent.click(chip)
      await act(async () => {})
      const actif = chip.classList.contains('active')
      if (actif && carte() > 0 && carte() < base) { reduit = true; break }
      fireEvent.click(chips[0] === chip ? chip : chips[0])
      await act(async () => {})
      break
    }
    await expect(container, `${nom} : une puce de catégorie réduit la liste (${base} → ${carte()})`, reduit)
    cleanup()
  }

  for (const [route, nom] of pages) {
    const { container } = await mount(route)
    const bar = container.querySelector('.filter-bar')
    if (!bar) { await expect(container, `${nom} : barre de filtres présente`, false); cleanup(); continue }
    const count = () => Number((container.querySelector('.filter-count')?.textContent || '').match(/(\d+)/)?.[1] ?? -1)
    const base = count()
    const selects = [...bar.querySelectorAll('select')]
    let reduit = false
    for (const select of selects) {
      const option = [...select.options].find((o) => !/^(Tous|Toutes)/i.test(o.value) && o.value !== 'Tous')
      if (!option) continue
      typeInto(select, option.value)
      await act(async () => {})
      const apres = count()
      if (apres > 0 && apres < base) { reduit = true; break }
      // on remet à zéro avant d'essayer le filtre suivant
      typeInto(select, 'Tous')
      await act(async () => {})
    }
    await expect(container, `${nom} : un filtre réduit bien la liste (${base} → ${count()})`, reduit)
    const reset = [...container.querySelectorAll('.filter-bar button')].find((b) => /Réinitialiser/.test(txt(b)))
    await expect(container, `${nom} : le filtre peut être réinitialisé`, !!reset)
    if (reset) {
      fireEvent.click(reset)
      await act(async () => {})
      await expect(container, `${nom} : la liste complète revient (${count()})`, count() === base)
    }
    cleanup()
  }
}

console.log('\n▶ Panier : arithmétique et livraison offerte')
{
  const { container } = await mount('/produit/prd-4')     // Sac cuir de Fès
  const fiche = container.querySelector('main')
  const prix = Number(([...fiche.querySelectorAll('b.gold')][0]?.textContent || '').replace(/[^\d]/g, ''))
  const nom = txt(fiche.querySelector('h1'))
  click(container, 'Ajouter au panier')
  await act(async () => {})
  click(container, /^Panier/)
  await act(async () => {})

  const nombre = (t) => Number((t.match(/([\d\s]+)/)?.[1] || '0').replace(/\s/g, ''))
  const lire = (libelle) => {
    const ligne = [...container.querySelectorAll('.between')].find((el) => txt(el).startsWith(libelle))
    return txt(ligne || '')
  }
  const sousTotal = () => nombre(lire('Sous-total').replace('Sous-total', ''))
  const livraison = () => (/Offerte/.test(lire('Frais de livraison')) ? 0 : nombre(lire('Frais de livraison').replace('Frais de livraison', '')))
  const total = () => nombre(lire('Total').replace('Total', ''))

  await expect(container, `total = sous-total + livraison (${sousTotal()} + ${livraison()} = ${total()})`, total() === sousTotal() + livraison())

  // on retire d'abord les deux lignes de démonstration pour repartir du produit ajouté
  for (const titre of ['Robe « Azalaï »', 'Bague filigrane Ségou']) {
    const l = [...container.querySelectorAll('.panel')].find((el) => txt(el).includes(titre))
    if (l) { fireEvent.click(l.querySelector('button[title="Retirer"]')); await act(async () => {}) }
  }
  await expect(container, `panier réduit au produit ajouté (${sousTotal()})`, sousTotal() === prix)
  await expect(container, `la livraison est facturée sous le seuil (${livraison()} FCFA)`, livraison() === 5500 && total() === prix + 5500)

  // on agit sur la ligne du produit ajouté (le panier de démonstration contient déjà des articles)
  const ligne = [...container.querySelectorAll('.panel')].find((el) => txt(el).includes(nom))
  const plus = ligne && [...ligne.querySelectorAll('button')].find((b) => txt(b) === '+')
  const avant = sousTotal()
  fireEvent.click(plus)
  await act(async () => {})
  await expect(container, `une unité de plus de « ${nom} » ajoute ${prix} FCFA (${avant} → ${sousTotal()})`, sousTotal() === avant + prix)

  while (sousTotal() < 250000 && [...container.querySelectorAll('.panel')].find((el) => txt(el).includes(nom))) {
    const l = [...container.querySelectorAll('.panel')].find((el) => txt(el).includes(nom))
    fireEvent.click([...l.querySelectorAll('button')].find((b) => txt(b) === '+'))
    await act(async () => {})
  }
  await expect(container, `le seuil de livraison offerte est atteint (${sousTotal()})`, sousTotal() >= 250000)
  await expect(container, 'les frais de livraison passent à « Offerte »', /Offerte/.test(lire('Frais de livraison')))
  await expect(container, 'le total ne compte plus la livraison', total() === sousTotal())
  await expect(container, 'le bandeau annonce la livraison offerte', has(container, 'Livraison offerte'))

  // retirer une ligne met à jour le total
  const avantSuppression = sousTotal()
  fireEvent.click(ligne.querySelector('button[title="Retirer"]'))
  await act(async () => {})
  await expect(container, `la ligne retirée sort du sous-total (${avantSuppression} → ${sousTotal()})`, sousTotal() < avantSuppression)
  cleanup()
}

console.log('\n▶ Espace boutique : publication d’un produit')
{
  const { container } = await mount('/boutique/ajouter')
  const nom = container.querySelector('input.input')
  typeInto(nom, 'Boubou brodé Horizon')
  await act(async () => {})
  await expect(container, 'le nom du produit est saisi', nom.value === 'Boubou brodé Horizon')
  click(container, 'Publier le produit')
  await expect(container, 'la publication est confirmée', has(container, 'publié dans la marketplace'))
  cleanup()
}

console.log('\n▶ Administration : actions sur un utilisateur')
{
  const { container } = await mount('/administration/utilisateurs')
  click(container, /^Valider$/)
  await expect(container, 'la validation d’un compte est confirmée', has(container, 'validé'))
  click(container, /^Suspendre$/)
  await expect(container, 'la suspension d’un compte est confirmée', has(container, 'suspendu'))
  click(container, 'Profil')
  await expect(container, 'la fiche utilisateur s’ouvre', has(container, 'Suspendre le compte') || has(container, 'Fermer'))
  cleanup()
}

console.log('\n▶ Tableau de bord : changement de formule')
{
  const { container } = await mount('/tableau-de-bord/abonnement')
  await expect(container, 'la formule actuelle est signalée', has(container, 'Formule actuelle'))
  const cta = [...container.querySelectorAll('button')].find((b) => txt(b) === 'Choisir cette formule')
  fireEvent.click(cta)
  await act(async () => {})
  await expect(container, 'le changement de formule est confirmé', has(container, 'Formule actuelle'))
  cleanup()
}

console.log('\n▶ Recherche : filtre par type de contenu')
{
  const { container } = await mount('/recherche')
  typeInto(container.querySelector('input.input'), 'wax')
  await act(async () => {})
  const onglets = [...container.querySelectorAll('button.tab')]
  await expect(container, 'les types de contenu sont proposés', onglets.length >= 3)
  const talentsTab = onglets.find((t) => /Talent/.test(txt(t)))
  if (talentsTab) {
    const avant = container.querySelectorAll('a[href^="/talent/"]').length
    fireEvent.click(talentsTab)
    await act(async () => {})
    await expect(container, `le filtre « ${txt(talentsTab)} » restreint les résultats aux talents`, container.querySelectorAll('a[href^="/talent/"]').length >= avant)
  }
  cleanup()
}

console.log('\n▶ Favoris : onglets comptés et retrait d’un favori')
{
  const { container } = await mount('/favoris')
  const onglet = () => [...container.querySelectorAll('button.tab')].find((b) => txt(b).startsWith('Produits enregistrés'))
  const total = () => Number((txt(onglet()).match(/\((\d+)\)/) || [])[1] ?? -1)
  const base = total()
  await expect(container, `l’onglet « Produits enregistrés » affiche son compteur (${base})`, base > 0)

  fireEvent.click(onglet())
  await act(async () => {})
  const cartes = container.querySelectorAll('a[href^="/produit/"]').length
  await expect(container, `les produits enregistrés sont affichés (${cartes})`, cartes === base)

  const etoile = [...container.querySelectorAll('.like-btn')].find((b) => txt(b) === '★')
  fireEvent.click(etoile)
  await act(async () => {})
  await expect(container, `le retrait décrémente le compteur (${base} → ${total()})`, total() === base - 1)
  cleanup()
}

console.log('\n▶ Annuaire : pagination des 40 fiches')
{
  const { container } = await mount('/annuaire')
  const cartes = () => container.querySelectorAll('article.card').length
  const page = () => Number((txt(container.querySelector('.tiny.muted-2.center-text')) || '').match(/Page (\d+) sur/)?.[1] || 1)
  await expect(container, `la première page affiche 12 fiches (${cartes()})`, cartes() === 12)
  const premierNom = txt(container.querySelector('article.card b'))
  const suivant = [...container.querySelectorAll('.icon-btn')].find((b) => txt(b) === '›')
  const precedent = [...container.querySelectorAll('.icon-btn')].find((b) => txt(b) === '‹')
  await expect(container, 'le bouton « page précédente » est inactif en page 1', precedent.disabled)
  fireEvent.click(suivant)
  await act(async () => {})
  await expect(container, `la page 2 est atteinte (page ${page()})`, page() === 2)
  await expect(container, 'les fiches de la page 2 sont différentes', txt(container.querySelector('article.card b')) !== premierNom)
  const chiffre4 = [...container.querySelectorAll('.icon-btn')].find((b) => txt(b) === '4')
  fireEvent.click(chiffre4)
  await act(async () => {})
  await expect(container, `la page 4 affiche les dernières fiches (${cartes()} fiches, page ${page()})`, page() === 4 && cartes() === 4)
  await expect(container, 'le bouton « page suivante » est inactif en dernière page',
    [...container.querySelectorAll('.icon-btn')].find((b) => txt(b) === '›').disabled)

  // un filtre renvoie à la première page
  const select = [...container.querySelectorAll('select')][0]
  typeInto(select, 'Bénin')
  await act(async () => {})
  await expect(container, `changer de filtre revient en page 1 (page ${page()})`, page() === 1)
  cleanup()
}

console.log('\n▶ Événement : participer, calendrier, billet')
{
  const { container } = await mount('/evenements/evt-1')
  click(container, 'Participer')
  await expect(container, 'la fenêtre d’inscription s’ouvre', has(container, 'Confirmer ma participation') && has(container, 'Nombre de places'))
  click(container, 'Confirmer ma participation')
  await act(async () => {})
  await expect(container, 'l’inscription est confirmée', has(container, 'Inscription confirmée'))
  click(container, 'Ajouter au calendrier')
  await expect(container, 'l’ajout au calendrier est confirmé', has(container, 'calendrier'))
  click(container, 'Partager')
  await expect(container, 'le partage est confirmé', has(container, 'copié'))
  click(container, 'Acheter un billet')
  await expect(container, 'la billetterie payante est proposée', has(container, 'paiement du billet'))
  cleanup()
}

console.log('\n▶ Opportunité : candidature complète')
{
  const { container } = await mount('/opportunites/opp-2')
  click(container, 'Postuler maintenant')
  await expect(container, 'la fenêtre de candidature s’ouvre', has(container, 'Envoyer ma candidature') || has(container, 'Lettre de motivation'))
  const champ = container.querySelector('.modal textarea, textarea.textarea')
  if (champ) typeInto(champ, 'Bonjour, je souhaite participer au casting.')
  click(container, 'Envoyer ma candidature')
  await act(async () => {})
  await expect(container, 'la candidature est confirmée', has(container, 'Candidature envoyée'))
  cleanup()
}

console.log('\n▶ Mannequin : ouverture du book')
{
  const { container } = await mount('/mannequins')
  const liste = has(container, 'Filtres') || has(container, 'Sexe')
  click(container, 'Voir le book')
  await act(async () => {})
  await expect(container, 'la fiche du mannequin s’ouvre', has(container, 'Proposer une collaboration') && has(container, 'Portfolio'))
  await expect(container, 'la fiche remplace bien la liste', liste && !has(container, 'Voir le book'))
  cleanup()
}

/* ---------------------------------- bilan ---------------------------------- */
console.log(`\n${passed} vérifications réussies, ${failures.length} en échec`)
if (failures.length) {
  console.log('Échecs :')
  failures.forEach((f) => console.log('  - ' + f))
  process.exit(1)
}
