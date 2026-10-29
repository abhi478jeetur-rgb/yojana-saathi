// Creates the Appwrite databases and seeds schemes + embeddings.
// Usage: APPWRITE_ENDPOINT=... APPWRITE_PROJECT_ID=... APPWRITE_API_KEY=... npm run seed
import { readFileSync } from 'node:fs'
import { Client, Embeddings, Permission, Role, TablesDB, VectorsDB } from 'node-appwrite'

try {
  process.loadEnvFile('.env')
} catch {}

const { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY } = process.env
if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID || !APPWRITE_API_KEY) {
  console.error('Set APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID and APPWRITE_API_KEY (see .env.example).')
  process.exit(1)
}

const DB = process.env.VITE_APPWRITE_DATABASE_ID || 'yojana'
const SCHEMES = process.env.VITE_APPWRITE_SCHEMES_TABLE || 'schemes'
const CHECKLISTS = process.env.VITE_APPWRITE_CHECKLISTS_TABLE || 'checklists'
const VDB = process.env.VECTORS_DB_ID || 'yojana_vectors'
const VCOL = process.env.VECTORS_COLLECTION_ID || 'scheme_embeddings'
const VSPEC = process.env.APPWRITE_VECTORSDB_SPEC // optional compute tier slug

const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID).setKey(APPWRITE_API_KEY)
const tables = new TablesDB(client)
const vectors = new VectorsDB(client)
const embeddings = new Embeddings(client)
const schemes = JSON.parse(readFileSync(new URL('../data/schemes.json', import.meta.url)))

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
async function ensure(label, fn) {
  try {
    await fn()
    console.log(`created ${label}`)
  } catch (e) {
    if (e.code === 409) console.log(`exists  ${label}`)
    else throw e
  }
}
async function waitForColumns(tableId) {
  for (let i = 0; i < 30; i++) {
    const { columns } = await tables.listColumns({ databaseId: DB, tableId })
    if (columns.every((c) => c.status === 'available')) return
    await sleep(1000)
  }
  throw new Error(`columns on ${tableId} did not become available`)
}

const text = (key) => ({ key, type: 'text', required: false })
const varchar = (key, size, required = false) => ({ key, type: 'varchar', size, required })
const int = (key) => ({ key, type: 'integer', required: false })

// ---- TablesDB: scheme catalogue (public read) + private checklists ----
await ensure(`TablesDB database "${DB}"`, () => tables.create({ databaseId: DB, name: 'Yojana Saathi' }))
await ensure(`table "${SCHEMES}"`, () =>
  tables.createTable({
    databaseId: DB,
    tableId: SCHEMES,
    name: 'Schemes',
    permissions: [Permission.read(Role.any())],
    columns: [
      varchar('name', 200, true),
      varchar('ministry', 200),
      varchar('category', 64),
      text('summary'),
      text('benefits'),
      text('eligibility'),
      varchar('apply_url', 300),
      varchar('source_url', 300),
      text('tags'),
      text('targets'),
      text('documents'),
      int('age_min'),
      int('age_max')
    ]
  })
)
await ensure(`table "${CHECKLISTS}"`, () =>
  tables.createTable({
    databaseId: DB,
    tableId: CHECKLISTS,
    name: 'Checklists',
    rowSecurity: true,
    permissions: [Permission.create(Role.users())],
    columns: [varchar('user_id', 64, true), varchar('scheme_id', 64, true), { key: 'saved', type: 'boolean', required: false }, text('done')]
  })
)
await waitForColumns(SCHEMES)
await waitForColumns(CHECKLISTS)
await ensure('index checklists.user_id', () =>
  tables.createIndex({ databaseId: DB, tableId: CHECKLISTS, key: 'by_user', type: 'key', columns: ['user_id'] })
)

for (const s of schemes) {
  await tables.upsertRow({
    databaseId: DB,
    tableId: SCHEMES,
    rowId: s.id,
    data: {
      name: s.name,
      ministry: s.ministry,
      category: s.category,
      summary: s.summary,
      benefits: s.benefits,
      eligibility: s.eligibility,
      apply_url: s.apply_url,
      source_url: s.source_url,
      tags: JSON.stringify(s.tags),
      targets: JSON.stringify(s.targets || []),
      documents: JSON.stringify(s.documents),
      age_min: s.age?.[0] ?? null,
      age_max: s.age?.[1] ?? null
    }
  })
}
console.log(`seeded ${schemes.length} scheme rows`)

// ---- VectorsDB: one embedding per scheme (nomic-embed-text, 768 dims) ----
try {
  await ensure(`VectorsDB database "${VDB}"`, () =>
    vectors.create({ databaseId: VDB, name: 'Yojana Saathi vectors', ...(VSPEC ? { specification: VSPEC } : {}) })
  )
  await ensure(`collection "${VCOL}"`, () => vectors.createCollection({ databaseId: VDB, collectionId: VCOL, name: 'Scheme embeddings', dimension: 768 }))

  const docText = (s) => `${s.name}. ${s.category}. ${s.summary} ${s.benefits} Who can apply: ${s.eligibility} Keywords: ${s.tags.join(', ')}`
  for (let i = 0; i < schemes.length; i += 10) {
    const batch = schemes.slice(i, i + 10)
    const out = await embeddings.createTextEmbeddings({ texts: batch.map(docText) })
    for (let j = 0; j < batch.length; j++) {
      await vectors.upsertDocument({
        databaseId: VDB,
        collectionId: VCOL,
        documentId: batch[j].id,
        data: { embeddings: out.embeddings[j].embedding, metadata: { schemeId: batch[j].id, name: batch[j].name } }
      })
    }
  }
  console.log(`seeded ${schemes.length} embeddings`)
} catch (e) {
  console.warn(`\nVectorsDB step skipped: ${e.message}`)
  console.warn('The app still works with TablesDB + rule matching. VectorsDB may need a compute specification on your plan.')
}
console.log('\nDone. Deploy functions/match-schemes to enable semantic search.')
