/**
 * YouTube Posts tab for @Newsacchannel (Innertube — official API has no posts resource).
 * Deploy: supabase functions deploy youtube-posts --no-verify-jwt
 */
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const CHANNEL_ID = Deno.env.get('YT_CHANNEL_ID') || 'UCZASN1yt7rHU0Xj6ywmZJQA'
const POSTS_PARAMS = 'EgVwb3N0c_IGBAoCSgA%3D'

function runs(t: { runs?: Array<{ text?: string }> } | undefined) {
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

function normalizePost(th: Record<string, unknown>) {
  const postWrap = th.post as Record<string, unknown> | undefined
  const p = postWrap?.backstagePostRenderer as Record<string, unknown> | undefined
  if (!p?.postId) return null
  const att = (p.backstageAttachment || {}) as Record<string, unknown>
  const images: string[] = []
  let videoId: string | null = null
  let poll: Array<{ text: string }> | null = null

  const single = att.backstageImageRenderer as Record<string, unknown> | undefined
  if (single) {
    const image = single.image as { thumbnails?: Array<{ url?: string }> } | undefined
    const thumbs = image?.thumbnails || []
    if (thumbs.length) images.push(abs(thumbs[thumbs.length - 1].url))
  }
  const multi = att.postMultiImageRenderer as { images?: unknown[] } | undefined
  if (multi?.images) {
    for (const im of multi.images) {
      const img = (im as Record<string, unknown>).backstageImageRenderer as
        | Record<string, unknown>
        | undefined
      const thumbs =
        (img?.image as { thumbnails?: Array<{ url?: string }> } | undefined)?.thumbnails || []
      if (thumbs.length) images.push(abs(thumbs[thumbs.length - 1].url))
    }
  }
  const video = att.videoRenderer as { videoId?: string } | undefined
  if (video?.videoId) videoId = video.videoId
  const pollR = att.pollRenderer as { choices?: Array<{ text?: unknown }> } | undefined
  if (pollR?.choices) {
    poll = pollR.choices.map((c) => ({
      text: runs(c.text as { runs?: Array<{ text?: string }> }),
    }))
  }

  const publishedTime = p.publishedTimeText as
    | { runs?: Array<{ text?: string }>; simpleText?: string }
    | undefined
  const voteCount = p.voteCount as { simpleText?: string } | undefined

  return {
    id: String(p.postId),
    text: runs(p.contentText as { runs?: Array<{ text?: string }> }).trim(),
    published: publishedTime?.runs?.[0]?.text || publishedTime?.simpleText || '',
    likes: voteCount?.simpleText || '',
    images,
    videoId,
    poll,
    url: `https://www.youtube.com/post/${p.postId}`,
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    const body = JSON.stringify({
      context: {
        client: {
          clientName: 'WEB',
          clientVersion: '2.20250318.01.00',
          hl: 'en',
          gl: 'US',
        },
      },
      browseId: CHANNEL_ID,
      params: POSTS_PARAMS,
    })

    const ytRes = await fetch('https://www.youtube.com/youtubei/v1/browse?prettyPrint=false', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      },
      body,
    })
    const json = await ytRes.json()
    if (!ytRes.ok) {
      return Response.json(
        { channelId: CHANNEL_ID, posts: [], error: 'YouTube browse failed' },
        { headers: cors, status: 200 },
      )
    }

    const posts = walk(json)
      .map((th) => normalizePost(th as Record<string, unknown>))
      .filter(Boolean)

    return Response.json(
      {
        channelId: CHANNEL_ID,
        fetchedAt: new Date().toISOString(),
        posts,
      },
      { headers: { ...cors, 'Cache-Control': 'public, max-age=120' } },
    )
  } catch (e) {
    return Response.json(
      {
        channelId: CHANNEL_ID,
        posts: [],
        error: e instanceof Error ? e.message : 'failed',
      },
      { headers: cors },
    )
  }
})
