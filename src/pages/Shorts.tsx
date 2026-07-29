import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store/StoreContext'
import './Shorts.css'

export function ShortsPage() {
  const { data, track } = useStore()
  const [index, setIndex] = useState(0)
  const clip = data.shorts[index]

  useEffect(() => {
    if (clip) track('short_view', clip.id)
  }, [clip?.id])

  if (!clip) {
    return (
      <div className="page-hero">
        <div className="container">
          <h1>Shorts хоосон</h1>
        </div>
      </div>
    )
  }

  const embed = `https://www.youtube-nocookie.com/embed/${clip.youtubeId}?start=${clip.start}&autoplay=1&rel=0&modestbranding=1`

  return (
    <div className="shorts-page">
      <div className="shorts-stage">
        <iframe title={clip.title} src={embed} allow="autoplay; encrypted-media" allowFullScreen />
        <div className="shorts-meta">
          <span>Shorts · {index + 1}/{data.shorts.length}</span>
          <h1>{clip.title}</h1>
          {clip.rapperId && (
            <Link to={`/rappers/${clip.rapperId}`} className="section-link">
              Рэппер үзэх →
            </Link>
          )}
        </div>
        <div className="shorts-nav">
          <button
            type="button"
            disabled={index <= 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
          >
            ↑ Өмнөх
          </button>
          <button
            type="button"
            disabled={index >= data.shorts.length - 1}
            onClick={() => setIndex((i) => Math.min(data.shorts.length - 1, i + 1))}
          >
            ↓ Дараах
          </button>
        </div>
      </div>
    </div>
  )
}
