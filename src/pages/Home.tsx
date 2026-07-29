import { Link } from 'react-router-dom'
import { YOUTUBE_CHANNEL_URL } from '../data/brand'
import { useAuth } from '../context/AuthContext'
import { useStore } from '../store/StoreContext'
import { NewsletterBox, PollWidget, SponsorSlot } from '../components/Widgets'
import type { DailyDrop } from '../store/types'
import './Home.css'

function dropHref(drop: DailyDrop) {
  switch (drop.kind) {
    case 'news':
      return `/news/${drop.targetId}`
    case 'video':
      return '/videos'
    case 'podcast':
      return '/podcasts'
    case 'short':
      return '/shorts'
    default:
      return '/'
  }
}

function TodayStrip() {
  const { data } = useStore()
  const today = new Date().toISOString().slice(0, 10)
  const drop =
    data.dailyDrops.find((d) => d.date === today) ||
    [...data.dailyDrops].sort((a, b) => b.date.localeCompare(a.date))[0]
  const live = data.livestreams.find((l) => l.status === 'live')
  const upcoming = [...data.livestreams]
    .filter((l) => l.status === 'upcoming')
    .sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt))[0]

  return (
    <section className="section today-strip">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="section-kicker">Өнөөдөр</div>
            <h2 className="section-title">Today</h2>
          </div>
          <Link to="/wall" className="section-link">
            Wall →
          </Link>
        </div>

        <div className="today-grid reveal reveal-delay-1">
          {drop && (
            <Link to={dropHref(drop)} className="today-drop">
              <div className="today-drop-media fx-media">
                <img src={drop.image} alt="" loading="lazy" />
              </div>
              <div className="today-drop-body">
                <span>ӨНӨӨДРИЙН DROP · {drop.kind.toUpperCase()}</span>
                <strong>{drop.title}</strong>
                <p>{drop.teaser}</p>
              </div>
            </Link>
          )}

          <Link to="/live" className={`today-live ${live ? 'is-live' : ''}`}>
            {live ? (
              <>
                <span className="today-live-dot" />
                <strong>LIVE · {live.title}</strong>
                <p>Шууд үзэх</p>
              </>
            ) : upcoming ? (
              <>
                <span className="today-live-soon">УДАХГҮЙ</span>
                <strong>{upcoming.title}</strong>
                <p>
                  {new Date(upcoming.startsAt).toLocaleString('mn-MN', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </>
            ) : (
              <>
                <strong>Live</strong>
                <p>Одоогоор нэвтрүүлэг байхгүй</p>
              </>
            )}
          </Link>
        </div>
      </div>
    </section>
  )
}

export function Home() {
  const { user, reactTo } = useAuth()
  const { data, track } = useStore()
  const news = data.news
  const videos = data.videos
  const rappers = data.rappers
  const rankings = data.rankings

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-media" aria-hidden="true">
          <img
            src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=2000&q=80"
            alt=""
          />
          <div className="hero-shade" />
          <div className="hero-grain" />
          <div className="hero-beam" />
        </div>

        <div className="container hero-content">
          <div className="hero-brand reveal in">
            <img src="/logo.png" alt="" className="hero-logo fx-float" />
            <div className="hero-brand-text">
              <span className="hero-word fx-glitch">Newsac</span>
              <a
                href={YOUTUBE_CHANNEL_URL}
                className="hero-handle"
                target="_blank"
                rel="noreferrer"
              >
                @Newsacchannel
              </a>
            </div>
          </div>

          <h1 className="reveal in reveal-delay-1">
            Монголын <em>хип-хоп</em> зах зээл
          </h1>
          <p className="reveal in reveal-delay-2">
            Мэдээ, шинжилгээ, рэпперийн түүх — нэг дор, халуун.
          </p>

          <div className="hero-cta reveal in reveal-delay-3">
            <Link to="/videos" className="btn btn-primary hero-btn-main fx-press">
              <span className="hero-play" aria-hidden="true">
                ▶
              </span>
              Бичлэг үзэх
            </Link>
            <a
              href={YOUTUBE_CHANNEL_URL}
              className="btn btn-ghost hero-btn-side fx-press"
              target="_blank"
              rel="noreferrer"
            >
              YouTube суваг
            </a>
          </div>
        </div>

        <div className="hero-scroll" aria-hidden="true">
          <span />
          SCROLL
        </div>
      </section>

      <div className="fx-ticker" aria-hidden="true">
        <div className="fx-ticker-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="fx-ticker-copy">
              {rankings.slice(0, 6).map((r) => (
                <span key={`${copy}-${r.id}`}>
                  <i />
                  HOT · {r.name} — {r.track}
                </span>
              ))}
              {data.livestreams.some((l) => l.status === 'live') && (
                <span>
                  <i />
                  LIVE NOW · ШУУД ҮЗЭХ
                </span>
              )}
              <span>
                <i />
                NEWSAC LIVE CULTURE
              </span>
              <span>
                <i />
                @NEWSACCHANNEL
              </span>
            </div>
          ))}
        </div>
      </div>

      <TodayStrip />

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <div>
              <div className="section-kicker">Мэдээ</div>
              <h2 className="section-title">Зах зээлийн халуун сэдэв</h2>
            </div>
            <Link to="/news" className="section-link">
              Бүгдийг үзэх →
            </Link>
          </div>

          <div className="news-feature reveal reveal-delay-1">
            {news.slice(0, 3).map((item, i) => (
              <Link
                key={item.id}
                to={`/news/${item.id}`}
                className={`news-feature-item ${i === 0 ? 'lead' : ''}`}
                onClick={() => track('news_click', item.id)}
              >
                <div className="news-feature-img fx-media">
                  <img src={item.image} alt="" loading="lazy" />
                </div>
                <div className="news-feature-body">
                  <span>
                    {item.category} · {item.readMin} мин
                  </span>
                  <h3>{item.title}</h3>
                  {i === 0 && <p>{item.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <SponsorSlot slot="home" />
          <div className="home-widgets">
            <div className="fx-border">
              <PollWidget />
            </div>
            <div className="fx-border">
              <NewsletterBox />
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head reveal">
            <div>
              <div className="section-kicker">YouTube</div>
              <h2 className="section-title">Шинэ бичлэгүүд</h2>
            </div>
            <a
              href={YOUTUBE_CHANNEL_URL}
              className="section-link"
              target="_blank"
              rel="noreferrer"
            >
              @Newsacchannel →
            </a>
          </div>

          <div className="video-rail reveal reveal-delay-1">
            {videos.slice(0, 3).map((v) => (
              <div key={v.id} className="video-tile">
                <Link to="/videos">
                  <div className="video-thumb fx-media">
                    <img
                      src={`https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`}
                      alt=""
                      loading="lazy"
                    />
                    <span className="video-play">▶</span>
                    {v.duration ? <span className="video-dur">{v.duration}</span> : null}
                  </div>
                  <h3>{v.title}</h3>
                  <p>
                    {v.views} үзэлт · {v.published}
                  </p>
                </Link>
                <div className="react-row">
                  <button
                    type="button"
                    className={user?.reactions[v.id] === 'fire' ? 'on' : ''}
                    onClick={() => {
                      if (!user) {
                        window.location.href = '/auth'
                        return
                      }
                      reactTo(v.id, 'fire')
                    }}
                  >
                    Fire
                  </button>
                  <button
                    type="button"
                    className={user?.reactions[v.id] === 'cold' ? 'on' : ''}
                    onClick={() => {
                      if (!user) {
                        window.location.href = '/auth'
                        return
                      }
                      reactTo(v.id, 'cold')
                    }}
                  >
                    Cold
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <div>
              <div className="section-kicker">Түүх</div>
              <h2 className="section-title">Рэпперүүдийн замнал</h2>
            </div>
            <Link to="/rappers" className="section-link">
              Бүх профил →
            </Link>
          </div>

          <div className="rapper-strip reveal reveal-delay-1">
            {rappers.map((r) => (
              <Link key={r.id} to={`/rappers/${r.id}`} className="rapper-chip">
                <img src={r.image} alt="" loading="lazy" />
                <div>
                  <strong>{r.name}</strong>
                  <span>
                    {r.city} · {r.streams}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container rank-home">
          <div className="reveal">
            <div className="section-kicker">Хэмжүүр</div>
            <h2 className="section-title">Долоо хоногийн рейтинг</h2>
            <p className="rank-note">
              Стрим, сошиал engagement, медиа дурдлагыг нэгтгэсэн Newsac индекс.
            </p>
            <Link to="/rankings" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
              Бүрэн чарт
            </Link>
          </div>

          <ol className="rank-mini reveal reveal-delay-2">
            {rankings.slice(0, 5).map((r, i) => (
              <li key={r.id}>
                <span className="rank-n">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <strong>{r.name}</strong>
                  <em>{r.track}</em>
                </div>
                <span className={`rank-delta ${r.change > 0 ? 'up' : r.change < 0 ? 'down' : ''}`}>
                  {r.change > 0 ? `+${r.change}` : r.change}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head reveal">
            <div>
              <div className="section-kicker">Podcast</div>
              <h2 className="section-title">Сонсоод яваарай</h2>
            </div>
            <Link to="/podcasts" className="section-link">
              Бүх цуврал →
            </Link>
          </div>
          <div className="home-pods reveal reveal-delay-1">
            {data.podcasts.slice(0, 3).map((ep) => (
              <Link key={ep.id} to="/podcasts" className="home-pod-card">
                <img src={ep.cover} alt="" loading="lazy" />
                <div>
                  <span>{ep.duration}</span>
                  <strong>{ep.title}</strong>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <div>
              <div className="section-kicker">Live · Tickets</div>
              <h2 className="section-title">Удахгүй болох тоглолтууд</h2>
            </div>
            <Link to="/tickets" className="section-link">
              Бүх тасалбар →
            </Link>
          </div>
          <div className="home-shows reveal reveal-delay-1">
            {data.shows
              .filter((s) => s.active)
              .slice(0, 3)
              .map((show) => (
                <Link key={show.id} to="/tickets" className="home-show-card">
                  <div className="fx-media">
                    <img src={show.image} alt="" loading="lazy" />
                  </div>
                  <div>
                    <span>
                      {show.date} · {show.city}
                    </span>
                    <strong>{show.title}</strong>
                    <em>{show.artists}</em>
                    <b>
                      {new Intl.NumberFormat('mn-MN').format(show.price)}₮~
                    </b>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container cta-inner reveal">
          <h2>Фэнүүдээ цуглуул. Зах зээлийг мэд.</h2>
          <p>
            Shop, membership, shorts, follow feed — бүгд гар утсан дээрээ.
          </p>
          <div className="hero-cta" style={{ justifyContent: 'center' }}>
            <Link to="/tickets" className="btn btn-primary">
              Тасалбар авах
            </Link>
            <Link to="/shop" className="btn btn-ghost">
              Shop нээх
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
