/** Parse bare ID or full YouTube URL → 11-char video id */
export function parseYouTubeId(input: string | null | undefined): string | null {
  const raw = (input || '').trim()
  if (!raw) return null
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw

  try {
    const url = new URL(raw.startsWith('http') ? raw : `https://${raw}`)
    const host = url.hostname.replace(/^www\./, '')
    if (host === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0]
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null
    }
    if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      const v = url.searchParams.get('v')
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v
      const parts = url.pathname.split('/').filter(Boolean)
      const kind = parts[0]
      if (kind === 'embed' || kind === 'shorts' || kind === 'live' || kind === 'v') {
        const id = parts[1]
        if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) return id
      }
    }
  } catch {
    /* fall through */
  }

  const m = raw.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/|live\/)|[?&]v=)([a-zA-Z0-9_-]{11})/,
  )
  return m?.[1] ?? null
}

export function normalizeYouTubeId(input: string): string {
  return parseYouTubeId(input) || input.trim()
}

export function youtubeThumb(
  id: string,
  quality: 'hqdefault' | 'mqdefault' | 'maxresdefault' = 'hqdefault',
) {
  return `https://i.ytimg.com/vi/${id}/${quality}.jpg`
}

export function youtubeEmbedSrc(
  id: string,
  opts?: {
    autoplay?: boolean
    mute?: boolean
    start?: number
    nocookie?: boolean
  },
) {
  const host = opts?.nocookie ? 'www.youtube-nocookie.com' : 'www.youtube.com'
  const params = new URLSearchParams({ rel: '0', playsinline: '1' })
  if (opts?.autoplay) params.set('autoplay', '1')
  if (opts?.mute) params.set('mute', '1')
  if (opts?.start != null && opts.start > 0) params.set('start', String(opts.start))
  return `https://${host}/embed/${id}?${params.toString()}`
}

export function youtubeWatchUrl(id: string) {
  return `https://www.youtube.com/watch?v=${id}`
}
