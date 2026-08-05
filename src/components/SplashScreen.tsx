import { useEffect, useState } from 'react'
import './SplashScreen.css'

// Fast enough to feel native; long branded intros make a live app feel slow.
const MIN_MS = 850

export function SplashScreen() {
  const [phase, setPhase] = useState<'in' | 'out' | 'gone'>('in')

  useEffect(() => {
    const boot = document.getElementById('boot-splash')
    boot?.classList.add('boot-splash-synced')

    const show = window.setTimeout(() => {
      setPhase('out')
      boot?.classList.add('hide')
    }, MIN_MS)

    return () => window.clearTimeout(show)
  }, [])

  useEffect(() => {
    if (phase !== 'out') return
    const t = window.setTimeout(() => {
      setPhase('gone')
      document.getElementById('boot-splash')?.remove()
      document.body.classList.add('splash-done')
    }, 520)
    return () => window.clearTimeout(t)
  }, [phase])

  if (phase === 'gone') return null

  return (
    <div className={`splash ${phase === 'out' ? 'splash-out' : ''}`} aria-hidden="true">
      <div className="splash-glow" />
      <div className="splash-grain" />
      <div className="splash-mark">
        <img src="/logo.png" alt="" className="splash-logo" />
        <strong className="splash-word">Newsac</strong>
        <span className="splash-tag">Hip-hop market culture</span>
      </div>
      <div className="splash-beam" />
      <p className="splash-credit">Developed by Munkhbaatar Dorjsuren</p>
    </div>
  )
}
