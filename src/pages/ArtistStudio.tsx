import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useStore } from '../store/StoreContext'
import './Pages.css'
import './ArtistStudio.css'

export function ArtistStudioPage() {
  const { user } = useAuth()
  const store = useStore()
  const [title, setTitle] = useState('')
  const [youtubeId, setYoutubeId] = useState('')
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    store.claimRapperForUser(user.id, user.email)
  }, [user?.id, user?.email])

  const artist = useMemo(() => {
    if (!user) return null
    return (
      store.data.rappers.find(
        (r) =>
          r.ownerUserId === user.id ||
          (r.ownerEmail && r.ownerEmail === user.email.toLowerCase()),
      ) || null
    )
  }, [store.data.rappers, user])

  const myLives = useMemo(() => {
    if (!artist) return []
    return store.data.livestreams.filter((l) => l.artistId === artist.id)
  }, [artist, store.data.livestreams])

  const activeLive = myLives.find((l) => l.status === 'live')

  if (!user) {
    return (
      <div className="page-hero">
        <div className="container">
          <div className="section-kicker">Artist Hub</div>
          <h1>Артист студио</h1>
          <p>Live нээхийн тулд Gmail-ээр нэвтэрнэ үү.</p>
          <Link to="/auth" className="btn btn-primary" style={{ marginTop: '1.25rem' }}>
            Нэвтрэх
          </Link>
        </div>
      </div>
    )
  }

  if (!artist) {
    return (
      <div className="page-hero">
        <div className="container">
          <div className="section-kicker">Artist Hub</div>
          <h1>Профайл холбогдоогүй</h1>
          <p>
            Админ таны Gmail-ийг артисттай холбосны дараа энд live нээх, Hub удирдах
            боломжтой. Одоо: <strong>{user.email}</strong>
          </p>
          <div className="artist-studio-actions">
            <Link to="/rappers" className="btn btn-ghost">
              Артистууд
            </Link>
            <Link to="/live" className="btn btn-primary">
              Live үзэх
            </Link>
          </div>
        </div>
      </div>
    )
  }

  function onGoLive(e: FormEvent) {
    e.preventDefault()
    if (!user || !artist) return
    const res = store.goLiveAsArtist({
      artistId: artist.id,
      hostUserId: user.id,
      hostName: user.name,
      title: title || `${artist.name} LIVE`,
      youtubeId,
      cover: artist.image,
    })
    if (typeof res === 'string') {
      setMsg(res)
      return
    }
    setMsg('Live нээгдлээ — /live хуудсанд харагдана.')
    setTitle('')
    setYoutubeId('')
  }

  return (
    <div className="artist-studio">
      <header className="page-hero artist-studio-hero">
        <div className="container">
          <div className="section-kicker">Artist Hub</div>
          <h1>
            {artist.name}
            {artist.verified ? <span className="verified-mark">✓</span> : null}
          </h1>
          <p>Kick шиг өөрийн аккаунтаараа live нээ · фэнүүд Newsac дотроо үзнэ.</p>
          <div className="artist-studio-actions">
            <Link to={`/rappers/${artist.id}`} className="btn btn-ghost">
              Нийтийн профайл
            </Link>
            <Link to="/live" className="btn btn-primary">
              Live хуудас
            </Link>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container artist-studio-grid">
          <form className="artist-live-form" onSubmit={onGoLive}>
            <h2>Go Live</h2>
            <p>YouTube Live эсвэл Premiere-ийн URL / video ID оруулна уу.</p>
            <label>
              Гарчиг
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`${artist.name} · midnight session`}
              />
            </label>
            <label>
              YouTube URL / ID
              <input
                value={youtubeId}
                onChange={(e) => setYoutubeId(e.target.value)}
                placeholder="https://youtube.com/live/..."
                required
              />
            </label>
            <button type="submit" className="btn btn-primary" disabled={Boolean(activeLive)}>
              {activeLive ? 'Аль хэдийн LIVE' : 'Шууд нээх'}
            </button>
            {activeLive && (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  store.endArtistLive(activeLive.id)
                  setMsg('Live дууслаа.')
                }}
              >
                Live дуусгах
              </button>
            )}
            {msg && <p className="checkout-result">{msg}</p>}
          </form>

          <div className="artist-live-list">
            <h2>Миний стримүүд</h2>
            {myLives.length === 0 && <p className="empty-note">Одоогоор стрим байхгүй.</p>}
            <ul>
              {myLives.map((l) => (
                <li key={l.id}>
                  <strong>{l.title}</strong>
                  <span className={`live-pill status-${l.status}`}>{l.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
