import { Link, Navigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { useStore } from '../store/StoreContext'
import { useChartPlayer } from '../context/ChartPlayerContext'
import type { ChartSong } from '../store/types'
import './Pages.css'
import './Music.css'

type Tab = 'chart' | 'new' | 'artists' | 'search'

function SongRow({
  song,
  active,
  playing,
  onPlay,
  onOpen,
}: {
  song: ChartSong
  active: boolean
  playing: boolean
  onPlay: () => void
  onOpen: () => void
}) {
  return (
    <article className={`music-row ${active ? 'active' : ''}`}>
      <button type="button" className="music-row-main" onClick={onOpen}>
        <span className="music-rank">{String(song.rank).padStart(2, '0')}</span>
        <img src={song.cover} alt="" loading="lazy" />
        <div>
          <strong>
            {song.title}
            {song.isNew ? <i> NEW</i> : null}
          </strong>
          <em>
            {song.artist} · {song.plays}
          </em>
        </div>
      </button>
      <button type="button" className="btn btn-primary music-play" onClick={onPlay}>
        {active && playing ? '❚❚' : '▶'}
      </button>
    </article>
  )
}

export function MusicPage() {
  const { data } = useStore()
  const { current, playing, playSong, openFull } = useChartPlayer()
  const [tab, setTab] = useState<Tab>('chart')
  const [q, setQ] = useState('')
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 860px)').matches : false,
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 860px)')
    const onChange = () => setIsMobile(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const chart = useMemo(
    () => [...data.chartSongs].sort((a, b) => a.rank - b.rank),
    [data.chartSongs],
  )
  const newest = useMemo(
    () =>
      [...data.chartSongs]
        .filter((s) => s.isNew || s.change > 0)
        .sort((a, b) => b.weekOf.localeCompare(a.weekOf) || a.rank - b.rank),
    [data.chartSongs],
  )
  const artists = useMemo(() => {
    const map = new Map<string, { name: string; songs: number; cover: string; plays: string }>()
    for (const s of data.chartSongs) {
      const key = s.artist.split('·')[0].trim()
      const prev = map.get(key)
      if (prev) prev.songs += 1
      else map.set(key, { name: key, songs: 1, cover: s.cover, plays: s.plays })
    }
    return [...map.values()].sort((a, b) => b.songs - a.songs)
  }, [data.chartSongs])

  const searchHits = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return []
    return chart.filter(
      (s) =>
        s.title.toLowerCase().includes(needle) || s.artist.toLowerCase().includes(needle),
    )
  }, [chart, q])

  function play(song: ChartSong) {
    void playSong(song, { openFull: false })
  }

  function open(song: ChartSong) {
    void playSong(song, { openFull: true })
    openFull()
  }

  if (isMobile) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="music-page">
      <header className="page-hero">
        <div className="container">
          <div className="section-kicker">Music</div>
          <h1>Чарт</h1>
          <p>
            Чарт · шинэ · артист · хайлт. Аудио байхгүй бол автоматаар YouTube-ээр
            тоглоно.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="music-tabs">
            {(
              [
                ['chart', 'Чарт'],
                ['new', 'Шинэ'],
                ['artists', 'Артист'],
                ['search', 'Хайлт'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={tab === id ? 'active' : ''}
                onClick={() => setTab(id)}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === 'search' && (
            <label className="music-search">
              <span>Хайх</span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Дуу эсвэл артист..."
                autoFocus
              />
            </label>
          )}

          {tab === 'chart' && (
            <div className="music-list">
              {chart.map((song) => (
                <SongRow
                  key={song.id}
                  song={song}
                  active={current?.id === song.id}
                  playing={playing}
                  onPlay={() => play(song)}
                  onOpen={() => open(song)}
                />
              ))}
            </div>
          )}

          {tab === 'new' && (
            <div className="music-list">
              {newest.length === 0 && <p className="empty-note">Шинэ дуу байхгүй.</p>}
              {newest.map((song) => (
                <SongRow
                  key={song.id}
                  song={song}
                  active={current?.id === song.id}
                  playing={playing}
                  onPlay={() => play(song)}
                  onOpen={() => open(song)}
                />
              ))}
            </div>
          )}

          {tab === 'artists' && (
            <div className="music-artists">
              {artists.map((a) => {
                const rapper = data.rappers.find(
                  (r) =>
                    r.name.toLowerCase() === a.name.toLowerCase() ||
                    a.name.toLowerCase().includes(r.name.toLowerCase()),
                )
                return (
                  <div key={a.name} className="music-artist">
                    <img src={a.cover} alt="" />
                    <div>
                      <strong>{a.name}</strong>
                      <em>
                        {a.songs} дуу · {a.plays}
                      </em>
                    </div>
                    {rapper ? (
                      <Link to={`/rappers/${rapper.id}`} className="btn btn-ghost">
                        Профил
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          const song = chart.find((s) => s.artist.includes(a.name))
                          if (song) open(song)
                        }}
                      >
                        Сонсох
                      </button>
                    )}
                  </div>
                )
              })}
              <Link to="/rappers" className="section-link" style={{ marginTop: '0.5rem' }}>
                Бүх рэппер →
              </Link>
            </div>
          )}

          {tab === 'search' && (
            <div className="music-list">
              {!q.trim() && <p className="empty-note">Дуу / артист бичээд хайна уу.</p>}
              {q.trim() && searchHits.length === 0 && (
                <p className="empty-note">Илэрц олдсонгүй.</p>
              )}
              {searchHits.map((song) => (
                <SongRow
                  key={song.id}
                  song={song}
                  active={current?.id === song.id}
                  playing={playing}
                  onPlay={() => play(song)}
                  onOpen={() => open(song)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
