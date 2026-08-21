import type { AppData } from '../store/types'

export type AdminTab =
  | 'hub'
  | 'analytics'
  | 'news'
  | 'videos'
  | 'rappers'
  | 'shop'
  | 'tickets'
  | 'podcasts'
  | 'drop'
  | 'stories'
  | 'live'
  | 'wall'
  | 'sponsors'
  | 'audience'
  | 'staff'
  | 'about'
  | 'chart'
  | 'sync'
  | 'cloud'
  | 'battle'
  | 'polls'
  | 'reels'
  | 'pages'
  | 'nba'
  | 'deedLig'

export type HubItem = {
  id: AdminTab
  label: string
  page?: string
  count: number
  ready: boolean
  note: string
}

export type HubStage = {
  step: number
  title: string
  desc: string
  items: HubItem[]
}

export function buildHubStages(data: AppData): HubStage[] {
  const flags = data.siteFlags || {
    ticketsClassified: true,
    shopSoon: true,
    cypherSoon: true,
    artistSoon: true,
    passSoon: true,
  }
  const domesticNews = data.news.filter((n) => n.region !== 'foreign' && n.region !== 'yellow').length
  const foreignNews = data.news.filter((n) => n.region === 'foreign').length
  const yellowNews = data.news.filter((n) => n.region === 'yellow').length
  const domesticRap = data.rappers.filter((r) => r.region !== 'foreign').length
  const foreignRap = data.rappers.filter((r) => r.region === 'foreign').length

  return [
    {
      step: 1,
      title: 'Мэдээ · Мэдээлэл',
      desc: 'Дотоод / гадаад / шар мэдээ — хамгийн түрүүнд',
      items: [
        {
          id: 'news',
          label: 'Мэдээ',
          page: '/news',
          count: data.news.length,
          ready: true,
          note: `Дотоод ${domesticNews} · Гадаад ${foreignNews} · Шар ${yellowNews}`,
        },
        {
          id: 'news',
          label: 'Халуун 3 мэдээ (нүүр)',
          page: '/',
          count: (data.homeHotNewsIds || []).length,
          ready: true,
          note: 'Home lead кард',
        },
      ],
    },
    {
      step: 2,
      title: 'NBA · Дээд Лиг',
      desc: 'NBA болон Монголын сагсан бөмбөгийн мэдээлэл тусдаа',
      items: [
        {
          id: 'nba',
          label: 'NBA төв',
          page: '/nba',
          count:
            (data.nbaUpdates?.length || 0) +
            (data.nbaFreeAgents?.length || 0),
          ready: true,
          note: 'Бүх NBA хэсэг',
        },
        {
          id: 'deedLig',
          label: 'Дээд Лиг',
          page: '/deed-lig',
          count: (data.deedLigNews?.length || 0) + (data.deedLigClubs?.length || 0),
          ready: true,
          note: 'Мэдээлэл + клубууд',
        },
      ],
    },
    {
      step: 3,
      title: 'Нүүр · Story',
      desc: 'Апп нээгдэхэд харагдах хэсэг',
      items: [
        {
          id: 'stories',
          label: 'Story дугуйнууд',
          page: '/',
          count: data.homeStories.filter((s) => s.active).length,
          ready: true,
          note: 'YouTube story',
        },
        {
          id: 'drop',
          label: 'Daily Drop',
          page: '/',
          count: data.dailyDrops.length,
          ready: true,
          note: 'Өдөр бүрийн featured',
        },
        {
          id: 'videos',
          label: 'Бичлэг',
          page: '/videos',
          count: data.videos.length,
          ready: true,
          note: 'YouTube',
        },
        {
          id: 'podcasts',
          label: 'Podcast',
          page: '/podcasts',
          count: data.podcasts.length,
          ready: true,
          note: 'Audio / episode',
        },
      ],
    },
    {
      step: 4,
      title: 'Артистууд',
      desc: 'Дотоод + гадаад',
      items: [
        {
          id: 'rappers',
          label: 'Рэппер / Артист',
          page: '/rappers',
          count: data.rappers.length,
          ready: true,
          note: `Дотоод ${domesticRap} · Гадаад ${foreignRap}`,
        },
        {
          id: 'pages',
          label: 'Artist Profile хуудас',
          page: '/artist',
          count: 1,
          ready: true,
          note: flags.artistSoon ? 'Coming soon ON' : 'Нээлттэй',
        },
      ],
    },
    {
      step: 5,
      title: 'Live · Community',
      desc: 'Шууд, wall, battle, чарт, poll',
      items: [
        {
          id: 'live',
          label: 'Live нэвтрүүлэг',
          page: '/live',
          count: data.livestreams.length,
          ready: true,
          note: 'Countdown / embed',
        },
        {
          id: 'wall',
          label: 'Community Wall',
          page: '/wall',
          count: data.wallPosts.length,
          ready: true,
          note: 'Пост удирдлага',
        },
        {
          id: 'battle',
          label: 'Battle / Cypher',
          page: '/battle',
          count: data.battles.length,
          ready: true,
          note: 'Фэн санал',
        },
        {
          id: 'chart',
          label: 'Топ дуу',
          page: '/music',
          count: data.chartSongs.length,
          ready: true,
          note: 'Чарт',
        },
        {
          id: 'polls',
          label: 'Санал асуулга',
          page: '/',
          count: data.polls.length,
          ready: true,
          note: 'Poll widget',
        },
      ],
    },
    {
      step: 6,
      title: 'Commerce · Реклам',
      desc: 'Тасалбар, дэлгүүр, sponsor',
      items: [
        {
          id: 'tickets',
          label: 'Тасалбар',
          page: '/tickets',
          count: data.shows.length,
          ready: true,
          note: flags.ticketsClassified ? 'CLASSIFIED' : 'Ил',
        },
        {
          id: 'shop',
          label: 'Shop',
          page: '/shop',
          count: data.products.length,
          ready: true,
          note: flags.shopSoon ? 'Coming soon' : 'Нээлттэй',
        },
        {
          id: 'sponsors',
          label: 'Реклам',
          page: '/news',
          count: data.sponsors.filter((s) => s.active).length,
          ready: true,
          note: 'Мэдээ · NBA · Battle',
        },
      ],
    },
    {
      step: 7,
      title: 'Систем',
      desc: 'Тухай, staff, sync, cloud',
      items: [
        {
          id: 'about',
          label: 'Тухай',
          page: '/about',
          count: data.about?.name ? 1 : 0,
          ready: true,
          note: data.about?.name || 'Хоосон',
        },
        {
          id: 'pages',
          label: 'Хуудасны горим',
          count: 4,
          ready: true,
          note: 'Soon / Classified',
        },
        {
          id: 'staff',
          label: 'Staff Gmail',
          count: data.adminEmails.length,
          ready: true,
          note: 'Admin эрх',
        },
        {
          id: 'sync',
          label: 'YouTube sync',
          count: data.lastYoutubeSync ? 1 : 0,
          ready: true,
          note: data.lastYoutubeSync
            ? new Date(data.lastYoutubeSync).toLocaleString('mn-MN')
            : 'Хоосон',
        },
        {
          id: 'cloud',
          label: 'Cloud sync',
          count: data.lastCloudSync ? 1 : 0,
          ready: true,
          note: data.lastCloudSync
            ? new Date(data.lastCloudSync).toLocaleString('mn-MN')
            : 'Хоосон',
        },
        {
          id: 'analytics',
          label: 'Аналитик',
          count: data.events.length,
          ready: true,
          note: 'Клик · орлого',
        },
        {
          id: 'audience',
          label: 'Жагсаалт',
          count: data.subscribers.length + data.orders.length,
          ready: true,
          note: 'Subscriber · захиалга',
        },
      ],
    },
  ]
}
