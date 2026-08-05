import { useChartPlayer } from '../context/ChartPlayerContext'
import './ChartMiniPlayer.css'

function fmt(sec: number) {
  if (!sec || Number.isNaN(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export function ChartMiniPlayer() {
  const { current, playing, progress, duration, toggle, seek, stop, next, prev, openFull } =
    useChartPlayer()
  if (!current) return null

  const ratio = duration ? progress / duration : 0
  const spotifyUrl = `https://open.spotify.com/track/${current.spotifyTrackId}`

  return (
    <div className="chart-mini" role="region" aria-label="Чарт тоглуулагч">
      <button
        type="button"
        className="chart-mini-seek"
        aria-label="Seek"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          seek((e.clientX - rect.left) / rect.width)
        }}
      >
        <i style={{ width: `${ratio * 100}%` }} />
      </button>

      <div className="chart-mini-body">
        <button type="button" className="chart-mini-hit" onClick={openFull}>
          <img src={current.cover} alt="" />
          <div className="chart-mini-meta">
            <strong>
              #{current.rank} · {current.title}
            </strong>
            <span>
              {current.artist} · {fmt(progress)} / {fmt(duration)}
            </span>
          </div>
        </button>
        <button type="button" className="chart-mini-btn" onClick={prev} aria-label="Өмнөх">
          ‹
        </button>
        <button type="button" className="chart-mini-btn" onClick={toggle} aria-label="Play pause">
          {playing ? '❚❚' : '▶'}
        </button>
        <button type="button" className="chart-mini-btn" onClick={next} aria-label="Дараах">
          ›
        </button>
        <a
          className="chart-mini-spotify"
          href={spotifyUrl}
          target="_blank"
          rel="noreferrer"
          title="Spotify дээр нээх"
        >
          Spotify
        </a>
        <button type="button" className="chart-mini-btn ghost" onClick={stop} aria-label="Stop">
          ✕
        </button>
      </div>
    </div>
  )
}
