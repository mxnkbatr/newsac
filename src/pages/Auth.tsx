import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Pages.css'

export function AuthPage() {
  const { user, loading, login, register, signInWithGoogle } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('register')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (!loading && user) return <Navigate to="/profile" replace />

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    setInfo(null)
    const err =
      mode === 'register' ? await register(name, email, password) : await login(email, password)
    setBusy(false)
    if (err?.includes('Баталгаажуулах')) {
      setInfo(err)
      setError(null)
      return
    }
    setError(err)
  }

  async function onGoogle() {
    setBusy(true)
    setError(null)
    const err = await signInWithGoogle()
    setBusy(false)
    if (err) setError(err)
  }

  return (
    <div className="auth-page">
      <div className="auth-visual" aria-hidden="true">
        <img src="/logo.png" alt="" />
        <div>
          <strong>Newsac</strong>
          <p>Хип-хоп зах зээлийн доторх дуу хоолой болоорой.</p>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-tabs">
          <button
            type="button"
            className={mode === 'register' ? 'active' : ''}
            onClick={() => {
              setMode('register')
              setError(null)
              setInfo(null)
            }}
          >
            Бүртгүүлэх
          </button>
          <button
            type="button"
            className={mode === 'login' ? 'active' : ''}
            onClick={() => {
              setMode('login')
              setError(null)
              setInfo(null)
            }}
          >
            Нэвтрэх
          </button>
        </div>

        <h1>{mode === 'register' ? 'Шинэ гишүүн' : 'Дахиад тавтай морил'}</h1>
        <p className="auth-sub">Gmail хаягаар бүртгүүлж, дуртай рэппер хадгал, реакц өг.</p>

        <button
          type="button"
          className="btn btn-ghost btn-block auth-google"
          disabled={busy || loading}
          onClick={() => void onGoogle()}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              fill="#EA4335"
              d="M12 10.2v3.6h5.1c-.2 1.2-.9 2.3-1.9 3l3.1 2.4c1.8-1.7 2.9-4.1 2.9-7 0-.7-.1-1.3-.2-1.9H12z"
            />
            <path
              fill="#34A853"
              d="M6.6 14.3 5.7 15l-2.7 2.1C4.7 20.4 8.1 22.5 12 22.5c2.7 0 5-.9 6.7-2.4l-3.1-2.4c-.9.6-2 1-3.6 1-2.8 0-5.1-1.8-5.9-4.4z"
            />
            <path
              fill="#4A90E2"
              d="M3 7c-.6 1.2-1 2.5-1 4s.4 2.8 1 4l3.6-2.8c-.2-.6-.3-1.2-.3-1.8 0-.6.1-1.2.3-1.8L3 7z"
            />
            <path
              fill="#FBBC05"
              d="M12 5.5c1.5 0 2.8.5 3.8 1.5l2.8-2.8C16.9 2.5 14.7 1.5 12 1.5 8.1 1.5 4.7 3.6 3 7l3.6 2.8C7 7.3 9.2 5.5 12 5.5z"
            />
          </svg>
          Gmail-ээр үргэлжлүүлэх
        </button>

        <div className="auth-or">эсвэл</div>

        <form onSubmit={(e) => void onSubmit(e)} className="auth-form">
          {mode === 'register' && (
            <label>
              Нэр
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Жишээ: Bat"
              />
            </label>
          )}
          <label>
            Gmail
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@gmail.com"
            />
          </label>
          <label>
            Нууц үг
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
            />
          </label>

          {error && <p className="auth-error">{error}</p>}
          {info && <p className="auth-info">{info}</p>}

          <button type="submit" className="btn btn-primary btn-block" disabled={busy || loading}>
            {busy ? 'Түр хүлээнэ үү...' : mode === 'register' ? 'Gmail-ээр бүртгүүлэх' : 'Нэвтрэх'}
          </button>
        </form>

        <Link to="/" className="section-link" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
          ← Нүүр рүү
        </Link>
      </div>
    </div>
  )
}
