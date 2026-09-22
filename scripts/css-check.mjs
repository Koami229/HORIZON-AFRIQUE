/* Audit de la feuille de style :
     - classes utilisées dans le JSX mais jamais définies ;
     - classes définies mais jamais utilisées (CSS mort) ;
     - couverture responsive des mises en page multi-colonnes.
   Usage : npm run check:css  */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'

const ROOT = process.cwd()

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, out)
    else out.push(full)
  }
  return out
}

const files = walk(join(ROOT, 'src'))
const jsxFiles = files.filter((f) => ['.jsx', '.js'].includes(extname(f)))
const cssFiles = files.filter((f) => extname(f) === '.css')

/* --------------------------- classes utilisées ------------------------- */
const used = new Map() // nom -> [fichiers]
const jsxSource = jsxFiles.map((f) => readFileSync(f, 'utf8')).join('\n')

/* Extraction : chaînes entre quotes + morceaux littéraux des gabarits (les expressions
   ${...} sont retirées pour ne pas prendre des noms de variables pour des classes). */
const addTokens = (chunk) => {
  for (const token of chunk.split(/\s+/)) {
    if (token && /^[a-zA-Z][\w-]*$/.test(token)) used.set(token, true)
  }
}
for (const m of jsxSource.matchAll(/className=(\{`[\s\S]*?`\}|"[^"]*"|\{'[^']*'\})/g)) {
  const raw = m[1]
  // les chaînes entre quotes ne sont retenues que si elles portent un seul jeton
  // (une chaîne contenant des espaces est un texte, pas une liste de classes)
  for (const q of raw.matchAll(/'([^']*)'|"([^"]*)"/g)) {
    const lit = q[1] ?? q[2] ?? ''
    if (!/\s/.test(lit)) addTokens(lit)
  }
  for (const t of raw.matchAll(/`([\s\S]*?)`/g)) addTokens(t[1].replace(/\$\{[^}]*\}/g, ' '))
}

/* ---------------------------- classes définies ------------------------- */
const cssSource = cssFiles.map((f) => readFileSync(f, 'utf8')).join('\n')
const defined = new Set()
for (const m of cssSource.matchAll(/(?:^|[},])\s*([^{}]+)\{/g)) {
  // sélecteurs simples et composés (.notice.green), en ignorant les décimales et les valeurs
  for (const cls of m[1].matchAll(/(?<![\d])\.([a-zA-Z_-][\w-]*)/g)) defined.add(cls[1])
}

/* ------------------------------- rapport ------------------------------ */
/* familles construites dynamiquement dans les composants : btn-, btn-lg, badge-gold, avatar-sm… */
const dynamicFamilies = ['btn-', 'badge-', 'avatar-'].filter((f) => jsxSource.includes(`${f}${'${'}`))
const IGNORE_UNDEFINED = new Set(['active', 'open', 'on', 'featured', 'grow', 'hide-sm', 'header-auth', 'mobile-open'])
const isDynamic = (c) => dynamicFamilies.some((f) => c.startsWith(f))
const missing = [...used.keys()].filter((c) => !defined.has(c) && !IGNORE_UNDEFINED.has(c) && !isDynamic(c)).sort()
/* une classe définie est « utilisée » si son nom apparaît comme mot dans le JSX */
const unused = [...defined].filter((c) => !isDynamic(c) && !new RegExp(`(^|[^\\w-])${c}([^\\w-]|$)`).test(jsxSource)).sort()

const lines = jsxSource.split('\n')

console.log(`${jsxFiles.length} fichiers JSX et ${cssFiles.length} feuille(s) de style analysés`)
console.log(`classes utilisées : ${used.size} · classes définies : ${defined.size} · familles dynamiques : ${dynamicFamilies.join(' ') || '—'}`)

console.log(`\nClasses utilisées mais non définies : ${missing.length ? missing.join(', ') : 'aucune'}`)
for (const c of missing) {
  const where = lines.findIndex((l) => l.includes(`'${c}'`) || l.includes(`"${c}"`))
  if (where >= 0) console.log(`  ${c} ← ${lines[where].trim().slice(0, 120)}`)
}

console.log(`\nClasses définies mais jamais utilisées : ${unused.length ? unused.join(', ') : 'aucune'}`)

/* --------------------- couverture responsive des grilles ---------------------
   Toute mise en page multi-colonnes déclarée hors media query doit être reprise dans
   au moins une media query qui réduit le nombre de colonnes : sans cela, la maquette
   déborde sur un écran de téléphone. Les grilles `auto-fill`/`minmax` sont fluides par
   construction et donc exemptées. */
const base = cssSource.replace(/@media[^{]*\{[\s\S]*?\n\}/g, '')
const mediaBlocks = [...cssSource.matchAll(/@media[^{]*\{([\s\S]*?)\n\}/g)].map((m) => m[1])
const mediaText = mediaBlocks.join('\n')

/* Une mise en page est « à risque » sur petit écran si elle empile au moins deux colonnes
   fractionnaires (1fr 1fr, repeat(3, 1fr)…) ou réserve une colonne fixe large (≥ 200 px).
   Les grilles `auto-fill`/`minmax`, les colonnes d'icône (26px 1fr) et les colonnes
   uniques restent fluides et sont donc exemptées. */
const riskyLayout = (body) => {
  const decl = /grid-template-columns:\s*([^;]+)/.exec(body)?.[1]
  if (!decl) return false
  if (/auto-fill|auto-fit/.test(decl)) return false
  const repeat = /repeat\(\s*(\d+)/.exec(decl)
  if (repeat) return Number(repeat[1]) >= 2
  const tracks = decl.trim().split(/\s+(?![^(]*\))/)
  const fractions = tracks.filter((t) => /[\d.]+fr/.test(t)).length
  const grandeFixe = tracks.some((t) => /^\d+(?:\.\d+)?px$/.test(t) && Number.parseFloat(t) >= 200)
  return fractions >= 2 || grandeFixe
}

const multiColumn = [...new Set(
  [...base.matchAll(/([^{}]+)\{([^}]*)\}/g)].flatMap(([, selectors, body]) => {
    if (!riskyLayout(body)) return []
    return selectors.split(',').map((sel) => sel.trim().match(/^\.([\w-]+)$/)?.[1]).filter(Boolean)
  })
)]

const sansMobile = multiColumn.filter((name) => !new RegExp(`\\.${name}(?![\\w-])`).test(mediaText)
  || !mediaBlocks.some((b) => new RegExp(`\\.${name}(?![\\w-])`).test(b) && /grid-template-columns|columns:/.test(b)))

const breakpoints = [...new Set([...cssSource.matchAll(/@media \(max-width: (\d+)px\)/g)].map((m) => Number(m[1])))].sort((a, b) => b - a)
const menuMobile = /\.nav\s*\{\s*display:\s*none/.test(mediaText) && /\.burger\s*\{[^}]*display:\s*grid/.test(mediaText)

console.log(`\nMises en page multi-colonnes détectées : ${multiColumn.length ? multiColumn.join(', ') : 'aucune'}`)
console.log(`Points de rupture déclarés : ${breakpoints.map((b) => `${b} px`).join(', ') || 'aucun'}`)

const responsiveIssues = []
if (sansMobile.length) responsiveIssues.push(`sans reprise mobile : ${sansMobile.join(', ')}`)
if (breakpoints.length < 3) responsiveIssues.push(`moins de trois points de rupture (${breakpoints.length})`)
if (!menuMobile) responsiveIssues.push('le menu principal ne bascule pas vers le menu mobile (burger)')

if (responsiveIssues.length) {
  console.log(`\n${responsiveIssues.length} problème(s) de responsive :`)
  for (const issue of responsiveIssues) console.log(`  ✗ ${issue}`)
} else {
  console.log(`\n✅ Responsive : chaque mise en page multi-colonnes est reprise sous ${breakpoints.join(' px, ')} px et le menu bascule vers le burger.`)
}

process.exitCode = (missing.length || responsiveIssues.length) ? 1 : 0
