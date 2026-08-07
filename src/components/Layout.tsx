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
    label: 'Тасалбар',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 8h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4V8Zm4 2v6h2v-6H7Zm4 0v6h2v-6h-2Z" />
      </svg>
    ),
  },
  {
    to: '/shop',
    label: 'Дэлгүүр',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 7h12l-1 13H7L6 7Zm3-3h6l1 3H8l1-3Z" />
      </svg>
    ),
  },
  {
    to: '/live',
    label: 'Шууд',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 5a7 7 0 0 1 7 7v1h2v4h-2.1A7 7 0 0 1 5.1 17H3v-4h2v-1a7 7 0 0 1 7-7Zm0 2a5 5 0 0 0-5 5v1h10v-1a5 5 0 0 0-5-5Zm-1 9.5a1.5 1.5 0 1 0 3 0H11Z" />
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
            end={item.end}
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
