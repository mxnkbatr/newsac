export function pageUrl(path: string) {
  const origin = window.location.origin
  const clean = path.startsWith('/') ? path : `/${path}`
  return `${origin}${clean}`
}

export function canNativeShare() {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function'
}

export async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value)
    return true
  } catch {
    const el = document.createElement('textarea')
    el.value = value
    el.setAttribute('readonly', '')
    el.style.position = 'fixed'
    el.style.left = '-9999px'
    document.body.appendChild(el)
    el.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(el)
    return ok
  }
}

export async function nativeShare(payload: { title: string; text?: string; url: string }) {
  if (!canNativeShare()) return false
  try {
    await navigator.share({
      title: payload.title,
      text: payload.text || payload.title,
      url: payload.url,
    })
    return true
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') return true
    return false
  }
}

export function facebookShareUrl(url: string) {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
}

export function telegramShareUrl(url: string, title: string) {
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
}

export function whatsappShareUrl(url: string, title: string) {
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title}\n${url}`)}`
}
