import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import { YOUTUBE_CHANNEL_URL, YOUTUBE_HANDLE } from '../data/brand'
import { mambaMentality, nbaYtVideos } from '../data/nba'
import { SponsorSlot } from '../components/Widgets'
import { useStore } from '../store/StoreContext'
import './Pages.css'
import './Nba.css'

const nbaFilters = [
  { to: '/nba', label: 'Нүүр', match: (p: string) => p === '/nba' },
  { to: '/reels', label: 'Reels', match: (p: string) => p.startsWith('/reels') },
  {
    to: '/nba/updates',
    label: 'Мэдээлэл',
    match: (p: string) => p.startsWith('/nba/updates'),
  },
  { to: '/nba/hot', label: 'Hot', match: (p: string) => p.startsWith('/nba/hot') },
  { to: '/nba/mamba', label: 'Mamba', match: (p: string) => p.startsWith('/nba/mamba') },
  {
    to: '/nba/free-agency',
    label: 'Free Agency',
    match: (p: string) => p.startsWith('/nba/free-agency'),
  },
  { to: '/nba/sacfun', label: 'Sacfun', match: (p: string) => p.startsWith('/nba/sacfun') },
  {
    to: '/nba/youtube',
    label: 'YouTube',
    match: (p: string) => p.startsWith('/nba/youtube'),
  },
  { to: '/nba/quiz', label: 'Quiz', match: (p: string) => p.startsWith('/nba/quiz') },
]

function useNbaTitle(title: string) {
  useEffect(() => {
    document.title = `${title} · Newsac`
    return () => {
      document.title = 'Newsac'
    }
  }, [title])
}

function NbaPageFilter({ sticky = false }: { sticky?: boolean }) {
  const { pathname } = useLocation()

  return (
    <nav className={`nba-filter${sticky ? ' sticky' : ''}`} aria-label="NBA хэсэг сонгох">
      <div className="nba-filter-rail">
        {nbaFilters.map((f) => {
          const active = f.match(pathname)
          return (
            <Link
              key={f.to}
              to={f.to}
              className={`nba-filter-chip${active ? ' active' : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              {f.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

function NbaBack() {
  return (
    <Link to="/nba" className="nba-back">
      ← NBA
    </Link>
  )
}

function NbaSubHead({
  kicker,
  title,
  desc,
}: {
  kicker: string
  title: string
  desc: string
}) {
  return (
    <header className="nba-subhero">
      <div className="container">
        <NbaBack />
        <NbaPageFilter sticky />
        <div className="section-kicker">{kicker}</div>
        <h1>{title}</h1>
        <p>{desc}</p>
      </div>
    </header>
  )
}

/** NBA нүүр — цэвэр hub + Reels */
export function NbaPage() {
  useNbaTitle('NBA')
  const { data } = useStore()
  const nbaUpdates = data.nbaUpdates
  const nbaHotNews = data.nbaHotNews
  const freeAgents = data.nbaFreeAgents
  const nbaQuiz = data.nbaQuiz
  const featured = nbaUpdates[0]
  const reels = data.shorts.slice(0, 8)

  return (
    <div className="nba-page">
      <header className="nba-hero">
        <div className="container nba-hero-grid">
          <div>
            <div className="section-kicker">Newsac · Basketball</div>
            <h1>NBA</h1>
            <p>Доорх filter-оос хэсгээ сонгоод орно.</p>
            <NbaPageFilter />
          </div>
          {featured && (
            <Link to={`/nba/updates/${featured.id}`} className="nba-feature">
              <img src={featured.image} alt="" />
              <div className="nba-feature-shade" />
              <div className="nba-feature-copy">
                <span>
                  {featured.tag} · {featured.readMin} мин
                </span>
                <strong>{featured.title}</strong>
                <em>Бүрэн унших →</em>
              </div>
            </Link>
          )}
        </div>
      </header>

      {reels.length > 0 && (
        <section className="nba-section nba-reels-section">
          <div className="container">
            <div className="nba-section-head">
              <div>
                <div className="section-kicker">Reels</div>
                <h2>Босоо бичлэг</h2>
              </div>
              <Link to="/reels" className="section-link">
                Бүгдийг үзэх →
              </Link>
            </div>
            <div className="nba-reels-rail" aria-label="NBA Reels">
              {reels.map((clip) => (
                <Link key={clip.id} to="/reels" className="nba-reel-chip">
                  <span className="nba-reel-thumb">
                    <img
                      src={`https://i.ytimg.com/vi/${clip.youtubeId}/hqdefault.jpg`}
                      alt=""
                      loading="lazy"
                    />
                    <i aria-hidden>▶</i>
                  </span>
                  <strong>{clip.title}</strong>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="nba-section">
        <div className="container">
          <div className="nba-section-head">
            <div>
              <div className="section-kicker">Browse</div>
              <h2>Хэсэг сонгох</h2>
            </div>
            <p>Filter chip дарж солино</p>
          </div>
          <div className="nba-filter-hint">
            <p>
              <Link to="/nba/updates">Мэдээлэл</Link>
              <span>{nbaUpdates.length} нийтлэл</span>
            </p>
            <p>
              <Link to="/nba/hot">Hot</Link>
              <span>{nbaHotNews.length} сэдэв</span>
            </p>
            <p>
              <Link to="/reels">Reels</Link>
              <span>{data.shorts.length} бичлэг</span>
            </p>
            <p>
              <Link to="/nba/quiz">Quiz</Link>
              <span>{nbaQuiz.length} асуулт</span>
            </p>
            <p>
              <Link to="/nba/free-agency">Free Agency</Link>
              <span>{freeAgents.length} нэр</span>
            </p>
            <p>
              <Link to="/nba/mamba">Mamba</Link>
              <span>унших</span>
            </p>
          </div>
          <SponsorSlot slot="nba" alwaysShow />
        </div>
      </section>
    </div>
  )
}

export function NbaUpdatesPage() {
  useNbaTitle('NBA мэдээлэл')
  const { data } = useStore()
  const nbaUpdates = data.nbaUpdates
  return (
    <div className="nba-page">
      <NbaSubHead
        kicker="Updates"
        title="Сүүлийн үеийн мэдээлэл"
        desc="Нийтлэл дээр дарж бүрэн уншина."
      />
      <section className="nba-section">
        <div className="container nba-list">
          {nbaUpdates.map((u) => (
            <Link key={u.id} to={`/nba/updates/${u.id}`} className="nba-list-card">
              <img src={u.image} alt="" loading="lazy" />
              <div>
                <span className="nba-update-tag">
                  {u.tag} · {u.readMin} мин · {u.when}
                </span>
                <h2>{u.title}</h2>
                <p>{u.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export function NbaUpdateDetailPage() {
  const { id } = useParams()
  const { data } = useStore()
  const item = data.nbaUpdates.find((u) => u.id === id)
  useNbaTitle(item?.title || 'NBA')

  if (!item) {
    return <Navigate to="/nba/updates" replace />
  }

  return (
    <div className="nba-page">
      <article className="nba-article">
        <div className="container nba-article-inner">
          <NbaBack />
          <Link to="/nba/updates" className="nba-crumb">
            ← Мэдээлэл
          </Link>
          <div className="nba-article-cover">
            <img src={item.image} alt="" />
          </div>
          <span className="nba-update-tag">
            {item.tag} · {item.readMin} мин · {item.when}
          </span>
          <h1>{item.title}</h1>
          <p className="nba-article-lead">{item.blurb}</p>
          <div className="nba-article-body">
            {item.body.map((p) => (
              <p key={p.slice(0, 28)}>{p}</p>
            ))}
          </div>
          <a
            href={YOUTUBE_CHANNEL_URL}
            className="nba-inline-yt"
            target="_blank"
            rel="noreferrer"
          >
            YouTube дээр үргэлжлүүл → {YOUTUBE_HANDLE}
          </a>
        </div>
      </article>
    </div>
  )
}

export function NbaHotPage() {
  useNbaTitle('Hot news')
  const { data } = useStore()
  const nbaHotNews = data.nbaHotNews
  return (
    <div className="nba-page">
      <NbaSubHead
        kicker="Trending"
        title="Hot news"
        desc="Сэдэв дээр дарж дэлгэрэнгүй уншина."
      />
      <section className="nba-section">
        <div className="container nba-list">
          {nbaHotNews.map((h) => (
            <Link key={h.id} to={`/nba/hot/${h.id}`} className="nba-list-card nba-list-card-plain">
              <span className="nba-hot-rank">{String(h.rank).padStart(2, '0')}</span>
              <div>
                <span className="nba-update-tag">
                  {h.heat} · {h.team} · {h.readMin} мин
                </span>
                <h2>{h.title}</h2>
                <p>{h.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export function NbaHotDetailPage() {
  const { id } = useParams()
  const { data } = useStore()
  const item = data.nbaHotNews.find((h) => h.id === id)
  useNbaTitle(item?.title || 'Hot news')

  if (!item) return <Navigate to="/nba/hot" replace />

  return (
    <div className="nba-page">
      <article className="nba-article">
        <div className="container nba-article-inner">
          <NbaBack />
          <Link to="/nba/hot" className="nba-crumb">
            ← Hot news
          </Link>
          <span className="nba-update-tag">
            #{item.rank} · {item.heat} · {item.team} · {item.readMin} мин
          </span>
          <h1>{item.title}</h1>
          <p className="nba-article-lead">{item.blurb}</p>
          <div className="nba-article-body">
            {item.body.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </div>
      </article>
    </div>
  )
}

export function NbaMambaPage() {
  useNbaTitle('Mamba Mentality')
  return (
    <div className="nba-page">
      <NbaSubHead kicker={mambaMentality.kicker} title={mambaMentality.title} desc="~5 мин унших" />
      <section className="nba-section">
        <div className="container nba-mamba">
          <p className="nba-mamba-lead">{mambaMentality.lead}</p>
          <div className="nba-mamba-story">
            {mambaMentality.story.map((p) => (
              <p key={p.slice(0, 28)}>{p}</p>
            ))}
          </div>
          <div className="nba-mamba-grid">
            {mambaMentality.points.map((pt) => (
              <article key={pt.h} className="nba-mamba-card">
                <h3>{pt.h}</h3>
                <p>{pt.p}</p>
              </article>
            ))}
          </div>
          <blockquote className="nba-quote">{mambaMentality.quote}</blockquote>
          <p className="nba-mamba-take">{mambaMentality.takeaway}</p>
        </div>
      </section>
    </div>
  )
}

export function NbaFreeAgencyPage() {
  useNbaTitle('Free Agency')
  const { data } = useStore()
  const freeAgents = data.nbaFreeAgents
  return (
    <div className="nba-page">
      <NbaSubHead
        kicker="Market"
        title="Top Free Agency"
        desc="Нэр дээр дарж дэлгэрэнгүй үзнэ."
      />
      <section className="nba-section">
        <div className="container nba-list">
          {freeAgents.map((fa) => (
            <Link
              key={fa.id}
              to={`/nba/free-agency/${fa.id}`}
              className="nba-list-card nba-list-card-plain"
            >
              <span className="nba-fa-rank">{String(fa.rank).padStart(2, '0')}</span>
              <div>
                <h2>{fa.name}</h2>
                <div className="nba-fa-meta">
                  <span>{fa.position}</span>
                  <span>{fa.lastTeam}</span>
                  <span>{fa.age} нас</span>
                </div>
                <p>{fa.note}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export function NbaFreeAgencyDetailPage() {
  const { id } = useParams()
  const { data } = useStore()
  const item = data.nbaFreeAgents.find((fa) => fa.id === id)
  useNbaTitle(item?.name || 'Free Agency')

  if (!item) return <Navigate to="/nba/free-agency" replace />

  return (
    <div className="nba-page">
      <article className="nba-article">
        <div className="container nba-article-inner">
          <NbaBack />
          <Link to="/nba/free-agency" className="nba-crumb">
            ← Free Agency
          </Link>
          <span className="nba-update-tag">
            #{item.rank} · {item.position} · {item.age} нас
          </span>
          <h1>{item.name}</h1>
          <p className="nba-article-lead">{item.note}</p>
          <div className="nba-article-body">
            {item.detail.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <p>
              <strong>Best fit:</strong> {item.fit}
            </p>
            <p>
              <strong>Last team:</strong> {item.lastTeam}
            </p>
          </div>
        </div>
      </article>
    </div>
  )
}

export function NbaSacfunPage() {
  useNbaTitle('Sacfun')
  const { data } = useStore()
  const sacfunBits = data.nbaSacfun
  return (
    <div className="nba-page">
      <NbaSubHead kicker="Community" title="Sacfun" desc="Newsac × NBA — fun mode" />
      <section className="nba-section">
        <div className="container nba-sacfun">
          {sacfunBits.map((s) => (
            <article key={s.id} className="nba-sacfun-card">
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export function NbaYoutubePage() {
  useNbaTitle('YouTube')
  return (
    <div className="nba-page">
      <NbaSubHead kicker="Watch" title="YouTube суваг" desc={YOUTUBE_HANDLE} />
      <section className="nba-section nba-yt-section">
        <div className="container">
          <div className="nba-yt-banner">
            <div>
              <h3>Newsac YouTube дээр үргэлжлүүл</h3>
              <p>
                Week-in-review, Free Agency board, Mamba яриа, Sacfun clip. Subscribe хийгээд
                хоцрохгүй байгаарай.
              </p>
              <a
                className="btn btn-primary"
                href={YOUTUBE_CHANNEL_URL}
                target="_blank"
                rel="noreferrer"
              >
                Суваг руу орох · {YOUTUBE_HANDLE}
              </a>
            </div>
            <ul className="nba-yt-list">
              {nbaYtVideos.map((v) => (
                <li key={v.id}>
                  <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noreferrer">
                    <strong>{v.title}</strong>
                    <span>{v.note}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}

export function NbaQuizPage() {
  useNbaTitle('NBA Quiz')
  const { data } = useStore()
  const nbaQuiz = data.nbaQuiz
  const [qi, setQi] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [explain, setExplain] = useState<string | null>(null)

  const question = nbaQuiz[qi]
  const progress = done ? 100 : ((qi + (picked !== null ? 1 : 0)) / nbaQuiz.length) * 100

  function choose(idx: number) {
    if (picked !== null || done) return
    setPicked(idx)
    if (idx === question.answer) setScore((s) => s + 1)
    setExplain(question.explain)
    window.setTimeout(() => {
      if (qi + 1 >= nbaQuiz.length) {
        setDone(true)
        setPicked(null)
        setExplain(null)
      } else {
        setQi((n) => n + 1)
        setPicked(null)
        setExplain(null)
      }
    }, 1100)
  }

  return (
    <div className="nba-page">
      <NbaSubHead
        kicker="Play"
        title="NBA Quiz"
        desc={done ? 'Дууссан' : `${qi + 1} / ${nbaQuiz.length} асуулт`}
      />
      <section className="nba-section">
        <div className="container">
          <div className="nba-quiz">
            <div className="nba-quiz-progress" aria-hidden>
              <i style={{ width: `${progress}%` }} />
            </div>
            {done ? (
              <div className="nba-quiz-result">
                <strong>
                  {score}/{nbaQuiz.length}
                </strong>
                <p>
                  {score === nbaQuiz.length
                    ? 'Mamba mode — төгс!'
                    : score >= 4
                      ? 'Сайн байна. YouTube дээр илүү гүнзгийлээрэй.'
                      : 'Дахин оролдоорой — film session хэрэгтэй.'}
                </p>
                <div className="nba-quiz-result-actions">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setQi(0)
                      setPicked(null)
                      setScore(0)
                      setDone(false)
                      setExplain(null)
                    }}
                  >
                    Дахин эхлэх
                  </button>
                  <a
                    className="btn btn-ghost"
                    href={YOUTUBE_CHANNEL_URL}
                    target="_blank"
                    rel="noreferrer"
                  >
                    YouTube үзэх
                  </a>
                </div>
              </div>
            ) : (
              <>
                <h3>{question.q}</h3>
                <div className="nba-quiz-choices">
                  {question.choices.map((c, idx) => {
                    let cls = ''
                    if (picked !== null) {
                      if (idx === question.answer) cls = 'correct'
                      else if (idx === picked) cls = 'wrong'
                    }
                    return (
                      <button
                        key={c}
                        type="button"
                        className={cls}
                        disabled={picked !== null}
                        onClick={() => choose(idx)}
                      >
                        {c}
                      </button>
                    )
                  })}
                </div>
                {explain && <p className="nba-quiz-explain">{explain}</p>}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
