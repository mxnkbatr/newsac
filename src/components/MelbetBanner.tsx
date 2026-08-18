import { useStore } from '../store/StoreContext'
import './MelbetBanner.css'

const MELBET_URL = 'https://melbet.com'

export function MelbetBanner() {
  const { track } = useStore()

  return (
    <a
      className="melbet-ad"
      href={MELBET_URL}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={() => track('sponsor_click', 'melbet-news')}
      aria-label="Melbet реклам — шинэ табаар нээгдэнэ"
    >
      <span className="melbet-ad-kicker">Ad · 18+</span>
      <img src="/ads/melbet-wordmark.png" alt="Melbet" />
    </a>
  )
}
