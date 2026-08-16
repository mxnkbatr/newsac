import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth, readAuthError, type Gender } from '../context/AuthContext'
import './Pages.css'

export function AuthPage() {
  const { user, loading, profileComplete, login, saveDemographics, signInWithGoogle } = useAuth()
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<Gender | ''>('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(() => readAuthError())
  const [busy, setBusy] = useState(false)

  if (!loading && user && profileComplete) return <Navigate to="/profile" replace />

  function parseDemo() {
    const n = Number(age)
    if (!gender) return { err: 'Хүйсээ сонгоно уу.' as string }
    if (!Number.isFinite(n)) return { err: 'Насаа оруулна уу.' as string }
    return { demo: { age: Math.round(n), gender } }
  }

  async function onGoogle() {
    setBusy(true)
    setError(null)
    const err = await signInWithGoogle()
    setBusy(false)
    if (err) setError(err)
  }

  async function onPasswordLogin(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const err = await login(email, password)
    setBusy(false)
    if (err) setError(err)
  }

  async function onComplete(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const parsed = parseDemo()
    if ('err' in parsed && parsed.err) {
      setError(parsed.err)
      return
    }
    const err = await saveDemographics(parsed.demo!)
    if (err) setError(err)
  }

  const needsComplete = Boolean(user && !profileComplete)

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
        {needsComplete ? (
          <>
            <h1>Профайл гүйцээнэ үү</h1>
            <p className="auth-sub">Нас, хүйсээ оруулаад үргэлжлүүлнэ үү.</p>
            <form onSubmit={onComplete} className="auth-form">
              <label>
                Таны нас
                <input
                  type="number"
                  inputMode="numeric"
                  min={13}
                  max={100}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                  placeholder="Жишээ: 22"
                />
              </label>
              <fieldset className="auth-gender">
                <legend>Таны хүйс</legend>
                <label className={gender === 'male' ? 'active' : ''}>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={gender === 'male'}
                    onChange={() => setGender('male')}
                    required
                  />
                  Эрэгтэй
                </label>
                <label className={gender === 'female' ? 'active' : ''}>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={gender === 'female'}
                    onChange={() => setGender('female')}
                  />
                  Эмэгтэй
                </label>
              </fieldset>
              {error && <p className="auth-error">{error}</p>}
              <button type="submit" className="btn btn-primary btn-block" disabled={busy || loading}>
                Хадгалах
              </button>
            </form>
          </>
        ) : (
          <>
            <h1>Нэвтрэх</h1>
            <p className="auth-sub">Gmail болон нууц үгөөр нэвтэрнэ.</p>

            <form onSubmit={(e) => void onPasswordLogin(e)} className="auth-form">
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
                  autoComplete="current-password"
                />
              </label>
              {error && <p className="auth-error">{error}</p>}
              <button type="submit" className="btn btn-primary btn-block" disabled={busy || loading}>
                {busy ? 'Түр хүлээнэ үү...' : 'Нэвтрэх'}
              </button>
            </form>

            <p className="auth-or">эсвэл</p>

            <button
              type="button"
              className="btn btn-ghost btn-block auth-google"
              disabled={busy || loading}
              onClick={() => void onGoogle()}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M21.6 12.23c0-.74-.07-1.45-.19-2.13H12v4.03h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.23c1.89-1.74 2.99-4.3 2.99-7.42Z"
                />
                <path
                  fill="currentColor"
                  d="M12 22c2.7 0 4.96-.9 6.62-2.35l-3.23-2.5c-.9.6-2.04.96-3.39.96-2.6 0-4.81-1.76-5.6-4.12H3.06v2.58A10 10 0 0 0 12 22Z"
                />
                <path
                  fill="currentColor"
                  d="M6.4 13.99A6 6 0 0 1 6.08 12c0-.69.12-1.36.32-1.99V7.43H3.06A10 10 0 0 0 2 12c0 1.62.39 3.14 1.06 4.57l3.34-2.58Z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.96c1.47 0 2.78.5 3.82 1.5l2.86-2.86C16.95 2.97 14.7 2 12 2 7.94 2 4.44 4.33 3.06 7.43l3.34 2.58C7.19 7.72 9.4 5.96 12 5.96Z"
                />
              </svg>
              {busy ? 'Гүүгл рүү...' : 'Gmail-ээр нэвтрэх'}
            </button>
          </>
        )}

        <Link to="/" className="section-link" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
          ← Нүүр рүү
        </Link>
      </div>
    </div>
  )
}
