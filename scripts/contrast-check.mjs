/* Contraste WCAG des couples texte / fond du système de design.
   La palette est lue dans `src/styles.css` (`:root`), les couples vérifiés sont ceux
   réellement utilisés par les composants. Les valeurs calculées sont comparées aux
   seuils WCAG 2.1 AA : 4,5:1 pour le texte courant, 3:1 pour le grand texte (≥ 24 px
   ou ≥ 18,66 px en gras) et 3:1 pour les éléments d'interface.
   Usage : npm run check:contrast  */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const css = readFileSync(join(process.cwd(), 'src', 'styles.css'), 'utf8')
const root = css.slice(css.indexOf(':root'), css.indexOf('}', css.indexOf(':root')))

const palette = Object.fromEntries([...root.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{3,8})/g)].map((m) => [m[1], m[2]]))
const hex = (name) => palette[name]

const toRgb = (h) => {
  const v = h.replace('#', '')
  const full = v.length === 3 ? v.split('').map((c) => c + c).join('') : v
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16))
}
const luminance = (h) => {
  const [r, g, b] = toRgb(h).map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const ratio = (a, b) => {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (l1 + 0.05) / (l2 + 0.05)
}

/* Couples du système de design : [couleur de texte, fond, seuil, contexte] */
const PAIRS = [
  ['text', 'ink', 4.5, 'texte courant sur le fond général'],
  ['text', 'ink-2', 4.5, 'texte courant sur fond alterné'],
  ['text', 'surface', 4.5, 'texte courant dans les panneaux'],
  ['text', 'surface-2', 4.5, 'texte courant dans les blocs secondaires'],
  ['text', 'surface-3', 4.5, 'texte courant dans les blocs accentués'],
  ['muted', 'ink', 4.5, 'texte secondaire sur le fond général'],
  ['muted', 'surface', 4.5, 'texte secondaire dans les panneaux'],
  ['muted', 'surface-2', 4.5, 'texte secondaire dans les blocs secondaires'],
  ['muted-2', 'ink', 4.5, 'texte tertiaire sur le fond général'],
  ['muted-2', 'surface', 4.5, 'texte tertiaire dans les panneaux'],
  ['muted-2', 'surface-2', 4.5, 'texte tertiaire dans les blocs secondaires'],
  ['muted-2', 'surface-3', 4.5, 'texte tertiaire dans les blocs accentués'],
  ['gold', 'ink', 4.5, 'accents dorés sur le fond général'],
  ['gold', 'surface', 4.5, 'accents dorés dans les panneaux'],
  ['gold-soft', 'ink', 4.5, 'accents dorés clairs sur le fond général'],
  ['gold-soft', 'surface-2', 4.5, 'accents dorés clairs dans les blocs secondaires'],
  ['terra-soft', 'ink', 4.5, 'texte terracotta sur le fond général'],
  ['terra-soft', 'surface', 4.5, 'texte terracotta dans les panneaux'],
  ['green-soft', 'surface', 4.5, 'texte vert dans les panneaux'],
  ['green-soft', 'surface-2', 4.5, 'texte vert dans les blocs secondaires'],
  ['indigo-soft', 'surface', 4.5, 'texte indigo dans les panneaux'],
  ['indigo', 'ink', 3, 'éléments d’interface indigo sur le fond général'],
  ['green', 'ink', 3, 'éléments d’interface verts sur le fond général'],
  ['rose', 'ink', 3, 'éléments d’interface rose sur le fond général'],
]

const missing = []
const failures = []
const lines = []
for (const [fg, bg, min, context] of PAIRS) {
  if (!hex(fg) || !hex(bg)) { missing.push(`${fg} ou ${bg}`); continue }
  const value = ratio(hex(fg), hex(bg))
  const ok = value >= min
  if (!ok && min > 1) failures.push({ fg, bg, value, min, context })
  lines.push([`${fg} (${hex(fg)}) sur ${bg} (${hex(bg)})`, value.toFixed(2), min, context, ok])
}

console.log(`Palette lue dans src/styles.css : ${Object.keys(palette).length} jetons de couleur.`)
console.log(`${PAIRS.length - missing.length} couples texte / fond évalués selon WCAG 2.1 AA.\n`)
for (const [label, value, min, context, ok] of lines) {
  console.log(`  ${ok ? '✓' : (min > 1 ? '✗' : '·')} ${label.padEnd(42)} ${value.padStart(5)} : 1   seuil ${min}   ${context}`)
}

if (missing.length) console.log(`\n⚠️ Jetons absents de la palette : ${[...new Set(missing)].join(', ')}`)

if (failures.length) {
  console.log(`\n${failures.length} couple(s) sous le seuil d’accessibilité :`)
  for (const f of failures) console.log(`  ✗ ${f.fg} sur ${f.bg} : ${f.value.toFixed(2)} : 1 (seuil ${f.min}) — ${f.context}`)
  process.exitCode = 1
} else {
  console.log('\n✅ Tous les couples texte / fond respectent le seuil WCAG 2.1 AA déclaré.')
}
