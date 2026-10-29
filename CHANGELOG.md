# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org/).

## [0.1.0] - 2026-10-29

### Added
- Vite + React app with the dark "Sunset" theme, Plus Jakarta Sans and lucide icons.
- Curated dataset of 33 central government schemes (`data/schemes.json`) with benefits, eligibility, documents and official links.
- Demo mode: rule-based profile extraction (occupation, gender, age, rural/urban, income, student, widow, disability, pregnancy, senior) with English + Hinglish synonyms and keyword scoring.
- Scheme cards with "why it matches", benefits, eligibility, tickable document checklist and official apply link.
- Browse by category, saved checklist (localStorage) and About page.
- Mobile bottom navigation with a raised bubble and curved notch; desktop top navigation with a two-column layout.
- GSAP animations (page transitions, staggered cards, nav bubble, count-up, button press) that respect `prefers-reduced-motion`.
- Voice input through the Web Speech API (en-IN) where supported.
