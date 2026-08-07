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
import './Profile.css'

function genderLabel(g: string | null | undefined) {
  if (g === 'male') return 'Эрэгтэй'
  if (g === 'female') return 'Эмэгтэй'
  return null
}

function initialOf(name: string) {
  const t = name.trim()
  return (t[0] || '?').toUpperCase()
}

export function ProfilePage() {
  const { user, logout, isMember, membershipTier, setPushEnabled, profileComplete } = useAuth()
  const { data, isEmailAdmin } = useStore()
  const { playEpisode } = usePlayer()
  const [offline, setOffline] = useState<OfflineMeta[]>(() => listOfflineMeta())

  useEffect(() => {
    setOffline(listOfflineMeta())
  }, [])

  if (!user) return <Navigate to="/auth" replace />
  if (!profileComplete) return <Navigate to="/auth" replace />

  const canOpenAdmin = isEmailAdmin(user.email)
  const favs = data.rappers.filter((r) => user.favorites.includes(r.id))
  const reacted = data.videos.filter((v) => user.reactions[v.id])
  const gender = genderLabel(user.gender)
  const memberLabel = isMember
    ? membershipTier === 'artist'
      ? 'Artist Pass'
      : 'Fan Pass'
    : 'Free'
  const memberUntil = isMember && user.membershipUntil
    ? new Date(user.membershipUntil).toLocaleDateString('mn-MN')
    : null
  const joined = user.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString('mn-MN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null

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
    <div className="prof">
      <header className="prof-hero">
        <div className="prof-hero-glow" aria-hidden="true" />
        <div className="prof-avatar" aria-hidden="true">
          <span>{initialOf(user.name)}</span>
        </div>
        <div className="prof-hero-text">
          <p className="prof-kicker">Профайл</p>
          <h1>{user.name}</h1>
          <p className="prof-email">{user.email}</p>
          <div className="prof-chips">
            {user.age ? <span className="prof-chip">{user.age} нас</span> : null}
            {gender ? <span className="prof-chip">{gender}</span> : null}
            <span className={`prof-chip prof-chip-tier ${isMember ? 'on' : ''}`}>
              {memberLabel}
            </span>
          </div>
          {(memberUntil || joined) && (
            <p className="prof-meta">
              {memberUntil ? `Pass хүртэл ${memberUntil}` : null}
              {memberUntil && joined ? ' · ' : null}
              {joined ? `Элссэн ${joined}` : null}
            </p>
          )}
        </div>
      </header>

      <div className="prof-stats" role="group" aria-label="Тойм">
        <div className="prof-stat">
          <strong>{favs.length}</strong>
          <span>Follow</span>
        </div>
        <div className="prof-stat">
          <strong>{reacted.length}</strong>
          <span>Реакц</span>
        </div>
        <div className="prof-stat">
          <strong>{offline.length}</strong>
          <span>Офлайн</span>
        </div>
      </div>

      <section className="prof-block">
        <div className="prof-block-head">
          <h2>Follow рэппер</h2>
          <Link to="/rappers" className="prof-block-link">
            Бүгд
          </Link>
        </div>
        {favs.length === 0 ? (
          <p className="prof-empty">
            Хоосон. <Link to="/rappers">Рэпперүүд</Link> дээрээс ★ дар.
          </p>
        ) : (
          <ul className="prof-follow-rail">
            {favs.map((r) => (
              <li key={r.id}>
                <Link to={`/rappers/${r.id}`} className="prof-follow-item">
                  <img src={r.image} alt="" loading="lazy" />
                  <span>{r.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="prof-block">
        <div className="prof-block-head">
          <h2>Офлайн podcast</h2>
          <Link to="/podcasts" className="prof-block-link">
            Нэмэх
          </Link>
        </div>
        {offline.length === 0 ? (
          <p className="prof-empty">
            Хоосон. <Link to="/podcasts">Podcast</Link> дээрээс татаж ав.
          </p>
        ) : (
          <ul className="prof-rows">
            {offline.map((m) => {
              const ep = data.podcasts.find((p) => p.id === m.id)
              return (
                <li key={m.id} className="prof-row media">
                  <img src={m.cover} alt="" loading="lazy" />
                  <div className="prof-row-body">
                    <strong>{m.title}</strong>
                    <em>
                      {m.duration}
                      {!m.blobOk ? ' · метадата' : ''}
                    </em>
                  </div>
                  <div className="prof-row-actions">
                    {ep && (
                      <button
                        type="button"
                        className="prof-icon-btn"
                        aria-label="Тоглуулах"
                        onClick={() => void playEpisode(ep)}
                      >
                        ▶
                      </button>
                    )}
                    <button
                      type="button"
                      className="prof-icon-btn danger"
                      aria-label="Устгах"
                      onClick={() => void removeSaved(m.id)}
                    >
                      ×
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <section className="prof-block">
        <div className="prof-block-head">
          <h2>Миний реакц</h2>
          <Link to="/videos" className="prof-block-link">
            Бичлэг
          </Link>
        </div>
        {reacted.length === 0 ? (
          <p className="prof-empty">
            Fire / Cold өгөөгүй. <Link to="/videos">Бичлэг</Link> рүү ор.
          </p>
        ) : (
          <ul className="prof-rows">
            {reacted.map((v) => (
              <li key={v.id}>
                <Link to="/videos" className="prof-row media">
                  <span
                    className={`prof-react ${user.reactions[v.id] === 'fire' ? 'fire' : 'cold'}`}
                  >
                    {user.reactions[v.id] === 'fire' ? 'FIRE' : 'COLD'}
                  </span>
                  <div className="prof-row-body">
                    <strong>{v.title}</strong>
                    <em>{v.artist || 'Newsac'}</em>
                  </div>
                  <span className="prof-chevron" aria-hidden="true">
                    ›
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="prof-block">
        <div className="prof-block-head">
          <h2>Тохиргоо</h2>
        </div>
        <ul className="prof-menu">
          <li>
            <button type="button" className="prof-menu-item" onClick={() => void enablePush()}>
              <span className="prof-menu-icon push" aria-hidden="true" />
              <span className="prof-menu-text">
                <strong>Push мэдэгдэл</strong>
                <em>{user.pushEnabled ? 'Идэвхтэй' : 'Асаах'}</em>
              </span>
              <span className={`prof-toggle ${user.pushEnabled ? 'on' : ''}`} aria-hidden="true" />
            </button>
          </li>
          <li>
            <Link to="/membership" className="prof-menu-item">
              <span className="prof-menu-icon pass" aria-hidden="true" />
              <span className="prof-menu-text">
                <strong>Fan Pass</strong>
                <em>{isMember ? 'Идэвхтэй' : 'Авах'}</em>
              </span>
              <span className="prof-chevron" aria-hidden="true">
                ›
              </span>
            </Link>
          </li>
          <li>
            <Link to="/artist" className="prof-menu-item">
              <span className="prof-menu-icon artist" aria-hidden="true" />
              <span className="prof-menu-text">
                <strong>Artist Profile</strong>
                <em>Удахгүй</em>
              </span>
              <span className="prof-chevron" aria-hidden="true">
                ›
              </span>
            </Link>
          </li>
          <li>
            <Link to="/battle" className="prof-menu-item">
              <span className="prof-menu-icon battle" aria-hidden="true" />
              <span className="prof-menu-text">
                <strong>Battle / Cypher</strong>
              </span>
              <span className="prof-chevron" aria-hidden="true">
                ›
              </span>
            </Link>
          </li>
          <li>
            <Link to="/wall" className="prof-menu-item">
              <span className="prof-menu-icon wall" aria-hidden="true" />
              <span className="prof-menu-text">
                <strong>Community Wall</strong>
              </span>
              <span className="prof-chevron" aria-hidden="true">
                ›
              </span>
            </Link>
          </li>
          <li>
            <Link to="/shop" className="prof-menu-item">
              <span className="prof-menu-icon shop" aria-hidden="true" />
              <span className="prof-menu-text">
                <strong>Shop</strong>
              </span>
              <span className="prof-chevron" aria-hidden="true">
                ›
              </span>
            </Link>
          </li>
          {canOpenAdmin && (
            <li>
              <Link to="/admin" className="prof-menu-item">
                <span className="prof-menu-icon admin" aria-hidden="true" />
                <span className="prof-menu-text">
                  <strong>Admin panel</strong>
                </span>
                <span className="prof-chevron" aria-hidden="true">
                  ›
                </span>
              </Link>
            </li>
          )}
        </ul>
      </section>

      <div className="prof-footer">
        <button type="button" className="prof-logout" onClick={() => void logout()}>
          Гарах
        </button>
      </div>
    </div>
  )
}
