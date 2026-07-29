import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store/StoreContext'
import { useAuth } from '../context/AuthContext'
import { usePlayer } from '../context/PlayerContext'
import {
  isOfflineSaved,
  listOfflineMeta,
  removeOfflineEpisode,
  saveOfflineEpisode,
  type OfflineMeta,
} from '../lib/offlineAudio'
import './Pages.css'
import './Podcasts.css'

export function PodcastsPage() {
  const { data } = useStore()
  const { isMember } = useAuth()
  const { current, playing, playEpisode } = usePlayer()
  const [saved, setSaved] = useState<OfflineMeta[]>(() => listOfflineMeta())
  const [busyId, setBusyId] = useState<string | null>(null)
  const [note, setNote] = useState<string | null>(null)

  const refresh = useCallback(() => setSaved(listOfflineMeta()), [])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function download(ep: (typeof data.podcasts)[0]) {
    setBusyId(ep.id)
    setNote(null)
    const result = await saveOfflineEpisode(ep)
    refresh()
    setBusyId(null)
    setNote(
      result.blobOk
        ? `"${ep.title}" офлайн хадгалагдлаа.`
        : result.error || 'Метадата хадгалагдлаа.',
    )
  }

  async function remove(id: string) {
    await removeOfflineEpisode(id)
    refresh()
  }

  return (
    <div>
      <header className="page-hero">
        <div className="container">
          <div className="section-kicker">Podcast</div>
          <h1>Newsac Podcast</h1>
          <p>Зах зээлийн яриа, рэппер интервью — сайт дотроо сонсоорой. Офлайн татаж авч болно.</p>
        </div>
      </header>

      <section className="section">
        <div className="container podcast-list">
          {note && <p className="podcast-note">{note}</p>}

          {data.podcasts.map((ep) => {
            const locked = Boolean(ep.membersOnly && !isMember)
            const active = current?.id === ep.id
            const offline = isOfflineSaved(ep.id)
            const meta = saved.find((s) => s.id === ep.id)
            return (
              <article key={ep.id} className={`podcast-card ${active ? 'active' : ''}`}>
                <div className="podcast-cover fx-media">
                  <img src={ep.cover} alt="" loading="lazy" />
                </div>
                <div className="podcast-body">
                  <span>
                    {ep.published} · {ep.duration}
                    {ep.membersOnly ? ' · MEMBER' : ''}
                    {offline ? ' · OFFLINE' : ''}
                  </span>
                  <h2>{ep.title}</h2>
                  <p>{ep.description}</p>
                  {ep.guests && <em>Guests: {ep.guests}</em>}
                  {meta && !meta.blobOk && (
                    <em className="podcast-cors">Метадата л хадгалсан (CORS)</em>
                  )}
                  <div className="podcast-actions">
                    {locked ? (
                      <Link to="/membership" className="btn btn-primary">
                        Member-ээр нээх
                      </Link>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => void playEpisode(ep)}
                        >
                          {active && playing ? 'Түр зогсоох' : active ? 'Үргэлжлүүлэх' : 'Сонсох'}
                        </button>
                        {offline ? (
                          <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => void remove(ep.id)}
                          >
                            Устгах
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-ghost"
                            disabled={busyId === ep.id}
                            onClick={() => void download(ep)}
                          >
                            {busyId === ep.id ? 'Татаж байна...' : 'Татаж авах'}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
