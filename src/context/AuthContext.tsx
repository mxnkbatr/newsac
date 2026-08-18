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
import { markSpinPending } from '../lib/spinCampaign'
import type { MembershipTier } from '../store/types'

export type Gender = 'male' | 'female'

export type User = {
  id: string
  name: string
  email: string
  avatarUrl?: string | null
  joinedAt: string
  age?: number | null
  gender?: Gender | null
  favorites: string[]
  reactions: Record<string, 'fire' | 'cold'>
  membershipUntil?: string | null
  membershipTier?: MembershipTier | null
  pushEnabled?: boolean
  votedPolls?: string[]
  votedBattles?: string[]
}

export type AuthDemographics = {
  age: number
  gender: Gender
}

export type RegisterResult =
  | { status: 'ok' }
  | { status: 'verify'; email: string }
  | { status: 'error'; message: string }

type AuthContextValue = {
  user: User | null
  loading: boolean
  profileComplete: boolean
  register: (
    name: string,
    email: string,
    password: string,
    demo: AuthDemographics,
  ) => Promise<RegisterResult>
  verifySignupCode: (email: string, code: string) => Promise<string | null>
  resendSignupCode: (email: string) => Promise<string | null>
  signUp: (email: string, password: string) => Promise<RegisterResult>
  login: (email: string, password: string) => Promise<string | null>
  requestPasswordReset: (email: string) => Promise<string | null>
  verifyPasswordResetCode: (email: string, code: string) => Promise<string | null>
  updatePassword: (newPassword: string) => Promise<string | null>
  updateProfileBasics: (payload: { name: string; avatarUrl?: string | null }) => Promise<string | null>
  signInWithGoogle: (demo?: AuthDemographics) => Promise<string | null>
  saveDemographics: (demo: AuthDemographics) => Promise<string | null>
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
const PENDING_DEMO_KEY = 'newsac_pending_demo_v1'

type ProfileData = {
  name?: string
  avatarUrl?: string | null
  age?: number | null
  gender?: Gender | null
  favorites: string[]
  reactions: Record<string, 'fire' | 'cold'>
  membershipUntil?: string | null
  membershipTier?: MembershipTier | null
  pushEnabled?: boolean
  votedPolls?: string[]
  votedBattles?: string[]
}

const emptyProfile = (): ProfileData => ({
  name: '',
  avatarUrl: null,
  age: null,
  gender: null,
  favorites: [],
  reactions: {},
  membershipUntil: null,
  membershipTier: null,
  pushEnabled: false,
  votedPolls: [],
  votedBattles: [],
})

const AUTH_ERR_KEY = 'newsac_auth_err'

export function readAuthError() {
  try {
    const msg = sessionStorage.getItem(AUTH_ERR_KEY)
    if (msg) sessionStorage.removeItem(AUTH_ERR_KEY)
    return msg
  } catch {
    return null
  }
}

function writeAuthError(message: string) {
  try {
    sessionStorage.setItem(AUTH_ERR_KEY, message)
  } catch {
    /* ignore */
  }
}

function isGmail(email: string) {
  return /^[^\s@]+@(gmail|googlemail)\.com$/i.test(email.trim())
}

function validateDemographics(demo: AuthDemographics): string | null {
  if (!Number.isFinite(demo.age) || demo.age < 13 || demo.age > 100) {
    return 'Насаа 13–100 хооронд оруулна уу.'
  }
  if (demo.gender !== 'male' && demo.gender !== 'female') {
    return 'Хүйсээ сонгоно уу.'
  }
  return null
}

function isProfileComplete(profile: ProfileData) {
  return Boolean(
    profile.age &&
      profile.age >= 13 &&
      (profile.gender === 'male' || profile.gender === 'female'),
  )
}

function readPendingDemo(): AuthDemographics | null {
  try {
    const raw = sessionStorage.getItem(PENDING_DEMO_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AuthDemographics
    return validateDemographics(parsed) ? null : parsed
  } catch {
    return null
  }
}

function writePendingDemo(demo: AuthDemographics) {
  sessionStorage.setItem(PENDING_DEMO_KEY, JSON.stringify(demo))
}

function clearPendingDemo() {
  sessionStorage.removeItem(PENDING_DEMO_KEY)
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

function metaNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim()) {
    const n = Number(value)
    return Number.isFinite(n) ? n : null
  }
  return null
}

function metaGender(value: unknown): Gender | null {
  return value === 'male' || value === 'female' ? value : null
}

function mapUser(su: SupabaseUser): User {
  const pending = readPendingDemo()
  let profile = getProfile(su.id)
  const meta = su.user_metadata || {}
  const fromMetaAge = metaNumber(meta.age)
  const fromMetaGender = metaGender(meta.gender)

  // Supabase metadata → local (deploy/device солиход нас·хүйс дахин асуухгүй)
  if (!isProfileComplete(profile) && fromMetaAge && fromMetaGender) {
    profile = patchProfile(su.id, { age: fromMetaAge, gender: fromMetaGender })
  }

  if (pending && !isProfileComplete(profile)) {
    profile = patchProfile(su.id, { age: pending.age, gender: pending.gender })
    clearPendingDemo()
  } else if (pending && isProfileComplete(profile)) {
    clearPendingDemo()
  }

  const email = (su.email || '').toLowerCase()
  const profileName = typeof profile.name === 'string' ? profile.name.trim() : ''
  const profileAvatar = typeof profile.avatarUrl === 'string' ? profile.avatarUrl.trim() : ''
  const name =
    profileName ||
    (typeof meta.full_name === 'string' && meta.full_name) ||
    (typeof meta.name === 'string' && meta.name) ||
    email.split('@')[0] ||
    'Newsac'
  return {
    id: su.id,
    name,
    email,
    avatarUrl: profileAvatar || null,
    joinedAt: su.created_at,
    age: profile.age ?? fromMetaAge ?? null,
    gender: profile.gender ?? fromMetaGender ?? null,
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
    if (su?.email && !isGmail(su.email)) {
      writeAuthError('Зөвхөн Gmail (@gmail.com) хаягаар нэвтэрнэ.')
      void supabase.auth.signOut()
      setUser(null)
      return
    }
    if (su) {
      const mapped = mapUser(su)
      setUser(mapped)
      const created = new Date(su.created_at).getTime()
      const isFresh = Date.now() - created < 15 * 60 * 1000
      const welcomeKey = `newsac_spin_welcome_${su.id}`
      if (
        isFresh &&
        isProfileComplete(getProfile(su.id)) &&
        !sessionStorage.getItem(welcomeKey)
      ) {
        markSpinPending()
        sessionStorage.setItem(welcomeKey, '1')
      }
      return
    }
    setUser(null)
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
      name: profile.name?.trim() || name,
      email,
      avatarUrl: profile.avatarUrl?.trim() || null,
      joinedAt,
      age: profile.age ?? null,
      gender: profile.gender ?? null,
      favorites: profile.favorites || [],
      reactions: profile.reactions || {},
      membershipUntil: profile.membershipUntil ?? null,
      membershipTier: profile.membershipTier ?? null,
      pushEnabled: profile.pushEnabled ?? false,
      votedPolls: profile.votedPolls || [],
      votedBattles: profile.votedBattles || [],
    })
  }, [])

  const profileComplete = Boolean(
    user &&
      user.age &&
      user.age >= 13 &&
      (user.gender === 'male' || user.gender === 'female'),
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      profileComplete,
      isMember,
      membershipTier,
      async register(name, emailRaw, password, demo) {
        if (!supabaseConfigured) {
          return { status: 'error', message: 'Supabase тохируулаагүй байна (.env.local).' }
        }
        const email = emailRaw.trim().toLowerCase()
        if (!isGmail(email)) {
          return { status: 'error', message: 'Зөвхөн Gmail хаяг (@gmail.com) ашиглана уу.' }
        }
        if (password.length < 6) {
          return { status: 'error', message: 'Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой.' }
        }
        if (!name.trim()) return { status: 'error', message: 'Нэрээ оруулна уу.' }
        const demoErr = validateDemographics(demo)
        if (demoErr) return { status: 'error', message: demoErr }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name.trim(),
              name: name.trim(),
              age: demo.age,
              gender: demo.gender,
            },
            emailRedirectTo: `${window.location.origin}/auth`,
          },
        })
        if (error) return { status: 'error', message: error.message }
        if (data.user) {
          writeProfile(data.user.id, {
            ...emptyProfile(),
            age: demo.age,
            gender: demo.gender,
          })
        }
        if (data.user && !data.session) {
          return { status: 'verify', email }
        }
        markSpinPending()
        return { status: 'ok' }
      },
      async verifySignupCode(emailRaw, codeRaw) {
        if (!supabaseConfigured) return 'Supabase тохируулаагүй байна (.env.local).'
        const email = emailRaw.trim().toLowerCase()
        const token = codeRaw.replace(/\s/g, '')
        if (!/^\d{6}$/.test(token)) return '6 оронтой кодыг зөв оруулна уу.'

        const { error } = await supabase.auth.verifyOtp({
          email,
          token,
          type: 'signup',
        })
        if (error) {
          const msg = error.message.toLowerCase()
          if (msg.includes('expired') || msg.includes('invalid')) {
            return 'Код буруу эсвэл хугацаа дууссан. Дахин илгээнэ үү.'
          }
          return error.message
        }
        return null
      },
      async resendSignupCode(emailRaw) {
        if (!supabaseConfigured) return 'Supabase тохируулаагүй байна (.env.local).'
        const email = emailRaw.trim().toLowerCase()
        if (!isGmail(email)) return 'Зөвхөн Gmail хаяг (@gmail.com) ашиглана уу.'

        const { error } = await supabase.auth.resend({
          type: 'signup',
          email,
          options: { emailRedirectTo: `${window.location.origin}/auth` },
        })
        if (error) return error.message
        return null
      },
      async signUp(emailRaw, password) {
        if (!supabaseConfigured) {
          return { status: 'error', message: 'Supabase тохируулаагүй байна (.env.local).' }
        }
        const email = emailRaw.trim().toLowerCase()
        if (!isGmail(email)) {
          return { status: 'error', message: 'Зөвхөн Gmail хаяг (@gmail.com) ашиглана уу.' }
        }
        if (password.length < 6) {
          return { status: 'error', message: 'Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой.' }
        }

        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) return { status: 'error', message: error.message }
        if (data.user && !data.session) {
          return { status: 'verify', email }
        }
        return { status: 'ok' }
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
      async requestPasswordReset(emailRaw) {
        if (!supabaseConfigured) return 'Supabase тохируулаагүй байна (.env.local).'
        const email = emailRaw.trim().toLowerCase()
        if (!isGmail(email)) return 'Зөвхөн Gmail хаяг (@gmail.com) ашиглана уу.'
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`,
        })
        if (error) return error.message
        return null
      },
      async verifyPasswordResetCode(emailRaw, codeRaw) {
        if (!supabaseConfigured) return 'Supabase тохируулаагүй байна (.env.local).'
        const email = emailRaw.trim().toLowerCase()
        const token = codeRaw.replace(/\s/g, '')
        if (!/^\d{6}$/.test(token)) return '6 оронтой кодоо зөв оруулна уу.'
        const { error } = await supabase.auth.verifyOtp({
          email,
          token,
          type: 'recovery',
        })
        if (error) return error.message
        return null
      },
      async updatePassword(newPassword) {
        if (!supabaseConfigured) return 'Supabase тохируулаагүй байна (.env.local).'
        if (newPassword.length < 6) return 'Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой.'
        const { error } = await supabase.auth.updateUser({ password: newPassword })
        if (error) return error.message
        return null
      },
      async updateProfileBasics(payload) {
        if (!user) return 'Эхлээд нэвтэрнэ үү.'
        const name = payload.name.trim()
        if (!name) return 'Нэрээ оруулна уу.'
        const avatarUrl = (payload.avatarUrl || '').trim()
        patchProfile(user.id, { name, avatarUrl: avatarUrl || null })
        const { error } = await supabase.auth.updateUser({
          data: {
            full_name: name,
            name,
            avatar_url: avatarUrl || null,
          },
        })
        if (error) return error.message
        refreshFromProfile(user.id, user.name, user.email, user.joinedAt)
        return null
      },
      async signInWithGoogle(demo) {
        if (!supabaseConfigured) return 'Supabase тохируулаагүй байна (.env.local).'
        if (demo) {
          const err = validateDemographics(demo)
          if (err) return err
          writePendingDemo(demo)
        }
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
      async saveDemographics(demo) {
        if (!user) return 'Эхлээд Gmail-ээр нэвтэрнэ үү.'
        const err = validateDemographics(demo)
        if (err) return err
        patchProfile(user.id, { age: demo.age, gender: demo.gender })
        clearPendingDemo()
        const { error } = await supabase.auth.updateUser({
          data: { age: demo.age, gender: demo.gender },
        })
        if (error) return error.message
        refreshFromProfile(user.id, user.name, user.email, user.joinedAt)
        markSpinPending()
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
    [user, loading, profileComplete, isMember, membershipTier, refreshFromProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
