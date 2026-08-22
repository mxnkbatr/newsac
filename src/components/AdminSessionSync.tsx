import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useStore } from '../store/StoreContext'

/** Gmail admin эсвэл Дээд Лиг editor бол admin session автоматаар идэвхжүүлнэ. */
export function AdminSessionSync() {
  const { user } = useAuth()
  const { isAdmin, canAccessCms, grantAdmin } = useStore()

  useEffect(() => {
    if (!user?.email) return
    if (canAccessCms(user.email) && !isAdmin) {
      grantAdmin()
    }
  }, [user?.email, isAdmin, canAccessCms, grantAdmin])

  return null
}
