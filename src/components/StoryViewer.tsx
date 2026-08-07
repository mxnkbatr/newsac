import { useEffect, useRef, useState } from 'react'
import type { IgStoryMedia } from '../lib/instagramStories'
import './StoryViewer.css'

type Props = {
  items: IgStoryMedia[]
  title?: string
  profileUrl?: string
  onClose: () => void
}

const IMAGE_MS = 5500

export function StoryViewer({ items, title, profileUrl, onClose }: Props) {
  const [index, setIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const indexRef = useRef(0)
  const item = items[index]

  useEffect(() => {
    indexRef.current = index
  }, [index])

  function advance(dir: 1 | -1) {
    const i = indexRef.current
    if (dir > 0) {
      if (i >= items.length - 1) {
        onClose()
        return
      }
      setIndex(i + 1)
      return
    }
    if (i <= 0) {
      setProgress(0)
      return
    }
    setIndex(i - 1)
  }

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') advance(1)
      if (e.key === 'ArrowLeft') advance(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose, items.length])

  useEffect(() => {
    setProgress(0)
    if (!item) return

    if (item.mediaType === 'VIDEO') {
      const el = videoRef.current
      if (!el) return
      const onTime = () => {
        if (!el.duration || !Number.isFinite(el.duration)) return
        setProgress(Math.min(1, el.currentTime / el.duration))
      }
      const onEnded = () => advance(1)
      el.addEventListener('timeupdate', onTime)
      el.addEventListener('ended', onEnded)
      void el.play().catch(() => undefined)
      return () => {
        el.removeEventListener('timeupdate', onTime)
        el.removeEventListener('ended', onEnded)
      }
    }

    const started = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / IMAGE_MS)
      setProgress(t)
      if (t >= 1) advance(1)
      else raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [index, item?.id])

  if (!item) return null

  return (
    <div className="ig-story" role="dialog" aria-modal="true" aria-label={title || 'Story'}>
      <div className="ig-story-progress">
        {items.map((s, i) => (
          <span key={s.id} className="ig-story-bar">
            <i
              style={{
                width: i < index ? '100%' : i === index ? `${progress * 100}%` : '0%',
              }}
            />
          </span>
        ))}
      </div>

      <div className="ig-story-top">
        <button type="button" className="ig-story-close" onClick={onClose} aria-label="Хаах">
          ← Буцах
        </button>
        <strong>{title || 'Instagram'}</strong>
        {profileUrl ? (
          <a href={profileUrl} target="_blank" rel="noreferrer" className="ig-story-ext">
            Instagram
          </a>
        ) : (
          <span />
        )}
      </div>

      <div className="ig-story-stage">
        {item.mediaType === 'VIDEO' ? (
          <video
            key={item.id}
            ref={videoRef}
            className="ig-story-media"
            src={item.mediaUrl}
            poster={item.thumbnailUrl}
            playsInline
            autoPlay
            controls={false}
          />
        ) : (
          <img key={item.id} className="ig-story-media" src={item.mediaUrl} alt="" />
        )}
        <button type="button" className="ig-story-hit left" aria-label="Өмнөх" onClick={() => advance(-1)} />
        <button type="button" className="ig-story-hit right" aria-label="Дараах" onClick={() => advance(1)} />
      </div>
    </div>
  )
}
