import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store/StoreContext'
import { YOUTUBE_CHANNEL_URL, YOUTUBE_HANDLE } from '../data/brand'
import { useAuth } from '../context/AuthContext'
import { SponsorSlot } from '../components/Widgets'
import './Pages.css'

export function VideosPage() {
  const { data, track } = useStore()
  const [activeId, setActiveId] = useState(data.videos[0]?.id)
  const { user, reactTo, isMember } = useAuth()

  useEffect(() => {
    if (!data.videos.find((v) => v.id === activeId) && data.videos[0]) {
      setActiveId(data.videos[0].id)
    }
  }, [data.videos, activeId])

  const current = data.videos.find((v) => v.id === activeId) || data.videos[0]
  const embed = useMemo(
    () =>
      current
        ? `https://www.youtube-nocookie.com/embed/${current.youtubeId}?rel=0`
        : '',
    [current],
  )

  if (!current) {
    return (
      <div className="page-hero">
        <div className="container">
          <h1>Бичлэг байхгүй</h1>
        </div>
      </div>
    )
  }

  const locked = Boolean(current.membersOnly || current.earlyAccess) && !isMember

  return (
    <div>
      <header className="page-hero">
        <div className="container">
          <div className="section-kicker">YouTube · {YOUTUBE_HANDLE}</div>
          <h1>Бичлэгүүд</h1>
          <p>Зах зээлийн шинжилгээ, тойм, халуун сэдэв — Newsac сувгаас.</p>
          <a
            href={YOUTUBE_CHANNEL_URL}
            className="btn btn-primary"
            target="_blank"
            rel="noreferrer"
            style={{ marginTop: '1.25rem' }}
          >
            Сувагт орох
          </a>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <SponsorSlot slot="videos" />
        </div>
        <div className="container video-page">
          <div className="video-stage">
            <div className="video-frame">
              {locked ? (
                <div className="member-lock">
                  <p>Early / Member бичлэг</p>
                  <Link to="/membership" className="btn btn-primary">
                    Нээх
                  </Link>
                </div>
              ) : (
                <iframe
                  title={current.title}
                  src={embed}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onLoad={() => track('video_click', current.id)}
                />
              )}
            </div>
            <h2>{current.title}</h2>
            <p>{current.description}</p>
            <div className="video-meta-row">
              <span>
                {current.views} үзэлт · {current.published}
              </span>
              <div className="react-row">
                <button
                  type="button"
                  className={user?.reactions[current.id] === 'fire' ? 'on' : ''}
                  onClick={() => (user ? reactTo(current.id, 'fire') : null)}
                >
                  Fire
                </button>
                <button
                  type="button"
                  className={user?.reactions[current.id] === 'cold' ? 'on' : ''}
                  onClick={() => (user ? reactTo(current.id, 'cold') : null)}
                >
                  Cold
                </button>
                {!user && (
                  <Link to="/auth" className="section-link">
                    Реакт өгөхийн тулд нэвтрэх
                  </Link>
                )}
              </div>
            </div>
          </div>

          <aside className="video-side">
            <h3>Дараагийн бичлэг</h3>
            {data.videos.map((v) => (
              <button
                key={v.id}
                type="button"
                className={`video-side-item ${v.id === current.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveId(v.id)
                  track('video_click', v.id)
                }}
              >
                <img
                  src={`https://i.ytimg.com/vi/${v.youtubeId}/mqdefault.jpg`}
                  alt=""
                  loading="lazy"
                />
                <div>
                  <strong>{v.title}</strong>
                  <span>
                    {v.views}
                    {v.duration ? ` · ${v.duration}` : ''}
                    {v.earlyAccess || v.membersOnly ? ' · MEMBER' : ''}
                  </span>
                </div>
              </button>
            ))}
          </aside>
        </div>
      </section>
    </div>
  )
}
