import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './PageQuickActions.css'

type QuickAction = {
  to: string
  label: string
  icon: string
}

const byRoute: { match: (path: string) => boolean; actions: QuickAction[] }[] = [
  {
    match: (p) => p === '/',
    actions: [
      { to: '/news', label: 'Мэдээ', icon: 'N' },
      { to: '/videos', label: 'Бичлэг', icon: '▶' },
      { to: '/nba/updates', label: 'NBA', icon: 'NB' },
      { to: '/deed-lig/updates', label: 'Дээд Лиг', icon: 'ДЛ' },
      { to: '/shop', label: 'Shop', icon: '◈' },
    ],
  },
  {
    match: (p) => p.startsWith('/news'),
    actions: [
      { to: '/videos', label: 'Бичлэг', icon: '▶' },
      { to: '/podcasts', label: 'Podcast', icon: 'P' },
      { to: '/nba/updates', label: 'NBA', icon: 'NB' },
    ],
  },
  {
    match: (p) => p.startsWith('/videos') || p.startsWith('/posts'),
    actions: [
      { to: '/podcasts', label: 'Podcast', icon: 'P' },
      { to: '/news', label: 'Мэдээ', icon: 'N' },
      { to: '/shop', label: 'Shop', icon: '◈' },
    ],
  },
  {
    match: (p) => p.startsWith('/shop') || p.startsWith('/membership'),
    actions: [
      { to: '/tickets', label: 'Тасалбар', icon: 'T' },
      { to: '/shop', label: 'Shop', icon: '◈' },
      { to: '/about', label: 'About', icon: 'ℹ' },
    ],
  },
  {
    match: (p) => p.startsWith('/tickets'),
    actions: [
      { to: '/podcasts', label: 'Podcast', icon: 'P' },
      { to: '/shop', label: 'Shop', icon: '◈' },
      { to: '/news', label: 'Мэдээ', icon: 'N' },
    ],
  },
  {
    match: (p) => p.startsWith('/live'),
    actions: [
      { to: '/videos', label: 'Бичлэг', icon: '▶' },
      { to: '/tickets', label: 'Тасалбар', icon: 'T' },
      { to: '/news', label: 'Мэдээ', icon: 'N' },
    ],
  },
  {
    match: (p) => p.startsWith('/rappers') || p.startsWith('/rankings'),
    actions: [
      { to: '/podcasts', label: 'Podcast', icon: 'P' },
      { to: '/videos', label: 'Бичлэг', icon: '▶' },
      { to: '/nba/updates', label: 'NBA', icon: 'NB' },
    ],
  },
  {
    match: (p) => p.startsWith('/deed-lig'),
    actions: [
      { to: '/deed-lig/updates', label: 'Update', icon: 'U' },
      { to: '/deed-lig/clubs', label: 'Клуб', icon: 'К' },
      { to: '/nba/updates', label: 'NBA', icon: 'NB' },
    ],
  },
  {
    match: (p) => p.startsWith('/nba'),
    actions: [
      { to: '/nba/updates', label: 'Update', icon: 'U' },
      { to: '/nba/quiz', label: 'Quiz', icon: '?' },
      { to: '/nba/mamba', label: 'Mamba', icon: 'M' },
    ],
  },
  {
    match: (p) => p.startsWith('/podcasts') || p.startsWith('/wall'),
    actions: [
      { to: '/podcasts', label: 'Podcast', icon: 'P' },
      { to: '/news', label: 'Мэдээ', icon: 'N' },
      { to: '/shop', label: 'Shop', icon: '◈' },
    ],
  },
  {
    match: (p) => p.startsWith('/profile') || p.startsWith('/auth'),
    actions: [
      { to: '/shop', label: 'Shop', icon: '◈' },
      { to: '/tickets', label: 'Тасалбар', icon: 'T' },
      { to: '/about', label: 'About', icon: 'ℹ' },
    ],
  },
]

const fallback: QuickAction[] = [
  { to: '/news', label: 'Мэдээ', icon: 'N' },
  { to: '/videos', label: 'Бичлэг', icon: '▶' },
  { to: '/podcasts', label: 'Podcast', icon: 'P' },
  { to: '/shop', label: 'Shop', icon: '◈' },
]

const HIDDEN = ['/admin', '/reels', '/shorts']

function actionsFor(path: string) {
  if (HIDDEN.some((h) => path.startsWith(h))) return []
  return byRoute.find((r) => r.match(path))?.actions ?? fallback
}

function buzz() {
  try {
    navigator.vibrate?.(8)
  } catch {
    /* ignore */
  }
}

export function PageQuickActions() {
  const { pathname } = useLocation()
  const actions = actionsFor(pathname)
  const [visible, setVisible] = useState(true)
  const [built, setBuilt] = useState(false)

  useEffect(() => {
    setBuilt(false)
    setVisible(true)
    const id = window.requestAnimationFrame(() => setBuilt(true))
    return () => window.cancelAnimationFrame(id)
  }, [pathname])

  useEffect(() => {
    let lastY = window.scrollY
    let ticking = false

    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        const y = window.scrollY
        const delta = y - lastY
        if (y < 48) setVisible(true)
        else if (delta > 8) setVisible(false)
        else if (delta < -8) setVisible(true)
        lastY = y
        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  if (!actions.length) return null

  return (
    <nav
      className={`page-quick ${built ? 'built' : ''} ${visible ? 'show' : 'hide'}`}
      aria-label="Хуудсын товч холбоос"
    >
      {actions.map((item, i) => (
        <Link
          key={`${pathname}-${item.to}`}
          to={item.to}
          className="page-quick-btn"
          style={{ ['--i' as string]: i }}
          onClick={buzz}
        >
          <span className="page-quick-icon" aria-hidden="true">
            {item.icon}
          </span>
          <strong>{item.label}</strong>
        </Link>
      ))}
    </nav>
  )
}
