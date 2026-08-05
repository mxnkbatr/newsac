import { useChartPlayer } from '../context/ChartPlayerContext'
import {
  isOfflineSaved,
  removeOfflineEpisode,
  saveOfflineEpisode,
} from '../lib/offlineAudio'
import { useState } from 'react'
import './FullMusicPlayer.css'

function fmt(sec: number) {
  if (!sec || Number.isNaN(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export function FullMusicPlayer() {
  const {
    current,
    playing,
    progress,
    duration,
    playMode,
    fullOpen,
    setPlayMode,
    closeFull,
    toggle,
    seek,
    stop,
    next,
    prev,
  } = useChartPlayer()
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState<string | null>(null)

  if (!fullOpen || !current) return null

  const ratio = duration ? progress / duration : 0
  const offline = isOfflineSaved(current.id)
  const hasYt = Boolean(current.youtubeId)

  async function download() {
    if (!current) return
    setBusy(true)
    setNote(null)
    const result = await saveOfflineEpisode({
      id: current.id,
      title: current.title,
      cover: current.cover,
      duration: current.plays,
      audioUrl: current.audioUrl,
      kind: 'song',
      artist: current.artist,
    })
    setBusy(false)
    setNote(result.blobOk ? 'Офлайн хадгалагдлаа.' : result.error || 'Метадата хадгаллаа.')
  }

  return (
    <div className="full-player" role="dialog" aria-label="Бүтэн player">
      <div className="full-player-top">
        <button type="button" className="full-player-chevron" onClick={closeFull} aria-label="Хаах">
          ˅
        </button>
        <div>
          <span>NOW PLAYING</span>
          <strong>Music</strong>
        </div>
        <button type="button" className="full-player-x" onClick={stop} aria-label="Stop">
          ✕
        </button>
      </div>

      <div className="full-player-stage">
        {playMode === 'youtube' && current.youtubeId ? (
          <div className="full-player-yt">
            <iframe
              title={current.title}
              src={`https://www.youtube.com/embed/${current.youtubeId}?autoplay=1&rel=0`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="full-player-art">
            <img src={current.cover} alt="" />
          </div>
        )}
      </div>

      <div className="full-player-meta">
        <h2>{current.title}</h2>
        <p>{current.artist}</p>
      </div>

      <div className="full-player-modes">
        <button
          type="button"
          className={playMode === 'audio' ? 'active' : ''}
          disabled={!current.audioUrl}
          onClick={() => setPlayMode('audio')}
        >
          Аудио
        </button>
        <button
          type="button"
          className={playMode === 'youtube' ? 'active' : ''}
          disabled={!hasYt}
          onClick={() => setPlayMode('youtube')}
        >
          YouTube
        </button>
      </div>
      {!current.audioUrl && hasYt && (
        <p className="full-player-mode-hint">Энэ дуунд зөвхөн YouTube тоглолт боломжтой.</p>
      )}

      {playMode === 'audio' && (
        <button
          type="button"
          className="full-player-seek"
          aria-label="Seek"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            seek((e.clientX - rect.left) / rect.width)
          }}
        >
          <i style={{ width: `${ratio * 100}%` }} />
        </button>
      )}

      {playMode === 'audio' && (
        <div className="full-player-time">
          <span>{fmt(progress)}</span>
          <span>{fmt(duration)}</span>
        </div>
      )}

      <div className="full-player-controls">
        <button type="button" onClick={prev} aria-label="Өмнөх">
          ‹‹
        </button>
        <button type="button" className="main" onClick={toggle} aria-label="Play pause">
          {playing ? '❚❚' : '▶'}
        </button>
        <button type="button" onClick={next} aria-label="Дараах">
          ››
        </button>
      </div>

      <div className="full-player-extra">
        {current.audioUrl && (offline ? (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => void removeOfflineEpisode(current.id).then(() => setNote('Устгалаа.'))}
          >
            Офлайн устгах
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-ghost"
            disabled={busy}
            onClick={() => void download()}
          >
            {busy ? 'Татаж...' : 'Офлайн татах'}
          </button>
        ))}
        {current.spotifyTrackId && (
          <a
            className="btn btn-ghost"
            href={`https://open.spotify.com/track/${current.spotifyTrackId}`}
            target="_blank"
            rel="noreferrer"
          >
            Spotify
          </a>
        )}
      </div>
      {note && <p className="full-player-note">{note}</p>}
    </div>
  )
}
