import { supabase, supabaseConfigured } from './supabase'

const BUCKET = 'media'

/** Compress image in browser, then upload to Supabase Storage (public URL). */
export async function uploadPublicImage(
  file: File,
  folder = 'uploads',
): Promise<string> {
  if (!supabaseConfigured) {
    throw new Error('Supabase тохируулаагүй')
  }

  const blob = await compressImageBlob(file, 1200, 0.78)
  const path = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.jpg`

  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    contentType: 'image/jpeg',
    upsert: false,
  })

  if (error) {
    throw new Error(
      error.message.includes('Bucket not found')
        ? 'media bucket олдсонгүй. supabase/schema.sql-ийг ажиллуулна уу.'
        : error.message,
    )
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  if (!data?.publicUrl) throw new Error('Зургийн URL авч чадсангүй')
  return data.publicUrl
}

function compressImageBlob(
  file: File,
  maxSide: number,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('read failed'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('image failed'))
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height))
        const w = Math.max(1, Math.round(img.width * scale))
        const h = Math.max(1, Math.round(img.height * scale))
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('canvas'))
          return
        }
        ctx.drawImage(img, 0, 0, w, h)
        canvas.toBlob(
          (blob) => {
            if (!blob) reject(new Error('compress failed'))
            else resolve(blob)
          },
          'image/jpeg',
          quality,
        )
      }
      img.src = String(reader.result)
    }
    reader.readAsDataURL(file)
  })
}
