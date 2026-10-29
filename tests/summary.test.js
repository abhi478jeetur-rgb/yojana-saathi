import { describe, it, expect } from 'vitest'
import schemes from '../data/schemes.json'
import { matchSchemes } from '../src/lib/search/match.js'
import { buildSummary, describeProfile } from '../src/lib/search/summary.js'

const summarize = (q) => {
  const { profile, results } = matchSchemes(q, schemes)
  return { text: buildSummary(profile, results), results }
}

describe('buildSummary', () => {
  it('Hinglish farmer with a daughter going to college', () => {
    const { text, results } = summarize('main kisan hoon, 2 acre zameen, beti college jaayegi')
    expect(text).toBe(`You look like a small farmer with a daughter heading to college. I found ${results.length} schemes; the strongest is PM-KISAN.`)
    expect(text).toContain('PM-KISAN')
  })
  it('elderly widow in a village', () => {
    const { text } = summarize('I am a widow, 62 years old, living in a village')
    expect(text.startsWith('You look like a widow aged 62, living in a village.')).toBe(true)
  })
  it('no details and no results', () => {
    expect(describeProfile({ concepts: new Set(), age: null, landAcres: null })).toBe(null)
    expect(buildSummary({ concepts: new Set(), age: null, landAcres: null }, [])).toBe(
      'Thanks for telling me about yourself. I could not find a strong match yet. Try adding your work, age or family details.'
    )
  })
  it('single result wording', () => {
    const r = [{ scheme: { name: 'PM SVANidhi' } }]
    expect(buildSummary({ concepts: new Set(['vendor']), age: null, landAcres: null }, r)).toBe('You look like a street vendor. I found 1 scheme for you: PM SVANidhi.')
  })
})
