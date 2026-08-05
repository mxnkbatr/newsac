import type { AppData } from '../store/types'
import { supabase, supabaseConfigured } from './supabase'

const SNAPSHOT_ID = 'main'

export async function pullAppSnapshot(): Promise<AppData | null> {
  if (!supabaseConfigured) throw new Error('Supabase тохируулаагүй байна.')

  const { data, error } = await supabase
    .from('app_snapshots')
    .select('data, updated_at')
    .eq('id', SNAPSHOT_ID)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data?.data || typeof data.data !== 'object') return null
  return data.data as AppData
}

export async function pushAppSnapshot(payload: AppData): Promise<void> {
  if (!supabaseConfigured) throw new Error('Supabase тохируулаагүй байна.')

  const { data: sessionData } = await supabase.auth.getSession()
  if (!sessionData.session) {
    throw new Error('Cloud push хийхийн тулд Gmail-ээр нэвтэрнэ үү.')
  }

  const { error } = await supabase.from('app_snapshots').upsert(
    {
      id: SNAPSHOT_ID,
      data: payload,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' },
  )

  if (error) {
    if (error.message.toLowerCase().includes('relation') || error.code === '42P01') {
      throw new Error(
        'app_snapshots хүснэгт олдсонгүй. supabase/schema.sql-ийг Supabase SQL Editor дээр ажиллуулна уу.',
      )
    }
    throw new Error(error.message)
  }
}
