export const APP_URL = import.meta.env.VITE_APP_URL || '#'
export const GITHUB_URL = import.meta.env.VITE_GITHUB_URL || '#'

// Sample queries the hero search box "types", with the schemes it shows.
export const DEMO_QUERIES = [
  {
    q: 'I am a small farmer in Bihar with 2 acres of land',
    results: [
      { name: 'PM-KISAN', tag: 'Agriculture', benefit: '₹6,000 a year in three instalments', docs: 'Aadhaar, land records, bank account' },
      { name: 'PM Fasal Bima Yojana', tag: 'Crop insurance', benefit: 'Low-premium cover for crop loss', docs: 'Land records, sowing certificate' },
    ],
  },
  {
    q: 'meri beti 5 saal ki hai, uske liye savings scheme chahiye',
    results: [
      { name: 'Sukanya Samriddhi Yojana', tag: 'Girl child', benefit: 'High-interest savings for her future', docs: 'Birth certificate, parent KYC' },
      { name: 'PM Ujjwala Yojana', tag: 'Household', benefit: 'Free LPG connection for the family', docs: 'Ration card, Aadhaar' },
    ],
  },
  {
    q: 'street vendor, need a small loan to restart my stall',
    results: [
      { name: 'PM SVANidhi', tag: 'Street vendors', benefit: 'Collateral-free working capital loan', docs: 'Vending certificate, Aadhaar' },
      { name: 'PM Mudra Yojana', tag: 'Small business', benefit: 'Loans for micro enterprises', docs: 'Business proof, KYC' },
    ],
  },
]

export const SCHEMES = [
  'PM-KISAN',
  'Ayushman Bharat PM-JAY',
  'PM Awas Yojana',
  'Sukanya Samriddhi Yojana',
  'PM Mudra Yojana',
  'PM Ujjwala Yojana',
  'Atal Pension Yojana',
  'PM SVANidhi',
  'PM Jan Dhan Yojana',
  'PM Fasal Bima Yojana',
  'Stand-Up India',
  'PM Vishwakarma',
  'PM Jeevan Jyoti Bima',
  'PM Suraksha Bima',
  'National Scholarship Portal',
  'PM Matru Vandana Yojana',
]
