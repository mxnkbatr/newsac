import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import {
  FACEBOOK_PAGE_NAME,
  FACEBOOK_PAGE_URL,
  SACFUN_YOUTUBE_HANDLE,
  SACFUN_YOUTUBE_URL,
} from '../data/brand'
import { SponsorSlot } from '../components/Widgets'
import { ShareButton } from '../components/ShareButton'
import { useStore } from '../store/StoreContext'
import { youtubeEmbedSrc, youtubeThumb } from '../lib/youtube'
import './Pages.css'
import './Nba.css'

const nbaFilters = [
  {
    to: '/nba/updates',
    label: 'Мэдээлэл',
    match: (p: string) => p === '/nba' || p.startsWith('/nba/updates'),
  },
  { to: '/nba/mamba', label: 'Mamba', match: (p: string) => p.startsWith('/nba/mamba') },
  {
    to: '/nba/free-agency',
    label: 'Free Agency',
    match: (p: string) => p.startsWith('/nba/free-agency'),
  },
  { to: '/nba/sacfun', label: 'Sacfun', match: (p: string) => p.startsWith('/nba/sacfun') },
  {
    to: '/nba/facebook',
    label: 'Facebook',
    match: (p: string) => p.startsWith('/nba/facebook'),
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

function playerInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
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
    <Link to="/nba/updates" className="nba-back">
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

/** NBA нүүр — цэвэр hub */
export function NbaPage() {
  useNbaTitle('NBA')
  const { data } = useStore()
  const nbaUpdates = data.nbaUpdates
  const freeAgents = data.nbaFreeAgents
  const nbaQuiz = data.nbaQuiz
  const hub = data.nbaHub
  const featured =
    (hub?.featuredId && nbaUpdates.find((u) => u.id === hub.featuredId)) || nbaUpdates[0]

  return (
    <div className="nba-page">
      <header
        className="nba-hero"
        style={
          hub?.heroImage
            ? ({ '--nba-hero-image': `url("${hub.heroImage}")` } as CSSProperties)
            : undefined
        }
      >
        <div className="container nba-hero-grid">
          <div>
            <div className="section-kicker">{hub?.kicker || 'Newsac · Basketball'}</div>
            <h1>{hub?.title || 'NBA'}</h1>
            <p>{hub?.subtitle || 'Доорх filter-оос хэсгээ сонгоод орно.'}</p>
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
              <Link to="/nba/free-agency">Free Agency</Link>
              <span>{freeAgents.length} нэр</span>
            </p>
            <p>
              <Link to="/nba/quiz">Quiz</Link>
              <span>{nbaQuiz.length} асуулт</span>
            </p>
            <p>
              <Link to="/nba/mamba">Mamba</Link>
              <span>унших</span>
            </p>
            <p>
              <Link to="/nba/sacfun">Sacfun</Link>
              <span>YouTube</span>
            </p>
            <p>
              <Link to="/nba/facebook">Facebook</Link>
              <span>page</span>
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
              <ShareButton
                variant="icon"
                path={`/nba/updates/${u.id}`}
                title={u.title}
                text={u.blurb}
              />
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
          <div className="detail-share">
            <ShareButton
              path={`/nba/updates/${item.id}`}
              title={item.title}
              text={item.blurb}
            />
          </div>
          <p className="nba-article-lead">{item.blurb}</p>
          <div className="nba-article-body">
            {item.body.map((p) => (
              <p key={p.slice(0, 28)}>{p}</p>
            ))}
          </div>
          <a href={FACEBOOK_PAGE_URL} className="nba-inline-yt" target="_blank" rel="noreferrer">
            Facebook page · {FACEBOOK_PAGE_NAME} →
          </a>
        </div>
      </article>
    </div>
  )
}

export function NbaMambaPage() {
  useNbaTitle('Mamba Mentality')
  const { data } = useStore()
  const mamba = data.nbaMamba
  return (
    <div className="nba-page">
      <NbaSubHead kicker={mamba.kicker} title={mamba.title} desc="~6 мин унших" />
      <section className="nba-section">
        <div className="container nba-mamba">
          <p className="nba-mamba-lead">{mamba.lead}</p>
          <div className="nba-mamba-story">
            {mamba.story.map((p) => (
              <p key={p.slice(0, 28)}>{p}</p>
            ))}
          </div>
          <div className="nba-mamba-grid">
            {mamba.points.map((pt) => (
              <article key={pt.h} className="nba-mamba-card">
                <h3>{pt.h}</h3>
                <p>{pt.p}</p>
              </article>
            ))}
          </div>
          <blockquote className="nba-quote">{mamba.quote}</blockquote>
          <p className="nba-mamba-take">{mamba.takeaway}</p>
        </div>
      </section>
    </div>
  )
}

export function NbaFreeAgencyPage() {
  useNbaTitle('Free Agency')
  const { data } = useStore()
  const freeAgents = [...data.nbaFreeAgents].sort((a, b) => a.rank - b.rank)
  return (
    <div className="nba-page">
      <NbaSubHead
        kicker="2026 Market"
        title="Free Agency"
        desc="2026 оны зун — нэр дээр дарж дэлгэрэнгүй уншина. Admin-аас засаж, нэмнэ."
      />
      <section className="nba-section">
        <div className="container nba-list">
          {freeAgents.map((fa) => (
            <Link key={fa.id} to={`/nba/free-agency/${fa.id}`} className="nba-list-card nba-fa-card">
              <span className="nba-fa-thumb">
                {fa.image ? (
                  <img src={fa.image} alt="" />
                ) : (
                  <span className="nba-fa-thumb-fallback">{playerInitials(fa.name)}</span>
                )}
                <span className="nba-fa-rank">{String(fa.rank).padStart(2, '0')}</span>
              </span>
              <div>
                <h2>{fa.name}</h2>
                <div className="nba-fa-meta">
                  <span>{fa.position}</span>
                  <span>
                    {fa.lastTeam}
                    {fa.newTeam && fa.newTeam !== fa.lastTeam ? ` → ${fa.newTeam}` : ''}
                  </span>
                  <span>{fa.age} нас</span>
                  {fa.height ? <span>{fa.height}</span> : null}
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

  const facts = [
    { label: 'Нэр', value: item.name },
    { label: 'Нас', value: item.age ? `${item.age} нас` : '—' },
    { label: 'Өндөр', value: item.height || '—' },
    { label: 'Жин', value: item.weight || '—' },
    { label: 'Байрлал', value: item.position || '—' },
  ]

  return (
    <div className="nba-page">
      <article className="nba-article">
        <div className="container nba-article-inner">
          <NbaBack />
          <Link to="/nba/free-agency" className="nba-crumb">
            ← Free Agency
          </Link>
          <span className="nba-update-tag">#{item.rank}</span>
          <div className="nba-fa-profile">
            <div className="nba-fa-portrait">
              {item.image ? (
                <img src={item.image} alt={item.name} />
              ) : (
                <span className="nba-fa-thumb-fallback">{playerInitials(item.name)}</span>
              )}
            </div>
            <dl className="nba-fa-facts">
              {facts.map((row) => (
                <div key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <p className="nba-article-lead">{item.note}</p>
          <div className="nba-article-body">
            {item.detail.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <p>
              <strong>Өмнөх баг:</strong> {item.lastTeam}
            </p>
            <p>
              <strong>Шинэ баг:</strong> {item.newTeam || item.lastTeam}
            </p>
            <p>
              <strong>Best fit:</strong> {item.fit}
            </p>
          </div>
        </div>
      </article>
    </div>
  )
}

export function NbaSacfunPage() {
  useNbaTitle('Sacfun')
  const { data, syncSacfunYoutube } = useStore()
  const sacfunBits = data.nbaSacfun
  const videos = data.nbaSacfunVideos || []
  const [activeId, setActiveId] = useState(videos[0]?.youtubeId || '')
  const [syncing, setSyncing] = useState(false)
  const triedSync = useRef(false)

  useEffect(() => {
    if (videos.length || triedSync.current) return
    triedSync.current = true
    let cancelled = false
    setSyncing(true)
    void syncSacfunYoutube()
      .catch(() => {
        /* API key missing / offline — page still shows channel link */
      })
      .finally(() => {
        if (!cancelled) setSyncing(false)
      })
    return () => {
      cancelled = true
    }
  }, [videos.length, syncSacfunYoutube])

  useEffect(() => {
    if (!activeId && videos[0]) setActiveId(videos[0].youtubeId)
  }, [activeId, videos])

  const current = videos.find((v) => v.youtubeId === activeId) || videos[0]
  const embed = useMemo(
    () => (current ? youtubeEmbedSrc(current.youtubeId, { nocookie: true }) : ''),
    [current],
  )

  return (
    <div className="nba-page">
      <NbaSubHead
        kicker="Community"
        title="Sacfun"
        desc={`YouTube ${SACFUN_YOUTUBE_HANDLE} · fun mode`}
      />
      <section className="nba-section nba-yt-section">
        <div className="container">
          <div className="nba-yt-banner">
            <div>
              <h3>Sacfun YouTube</h3>
              <p>
                Clip of the week, reaction, highlight. Суваг дээр subscribe хийгээд эндээс шууд
                үзээрэй.
              </p>
              <a className="btn btn-primary" href={SACFUN_YOUTUBE_URL} target="_blank" rel="noreferrer">
                Суваг нээх · {SACFUN_YOUTUBE_HANDLE}
              </a>
            </div>
          </div>

          {current && embed ? (
            <div className="nba-sacfun-player">
              <div className="video-frame">
                <iframe
                  src={embed}
                  title={current.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <h2>{current.title}</h2>
              {current.published ? <p>{current.published}</p> : null}
            </div>
          ) : (
            <p className="nba-sacfun-empty">
              {syncing
                ? 'Бичлэг татаж байна…'
                : 'Одоогоор бичлэг алга. Суваг руу ороод үзэх эсвэл Admin-аас YouTube ID нэмнэ үү.'}
            </p>
          )}

          {videos.length > 1 ? (
            <div className="nba-sacfun-vids" aria-label="Sacfun бичлэгүүд">
              {videos.map((clip) => (
                <button
                  key={clip.id}
                  type="button"
                  className={`nba-sacfun-vid${clip.youtubeId === current?.youtubeId ? ' active' : ''}`}
                  onClick={() => setActiveId(clip.youtubeId)}
                >
                  <img src={youtubeThumb(clip.youtubeId)} alt="" loading="lazy" />
                  <strong>{clip.title}</strong>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </section>
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

export function NbaFacebookPage() {
  useNbaTitle('Facebook')
  return (
    <div className="nba-page">
      <NbaSubHead kicker="Follow" title="Facebook page" desc={FACEBOOK_PAGE_URL} />
      <section className="nba-section nba-yt-section">
        <div className="container">
          <div className="nba-yt-banner">
            <div>
              <h3>Newsac Facebook</h3>
              <p>
                NBA мэдээлэл, Sacfun clip, community take — Newsac page дээр үргэлжлүүлнэ. Like
                хийгээд хоцрохгүй байгаарай.
              </p>
              <a className="btn btn-primary" href={FACEBOOK_PAGE_URL} target="_blank" rel="noreferrer">
                Page нээх · {FACEBOOK_PAGE_NAME}
              </a>
            </div>
            <ul className="nba-yt-list">
              <li>
                <a href={FACEBOOK_PAGE_URL} target="_blank" rel="noreferrer">
                  <strong>Newsac page</strong>
                  <span>facebook.com/YoutuberNewSac</span>
                </a>
              </li>
              <li>
                <Link to="/nba/updates">
                  <strong>NBA мэдээлэл</strong>
                  <span>Сүүлийн нийтлэлүүдийг энд уншина</span>
                </Link>
              </li>
              <li>
                <Link to="/nba/sacfun">
                  <strong>Sacfun бичлэг</strong>
                  <span>{SACFUN_YOUTUBE_HANDLE}</span>
                </Link>
              </li>
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
  const progress =
    !nbaQuiz.length || done ? 100 : ((qi + (picked !== null ? 1 : 0)) / nbaQuiz.length) * 100

  function choose(idx: number) {
    if (!question || picked !== null || done) return
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
        desc={done ? 'Дууссан' : `${Math.min(qi + 1, nbaQuiz.length)} / ${nbaQuiz.length} асуулт`}
      />
      <section className="nba-section">
        <div className="container">
          <div className="nba-quiz">
            <div className="nba-quiz-progress" aria-hidden>
              <i style={{ width: `${progress}%` }} />
            </div>
            {!nbaQuiz.length ? (
              <p>Асуулт байхгүй.</p>
            ) : done ? (
              <div className="nba-quiz-result">
                <strong>
                  {score}/{nbaQuiz.length}
                </strong>
                <p>
                  {score === nbaQuiz.length
                    ? 'Mamba mode — төгс!'
                    : score >= Math.ceil(nbaQuiz.length * 0.7)
                      ? 'Сайн байна. Мэдээлэл болон Free Agency-г дахин уншаарай.'
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
                  <Link className="btn btn-ghost" to="/nba/facebook">
                    Facebook page
                  </Link>
                </div>
              </div>
            ) : question ? (
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
            ) : null}
          </div>
        </div>
      </section>
    </div>
  )
}
