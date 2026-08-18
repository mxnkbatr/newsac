import { useMemo, useState } from 'react'
import {
  SPIN_PRIZES,
  canSpinToday,
  formatCooldown,
  formatWinnerDate,
  isCampaignActive,
  listRecentWinners,
  msUntilNextSpin,
  pickPrize,
  recordSpin,
  showRecentWinnersGlobally,
  type SpinPrize,
} from '../lib/spinCampaign'
import './SpinWheel.css'

const SEG = SPIN_PRIZES.length
const SEG_ANGLE = 360 / SEG

function wheelColors(i: number) {
  return i % 2 === 0 ? '#1a1a1c' : '#111214'
}

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function segmentPath(cx: number, cy: number, r: number, start: number, end: number) {
  const a = polar(cx, cy, r, end)
  const b = polar(cx, cy, r, start)
  const large = end - start > 180 ? 1 : 0
  return `M ${cx} ${cy} L ${b.x} ${b.y} A ${r} ${r} 0 ${large} 1 ${a.x} ${a.y} Z`
}

type Props = {
  userId: string
  userName: string
  onClose: () => void
}

export function SpinWheel({ userId, userName, onClose }: Props) {
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState<SpinPrize | null>(null)
  const [showWinners, setShowWinners] = useState(false)

  const eligible = canSpinToday(userId)
  const cooldown = msUntilNextSpin(userId)
  const winners = useMemo(() => listRecentWinners(), [result, showWinners])
  const globalWinnersOn = showRecentWinnersGlobally()

  const wheelSvg = useMemo(() => {
    const cx = 100
    const cy = 100
    const r = 96
    return SPIN_PRIZES.map((p, i) => {
      const start = i * SEG_ANGLE
      const end = start + SEG_ANGLE
      const mid = start + SEG_ANGLE / 2
      const labelPos = polar(cx, cy, 62, mid)
      const isGrand = p.id === 'ps5'
      return (
        <g key={p.id}>
          <path d={segmentPath(cx, cy, r, start, end)} fill={wheelColors(i)} stroke="#2a2a2e" />
          <text
            x={labelPos.x}
            y={labelPos.y}
            fill={isGrand ? '#ff6b72' : '#f4f2ee'}
            fontSize={isGrand ? '7.5' : '7'}
            fontWeight="700"
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(${mid}, ${labelPos.x}, ${labelPos.y})`}
          >
            {p.id === 'retry' ? 'Маргааш' : p.label.split(' ')[0]}
          </text>
          {p.sub ? (
            <text
              x={labelPos.x}
              y={labelPos.y + 9}
              fill="#ff9aa0"
              fontSize="5.5"
              fontWeight="700"
              textAnchor="middle"
              transform={`rotate(${mid}, ${labelPos.x}, ${labelPos.y + 9})`}
            >
              {p.sub}
            </text>
          ) : null}
        </g>
      )
    })
  }, [])

  function spin() {
    if (!eligible || spinning || !isCampaignActive()) return
    const prize = pickPrize()
    const index = SPIN_PRIZES.findIndex((p) => p.id === prize.id)
    const segmentCenter = index * SEG_ANGLE + SEG_ANGLE / 2
    const extra = 6 * 360 + (360 - segmentCenter)
    setSpinning(true)
    setRotation((prev) => prev + extra)
    window.setTimeout(() => {
      recordSpin(userId, prize, userName)
      setResult(prize)
      setSpinning(false)
      setShowWinners(true)
    }, 4300)
  }

  return (
    <div className="spin-overlay" role="dialog" aria-modal="true" aria-label="Spin wheel">
      <div className="spin-modal">
        <header className="spin-head">
          <div className="section-kicker">Newsac · Spin</div>
          <h2>🎁 Эргүүлээд шагналаа аваарай</h2>
          <p>Бүртгэлийн дараа нэг удаа эргүүлнэ. Дараа нь 24 цаг тутамд нэг удаа.</p>
        </header>

        <div className="spin-stage">
          <div className="spin-pointer" aria-hidden="true" />
          <div className="spin-wheel" style={{ transform: `rotate(${rotation}deg)` }}>
            <svg viewBox="0 0 200 200" aria-hidden="true">
              {wheelSvg}
            </svg>
          </div>
          <div className="spin-center">SPIN</div>
        </div>

        {result ? (
          <div className="spin-result">
            <strong>
              {result.id === 'retry'
                ? 'Маргааш дахин оролдоорой 😎'
                : `🎉 ${result.label}${result.sub ? ` · ${result.sub}` : ''}`}
            </strong>
            <span>
              {result.id === 'retry'
                ? '24 цагийн дараа дахин эргүүлэх боломжтой.'
                : 'Бид тантай холбогдох болно. Баяр хүргэе!'}
            </span>
          </div>
        ) : null}

        {showWinners && globalWinnersOn && winners.length > 0 ? (
          <section className="spin-winners">
            <h3>🏆 Recent Winners</h3>
            <ul>
              {winners.map((w) => (
                <li key={w.id}>
                  <div>
                    <b>{w.prizeLabel}</b> — {w.nameMasked} {w.phoneMasked}
                  </div>
                  <em>{formatWinnerDate(w.at)}</em>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="spin-actions">
          {eligible && !result ? (
            <button
              type="button"
              className="btn btn-primary btn-block"
              disabled={spinning}
              onClick={spin}
            >
              {spinning ? 'Эргэж байна...' : 'Эргүүлэх'}
            </button>
          ) : null}
          {!eligible && !spinning ? (
            <p className="spin-note">
              Дараагийн эргүүлэлт: <strong>{formatCooldown(cooldown)}</strong> дараа
            </p>
          ) : null}
          <button type="button" className="btn btn-ghost btn-block" onClick={onClose}>
            Хаах
          </button>
        </div>

        <p className="spin-note">Кампанийн хугацаа: эхний {14} хоног · өдөрт 1 удаа</p>
      </div>
    </div>
  )
}
