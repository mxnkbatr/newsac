import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Pages.css'

export function AuthPage() {
  const { user, login, register } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('register')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (user) return <Navigate to="/profile" replace />

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const err =
      mode === 'register' ? register(name, phone, password) : login(phone, password)
    setError(err)
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
            }}
          >
            Нэвтрэх
          </button>
        </div>

        <h1>{mode === 'register' ? 'Шинэ гишүүн' : 'Дахиад тавтай морил'}</h1>
        <p className="auth-sub">
          Дуртай рэппер хадгалах, бичлэгт реакц өгөх, ranking мэдэгдэл авах.
        </p>

        <form onSubmit={onSubmit} className="auth-form">
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
            Утасны дугаар
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="99112233"
              maxLength={12}
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

          <button type="submit" className="btn btn-primary btn-block">
            {mode === 'register' ? 'Бүртгүүлэх' : 'Нэвтрэх'}
          </button>
        </form>

        <Link to="/" className="section-link" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
          ← Нүүр рүү
        </Link>
      </div>
    </div>
  )
}
