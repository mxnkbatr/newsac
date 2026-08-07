import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useStore } from '../store/StoreContext'
import { parseYouTubeId, youtubeEmbedSrc, youtubeThumb } from '../lib/youtube'
import './Reels.css'

export function ReelsPage() {
  const { data, track } = useStore()
  const [params] = useSearchParams()
  const paramV = parseYouTubeId(params.get('v') || '') || params.get('v') || ''
  const reels = data.shorts
  const startIndex = Math.max(
    0,
    reels.findIndex((c) => c.youtubeId === paramV || c.id === paramV),
  )
  const [index, setIndex] = useState(startIndex >= 0 ? startIndex : 0)
  const scrollerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (startIndex >= 0) setIndex(startIndex)
  }, [startIndex])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const onScroll = () => {
      const h = el.clientHeight || 1
      const next = Math.round(el.scrollTop / h)
      setIndex(Math.max(0, Math.min(reels.length - 1, next)))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [reels.length])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el || startIndex < 0) return
    el.scrollTo({ top: startIndex * el.clientHeight, behavior: 'auto' })
  }, [startIndex, reels.length])

  useEffect(() => {
    const clip = reels[index]
    if (clip) track('video_click', clip.id)
  }, [index, reels, track])

  function go(delta: number) {
    const next = Math.max(0, Math.min(reels.length - 1, index + delta))
    setIndex(next)
    const el = scrollerRef.current
    if (el) el.scrollTo({ top: next * el.clientHeight, behavior: 'smooth' })
  }

  if (!reels.length) {
    return (
      <div className="reels-empty">
        <div className="container">
          <div className="section-kicker">Reels</div>
          <h1>Reel хоосон</h1>
          <p>Admin → Reels хэсгээс YouTube линк / Shorts нэмнэ үү.</p>
          <Link to="/nba" className="btn btn-ghost">
            ← NBA
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="reels-page">
      <div className="reels-top">
        <Link to="/nba" className="reels-back">
          ← NBA
        </Link>
        <strong>Reels</strong>
        <span>
          {index + 1}/{reels.length}
        </span>
      </div>

      <div className="reels-scroller" ref={scrollerRef}>
        {reels.map((clip, i) => {
          const active = i === index
          const rapper = clip.rapperId
            ? data.rappers.find((r) => r.id === clip.rapperId)
            : null
          return (
            <article key={clip.id} className={`reel-slide ${active ? 'is-on' : ''}`}>
              <div className="reel-stage">
                {active ? (
                  <iframe
                    title={clip.title}
                    src={youtubeEmbedSrc(clip.youtubeId, {
                      autoplay: true,
                      mute: true,
                      start: clip.start || 0,
                    })}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <img src={youtubeThumb(clip.youtubeId)} alt="" loading="lazy" />
                )}
                <div className="reel-shade" />
                <div className="reel-meta">
                  <span>REEL · {i + 1}</span>
                  <h2>{clip.title}</h2>
                  {rapper && <em>{rapper.name}</em>}
                </div>
              </div>
            </article>
          )
        })}
      </div>

      <div className="reels-nav">
        <button type="button" disabled={index <= 0} onClick={() => go(-1)} aria-label="Өмнөх">
          ▲
        </button>
        <button
          type="button"
          disabled={index >= reels.length - 1}
          onClick={() => go(1)}
          aria-label="Дараах"
        >
          ▼
        </button>
      </div>
    </div>
  )
}
