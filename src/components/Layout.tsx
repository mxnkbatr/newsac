import { NavLink, Outlet, useLocation, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { MiniPlayer } from './MiniPlayer'
import { usePlayer } from '../context/PlayerContext'
import './Layout.css'
import '../mobile-app.css'

const dock = [
  {
    to: '/',
    label: 'Нүүр',
    end: true,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" />
      </svg>
    ),
  },
  {
    to: '/videos',
    label: 'Бичлэг',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 6h12v12H4V6Zm14 2.5 4-2.5v12l-4-2.5V8.5ZM9 9.5v5l4.5-2.5L9 9.5Z" />
      </svg>
    ),
  },
  {
    to: '/tickets',
    label: 'Ticket',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 8h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4V8Zm4 2v6h2v-6H7Zm4 0v6h2v-6h-2Z" />
      </svg>
    ),
  },
  {
    to: '/shop',
    label: 'Shop',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 7h12l-1 13H7L6 7Zm3-3h6l1 3H8l1-3Z" />
      </svg>
    ),
  },
  {
    to: '/wall',
    label: 'Wall',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 5h16v14H4V5Zm2 2v4h5V7H6Zm7 0v4h5V7h-5ZM6 13v4h5v-4H6Zm7 0v4h5v-4h-5Z" />
      </svg>
    ),
  },
]

const moreLinks = [
  { to: '/live', label: 'Live' },
  { to: '/news', label: 'Мэдээ' },
  { to: '/podcasts', label: 'Podcast' },
  { to: '/shorts', label: 'Shorts' },
  { to: '/rappers', label: 'Рэпперүүд' },
  { to: '/rankings', label: 'Топ' },
  { to: '/feed', label: 'Миний feed' },
  { to: '/membership', label: 'Membership' },
  { to: '/profile', label: 'Профайл' },
]

function buzz() {
  try {
    navigator.vibrate?.(10)
  } catch {
    /* ignore */
  }
}

export function Layout() {
  const { pathname } = useLocation()
  const [moreOpen, setMoreOpen] = useState(false)
  const { current } = usePlayer()

  useEffect(() => {
    window.scrollTo(0, 0)
    setMoreOpen(false)
  }, [pathname])

  return (
    <div className={`layout app-shell ${current ? 'has-mini-player' : ''}`}>
      <Navbar />
      <main className={`layout-main ${current ? 'has-player' : ''}`} key={pathname}>
        <Outlet />
      </main>
      <Footer />
      <MiniPlayer />

      <div
        className={`sheet-scrim ${moreOpen ? 'on' : ''}`}
        onClick={() => setMoreOpen(false)}
        aria-hidden={!moreOpen}
      />

      <div className={`app-more ${moreOpen ? 'open' : ''}`}>
        <div className="app-more-panel" role="menu">
          {moreLinks.map((l) => (
            <Link key={l.to} to={l.to} role="menuitem" onClick={() => buzz()}>
              {l.label}
            </Link>
          ))}
        </div>
        <button
          type="button"
          className="app-more-toggle"
          aria-expanded={moreOpen}
          aria-label="Цэс"
          onClick={() => {
            buzz()
            setMoreOpen((v) => !v)
          }}
        >
          {moreOpen ? '×' : '+'}
        </button>
      </div>

      <nav className="mobile-dock" aria-label="Мобайл цэс">
        {dock.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => (isActive ? 'dock-item active' : 'dock-item')}
            onClick={buzz}
          >
            <span className="dock-icon">{item.icon}</span>
            <span className="dock-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
