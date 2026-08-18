import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth, readAuthError, type Gender } from '../context/AuthContext'
import './Pages.css'

type Tab = 'login' | 'register'

function normalizeError(err: unknown): string {
  if (typeof err === 'string' && err.trim()) return err
  if (err && typeof err === 'object') {
    const maybeMessage = (err as { message?: unknown }).message
    if (typeof maybeMessage === 'string' && maybeMessage.trim()) return maybeMessage
  }
  return 'Алдаа гарлаа. Дахин оролдоно уу.'
}

export function AuthPage() {
  const {
    user,
    loading,
    profileComplete,
    login,
    signUp,
    requestPasswordReset,
    verifyPasswordResetCode,
    verifySignupCode,
    resendSignupCode,
    updatePassword,
    saveDemographics,
    signInWithGoogle,
  } = useAuth()
  const [tab, setTab] = useState<Tab>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [pendingVerifyEmail, setPendingVerifyEmail] = useState<string | null>(null)
  const [recoveryEmail, setRecoveryEmail] = useState<string | null>(null)
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<Gender | ''>('')
  const [error, setError] = useState<string | null>(() => readAuthError())
  const [info, setInfo] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (!loading && user && profileComplete) return <Navigate to="/profile" replace />

  function parseDemo() {
    const n = Number(age)
    if (!gender) return { err: 'Хүйсээ сонгоно уу.' as string }
    if (!Number.isFinite(n) || n < 13 || n > 100) return { err: 'Насаа оруулна уу.' as string }
    return { demo: { age: Math.round(n), gender } }
  }

  async function onGoogle() {
    setBusy(true)
    setError(null)
    setInfo(null)
    let err: unknown = null
    try {
      err = await signInWithGoogle()
    } catch (caught) {
      err = caught
    }
    setBusy(false)
    if (err) setError(normalizeError(err))
  }

  async function onPassword(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    setInfo(null)
    let err: unknown = null
    try {
      if (tab === 'login') {
        err = await login(email, password)
      } else {
        const result = await signUp(email, password)
        if (result.status === 'error') err = result.message
        if (result.status === 'verify') {
          setPendingVerifyEmail(result.email)
          setInfo(`${result.email} рүү 6 оронтой код илгээлээ.`)
        }
      }
    } catch (caught) {
      err = caught
    }
    setBusy(false)
    if (err) setError(normalizeError(err))
  }

  async function onVerifySignupCode() {
    if (!pendingVerifyEmail) return
    setBusy(true)
    setError(null)
    setInfo(null)
    let err: unknown = null
    try {
      err = await verifySignupCode(pendingVerifyEmail, code)
    } catch (caught) {
      err = caught
    }
    setBusy(false)
    if (err) {
      setError(normalizeError(err))
      return
    }
    setInfo('Баталгаажлаа. Одоо үргэлжлүүлнэ үү.')
  }

  async function onResendSignupCode() {
    if (!pendingVerifyEmail) return
    setBusy(true)
    setError(null)
    setInfo(null)
    const err = await resendSignupCode(pendingVerifyEmail)
    setBusy(false)
    if (err) {
      setError(normalizeError(err))
      return
    }
    setInfo('Шинэ код илгээлээ.')
  }

  async function onForgotPassword() {
    if (!email.trim()) {
      setError('Эхлээд Gmail хаягаа оруулна уу.')
      return
    }
    setBusy(true)
    setError(null)
    setInfo(null)
    let err: unknown = null
    try {
      err = await requestPasswordReset(email)
    } catch (caught) {
      err = caught
    }
    setBusy(false)
    if (err) {
      setError(normalizeError(err))
      return
    }
    const targetEmail = email.trim().toLowerCase()
    setRecoveryEmail(targetEmail)
    setInfo(`${targetEmail} рүү 6 оронтой сэргээх код илгээлээ.`)
  }

  async function onResetByCode() {
    if (!recoveryEmail) return
    setBusy(true)
    setError(null)
    setInfo(null)
    let err: unknown = null
    try {
      err = await verifyPasswordResetCode(recoveryEmail, code)
      if (!err) err = await updatePassword(newPassword)
    } catch (caught) {
      err = caught
    }
    setBusy(false)
    if (err) {
      setError(normalizeError(err))
      return
    }
    setInfo('Нууц үг шинэчлэгдлээ. Одоо шинэ нууц үгээр нэвтэрнэ үү.')
    setRecoveryEmail(null)
    setCode('')
    setNewPassword('')
  }

  async function onComplete(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const parsed = parseDemo()
    if ('err' in parsed && parsed.err) {
      setError(parsed.err)
      return
    }
    let err: unknown = null
    try {
      err = await saveDemographics(parsed.demo!)
    } catch (caught) {
      err = caught
    }
    if (err) setError(normalizeError(err))
  }

  const needsComplete = Boolean(user && !profileComplete)

  return (
    <div className="auth-page">
      {/* left brand panel */}
      <div className="auth-visual" aria-hidden="true">
        <img src="/logo.png" alt="" />
        <div>
          <strong>Newsac</strong>
          <p>Хип-хоп зах зээлийн доторх дуу хоолой болоорой.</p>
        </div>
      </div>

      {/* right form panel */}
      <div className="auth-panel">
        {needsComplete ? (
          /* ── profile completion ── */
          <>
            <div className="auth-brand-row">
              <div className="auth-brand-icon">✦</div>
              <span>Newsac</span>
            </div>
            <h1 className="auth-heading">Профайл гүйцээнэ үү</h1>
            <p className="auth-sub">Нас, хүйсээ оруулаад үргэлжлүүлнэ үү.</p>

            <form onSubmit={(e) => void onComplete(e)} className="auth-form">
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
              <button
                type="submit"
                className="btn btn-primary btn-block auth-cta"
                disabled={busy || loading}
              >
                Хадгалах
              </button>
            </form>
          </>
        ) : (
          /* ── login / register ── */
          <>
            <div className="auth-brand-row">
              <div className="auth-brand-icon">✦</div>
              <span>Newsac</span>
            </div>

            <h1 className="auth-heading">
              {tab === 'login' ? 'Нэвтрэх' : 'Бүртгүүлэх'}
            </h1>
            <p className="auth-sub">
              {tab === 'login'
                ? 'Newsac акаунтаараа нэвтэрнэ үү.'
                : 'Шинэ акаунт үүсгэнэ үү.'}
            </p>

            {/* Google button — primary action */}
            <button
              type="button"
              className="auth-google-btn"
              disabled={busy || loading}
              onClick={() => void onGoogle()}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path
                  fill="#EA4335"
                  d="M5.27 12a6.73 6.73 0 0 1 .34-2.11L2.22 7.55A11 11 0 0 0 1 12c0 1.62.36 3.15 1 4.52l3.39-2.36A6.73 6.73 0 0 1 5.27 12Z"
                />
                <path
                  fill="#34A853"
                  d="M12 18.73c-2.09 0-3.94-.85-5.3-2.21l-3.36 2.35C5.15 21.1 8.38 23 12 23c3.5 0 6.64-1.76 8.53-4.45l-3.35-2.59A6.73 6.73 0 0 1 12 18.73Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.27 12c0-.74.13-1.44.34-2.11L2.22 7.55A10.95 10.95 0 0 0 1 12c0 1.62.36 3.15 1 4.52l3.27-2.52Z"
                />
                <path
                  fill="#4285F4"
                  d="M23 12c0-.65-.06-1.29-.17-1.91H12v3.82h6.18a5.25 5.25 0 0 1-2.27 3.44l3.35 2.59C21.39 18.07 23 15.25 23 12Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.27c1.61 0 3.06.56 4.21 1.64L19.07 4A10.96 10.96 0 0 0 12 1C8.38 1 5.15 2.9 3.34 5.82l3.36 2.34A6.73 6.73 0 0 1 12 5.27Z"
                />
              </svg>
              {busy
                ? 'Түр хүлээнэ үү...'
                : tab === 'login'
                  ? 'Gmail-ээр нэвтрэх'
                  : 'Gmail-ээр бүртгүүлэх'}
            </button>

            {/* divider */}
            <div className="auth-divider">
              <span>эсвэл имэйл, нууц үгээр</span>
            </div>

            {/* email + password form */}
            <form onSubmit={(e) => void onPassword(e)} className="auth-form">
              <label>
                Gmail хаяг
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
                  autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                />
              </label>
              {tab === 'login' && (
                <button
                  type="button"
                  className="auth-forgot-btn"
                  onClick={() => void onForgotPassword()}
                  disabled={busy || loading}
                >
                  Нууц үг мартсан уу?
                </button>
              )}
              {tab === 'register' && pendingVerifyEmail && (
                <>
                  <label>
                    Баталгаажуулах код
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      placeholder="123456"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                    />
                  </label>
                  <button
                    type="button"
                    className="btn btn-ghost btn-block auth-cta"
                    onClick={() => void onVerifySignupCode()}
                    disabled={busy || loading}
                  >
                    Код баталгаажуулах
                  </button>
                  <button
                    type="button"
                    className="auth-forgot-btn"
                    onClick={() => void onResendSignupCode()}
                    disabled={busy || loading}
                  >
                    Код дахин илгээх
                  </button>
                </>
              )}
              {tab === 'login' && recoveryEmail && (
                <>
                  <label>
                    Сэргээх код
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      placeholder="123456"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Шинэ нууц үг
                    <input
                      type="password"
                      minLength={6}
                      placeholder="Шинэ нууц үг"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </label>
                  <button
                    type="button"
                    className="btn btn-ghost btn-block auth-cta"
                    onClick={() => void onResetByCode()}
                    disabled={busy || loading}
                  >
                    Кодоор сэргээх
                  </button>
                </>
              )}
              {info && <p className="auth-info">{info}</p>}
              {error && <p className="auth-error">{error}</p>}
              {!(tab === 'register' && pendingVerifyEmail) && (
                <button
                  type="submit"
                  className="btn btn-ghost btn-block auth-cta"
                  disabled={busy || loading}
                >
                  {busy
                    ? 'Түр хүлээнэ үү...'
                    : tab === 'login'
                      ? 'Нэвтрэх'
                      : 'Бүртгүүлэх'}
                </button>
              )}
            </form>

            {/* switch tab */}
            <p className="auth-switch">
              {tab === 'login' ? (
                <>
                  Акаунт байхгүй юу?{' '}
                  <button
                    type="button"
                    className="auth-switch-btn"
                    onClick={() => {
                      setTab('register')
                      setError(null)
                    }}
                  >
                    Бүртгүүлэх
                  </button>
                </>
              ) : (
                <>
                  Бүртгэлтэй юу?{' '}
                  <button
                    type="button"
                    className="auth-switch-btn"
                    onClick={() => {
                      setTab('login')
                      setError(null)
                    }}
                  >
                    Нэвтрэх
                  </button>
                </>
              )}
            </p>
          </>
        )}

        <Link to="/" className="auth-back-link">
          ← Нүүр рүү
        </Link>
      </div>
    </div>
  )
}
