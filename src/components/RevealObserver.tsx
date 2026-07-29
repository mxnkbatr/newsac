import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Observes `.reveal` elements and adds `.in` when they enter the viewport. */
export function RevealObserver() {
  const { pathname } = useLocation()

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            io.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )

    els.forEach((el) => {
      // Hero content may already be marked `.in`
      if (!el.classList.contains('in')) io.observe(el)
    })

    return () => io.disconnect()
  }, [pathname])

  return null
}
