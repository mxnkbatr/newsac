import { Link } from 'react-router-dom'
import { useStore } from '../store/StoreContext'
import './Shorts.css'

/** Live Cypher — admin-аас soon горим унтрааж болно */
export function ShortsPage() {
  const { data } = useStore()
  const soon = data.siteFlags?.cypherSoon !== false

  if (!soon) {
    return (
      <div className="cypher-soon-page">
        <header className="cypher-soon-hero">
          <div className="container">
            <div className="section-kicker">Live Cypher</div>
            <h1>Live Cypher</h1>
            <p>
              Артистуудыг авчирч Cypher шаалгая. Хуваарь, зочид удахгүй энд нээгдэнэ —
              одоогоор бэлтгэл үе шат.
            </p>
          </div>
        </header>
        <section className="section">
          <div className="container">
            <div className="cypher-soon-stage">
              <strong>Open · Coming lineup</strong>
              <p>Battle хуудас дээрх санал идэвхтэй. Live Cypher event удахгүй.</p>
              <div className="cypher-soon-actions">
                <Link to="/battle" className="btn btn-primary">
                  Battle үзэх
                </Link>
                <Link to="/live" className="btn btn-ghost">
                  Live
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="cypher-soon-page">
      <header className="cypher-soon-hero">
        <div className="container">
          <div className="section-kicker">Live Cypher</div>
          <h1>Coming soon</h1>
          <p>
            Артистуудыг авчирч Cypher шаалгая. Live stage дээр рэпперүүд мөргөлдөнө —
            тун удахгүй.
          </p>
          <div className="cypher-soon-badge">
            <span aria-hidden="true">⚡</span>
            <span>LOCKED · CYPHER SOON</span>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="cypher-soon-stage">
            <div className="cypher-soon-glow" aria-hidden />
            <strong>Live · Mic · Crowd</strong>
            <p>
              Newsac Live Cypher — артистуудыг талбайд авчирч, фэнүүдийн өмнө cypher
              шаалгана. Хуваарь, зочид, санал асуулга энд нээгдэнэ.
            </p>
            <div className="cypher-soon-actions">
              <Link to="/" className="btn btn-primary">
                Нүүр рүү
              </Link>
              <Link to="/battle" className="btn btn-ghost">
                Battle үзэх
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
