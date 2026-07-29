export type NewsItem = {
  id: string
  title: string
  excerpt: string
  body: string
  category: string
  date: string
  readMin: number
  image: string
  membersOnly?: boolean
}

export type VideoItem = {
  id: string
  youtubeId: string
  title: string
  description: string
  views: string
  duration: string
  published: string
  membersOnly?: boolean
  earlyAccess?: boolean
}

export type Rapper = {
  id: string
  name: string
  aka: string
  city: string
  years: string
  bio: string
  story: string
  image: string
  tags: string[]
  streams: string
}

export type RankItem = {
  id: string
  name: string
  track: string
  score: number
  change: number
  streams: string
  hot?: boolean
}

export type Product = {
  id: string
  name: string
  description: string
  price: number
  type: 'merch' | 'digital' | 'tip'
  image: string
  stock: number
  active: boolean
}

export type Sponsor = {
  id: string
  name: string
  tagline: string
  url: string
  image: string
  slot: 'home' | 'videos' | 'shop'
  active: boolean
  cpm: number
}

export type PollOption = { id: string; label: string; votes: number }
export type Poll = {
  id: string
  question: string
  options: PollOption[]
  active: boolean
  endsAt: string
}

export type ShortClip = {
  id: string
  title: string
  youtubeId: string
  start: number
  rapperId?: string
}

export type Order = {
  id: string
  items: { productId: string; name: string; qty: number; price: number }[]
  total: number
  method: 'qpay' | 'socialpay' | 'card'
  createdAt: string
  email: string
}

export type Show = {
  id: string
  title: string
  artists: string
  venue: string
  city: string
  date: string
  time: string
  image: string
  description: string
  price: number
  vipPrice: number
  seatsLeft: number
  vipLeft: number
  active: boolean
}

export type TicketOrder = {
  id: string
  showId: string
  showTitle: string
  tier: 'standard' | 'vip'
  qty: number
  unitPrice: number
  total: number
  method: 'qpay' | 'socialpay' | 'card'
  email: string
  createdAt: string
  code: string
}

export type PodcastEpisode = {
  id: string
  title: string
  description: string
  cover: string
  audioUrl: string
  duration: string
  published: string
  guests?: string
  membersOnly?: boolean
}

export type DailyDrop = {
  id: string
  date: string
  title: string
  kind: 'news' | 'video' | 'podcast' | 'short'
  targetId: string
  teaser: string
  image: string
}

export type Livestream = {
  id: string
  title: string
  status: 'live' | 'upcoming' | 'ended'
  youtubeId?: string
  startsAt: string
  viewers?: number
  cover: string
}

export type WallComment = {
  id: string
  postId: string
  authorName: string
  authorId?: string
  text: string
  createdAt: string
}

export type WallPost = {
  id: string
  authorName: string
  authorId?: string
  text: string
  image?: string
  createdAt: string
  fires: number
  colds: number
  comments: WallComment[]
}

export type Subscriber = {
  id: string
  channel: 'email' | 'telegram'
  value: string
  createdAt: string
}

export type AnalyticsEvent = {
  id: string
  type:
    | 'news_click'
    | 'video_click'
    | 'rapper_favorite'
    | 'shop_purchase'
    | 'ticket_purchase'
    | 'sponsor_click'
    | 'short_view'
    | 'poll_vote'
    | 'podcast_play'
    | 'wall_post'
    | 'live_view'
  targetId: string
  amount?: number
  at: string
}

export type AppData = {
  news: NewsItem[]
  videos: VideoItem[]
  rappers: Rapper[]
  rankings: RankItem[]
  products: Product[]
  sponsors: Sponsor[]
  polls: Poll[]
  shorts: ShortClip[]
  shows: Show[]
  podcasts: PodcastEpisode[]
  dailyDrops: DailyDrop[]
  livestreams: Livestream[]
  wallPosts: WallPost[]
  orders: Order[]
  ticketOrders: TicketOrder[]
  subscribers: Subscriber[]
  events: AnalyticsEvent[]
  lastYoutubeSync?: string
}
