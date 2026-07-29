import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { isAdminCredential, normalizePhone } from '../store/seed'

export type User = {
  id: string
  name: string
  phone: string
  joinedAt: string
  favorites: string[]
  reactions: Record<string, 'fire' | 'cold'>
  membershipUntil?: string | null
  pushEnabled?: boolean
  votedPolls?: string[]
}

type AuthContextValue = {
  user: User | null
  register: (name: string, phone: string, password: string) => string | null
  login: (phone: string, password: string) => string | null
  logout: () => void
  toggleFavorite: (rapperId: string) => boolean
  reactTo: (id: string, kind: 'fire' | 'cold') => void
  activateMembership: (months?: number) => void
  isMember: boolean
  setPushEnabled: (on: boolean) => void
  markPollVoted: (pollId: string) => void
  hasVotedPoll: (pollId: string) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

const USERS_KEY = 'newsac_users'
const SESSION_KEY = 'newsac_session'
const ADMIN_KEY = 'newsac_admin_session'

type StoredUser = User & { password: string; email?: string }

function isValidMnPhone(phone: string) {
  return /^[89]\d{7}$/.test(phone)
}

function migrateUser(raw: StoredUser & { email?: string }): StoredUser | null {
  const phone = normalizePhone(raw.phone || raw.email || '')
  if (!phone) return null
  return {
    id: raw.id,
    name: raw.name,
    phone,
    password: raw.password,
    joinedAt: raw.joinedAt,
    favorites: raw.favorites || [],
    reactions: raw.reactions || {},
    membershipUntil: raw.membershipUntil ?? null,
    pushEnabled: raw.pushEnabled ?? false,
    votedPolls: raw.votedPolls || [],
  }
}

function readUsers(): StoredUser[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(USERS_KEY) || '[]') as StoredUser[]
    return parsed.map(migrateUser).filter((u): u is StoredUser => Boolean(u))
  } catch {
    return []
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function strip(u: StoredUser): User {
  const { password: _, email: __, ...safe } = u
  return safe
}

function syncAdminSession(phone: string, on: boolean) {
  if (!isAdminCredential(phone)) return
  if (on) {
    localStorage.setItem(ADMIN_KEY, '1')
    window.dispatchEvent(new Event('newsac-admin'))
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const sessionId = localStorage.getItem(SESSION_KEY)
    if (!sessionId) return
    const found = readUsers().find((u) => u.id === sessionId)
    if (found) {
      setUser(strip(found))
      syncAdminSession(found.phone, true)
    }
  }, [])

  const isMember = Boolean(
    user?.membershipUntil && new Date(user.membershipUntil).getTime() > Date.now(),
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isMember,
      register(name, phoneRaw, password) {
        const phone = normalizePhone(phoneRaw)
        if (!isValidMnPhone(phone)) {
          return 'Утасны дугаар буруу. 8 оронтой (жишээ: 99112233).'
        }
        const users = readUsers()
        if (users.some((u) => u.phone === phone)) {
          return 'Энэ утас аль хэдийн бүртгэлтэй байна.'
        }
        if (password.length < 6) return 'Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой.'
        const next: StoredUser = {
          id: crypto.randomUUID(),
          name: name.trim(),
          phone,
          password,
          joinedAt: new Date().toISOString(),
          favorites: [],
          reactions: {},
          membershipUntil: null,
          pushEnabled: false,
          votedPolls: [],
        }
        users.push(next)
        writeUsers(users)
        localStorage.setItem(SESSION_KEY, next.id)
        syncAdminSession(phone, true)
        setUser(strip(next))
        return null
      },
      login(phoneRaw, password) {
        const phone = normalizePhone(phoneRaw)
        const found = readUsers().find((u) => u.phone === phone && u.password === password)
        if (!found) return 'Утас эсвэл нууц үг буруу байна.'
        localStorage.setItem(SESSION_KEY, found.id)
        syncAdminSession(found.phone, true)
        setUser(strip(found))
        return null
      },
      logout() {
        localStorage.removeItem(SESSION_KEY)
        setUser(null)
      },
      toggleFavorite(rapperId) {
        if (!user) return false
        const users = readUsers()
        const idx = users.findIndex((u) => u.id === user.id)
        if (idx < 0) return false
        const favs = new Set(users[idx].favorites)
        let added = false
        if (favs.has(rapperId)) favs.delete(rapperId)
        else {
          favs.add(rapperId)
          added = true
        }
        users[idx].favorites = [...favs]
        writeUsers(users)
        setUser(strip(users[idx]))
        return added
      },
      reactTo(id, kind) {
        if (!user) return
        const users = readUsers()
        const idx = users.findIndex((u) => u.id === user.id)
        if (idx < 0) return
        const current = users[idx].reactions[id]
        if (current === kind) delete users[idx].reactions[id]
        else users[idx].reactions[id] = kind
        writeUsers(users)
        setUser(strip(users[idx]))
      },
      activateMembership(months = 1) {
        if (!user) return
        const users = readUsers()
        const idx = users.findIndex((u) => u.id === user.id)
        if (idx < 0) return
        const base = Math.max(
          Date.now(),
          users[idx].membershipUntil
            ? new Date(users[idx].membershipUntil!).getTime()
            : Date.now(),
        )
        const until = new Date(base)
        until.setMonth(until.getMonth() + months)
        users[idx].membershipUntil = until.toISOString()
        writeUsers(users)
        setUser(strip(users[idx]))
      },
      setPushEnabled(on) {
        if (!user) return
        const users = readUsers()
        const idx = users.findIndex((u) => u.id === user.id)
        if (idx < 0) return
        users[idx].pushEnabled = on
        writeUsers(users)
        setUser(strip(users[idx]))
      },
      markPollVoted(pollId) {
        if (!user) return
        const users = readUsers()
        const idx = users.findIndex((u) => u.id === user.id)
        if (idx < 0) return
        const set = new Set(users[idx].votedPolls || [])
        set.add(pollId)
        users[idx].votedPolls = [...set]
        writeUsers(users)
        setUser(strip(users[idx]))
      },
      hasVotedPoll(pollId) {
        return Boolean(user?.votedPolls?.includes(pollId))
      },
    }),
    [user, isMember],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
