/** Spin кампанийн эхлэл — deploy өдөр (UTC+8) */
export const SPIN_CAMPAIGN_START = new Date('2026-08-18T00:00:00+08:00')
export const SPIN_CAMPAIGN_DAYS = 14
export const SPIN_COOLDOWN_MS = 24 * 60 * 60 * 1000
export const RECENT_WINNERS_DELAY_MS = 24 * 60 * 60 * 1000

export type SpinPrizeId =
  | 'ps5'
  | 'airpods'
  | 'ball'
  | 'cash22'
  | 'cash33'
  | 'retry'
  | 'cash11'

export type SpinPrize = {
  id: SpinPrizeId
  label: string
  sub?: string
  weight: number
  showInWinners: boolean
}

export const SPIN_PRIZES: SpinPrize[] = [
  { id: 'ps5', label: 'PS 5', sub: 'Grand Prize', weight: 1, showInWinners: true },
  { id: 'airpods', label: 'AirPods', weight: 3, showInWinners: true },
  { id: 'ball', label: 'Basketball', sub: 'Ball', weight: 8, showInWinners: true },
  { id: 'cash22', label: '22,000₮', weight: 10, showInWinners: true },
  { id: 'cash33', label: '33,000₮', weight: 8, showInWinners: true },
  { id: 'retry', label: 'Маргааш дахин оролдоорой', sub: '😎', weight: 42, showInWinners: false },
  { id: 'cash11', label: '11,000₮', weight: 28, showInWinners: true },
]

export type SpinWinner = {
  id: string
  prizeId: SpinPrizeId
  prizeLabel: string
  nameMasked: string
  phoneMasked: string
  at: string
}

const USER_SPIN_KEY = 'newsac_spin_user_v1'
const WINNERS_KEY = 'newsac_spin_winners_v1'
const PENDING_KEY = 'newsac_spin_pending'
const CAMPAIGN_START_KEY = 'newsac_spin_campaign_start_v1'

const SEED_WINNERS: SpinWinner[] = [
  {
    id: 'seed-1',
    prizeId: 'ball',
    prizeLabel: 'Ball',
    nameMasked: 'Бат***',
    phoneMasked: '9414****',
    at: '2026-09-02T14:20:00+08:00',
  },
  {
    id: 'seed-2',
    prizeId: 'cash11',
    prizeLabel: '11,000₮',
    nameMasked: 'Энх***',
    phoneMasked: '9912****',
    at: '2026-09-03T09:15:00+08:00',
  },
  {
    id: 'seed-3',
    prizeId: 'cash33',
    prizeLabel: '33,000₮',
    nameMasked: 'Ган***',
    phoneMasked: '8845****',
    at: '2026-09-04T18:40:00+08:00',
  },
]

type UserSpinState = {
  lastSpinAt: string | null
  lastPrizeId: SpinPrizeId | null
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getCampaignStart(): Date {
  const stored = localStorage.getItem(CAMPAIGN_START_KEY)
  if (stored) return new Date(stored)
  writeJson(CAMPAIGN_START_KEY, SPIN_CAMPAIGN_START.toISOString())
  return SPIN_CAMPAIGN_START
}

export function isCampaignActive(now = Date.now()) {
  const start = getCampaignStart().getTime()
  const end = start + SPIN_CAMPAIGN_DAYS * 24 * 60 * 60 * 1000
  return now >= start && now < end
}

export function showRecentWinnersGlobally(now = Date.now()) {
  const start = getCampaignStart().getTime()
  return now >= start + RECENT_WINNERS_DELAY_MS
}

export function markSpinPending() {
  try {
    sessionStorage.setItem(PENDING_KEY, '1')
  } catch {
    /* ignore */
  }
}

export function consumeSpinPending() {
  try {
    const v = sessionStorage.getItem(PENDING_KEY) === '1'
    sessionStorage.removeItem(PENDING_KEY)
    return v
  } catch {
    return false
  }
}

function userSpinKey(userId: string) {
  return `${USER_SPIN_KEY}:${userId}`
}

export function getUserSpinState(userId: string): UserSpinState {
  return readJson<UserSpinState>(userSpinKey(userId), {
    lastSpinAt: null,
    lastPrizeId: null,
  })
}

export function canSpinToday(userId: string, now = Date.now()) {
  if (!isCampaignActive(now)) return false
  const { lastSpinAt } = getUserSpinState(userId)
  if (!lastSpinAt) return true
  return now - new Date(lastSpinAt).getTime() >= SPIN_COOLDOWN_MS
}

export function msUntilNextSpin(userId: string, now = Date.now()) {
  const { lastSpinAt } = getUserSpinState(userId)
  if (!lastSpinAt) return 0
  const left = SPIN_COOLDOWN_MS - (now - new Date(lastSpinAt).getTime())
  return Math.max(0, left)
}

export function pickPrize(): SpinPrize {
  const total = SPIN_PRIZES.reduce((s, p) => s + p.weight, 0)
  let roll = Math.random() * total
  for (const prize of SPIN_PRIZES) {
    roll -= prize.weight
    if (roll <= 0) return prize
  }
  return SPIN_PRIZES[SPIN_PRIZES.length - 1]
}

export function maskName(name: string) {
  const t = name.trim()
  if (t.length <= 2) return `${t[0] || 'N'}***`
  return `${t.slice(0, 3)}***`
}

/** Demo phone mask — бодит дугаар байхгүй үед */
export function maskPhoneFromUserId(userId: string) {
  const digits = userId.replace(/\D/g, '').slice(-4).padStart(4, '0')
  const prefix = String(8000 + (parseInt(digits, 10) % 2000))
  return `${prefix}${digits.slice(0, 2)}****`
}

export function recordSpin(userId: string, prize: SpinPrize, displayName: string) {
  const at = new Date().toISOString()
  writeJson(userSpinKey(userId), {
    lastSpinAt: at,
    lastPrizeId: prize.id,
  } satisfies UserSpinState)

  if (!prize.showInWinners) return

  const winners = readJson<SpinWinner[]>(WINNERS_KEY, [])
  const entry: SpinWinner = {
    id: crypto.randomUUID(),
    prizeId: prize.id,
    prizeLabel: prize.id === 'ball' ? 'Ball' : prize.label,
    nameMasked: maskName(displayName),
    phoneMasked: maskPhoneFromUserId(userId),
    at,
  }
  writeJson(WINNERS_KEY, [entry, ...winners].slice(0, 40))
}

export function listRecentWinners(): SpinWinner[] {
  const live = readJson<SpinWinner[]>(WINNERS_KEY, [])
  if (!showRecentWinnersGlobally()) return []
  const merged = [...live, ...SEED_WINNERS]
  return merged
    .sort((a, b) => +new Date(b.at) - +new Date(a.at))
    .slice(0, 12)
}

export function formatWinnerDate(iso: string) {
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${day}`
}

export function formatCooldown(ms: number) {
  const h = Math.floor(ms / (60 * 60 * 1000))
  const m = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000))
  if (h > 0) return `${h} ц ${m} мин`
  return `${m} мин`
}
