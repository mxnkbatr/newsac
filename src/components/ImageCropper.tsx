import { useEffect, useRef, useState, type PointerEvent, type TouchEvent } from 'react'
import './ImageCropper.css'

type Props = {
  src: string
  aspect: number
  title?: string
  hint?: string
  onCancel: () => void
  onConfirm: (file: File) => void
}

export function ImageCropper({
  src,
  aspect,
  title = 'Зураг тайрах',
  hint = '3:4 хүрээнд чирж, томруулаад тайрна. Бүх зураг ижил хэмжээтэй болно.',
  onCancel,
  onConfirm,
}: Props) {
  const viewRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const dragRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null)
  const pinchRef = useRef<{ dist: number; zoom: number } | null>(null)

  const [nat, setNat] = useState({ w: 0, h: 0 })
  const [view, setView] = useState({ w: 240, h: 320 })
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const node = viewRef.current
    if (!node) return
    const measure = () => {
      const w = node.clientWidth
      const h = Math.round(w / aspect)
      setView({ w, h })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(node)
    return () => ro.disconnect()
  }, [aspect])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.stopImmediatePropagation()
      onCancel()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [onCancel])

  const minScale =
    nat.w && nat.h ? Math.max(view.w / nat.w, view.h / nat.h) : 1
  const scale = minScale * zoom
  const dispW = nat.w * scale
  const dispH = nat.h * scale

  const clampPan = (x: number, y: number, nextZoom = zoom) => {
    const s = minScale * nextZoom
    const dw = nat.w * s
    const dh = nat.h * s
    const minX = Math.min(0, view.w - dw)
    const minY = Math.min(0, view.h - dh)
    return {
      x: Math.min(0, Math.max(minX, x)),
      y: Math.min(0, Math.max(minY, y)),
    }
  }

  useEffect(() => {
    if (!nat.w || !nat.h) return
    const s = Math.max(view.w / nat.w, view.h / nat.h) * zoom
    const dw = nat.w * s
    const dh = nat.h * s
    const minX = Math.min(0, view.w - dw)
    const minY = Math.min(0, view.h - dh)
    setPan((p) => ({
      x: Math.min(0, Math.max(minX, p.x)),
      y: Math.min(0, Math.max(minY, p.y)),
    }))
  }, [zoom, nat.w, nat.h, view.w, view.h])

  const onImgLoad = () => {
    const img = imgRef.current
    if (!img) return
    const w = img.naturalWidth
    const h = img.naturalHeight
    setNat({ w, h })
    const cover = Math.max(view.w / w, view.h / h)
    setZoom(1)
    setPan({
      x: (view.w - w * cover) / 2,
      y: (view.h - h * cover) / 2,
    })
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    dragRef.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y }
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (pinchRef.current) return
    const drag = dragRef.current
    if (!drag) return
    setPan(
      clampPan(drag.panX + (e.clientX - drag.x), drag.panY + (e.clientY - drag.y)),
    )
  }

  const endDrag = () => {
    dragRef.current = null
  }

  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      dragRef.current = null
      pinchRef.current = {
        dist: pinchDist(e.touches),
        zoom,
      }
    }
  }

  const onTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && pinchRef.current) {
      e.preventDefault()
      const ratio = pinchDist(e.touches) / pinchRef.current.dist
      setZoom(Math.min(4, Math.max(1, pinchRef.current.zoom * ratio)))
    }
  }

  const onTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length < 2) pinchRef.current = null
  }

  const confirm = () => {
    const img = imgRef.current
    if (!img || !nat.w) return
    setBusy(true)
    try {
      const outW = 900
      const outH = Math.round(outW / aspect)
      const canvas = document.createElement('canvas')
      canvas.width = outW
      canvas.height = outH
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('canvas')
      const sx = -pan.x / scale
      const sy = -pan.y / scale
      const sw = view.w / scale
      const sh = view.h / scale
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outW, outH)
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setBusy(false)
            return
          }
          onConfirm(new File([blob], 'portrait.jpg', { type: 'image/jpeg' }))
        },
        'image/jpeg',
        0.88,
      )
    } catch {
      setBusy(false)
    }
  }

  return (
    <div className="img-crop-backdrop" role="presentation">
      <div
        className="img-crop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="img-crop-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="img-crop-head">
          <div>
            <h3 id="img-crop-title">{title}</h3>
            <p>{hint}</p>
          </div>
          <button type="button" className="img-crop-x" onClick={onCancel} aria-label="Хаах">
            ×
          </button>
        </div>

        <div
          ref={viewRef}
          className="img-crop-view"
          style={{ aspectRatio: `${aspect}` }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <img
            ref={imgRef}
            src={src}
            alt=""
            draggable={false}
            onLoad={onImgLoad}
            style={{
              width: dispW || undefined,
              height: dispH || undefined,
              transform: `translate(${pan.x}px, ${pan.y}px)`,
            }}
          />
        </div>

        <label className="img-crop-zoom">
          <span>Томруулах</span>
          <input
            type="range"
            min={1}
            max={4}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
        </label>

        <div className="img-crop-actions">
          <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={busy}>
            Болих
          </button>
          <button type="button" className="btn btn-primary" onClick={confirm} disabled={busy || !nat.w}>
            {busy ? 'Тайрч байна…' : 'Тайрах'}
          </button>
        </div>
      </div>
    </div>
  )
}

function pinchDist(touches: TouchEvent['touches']) {
  const a = touches[0]
  const b = touches[1]
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
}
