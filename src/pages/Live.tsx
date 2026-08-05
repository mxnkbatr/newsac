import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store/StoreContext'
import './Pages.css'
import './Live.css'

function formatCountdown(ms: number) {
  if (ms <= 0) return '00:00:00'
  const s = Math.floor(ms / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return [h, m, sec].map((n) => String(n).padStart(2, '0')).join(':')
}

export function LivePage() {
  const { data, track } = useStore()
  const [now, setNow] = useState(Date.now())

  const featured = useMemo(() => {
    const live = data.livestreams.find((l) => l.status === 'live')
    if (live) return live
    const upcoming = [...data.livestreams]
      .filter((l) => l.status === 'upcoming')
      .sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt))[0]
    return upcoming || data.livestreams[0]
  }, [data.livestreams])

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (featured?.status === 'live') track('live_view', featured.id)
  }, [featured?.id, featured?.status, track])

  if (!featured) {
    return (
      <div>
        <header className="page-hero">
          <div className="container">
            <div className="section-kicker">Live</div>
            <h1>Шууд нэвтрүүлэг</h1>
            <p className="empty-note">Одоогоор live байхгүй.</p>
          </div>
        </header>
      </div>
    )
  }

  const starts = +new Date(featured.startsAt)
  const remain = starts - now

  return (
    <div className="live-page">
      <header className="page-hero">
        <div className="container">
          <div className="section-kicker">Live</div>
          <h1>{featured.title}</h1>
          <p>
            {featured.status === 'live'
              ? 'Шууд явагдаж байна — сайт дотроо үз.'
              : featured.status === 'upcoming'
                ? 'Удахгүй эхэлнэ. Мэдэгдэл асаагаад хүлээгээрэй.'
                : 'Энэ нэвтрүүлэг дууссан.'}
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container live-stage">
          {featured.status === 'live' && featured.youtubeId ? (
            <div className="live-embed fx-media">
              <iframe
                title={featured.title}
                src={`https://www.youtube.com/embed/${featured.youtubeId}?autoplay=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <span className="live-badge">LIVE</span>
              {typeof featured.viewers === 'number' && featured.viewers > 0 && (
                <span className="live-viewers">{featured.viewers} үзэгч</span>
              )}
            </div>
          ) : (
            <div className="live-countdown" style={{ backgroundImage: `url(${featured.cover})` }}>
              <div className="live-countdown-shade" />
              <div className="live-countdown-body">
                {featured.status === 'upcoming' ? (
                  <>
                    <span className="live-status-pill">УДАХГҮЙ</span>
                    <strong className="live-clock">{formatCountdown(remain)}</strong>
                    <p>
                      {new Date(featured.startsAt).toLocaleString('mn-MN', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </p>
                    <Link to="/profile" className="btn btn-primary">
                      Мэдэгдэл асаах
                    </Link>
                  </>
                ) : (
                  <>
                    <span className="live-status-pill ended">ДУУССАН</span>
                    <p>Replay / дараагийн live-г хүлээнэ үү.</p>
                    {featured.youtubeId && (
                      <a
                        className="btn btn-ghost"
                        href={`https://www.youtube.com/watch?v=${featured.youtubeId}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        YouTube дээр үзэх
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          <div className="live-list">
            <div className="section-kicker">Бүх нэвтрүүлэг</div>
            <p className="live-artist-cta">
              Артист уу?{' '}
              <Link to="/artist">Artist Hub</Link>-аас өөрийн live нээнэ үү.
            </p>
            {data.livestreams.map((l) => {
              const host = l.artistId
                ? data.rappers.find((r) => r.id === l.artistId)
                : null
              return (
                <article key={l.id} className={`live-row ${l.id === featured.id ? 'on' : ''}`}>
                  <img src={l.cover} alt="" loading="lazy" />
                  <div>
                    <span className={`live-row-status ${l.status}`}>{l.status.toUpperCase()}</span>
                    <strong>{l.title}</strong>
                    {(host || l.hostName) && (
                      <em className="live-host">
                        {host ? host.name : l.hostName}
                        {host?.verified ? ' ✓' : ''}
                      </em>
                    )}
                    <em>
                      {new Date(l.startsAt).toLocaleString('mn-MN', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </em>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
