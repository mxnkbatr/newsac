import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { createSeed, isAdminCredential, isAdminEmail } from './seed'
import type {
  AnalyticsEvent,
  AppData,
  Battle,
  DailyDrop,
  Livestream,
  NewsItem,
  Order,
  Poll,
  Product,
  Rapper,
  RankItem,
  ChartSong,
  ShortClip,
  Show,
  PodcastEpisode,
  Sponsor,
  Subscriber,
  TicketOrder,
  VideoItem,
  WallPost,
  WallComment,
} from './types'
import { YOUTUBE_CHANNEL_URL } from '../data/brand'
import {
  fetchChannelVideos,
  fetchMongolianYouTubeChart,
} from '../lib/youtubeChart'
import { pullAppSnapshot, pushAppSnapshot } from '../lib/cloudSync'

const DATA_KEY = 'newsac_app_data_v6'
const ADMIN_KEY = 'newsac_admin_session'

type CartLine = { productId: string; qty: number }

type StoreValue = {
  data: AppData
  cart: CartLine[]
  isAdmin: boolean
  adminLogin: (password: string) => string | null
  adminLogout: () => void
  grantAdmin: () => void
  setAdminEmails: (emails: string[]) => void
  addAdminEmail: (email: string) => string | null
  removeAdminEmail: (email: string) => void
  isEmailAdmin: (email: string) => boolean
  track: (type: AnalyticsEvent['type'], targetId: string, amount?: number) => void
  addToCart: (productId: string, qty?: number) => void
  setCartQty: (productId: string, qty: number) => void
  clearCart: () => void
  checkout: (email: string, method: Order['method']) => Order | string
  subscribe: (channel: Subscriber['channel'], value: string) => string | null
  votePoll: (pollId: string, optionId: string) => void
  syncYoutube: () => Promise<number>
  syncMusicChart: () => Promise<number>
  upsertNews: (item: NewsItem) => void
  deleteNews: (id: string) => void
  upsertVideo: (item: VideoItem) => void
  deleteVideo: (id: string) => void
  upsertRapper: (item: Rapper) => void
  deleteRapper: (id: string) => void
  upsertProduct: (item: Product) => void
  deleteProduct: (id: string) => void
  upsertSponsor: (item: Sponsor) => void
  deleteSponsor: (id: string) => void
  upsertPoll: (item: Poll) => void
  upsertShort: (item: ShortClip) => void
  deleteShort: (id: string) => void
  upsertShow: (item: Show) => void
  deleteShow: (id: string) => void
  upsertPodcast: (item: PodcastEpisode) => void
  deletePodcast: (id: string) => void
  upsertDailyDrop: (item: DailyDrop) => void
  deleteDailyDrop: (id: string) => void
  upsertLivestream: (item: Livestream) => void
  deleteLivestream: (id: string) => void
  upsertWallPost: (item: WallPost) => void
  deleteWallPost: (id: string) => void
  reactWallPost: (postId: string, kind: 'fire' | 'cold') => void
  addWallComment: (postId: string, comment: Omit<WallComment, 'id' | 'postId' | 'createdAt'> & { text: string }) => void
  buyTicket: (
    showId: string,
    tier: TicketOrder['tier'],
    qty: number,
    email: string,
    method: TicketOrder['method'],
  ) => TicketOrder | string
  setRankings: (items: RankItem[]) => void
  upsertChartSong: (item: ChartSong) => void
  deleteChartSong: (id: string) => void
  upsertBattle: (item: Battle) => void
  deleteBattle: (id: string) => void
  voteBattle: (battleId: string, sideId: string) => string | null
  linkRapperOwner: (
    rapperId: string,
    ownerEmail: string,
    ownerUserId?: string,
  ) => string | null
  claimRapperForUser: (userId: string, email: string) => Rapper | null
  goLiveAsArtist: (input: {
    artistId: string
    hostUserId: string
    hostName: string
    title: string
    youtubeId: string
    cover?: string
  }) => Livestream | string
  endArtistLive: (livestreamId: string) => void
  pushCloud: () => Promise<void>
  pullCloud: () => Promise<'empty' | 'ok'>
  analyticsSummary: () => {
    newsClicks: { id: string; title: string; clicks: number }[]
    videoClicks: { id: string; title: string; clicks: number }[]
    shopRevenue: number
    ticketRevenue: number
    orderCount: number
    ticketCount: number
    topRappers: { id: string; name: string; favorites: number }[]
    subscribers: number
    sponsorClicks: number
  }
}

const StoreContext = createContext<StoreValue | null>(null)

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(DATA_KEY)
    if (!raw) return createSeed()
    const parsed = JSON.parse(raw) as AppData
    const seed = createSeed()
    return {
      ...seed,
      ...parsed,
      news: parsed.news?.length ? parsed.news : seed.news,
      videos: parsed.videos?.length ? parsed.videos : seed.videos,
      rappers: parsed.rappers?.length ? parsed.rappers : seed.rappers,
      products: parsed.products?.length ? parsed.products : seed.products,
      sponsors: parsed.sponsors?.length ? parsed.sponsors : seed.sponsors,
      polls: parsed.polls?.length ? parsed.polls : seed.polls,
      shorts: parsed.shorts?.length ? parsed.shorts : seed.shorts,
      shows: parsed.shows?.length ? parsed.shows : seed.shows,
      podcasts: parsed.podcasts?.length ? parsed.podcasts : seed.podcasts,
      rankings: parsed.rankings?.length ? parsed.rankings : seed.rankings,
      chartSongs: parsed.chartSongs?.length ? parsed.chartSongs : seed.chartSongs,
      dailyDrops: parsed.dailyDrops?.length ? parsed.dailyDrops : seed.dailyDrops,
      livestreams: parsed.livestreams?.length ? parsed.livestreams : seed.livestreams,
      wallPosts: parsed.wallPosts?.length ? parsed.wallPosts : seed.wallPosts,
      battles: parsed.battles?.length ? parsed.battles : seed.battles,
      adminEmails: parsed.adminEmails?.length ? parsed.adminEmails : seed.adminEmails,
      orders: parsed.orders || [],
      ticketOrders: parsed.ticketOrders || [],
      subscribers: parsed.subscribers || [],
      events: parsed.events || [],
    }
  } catch {
    return createSeed()
  }
}

function uid() {
  return crypto.randomUUID()
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadData())
  const [cart, setCart] = useState<CartLine[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('newsac_cart') || '[]') as CartLine[]
    } catch {
      return []
    }
  })
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem(ADMIN_KEY) === '1')

  useEffect(() => {
    const sync = () => setIsAdmin(localStorage.getItem(ADMIN_KEY) === '1')
    window.addEventListener('storage', sync)
    window.addEventListener('newsac-admin', sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('newsac-admin', sync)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(DATA_KEY, JSON.stringify(data))
  }, [data])

  useEffect(() => {
    localStorage.setItem('newsac_cart', JSON.stringify(cart))
  }, [cart])

  const patch = useCallback((fn: (prev: AppData) => AppData) => {
    setData((prev) => fn(prev))
  }, [])

  const track = useCallback(
    (type: AnalyticsEvent['type'], targetId: string, amount?: number) => {
      patch((prev) => ({
        ...prev,
        events: [
          {
            id: uid(),
            type,
            targetId,
            amount,
            at: new Date().toISOString(),
          },
          ...prev.events,
        ].slice(0, 2000),
      }))
    },
    [patch],
  )

  const value = useMemo<StoreValue>(
    () => ({
      data,
      cart,
      isAdmin,
      adminLogin(password) {
        if (!isAdminCredential(password)) {
          return 'Нууц үг буруу.'
        }
        localStorage.setItem(ADMIN_KEY, '1')
        setIsAdmin(true)
        return null
      },
      adminLogout() {
        localStorage.removeItem(ADMIN_KEY)
        setIsAdmin(false)
      },
      grantAdmin() {
        localStorage.setItem(ADMIN_KEY, '1')
        setIsAdmin(true)
        window.dispatchEvent(new Event('newsac-admin'))
      },
      setAdminEmails(emails) {
        const cleaned = [...new Set(emails.map((e) => e.trim().toLowerCase()).filter(Boolean))]
        patch((prev) => ({ ...prev, adminEmails: cleaned }))
      },
      addAdminEmail(email) {
        const e = email.trim().toLowerCase()
        if (!e.includes('@') || !e.endsWith('@gmail.com')) {
          return 'Зөвхөн Gmail (@gmail.com) нэмнэ.'
        }
        if (data.adminEmails.map((x) => x.toLowerCase()).includes(e)) {
          return 'Энэ Gmail аль хэдийн admin.'
        }
        patch((prev) => ({ ...prev, adminEmails: [...prev.adminEmails, e] }))
        return null
      },
      removeAdminEmail(email) {
        const e = email.trim().toLowerCase()
        patch((prev) => ({
          ...prev,
          adminEmails: prev.adminEmails.filter((x) => x.toLowerCase() !== e),
        }))
      },
      isEmailAdmin(email) {
        return isAdminEmail(email, data.adminEmails)
      },
      track,
      addToCart(productId, qty = 1) {
        setCart((prev) => {
          const found = prev.find((c) => c.productId === productId)
          if (found) {
            return prev.map((c) =>
              c.productId === productId ? { ...c, qty: c.qty + qty } : c,
            )
          }
          return [...prev, { productId, qty }]
        })
      },
      setCartQty(productId, qty) {
        setCart((prev) =>
          qty <= 0
            ? prev.filter((c) => c.productId !== productId)
            : prev.map((c) => (c.productId === productId ? { ...c, qty } : c)),
        )
      },
      clearCart() {
        setCart([])
      },
      checkout(email, method) {
        if (!email.includes('@')) return 'Имэйл буруу байна.'
        if (cart.length === 0) return 'Сагс хоосон.'
        const lines = cart
          .map((c) => {
            const p = data.products.find((x) => x.id === c.productId && x.active)
            if (!p) return null
            return {
              productId: p.id,
              name: p.name,
              qty: c.qty,
              price: p.price,
            }
          })
          .filter(Boolean) as Order['items']
        if (!lines.length) return 'Бараа олдсонгүй.'
        const total = lines.reduce((s, l) => s + l.price * l.qty, 0)
        const order: Order = {
          id: uid(),
          items: lines,
          total,
          method,
          createdAt: new Date().toISOString(),
          email: email.trim().toLowerCase(),
        }
        patch((prev) => ({
          ...prev,
          orders: [order, ...prev.orders],
          products: prev.products.map((p) => {
            const line = lines.find((l) => l.productId === p.id)
            if (!line || p.type === 'digital' || p.type === 'tip') return p
            return { ...p, stock: Math.max(0, p.stock - line.qty) }
          }),
          events: [
            {
              id: uid(),
              type: 'shop_purchase',
              targetId: order.id,
              amount: total,
              at: order.createdAt,
            },
            ...prev.events,
          ],
        }))
        setCart([])
        return order
      },
      subscribe(channel, value) {
        const v = value.trim()
        if (!v) return 'Утга оруулна уу.'
        if (channel === 'email' && !v.includes('@')) return 'Имэйл буруу.'
        if (data.subscribers.some((s) => s.value.toLowerCase() === v.toLowerCase())) {
          return 'Аль хэдийн бүртгэлтэй.'
        }
        patch((prev) => ({
          ...prev,
          subscribers: [
            { id: uid(), channel, value: v, createdAt: new Date().toISOString() },
            ...prev.subscribers,
          ],
        }))
        return null
      },
      votePoll(pollId, optionId) {
        patch((prev) => ({
          ...prev,
          polls: prev.polls.map((p) =>
            p.id !== pollId
              ? p
              : {
                  ...p,
                  options: p.options.map((o) =>
                    o.id === optionId ? { ...o, votes: o.votes + 1 } : o,
                  ),
                },
          ),
          events: [
            {
              id: uid(),
              type: 'poll_vote',
              targetId: `${pollId}:${optionId}`,
              at: new Date().toISOString(),
            },
            ...prev.events,
          ],
        }))
      },
      async syncYoutube() {
        const remote = await fetchChannelVideos('Newsacchannel', 24)
        const channelVideos: VideoItem[] = remote.map((v) => ({
          id: `yt-${v.youtubeId}`,
          youtubeId: v.youtubeId,
          title: v.title,
          description: v.description,
          views: v.views,
          duration: v.duration,
          published: v.published,
        }))
        let added = 0
        patch((prev) => {
          const existing = new Set(prev.videos.map((v) => v.youtubeId))
          const fresh = channelVideos.filter((v) => !existing.has(v.youtubeId))
          added = fresh.length
          // Refresh metadata for videos we already have
          const byYt = new Map(channelVideos.map((v) => [v.youtubeId, v]))
          const videos = [
            ...fresh,
            ...prev.videos.map((v) => {
              const upd = byYt.get(v.youtubeId)
              if (!upd) return v
              return {
                ...v,
                title: upd.title,
                description: upd.description,
                views: upd.views,
                duration: upd.duration,
                published: upd.published,
              }
            }),
          ]
          return {
            ...prev,
            videos,
            lastYoutubeSync: new Date().toISOString(),
          }
        })
        return added
      },
      async syncMusicChart() {
        const songs = await fetchMongolianYouTubeChart(20)
        if (!songs.length) return 0

        patch((prev) => {
          const previousRanks = new Map(
            prev.chartSongs
              .filter((song) => song.youtubeId)
              .map((song) => [song.youtubeId!, song.rank]),
          )
          const previousAudio = new Map(
            prev.chartSongs
              .filter((song) => song.youtubeId && song.audioUrl)
              .map((song) => [song.youtubeId!, song.audioUrl]),
          )

          return {
            ...prev,
            chartSongs: songs.map((song) => {
              const oldRank = song.youtubeId ? previousRanks.get(song.youtubeId) : undefined
              return {
                ...song,
                change: oldRank ? oldRank - song.rank : 0,
                audioUrl:
                  (song.youtubeId && previousAudio.get(song.youtubeId)) || song.audioUrl,
              }
            }),
            lastYoutubeSync: new Date().toISOString(),
          }
        })

        return songs.length
      },
      upsertNews(item) {
        patch((prev) => {
          const i = prev.news.findIndex((n) => n.id === item.id)
          if (i >= 0) {
            const news = [...prev.news]
            news[i] = item
            return { ...prev, news }
          }
          return { ...prev, news: [item, ...prev.news] }
        })
      },
      deleteNews(id) {
        patch((prev) => ({ ...prev, news: prev.news.filter((n) => n.id !== id) }))
      },
      upsertVideo(item) {
        patch((prev) => {
          const i = prev.videos.findIndex((n) => n.id === item.id)
          if (i >= 0) {
            const videos = [...prev.videos]
            videos[i] = item
            return { ...prev, videos }
          }
          return { ...prev, videos: [item, ...prev.videos] }
        })
      },
      deleteVideo(id) {
        patch((prev) => ({ ...prev, videos: prev.videos.filter((n) => n.id !== id) }))
      },
      upsertRapper(item) {
        patch((prev) => {
          const i = prev.rappers.findIndex((n) => n.id === item.id)
          if (i >= 0) {
            const rappers = [...prev.rappers]
            rappers[i] = item
            return { ...prev, rappers }
          }
          return { ...prev, rappers: [item, ...prev.rappers] }
        })
      },
      deleteRapper(id) {
        patch((prev) => ({ ...prev, rappers: prev.rappers.filter((n) => n.id !== id) }))
      },
      upsertProduct(item) {
        patch((prev) => {
          const i = prev.products.findIndex((n) => n.id === item.id)
          if (i >= 0) {
            const products = [...prev.products]
            products[i] = item
            return { ...prev, products }
          }
          return { ...prev, products: [item, ...prev.products] }
        })
      },
      deleteProduct(id) {
        patch((prev) => ({ ...prev, products: prev.products.filter((n) => n.id !== id) }))
      },
      upsertSponsor(item) {
        patch((prev) => {
          const i = prev.sponsors.findIndex((n) => n.id === item.id)
          if (i >= 0) {
            const sponsors = [...prev.sponsors]
            sponsors[i] = item
            return { ...prev, sponsors }
          }
          return { ...prev, sponsors: [item, ...prev.sponsors] }
        })
      },
      deleteSponsor(id) {
        patch((prev) => ({ ...prev, sponsors: prev.sponsors.filter((n) => n.id !== id) }))
      },
      upsertPoll(item) {
        patch((prev) => {
          const i = prev.polls.findIndex((n) => n.id === item.id)
          if (i >= 0) {
            const polls = [...prev.polls]
            polls[i] = item
            return { ...prev, polls }
          }
          return { ...prev, polls: [item, ...prev.polls] }
        })
      },
      upsertShort(item) {
        patch((prev) => {
          const i = prev.shorts.findIndex((n) => n.id === item.id)
          if (i >= 0) {
            const shorts = [...prev.shorts]
            shorts[i] = item
            return { ...prev, shorts }
          }
          return { ...prev, shorts: [item, ...prev.shorts] }
        })
      },
      deleteShort(id) {
        patch((prev) => ({ ...prev, shorts: prev.shorts.filter((n) => n.id !== id) }))
      },
      upsertShow(item) {
        patch((prev) => {
          const i = prev.shows.findIndex((n) => n.id === item.id)
          if (i >= 0) {
            const shows = [...prev.shows]
            shows[i] = item
            return { ...prev, shows }
          }
          return { ...prev, shows: [item, ...prev.shows] }
        })
      },
      deleteShow(id) {
        patch((prev) => ({ ...prev, shows: prev.shows.filter((n) => n.id !== id) }))
      },
      upsertPodcast(item) {
        patch((prev) => {
          const i = prev.podcasts.findIndex((n) => n.id === item.id)
          if (i >= 0) {
            const podcasts = [...prev.podcasts]
            podcasts[i] = item
            return { ...prev, podcasts }
          }
          return { ...prev, podcasts: [item, ...prev.podcasts] }
        })
      },
      deletePodcast(id) {
        patch((prev) => ({ ...prev, podcasts: prev.podcasts.filter((n) => n.id !== id) }))
      },
      upsertDailyDrop(item) {
        patch((prev) => {
          const i = prev.dailyDrops.findIndex((n) => n.id === item.id)
          if (i >= 0) {
            const dailyDrops = [...prev.dailyDrops]
            dailyDrops[i] = item
            return { ...prev, dailyDrops }
          }
          return { ...prev, dailyDrops: [item, ...prev.dailyDrops] }
        })
      },
      deleteDailyDrop(id) {
        patch((prev) => ({ ...prev, dailyDrops: prev.dailyDrops.filter((n) => n.id !== id) }))
      },
      upsertLivestream(item) {
        patch((prev) => {
          const i = prev.livestreams.findIndex((n) => n.id === item.id)
          if (i >= 0) {
            const livestreams = [...prev.livestreams]
            livestreams[i] = item
            return { ...prev, livestreams }
          }
          return { ...prev, livestreams: [item, ...prev.livestreams] }
        })
      },
      deleteLivestream(id) {
        patch((prev) => ({ ...prev, livestreams: prev.livestreams.filter((n) => n.id !== id) }))
      },
      upsertWallPost(item) {
        patch((prev) => {
          const i = prev.wallPosts.findIndex((n) => n.id === item.id)
          if (i >= 0) {
            const wallPosts = [...prev.wallPosts]
            wallPosts[i] = item
            return { ...prev, wallPosts }
          }
          return {
            ...prev,
            wallPosts: [item, ...prev.wallPosts],
            events: [
              {
                id: uid(),
                type: 'wall_post',
                targetId: item.id,
                at: new Date().toISOString(),
              },
              ...prev.events,
            ],
          }
        })
      },
      deleteWallPost(id) {
        patch((prev) => ({ ...prev, wallPosts: prev.wallPosts.filter((n) => n.id !== id) }))
      },
      reactWallPost(postId, kind) {
        patch((prev) => ({
          ...prev,
          wallPosts: prev.wallPosts.map((p) => {
            if (p.id !== postId) return p
            return kind === 'fire'
              ? { ...p, fires: p.fires + 1 }
              : { ...p, colds: p.colds + 1 }
          }),
        }))
      },
      addWallComment(postId, comment) {
        const entry: WallComment = {
          id: uid(),
          postId,
          authorName: comment.authorName,
          authorId: comment.authorId,
          text: comment.text.trim(),
          createdAt: new Date().toISOString(),
        }
        if (!entry.text) return
        patch((prev) => ({
          ...prev,
          wallPosts: prev.wallPosts.map((p) =>
            p.id === postId ? { ...p, comments: [...p.comments, entry] } : p,
          ),
        }))
      },
      buyTicket(showId, tier, qty, email, method) {
        if (!email.includes('@')) return 'Имэйл буруу байна.'
        if (qty < 1) return 'Тоо буруу.'
        const show = data.shows.find((s) => s.id === showId && s.active)
        if (!show) return 'Тоглолт олдсонгүй.'
        const left = tier === 'vip' ? show.vipLeft : show.seatsLeft
        if (qty > left) return `Зөвхөн ${left} тасалбар үлдсэн.`
        const unitPrice = tier === 'vip' ? show.vipPrice : show.price
        const total = unitPrice * qty
        const order: TicketOrder = {
          id: uid(),
          showId,
          showTitle: show.title,
          tier,
          qty,
          unitPrice,
          total,
          method,
          email: email.trim().toLowerCase(),
          createdAt: new Date().toISOString(),
          code: `NS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        }
        patch((prev) => ({
          ...prev,
          shows: prev.shows.map((s) => {
            if (s.id !== showId) return s
            return tier === 'vip'
              ? { ...s, vipLeft: Math.max(0, s.vipLeft - qty) }
              : { ...s, seatsLeft: Math.max(0, s.seatsLeft - qty) }
          }),
          ticketOrders: [order, ...prev.ticketOrders],
          events: [
            {
              id: uid(),
              type: 'ticket_purchase',
              targetId: order.id,
              amount: total,
              at: order.createdAt,
            },
            ...prev.events,
          ],
        }))
        return order
      },
      setRankings(items) {
        patch((prev) => ({ ...prev, rankings: items }))
      },
      upsertChartSong(item) {
        patch((prev) => {
          const i = prev.chartSongs.findIndex((n) => n.id === item.id)
          if (i >= 0) {
            const chartSongs = [...prev.chartSongs]
            chartSongs[i] = item
            return { ...prev, chartSongs }
          }
          return { ...prev, chartSongs: [item, ...prev.chartSongs] }
        })
      },
      deleteChartSong(id) {
        patch((prev) => ({ ...prev, chartSongs: prev.chartSongs.filter((n) => n.id !== id) }))
      },
      upsertBattle(item) {
        patch((prev) => {
          const i = prev.battles.findIndex((n) => n.id === item.id)
          if (i >= 0) {
            const battles = [...prev.battles]
            battles[i] = item
            return { ...prev, battles }
          }
          return { ...prev, battles: [item, ...prev.battles] }
        })
      },
      deleteBattle(id) {
        patch((prev) => ({ ...prev, battles: prev.battles.filter((n) => n.id !== id) }))
      },
      voteBattle(battleId, sideId) {
        const battle = data.battles.find((b) => b.id === battleId)
        if (!battle) return 'Battle олдсонгүй'
        if (battle.status !== 'open') return 'Энэ battle хаагдсан'
        if (+new Date(battle.endsAt) < Date.now()) return 'Санал хураалт дууссан'
        if (!battle.sides.some((s) => s.id === sideId)) return 'Буруу сонголт'

        patch((prev) => ({
          ...prev,
          battles: prev.battles.map((b) => {
            if (b.id !== battleId) return b
            return {
              ...b,
              sides: b.sides.map((s) =>
                s.id === sideId ? { ...s, votes: s.votes + 1 } : s,
              ) as Battle['sides'],
            }
          }),
          events: [
            {
              id: uid(),
              type: 'battle_vote',
              targetId: `${battleId}:${sideId}`,
              at: new Date().toISOString(),
            },
            ...prev.events,
          ],
        }))
        return null
      },
      linkRapperOwner(rapperId, ownerEmail, ownerUserId) {
        const email = ownerEmail.trim().toLowerCase()
        if (!email) return 'Gmail оруулна уу'
        const rapper = data.rappers.find((r) => r.id === rapperId)
        if (!rapper) return 'Артист олдсонгүй'
        patch((prev) => ({
          ...prev,
          rappers: prev.rappers.map((r) =>
            r.id === rapperId
              ? {
                  ...r,
                  ownerEmail: email,
                  ownerUserId: ownerUserId || r.ownerUserId,
                  verified: true,
                }
              : r,
          ),
        }))
        return null
      },
      claimRapperForUser(userId, email) {
        const e = email.trim().toLowerCase()
        let claimed: Rapper | null = null
        patch((prev) => {
          const rappers = prev.rappers.map((r) => {
            if (r.ownerUserId === userId || (r.ownerEmail && r.ownerEmail === e)) {
              claimed = { ...r, ownerUserId: userId, ownerEmail: e, verified: true }
              return claimed
            }
            return r
          })
          return { ...prev, rappers }
        })
        return claimed
      },
      goLiveAsArtist(input) {
        const ytRaw = input.youtubeId.trim()
        if (!ytRaw) return 'YouTube video / live ID оруулна уу'
        const artist = data.rappers.find((r) => r.id === input.artistId)
        if (!artist) return 'Артист олдсонгүй'
        if (artist.ownerUserId && artist.ownerUserId !== input.hostUserId) {
          return 'Энэ профайл таных биш'
        }

        const fromUrl = ytRaw.match(
          /(?:youtu\.be\/|v=|\/live\/|\/embed\/)([a-zA-Z0-9_-]{6,})/,
        )
        const youtubeId = fromUrl ? fromUrl[1] : ytRaw

        const live: Livestream = {
          id: uid(),
          title: input.title.trim() || `${artist.name} LIVE`,
          status: 'live',
          youtubeId,
          startsAt: new Date().toISOString(),
          viewers: 1,
          cover: input.cover || artist.image,
          artistId: artist.id,
          hostUserId: input.hostUserId,
          hostName: input.hostName,
        }

        patch((prev) => ({
          ...prev,
          livestreams: [
            live,
            ...prev.livestreams.map((l) =>
              l.artistId === artist.id && l.status === 'live'
                ? { ...l, status: 'ended' as const }
                : l,
            ),
          ],
        }))
        return live
      },
      endArtistLive(livestreamId) {
        patch((prev) => ({
          ...prev,
          livestreams: prev.livestreams.map((l) =>
            l.id === livestreamId ? { ...l, status: 'ended' as const } : l,
          ),
        }))
      },
      async pushCloud() {
        await pushAppSnapshot(data)
        patch((prev) => ({ ...prev, lastCloudSync: new Date().toISOString() }))
      },
      async pullCloud() {
        const remote = await pullAppSnapshot()
        if (!remote || !Object.keys(remote).length) return 'empty'
        const seed = createSeed()
        setData({
          ...seed,
          ...remote,
          news: remote.news?.length ? remote.news : seed.news,
          videos: remote.videos?.length ? remote.videos : seed.videos,
          rappers: remote.rappers?.length ? remote.rappers : seed.rappers,
          products: remote.products?.length ? remote.products : seed.products,
          sponsors: remote.sponsors?.length ? remote.sponsors : seed.sponsors,
          polls: remote.polls?.length ? remote.polls : seed.polls,
          shorts: remote.shorts?.length ? remote.shorts : seed.shorts,
          shows: remote.shows?.length ? remote.shows : seed.shows,
          podcasts: remote.podcasts?.length ? remote.podcasts : seed.podcasts,
          rankings: remote.rankings?.length ? remote.rankings : seed.rankings,
          chartSongs: remote.chartSongs?.length ? remote.chartSongs : seed.chartSongs,
          dailyDrops: remote.dailyDrops?.length ? remote.dailyDrops : seed.dailyDrops,
          livestreams: remote.livestreams?.length ? remote.livestreams : seed.livestreams,
          wallPosts: remote.wallPosts?.length ? remote.wallPosts : seed.wallPosts,
          battles: remote.battles?.length ? remote.battles : seed.battles,
          adminEmails: remote.adminEmails?.length ? remote.adminEmails : seed.adminEmails,
          orders: remote.orders || [],
          ticketOrders: remote.ticketOrders || [],
          subscribers: remote.subscribers || [],
          events: remote.events || [],
          lastCloudSync: new Date().toISOString(),
        })
        return 'ok'
      },
      analyticsSummary() {
        const countBy = (type: AnalyticsEvent['type']) => {
          const map = new Map<string, number>()
          for (const e of data.events.filter((x) => x.type === type)) {
            map.set(e.targetId, (map.get(e.targetId) || 0) + 1)
          }
          return map
        }
        const newsMap = countBy('news_click')
        const videoMap = countBy('video_click')
        const favMap = countBy('rapper_favorite')
        const shopRevenue = data.events
          .filter((e) => e.type === 'shop_purchase')
          .reduce((s, e) => s + (e.amount || 0), 0)
        const ticketRevenue = data.events
          .filter((e) => e.type === 'ticket_purchase')
          .reduce((s, e) => s + (e.amount || 0), 0)
        return {
          newsClicks: data.news
            .map((n) => ({ id: n.id, title: n.title, clicks: newsMap.get(n.id) || 0 }))
            .sort((a, b) => b.clicks - a.clicks),
          videoClicks: data.videos
            .map((n) => ({ id: n.id, title: n.title, clicks: videoMap.get(n.id) || 0 }))
            .sort((a, b) => b.clicks - a.clicks),
          shopRevenue,
          ticketRevenue,
          orderCount: data.orders.length,
          ticketCount: data.ticketOrders.length,
          topRappers: data.rappers
            .map((r) => ({ id: r.id, name: r.name, favorites: favMap.get(r.id) || 0 }))
            .sort((a, b) => b.favorites - a.favorites),
          subscribers: data.subscribers.length,
          sponsorClicks: data.events.filter((e) => e.type === 'sponsor_click').length,
        }
      },
    }),
    [data, cart, isAdmin, track, patch],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

export { YOUTUBE_CHANNEL_URL }
export { ADMIN_PASSWORD, ADMIN_PHONES } from './seed'
export { isAdminEmail } from './seed'
