/**
 * Live Instagram Stories for newsac_channel (Meta Graph API).
 *
 * Secrets (Supabase Dashboard → Edge Functions → Secrets):
 *   IG_ACCESS_TOKEN  — long-lived Page / Instagram token
 *   IG_USER_ID       — Instagram Business/Creator user id
 *
 * Optional:
 *   IG_USERNAME      — default newsac_channel
 *
 * Deploy: supabase functions deploy instagram-stories --no-verify-jwt
 */
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type StoryOut = {
  id: string
  mediaType: 'IMAGE' | 'VIDEO' | 'UNKNOWN'
  mediaUrl: string
  thumbnailUrl?: string
  timestamp?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: cors })
  }

  const username = Deno.env.get('IG_USERNAME') || 'newsac_channel'
  const profileUrl = `https://www.instagram.com/${username}/`
  const token = Deno.env.get('IG_ACCESS_TOKEN')
  const userId = Deno.env.get('IG_USER_ID')

  if (!token || !userId) {
    return Response.json(
      {
        username,
        profileUrl,
        stories: [],
        source: 'empty',
        message: 'IG_ACCESS_TOKEN / IG_USER_ID not configured',
      },
      { headers: cors },
    )
  }

  try {
    const listUrl = new URL(`https://graph.facebook.com/v21.0/${userId}/stories`)
    listUrl.searchParams.set('fields', 'id,media_type,media_url,thumbnail_url,timestamp')
    listUrl.searchParams.set('access_token', token)

    const listRes = await fetch(listUrl)
    const listJson = await listRes.json()
    if (!listRes.ok) {
      return Response.json(
        {
          username,
          profileUrl,
          stories: [],
          source: 'error',
          message: listJson?.error?.message || 'Graph API error',
        },
        { headers: cors, status: 200 },
      )
    }

    const raw = Array.isArray(listJson.data) ? listJson.data : []
    const stories: StoryOut[] = raw
      .map((row: Record<string, string>) => {
        const mediaType =
          row.media_type === 'VIDEO' ? 'VIDEO' : row.media_type === 'IMAGE' ? 'IMAGE' : 'UNKNOWN'
        const mediaUrl = row.media_url || ''
        if (!mediaUrl) return null
        return {
          id: String(row.id),
          mediaType,
          mediaUrl,
          thumbnailUrl: row.thumbnail_url || undefined,
          timestamp: row.timestamp || undefined,
        } satisfies StoryOut
      })
      .filter(Boolean) as StoryOut[]

    return Response.json(
      {
        username,
        profileUrl,
        stories,
        source: stories.length ? 'graph' : 'empty',
      },
      { headers: cors },
    )
  } catch (e) {
    return Response.json(
      {
        username,
        profileUrl,
        stories: [],
        source: 'error',
        message: e instanceof Error ? e.message : 'failed',
      },
      { headers: cors },
    )
  }
})
