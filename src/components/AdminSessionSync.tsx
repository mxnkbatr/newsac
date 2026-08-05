import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useStore } from '../store/StoreContext'

/** Gmail admin жагсаалтад байвал admin session автоматаар идэвхжүүлнэ. */
export function AdminSessionSync() {
  const { user } = useAuth()
  const { isAdmin, isEmailAdmin, grantAdmin } = useStore()

  useEffect(() => {
    if (!user?.email) return
    if (isEmailAdmin(user.email) && !isAdmin) {
      grantAdmin()
    }
  }, [user?.email, isAdmin, isEmailAdmin, grantAdmin])

  return null
}
