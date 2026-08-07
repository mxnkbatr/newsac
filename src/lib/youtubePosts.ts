import { YOUTUBE_CHANNEL_ID, YOUTUBE_HANDLE, YOUTUBE_POSTS_URL } from '../data/brand'
import { supabase, supabaseConfigured } from './supabase'

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

export type YoutubePostsPayload = {
  channelId: string
  fetchedAt?: string
  posts: YoutubeChannelPost[]
  error?: string
}

async function fromSameOrigin(): Promise<YoutubePostsPayload | null> {
  try {
    const res = await fetch('/api/youtube-posts')
    if (!res.ok) return null
    return (await res.json()) as YoutubePostsPayload
  } catch {
    return null
  }
}

async function fromSupabase(): Promise<YoutubePostsPayload | null> {
  if (!supabaseConfigured) return null
  try {
    const { data, error } = await supabase.functions.invoke<YoutubePostsPayload>('youtube-posts', {
      method: 'GET',
    })
    if (error || !data) return null
    return data
  } catch {
    return null
  }
}

/** Live Posts tab for @Newsacchannel — Vite /api in dev, Edge Function in prod. */
export async function fetchYoutubePosts(): Promise<YoutubePostsPayload> {
  const local = await fromSameOrigin()
  if (local?.posts) return local

  const remote = await fromSupabase()
  if (remote?.posts) return remote

  return {
    channelId: YOUTUBE_CHANNEL_ID,
    posts: [],
    error: `Posts татахад алдаа. ${YOUTUBE_HANDLE} · ${YOUTUBE_POSTS_URL}`,
  }
}
