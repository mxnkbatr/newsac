import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useStore } from '../store/StoreContext'

/** Gmail admin жагсаалтад байвал admin session автоматаар идэвхжүүлнэ. */
export function AdminSessionSync() {
  const { user } = useAuth()
  const { isAdmin, canOpenCms, grantAdmin } = useStore()

  useEffect(() => {
    if (!user?.email) return
    if (canOpenCms(user.email) && !isAdmin) {
      grantAdmin()
    }
  }, [user?.email, isAdmin, canOpenCms, grantAdmin])

  return null
}
