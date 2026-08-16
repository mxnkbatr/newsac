import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { MiniPlayer } from './MiniPlayer'
import { ChartMiniPlayer } from './ChartMiniPlayer'
import { FullMusicPlayer } from './FullMusicPlayer'
import { PageQuickActions } from './PageQuickActions'
import { usePlayer } from '../context/PlayerContext'
import { useChartPlayer } from '../context/ChartPlayerContext'
import './Layout.css'
import '../mobile-app.css'

const dock = [
  {
    to: '/news',
    label: 'Мэдээ',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 5h16v14H4V5Zm3 3h10v2H7V8Zm0 4h7v2H7v-2Z" />
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
    to: '/nba',
    label: 'NBA',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 2.2c1.7 1.4 2.8 3.9 2.9 6.8H9.1c.1-2.9 1.2-5.4 2.9-6.8Zm-4.7.9C5.7 7.6 4.5 9.7 4.3 12h3c.1-2.2.8-4.2 1.9-5.9Zm9.4 0c1.1 1.7 1.8 3.7 1.9 5.9h3c-.2-2.3-1.4-4.4-3-5.9ZM7.3 14h-3c.3 2.3 1.5 4.3 3.1 5.7C6.3 18 5.6 16.1 5.4 14h1.9Zm1.8 0h5.8c-.1 2.6-1.1 4.9-2.7 6.3-1.6-1.4-2.6-3.7-2.7-6.3h-.4Zm7.6 0h1.9c-.2 2.1-.9 4-1.9 5.7 1.6-1.4 2.8-3.4 3.1-5.7h-3.1Z" />
      </svg>
    ),
  },
  {
    to: '/deed-lig',
    label: 'Дээд Лиг',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 3.5h12v1.8H6V3.5Zm1.2 3.2h9.6v1.1H7.2V6.7Zm.4 2.4h8.8c0 3.2-1.9 5.8-4.4 6.6-2.5-.8-4.4-3.4-4.4-6.6Zm2.1 1.3v3.4c0 .9.9 1.6 2.3 1.6s2.3-.7 2.3-1.6V10.4H9.7Z" />
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
  const { current } = usePlayer()
  const { current: chartSong } = useChartPlayer()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div
      className={`layout app-shell ${current ? 'has-mini-player' : ''} ${chartSong ? 'has-chart-player' : ''}`}
    >
      <Navbar />
      <main className={`layout-main ${current ? 'has-player' : ''}`} key={pathname}>
        <Outlet />
      </main>
      <Footer />
      <ChartMiniPlayer />
      <FullMusicPlayer />
      <MiniPlayer />
      <PageQuickActions />

      <nav className="mobile-dock" aria-label="Мобайл цэс">
        {dock.map((item, i) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? 'dock-item active' : 'dock-item')}
            style={{ ['--i' as string]: i }}
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
