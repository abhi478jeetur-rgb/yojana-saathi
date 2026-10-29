import schemes from '../../data/schemes.json'

export const SCHEMES = schemes
export const CATEGORIES = [...new Set(schemes.map((s) => s.category))]

export const EXAMPLES = [
  'main kisan hoon, 2 acre zameen, beti college jaayegi',
  'I sell tea on a cart in the city and need a small loan',
  'I am pregnant with my first baby, we are poor',
  'My mother is 68, a widow, and lives in a village',
  'I am 22, finished graduation, no job yet',
  'hamara kachcha ghar hai, pakka makaan chahiye'
]
