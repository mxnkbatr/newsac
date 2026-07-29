import { Link } from 'react-router-dom'
import { usePlayer } from '../context/PlayerContext'
import './MiniPlayer.css'

function fmt(sec: number) {
  if (!sec || Number.isNaN(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export function MiniPlayer() {
  const { current, playing, progress, duration, toggle, seek, stop } = usePlayer()
  if (!current) return null

  const ratio = duration ? progress / duration : 0

  return (
    <div className="mini-player" role="region" aria-label="Podcast тоглуулагч">
      <button
        type="button"
        className="mini-seek"
        aria-label="Seek"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          seek((e.clientX - rect.left) / rect.width)
        }}
      >
        <i style={{ width: `${ratio * 100}%` }} />
      </button>

      <div className="mini-body">
        <img src={current.cover} alt="" />
        <div className="mini-meta">
          <Link to="/podcasts">{current.title}</Link>
          <span>
            {fmt(progress)} / {current.duration || fmt(duration)}
          </span>
        </div>
        <button type="button" className="mini-btn" onClick={toggle} aria-label="Play pause">
          {playing ? '❚❚' : '▶'}
        </button>
        <button type="button" className="mini-btn ghost" onClick={stop} aria-label="Stop">
          ✕
        </button>
      </div>
    </div>
  )
}
