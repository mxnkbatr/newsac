import { supabase, supabaseConfigured } from './supabase'

export type CloudHealth =
  | { ok: true; configured: true; signedIn: boolean; email?: string }
  | { ok: false; configured: false; signedIn: false; reason: string }
  | { ok: false; configured: true; signedIn: false; reason: string }

export async function getCloudHealth(): Promise<CloudHealth> {
  if (!supabaseConfigured) {
    return {
      ok: false,
      configured: false,
      signedIn: false,
      reason: 'Supabase тохируулаагүй (VITE_SUPABASE_URL / KEY).',
    }
  }
  const { data } = await supabase.auth.getSession()
  const email = data.session?.user?.email
  if (!data.session) {
    return {
      ok: false,
      configured: true,
      signedIn: false,
      reason: 'Бусад төхөөрөмжид гаргахын тулд Gmail-ээр нэвтэрнэ үү.',
    }
  }
  return { ok: true, configured: true, signedIn: true, email: email || undefined }
}
