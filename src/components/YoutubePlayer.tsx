import { useEffect } from 'react'
import { youtubeEmbedSrc, youtubeWatchUrl } from '../lib/youtube'
import './YoutubePlayer.css'

type Props = {
  youtubeId: string
  title?: string
  start?: number
  onClose: () => void
}

/** Fullscreen YouTube overlay — stories / quick play */
export function YoutubePlayer({ youtubeId, title, start = 0, onClose }: Props) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div className="yt-player" role="dialog" aria-modal="true" aria-label={title || 'YouTube'}>
      <div className="yt-player-bar">
        <button type="button" className="yt-player-close" onClick={onClose} aria-label="Хаах">
          ← Буцах
        </button>
        {title ? <strong>{title}</strong> : <span />}
        <a
          href={youtubeWatchUrl(youtubeId)}
          target="_blank"
          rel="noreferrer"
          className="yt-player-ext"
        >
          YouTube
        </a>
      </div>
      <div className="yt-player-frame">
        <iframe
          title={title || 'YouTube'}
          src={youtubeEmbedSrc(youtubeId, { autoplay: true, mute: false, start })}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  )
}
