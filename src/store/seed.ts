import type { AppData } from './types'
import { news, videos, rappers, rankings } from '../data/content'
import { seedDeedLigClubs, seedDeedLigPlayers } from '../data/deedLig'
import {
  freeAgents,
  mambaMentality,
  nbaQuiz,
  nbaUpdates,
  sacfunBits,
} from '../data/nba'

export const ADMIN_PASSWORD = 'newsac2026'

/** Утасны дугаар — admin нэвтрэх код */
export const ADMIN_PHONES = ['99918122', '90939291'] as const

/** Built-in admin Gmails (production works even if env missing at build). */
export const DEFAULT_ADMIN_EMAILS = [
  'd.monkh2007@gmail.com',
  'tsbatbaatar99@gmail.com',
] as const

/** Зөвхөн Дээд Лиг мэдээ засах эрхтэй editor Gmail-ууд */
export const DEED_LIG_EDITOR_EMAILS = [
  'khishigtbolorerdene@gmail.com',
] as const

export function normalizePhone(value: string) {
  return value.replace(/\D/g, '')
}

export function envAdminEmails(): string[] {
  const raw = import.meta.env.VITE_ADMIN_EMAILS as string | undefined
  const fromEnv = raw
    ? raw
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
    : []
  return Array.from(
    new Set([...DEFAULT_ADMIN_EMAILS.map((e) => e.toLowerCase()), ...fromEnv]),
  )
}

export function isAdminCredential(value: string) {
  const raw = value.trim()
  if (raw === ADMIN_PASSWORD) return true
  const phone = normalizePhone(raw)
  return (ADMIN_PHONES as readonly string[]).includes(phone)
}

export function isAdminEmail(email: string, list: string[]) {
  const e = email.trim().toLowerCase()
  return Boolean(e) && list.map((x) => x.toLowerCase()).includes(e)
}

export function isDeedLigEditorEmail(email: string) {
  const e = email.trim().toLowerCase()
  return Boolean(e) && (DEED_LIG_EDITOR_EMAILS as readonly string[]).includes(e)
}

export function createSeed(): AppData {
  const seededVideos = videos.map((v, i) =>
    i === 0 ? { ...v, earlyAccess: true } : v,
  )
  const seededNews = news.map((n, i) =>
    i === 1 ? { ...n, membersOnly: true } : n,
  )

  return {
    news: seededNews,
    videos: seededVideos,
    rappers,
    rankings: rankings.map((r, i) => ({ ...r, hot: i < 3 })),
    chartSongs: [
      {
        id: 'chart-1',
        rank: 1,
        title: 'UB Night',
        artist: 'Thunder',
        spotifyTrackId: '0VjIjW4GlUZAMYd2vXMi3b',
        cover:
          'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?auto=format&fit=crop&w=400&q=80',
        plays: '1.2M',
        change: 2,
        weekOf: new Date().toISOString().slice(0, 10),
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        youtubeId: 'UryRJd1vWoY',
        isNew: true,
      },
      {
        id: 'chart-2',
        rank: 2,
        title: 'Glass City',
        artist: 'Luna Vee',
        spotifyTrackId: '7qiZfU4dY1lWllzX7mPBI3',
        cover:
          'https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&w=400&q=80',
        plays: '980K',
        change: 0,
        weekOf: new Date().toISOString().slice(0, 10),
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        youtubeId: '0THTfeMzZx8',
        isNew: true,
      },
      {
        id: 'chart-3',
        rank: 3,
        title: 'Neon 88',
        artist: 'NEON.88',
        spotifyTrackId: '3n3Ppam7vgaVa1iaRMc98X',
        cover:
          'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=400&q=80',
        plays: '870K',
        change: 1,
        weekOf: new Date().toISOString().slice(0, 10),
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        youtubeId: 'EpTCrO5BjiQ',
        isNew: true,
      },
      {
        id: 'chart-4',
        rank: 4,
        title: 'Northbound',
        artist: 'Khaan',
        spotifyTrackId: '0eGsygTp906u18L0Oimnem',
        cover:
          'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80',
        plays: '720K',
        change: -1,
        weekOf: new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10),
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        youtubeId: 'dIhMXJG0wec',
      },
      {
        id: 'chart-5',
        rank: 5,
        title: 'Block Cypher',
        artist: 'Crew X',
        spotifyTrackId: '2takcwOaAZWiXQijPHIx7B',
        cover:
          'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=400&q=80',
        plays: '640K',
        change: 3,
        weekOf: new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10),
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        youtubeId: 'UryRJd1vWoY',
        isNew: true,
      },
      {
        id: 'chart-6',
        rank: 6,
        title: 'Market Fire',
        artist: 'Newsac',
        spotifyTrackId: '4uLU6hMCjMI75M1A2tKUQC',
        cover:
          'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=400&q=80',
        plays: '510K',
        change: -2,
        weekOf: new Date(Date.now() - 5 * 86400000).toISOString().slice(0, 10),
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
        youtubeId: '0THTfeMzZx8',
      },
      {
        id: 'chart-7',
        rank: 7,
        title: 'Afterparty',
        artist: 'Thunder · Luna Vee',
        spotifyTrackId: '5CQ30W69DwJxW7d5688wlp',
        cover:
          'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80',
        plays: '490K',
        change: 0,
        weekOf: new Date(Date.now() - 4 * 86400000).toISOString().slice(0, 10),
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
        youtubeId: 'EpTCrO5BjiQ',
      },
      {
        id: 'chart-8',
        rank: 8,
        title: 'UG Session',
        artist: 'Underground',
        spotifyTrackId: '1zHlj4dQ8ZAtrayhuDDmkY',
        cover:
          'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=400&q=80',
        plays: '420K',
        change: 4,
        weekOf: new Date(Date.now() - 1 * 86400000).toISOString().slice(0, 10),
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
        youtubeId: 'dIhMXJG0wec',
        isNew: true,
      },
    ],
    products: [
      {
        id: 'tee-red',
        name: 'Newsac Red Tee',
        description: 'Улаан логотой limited street tee.',
        price: 89000,
        type: 'merch',
        image:
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
        stock: 40,
        active: true,
      },
      {
        id: 'hoodie',
        name: 'Newsac Hoodie',
        description: 'Хар hoodie, халуун drop.',
        price: 189000,
        type: 'merch',
        image:
          'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80',
        stock: 25,
        active: true,
      },
      {
        id: 'sticker',
        name: 'Logo Sticker Pack',
        description: '5ш flame sticker pack.',
        price: 15000,
        type: 'merch',
        image:
          'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=800&q=80',
        stock: 200,
        active: true,
      },
      {
        id: 'report-pdf',
        name: '7 хоногийн зах зээлийн тайлан (PDF)',
        description: 'Exclusive digital шинжилгээ — гишүүдэд early.',
        price: 29000,
        type: 'digital',
        image:
          'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
        stock: 999,
        active: true,
      },
      {
        id: 'tip-fire',
        name: 'Fire tip — дэмжих',
        description: 'Newsac-ийг нэг Fire-аар дэмж.',
        price: 5000,
        type: 'tip',
        image: '/logo.png',
        stock: 9999,
        active: true,
      },
    ],
    sponsors: [
      {
        id: 'sp-beat',
        name: 'BeatLab UG',
        tagline: 'Профессионал бит · 24ц delivery',
        url: 'https://www.youtube.com/@Newsacchannel',
        image:
          'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=900&q=80',
        slot: 'home',
        active: true,
        cpm: 120000,
      },
      {
        id: 'sp-merch',
        name: 'Street Drop MN',
        tagline: 'Хип-хоп merch · УБ delivery',
        url: 'https://www.youtube.com/@Newsacchannel',
        image:
          'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80',
        slot: 'videos',
        active: true,
        cpm: 90000,
      },
    ],
    polls: [
      {
        id: 'poll-next',
        question: 'Дараагийн бичлэгийн сэдэв юу байх вэ?',
        active: true,
        endsAt: '2026-08-10',
        options: [
          { id: 'o1', label: 'Дотоодын чарт дайн', votes: 128 },
          { id: 'o2', label: 'Producer орлого', votes: 94 },
          { id: 'o3', label: 'Эмэгтэй рэпперүүд', votes: 151 },
          { id: 'o4', label: 'UG vs Mainstream', votes: 77 },
        ],
      },
    ],
    shorts: [
      {
        id: 's1',
        title: 'Наадмын халуун мөч',
        youtubeId: 'UryRJd1vWoY',
        start: 12,
        rapperId: 'neon',
      },
      {
        id: 's2',
        title: 'Дэлхийн зах зээлийн 40 сек',
        youtubeId: '0THTfeMzZx8',
        start: 30,
        rapperId: 'luna',
      },
      {
        id: 's3',
        title: 'Америк хип-хоп бужигналт',
        youtubeId: 'EpTCrO5BjiQ',
        start: 18,
        rapperId: 'thunder',
      },
      {
        id: 's4',
        title: 'Монголын урлагийн тойм',
        youtubeId: 'dIhMXJG0wec',
        start: 22,
        rapperId: 'khaan',
      },
    ],
    shows: [
      {
        id: 'show-night-ub',
        title: 'NEWSAС NIGHT · UB',
        artists: 'Thunder · Luna Vee · NEON.88 · guests',
        venue: 'ASIC Arena',
        city: 'Улаанбаатар',
        date: '2026.08.22',
        time: '20:00',
        image:
          'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1400&q=80',
        description:
          'Монголын хип-хоп зах зээлийн хамгийн халуун шөнө. Live set, surprise guests, afterparty.',
        price: 89000,
        vipPrice: 189000,
        seatsLeft: 420,
        vipLeft: 60,
        active: true,
      },
      {
        id: 'show-darkhan',
        title: 'NORTHBOUND LIVE',
        artists: 'Khaan · Crew X · openers',
        venue: 'Darkhan Cultural Hall',
        city: 'Дархан',
        date: '2026.09.05',
        time: '19:30',
        image:
          'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1400&q=80',
        description: 'Хойд бүсэд зориулсан story-telling рэп шөнө. Limited seats.',
        price: 55000,
        vipPrice: 99000,
        seatsLeft: 180,
        vipLeft: 30,
        active: true,
      },
      {
        id: 'show-cypher',
        title: 'UG CYPHER SESSION',
        artists: 'Underground lineup',
        venue: 'Block Studio',
        city: 'Улаанбаатар',
        date: '2026.08.12',
        time: '21:00',
        image:
          'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?auto=format&fit=crop&w=1400&q=80',
        description: 'Жижиг танхим, өндөр энерги. First come, first served.',
        price: 35000,
        vipPrice: 65000,
        seatsLeft: 90,
        vipLeft: 15,
        active: true,
      },
    ],
    podcasts: [
      {
        id: 'pod-1',
        title: 'Зах зээлийн 7 хоног · Ep.42',
        description: 'Чарт, стрим, концерт борлуулалт — долоо хоногийн шууд тойм.',
        cover:
          'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        duration: '48:12',
        published: '2 өдрийн өмнө',
        guests: 'Newsac',
      },
      {
        id: 'pod-2',
        title: 'Producer corner · Beat economy',
        description: 'Бит үнэ, эрх, орлогын бодит тоо — producer-тай ярилцлага.',
        cover:
          'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        duration: '36:40',
        published: '1 долоо хоногийн өмнө',
        guests: 'Guest producer',
      },
      {
        id: 'pod-3',
        title: 'Luna Vee · Glass City story',
        description: 'Melodic wave, брэндийн замнал, фэн бааз — deep conversation.',
        cover:
          'https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&w=800&q=80',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        duration: '52:05',
        published: '2 долоо хоногийн өмнө',
        guests: 'Luna Vee',
        membersOnly: true,
      },
      {
        id: 'pod-4',
        title: 'UG vs Mainstream · шугам хаана вэ?',
        description: 'Хоёр ертөнцийн хооронд — үзэгчид, орлого, имидж.',
        cover:
          'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        duration: '41:18',
        published: '3 долоо хоногийн өмнө',
        guests: 'Panel',
      },
    ],
    dailyDrops: [
      {
        id: 'drop-today',
        date: new Date().toISOString().slice(0, 10),
        title: 'Өнөөдрийн Drop · Зах зээлийн 7 хоног',
        kind: 'podcast',
        targetId: 'pod-1',
        teaser: 'Чарт, стрим, концерт — долоо хоногийн шууд тойм. Сонсоод өдрийг эхлүүл.',
        image:
          'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'drop-yesterday',
        date: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
        title: 'Видео Drop · HOT TRACKS',
        kind: 'video',
        targetId: 'v1',
        youtubeId: 'UryRJd1vWoY',
        teaser: 'Өчигдрийн халуун бичлэг — дахин үзэхэд бэлэн.',
        image: 'https://i.ytimg.com/vi/UryRJd1vWoY/hqdefault.jpg',
      },
    ],
    homeStories: [
      {
        id: 'story-new',
        label: 'Шинэ',
        status: 'ШИНЭ',
        href: '/videos',
        youtubeId: 'UryRJd1vWoY',
        image: 'https://i.ytimg.com/vi/UryRJd1vWoY/hqdefault.jpg',
        tone: 'drop',
        order: 1,
        active: true,
      },
      {
        id: 'story-live',
        label: 'Шууд',
        status: 'LIVE',
        href: '/live',
        youtubeId: 'jfKfPfyJRdk',
        image: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg',
        tone: 'live',
        order: 2,
        active: true,
      },
      {
        id: 'story-reel',
        label: 'Reels',
        status: 'REEL',
        href: '/reels',
        youtubeId: '0THTfeMzZx8',
        image: 'https://i.ytimg.com/vi/0THTfeMzZx8/hqdefault.jpg',
        tone: 'drop',
        order: 3,
        active: true,
      },
      {
        id: 'story-hot',
        label: 'Hot',
        status: 'HOT',
        href: '/videos',
        youtubeId: 'EpTCrO5BjiQ',
        image: 'https://i.ytimg.com/vi/EpTCrO5BjiQ/hqdefault.jpg',
        tone: 'default',
        order: 4,
        active: true,
      },
    ],
    livestreams: [
      {
        id: 'live-1',
        title: 'NEWSAС LIVE · Chart Night',
        status: 'upcoming',
        youtubeId: 'jfKfPfyJRdk',
        startsAt: new Date(Date.now() + 2 * 3600000).toISOString(),
        viewers: 0,
        cover:
          'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=80',
      },
      {
        id: 'live-2',
        title: 'UG Cypher · Open Mic',
        status: 'ended',
        youtubeId: 'DWcJFNfaw9c',
        startsAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        viewers: 1840,
        cover:
          'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?auto=format&fit=crop&w=1400&q=80',
      },
    ],
    wallPosts: [
      {
        id: 'wall-1',
        authorName: 'Thunder',
        authorId: 'demo-thunder',
        text: 'Шинэ бит дээр сууж байна. UB night-д юу дуулмаар байна вэ?',
        image:
          'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?auto=format&fit=crop&w=900&q=80',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        fires: 128,
        colds: 4,
        comments: [
          {
            id: 'wc-1',
            postId: 'wall-1',
            authorName: 'Luna',
            text: 'Drop that hook 🔥',
            createdAt: new Date(Date.now() - 1800000).toISOString(),
          },
        ],
      },
      {
        id: 'wall-2',
        authorName: 'Newsac Crew',
        text: 'Өнөөдрийн drop гарлаа — podcast-оо сонсоод ир.',
        image:
          'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=900&q=80',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        fires: 89,
        colds: 2,
        comments: [],
      },
      {
        id: 'wall-3',
        authorName: 'NEON.88',
        text: 'Studio light. Midnight session. No filter.',
        image:
          'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=900&q=80',
        createdAt: new Date(Date.now() - 14400000).toISOString(),
        fires: 210,
        colds: 7,
        comments: [
          {
            id: 'wc-2',
            postId: 'wall-3',
            authorName: 'Khaan',
            text: 'Cold take: this beat slaps.',
            createdAt: new Date(Date.now() - 10000000).toISOString(),
          },
        ],
      },
      {
        id: 'wall-4',
        authorName: 'Fan_UB',
        text: 'Rankings-ийн #1 хэн байх ёстой вэ? Миний санал — Luna Vee.',
        createdAt: new Date(Date.now() - 28800000).toISOString(),
        fires: 56,
        colds: 12,
        comments: [],
      },
      {
        id: 'wall-5',
        authorName: 'Luna Vee',
        text: 'Glass City tour teaser удахгүй. Stay close.',
        image:
          'https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&w=900&q=80',
        createdAt: new Date(Date.now() - 43200000).toISOString(),
        fires: 340,
        colds: 3,
        comments: [],
      },
    ],
    battles: [],
    nbaUpdates: [...nbaUpdates],
    nbaHotNews: [],
    nbaFreeAgents: [...freeAgents],
    nbaQuiz: [...nbaQuiz],
    nbaSacfun: [...sacfunBits],
    nbaSacfunVideos: [],
    nbaMamba: { ...mambaMentality, story: [...mambaMentality.story], points: mambaMentality.points.map((p) => ({ ...p })) },
    nbaHub: {
      kicker: 'Newsac · Basketball',
      title: 'NBA',
      subtitle: 'Доорх filter-оос хэсгээ сонгоод орно.',
      heroImage:
        'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1600&q=80',
      featuredId: '',
    },
    deedLigNews: [],
    deedLigClubs: seedDeedLigClubs.map((c) => ({ ...c })),
    deedLigPlayers: seedDeedLigPlayers.map((p) => ({ ...p })),
    homeHotNewsIds: seededNews.slice(0, 3).map((n) => n.id),
    about: {
      name: 'Цэндийн Батбаатар',
      role: 'Үүсгэн байгуулагч · Newsac',
      photo:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80',
      bio: 'Newsac — хөгжим, спорт, соёл, энтертайнментийн ертөнцийг нэг дороос мэдрэх дижитал экосистем.',
      location: 'Улаанбаатар',
    },
    siteFlags: {
      ticketsClassified: true,
      shopSoon: true,
      cypherSoon: true,
      artistSoon: true,
      passSoon: true,
    },
    adminEmails: envAdminEmails(),
    orders: [],
    ticketOrders: [],
    subscribers: [],
    events: [],
    lastYoutubeSync: undefined,
    lastSacfunYoutubeSync: undefined,
    lastCloudSync: undefined,
    cmsTombstones: [],
  }
}
