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
import type { ChartSong } from '../store/types'
import { useStore } from '../store/StoreContext'
import { getOfflineBlobUrl, isOfflineSaved } from '../lib/offlineAudio'

type PlayMode = 'audio' | 'youtube'

type ChartPlayerValue = {
  current: ChartSong | null
  playing: boolean
  progress: number
  duration: number
  playMode: PlayMode
  fullOpen: boolean
  playSong: (song: ChartSong, opts?: { mode?: PlayMode; openFull?: boolean }) => Promise<void>
  setPlayMode: (mode: PlayMode) => void
  openFull: () => void
  closeFull: () => void
  toggle: () => void
  seek: (ratio: number) => void
  stop: () => void
  next: () => void
  prev: () => void
}

const ChartPlayerContext = createContext<ChartPlayerValue | null>(null)

function setMediaSession(
  song: ChartSong | null,
  handlers: {
    play: () => void
    pause: () => void
    next: () => void
    prev: () => void
    stop: () => void
    seek?: (time: number) => void
  },
) {
  if (!('mediaSession' in navigator)) return
  if (!song) {
    navigator.mediaSession.metadata = null
    return
  }
  navigator.mediaSession.metadata = new MediaMetadata({
    title: song.title,
    artist: song.artist,
    album: 'Newsac Music',
    artwork: [
      { src: song.cover, sizes: '512x512', type: 'image/jpeg' },
      { src: song.cover, sizes: '256x256', type: 'image/jpeg' },
    ],
  })
  navigator.mediaSession.setActionHandler('play', handlers.play)
  navigator.mediaSession.setActionHandler('pause', handlers.pause)
  navigator.mediaSession.setActionHandler('previoustrack', handlers.prev)
  navigator.mediaSession.setActionHandler('nexttrack', handlers.next)
  navigator.mediaSession.setActionHandler('stop', handlers.stop)
  try {
    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (typeof details.seekTime === 'number' && handlers.seek) {
        handlers.seek(details.seekTime)
      }
    })
  } catch {
    /* older browsers */
  }
}

export function ChartPlayerProvider({ children }: { children: ReactNode }) {
  const { data, track } = useStore()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const blobUrlRef = useRef<string | null>(null)
  const playlistRef = useRef<ChartSong[]>([])
  const [current, setCurrent] = useState<ChartSong | null>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playMode, setPlayModeState] = useState<PlayMode>('audio')
  const [fullOpen, setFullOpen] = useState(false)

  const playlist = useMemo(
    () => [...data.chartSongs].sort((a, b) => a.rank - b.rank),
    [data.chartSongs],
  )
  playlistRef.current = playlist

  const revokeBlob = () => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
      blobUrlRef.current = null
    }
  }

  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'metadata'
    // iOS / lock-screen friendlier
    audio.setAttribute('playsinline', 'true')
    audioRef.current = audio

    const onTime = () => {
      setProgress(audio.currentTime)
      if ('mediaSession' in navigator && audio.duration) {
        try {
          navigator.mediaSession.setPositionState({
            duration: audio.duration,
            playbackRate: audio.playbackRate,
            position: Math.min(audio.currentTime, audio.duration),
          })
        } catch {
          /* ignore */
        }
      }
    }
    const onMeta = () => setDuration(audio.duration || 0)
    const onEnd = () => {
      setPlaying(false)
      const list = playlistRef.current
      const idx = list.findIndex((s) => s.id === audio.dataset.songId)
      const nextSong = list[idx + 1]
      if (nextSong) {
        void loadAndPlay(nextSong)
      }
    }
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
      revokeBlob()
      audioRef.current = null
    }
    // loadAndPlay defined below — use inline for ended
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadAndPlay = useCallback(
    async (song: ChartSong) => {
      const audio = audioRef.current
      if (!audio) return
      window.dispatchEvent(new Event('newsac-stop-podcast'))
      revokeBlob()
      setCurrent(song)
      setProgress(0)
      audio.dataset.songId = song.id

      let src = song.audioUrl
      if (isOfflineSaved(song.id)) {
        const offline = await getOfflineBlobUrl(song.id)
        if (offline) {
          blobUrlRef.current = offline
          src = offline
        }
      }
      audio.src = src
      try {
        await audio.play()
      } catch {
        /* autoplay / user gesture */
      }
      track('chart_play', song.id)
    },
    [track],
  )

  useEffect(() => {
    const onStop = () => {
      const audio = audioRef.current
      if (audio) {
        audio.pause()
        audio.removeAttribute('src')
        delete audio.dataset.songId
      }
      revokeBlob()
      setCurrent(null)
      setPlaying(false)
      setProgress(0)
      setDuration(0)
    }
    window.addEventListener('newsac-stop-chart', onStop)
    return () => window.removeEventListener('newsac-stop-chart', onStop)
  }, [])

  const setPlayMode = useCallback(
    (mode: PlayMode) => {
      if (mode === 'audio' && current && !current.audioUrl) return
      if (mode === 'youtube' && current && !current.youtubeId) return
      setPlayModeState(mode)
      const audio = audioRef.current
      if (mode === 'youtube') {
        audio?.pause()
        setPlaying(Boolean(current?.youtubeId))
      } else if (current) {
        void loadAndPlay(current)
      }
    },
    [current, loadAndPlay],
  )

  const openFull = useCallback(() => setFullOpen(true), [])
  const closeFull = useCallback(() => setFullOpen(false), [])

  const playSong = useCallback(
    async (song: ChartSong, opts?: { mode?: PlayMode; openFull?: boolean }) => {
      const preferred =
        opts?.mode ?? (!song.audioUrl && song.youtubeId ? 'youtube' : playMode)
      const nextMode =
        preferred === 'youtube' && song.youtubeId
          ? 'youtube'
          : song.audioUrl
            ? 'audio'
            : 'youtube'

      setPlayModeState(nextMode)
      if (opts?.openFull) setFullOpen(true)

      if (nextMode === 'youtube') {
        window.dispatchEvent(new Event('newsac-stop-podcast'))
        audioRef.current?.pause()
        setCurrent(song)
        setPlaying(true)
        track('chart_play', song.id)
        return
      }

      const audio = audioRef.current
      if (!audio) return
      if (current?.id === song.id && playMode === 'audio') {
        if (audio.paused) void audio.play()
        else audio.pause()
        return
      }
      await loadAndPlay(song)
    },
    [current?.id, playMode, loadAndPlay, track],
  )

  const toggle = useCallback(() => {
    if (!current) return
    if (playMode === 'youtube') {
      setPlaying((p) => !p)
      return
    }
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) void audio.play()
    else audio.pause()
  }, [current, playMode])

  const seek = useCallback((ratio: number) => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    audio.currentTime = Math.max(0, Math.min(1, ratio)) * audio.duration
  }, [])

  const seekTime = useCallback((time: number) => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    audio.currentTime = Math.max(0, Math.min(audio.duration, time))
  }, [])

  const stop = useCallback(() => {
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.removeAttribute('src')
      delete audio.dataset.songId
    }
    revokeBlob()
    setCurrent(null)
    setPlaying(false)
    setProgress(0)
    setDuration(0)
    setFullOpen(false)
    setPlayModeState('audio')
    setMediaSession(null, {
      play: () => undefined,
      pause: () => undefined,
      next: () => undefined,
      prev: () => undefined,
      stop: () => undefined,
    })
  }, [])

  const next = useCallback(() => {
    if (!current) return
    const idx = playlist.findIndex((s) => s.id === current.id)
    const song = playlist[idx + 1] || playlist[0]
    if (song) void playSong(song, { mode: playMode })
  }, [current, playlist, playSong, playMode])

  const prev = useCallback(() => {
    if (!current) return
    const audio = audioRef.current
    if (playMode === 'audio' && audio && audio.currentTime > 3) {
      audio.currentTime = 0
      return
    }
    const idx = playlist.findIndex((s) => s.id === current.id)
    const song = playlist[idx - 1] || playlist[playlist.length - 1]
    if (song) void playSong(song, { mode: playMode })
  }, [current, playlist, playSong, playMode])

  useEffect(() => {
    if (!current || playMode === 'youtube') return
    setMediaSession(current, {
      play: () => void audioRef.current?.play(),
      pause: () => audioRef.current?.pause(),
      next,
      prev,
      stop,
      seek: seekTime,
    })
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = playing ? 'playing' : 'paused'
    }
  }, [current, playing, next, prev, stop, seekTime, playMode])

  const value = useMemo(
    () => ({
      current,
      playing,
      progress,
      duration,
      playMode,
      fullOpen,
      playSong,
      setPlayMode,
      openFull,
      closeFull,
      toggle,
      seek,
      stop,
      next,
      prev,
    }),
    [
      current,
      playing,
      progress,
      duration,
      playMode,
      fullOpen,
      playSong,
      setPlayMode,
      openFull,
      closeFull,
      toggle,
      seek,
      stop,
      next,
      prev,
    ],
  )

  return <ChartPlayerContext.Provider value={value}>{children}</ChartPlayerContext.Provider>
}

export function useChartPlayer() {
  const ctx = useContext(ChartPlayerContext)
  if (!ctx) throw new Error('useChartPlayer must be used within ChartPlayerProvider')
  return ctx
}
