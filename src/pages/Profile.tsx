import { Link, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useStore } from '../store/StoreContext'
import { usePlayer } from '../context/PlayerContext'
import {
  listOfflineMeta,
  removeOfflineEpisode,
  type OfflineMeta,
} from '../lib/offlineAudio'
import './Pages.css'

export function ProfilePage() {
  const { user, logout, isMember, setPushEnabled } = useAuth()
  const { data } = useStore()
  const { playEpisode } = usePlayer()
  const [offline, setOffline] = useState<OfflineMeta[]>(() => listOfflineMeta())

  useEffect(() => {
    setOffline(listOfflineMeta())
  }, [])

  if (!user) return <Navigate to="/auth" replace />

  const favs = data.rappers.filter((r) => user.favorites.includes(r.id))
  const reacted = data.videos.filter((v) => user.reactions[v.id])

  async function enablePush() {
    if (!('Notification' in window)) {
      alert('Энэ төхөөрөмж notification дэмжихгүй.')
      return
    }
    const perm = await Notification.requestPermission()
    if (perm === 'granted') {
      setPushEnabled(true)
      new Notification('Newsac', {
        body: 'Мэдэгдэл идэвхжлээ. Шинэ бичлэг/чарт гарахад мэдэгдэнэ.',
        icon: '/logo.png',
      })
    }
  }

  async function removeSaved(id: string) {
    await removeOfflineEpisode(id)
    setOffline(listOfflineMeta())
  }

  return (
    <div>
      <header className="page-hero">
        <div className="container profile-head">
          <div>
            <div className="section-kicker">Профайл</div>
            <h1>{user.name}</h1>
            <p>
              {user.phone} ·{' '}
              {isMember
                ? `Member · ${new Date(user.membershipUntil!).toLocaleDateString('mn-MN')}`
                : 'Free'}
            </p>
          </div>
          <button type="button" className="btn btn-ghost" onClick={logout}>
            Гарах
          </button>
        </div>
      </header>

      <section className="section">
        <div className="container profile-grid">
          <div>
            <h2 className="section-title" style={{ maxWidth: 'none', marginBottom: '1.25rem' }}>
              Follow рэппер
            </h2>
            {favs.length === 0 ? (
              <p className="empty-note">
                Одоогоор хоосон. <Link to="/rappers">Рэпперүүд</Link> хэсгээс ★ дар.
              </p>
            ) : (
              <ul className="profile-list">
                {favs.map((r) => (
                  <li key={r.id}>
                    <Link to={`/rappers/${r.id}`}>
                      <img src={r.image} alt="" />
                      <span>{r.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/feed" className="section-link" style={{ display: 'inline-block', marginTop: '1rem' }}>
              Миний feed →
            </Link>

            <h2
              className="section-title"
              style={{ maxWidth: 'none', margin: '1.75rem 0 1.25rem' }}
            >
              Офлайн podcast
            </h2>
            {offline.length === 0 ? (
              <p className="empty-note">
                Хоосон. <Link to="/podcasts">Podcast</Link> дээрээс «Татаж авах».
              </p>
            ) : (
              <ul className="profile-list">
                {offline.map((m) => {
                  const ep = data.podcasts.find((p) => p.id === m.id)
                  return (
                    <li key={m.id}>
                      <div className="profile-offline-row">
                        <img src={m.cover} alt="" />
                        <div>
                          <span>{m.title}</span>
                          <em>
                            {m.duration}
                            {!m.blobOk ? ' · метадата' : ''}
                          </em>
                        </div>
                        <div className="profile-offline-actions">
                          {ep && (
                            <button type="button" className="btn btn-ghost" onClick={() => void playEpisode(ep)}>
                              Тоглуулах
                            </button>
                          )}
                          <button type="button" className="btn btn-ghost" onClick={() => void removeSaved(m.id)}>
                            Устгах
                          </button>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div>
            <h2 className="section-title" style={{ maxWidth: 'none', marginBottom: '1.25rem' }}>
              Тохиргоо
            </h2>
            <div className="profile-actions">
              <button type="button" className="btn btn-primary btn-block" onClick={enablePush}>
                {user.pushEnabled ? 'Push идэвхтэй' : 'Push мэдэгдэл асаах'}
              </button>
              <Link to="/membership" className="btn btn-ghost btn-block">
                {isMember ? 'Membership идэвхтэй' : 'Membership авах'}
              </Link>
              <Link to="/wall" className="btn btn-ghost btn-block">
                Community Wall
              </Link>
              <Link to="/shop" className="btn btn-ghost btn-block">
                Shop
              </Link>
            </div>

            <h2
              className="section-title"
              style={{ maxWidth: 'none', margin: '1.75rem 0 1.25rem' }}
            >
              Миний реакц
            </h2>
            {reacted.length === 0 ? (
              <p className="empty-note">
                Бичлэгт Fire/Cold өгөөгүй байна. <Link to="/videos">Бичлэг</Link> рүү ор.
              </p>
            ) : (
              <ul className="profile-list">
                {reacted.map((v) => (
                  <li key={v.id}>
                    <Link to="/videos">
                      <span className="react-badge">
                        {user.reactions[v.id] === 'fire' ? 'FIRE' : 'COLD'}
                      </span>
                      <span>{v.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
