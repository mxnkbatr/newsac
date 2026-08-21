const SUFFIX = 'хүмүүс уншиж байна'
const DEFAULT_COUNT = 2400

export function formatReadersCount(count: number) {
  const n = Math.max(0, Math.round(Number.isFinite(count) ? count : 0))
  if (n >= 1_000_000) {
    const v = n / 1_000_000
    return `${trimUnit(v)}M`
  }
  if (n >= 1000) {
    const v = n / 1000
    return `${trimUnit(v)}K`
  }
  return String(n)
}

function trimUnit(value: number) {
  return value % 1 === 0 ? String(value) : value.toFixed(1).replace(/\.0$/, '')
}

export function readersLine(count: number) {
  return `${formatReadersCount(count)} ${SUFFIX}`
}

export function parseReadersCount(raw?: string, fallback = DEFAULT_COUNT) {
  if (!raw?.trim()) return fallback
  const match = raw.trim().match(/^([\d.,]+)\s*([KkMm])?/)
  if (!match) return fallback
  const n = Number(match[1].replace(',', '.'))
  if (!Number.isFinite(n) || n < 0) return fallback
  const unit = (match[2] || '').toLowerCase()
  if (unit === 'm') return Math.round(n * 1_000_000)
  if (unit === 'k') return Math.round(n * 1000)
  return Math.round(n)
}

export function resolveReadersCount(flags?: {
  homeReadersCount?: number
  homeReadersLabel?: string
}) {
  if (typeof flags?.homeReadersCount === 'number' && Number.isFinite(flags.homeReadersCount)) {
    return Math.max(0, Math.round(flags.homeReadersCount))
  }
  return parseReadersCount(flags?.homeReadersLabel)
}
