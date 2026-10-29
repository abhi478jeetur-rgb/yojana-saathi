// Appwrite mode: active only when VITE_APPWRITE_ENDPOINT and VITE_APPWRITE_PROJECT_ID are set.
import { Account, Client, Functions, Permission, Query, Role, TablesDB } from 'appwrite'

const env = import.meta.env || {}
const ENDPOINT = env.VITE_APPWRITE_ENDPOINT
const PROJECT = env.VITE_APPWRITE_PROJECT_ID
export const DB_ID = env.VITE_APPWRITE_DATABASE_ID || 'yojana'
export const SCHEMES_TABLE = env.VITE_APPWRITE_SCHEMES_TABLE || 'schemes'
export const CHECKLIST_TABLE = env.VITE_APPWRITE_CHECKLISTS_TABLE || 'checklists'
export const MATCH_FUNCTION = env.VITE_APPWRITE_MATCH_FUNCTION_ID || 'match-schemes'

export const appwriteEnabled = Boolean(ENDPOINT && PROJECT)

let client, tables, account, functions, userPromise

function init() {
  if (client) return
  client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT)
  tables = new TablesDB(client)
  account = new Account(client)
  functions = new Functions(client)
}

/** Anonymous session so each visitor gets private checklist rows without signing up. */
export function getUser() {
  init()
  userPromise ||= account.get().catch(async () => {
    await account.createAnonymousSession()
    return account.get()
  })
  return userPromise
}

const fromRow = (r) => ({
  id: r.$id,
  name: r.name,
  ministry: r.ministry,
  category: r.category,
  summary: r.summary,
  benefits: r.benefits,
  eligibility: r.eligibility,
  apply_url: r.apply_url,
  source_url: r.source_url,
  tags: JSON.parse(r.tags || '[]'),
  targets: JSON.parse(r.targets || '[]'),
  documents: JSON.parse(r.documents || '[]'),
  age: r.age_min != null && r.age_max != null ? [r.age_min, r.age_max] : undefined
})

/** Scheme catalogue from TablesDB (public read). */
export async function fetchSchemes() {
  init()
  const res = await tables.listRows({ databaseId: DB_ID, tableId: SCHEMES_TABLE, queries: [Query.limit(100)] })
  return res.rows.map(fromRow)
}

/** Semantic search: the match-schemes Function embeds the query and runs Query.vectorCosine on VectorsDB. */
export async function vectorSearch(query) {
  init()
  await getUser()
  const exec = await functions.createExecution({
    functionId: MATCH_FUNCTION,
    body: JSON.stringify({ query }),
    async: false
  })
  const data = JSON.parse(exec.responseBody || '{}')
  if (!data.ok) throw new Error(data.error || 'vector search unavailable')
  return data.hits // [{ id, score }]
}

// Row ids are max 36 chars: short hash of user + scheme.
const rowId = (userId, schemeId) => {
  let h = 0
  for (const ch of `${userId}:${schemeId}`) h = (Math.imul(31, h) + ch.charCodeAt(0)) | 0
  return `c${(h >>> 0).toString(36)}${userId.slice(-8)}`
}

export async function loadChecklists() {
  const user = await getUser()
  const res = await tables.listRows({
    databaseId: DB_ID,
    tableId: CHECKLIST_TABLE,
    queries: [Query.equal('user_id', user.$id), Query.limit(100)]
  })
  const out = {}
  for (const r of res.rows) if (r.saved) out[r.scheme_id] = JSON.parse(r.done || '[]')
  return out
}

export async function saveChecklist(schemeId, done) {
  const user = await getUser()
  const me = Role.user(user.$id)
  await tables.upsertRow({
    databaseId: DB_ID,
    tableId: CHECKLIST_TABLE,
    rowId: rowId(user.$id, schemeId),
    data: { user_id: user.$id, scheme_id: schemeId, saved: done !== null, done: JSON.stringify(done || []) },
    permissions: [Permission.read(me), Permission.update(me), Permission.delete(me)]
  })
}
