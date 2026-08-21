import { useEffect, useId, useRef, useState } from 'react'
import {
  canNativeShare,
  copyText,
  facebookShareUrl,
  nativeShare,
  pageUrl,
  telegramShareUrl,
  whatsappShareUrl,
} from '../lib/share'
import './ShareButton.css'

type Props = {
  title: string
  text?: string
  path: string
  variant?: 'button' | 'icon'
}

export function ShareButton({ title, text, path, variant = 'button' }: Props) {
  const panelId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const url = pageUrl(path)
  const blurb = (text || title).trim()

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  useEffect(() => {
    if (!copied) return
    const t = window.setTimeout(() => setCopied(false), 1800)
    return () => window.clearTimeout(t)
  }, [copied])

  async function onShare() {
    try {
      navigator.vibrate?.(8)
    } catch {
      /* ignore */
    }
    const shared = await nativeShare({ title, text: blurb, url })
    if (shared) return
    setOpen((v) => !v)
  }

  async function onCopy() {
    const ok = await copyText(url)
    if (ok) {
      setCopied(true)
      setOpen(false)
    }
  }

  return (
    <div
      className={`share-wrap${variant === 'icon' ? ' is-icon' : ''}${open ? ' is-open' : ''}`}
      ref={rootRef}
    >
      <button
        type="button"
        className={variant === 'icon' ? 'share-icon' : 'share-btn'}
        aria-label="Хуваалцах"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void onShare()
        }}
      >
        <ShareGlyph />
        {variant === 'button' ? <span>Хуваалцах</span> : null}
      </button>
      {copied && variant === 'button' ? (
        <em className="share-copied">Холбоос хууллаа</em>
      ) : null}
      {copied && variant === 'icon' ? (
        <span className="share-tip" role="status">
          Хууллаа
        </span>
      ) : null}
      {open ? (
        <div className="share-sheet" id={panelId} role="dialog" aria-label="Хуваалцах">
          {!canNativeShare() ? (
            <p className="share-sheet-lead">{title}</p>
          ) : null}
          <button type="button" className="share-sheet-row" onClick={() => void onCopy()}>
            Холбоос хуулах
          </button>
          <a
            className="share-sheet-row"
            href={facebookShareUrl(url)}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
          >
            Facebook
          </a>
          <a
            className="share-sheet-row"
            href={telegramShareUrl(url, title)}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
          >
            Telegram
          </a>
          <a
            className="share-sheet-row"
            href={whatsappShareUrl(url, title)}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
          >
            WhatsApp
          </a>
        </div>
      ) : null}
    </div>
  )
}

function ShareGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M14 4.5a2.5 2.5 0 1 1 .9 1.92L9.62 9.3a2.5 2.5 0 1 1 0 5.4l5.28 2.88a2.5 2.5 0 1 1-.9 1.82l-5.28-2.88a2.5 2.5 0 1 1 0-9.04l5.28-2.88A2.5 2.5 0 0 1 14 4.5Z"
      />
    </svg>
  )
}
