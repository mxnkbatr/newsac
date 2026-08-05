import { Link } from 'react-router-dom'
import { YOUTUBE_CHANNEL_URL } from '../data/brand'
import { useAuth } from '../context/AuthContext'
import { useStore } from '../store/StoreContext'
import { NewsletterBox, PollWidget, SponsorSlot } from '../components/Widgets'
import type { DailyDrop } from '../store/types'
import { useChartPlayer } from '../context/ChartPlayerContext'
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
    <section className="section today-strip desktop-editorial-only">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="section-kicker">Өнөөдөр</div>
            <h2 className="section-title">Өнөөдөр</h2>
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

function AppCommandCenter() {
  const { user, isMember } = useAuth()
  const { data } = useStore()
  const live = data.livestreams.find((item) => item.status === 'live')
  const topSong = [...data.chartSongs].sort((a, b) => a.rank - b.rank)[0]
  const openBattle = data.battles.find((item) => item.status === 'open')
  const latestDrop = [...data.dailyDrops].sort((a, b) => b.date.localeCompare(a.date))[0]
  const nextShow = [...data.shows]
    .filter((item) => item.active && +new Date(item.date) >= Date.now())
    .sort((a, b) => +new Date(a.date) - +new Date(b.date))[0]
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Өглөөний мэнд' : hour < 18 ? 'Өдрийн мэнд' : 'Оройн мэнд'

  const stories = [
    {
      to: latestDrop ? dropHref(latestDrop) : '/feed',
      label: 'Шинэ',
      image: latestDrop?.image,
      status: 'ШИНЭ',
      tone: 'drop',
    },
    {
      to: '/live',
      label: 'Шууд',
      image: live?.cover,
      status: live ? 'LIVE' : 'УДАХГҮЙ',
      tone: live ? 'live' : 'soon',
    },
    {
      to: '/battle',
      label: 'Battle',
      image: openBattle?.cover,
      status: openBattle ? 'САНАЛ' : 'УДАХГҮЙ',
      tone: 'battle',
    },
    {
      to: '/tickets',
      label: 'Тасалбар',
      image: nextShow?.image,
      status: nextShow
        ? new Date(nextShow.date)
            .toLocaleDateString('mn-MN', { month: 'short', day: 'numeric' })
            .toUpperCase()
        : 'EVENT',
      tone: 'ticket',
    },
  ]

  return (
    <section className="app-command">
      <div className="container">
        <div className="app-command-head">
          <div>
            <span>{greeting}</span>
            <strong>{user?.name || 'Newsac фэн'}</strong>
          </div>
          <Link to={user ? '/profile' : '/auth'} className="app-command-profile">
            <span>{user?.name?.slice(0, 1).toUpperCase() || 'N'}</span>
            <div>
              <strong>{isMember ? 'Fan Pass' : user ? 'Үнэгүй эрх' : 'Нэвтрэх'}</strong>
              <small>{isMember ? 'Идэвхтэй' : 'Профайл'}</small>
            </div>
            <b>›</b>
          </Link>
        </div>

        {topSong && (
          <Link to="/music" className="now-listening desktop-music-only">
            <span className="now-listening-cover">
              <img src={topSong.cover} alt="" />
              <i aria-hidden="true">▶</i>
            </span>
            <span className="now-listening-copy">
              <small>Одоо сонс · Чарт #{topSong.rank}</small>
              <strong>{topSong.title}</strong>
              <em>
                {topSong.artist} · {topSong.plays}
              </em>
            </span>
            <span className="now-listening-wave" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
            <b aria-hidden="true">›</b>
          </Link>
        )}

        <div className="story-rail" aria-label="Newsac шинэ зүйлс">
          {stories.map((story) => (
            <Link
              key={story.label}
              to={story.to}
              className={`story-chip tone-${story.tone}`}
            >
              <span className="story-ring">
                {story.image ? (
                  <img src={story.image} alt="" />
                ) : (
                  <span className="story-fallback">{story.label.slice(0, 1)}</span>
                )}
                <i>{story.status}</i>
              </span>
              <strong>{story.label}</strong>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Home() {
  const { user, reactTo } = useAuth()
  const { data, track } = useStore()
  const { playSong, current: chartCurrent, playing: chartPlaying } = useChartPlayer()
  const news = data.news
  const videos = data.videos
  const rappers = data.rappers
  const rankings = data.rankings
  const topSongs = [...data.chartSongs].sort((a, b) => a.rank - b.rank).slice(0, 5)

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
            <Link to="/live" className="btn btn-ghost hero-btn-side fx-press">
              Шууд үзэх
            </Link>
          </div>
        </div>

        <div className="hero-scroll" aria-hidden="true">
          <span />
          SCROLL
        </div>
      </section>

      <div className="fx-ticker desktop-editorial-only" aria-hidden="true">
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

      <AppCommandCenter />
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

      <section className="section section-alt desktop-editorial-only">
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

      <section className="section section-alt desktop-music-only">
        <div className="container">
          <div className="section-head reveal">
            <div>
              <div className="section-kicker">Spotify · Топ</div>
              <h2 className="section-title">Энэ 7 хоногийн Монгол дуунууд</h2>
            </div>
            <Link to="/rankings" className="section-link">
              Бүтэн чарт →
            </Link>
          </div>

          <ol className="home-chart reveal reveal-delay-1">
            {topSongs.map((song) => {
              const active = chartCurrent?.id === song.id
              return (
                <li key={song.id} className={active ? 'on' : ''}>
                  <span>{String(song.rank).padStart(2, '0')}</span>
                  <img src={song.cover} alt="" loading="lazy" />
                  <div>
                    <strong>{song.title}</strong>
                    <em>
                      {song.artist} · {song.plays}
                    </em>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary desktop-music-only"
                    onClick={() => playSong(song)}
                  >
                    {active && chartPlaying ? '❚❚' : '▶'}
                  </button>
                </li>
              )
            })}
          </ol>
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
