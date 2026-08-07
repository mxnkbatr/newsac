import { useEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

const links = [
  { to: '/news', label: 'Мэдээ' },
  { to: '/videos', label: 'Бичлэг' },
  { to: '/posts', label: 'Posts' },
  { to: '/live', label: 'Live' },
  { to: '/nba', label: 'NBA' },
  { to: '/wall', label: 'Wall' },
  { to: '/podcasts', label: 'Podcast' },
  { to: '/tickets', label: 'Тасалбар' },
  { to: '/shop', label: 'Shop' },
]

const mobileMoreLinks = [
  { to: '/news', label: 'Мэдээ', icon: 'N' },
  { to: '/videos', label: 'Бичлэг', icon: '▶' },
  { to: '/posts', label: 'YT Posts', icon: '✎' },
  { to: '/nba', label: 'NBA', icon: 'NB' },
  { to: '/battle', label: 'Battle', icon: '⚡' },
  { to: '/rappers', label: 'Артистууд', icon: 'A' },
  { to: '/podcasts', label: 'Podcast', icon: 'P' },
  { to: '/reels', label: 'Reels', icon: '▶' },
  { to: '/shorts', label: 'Live Cypher', icon: '⚡' },
  { to: '/wall', label: 'Wall', icon: 'W' },
  { to: '/membership', label: 'Fan Pass', icon: '★' },
  { to: '/artist', label: 'Artist Profile', icon: 'AP' },
  { to: '/about', label: 'Бидний тухай', icon: 'ℹ' },
  { to: '/contact', label: 'Холбоо барих', icon: '@' },
  { to: '/partnership', label: 'Хамтран ажиллах', icon: '🤝' },
  { to: '/advertise', label: 'Сурталчилгаа', icon: '◈' },
]

export function Navbar() {
  const { user, logout } = useAuth()
  const { pathname } = useLocation()
  const [moreOpen, setMoreOpen] = useState(false)

  useEffect(() => setMoreOpen(false), [pathname])

  return (
    <>
      <header className="nav">
        <div className="nav-inner container">
        <Link to="/" className="nav-brand" aria-label="Newsac нүүр">
          <img src="/logo.png" alt="" className="nav-logo" />
          <span className="nav-word">Newsac</span>
        </Link>

        <nav className="nav-links" aria-label="Үндсэн цэс">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <Link to="/profile" className="nav-user">
                <span className="nav-avatar">{user.name.slice(0, 1).toUpperCase()}</span>
                <span className="nav-user-name">{user.name}</span>
              </Link>
              <button
                type="button"
                className="btn btn-ghost nav-btn nav-logout"
                onClick={() => void logout()}
              >
                Гарах
              </button>
            </>
          ) : (
            <Link to="/auth" className="btn btn-primary nav-btn">
              <span className="nav-cta-full">Бүртгүүлэх</span>
              <span className="nav-cta-short">Нэвтрэх</span>
            </Link>
          )}
          <button
            type="button"
            className="nav-more-toggle"
            aria-label="Бусад цэс"
            aria-expanded={moreOpen}
            onClick={() => {
              navigator.vibrate?.(10)
              setMoreOpen((open) => !open)
            }}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
      </header>

      <button
        type="button"
        className={`nav-menu-scrim ${moreOpen ? 'open' : ''}`}
        aria-label="Цэс хаах"
        tabIndex={moreOpen ? 0 : -1}
        onClick={() => setMoreOpen(false)}
      />
      <aside className={`nav-more-panel ${moreOpen ? 'open' : ''}`} aria-hidden={!moreOpen}>
        <div className="nav-more-handle" />
        <div className="nav-more-head">
          <div>
            <span>Newsac</span>
            <strong>Бусад хэсгүүд</strong>
          </div>
          <button type="button" aria-label="Хаах" onClick={() => setMoreOpen(false)}>
            ×
          </button>
        </div>
        <nav className="nav-more-grid" aria-label="Нэмэлт цэс">
          {mobileMoreLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              tabIndex={moreOpen ? 0 : -1}
              onClick={() => setMoreOpen(false)}
            >
              <span>{item.icon}</span>
              <strong>{item.label}</strong>
            </Link>
          ))}
        </nav>
        <p>Developed by Munkhbaatar Dorjsuren</p>
      </aside>
    </>
  )
}
