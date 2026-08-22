export type NewsComment = {
  id: string
  newsId: string
  authorName: string
  authorId?: string
  text: string
  createdAt: string
}

export type NewsRegion = 'domestic' | 'foreign'

export type NewsItem = {
  id: string
  title: string
  excerpt: string
  body: string
  category: string
  date: string
  readMin: number
  image: string
  /** Дотоод / Гадаад мэдээ */
  region?: NewsRegion
  membersOnly?: boolean
  comments?: NewsComment[]
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
  /** domestic = дотоод, foreign = гадаад */
  region?: 'domestic' | 'foreign'
  /** Verified artist on Newsac */
  verified?: boolean
  /** Linked fan/account email (Gmail) */
  ownerEmail?: string
  /** Supabase user id when claimed */
  ownerUserId?: string
}

export type MembershipTier = 'fan' | 'street' | 'vip'

export type BattleSide = {
  id: string
  name: string
  rapperId?: string
  image: string
  votes: number
}

export type Battle = {
  id: string
  title: string
  subtitle: string
  status: 'open' | 'closed'
  endsAt: string
  cover: string
  sides: [BattleSide, BattleSide]
  city?: string
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

/** Энэ 7 хоногийн Монгол дууны чарт (Spotify + апп дотор сонсох) */
export type ChartSong = {
  id: string
  rank: number
  title: string
  artist: string
  spotifyTrackId: string
  cover: string
  plays: string
  change: number
  weekOf: string
  /** Апп дотор / background сонсох аудио (Media Session) */
  audioUrl: string
  /** YouTube клип (бүтэн player-д) */
  youtubeId?: string
  isNew?: boolean
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
  slot: 'home' | 'videos' | 'shop' | 'news' | 'nba' | 'battle'
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
  /** YouTube ID — video/short drop шууд тоглуулахад */
  youtubeId?: string
}

/** Нүүрний story-rail (Instagram-style дугуйнууд) */
export type HomeStory = {
  id: string
  label: string
  status: string
  href: string
  image: string
  /** YouTube ID / линк — дархад шууд тоглоно */
  youtubeId?: string
  tone: 'drop' | 'live' | 'soon' | 'battle' | 'ticket' | 'default'
  order: number
  active: boolean
}

export type Livestream = {
  id: string
  title: string
  status: 'live' | 'upcoming' | 'ended'
  youtubeId?: string
  startsAt: string
  viewers?: number
  cover: string
  /** Linked artist profile */
  artistId?: string
  hostUserId?: string
  hostName?: string
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
    | 'chart_play'
    | 'battle_vote'
  targetId: string
  amount?: number
  at: string
}

export type AboutPage = {
  name: string
  role: string
  photo: string
  bio: string
  location?: string
}

/** Хуудасны Coming soon / нууцлаг горим */
export type SiteFlags = {
  ticketsClassified: boolean
  shopSoon: boolean
  cypherSoon: boolean
  artistSoon: boolean
  /** Newsac Pass / membership coming soon */
  passSoon: boolean
}

export type NbaStory = {
  id: string
  tag: string
  title: string
  blurb: string
  body: string[]
  when: string
  readMin: number
  image: string
}

export type DeedLigClub = {
  id: string
  name: string
  city: string
  arena?: string
  founded?: string
  image?: string
  blurb?: string
}

export type DeedLigPlayer = {
  id: string
  clubId: string
  name: string
  number: string
  position: string
  height: string
  age: string
  hometown?: string
  image?: string
  note?: string
}

export type NbaHot = {
  id: string
  rank: number
  title: string
  team: string
  heat: string
  blurb: string
  body: string[]
  readMin: number
}

export type NbaFreeAgent = {
  id: string
  rank: number
  name: string
  position: string
  lastTeam: string
  newTeam: string
  age: string
  note: string
  detail: string[]
  fit: string
}

export type NbaQuizQ = {
  id: string
  q: string
  choices: string[]
  answer: number
  explain: string
}

export type NbaSacfunBit = {
  id: string
  title: string
  text: string
}

export type NbaMamba = {
  title: string
  kicker: string
  lead: string
  story: string[]
  points: { h: string; p: string }[]
  quote: string
  takeaway: string
}

/** NBA нүүр — текст + арын зураг Admin-аас */
export type NbaHub = {
  kicker: string
  title: string
  subtitle: string
  heroImage: string
  featuredId?: string
}

export type NbaSacfunVideo = {
  id: string
  youtubeId: string
  title: string
  description?: string
  published?: string
}

export type AppData = {
  news: NewsItem[]
  videos: VideoItem[]
  rappers: Rapper[]
  rankings: RankItem[]
  chartSongs: ChartSong[]
  products: Product[]
  sponsors: Sponsor[]
  polls: Poll[]
  shorts: ShortClip[]
  shows: Show[]
  podcasts: PodcastEpisode[]
  dailyDrops: DailyDrop[]
  homeStories: HomeStory[]
  livestreams: Livestream[]
  wallPosts: WallPost[]
  battles: Battle[]
  nbaUpdates: NbaStory[]
  nbaHotNews: NbaHot[]
  nbaFreeAgents: NbaFreeAgent[]
  nbaQuiz: NbaQuizQ[]
  nbaSacfun: NbaSacfunBit[]
  nbaSacfunVideos: NbaSacfunVideo[]
  nbaMamba: NbaMamba
  nbaHub: NbaHub
  /** Монголын сагсан бөмбөгийн Дээд лиг — ерөнхий мэдээнээс тусдаа */
  deedLigNews: NbaStory[]
  deedLigClubs: DeedLigClub[]
  deedLigPlayers: DeedLigPlayer[]
  lastSacfunYoutubeSync?: string
  /** Нүүр дээрх халуун 3 мэдээний ID (дараалал чухал) */
  homeHotNewsIds: string[]
  about: AboutPage
  siteFlags: SiteFlags
  adminEmails: string[]
  orders: Order[]
  ticketOrders: TicketOrder[]
  subscribers: Subscriber[]
  events: AnalyticsEvent[]
  lastYoutubeSync?: string
  lastCloudSync?: string
  /** Soft-deleted CMS row ids — prevents cloud/seed from resurrecting deletes */
  cmsTombstones?: string[]
}
