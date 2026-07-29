import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { PodcastEpisode } from '../store/types'
import { useStore } from '../store/StoreContext'
import { getOfflineBlobUrl, isOfflineSaved } from '../lib/offlineAudio'

type PlayerValue = {
  current: PodcastEpisode | null
  playing: boolean
  progress: number
  duration: number
  playEpisode: (ep: PodcastEpisode) => void
  toggle: () => void
  seek: (ratio: number) => void
  stop: () => void
}

const PlayerContext = createContext<PlayerValue | null>(null)

export function PlayerProvider({ children }: { children: ReactNode }) {
  const { track } = useStore()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const blobUrlRef = useRef<string | null>(null)
  const [current, setCurrent] = useState<PodcastEpisode | null>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'metadata'
    audioRef.current = audio

    const onTime = () => setProgress(audio.currentTime)
    const onMeta = () => setDuration(audio.duration || 0)
    const onEnd = () => setPlaying(false)
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)

    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('ended', onEnd)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    return () => {
      audio.pause()
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('ended', onEnd)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current)
      audioRef.current = null
    }
  }, [])

  const playEpisode = useCallback(
    async (ep: PodcastEpisode) => {
      const audio = audioRef.current
      if (!audio) return
      if (current?.id === ep.id) {
        if (audio.paused) void audio.play()
        else audio.pause()
        return
      }

      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current)
        blobUrlRef.current = null
      }

      setCurrent(ep)
      setProgress(0)

      let src = ep.audioUrl
      if (isOfflineSaved(ep.id)) {
        const offline = await getOfflineBlobUrl(ep.id)
        if (offline) {
          blobUrlRef.current = offline
          src = offline
        }
      }

      audio.src = src
      void audio.play()
      track('podcast_play', ep.id)
    },
    [current?.id, track],
  )

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !current) return
    if (audio.paused) void audio.play()
    else audio.pause()
  }, [current])

  const seek = useCallback((ratio: number) => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    audio.currentTime = Math.max(0, Math.min(1, ratio)) * audio.duration
  }, [])

  const stop = useCallback(() => {
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.removeAttribute('src')
    }
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
      blobUrlRef.current = null
    }
    setCurrent(null)
    setPlaying(false)
    setProgress(0)
    setDuration(0)
  }, [])

  const value = useMemo(
    () => ({ current, playing, progress, duration, playEpisode, toggle, seek, stop }),
    [current, playing, progress, duration, playEpisode, toggle, seek, stop],
  )

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider')
  return ctx
}
