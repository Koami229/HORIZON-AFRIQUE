/* Audit de la feuille de style : classes utilisées dans le JSX mais jamais définies,
   et classes définies mais jamais utilisées (CSS mort).
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

process.exitCode = missing.length ? 1 : 0
