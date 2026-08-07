import https from 'https'

export const NEWSAC_CHANNEL_ID = 'UCZASN1yt7rHU0Xj6ywmZJQA'
export const POSTS_BROWSE_PARAMS = 'EgVwb3N0c_IGBAoCSgA%3D'

function runs(t) {
  return (t?.runs || []).map((r) => r.text).join('')
}

function abs(u) {
  if (!u) return ''
  return u.startsWith('//') ? `https:${u}` : u
}

function walk(o, acc = []) {
  if (!o || typeof o !== 'object') return acc
  if (o.backstagePostThreadRenderer) acc.push(o.backstagePostThreadRenderer)
  for (const v of Object.values(o)) walk(v, acc)
  return acc
}

function normalizePost(th) {
  const p = th.post?.backstagePostRenderer
  if (!p?.postId) return null
  const att = p.backstageAttachment || {}
  const images = []
  let videoId = null
  let poll = null

  if (att.backstageImageRenderer) {
    const thumbs = att.backstageImageRenderer.image?.thumbnails || []
    if (thumbs.length) images.push(abs(thumbs[thumbs.length - 1].url))
  }
  if (att.postMultiImageRenderer) {
    for (const im of att.postMultiImageRenderer.images || []) {
      const t = im.backstageImageRenderer?.image?.thumbnails || []
      if (t.length) images.push(abs(t[t.length - 1].url))
    }
  }
  if (att.videoRenderer?.videoId) videoId = att.videoRenderer.videoId
  if (att.pollRenderer) {
    poll = (att.pollRenderer.choices || []).map((c) => ({
      text: runs(c.text),
    }))
  }

  return {
    id: p.postId,
    text: runs(p.contentText).trim(),
    published: p.publishedTimeText?.runs?.[0]?.text || p.publishedTimeText?.simpleText || '',
    likes: p.voteCount?.simpleText || '',
    images,
    videoId,
    poll,
    url: `https://www.youtube.com/post/${p.postId}`,
  }
}

function innertubeBrowse(channelId) {
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

  return new Promise((resolve, reject) => {
    const req = https.request(
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
        res.on('data', (c) => (d += c))
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 400) {
            reject(new Error(`YouTube browse ${res.statusCode}`))
            return
          }
          try {
            resolve(JSON.parse(d))
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
  const posts = walk(json).map(normalizePost).filter(Boolean)
  return {
    channelId,
    fetchedAt: new Date().toISOString(),
    posts,
  }
}
