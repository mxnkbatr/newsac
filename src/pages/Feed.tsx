import { Link, Navigate } from 'react-router-dom'
import { useStore } from '../store/StoreContext'
import { useAuth } from '../context/AuthContext'
import './Pages.css'
import './Home.css'

export function FeedPage() {
  const { user } = useAuth()
  const { data } = useStore()

  if (!user) return <Navigate to="/auth" replace />

  const followed = data.rappers.filter((r) => user.favorites.includes(r.id))
  const feed = [
    ...data.news.slice(0, 4).map((n) => ({
      id: `n-${n.id}`,
      type: 'news' as const,
      title: n.title,
      meta: n.category,
      to: `/news/${n.id}`,
      image: n.image,
    })),
    ...data.videos.slice(0, 4).map((v) => ({
      id: `v-${v.id}`,
      type: 'video' as const,
      title: v.title,
      meta: v.published,
      to: '/videos',
      image: `https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`,
    })),
    ...data.shorts
      .filter((s) => !s.rapperId || user.favorites.includes(s.rapperId))
      .map((s) => ({
        id: `s-${s.id}`,
        type: 'short' as const,
        title: s.title,
        meta: 'Shorts',
        to: '/shorts',
        image: `https://i.ytimg.com/vi/${s.youtubeId}/hqdefault.jpg`,
      })),
  ]

  return (
    <div>
      <header className="page-hero">
        <div className="container">
          <div className="section-kicker">Миний feed</div>
          <h1>Дагасан рэпперүүдийн update</h1>
          <p>
            {followed.length
              ? `${followed.length} рэппер follow хийсэн.`
              : 'Одоогоор follow байхгүй — рэпперүүдээс ★ дар.'}
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          {followed.length > 0 && (
            <div className="feed-follows" style={{ marginBottom: '1.5rem' }}>
              {followed.map((r) => (
                <Link key={r.id} to={`/rappers/${r.id}`} className="rapper-chip">
                  <img src={r.image} alt="" />
                  <div>
                    <strong>{r.name}</strong>
                    <span>{r.city}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="news-list">
            {feed.map((item) => (
              <Link key={item.id} to={item.to} className="news-row">
                <div className="news-row-img">
                  <img src={item.image} alt="" loading="lazy" />
                </div>
                <div>
                  <span className="meta">{item.type} · {item.meta}</span>
                  <h2>{item.title}</h2>
                </div>
              </Link>
            ))}
          </div>

          {!followed.length && (
            <Link to="/rappers" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Рэпперүүд рүү
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}
