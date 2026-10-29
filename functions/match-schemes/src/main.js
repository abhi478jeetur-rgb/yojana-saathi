// Appwrite Function: semantic scheme search.
// Embeds the user's text with Appwrite's built-in nomic-embed-text model and
// returns the nearest schemes from VectorsDB using Query.vectorCosine.
import { Client, Embeddings, Query, VectorsDB } from 'node-appwrite'

const VDB = process.env.VECTORS_DB_ID || 'yojana_vectors'
const VCOL = process.env.VECTORS_COLLECTION_ID || 'scheme_embeddings'
const LIMIT = 10

export default async ({ req, res, error }) => {
  const query = String(req.bodyJson?.query || '').slice(0, 500).trim()
  if (!query) return res.json({ ok: false, error: 'query is required' }, 400)

  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key'] || process.env.APPWRITE_API_KEY)

  try {
    const { embeddings } = await new Embeddings(client).createTextEmbeddings({ texts: [query] })
    const { documents } = await new VectorsDB(client).listDocuments({
      databaseId: VDB,
      collectionId: VCOL,
      queries: [Query.vectorCosine('embeddings', embeddings[0].embedding), Query.limit(LIMIT)]
    })
    // Results come back nearest first; turn rank into a 1.0 -> 0.46 score for blending.
    const hits = documents.map((d, i) => ({ id: d.metadata?.schemeId || d.$id, score: Number((1 - i * 0.06).toFixed(2)) }))
    return res.json({ ok: true, hits })
  } catch (e) {
    error(e.message)
    return res.json({ ok: false, error: 'vector search failed' }, 500)
  }
}
