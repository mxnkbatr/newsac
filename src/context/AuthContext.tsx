import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase, supabaseConfigured } from '../lib/supabase'
import type { MembershipTier } from '../store/types'

export type User = {
  id: string
  name: string
  email: string
  joinedAt: string
  favorites: string[]
  reactions: Record<string, 'fire' | 'cold'>
  membershipUntil?: string | null
  membershipTier?: MembershipTier | null
  pushEnabled?: boolean
  votedPolls?: string[]
  votedBattles?: string[]
}

type AuthContextValue = {
  user: User | null
  loading: boolean
  register: (name: string, email: string, password: string) => Promise<string | null>
  login: (email: string, password: string) => Promise<string | null>
  signInWithGoogle: () => Promise<string | null>
  logout: () => Promise<void>
  toggleFavorite: (rapperId: string) => boolean
  reactTo: (id: string, kind: 'fire' | 'cold') => void
  activateMembership: (months?: number, tier?: MembershipTier) => void
  isMember: boolean
  membershipTier: MembershipTier | null
  setPushEnabled: (on: boolean) => void
  markPollVoted: (pollId: string) => void
  hasVotedPoll: (pollId: string) => boolean
  markBattleVoted: (battleId: string) => void
  hasVotedBattle: (battleId: string) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

const PROFILES_KEY = 'newsac_profiles_v3'

type ProfileData = {
  favorites: string[]
  reactions: Record<string, 'fire' | 'cold'>
  membershipUntil?: string | null
  membershipTier?: MembershipTier | null
  pushEnabled?: boolean
  votedPolls?: string[]
  votedBattles?: string[]
}

const emptyProfile = (): ProfileData => ({
  favorites: [],
  reactions: {},
  membershipUntil: null,
  membershipTier: null,
  pushEnabled: false,
  votedPolls: [],
  votedBattles: [],
})

function isGmail(email: string) {
  return /^[^\s@]+@gmail\.com$/i.test(email.trim())
}

function readProfiles(): Record<string, ProfileData> {
  try {
    return JSON.parse(localStorage.getItem(PROFILES_KEY) || '{}') as Record<string, ProfileData>
  } catch {
    return {}
  }
}

function writeProfile(id: string, data: ProfileData) {
  const all = readProfiles()
  all[id] = data
  localStorage.setItem(PROFILES_KEY, JSON.stringify(all))
}

function getProfile(id: string): ProfileData {
  return { ...emptyProfile(), ...readProfiles()[id] }
}

function mapUser(su: SupabaseUser): User {
  const profile = getProfile(su.id)
  const email = (su.email || '').toLowerCase()
  const meta = su.user_metadata || {}
  const name =
    (typeof meta.full_name === 'string' && meta.full_name) ||
    (typeof meta.name === 'string' && meta.name) ||
    email.split('@')[0] ||
    'Newsac'
  return {
    id: su.id,
    name,
    email,
    joinedAt: su.created_at,
    favorites: profile.favorites || [],
    reactions: profile.reactions || {},
    membershipUntil: profile.membershipUntil ?? null,
    membershipTier: profile.membershipTier ?? null,
    pushEnabled: profile.pushEnabled ?? false,
    votedPolls: profile.votedPolls || [],
    votedBattles: profile.votedBattles || [],
  }
}

function patchProfile(userId: string, patch: Partial<ProfileData>): ProfileData {
  const next = { ...getProfile(userId), ...patch }
  writeProfile(userId, next)
  return next
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const applySessionUser = useCallback((su: SupabaseUser | null) => {
    setUser(su ? mapUser(su) : null)
  }, [])

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      applySessionUser(data.session?.user ?? null)
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      applySessionUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [applySessionUser])

  const isMember = Boolean(
    user?.membershipUntil && new Date(user.membershipUntil).getTime() > Date.now(),
  )
  const membershipTier = isMember ? user?.membershipTier || 'fan' : null

  const refreshFromProfile = useCallback((userId: string, name: string, email: string, joinedAt: string) => {
    const profile = getProfile(userId)
    setUser({
      id: userId,
      name,
      email,
      joinedAt,
      favorites: profile.favorites || [],
      reactions: profile.reactions || {},
      membershipUntil: profile.membershipUntil ?? null,
      membershipTier: profile.membershipTier ?? null,
      pushEnabled: profile.pushEnabled ?? false,
      votedPolls: profile.votedPolls || [],
      votedBattles: profile.votedBattles || [],
    })
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isMember,
      membershipTier,
      async register(name, emailRaw, password) {
        if (!supabaseConfigured) return 'Supabase тохируулаагүй байна (.env.local).'
        const email = emailRaw.trim().toLowerCase()
        if (!isGmail(email)) return 'Зөвхөн Gmail хаяг (@gmail.com) ашиглана уу.'
        if (password.length < 6) return 'Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой.'
        if (!name.trim()) return 'Нэрээ оруулна уу.'

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name.trim(), name: name.trim() },
            emailRedirectTo: `${window.location.origin}/auth`,
          },
        })
        if (error) return error.message
        if (data.user && !data.session) {
          return 'Баталгаажуулах линк Gmail рүү илгээлээ. Имэйлээ шалгана уу.'
        }
        if (data.user) writeProfile(data.user.id, emptyProfile())
        return null
      },
      async login(emailRaw, password) {
        if (!supabaseConfigured) return 'Supabase тохируулаагүй байна (.env.local).'
        const email = emailRaw.trim().toLowerCase()
        if (!isGmail(email)) return 'Зөвхөн Gmail хаяг (@gmail.com) ашиглана уу.'

        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
          if (error.message.toLowerCase().includes('invalid')) {
            return 'Gmail эсвэл нууц үг буруу байна.'
          }
          return error.message
        }
        return null
      },
      async signInWithGoogle() {
        if (!supabaseConfigured) return 'Supabase тохируулаагүй байна (.env.local).'
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth`,
            queryParams: { prompt: 'select_account' },
          },
        })
        if (error) return error.message
        return null
      },
      async logout() {
        await supabase.auth.signOut()
        setUser(null)
      },
      toggleFavorite(rapperId) {
        if (!user) return false
        const favs = new Set(user.favorites)
        let added = false
        if (favs.has(rapperId)) favs.delete(rapperId)
        else {
          favs.add(rapperId)
          added = true
        }
        patchProfile(user.id, { favorites: [...favs] })
        refreshFromProfile(user.id, user.name, user.email, user.joinedAt)
        return added
      },
      reactTo(id, kind) {
        if (!user) return
        const reactions = { ...user.reactions }
        if (reactions[id] === kind) delete reactions[id]
        else reactions[id] = kind
        patchProfile(user.id, { reactions })
        refreshFromProfile(user.id, user.name, user.email, user.joinedAt)
      },
      activateMembership(months = 1, tier = 'fan') {
        if (!user) return
        const base = Math.max(
          Date.now(),
          user.membershipUntil ? new Date(user.membershipUntil).getTime() : Date.now(),
        )
        const until = new Date(base)
        until.setMonth(until.getMonth() + months)
        patchProfile(user.id, {
          membershipUntil: until.toISOString(),
          membershipTier: tier,
        })
        refreshFromProfile(user.id, user.name, user.email, user.joinedAt)
      },
      setPushEnabled(on) {
        if (!user) return
        patchProfile(user.id, { pushEnabled: on })
        refreshFromProfile(user.id, user.name, user.email, user.joinedAt)
      },
      markPollVoted(pollId) {
        if (!user) return
        const set = new Set(user.votedPolls || [])
        set.add(pollId)
        patchProfile(user.id, { votedPolls: [...set] })
        refreshFromProfile(user.id, user.name, user.email, user.joinedAt)
      },
      hasVotedPoll(pollId) {
        return Boolean(user?.votedPolls?.includes(pollId))
      },
      markBattleVoted(battleId) {
        if (!user) return
        const set = new Set(user.votedBattles || [])
        set.add(battleId)
        patchProfile(user.id, { votedBattles: [...set] })
        refreshFromProfile(user.id, user.name, user.email, user.joinedAt)
      },
      hasVotedBattle(battleId) {
        return Boolean(user?.votedBattles?.includes(battleId))
      },
    }),
    [user, loading, isMember, membershipTier, refreshFromProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
