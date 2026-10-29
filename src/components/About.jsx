import { Database, ShieldCheck, Languages, HandCoins } from 'lucide-react'

export default function About({ mode, count }) {
  return (
    <div className="about">
      <h1 className="page-title">About Yojana Saathi</h1>
      <p className="lede">
        A simple helper that turns your everyday words into a list of government schemes you may qualify for, with the documents you need and the
        official place to apply.
      </p>
      <div className="card-grid">
        <div className="glass info">
          <Languages className="accent" />
          <h3>Speak your way</h3>
          <p>Type or speak in English or Hinglish. "Main kisan hoon" works just like "I am a farmer".</p>
        </div>
        <div className="glass info">
          <HandCoins className="accent" />
          <h3>Never pay a middleman</h3>
          <p>Applying for these schemes is free. Every card links to the official government website.</p>
        </div>
        <div className="glass info">
          <ShieldCheck className="accent" />
          <h3>Private by default</h3>
          <p>No sign-up. Your checklist is saved on your device, or in a private anonymous Appwrite session.</p>
        </div>
        <div className="glass info">
          <Database className="accent" />
          <h3>{mode === 'appwrite' ? 'Connected to Appwrite' : 'Demo mode'}</h3>
          <p>
            {mode === 'appwrite'
              ? `Schemes load from Appwrite TablesDB and search uses VectorsDB semantic matching. ${count} schemes.`
              : `Matching runs right in your browser on ${count} bundled schemes. Add Appwrite keys to enable cloud sync and semantic search.`}
          </p>
        </div>
      </div>
      <p className="verify big">
        Information is general and may change. Always confirm eligibility and amounts on the official scheme website before applying. Yojana Saathi is
        not a government service.
      </p>
    </div>
  )
}
