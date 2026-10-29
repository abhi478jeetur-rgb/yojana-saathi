import { CONCEPTS } from './concepts.js'

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Words of 5+ letters match as a prefix ("cultivat" -> "cultivation"); short words must match whole.
const PATTERNS = Object.fromEntries(
  Object.entries(CONCEPTS).map(([key, c]) => [
    key,
    new RegExp(c.words.map((w) => `\\b${esc(w)}${w.length >= 5 ? '' : '\\b'}`).join('|'), 'i')
  ])
)

export function normalize(text = '') {
  return ` ${text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()} `
}

/** Rule-based profile extraction from free text (English or typed Hinglish). */
export function extractProfile(text) {
  const t = normalize(text)
  const concepts = new Set(Object.keys(PATTERNS).filter((k) => PATTERNS[k].test(t)))

  let age = null
  const m =
    t.match(/\b(\d{1,3})\s*(years?|yrs?|yr|saal|sal|baras|varsh|year)\b/) ||
    t.match(/\b(?:age|aged|umar|umr|umra|aayu)\s*(?:is|hai)?\s*(\d{1,3})\b/)
  if (m) {
    const n = Number(m[1])
    if (n > 0 && n < 120) age = n
  }
  if (age !== null) {
    if (age >= 60) concepts.add('senior')
    if (age >= 18 && age <= 29) concepts.add('youth')
  }

  // Income hints: "income 1 lakh", "10000 per month", "kamai 8000"
  const lakh = t.match(/\b(\d+(?:\s\d)?)\s*(lakh|lac|lakhs)\b/)
  const monthly = t.match(/\b(\d{4,6})\s*(per month|a month|monthly|mahina|mahine|month)\b/)
  const incomeWord = /\b(income|kamai|salary|earn|earning|tankhwah)/.test(t)
  if ((incomeWord && lakh && Number(lakh[1].replace(' ', '.')) <= 3) || (monthly && Number(monthly[1]) <= 15000)) {
    concepts.add('lowIncome')
  }

  const acres = t.match(/\b(\d+(?:\s5)?)\s*(acre|acres|bigha|hectare)/)
  return { concepts, age, landAcres: acres ? Number(acres[1].replace(' ', '.')) : null }
}

const tokens = (s) => normalize(s).split(' ').filter((w) => w.length >= 4)

function joinReasons(labels) {
  if (labels.length <= 1) return labels[0] || ''
  return `${labels.slice(0, -1).join(', ')} and ${labels.at(-1)}`
}

/** Score every scheme against the text. Returns sorted matches with a plain-language reason. */
export function matchSchemes(text, schemes, { limit = 12 } = {}) {
  const profile = extractProfile(text)
  const { concepts } = profile
  const words = new Set(tokens(text))
  const effectiveAge = profile.age ?? (concepts.has('senior') ? 65 : null)

  const results = []
  for (const s of schemes) {
    if (effectiveAge !== null && s.age && (effectiveAge < s.age[0] || effectiveAge > s.age[1])) continue

    const hit = (s.targets || []).filter((c) => concepts.has(c))
    let score = hit.reduce((acc, c, i) => acc + (c === s.targets[0] ? 3 : 2) - i * 0.1, 0)

    const kw = new Set(tokens(`${s.name} ${s.tags.join(' ')}`))
    let overlap = 0
    for (const w of words) if (kw.has(w)) overlap++
    score += Math.min(overlap, 3)

    if (hit.length === 0 && overlap < 2) continue
    const labels = hit.map((c) => CONCEPTS[c].label)
    const reason = labels.length
      ? `Matches because ${joinReasons(labels)}.`
      : `Matches the words you used: ${[...words].filter((w) => kw.has(w)).join(', ')}.`
    results.push({ scheme: s, score, reason, concepts: hit })
  }
  results.sort((a, b) => b.score - a.score)
  const max = results[0]?.score || 1
  return {
    profile,
    results: results.slice(0, limit).map((r) => ({ ...r, relevance: r.score / max }))
  }
}

/** Blend rule results with vector hits [{id, score 0..1}] from Appwrite VectorsDB. */
export function blendResults(ruleResults, vectorHits, schemes, { ruleWeight = 0.65, limit = 12 } = {}) {
  const byId = new Map(ruleResults.map((r) => [r.scheme.id, { ...r, vector: 0 }]))
  for (const v of vectorHits || []) {
    const existing = byId.get(v.id)
    if (existing) existing.vector = v.score
    else if (v.score >= 0.85) {
      const scheme = schemes.find((s) => s.id === v.id)
      if (scheme) byId.set(v.id, { scheme, relevance: 0, vector: v.score, concepts: [], reason: 'Close in meaning to what you described.' })
    }
  }
  return [...byId.values()]
    .map((r) => ({ ...r, relevance: ruleWeight * r.relevance + (1 - ruleWeight) * r.vector }))
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit)
}

export function matchLabel(relevance) {
  if (relevance >= 0.75) return 'Strong match'
  if (relevance >= 0.45) return 'Good match'
  return 'Possible match'
}
