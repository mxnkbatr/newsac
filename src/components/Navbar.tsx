import { useEffect, useRef, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

const links = [
  { to: '/news', label: 'Мэдээ' },
  { to: '/videos', label: 'Бичлэг' },
  { to: '/nba', label: 'NBA' },
  { to: '/deed-lig', label: 'Дээд Лиг' },
  { to: '/shop', label: 'Shop' },
]

const mobileMoreLinks = [
  { to: '/news', label: 'Мэдээ', icon: 'N' },
  { to: '/videos', label: 'Бичлэг', icon: '▶' },
  { to: '/nba', label: 'NBA', icon: 'NB' },
  { to: '/deed-lig', label: 'Дээд Лиг', icon: 'ДЛ' },
  { to: '/live', label: 'Live', icon: '●' },
  { to: '/shop', label: 'Shop', icon: '◈' },
  { to: '/tickets', label: 'Тасалбар', icon: 'T' },
  { to: '/about', label: 'Бидний тухай', icon: 'ℹ' },
  { to: '/contact', label: 'Холбоо барих', icon: '@' },
  { to: '/partnership', label: 'Хамтран ажиллах', icon: '↔' },
]

const MENU_INTRO_KEY = 'newsac_menu_intro_v1'

function isMobileNav() {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 860px)').matches
}

function menuIntroSeen() {
  try {
    return localStorage.getItem(MENU_INTRO_KEY) === '1'
  } catch {
    return true
  }
}

function markMenuIntroSeen() {
  try {
    localStorage.setItem(MENU_INTRO_KEY, '1')
  } catch {
    /* ignore */
  }
}

function onboardingDone() {
  // Temporary: onboarding screen is disabled — treat as complete
  return true
}

export function Navbar() {
  const { user, logout } = useAuth()
  const { pathname } = useLocation()
  const [moreOpen, setMoreOpen] = useState(false)
  const [introPulse, setIntroPulse] = useState(false)
  const skipPathClose = useRef(false)

  function closeMore() {
    setMoreOpen(false)
    setIntroPulse(false)
    markMenuIntroSeen()
  }

  function openMenuIntro() {
    if (!isMobileNav() || menuIntroSeen() || !onboardingDone()) return
    skipPathClose.current = true
    setIntroPulse(true)
    setMoreOpen(true)
    markMenuIntroSeen()
    window.setTimeout(() => {
      skipPathClose.current = false
    }, 900)
    window.setTimeout(() => setIntroPulse(false), 2800)
  }

  useEffect(() => {
    if (skipPathClose.current) return
    setMoreOpen(false)
    setIntroPulse(false)
  }, [pathname])

  useEffect(() => {
    // Auto-open menu intro only on home route.
    // Deep links (e.g. /news/:id) should never pop open the menu.
    if (!isMobileNav() || menuIntroSeen() || pathname !== '/') return

    const timers: number[] = []
    let poll = 0

    const scheduleOpen = (delay = 450) => {
      timers.push(
        window.setTimeout(() => {
          openMenuIntro()
        }, delay),
      )
    }

    const startAfterSplash = () => {
      scheduleOpen(document.body.classList.contains('splash-done') ? 400 : 500)
    }

    if (document.body.classList.contains('splash-done')) {
      startAfterSplash()
    } else {
      poll = window.setInterval(() => {
        if (document.body.classList.contains('splash-done')) {
          window.clearInterval(poll)
          startAfterSplash()
        }
      }, 120)
      timers.push(
        window.setTimeout(() => {
          window.clearInterval(poll)
          startAfterSplash()
        }, 2800),
      )
    }

    const onBoardDone = () => scheduleOpen(500)
    window.addEventListener('newsac-onboarding-done', onBoardDone)

    return () => {
      timers.forEach((id) => window.clearTimeout(id))
      window.clearInterval(poll)
      window.removeEventListener('newsac-onboarding-done', onBoardDone)
    }
  }, [pathname])

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
              className={`nav-more-toggle ${introPulse ? 'intro-pulse' : ''}`}
              aria-label="Бусад цэс"
              aria-expanded={moreOpen}
              onClick={() => {
                navigator.vibrate?.(10)
                setMoreOpen((open) => {
                  const next = !open
                  if (!next) markMenuIntroSeen()
                  if (!next) setIntroPulse(false)
                  return next
                })
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
        onClick={closeMore}
      />
      <aside
        className={`nav-more-panel ${moreOpen ? 'open' : ''} ${introPulse ? 'intro' : ''}`}
        aria-hidden={!moreOpen}
      >
        <div className="nav-more-glow" aria-hidden="true" />
        <div className="nav-more-handle" />
        <div className="nav-more-head">
          <div>
            <span>Newsac</span>
            <strong>Бусад хэсгүүд</strong>
          </div>
          <button type="button" aria-label="Хаах" onClick={closeMore}>
            ×
          </button>
        </div>
        <nav className="nav-more-grid" aria-label="Нэмэлт цэс">
          {mobileMoreLinks.map((item, i) => (
            <Link
              key={item.to}
              to={item.to}
              tabIndex={moreOpen ? 0 : -1}
              onClick={closeMore}
              style={{ ['--i' as string]: i }}
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
