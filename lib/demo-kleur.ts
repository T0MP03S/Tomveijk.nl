/**
 * Kleurhulpjes voor demopagina's.
 *
 * De hoofdkleur komt van de site van de prospect en kan letterlijk alles zijn:
 * knalgeel, lichtgroen, bijna-zwart. Daarom berekenen we tekstkleuren en tinten
 * hier uit in plaats van ze vast te leggen — anders krijg je witte tekst op een
 * gele knop en is de demo onleesbaar. Precies het tegenovergestelde van wat je
 * wilt laten zien.
 */

type Rgb = { r: number; g: number; b: number }

const INKT = '#111827'
const WIT = '#ffffff'

function normaliseer(hex: string): string {
  let h = hex.trim().replace(/^#/, '')
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('')
  }
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return '000000'
  return h.toLowerCase()
}

function naarRgb(hex: string): Rgb {
  const h = normaliseer(hex)
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  }
}

function naarHex({ r, g, b }: Rgb): string {
  const deel = (n: number) =>
    Math.round(Math.min(255, Math.max(0, n)))
      .toString(16)
      .padStart(2, '0')
  return `#${deel(r)}${deel(g)}${deel(b)}`
}

/** Relatieve luminantie volgens WCAG. */
function luminantie(hex: string): number {
  const { r, g, b } = naarRgb(hex)
  const kanaal = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * kanaal(r) + 0.7152 * kanaal(g) + 0.0722 * kanaal(b)
}

/** Contrastverhouding tussen twee kleuren (1 t/m 21). */
export function contrast(a: string, b: string): number {
  const la = luminantie(a)
  const lb = luminantie(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

/** Mengt twee kleuren. t=0 geeft `a`, t=1 geeft `b`. */
export function meng(a: string, b: string, t: number): string {
  const ra = naarRgb(a)
  const rb = naarRgb(b)
  return naarHex({
    r: ra.r + (rb.r - ra.r) * t,
    g: ra.g + (rb.g - ra.g) * t,
    b: ra.b + (rb.b - ra.b) * t,
  })
}

export const lichter = (hex: string, t = 0.5) => meng(hex, WIT, t)
export const donkerder = (hex: string, t = 0.2) => meng(hex, '#000000', t)

/** Leesbare tekstkleur op een gegeven achtergrond. */
export function tekstOp(achtergrond: string): string {
  return contrast(achtergrond, WIT) >= contrast(achtergrond, INKT) ? WIT : INKT
}

/**
 * Maakt een kleur donker genoeg om als tekst op wit te gebruiken. Een lichtgroen
 * logo levert anders onleesbare links op.
 */
export function leesbaarOpWit(hex: string, minimum = 4.5): string {
  let kleur = hex
  for (let i = 0; i < 20 && contrast(kleur, WIT) < minimum; i++) {
    kleur = donkerder(kleur, 0.08)
  }
  return kleur
}

/** Bouwt de CSS-variabelen voor één demopagina. */
export function themaVariabelen(thema: {
  primair: string
  accent: string
  donker: string
  zacht: string
}): Record<string, string> {
  return {
    '--brand': thema.primair,
    '--brand-tekst': tekstOp(thema.primair),
    '--brand-hover': donkerder(thema.primair, 0.12),
    '--brand-zacht': lichter(thema.primair, 0.9),
    '--brand-rand': lichter(thema.primair, 0.72),
    '--brand-link': leesbaarOpWit(thema.primair),
    '--accent': thema.accent,
    '--accent-tekst': tekstOp(thema.accent),
    '--inkt': thema.donker,
    '--zacht': thema.zacht,
  }
}

/** Zet "06-12 34 56 78" om naar een bruikbare tel:-link. */
export function telHref(nummer: string): string {
  const cijfers = nummer.replace(/[^\d+]/g, '')
  if (cijfers.startsWith('+')) return `tel:${cijfers}`
  if (cijfers.startsWith('00')) return `tel:+${cijfers.slice(2)}`
  if (cijfers.startsWith('0')) return `tel:+31${cijfers.slice(1)}`
  return `tel:${cijfers}`
}

/**
 * Combinerende accenttekens (U+0300 t/m U+036F).
 *
 * Als string opgebouwd in plaats van als regex-letterlijk: zo staan er geen
 * losse combinerende tekens in de broncode (die plakken aan het teken ervoor en
 * zijn dan onleesbaar), en werkt het onder de ES5-doeltaal van dit project.
 */
const ACCENTEN = new RegExp('[\\u0300-\\u036f]', 'g')

/** "Café Jansen & Zn." -> "cafe-jansen-zn" */
export function slugify(tekst: string): string {
  return tekst
    .toLowerCase()
    .normalize('NFD')
    .replace(ACCENTEN, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
