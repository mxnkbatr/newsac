import { Link, useParams } from 'react-router-dom'
import { useStore } from '../store/StoreContext'
import { useAuth } from '../context/AuthContext'
import './Pages.css'

export function RappersPage() {
  const { data, track } = useStore()
  const { user, toggleFavorite } = useAuth()

  return (
    <div>
      <header className="page-hero">
        <div className="container">
          <div className="section-kicker">Артист</div>
          <h1>Рэпперүүдийн түүх</h1>
          <p>UG-ээс чарт хүртэл — follow хийгээд feed-дээ ав.</p>
        </div>
      </header>

      <section className="section">
        <div className="container rapper-grid">
          {data.rappers.map((r) => {
            const fav = user?.favorites.includes(r.id)
            return (
              <article key={r.id} className="rapper-card">
                <Link to={`/rappers/${r.id}`} className="rapper-card-media">
                  <img src={r.image} alt="" loading="lazy" />
                </Link>
                <div className="rapper-card-body">
                  <div className="rapper-card-top">
                    <div>
                      <h2>
                        <Link to={`/rappers/${r.id}`}>{r.name}</Link>
                      </h2>
                      <span>
                        {r.aka} · {r.city}
                      </span>
                    </div>
                    <button
                      type="button"
                      className={`fav-btn ${fav ? 'on' : ''}`}
                      onClick={() => {
                        if (!user) {
                          window.location.href = '/auth'
                          return
                        }
                        const added = toggleFavorite(r.id)
                        if (added) track('rapper_favorite', r.id)
                      }}
                      aria-label="Follow"
                    >
                      {fav ? '★' : '☆'}
                    </button>
                  </div>
                  <p>{r.bio}</p>
                  <div className="tag-row">
                    {r.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export function RapperDetailPage() {
  const { id } = useParams()
  const { data, track } = useStore()
  const rapper = data.rappers.find((r) => r.id === id)
  const { user, toggleFavorite } = useAuth()

  if (!rapper) {
    return (
      <div className="page-hero">
        <div className="container">
          <h1>Рэппер олдсонгүй</h1>
          <Link to="/rappers" className="btn btn-ghost" style={{ marginTop: '1.5rem' }}>
            Буцах
          </Link>
        </div>
      </div>
    )
  }

  const fav = user?.favorites.includes(rapper.id)

  return (
    <article>
      <header className="rapper-detail-hero">
        <img src={rapper.image} alt="" className="rapper-detail-bg" />
        <div className="rapper-detail-shade" />
        <div className="container rapper-detail-content">
          <div className="section-kicker">
            {rapper.city} · {rapper.years}
          </div>
          <h1>
            {rapper.name}
            {rapper.verified ? ' ✓' : ''}
          </h1>
          <p>{rapper.bio}</p>
          <div className="rapper-detail-actions">
            <button
              type="button"
              className={`btn ${fav ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => {
                if (!user) {
                  window.location.href = '/auth'
                  return
                }
                const added = toggleFavorite(rapper.id)
                if (added) track('rapper_favorite', rapper.id)
              }}
            >
              {fav ? '★ Follow-тай' : '☆ Follow'}
            </button>
            {user &&
              (rapper.ownerUserId === user.id ||
                rapper.ownerEmail === user.email.toLowerCase()) && (
                <Link to="/artist" className="btn btn-primary">
                  Artist Hub · Live
                </Link>
              )}
            <span className="streams-pill">{rapper.streams} стрим</span>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container detail-body story-body">
          <div className="tag-row" style={{ marginBottom: '1.5rem' }}>
            {rapper.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          {rapper.story.split('\n\n').map((para) => (
            <p key={para.slice(0, 24)}>{para}</p>
          ))}
          <Link to="/feed" className="section-link" style={{ marginTop: '1rem', display: 'inline-block' }}>
            Миний feed →
          </Link>
        </div>
      </section>
    </article>
  )
}
