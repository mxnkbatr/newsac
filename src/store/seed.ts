import type { AppData } from './types'
import { news, videos, rappers, rankings } from '../data/content'

export const ADMIN_PASSWORD = 'newsac2026'

/** Утасны дугаар — admin нэвтрэх код */
export const ADMIN_PHONES = ['99918122', '90939291'] as const

export function normalizePhone(value: string) {
  return value.replace(/\D/g, '')
}

export function isAdminCredential(value: string) {
  const raw = value.trim()
  if (raw === ADMIN_PASSWORD) return true
  const phone = normalizePhone(raw)
  return (ADMIN_PHONES as readonly string[]).includes(phone)
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
        teaser: 'Өчигдрийн халуун бичлэг — дахин үзэхэд бэлэн.',
        image:
          'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80',
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
    orders: [],
    ticketOrders: [],
    subscribers: [],
    events: [],
    lastYoutubeSync: undefined,
  }
}
