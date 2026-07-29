import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/** Route flash + desktop cursor glow. */
export function EffectsLayer() {
  const { pathname } = useLocation()
  const flashRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const flash = flashRef.current
    if (!flash) return
    flash.classList.remove('run')
    // reflow to restart animation
    void flash.offsetWidth
    flash.classList.add('run')
  }, [pathname])

  useEffect(() => {
    const glow = glowRef.current
    if (!glow) return
    if (window.matchMedia('(hover: none)').matches) return

    const onMove = (e: PointerEvent) => {
      glow.style.left = `${e.clientX}px`
      glow.style.top = `${e.clientY}px`
      glow.classList.add('on')
    }
    const onLeave = () => glow.classList.remove('on')

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <>
      <div ref={flashRef} className="page-flash" aria-hidden="true" />
      <div ref={glowRef} className="cursor-glow" aria-hidden="true" />
    </>
  )
}
