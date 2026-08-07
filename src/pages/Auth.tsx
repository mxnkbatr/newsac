import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth, type Gender } from '../context/AuthContext'
import './Pages.css'

export function AuthPage() {
  const {
    user,
    loading,
    profileComplete,
    login,
    register,
    verifySignupCode,
    resendSignupCode,
    saveDemographics,
  } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [step, setStep] = useState<'form' | 'verify'>('form')
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<Gender | ''>('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [pendingEmail, setPendingEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (!loading && user && profileComplete) return <Navigate to="/profile" replace />

  function parseDemo() {
    const n = Number(age)
    if (!gender) return { err: 'Хүйсээ сонгоно уу.' as string }
    if (!Number.isFinite(n)) return { err: 'Насаа оруулна уу.' as string }
    return { demo: { age: Math.round(n), gender } }
  }

  function resetMessages() {
    setError(null)
    setInfo(null)
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    resetMessages()

    if (mode === 'register') {
      const parsed = parseDemo()
      if ('err' in parsed && parsed.err) {
        setError(parsed.err)
        setBusy(false)
        return
      }
      const result = await register(name, email, password, parsed.demo!)
      setBusy(false)
      if (result.status === 'error') {
        setError(result.message)
        return
      }
      if (result.status === 'verify') {
        setPendingEmail(result.email)
        setStep('verify')
        setCode('')
        setInfo('newsac.mn-ээс Gmail рүү 6 оронтой код илгээлээ. Имэйлээ шалгана уу.')
        return
      }
      return
    }

    const err = await login(email, password)
    setBusy(false)
    if (err) setError(err)
  }

  async function onVerify(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    resetMessages()
    const err = await verifySignupCode(pendingEmail, code)
    setBusy(false)
    if (err) {
      setError(err)
      return
    }
    setInfo('Бүртгэл амжилттай баталгаажлаа.')
  }

  async function onResend() {
    setBusy(true)
    resetMessages()
    const err = await resendSignupCode(pendingEmail)
    setBusy(false)
    if (err) {
      setError(err)
      return
    }
    setInfo('Шинэ код дахин илгээлээ. Gmail-ээ шалгана уу.')
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
        ) : step === 'verify' ? (
          <>
            <h1>Код баталгаажуулах</h1>
            <p className="auth-sub">
              <strong>{pendingEmail}</strong> хаяг руу newsac.mn-ээс илгээсэн 6 оронтой кодыг оруулна уу.
            </p>
            <form onSubmit={(e) => void onVerify(e)} className="auth-form">
              <label>
                Баталгаажуулах код
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  placeholder="123456"
                  maxLength={6}
                  pattern="\d{6}"
                />
              </label>
              {error && <p className="auth-error">{error}</p>}
              {info && <p className="auth-info">{info}</p>}
              <button type="submit" className="btn btn-primary btn-block" disabled={busy || loading || code.length !== 6}>
                {busy ? 'Шалгаж байна...' : 'Баталгаажуулах'}
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-block"
                disabled={busy || loading}
                onClick={() => void onResend()}
              >
                Код дахин илгээх
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-block"
                disabled={busy}
                onClick={() => {
                  setStep('form')
                  setCode('')
                  resetMessages()
                }}
              >
                ← Буцах
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="auth-tabs">
              <button
                type="button"
                className={mode === 'register' ? 'active' : ''}
                onClick={() => {
                  setMode('register')
                  setStep('form')
                  resetMessages()
                }}
              >
                Бүртгүүлэх
              </button>
              <button
                type="button"
                className={mode === 'login' ? 'active' : ''}
                onClick={() => {
                  setMode('login')
                  setStep('form')
                  resetMessages()
                }}
              >
                Нэвтрэх
              </button>
            </div>

            <h1>{mode === 'register' ? 'Шинэ гишүүн' : 'Дахиад тавтай морил'}</h1>
            <p className="auth-sub">
              {mode === 'register'
                ? 'Бүртгүүлсний дараа newsac.mn-ээс Gmail рүү баталгаажуулах код ирнэ.'
                : 'Gmail болон нууц үгөөр нэвтэрнэ.'}
            </p>

            <form onSubmit={(e) => void onSubmit(e)} className="auth-form">
              {mode === 'register' && (
                <>
                  <label>
                    Нэр
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Жишээ: Bat"
                      autoComplete="name"
                    />
                  </label>
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
                </>
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
                  autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                />
              </label>

              {error && <p className="auth-error">{error}</p>}
              {info && <p className="auth-info">{info}</p>}

              <button type="submit" className="btn btn-primary btn-block" disabled={busy || loading}>
                {busy
                  ? 'Түр хүлээнэ үү...'
                  : mode === 'register'
                    ? 'Бүртгүүлэх'
                    : 'Нэвтрэх'}
              </button>
            </form>
          </>
        )}

        <Link to="/" className="section-link" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
          ← Нүүр рүү
        </Link>
      </div>
    </div>
  )
}
