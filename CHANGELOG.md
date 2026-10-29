# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-10-29

### Added
- Vitest suite covering matching on eight sample English and Hinglish queries plus profile extraction and hybrid blending.
- Playwright scripts for mobile and desktop screenshots and an animated demo GIF.
- README with banner, badges, architecture diagram, setup guide and screenshots; MIT license.

### Changed
- Page transitions animate opacity only (smoother in video capture).

## [0.2.0] - 2026-10-29

### Added
- Appwrite mode, enabled when `VITE_APPWRITE_ENDPOINT` and `VITE_APPWRITE_PROJECT_ID` are set.
- TablesDB: scheme catalogue table (public read) and per-user checklist table with row security, loaded through an anonymous Appwrite session.
- VectorsDB: `functions/match-schemes` embeds the query with the built-in `nomic-embed-text` model and ranks schemes with `Query.vectorCosine`.
- Hybrid ranking that blends vector similarity with the rule-based score, with automatic fallback to rule matching.
- `scripts/seed.mjs` creates the databases, tables, index and vector collection and seeds rows + embeddings.
- `.env.example` listing every variable and API key scope.

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

[1.0.0]: https://github.com/<owner>/yojana-saathi/releases/tag/v1.0.0
[0.2.0]: https://github.com/<owner>/yojana-saathi/releases/tag/v0.2.0
[0.1.0]: https://github.com/<owner>/yojana-saathi/releases/tag/v0.1.0
