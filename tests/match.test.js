import { describe, it, expect } from 'vitest'
import schemes from '../data/schemes.json'
import { matchSchemes, extractProfile, blendResults } from '../src/lib/search/match.js'

const top = (q, n = 5) => matchSchemes(q, schemes).results.slice(0, n).map((r) => r.scheme.id)

describe('matchSchemes', () => {
  it('Hinglish farmer with daughter going to college', () => {
    const ids = top('main kisan hoon, 2 acre zameen, beti college jaayegi', 8)
    expect(ids[0]).toBe('pm-kisan')
    expect(ids).toContain('css-college')
  })
  it('street vendor needing a loan', () => {
    expect(top('I sell vegetables on a thela in the city and need a small loan')[0]).toBe('svanidhi')
  })
  it('pregnant woman', () => {
    const ids = top('I am pregnant, first baby, we are poor')
    expect(ids).toContain('pmmvy')
    expect(ids).toContain('jsy')
  })
  it('elderly person uses age to filter', () => {
    const ids = top('my father is 72 years old, BPL family, needs pension and hospital treatment', 10)
    expect(ids).toContain('nsap-oldage')
    expect(ids).toContain('pmjay')
    expect(ids).not.toContain('apy')
  })
  it('widow in Hinglish', () => {
    expect(top('meri maa vidhwa hai, gaon mein rehti hai, garib hai')).toContain('nsap-widow')
  })
  it('artisan tailor', () => {
    expect(top('I am a darzi (tailor) and want to buy a new machine')[0]).toBe('vishwakarma')
  })
  it('student scholarship', () => {
    expect(top('SC student, need scholarship for college fees', 3)).toContain('nsp')
  })
  it('house in village', () => {
    expect(top('hamara kachcha ghar hai gaon mein, pakka makaan chahiye')[0]).toBe('pmay-g')
  })
  it('extracts age and low income', () => {
    const p = extractProfile('age 30, income 1 lakh per year, mazdoor')
    expect(p.age).toBe(30)
    expect(p.concepts.has('lowIncome')).toBe(true)
    expect(p.concepts.has('worker')).toBe(true)
  })
  it('blends vector hits with rule scores', () => {
    const { results } = matchSchemes('kisan', schemes)
    const blended = blendResults(results, [{ id: 'pm-kusum', score: 1 }, { id: 'pmjdy', score: 0.9 }], schemes)
    expect(blended.map((r) => r.scheme.id)).toContain('pmjdy')
  })
})
