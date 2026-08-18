import { Link } from 'react-router-dom'
import { YOUTUBE_CHANNEL_URL } from '../data/brand'
import { useAuth } from '../context/AuthContext'
import { useStore } from '../store/StoreContext'
import { NewsletterBox, PollWidget, SponsorSlot } from '../components/Widgets'
import type { DailyDrop } from '../store/types'
import { youtubeThumb } from '../lib/youtube'
import './Home.css'

function formatReaders(count: number) {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
  return String(count)
}

function dropHref(drop: DailyDrop) {
  if (drop.kind === 'video' && (drop.youtubeId || drop.targetId)) {
    const v = drop.youtubeId || drop.targetId
    return `/videos?v=${encodeURIComponent(v)}`
  }
  if (drop.kind === 'short') {
    return drop.youtubeId
      ? `/reels?v=${encodeURIComponent(drop.youtubeId)}`
      : '/reels'
  }
  switch (drop.kind) {
    case 'news':
      return `/news/${drop.targetId}`
    case 'podcast':
      return '/podcasts'
    default:
      return '/'
  }
}

function dropImage(drop: DailyDrop) {
  if (drop.image?.trim()) return drop.image
  if (drop.youtubeId) return youtubeThumb(drop.youtubeId)
  return drop.image
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
                <img src={dropImage(drop)} alt="" loading="lazy" />
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
  const { data, analyticsSummary } = useStore()
  const stories = [...(data.homeStories || [])]
    .filter((s) => s.active)
    .filter((s) => !/reels?/i.test(s.label) && !/reels?/i.test(s.status))
    .filter((s) => !/шууд/i.test(s.label) && !/live/i.test(s.status))
    .sort((a, b) => a.order - b.order)
  const topNews = analyticsSummary().newsClicks[0]
  const viralCount = Math.max(topNews?.clicks || 0, 24)

  return (
    <section className="app-command">
      <div className="container">
        <div className="app-command-head">
          <div>
            <span>Welcome to Newsac</span>
            <strong>Newsac Nation</strong>
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

        <div className="story-rail" aria-label="Newsac шинэ зүйлс">
          <div className="story-chip tone-live story-chip-ig" aria-hidden="true">
            <span className="story-ring">
              <img src="/logo.png" alt="" />
              <i>HOT</i>
            </span>
            <strong>Breaking</strong>
          </div>
          <div className="story-chip tone-ticket" aria-hidden="true">
            <span className="story-ring">
              <img src="/logo.png" alt="" />
              <i>{formatReaders(viralCount * 100)}</i>
            </span>
            <strong>Viral</strong>
          </div>
          {stories.map((story) => {
            const thumb =
              story.image?.trim() ||
              (story.youtubeId ? youtubeThumb(story.youtubeId) : '')
            return (
              <div
                key={story.id}
                className={`story-chip tone-${story.tone || 'default'}`}
                aria-hidden="true"
              >
                <span className="story-ring">
                  {thumb ? (
                    <img src={thumb} alt="" />
                  ) : (
                    <span className="story-fallback">{story.label.slice(0, 1)}</span>
                  )}
                  <i>{story.status}</i>
                </span>
                <strong>{story.label}</strong>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function Home() {
  const { user, reactTo } = useAuth()
  const { data, track, analyticsSummary } = useStore()
  const news = data.news
  const videos = data.videos
  const rappers = data.rappers
  const rankings = data.rankings
  const deedLigNews = data.deedLigNews || []
  const deedLead = deedLigNews[0]
  const topNewsClicks = analyticsSummary().newsClicks.reduce((sum, item) => sum + item.clicks, 0)
  const liveReaders = Math.max(2400, 1800 + topNewsClicks * 14)

  const hotNews = (() => {
    const byId = new Map(news.map((n) => [n.id, n]))
    const picked = (data.homeHotNewsIds || [])
      .map((id) => byId.get(id))
      .filter((n): n is (typeof news)[number] => Boolean(n))
    if (picked.length >= 3) return picked.slice(0, 3)
    const fill = news.filter((n) => !picked.some((p) => p.id === n.id))
    return [...picked, ...fill].slice(0, 3)
  })()

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-media" aria-hidden="true">
          <img
            src="/hero-newsac.jpg"
            alt=""
            fetchPriority="high"
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
          <div className="news-hook reveal in reveal-delay-1">
            <span className="news-hook-dot" aria-hidden="true" />
            <strong>{formatReaders(liveReaders)} хүмүүс уншиж байна</strong>
          </div>
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
              <div className="section-kicker">Entertainment</div>
              <h2 className="section-title">Монгол entertainment · халуун 3</h2>
            </div>
            <Link to="/news" className="section-link">
              Бүгдийг үзэх →
            </Link>
          </div>

          <div className="news-feature reveal reveal-delay-1">
            {hotNews.map((item, i) => (
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
          <div className="section-head reveal">
            <div>
              <div className="section-kicker">Basketball</div>
              <h2 className="section-title">Дээд Лиг</h2>
            </div>
            <Link to="/deed-lig" className="section-link">
              Бүгдийг үзэх →
            </Link>
          </div>
          <Link
            to={deedLead ? `/deed-lig/${deedLead.id}` : '/deed-lig'}
            className="home-deed reveal reveal-delay-1"
          >
            <div>
              <span>Монголын сагсан бөмбөг · тусдаа мэдээ</span>
              <strong>
                {deedLead
                  ? deedLead.title
                  : 'Хасын Хүлэгүүд · SG Эйпс · BCH Найтс · Сэлэнгэ Бодонс'}
              </strong>
              <p>
                {deedLead
                  ? deedLead.blurb
                  : 'Дээд Лигийн мэдээлэл ерөнхий мэдээнээс тусдаа энд гарна.'}
              </p>
            </div>
            <b>Дээд Лиг</b>
          </Link>
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

      <section className="section section-alt">
        <div className="container">
          <div className="home-originals reveal">
            <div className="section-kicker">Series</div>
            <h2 className="section-title">Newsac Originals</h2>
            <p className="home-originals-soon">Coming soon...</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <div>
              <div className="section-kicker">Live · Tickets</div>
              <h2 className="section-title">Tickets Drop Soon</h2>
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
                <Link key={show.id} to="/tickets" className="home-show-card is-locked">
                  <div className="fx-media">
                    <img src={show.image} alt="" loading="lazy" />
                    <span className="home-show-lock" aria-label="Тун удахгүй">
                      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M17 8h-1V6a4 4 0 1 0-8 0v2H7a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2Zm-7-2a2 2 0 1 1 4 0v2h-4V6Zm7 13H7v-9h10v9Zm-5-2a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
                        />
                      </svg>
                    </span>
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
