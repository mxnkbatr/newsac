import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  canSpinToday,
  consumeSpinPending,
  isCampaignActive,
} from '../lib/spinCampaign'
import { SpinWheel } from './SpinWheel'

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

/** Бүртгэл/профайл дууссаны дараа spin modal нээнэ */
export function SpinWheelGate() {
  const { user, profileComplete, loading } = useAuth()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (loading || !user || !profileComplete) return
    if (!isCampaignActive()) return
    if (pathname === '/auth' || pathname === '/admin') return
    if (!canSpinToday(user.id)) return

    const pending = consumeSpinPending()
    const promptKey = `newsac_spin_prompt_${todayKey()}`
    const alreadyPrompted = sessionStorage.getItem(promptKey) === user.id

    if (pending || !alreadyPrompted) {
      setOpen(true)
      sessionStorage.setItem(promptKey, user.id)
    }
  }, [loading, user, profileComplete, pathname])

  if (!open || !user) return null

  return <SpinWheel userId={user.id} userName={user.name} onClose={() => setOpen(false)} />
}
