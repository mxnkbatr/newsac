import { Outlet, useLocation } from 'react-router-dom'
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
    </div>
  )
}
