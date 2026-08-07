import { INSTAGRAM_USERNAME, SOCIAL } from '../data/brand'
import { supabase, supabaseConfigured } from './supabase'

export type IgStoryMedia = {
  id: string
  mediaType: 'IMAGE' | 'VIDEO' | 'UNKNOWN'
  mediaUrl: string
  thumbnailUrl?: string
  timestamp?: string
}

export type IgStoriesPayload = {
  username: string
  profileUrl: string
  stories: IgStoryMedia[]
  source: 'graph' | 'empty' | 'error'
  message?: string
}

const emptyPayload = (message?: string): IgStoriesPayload => ({
  username: INSTAGRAM_USERNAME,
  profileUrl: SOCIAL.instagram,
  stories: [],
  source: message ? 'error' : 'empty',
  message,
})

/** Live Instagram Stories via Supabase Edge Function (Meta Graph API). */
export async function fetchInstagramStories(): Promise<IgStoriesPayload> {
  if (!supabaseConfigured) return emptyPayload()

  try {
    const { data, error } = await supabase.functions.invoke<IgStoriesPayload>('instagram-stories', {
      method: 'GET',
    })
    if (error) return emptyPayload(error.message)
    if (!data) return emptyPayload()
    return {
      username: data.username || INSTAGRAM_USERNAME,
      profileUrl: data.profileUrl || SOCIAL.instagram,
      stories: Array.isArray(data.stories) ? data.stories : [],
      source: data.stories?.length ? 'graph' : data.source || 'empty',
      message: data.message,
    }
  } catch (e) {
    return emptyPayload(e instanceof Error ? e.message : 'fetch failed')
  }
}
