import { Link } from 'react-router-dom'
import { useStore } from '../store/StoreContext'
import './Pages.css'
import './Shorts.css'

/** Artist Profile — admin-аас soon горим унтрааж болно */
export function ArtistStudioPage() {
  const { data } = useStore()
  const soon = data.siteFlags?.artistSoon !== false

  if (!soon) {
    return (
      <div className="cypher-soon-page">
        <header className="cypher-soon-hero">
          <div className="container">
            <div className="section-kicker">Artist Profile</div>
            <h1>Artist Profile</h1>
            <p>
              Артист профайл, live, статистик — бэлтгэл үе шатандаа. Рэпперүүдийн түүхийг
              үзээд follow хий.
            </p>
          </div>
        </header>
        <section className="section">
          <div className="container">
            <div className="cypher-soon-stage">
              <strong>Open preview</strong>
              <p>Бүрэн studio удахгүй. Одоогоор артистуудын түүхээс эхэл.</p>
              <div className="cypher-soon-actions">
                <Link to="/rappers" className="btn btn-primary">
                  Артистууд
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
          <div className="section-kicker">Artist Profile</div>
          <h1>Coming soon</h1>
          <p>
            Артист өөрийн профайл, live, статистик — нэг дороос удирдах хэсэг. Тун
            удахгүй нээгдэнэ.
          </p>
          <div className="cypher-soon-badge">
            <span aria-hidden="true">★</span>
            <span>LOCKED · SOON</span>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="cypher-soon-stage">
            <div className="cypher-soon-glow" aria-hidden />
            <strong>Profile · Live · Stats</strong>
            <p>
              Artist Profile дээр рэпперүүд өөрийн хуудас, бичлэг, live session-оо
              удирдана. Одоогоор бэлтгэл үе шатандаа — тун удахгүй.
            </p>
            <div className="cypher-soon-actions">
              <Link to="/" className="btn btn-primary">
                Нүүр рүү
              </Link>
              <Link to="/rappers" className="btn btn-ghost">
                Артистууд үзэх
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
