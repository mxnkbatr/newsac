import { useStore } from '../store/StoreContext'
import './Pages.css'

export function RankingsPage() {
  const { data } = useStore()
  const hot = data.rankings.filter((r) => r.hot)

  return (
    <div>
      <header className="page-hero">
        <div className="container">
          <div className="section-kicker">Энэ 7 хоногт халуун</div>
          <h1>Долоо хоногийн чарт</h1>
          <p>
            Стрим + сошиал + медиа — өдөр бүр буцаж орж шинэ байр шалгаарай.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          {hot.length > 0 && (
            <div className="hot-strip" style={{ marginBottom: '1.75rem' }}>
              <div className="section-kicker">HOT NOW</div>
              <div className="tag-row">
                {hot.map((r) => (
                  <span key={r.id}>
                    {r.name} · {r.track}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="rank-legend">
            <span>Байр</span>
            <span>Артист / Трек</span>
            <span>Стрим</span>
            <span>Индекс</span>
            <span>Өөрчлөлт</span>
          </div>

          <ol className="rank-table">
            {data.rankings.map((r, i) => (
              <li key={r.id}>
                <span className="rank-pos">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <strong>
                    {r.name}
                    {r.hot ? ' · HOT' : ''}
                  </strong>
                  <em>{r.track}</em>
                </div>
                <span className="rank-streams">{r.streams}</span>
                <div className="rank-bar-wrap">
                  <div className="rank-bar" style={{ width: `${r.score}%` }} />
                  <span>{r.score}</span>
                </div>
                <span className={`rank-delta ${r.change > 0 ? 'up' : r.change < 0 ? 'down' : ''}`}>
                  {r.change > 0 ? `▲ ${r.change}` : r.change < 0 ? `▼ ${Math.abs(r.change)}` : '—'}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  )
}
