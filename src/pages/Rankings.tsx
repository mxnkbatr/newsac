import { useCallback, useEffect, useMemo, useState } from 'react'
import { useStore } from '../store/StoreContext'
import { useChartPlayer } from '../context/ChartPlayerContext'
import {
  isOfflineSaved,
  listOfflineMeta,
  removeOfflineEpisode,
  saveOfflineEpisode,
} from '../lib/offlineAudio'
import './Pages.css'
import './Rankings.css'

export function RankingsPage() {
  const { data } = useStore()
  const { current, playing, playSong } = useChartPlayer()
  const hot = data.rankings.filter((r) => r.hot)
  const songs = useMemo(
    () => [...data.chartSongs].sort((a, b) => a.rank - b.rank),
    [data.chartSongs],
  )
  const weekOf = songs[0]?.weekOf
  const [savedTick, setSavedTick] = useState(0)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [note, setNote] = useState<string | null>(null)

  const refreshSaved = useCallback(() => setSavedTick((n) => n + 1), [])
  useEffect(() => {
    void savedTick
    listOfflineMeta()
  }, [savedTick])

  async function download(song: (typeof songs)[0]) {
    setBusyId(song.id)
    setNote(null)
    const result = await saveOfflineEpisode({
      id: song.id,
      title: song.title,
      cover: song.cover,
      duration: song.plays,
      audioUrl: song.audioUrl,
      kind: 'song',
      artist: song.artist,
    })
    refreshSaved()
    setBusyId(null)
    setNote(
      result.blobOk
        ? `"${song.title}" офлайн хадгалагдлаа — интернетгүйгээр сонсоно.`
        : result.error || 'Метадата хадгалагдлаа.',
    )
  }

  async function removeSaved(id: string) {
    await removeOfflineEpisode(id)
    refreshSaved()
  }

  return (
    <div>
      <header className="page-hero">
        <div className="container">
          <div className="section-kicker">Топ · Music</div>
          <h1>Энэ 7 хоногийн Монгол дуунууд</h1>
          <p>
            Апп дотор сонсох · утас унтарсан ч үргэлжилнэ (lock screen) · Татаж аваад офлайн
            тоглуулна.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="section-kicker">Weekly chart</div>
              <h2 className="section-title">Монгол Top {songs.length || 8}</h2>
            </div>
            {weekOf && (
              <span className="chart-week">
                {new Date(weekOf).toLocaleDateString('mn-MN', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            )}
          </div>

          {note && <p className="chart-note-banner">{note}</p>}

          <ol className="chart-list">
            {songs.map((song) => {
              const active = current?.id === song.id
              const offline = isOfflineSaved(song.id)
              return (
                <li key={song.id} className={`chart-row ${active ? 'active' : ''}`}>
                  <span className="chart-rank">{String(song.rank).padStart(2, '0')}</span>
                  <img src={song.cover} alt="" loading="lazy" />
                  <div className="chart-meta">
                    <strong>
                      {song.title}
                      {offline ? ' · OFFLINE' : ''}
                    </strong>
                    <em>{song.artist}</em>
                  </div>
                  <span className="chart-plays">{song.plays}</span>
                  <span
                    className={`rank-delta ${song.change > 0 ? 'up' : song.change < 0 ? 'down' : ''}`}
                  >
                    {song.change > 0
                      ? `▲ ${song.change}`
                      : song.change < 0
                        ? `▼ ${Math.abs(song.change)}`
                        : '—'}
                  </span>
                  <div className="chart-actions">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => void playSong(song)}
                    >
                      {active && playing ? 'Зогсоох' : active ? 'Үргэлжлүүл' : 'Сонсох'}
                    </button>
                    {offline ? (
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => void removeSaved(song.id)}
                      >
                        Устгах
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-ghost"
                        disabled={busyId === song.id}
                        onClick={() => void download(song)}
                      >
                        {busyId === song.id ? 'Татаж...' : 'Офлайн'}
                      </button>
                    )}
                    <a
                      className="btn btn-ghost"
                      href={`https://open.spotify.com/track/${song.spotifyTrackId}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Spotify
                    </a>
                  </div>
                </li>
              )
            })}
          </ol>

          <p className="chart-note">
            Lock screen / notification-оос ▶❚❚ удирдана. «Офлайн» дарж татсаны дараа интернетгүйгээр
            тоглоно.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="section-kicker">Артист индекс</div>
              <h2 className="section-title">Долоо хоногийн чарт</h2>
            </div>
          </div>

          {hot.length > 0 && (
            <div className="hot-strip" style={{ marginBottom: '1.75rem' }}>
              <div className="section-kicker">HOT NOW</div>
              <div className="tag-row">
                {hot.map((r) => (
                  <span key={r.id}>
                    {r.name} · {r.track}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="rank-legend">
            <span>Байр</span>
            <span>Артист / Трек</span>
            <span>Стрим</span>
            <span>Индекс</span>
            <span>Өөрчлөлт</span>
          </div>

          <ol className="rank-table">
            {data.rankings.map((r, i) => (
              <li key={r.id}>
                <span className="rank-pos">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <strong>
                    {r.name}
                    {r.hot ? ' · HOT' : ''}
                  </strong>
                  <em>{r.track}</em>
                </div>
                <span className="rank-streams">{r.streams}</span>
                <div className="rank-bar-wrap">
                  <div className="rank-bar" style={{ width: `${r.score}%` }} />
                  <span>{r.score}</span>
                </div>
                <span className={`rank-delta ${r.change > 0 ? 'up' : r.change < 0 ? 'down' : ''}`}>
                  {r.change > 0 ? `▲ ${r.change}` : r.change < 0 ? `▼ ${Math.abs(r.change)}` : '—'}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  )
}
