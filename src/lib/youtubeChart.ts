import type { ChartSong } from '../store/types'

const API_ROOT = 'https://www.googleapis.com/youtube/v3'

type SearchResponse = {
  items?: Array<{
    id?: { videoId?: string }
  }>
  error?: { message?: string }
}

type VideosResponse = {
  items?: Array<{
    id: string
    snippet: {
      title: string
      channelTitle: string
      publishedAt: string
      thumbnails?: {
        high?: { url: string }
        medium?: { url: string }
        default?: { url: string }
      }
    }
    statistics?: {
      viewCount?: string
      likeCount?: string
    }
  }>
  error?: { message?: string }
}

function compactViews(value: string | undefined) {
  const count = Number(value || 0)
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(count)
}

function decodeEntities(value: string) {
  const el = document.createElement('textarea')
  el.innerHTML = value
  return el.value
}

async function youtubeGet<T>(path: string, params: Record<string, string>) {
  const key = import.meta.env.VITE_YOUTUBE_API_KEY as string | undefined
  if (!key) throw new Error('VITE_YOUTUBE_API_KEY тохируулаагүй байна.')

  const url = new URL(`${API_ROOT}/${path}`)
  Object.entries({ ...params, key }).forEach(([name, value]) => {
    url.searchParams.set(name, value)
  })

  const response = await fetch(url)
  const body = (await response.json()) as T & { error?: { message?: string } }
  if (!response.ok || body.error) {
    throw new Error(body.error?.message || `YouTube API ${response.status}`)
  }
  return body
}

/**
 * Recent Mongolian music videos ranked by current public view count.
 * YouTube's public API does not expose exact weekly views, so this searches
 * recent MN music releases and ranks their total views at sync time.
 */
export async function fetchMongolianYouTubeChart(limit = 20): Promise<ChartSong[]> {
  const publishedAfter = new Date(Date.now() - 45 * 86400000).toISOString()
  const search = await youtubeGet<SearchResponse>('search', {
    part: 'id',
    q: 'монгол дуу|mongolian music',
    type: 'video',
    videoCategoryId: '10',
    regionCode: 'MN',
    relevanceLanguage: 'mn',
    order: 'viewCount',
    videoEmbeddable: 'true',
    safeSearch: 'moderate',
    publishedAfter,
    maxResults: String(Math.min(50, Math.max(limit, 10))),
  })

  const ids = (search.items || [])
    .map((item) => item.id?.videoId)
    .filter((id): id is string => Boolean(id))

  if (!ids.length) return []

  const details = await youtubeGet<VideosResponse>('videos', {
    part: 'snippet,statistics',
    id: ids.join(','),
  })

  const sorted = [...(details.items || [])]
    .sort(
      (a, b) =>
        Number(b.statistics?.viewCount || 0) - Number(a.statistics?.viewCount || 0),
    )
    .slice(0, limit)

  const today = new Date().toISOString().slice(0, 10)
  return sorted.map((video, index) => ({
    id: `yt-chart-${video.id}`,
    rank: index + 1,
    title: decodeEntities(video.snippet.title),
    artist: decodeEntities(video.snippet.channelTitle),
    spotifyTrackId: '',
    cover:
      video.snippet.thumbnails?.high?.url ||
      video.snippet.thumbnails?.medium?.url ||
      video.snippet.thumbnails?.default?.url ||
      `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
    plays: compactViews(video.statistics?.viewCount),
    change: 0,
    weekOf: today,
    audioUrl: '',
    youtubeId: video.id,
    isNew: Date.now() - Date.parse(video.snippet.publishedAt) < 14 * 86400000,
  }))
}

type ChannelResponse = {
  items?: Array<{
    id: string
    contentDetails?: {
      relatedPlaylists?: { uploads?: string }
    }
  }>
  error?: { message?: string }
}

type PlaylistItemsResponse = {
  items?: Array<{
    contentDetails?: { videoId?: string }
    snippet?: {
      title?: string
      description?: string
      publishedAt?: string
      resourceId?: { videoId?: string }
    }
  }>
  error?: { message?: string }
}

type VideosDetailResponse = {
  items?: Array<{
    id: string
    snippet: {
      title: string
      description: string
      publishedAt: string
    }
    contentDetails?: { duration?: string }
    statistics?: { viewCount?: string }
  }>
  error?: { message?: string }
}

/** ISO 8601 duration (PT1H2M3S) → m:ss / h:mm:ss */
function formatDuration(iso: string | undefined) {
  if (!iso) return ''
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return ''
  const h = Number(match[1] || 0)
  const m = Number(match[2] || 0)
  const s = Number(match[3] || 0)
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  return `${m}:${String(s).padStart(2, '0')}`
}

function relativePublished(iso: string) {
  const diff = Date.now() - Date.parse(iso)
  const days = Math.floor(diff / 86400000)
  if (days < 1) return 'өнөөдөр'
  if (days === 1) return '1 өдрийн өмнө'
  if (days < 7) return `${days} өдрийн өмнө`
  if (days < 30) return `${Math.floor(days / 7)} долоо хоногийн өмнө`
  return new Date(iso).toLocaleDateString('mn-MN')
}

/**
 * Latest uploads from @Newsacchannel (or override handle / channel id).
 */
export async function fetchChannelVideos(
  handle = 'Newsacchannel',
  limit = 24,
): Promise<
  Array<{
    youtubeId: string
    title: string
    description: string
    views: string
    duration: string
    published: string
  }>
> {
  const channel = await youtubeGet<ChannelResponse>('channels', {
    part: 'contentDetails',
    forHandle: handle.replace(/^@/, ''),
  })

  const uploadsId = channel.items?.[0]?.contentDetails?.relatedPlaylists?.uploads
  if (!uploadsId) {
    throw new Error(`@${handle.replace(/^@/, '')} суваг олдсонгүй.`)
  }

  const playlist = await youtubeGet<PlaylistItemsResponse>('playlistItems', {
    part: 'contentDetails,snippet',
    playlistId: uploadsId,
    maxResults: String(Math.min(50, Math.max(limit, 1))),
  })

  const ids = (playlist.items || [])
    .map(
      (item) =>
        item.contentDetails?.videoId || item.snippet?.resourceId?.videoId,
    )
    .filter((id): id is string => Boolean(id))

  if (!ids.length) return []

  const details = await youtubeGet<VideosDetailResponse>('videos', {
    part: 'snippet,contentDetails,statistics',
    id: ids.join(','),
  })

  return (details.items || []).map((video) => ({
    youtubeId: video.id,
    title: decodeEntities(video.snippet.title),
    description: decodeEntities(
      (video.snippet.description || '').split('\n')[0]?.slice(0, 160) ||
        'Newsac channel',
    ),
    views: compactViews(video.statistics?.viewCount),
    duration: formatDuration(video.contentDetails?.duration),
    published: relativePublished(video.snippet.publishedAt),
  }))
}
