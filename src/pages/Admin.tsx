import { Navigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { useStore, ADMIN_PHONES } from '../store/StoreContext'
import type {
  DailyDrop,
  Livestream,
  NewsItem,
  PodcastEpisode,
  Product,
  Rapper,
  Show,
  Sponsor,
  VideoItem,
  WallPost,
} from '../store/types'
import './Admin.css'

type Tab =
  | 'analytics'
  | 'news'
  | 'videos'
  | 'rappers'
  | 'shop'
  | 'tickets'
  | 'podcasts'
  | 'drop'
  | 'live'
  | 'wall'
  | 'sponsors'
  | 'audience'
  | 'sync'

export function AdminPage() {
  const store = useStore()
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('analytics')
  const [syncMsg, setSyncMsg] = useState<string | null>(null)
  const summary = useMemo(() => store.analyticsSummary(), [store.data])

  if (!store.isAdmin) {
    return (
      <div className="admin-login">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setErr(store.adminLogin(password))
          }}
        >
          <img src="/logo.png" alt="" width={48} height={48} />
          <h1>Newsac Admin</h1>
          <p>Контент, shop, analytics удирдлага</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Нууц үг эсвэл утас"
            inputMode="numeric"
            required
          />
          <button className="btn btn-primary btn-block" type="submit">
            Нэвтрэх
          </button>
          {err && <p className="admin-err">{err}</p>}
          <p className="admin-hint">Admin утас: {ADMIN_PHONES.join(' · ')}</p>
        </form>
      </div>
    )
  }

  return (
    <div className="admin">
      <header className="admin-top">
        <div>
          <strong>Newsac Admin</strong>
          <span>Код бичихгүйгээр удирд</span>
        </div>
        <button type="button" className="btn btn-ghost" onClick={store.adminLogout}>
          Гарах
        </button>
      </header>

      <nav className="admin-tabs">
        {(
          [
            ['analytics', 'Аналитик'],
            ['news', 'Мэдээ'],
            ['videos', 'Бичлэг'],
            ['rappers', 'Рэппер'],
            ['shop', 'Shop'],
            ['tickets', 'Тасалбар'],
            ['podcasts', 'Podcast'],
            ['drop', 'Drop'],
            ['live', 'Live'],
            ['wall', 'Wall'],
            ['sponsors', 'Sponsor'],
            ['audience', 'Жагсаалт'],
            ['sync', 'YouTube'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={tab === id ? 'active' : ''}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="admin-body">
        {tab === 'analytics' && (
          <div className="admin-analytics">
            <div className="stat-grid">
              <div className="stat">
                <span>Shop орлого</span>
                <strong>{new Intl.NumberFormat('mn-MN').format(summary.shopRevenue)}₮</strong>
              </div>
              <div className="stat">
                <span>Тасалбар орлого</span>
                <strong>{new Intl.NumberFormat('mn-MN').format(summary.ticketRevenue)}₮</strong>
              </div>
              <div className="stat">
                <span>Захиалга / Ticket</span>
                <strong>
                  {summary.orderCount} / {summary.ticketCount}
                </strong>
              </div>
              <div className="stat">
                <span>Subscriber</span>
                <strong>{summary.subscribers}</strong>
              </div>
            </div>

            <h3>Мэдээ клик</h3>
            <ol className="rank-mini">
              {summary.newsClicks.slice(0, 5).map((n, i) => (
                <li key={n.id}>
                  <span className="rank-n">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <strong>{n.title}</strong>
                    <em>{n.clicks} клик</em>
                  </div>
                </li>
              ))}
            </ol>

            <h3>Бичлэг клик</h3>
            <ol className="rank-mini">
              {summary.videoClicks.slice(0, 5).map((n, i) => (
                <li key={n.id}>
                  <span className="rank-n">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <strong>{n.title}</strong>
                    <em>{n.clicks} клик</em>
                  </div>
                </li>
              ))}
            </ol>

            <h3>Хадгалсан рэппер</h3>
            <ol className="rank-mini">
              {summary.topRappers.slice(0, 5).map((n, i) => (
                <li key={n.id}>
                  <span className="rank-n">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <strong>{n.name}</strong>
                    <em>{n.favorites} favorite</em>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        {tab === 'news' && (
          <CrudList
            title="Мэдээ"
            items={store.data.news.map((n) => ({ id: n.id, label: n.title }))}
            onDelete={store.deleteNews}
            onCreate={() => {
              const item: NewsItem = {
                id: crypto.randomUUID(),
                title: 'Шинэ мэдээ',
                excerpt: 'Товч тайлбар...',
                body: 'Бүрэн текст...',
                category: 'Мэдээ',
                date: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
                readMin: 3,
                image:
                  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80',
              }
              const title = prompt('Гарчиг', item.title)
              if (!title) return
              store.upsertNews({ ...item, title })
            }}
            onEdit={(id) => {
              const n = store.data.news.find((x) => x.id === id)
              if (!n) return
              const title = prompt('Гарчиг', n.title)
              if (!title) return
              const excerpt = prompt('Товч', n.excerpt) || n.excerpt
              store.upsertNews({ ...n, title, excerpt })
            }}
          />
        )}

        {tab === 'videos' && (
          <CrudList
            title="Бичлэг"
            items={store.data.videos.map((n) => ({ id: n.id, label: n.title }))}
            onDelete={store.deleteVideo}
            onCreate={() => {
              const youtubeId = prompt('YouTube video ID')
              if (!youtubeId) return
              const title = prompt('Гарчиг', 'Шинэ бичлэг') || 'Шинэ бичлэг'
              const item: VideoItem = {
                id: crypto.randomUUID(),
                youtubeId,
                title,
                description: 'Admin-аас нэмсэн',
                views: '0',
                duration: '',
                published: 'саяхан',
              }
              store.upsertVideo(item)
            }}
            onEdit={(id) => {
              const n = store.data.videos.find((x) => x.id === id)
              if (!n) return
              const title = prompt('Гарчиг', n.title)
              if (!title) return
              store.upsertVideo({ ...n, title })
            }}
          />
        )}

        {tab === 'rappers' && (
          <CrudList
            title="Рэппер"
            items={store.data.rappers.map((n) => ({ id: n.id, label: n.name }))}
            onDelete={store.deleteRapper}
            onCreate={() => {
              const name = prompt('Нэр')
              if (!name) return
              const item: Rapper = {
                id: crypto.randomUUID(),
                name,
                aka: name.slice(0, 3).toUpperCase(),
                city: 'Улаанбаатар',
                years: '2024 — одоо',
                bio: 'Шинэ рэппер',
                story: 'Түүх бичих...',
                image:
                  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80',
                tags: ['New'],
                streams: '0',
              }
              store.upsertRapper(item)
            }}
            onEdit={(id) => {
              const n = store.data.rappers.find((x) => x.id === id)
              if (!n) return
              const name = prompt('Нэр', n.name)
              if (!name) return
              store.upsertRapper({ ...n, name })
            }}
          />
        )}

        {tab === 'shop' && (
          <CrudList
            title="Shop бараа"
            items={store.data.products.map((n) => ({
              id: n.id,
              label: `${n.name} · ${n.price}₮`,
            }))}
            onDelete={store.deleteProduct}
            onCreate={() => {
              const name = prompt('Барааны нэр')
              if (!name) return
              const price = Number(prompt('Үнэ (₮)', '29000') || 0)
              const item: Product = {
                id: crypto.randomUUID(),
                name,
                description: 'Шинэ бараа',
                price,
                type: 'merch',
                image:
                  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
                stock: 50,
                active: true,
              }
              store.upsertProduct(item)
            }}
            onEdit={(id) => {
              const n = store.data.products.find((x) => x.id === id)
              if (!n) return
              const name = prompt('Нэр', n.name)
              if (!name) return
              const price = Number(prompt('Үнэ', String(n.price)) || n.price)
              store.upsertProduct({ ...n, name, price })
            }}
          />
        )}

        {tab === 'tickets' && (
          <CrudList
            title="Тоглолт / тасалбар"
            items={store.data.shows.map((n) => ({
              id: n.id,
              label: `${n.title} · ${n.date} · ${n.seatsLeft + n.vipLeft} үлдсэн`,
            }))}
            onDelete={store.deleteShow}
            onCreate={() => {
              const title = prompt('Тоглолтын нэр')
              if (!title) return
              const price = Number(prompt('Standard үнэ (₮)', '55000') || 55000)
              const item: Show = {
                id: crypto.randomUUID(),
                title,
                artists: 'Lineup TBA',
                venue: 'Venue',
                city: 'Улаанбаатар',
                date: '2026.09.01',
                time: '20:00',
                image:
                  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1400&q=80',
                description: 'Шинэ тоглолт',
                price,
                vipPrice: Math.round(price * 2),
                seatsLeft: 200,
                vipLeft: 40,
                active: true,
              }
              store.upsertShow(item)
            }}
            onEdit={(id) => {
              const n = store.data.shows.find((x) => x.id === id)
              if (!n) return
              const title = prompt('Нэр', n.title)
              if (!title) return
              const price = Number(prompt('Standard үнэ', String(n.price)) || n.price)
              const seatsLeft = Number(prompt('Standard үлдэгдэл', String(n.seatsLeft)) || n.seatsLeft)
              store.upsertShow({ ...n, title, price, seatsLeft })
            }}
          />
        )}

        {tab === 'podcasts' && (
          <CrudList
            title="Podcast"
            items={store.data.podcasts.map((n) => ({
              id: n.id,
              label: `${n.title} · ${n.duration}`,
            }))}
            onDelete={store.deletePodcast}
            onCreate={() => {
              const title = prompt('Цувралын гарчиг')
              if (!title) return
              const audioUrl =
                prompt(
                  'Audio URL (mp3)',
                  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                ) || ''
              const item: PodcastEpisode = {
                id: crypto.randomUUID(),
                title,
                description: 'Шинэ podcast',
                cover:
                  'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80',
                audioUrl,
                duration: '30:00',
                published: 'саяхан',
                guests: 'Newsac',
              }
              store.upsertPodcast(item)
            }}
            onEdit={(id) => {
              const n = store.data.podcasts.find((x) => x.id === id)
              if (!n) return
              const title = prompt('Гарчиг', n.title)
              if (!title) return
              store.upsertPodcast({ ...n, title })
            }}
          />
        )}

        {tab === 'drop' && (
          <CrudList
            title="Daily Drop"
            items={store.data.dailyDrops.map((n) => ({
              id: n.id,
              label: `${n.date} · ${n.title}`,
            }))}
            onDelete={store.deleteDailyDrop}
            onCreate={() => {
              const title = prompt('Drop гарчиг')
              if (!title) return
              const kind = (prompt('Төрөл: news|video|podcast|short', 'podcast') ||
                'podcast') as DailyDrop['kind']
              const targetId = prompt('Target ID', 'pod-1') || 'pod-1'
              const item: DailyDrop = {
                id: crypto.randomUUID(),
                date: new Date().toISOString().slice(0, 10),
                title,
                kind,
                targetId,
                teaser: 'Өнөөдрийн drop',
                image:
                  'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&q=80',
              }
              store.upsertDailyDrop(item)
            }}
            onEdit={(id) => {
              const n = store.data.dailyDrops.find((x) => x.id === id)
              if (!n) return
              const title = prompt('Гарчиг', n.title)
              if (!title) return
              const date = prompt('Огноо (YYYY-MM-DD)', n.date) || n.date
              store.upsertDailyDrop({ ...n, title, date })
            }}
          />
        )}

        {tab === 'live' && (
          <CrudList
            title="Livestream"
            items={store.data.livestreams.map((n) => ({
              id: n.id,
              label: `${n.status.toUpperCase()} · ${n.title}`,
            }))}
            onDelete={store.deleteLivestream}
            onCreate={() => {
              const title = prompt('Live гарчиг')
              if (!title) return
              const status = (prompt('status: live|upcoming|ended', 'upcoming') ||
                'upcoming') as Livestream['status']
              const youtubeId = prompt('YouTube ID (заавал биш)', '') || undefined
              const item: Livestream = {
                id: crypto.randomUUID(),
                title,
                status,
                youtubeId,
                startsAt: new Date(Date.now() + 3600000).toISOString(),
                viewers: status === 'live' ? 120 : 0,
                cover:
                  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=80',
              }
              store.upsertLivestream(item)
            }}
            onEdit={(id) => {
              const n = store.data.livestreams.find((x) => x.id === id)
              if (!n) return
              const title = prompt('Гарчиг', n.title)
              if (!title) return
              const status = (prompt('status: live|upcoming|ended', n.status) ||
                n.status) as Livestream['status']
              store.upsertLivestream({
                ...n,
                title,
                status,
                viewers: status === 'live' ? n.viewers || 250 : n.viewers,
              })
            }}
          />
        )}

        {tab === 'wall' && (
          <CrudList
            title="Wall постууд"
            items={store.data.wallPosts.map((n) => ({
              id: n.id,
              label: `${n.authorName} · ${n.text.slice(0, 40)}`,
            }))}
            onDelete={store.deleteWallPost}
            onCreate={() => {
              const text = prompt('Пост текст')
              if (!text) return
              const item: WallPost = {
                id: crypto.randomUUID(),
                authorName: 'Newsac Admin',
                text,
                createdAt: new Date().toISOString(),
                fires: 0,
                colds: 0,
                comments: [],
              }
              store.upsertWallPost(item)
            }}
            onEdit={(id) => {
              const n = store.data.wallPosts.find((x) => x.id === id)
              if (!n) return
              const text = prompt('Текст', n.text)
              if (!text) return
              store.upsertWallPost({ ...n, text })
            }}
          />
        )}

        {tab === 'sponsors' && (
          <CrudList
            title="Sponsor"
            items={store.data.sponsors.map((n) => ({
              id: n.id,
              label: `${n.name} · ${n.slot}`,
            }))}
            onDelete={store.deleteSponsor}
            onCreate={() => {
              const name = prompt('Sponsor нэр')
              if (!name) return
              const item: Sponsor = {
                id: crypto.randomUUID(),
                name,
                tagline: 'Sponsor tagline',
                url: 'https://www.youtube.com/@Newsacchannel',
                image:
                  'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=900&q=80',
                slot: 'home',
                active: true,
                cpm: 100000,
              }
              store.upsertSponsor(item)
            }}
            onEdit={(id) => {
              const n = store.data.sponsors.find((x) => x.id === id)
              if (!n) return
              const name = prompt('Нэр', n.name)
              if (!name) return
              store.upsertSponsor({ ...n, name })
            }}
          />
        )}

        {tab === 'audience' && (
          <div>
            <h3>Имэйл / Telegram жагсаалт ({store.data.subscribers.length})</h3>
            <ul className="admin-list">
              {store.data.subscribers.map((s) => (
                <li key={s.id}>
                  <strong>{s.channel}</strong>
                  <span>{s.value}</span>
                </li>
              ))}
              {!store.data.subscribers.length && <li>Одоогоор хоосон</li>}
            </ul>
            <h3 style={{ marginTop: '1.5rem' }}>Тасалбарын захиалга</h3>
            <ul className="admin-list">
              {store.data.ticketOrders.slice(0, 10).map((o) => (
                <li key={o.id}>
                  <strong>
                    {o.code} · {o.showTitle}
                  </strong>
                  <span>
                    {o.qty}×{o.tier} · {new Intl.NumberFormat('mn-MN').format(o.total)}₮ · {o.email}
                  </span>
                </li>
              ))}
              {!store.data.ticketOrders.length && <li>Тасалбарын захиалга байхгүй</li>}
            </ul>
            <h3 style={{ marginTop: '1.5rem' }}>Сүүлийн shop захиалга</h3>
            <ul className="admin-list">
              {store.data.orders.slice(0, 10).map((o) => (
                <li key={o.id}>
                  <strong>{o.email}</strong>
                  <span>
                    {new Intl.NumberFormat('mn-MN').format(o.total)}₮ · {o.method}
                  </span>
                </li>
              ))}
              {!store.data.orders.length && <li>Захиалга байхгүй</li>}
            </ul>
          </div>
        )}

        {tab === 'sync' && (
          <div className="sync-box">
            <h3>Авто YouTube sync</h3>
            <p>
              @Newsacchannel сувгаас шинэ бичлэг татна (demo). Сүүлийн sync:{' '}
              {store.data.lastYoutubeSync
                ? new Date(store.data.lastYoutubeSync).toLocaleString('mn-MN')
                : 'байхгүй'}
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={async () => {
                const n = await store.syncYoutube()
                setSyncMsg(`${n} шинэ бичлэг нэмэгдлээ.`)
                if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
                  new Notification('Newsac', { body: `${n} шинэ бичлэг sync хийгдлээ` })
                }
              }}
            >
              Одоо sync хийх
            </button>
            {syncMsg && <p className="checkout-result">{syncMsg}</p>}
          </div>
        )}
      </div>
    </div>
  )
}

function CrudList({
  title,
  items,
  onCreate,
  onEdit,
  onDelete,
}: {
  title: string
  items: { id: string; label: string }[]
  onCreate: () => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <div>
      <div className="crud-head">
        <h3>{title}</h3>
        <button type="button" className="btn btn-primary" onClick={onCreate}>
          + Нэмэх
        </button>
      </div>
      <ul className="admin-list">
        {items.map((item) => (
          <li key={item.id}>
            <span>{item.label}</span>
            <div className="crud-actions">
              <button type="button" onClick={() => onEdit(item.id)}>
                Засах
              </button>
              <button type="button" onClick={() => onDelete(item.id)}>
                Устгах
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function AdminRedirect() {
  return <Navigate to="/admin" replace />
}
