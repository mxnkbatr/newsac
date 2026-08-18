import { useEffect, useState } from 'react'
import { useStore } from '../store/StoreContext'
import './MelbetBanner.css'

const MELBET_URL = 'https://melbet.com'
const LINE = 'MLB-ийн албан ёсны хуудсыг эндээс үзнэ үү.'

export function MelbetBanner() {
  const { track } = useStore()
  const [shown, setShown] = useState('')

  useEffect(() => {
    let i = 0
    let timer = 0

    const tick = () => {
      i += 1
      if (i <= LINE.length) {
        setShown(LINE.slice(0, i))
        timer = window.setTimeout(tick, i === LINE.length ? 1800 : 42)
        return
      }
      setShown('')
      i = 0
      timer = window.setTimeout(tick, 420)
    }

    timer = window.setTimeout(tick, 280)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <a
      className="melbet-ad"
      href={MELBET_URL}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={() => track('sponsor_click', 'melbet-news')}
      aria-label="Melbet — албан ёсны хуудас"
    >
      <span className="melbet-ad-kicker">Ad · 18+</span>
      <div className="melbet-ad-logo">
        <img src="/ads/melbet-wordmark.png" alt="Melbet" />
      </div>
      <p className="melbet-ad-line" aria-live="polite">
        <AdLine text={shown} />
        <i className="melbet-ad-caret" aria-hidden="true" />
      </p>
    </a>
  )
}

function AdLine({ text }: { text: string }) {
  return (
    <>
      {text.split('').map((ch, i) => {
        const yellow =
          'MLB-ийн'.split('').some((_, idx) => i === idx) ||
          Array.from({ length: 'эндээс'.length }).some(
            (_, idx) => i === LINE.indexOf('эндээс') + idx,
          )
        return (
          <span key={i} className={yellow ? 'gold' : 'ice'}>
            {ch}
          </span>
        )
      })}
    </>
  )
}
