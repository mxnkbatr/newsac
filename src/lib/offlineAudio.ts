const DB_NAME = 'newsac_offline_audio'
const STORE = 'episodes'
const META_KEY = 'newsac_offline_meta'

export type OfflineMeta = {
  id: string
  title: string
  cover: string
  duration: string
  savedAt: string
  blobOk: boolean
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE)
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export function listOfflineMeta(): OfflineMeta[] {
  try {
    return JSON.parse(localStorage.getItem(META_KEY) || '[]') as OfflineMeta[]
  } catch {
    return []
  }
}

function saveMeta(list: OfflineMeta[]) {
  localStorage.setItem(META_KEY, JSON.stringify(list))
}

export function isOfflineSaved(id: string): boolean {
  return listOfflineMeta().some((m) => m.id === id)
}

export async function getOfflineBlobUrl(id: string): Promise<string | null> {
  try {
    const db = await openDb()
    const blob = await new Promise<Blob | undefined>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly')
      const req = tx.objectStore(STORE).get(id)
      req.onsuccess = () => resolve(req.result as Blob | undefined)
      req.onerror = () => reject(req.error)
    })
    db.close()
    if (!blob) return null
    return URL.createObjectURL(blob)
  } catch {
    return null
  }
}

export async function saveOfflineEpisode(ep: {
  id: string
  title: string
  cover: string
  duration: string
  audioUrl: string
}): Promise<{ ok: boolean; blobOk: boolean; error?: string }> {
  let blobOk = false
  try {
    const res = await fetch(ep.audioUrl)
    if (!res.ok) throw new Error('fetch failed')
    const blob = await res.blob()
    const db = await openDb()
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite')
      tx.objectStore(STORE).put(blob, ep.id)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
    db.close()
    blobOk = true
  } catch {
    blobOk = false
  }

  const list = listOfflineMeta().filter((m) => m.id !== ep.id)
  list.unshift({
    id: ep.id,
    title: ep.title,
    cover: ep.cover,
    duration: ep.duration,
    savedAt: new Date().toISOString(),
    blobOk,
  })
  saveMeta(list)

  return {
    ok: true,
    blobOk,
    error: blobOk
      ? undefined
      : 'CORS/сүлжээний шалтгаанаар аудио файл хадгалагдаагүй. Метадата хадгалагдлаа.',
  }
}

export async function removeOfflineEpisode(id: string): Promise<void> {
  try {
    const db = await openDb()
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite')
      tx.objectStore(STORE).delete(id)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
    db.close()
  } catch {
    /* ignore */
  }
  saveMeta(listOfflineMeta().filter((m) => m.id !== id))
}
