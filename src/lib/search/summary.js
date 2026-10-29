// Builds the short, friendly reply shown above the results, from the extracted profile.

const WHO = [
  ['widow', () => 'a widow'],
  ['farmer', (p) => (p.landAcres !== null && p.landAcres <= 5 ? 'a small farmer' : 'a farmer')],
  ['vendor', () => 'a street vendor'],
  ['artisan', () => 'a traditional artisan'],
  ['worker', () => 'a daily-wage worker'],
  ['business', () => 'a small business owner'],
  ['pregnant', () => 'an expecting mother'],
  ['disabled', () => 'a person with a disability'],
  ['senior', () => 'a senior citizen'],
  ['student', (p) => (p.concepts.has('girlChild') ? null : 'a student')],
  ['unemployed', () => 'someone looking for work'],
  ['woman', () => 'a woman']
]

/** Describe the person in one clause, e.g. "a small farmer with a daughter heading to college". */
export function describeProfile(profile) {
  const c = profile.concepts
  let who = null
  for (const [key, fn] of WHO) {
    if (c.has(key) && (who = fn(profile))) break
  }
  if (!who && profile.age === null && c.size === 0) return null
  let text = who || 'someone'
  if (profile.age !== null) text += ` aged ${profile.age}`
  if (c.has('girlChild')) text += c.has('college') ? ' with a daughter heading to college' : ' with a young daughter'
  if (c.has('rural')) text += ', living in a village'
  else if (c.has('urban')) text += ', living in a city'
  return text
}

/** "PM-KISAN (Pradhan Mantri ...)" -> "PM-KISAN" */
export const shortName = (name) => name.replace(/\s*\(.*\)\s*$/, '')

/** Full reply: who you seem to be + how many schemes + the strongest one. */
export function buildSummary(profile, results) {
  const who = describeProfile(profile)
  const intro = who ? `You look like ${who}.` : 'Thanks for telling me about yourself.'
  const n = results.length
  if (n === 0) return `${intro} I could not find a strong match yet. Try adding your work, age or family details.`
  const top = shortName(results[0].scheme.name)
  if (n === 1) return `${intro} I found 1 scheme for you: ${top}.`
  return `${intro} I found ${n} schemes; the strongest is ${top}.`
}
