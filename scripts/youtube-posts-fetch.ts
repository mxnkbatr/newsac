import { request } from 'node:https'

export const NEWSAC_CHANNEL_ID = 'UCZASN1yt7rHU0Xj6ywmZJQA'
export const POSTS_BROWSE_PARAMS = 'EgVwb3N0c_IGBAoCSgA%3D'

type Runs = { runs?: Array<{ text?: string }>; simpleText?: string }

export type YoutubeChannelPost = {
  id: string
  text: string
  published: string
  likes: string
  images: string[]
  videoId: string | null
  poll: Array<{ text: string }> | null
  url: string
}

function runs(t: Runs | undefined) {
  return (t?.runs || []).map((r) => r.text || '').join('')
}

function abs(u: string | undefined) {
  if (!u) return ''
  return u.startsWith('//') ? `https:${u}` : u
}

function walk(o: unknown, acc: unknown[] = []) {
  if (!o || typeof o !== 'object') return acc
  const rec = o as Record<string, unknown>
  if (rec.backstagePostThreadRenderer) acc.push(rec.backstagePostThreadRenderer)
  for (const v of Object.values(rec)) walk(v, acc)
  return acc
}

function normalizePost(th: unknown): YoutubeChannelPost | null {
  const thread = th as {
    post?: { backstagePostRenderer?: Record<string, unknown> }
  }
  const p = thread.post?.backstagePostRenderer
  if (!p?.postId) return null
  const att = (p.backstageAttachment || {}) as Record<string, unknown>
  const images: string[] = []
  let videoId: string | null = null
  let poll: Array<{ text: string }> | null = null

  const single = att.backstageImageRenderer as
    | { image?: { thumbnails?: Array<{ url?: string }> } }
    | undefined
  if (single?.image?.thumbnails?.length) {
    const thumbs = single.image.thumbnails
    images.push(abs(thumbs[thumbs.length - 1]?.url))
  }

  const multi = att.postMultiImageRenderer as { images?: unknown[] } | undefined
  if (multi?.images) {
    for (const im of multi.images) {
      const img = (im as { backstageImageRenderer?: typeof single }).backstageImageRenderer
      const thumbs = img?.image?.thumbnails || []
      if (thumbs.length) images.push(abs(thumbs[thumbs.length - 1]?.url))
    }
  }

  const video = att.videoRenderer as { videoId?: string } | undefined
  if (video?.videoId) videoId = video.videoId

  const pollR = att.pollRenderer as { choices?: Array<{ text?: Runs }> } | undefined
  if (pollR?.choices) {
    poll = pollR.choices.map((c) => ({ text: runs(c.text) }))
  }

  return {
    id: String(p.postId),
    text: runs(p.contentText as Runs).trim(),
    published:
      runs(p.publishedTimeText as Runs) ||
      (p.publishedTimeText as Runs | undefined)?.simpleText ||
      '',
    likes: (p.voteCount as { simpleText?: string } | undefined)?.simpleText || '',
    images,
    videoId,
    poll,
    url: `https://www.youtube.com/post/${p.postId}`,
  }
}

function innertubeBrowse(channelId: string) {
  const body = JSON.stringify({
    context: {
      client: {
        clientName: 'WEB',
        clientVersion: '2.20250318.01.00',
        hl: 'en',
        gl: 'US',
      },
    },
    browseId: channelId,
    params: POSTS_BROWSE_PARAMS,
  })

  return new Promise<unknown>((resolve, reject) => {
    const req = request(
      {
        hostname: 'www.youtube.com',
        path: '/youtubei/v1/browse?prettyPrint=false',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        },
      },
      (res) => {
        let d = ''
        res.on('data', (c) => {
          d += c
        })
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 400) {
            reject(new Error(`YouTube browse ${res.statusCode}`))
            return
          }
          try {
            resolve(JSON.parse(d) as unknown)
          } catch (e) {
            reject(e)
          }
        })
      },
    )
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

/** Fetch public Posts tab for a channel (no official API — Innertube). */
export async function fetchYoutubeChannelPosts(channelId = NEWSAC_CHANNEL_ID) {
  const json = await innertubeBrowse(channelId)
  const posts = walk(json)
    .map(normalizePost)
    .filter((p): p is YoutubeChannelPost => Boolean(p))
  return {
    channelId,
    fetchedAt: new Date().toISOString(),
    posts,
  }
}
