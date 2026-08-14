import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

const GA_ID = 'G-YWR8GNW6BS'

/** SPA route changes → GA4 page_view */
export function Analytics() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    if (typeof window.gtag !== 'function') return
    window.gtag('event', 'page_view', {
      page_path: `${pathname}${search}`,
      page_title: document.title,
      send_to: GA_ID,
    })
  }, [pathname, search])

  return null
}
