import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useStore } from '../store/StoreContext'
import { useAuth } from '../context/AuthContext'
import { SponsorSlot } from '../components/Widgets'
import { parseYouTubeId, youtubeEmbedSrc, youtubeThumb } from '../lib/youtube'
import './Pages.css'

export function VideosPage() {
  const { data, track } = useStore()
  const [params] = useSearchParams()
  const paramV = parseYouTubeId(params.get('v') || '') || params.get('v') || ''
  const fromParam = data.videos.find(
    (v) => v.youtubeId === paramV || v.id === params.get('id') || v.id === paramV,
  )
  const [activeId, setActiveId] = useState(fromParam?.id || data.videos[0]?.id)
  const { user, reactTo, isMember } = useAuth()

  useEffect(() => {
    if (fromParam) setActiveId(fromParam.id)
  }, [fromParam])

  useEffect(() => {
    if (!data.videos.find((v) => v.id === activeId) && data.videos[0]) {
      setActiveId(data.videos[0].id)
    }
  }, [data.videos, activeId])

  const current =
    data.videos.find((v) => v.id === activeId) ||
    fromParam ||
    data.videos[0] ||
    (paramV
      ? {
          id: `yt-${paramV}`,
          youtubeId: paramV,
          title: 'YouTube бичлэг',
          description: '',
          views: '',
          duration: '',
          published: '',
        }
      : undefined)
  const embed = useMemo(
    () => (current ? youtubeEmbedSrc(current.youtubeId, { nocookie: true }) : ''),
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
      <section className="section videos-section">
        <div className="container">
          <SponsorSlot slot="videos" />
        </div>
        <div className="container video-page">
          <div className="video-stage">
            <div className="video-frame">
              {locked ? (
                <div className="member-lock">
                  <div className="member-lock-shade" aria-hidden />
                  <p>Early / Member бичлэг</p>
                  <strong className="member-lock-brand">Newsac Originals</strong>
                  <span className="member-lock-soon">Coming soon...</span>
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
                  src={youtubeThumb(v.youtubeId, 'mqdefault')}
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
