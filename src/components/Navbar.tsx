import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

const links = [
  { to: '/news', label: 'Мэдээ' },
  { to: '/videos', label: 'Бичлэг' },
  { to: '/live', label: 'Live' },
  { to: '/wall', label: 'Wall' },
  { to: '/podcasts', label: 'Podcast' },
  { to: '/tickets', label: 'Тасалбар' },
  { to: '/shop', label: 'Shop' },
]

export function Navbar() {
  const { user, logout } = useAuth()

  return (
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
              <button type="button" className="btn btn-ghost nav-btn nav-logout" onClick={logout}>
                Гарах
              </button>
            </>
          ) : (
            <Link to="/auth" className="btn btn-primary nav-btn">
              <span className="nav-cta-full">Бүртгүүлэх</span>
              <span className="nav-cta-short">Нэвтрэх</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
