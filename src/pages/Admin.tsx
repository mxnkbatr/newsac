import { Link, Navigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { useStore, ADMIN_PHONES } from '../store/StoreContext'
import { useAuth } from '../context/AuthContext'
import type {
  Battle,
  DailyDrop,
  Livestream,
  NewsItem,
  Product,
  Rapper,
  Sponsor,
} from '../store/types'
import {
  IMG,
  battleFields,
  chartFields,
  dropFields,
  liveFields,
  newsFields,
  podcastFields,
  productFields,
  rapperFields,
  showFields,
  sponsorFields,
  todayDot,
  todayIso,
  videoFields,
  wallFields,
} from './adminFields'
import {
  EditorModal,
  EntityList,
  Modal,
  Toast,
  type FieldDef,
  type ToastState,
} from './adminUi'
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
  | 'staff'
  | 'chart'
  | 'sync'
  | 'cloud'
  | 'battle'

const NAV_GROUPS: { label: string; items: { id: Tab; label: string }[] }[] = [
  { label: 'Overview', items: [{ id: 'analytics', label: 'Аналитик' }] },
  {
    label: 'Контент',
    items: [
      { id: 'news', label: 'Мэдээ' },
      { id: 'videos', label: 'Бичлэг' },
      { id: 'podcasts', label: 'Podcast' },
      { id: 'drop', label: 'Drop' },
      { id: 'rappers', label: 'Рэппер' },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { id: 'shop', label: 'Shop' },
      { id: 'tickets', label: 'Тасалбар' },
      { id: 'sponsors', label: 'Sponsor' },
    ],
  },
  {
    label: 'Community',
    items: [
      { id: 'live', label: 'Live' },
      { id: 'wall', label: 'Wall' },
      { id: 'battle', label: 'Battle' },
      { id: 'chart', label: 'Топ дуу' },
      { id: 'audience', label: 'Жагсаалт' },
    ],
  },
  {
    label: 'System',
    items: [
      { id: 'staff', label: 'Staff' },
      { id: 'sync', label: 'YouTube' },
      { id: 'cloud', label: 'Cloud' },
    ],
  },
]

type EditorState = {
  title: string
  subtitle?: string
  fields: FieldDef[]
  values: Record<string, string | number | boolean>
  onSave: (values: Record<string, string | number | boolean>) => void
}

export function AdminPage() {
  const store = useStore()
  const { user, signInWithGoogle, loading: authLoading } = useAuth()
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('analytics')
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState<ToastState>(null)
  const [syncMsg, setSyncMsg] = useState<string | null>(null)
  const [staffEmail, setStaffEmail] = useState('')
  const [staffMsg, setStaffMsg] = useState<string | null>(null)
  const [googleBusy, setGoogleBusy] = useState(false)
  const [chartSyncing, setChartSyncing] = useState(false)
  const [chartSyncMsg, setChartSyncMsg] = useState<string | null>(null)
  const [cloudBusy, setCloudBusy] = useState(false)
  const [cloudMsg, setCloudMsg] = useState<string | null>(null)
  const [editor, setEditor] = useState<EditorState | null>(null)
  const [confirmDel, setConfirmDel] = useState<{
    label: string
    onConfirm: () => void
  } | null>(null)

  const summary = useMemo(() => store.analyticsSummary(), [store.data])
  const canEnterWithGoogle = Boolean(user && store.isEmailAdmin(user.email))

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 2800)
    return () => window.clearTimeout(t)
  }, [toast])

  useEffect(() => {
    setSearch('')
  }, [tab])

  const notify = (text: string, error?: boolean) => setToast({ text, error })

  const openEditor = (
    title: string,
    fields: FieldDef[],
    values: Record<string, string | number | boolean>,
    onSave: (values: Record<string, string | number | boolean>) => void,
    subtitle?: string,
  ) => setEditor({ title, subtitle, fields, values, onSave })

  const askDelete = (label: string, onConfirm: () => void) =>
    setConfirmDel({ label, onConfirm })

  if (!store.isAdmin) {
    return (
      <div className="admin-login">
        <div className="admin-login-card">
          <img src="/logo.png" alt="" width={48} height={48} />
          <h1>Newsac Admin</h1>
          <p>Контент, shop, live, wall — нэг мэргэжлийн панелиас удирд</p>

          {user ? (
            <div className="admin-login-user">
              <span>Нэвтэрсэн: {user.email}</span>
              {canEnterWithGoogle ? (
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={() => store.grantAdmin()}
                >
                  Admin нээх
                </button>
              ) : (
                <p className="admin-hint">
                  Энэ Gmail admin жагсаалтад алга. Доорх кодоор нэвтэрээд Staff таб дээр
                  Gmail-ээ нэм.
                </p>
              )}
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-ghost btn-block admin-google"
              disabled={googleBusy || authLoading}
              onClick={() => {
                setGoogleBusy(true)
                void signInWithGoogle().then((e) => {
                  setGoogleBusy(false)
                  if (e) setErr(e)
                })
              }}
            >
              Gmail-ээр нэвтрэх
            </button>
          )}

          <div className="admin-or">эсвэл код</div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              setErr(store.adminLogin(password))
            }}
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Нууц үг эсвэл утас"
              inputMode="numeric"
              required
            />
            <button className="btn btn-primary btn-block" type="submit">
              Кодоор нэвтрэх
            </button>
          </form>

          {err && <p className="admin-err">{err}</p>}
          <p className="admin-hint">Admin утас: {ADMIN_PHONES.join(' · ')}</p>
          <Link to="/" className="section-link">
            ← Сайт руу
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="admin">
      <header className="admin-top">
        <div>
          <strong>Newsac Admin</strong>
          <span>{user?.email || 'Код session'} · CMS</span>
        </div>
        <div className="admin-top-actions">
          <Link to="/" className="btn btn-ghost">
            Сайт
          </Link>
          <button type="button" className="btn btn-ghost" onClick={store.adminLogout}>
            Гарах
          </button>
        </div>
      </header>

      <div className="admin-layout">
        <nav className="admin-nav" aria-label="Admin sections">
          {NAV_GROUPS.map((group) => (
            <div className="admin-nav-group" key={group.label}>
              <span className="admin-nav-label">{group.label}</span>
              {group.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={tab === item.id ? 'active' : ''}
                  onClick={() => setTab(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="admin-body">
          {tab === 'analytics' && (
            <div className="admin-analytics">
              <div className="admin-panel-head">
                <div>
                  <h2>Аналитик</h2>
                  <p>Орлого, клик, engagement — нэг харагдац</p>
                </div>
              </div>
              <div className="admin-quick">
                <button type="button" onClick={() => setTab('drop')}>
                  Daily Drop
                </button>
                <button type="button" onClick={() => setTab('live')}>
                  Live
                </button>
                <button type="button" onClick={() => setTab('wall')}>
                  Wall
                </button>
                <button type="button" onClick={() => setTab('cloud')}>
                  Cloud sync
                </button>
                <button type="button" onClick={() => setTab('staff')}>
                  Staff Gmail
                </button>
              </div>
              <div className="stat-grid">
                <div className="stat">
                  <span>Shop орлого</span>
                  <strong>
                    {new Intl.NumberFormat('mn-MN').format(summary.shopRevenue)}₮
                  </strong>
                </div>
                <div className="stat">
                  <span>Тасалбар орлого</span>
                  <strong>
                    {new Intl.NumberFormat('mn-MN').format(summary.ticketRevenue)}₮
                  </strong>
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
            <EntityList
              title="Мэдээ"
              description="Нийтлэл нэмэх, засах, устгах"
              search={search}
              onSearch={setSearch}
              items={store.data.news.map((n) => ({
                id: n.id,
                label: n.title,
                meta: `${n.category} · ${n.date}`,
              }))}
              onCreate={() =>
                openEditor(
                  'Шинэ мэдээ',
                  newsFields,
                  {
                    title: '',
                    excerpt: '',
                    body: '',
                    category: 'Мэдээ',
                    date: todayDot(),
                    readMin: 3,
                    image: IMG.news,
                    membersOnly: false,
                  },
                  (v) => {
                    const item: NewsItem = {
                      id: crypto.randomUUID(),
                      title: String(v.title).trim(),
                      excerpt: String(v.excerpt).trim(),
                      body: String(v.body || v.excerpt),
                      category: String(v.category || 'Мэдээ'),
                      date: String(v.date || todayDot()),
                      readMin: Number(v.readMin) || 3,
                      image: String(v.image),
                      membersOnly: Boolean(v.membersOnly),
                    }
                    store.upsertNews(item)
                    notify('Мэдээ нэмэгдлээ')
                  },
                )
              }
              onEdit={(id) => {
                const n = store.data.news.find((x) => x.id === id)
                if (!n) return
                openEditor(
                  'Мэдээ засах',
                  newsFields,
                  { ...n, membersOnly: Boolean(n.membersOnly) },
                  (v) => {
                    store.upsertNews({
                      ...n,
                      title: String(v.title).trim(),
                      excerpt: String(v.excerpt).trim(),
                      body: String(v.body),
                      category: String(v.category),
                      date: String(v.date),
                      readMin: Number(v.readMin) || 3,
                      image: String(v.image),
                      membersOnly: Boolean(v.membersOnly),
                    })
                    notify('Мэдээ хадгалагдлаа')
                  },
                  n.title,
                )
              }}
              onDelete={(id) => {
                const n = store.data.news.find((x) => x.id === id)
                askDelete(n?.title || 'мэдээ', () => {
                  store.deleteNews(id)
                  notify('Устгагдлаа')
                })
              }}
            />
          )}

          {tab === 'videos' && (
            <EntityList
              title="Бичлэг"
              description="YouTube видео удирдлага"
              search={search}
              onSearch={setSearch}
              items={store.data.videos.map((n) => ({
                id: n.id,
                label: n.title,
                meta: n.youtubeId,
              }))}
              onCreate={() =>
                openEditor(
                  'Шинэ бичлэг',
                  videoFields,
                  {
                    title: '',
                    youtubeId: '',
                    description: '',
                    views: '0',
                    duration: '',
                    published: 'саяхан',
                    membersOnly: false,
                  },
                  (v) => {
                    store.upsertVideo({
                      id: crypto.randomUUID(),
                      title: String(v.title).trim(),
                      youtubeId: String(v.youtubeId).trim(),
                      description: String(v.description || 'Admin-аас нэмсэн'),
                      views: String(v.views || '0'),
                      duration: String(v.duration || ''),
                      published: String(v.published || 'саяхан'),
                      membersOnly: Boolean(v.membersOnly),
                    })
                    notify('Бичлэг нэмэгдлээ')
                  },
                )
              }
              onEdit={(id) => {
                const n = store.data.videos.find((x) => x.id === id)
                if (!n) return
                openEditor(
                  'Бичлэг засах',
                  videoFields,
                  { ...n, membersOnly: Boolean(n.membersOnly) },
                  (v) => {
                    store.upsertVideo({
                      ...n,
                      title: String(v.title).trim(),
                      youtubeId: String(v.youtubeId).trim(),
                      description: String(v.description),
                      views: String(v.views),
                      duration: String(v.duration),
                      published: String(v.published),
                      membersOnly: Boolean(v.membersOnly),
                    })
                    notify('Бичлэг хадгалагдлаа')
                  },
                  n.title,
                )
              }}
              onDelete={(id) => {
                const n = store.data.videos.find((x) => x.id === id)
                askDelete(n?.title || 'бичлэг', () => {
                  store.deleteVideo(id)
                  notify('Устгагдлаа')
                })
              }}
            />
          )}

          {tab === 'rappers' && (
            <EntityList
              title="Рэппер"
              description="Профайл + Artist Hub холболт"
              search={search}
              onSearch={setSearch}
              items={store.data.rappers.map((n) => ({
                id: n.id,
                label: n.name,
                meta: [n.city, n.verified ? 'verified' : '', n.ownerEmail || '']
                  .filter(Boolean)
                  .join(' · '),
              }))}
              onCreate={() =>
                openEditor(
                  'Шинэ рэппер',
                  rapperFields,
                  {
                    name: '',
                    aka: '',
                    city: 'Улаанбаатар',
                    years: '2024 — одоо',
                    streams: '0',
                    bio: '',
                    story: '',
                    image: IMG.rapper,
                    tags: 'New',
                    ownerEmail: '',
                    verified: false,
                  },
                  (v) => {
                    const name = String(v.name).trim()
                    const id = crypto.randomUUID()
                    const item: Rapper = {
                      id,
                      name,
                      aka: String(v.aka || name.slice(0, 3).toUpperCase()),
                      city: String(v.city || 'Улаанбаатар'),
                      years: String(v.years),
                      bio: String(v.bio || 'Шинэ рэппер'),
                      story: String(v.story || ''),
                      image: String(v.image),
                      tags: String(v.tags || '')
                        .split(',')
                        .map((t) => t.trim())
                        .filter(Boolean),
                      streams: String(v.streams || '0'),
                      verified: Boolean(v.verified),
                      ownerEmail:
                        String(v.ownerEmail || '')
                          .trim()
                          .toLowerCase() || undefined,
                    }
                    store.upsertRapper(item)
                    if (item.ownerEmail) store.linkRapperOwner(id, item.ownerEmail)
                    notify('Рэппер нэмэгдлээ')
                  },
                )
              }
              onEdit={(id) => {
                const n = store.data.rappers.find((x) => x.id === id)
                if (!n) return
                openEditor(
                  'Рэппер засах',
                  rapperFields,
                  {
                    ...n,
                    tags: n.tags.join(', '),
                    ownerEmail: n.ownerEmail || '',
                    verified: Boolean(n.verified),
                  },
                  (v) => {
                    const ownerEmail =
                      String(v.ownerEmail || '')
                        .trim()
                        .toLowerCase() || undefined
                    store.upsertRapper({
                      ...n,
                      name: String(v.name).trim(),
                      aka: String(v.aka),
                      city: String(v.city),
                      years: String(v.years),
                      bio: String(v.bio),
                      story: String(v.story),
                      image: String(v.image),
                      tags: String(v.tags || '')
                        .split(',')
                        .map((t) => t.trim())
                        .filter(Boolean),
                      streams: String(v.streams),
                      verified: Boolean(v.verified),
                      ownerEmail,
                    })
                    if (ownerEmail) store.linkRapperOwner(n.id, ownerEmail)
                    notify('Рэппер хадгалагдлаа')
                  },
                  n.name,
                )
              }}
              onDelete={(id) => {
                const n = store.data.rappers.find((x) => x.id === id)
                askDelete(n?.name || 'рэппер', () => {
                  store.deleteRapper(id)
                  notify('Устгагдлаа')
                })
              }}
            />
          )}

          {tab === 'shop' && (
            <EntityList
              title="Shop"
              description="Merch, digital, tip"
              search={search}
              onSearch={setSearch}
              items={store.data.products.map((n) => ({
                id: n.id,
                label: n.name,
                meta: `${n.price}₮ · ${n.type}${n.active ? '' : ' · off'}`,
              }))}
              onCreate={() =>
                openEditor(
                  'Шинэ бараа',
                  productFields,
                  {
                    name: '',
                    description: '',
                    price: 29000,
                    stock: 50,
                    type: 'merch',
                    image: IMG.product,
                    active: true,
                  },
                  (v) => {
                    store.upsertProduct({
                      id: crypto.randomUUID(),
                      name: String(v.name).trim(),
                      description: String(v.description || 'Шинэ бараа'),
                      price: Number(v.price) || 0,
                      type: v.type as Product['type'],
                      image: String(v.image),
                      stock: Number(v.stock) || 0,
                      active: Boolean(v.active),
                    })
                    notify('Бараа нэмэгдлээ')
                  },
                )
              }
              onEdit={(id) => {
                const n = store.data.products.find((x) => x.id === id)
                if (!n) return
                openEditor(
                  'Бараа засах',
                  productFields,
                  { ...n },
                  (v) => {
                    store.upsertProduct({
                      ...n,
                      name: String(v.name).trim(),
                      description: String(v.description),
                      price: Number(v.price) || 0,
                      type: v.type as Product['type'],
                      image: String(v.image),
                      stock: Number(v.stock) || 0,
                      active: Boolean(v.active),
                    })
                    notify('Бараа хадгалагдлаа')
                  },
                  n.name,
                )
              }}
              onDelete={(id) => {
                const n = store.data.products.find((x) => x.id === id)
                askDelete(n?.name || 'бараа', () => {
                  store.deleteProduct(id)
                  notify('Устгагдлаа')
                })
              }}
            />
          )}

          {tab === 'tickets' && (
            <EntityList
              title="Тасалбар"
              description="Тоглолт, суудал, үнэ"
              search={search}
              onSearch={setSearch}
              items={store.data.shows.map((n) => ({
                id: n.id,
                label: n.title,
                meta: `${n.date} · ${n.seatsLeft + n.vipLeft} үлдсэн`,
              }))}
              onCreate={() =>
                openEditor(
                  'Шинэ тоглолт',
                  showFields,
                  {
                    title: '',
                    artists: 'Lineup TBA',
                    venue: 'Venue',
                    city: 'Улаанбаатар',
                    date: '2026.09.01',
                    time: '20:00',
                    price: 55000,
                    vipPrice: 110000,
                    seatsLeft: 200,
                    vipLeft: 40,
                    description: '',
                    image: IMG.show,
                    active: true,
                  },
                  (v) => {
                    const price = Number(v.price) || 55000
                    store.upsertShow({
                      id: crypto.randomUUID(),
                      title: String(v.title).trim(),
                      artists: String(v.artists),
                      venue: String(v.venue),
                      city: String(v.city),
                      date: String(v.date),
                      time: String(v.time),
                      image: String(v.image),
                      description: String(v.description || 'Шинэ тоглолт'),
                      price,
                      vipPrice: Number(v.vipPrice) || Math.round(price * 2),
                      seatsLeft: Number(v.seatsLeft) || 0,
                      vipLeft: Number(v.vipLeft) || 0,
                      active: Boolean(v.active),
                    })
                    notify('Тоглолт нэмэгдлээ')
                  },
                )
              }
              onEdit={(id) => {
                const n = store.data.shows.find((x) => x.id === id)
                if (!n) return
                openEditor(
                  'Тоглолт засах',
                  showFields,
                  { ...n },
                  (v) => {
                    store.upsertShow({
                      ...n,
                      title: String(v.title).trim(),
                      artists: String(v.artists),
                      venue: String(v.venue),
                      city: String(v.city),
                      date: String(v.date),
                      time: String(v.time),
                      image: String(v.image),
                      description: String(v.description),
                      price: Number(v.price) || n.price,
                      vipPrice: Number(v.vipPrice) || n.vipPrice,
                      seatsLeft: Number(v.seatsLeft) || 0,
                      vipLeft: Number(v.vipLeft) || 0,
                      active: Boolean(v.active),
                    })
                    notify('Тоглолт хадгалагдлаа')
                  },
                  n.title,
                )
              }}
              onDelete={(id) => {
                const n = store.data.shows.find((x) => x.id === id)
                askDelete(n?.title || 'тоглолт', () => {
                  store.deleteShow(id)
                  notify('Устгагдлаа')
                })
              }}
            />
          )}

          {tab === 'podcasts' && (
            <EntityList
              title="Podcast"
              description="Цуврал + audio URL"
              search={search}
              onSearch={setSearch}
              items={store.data.podcasts.map((n) => ({
                id: n.id,
                label: n.title,
                meta: n.duration,
              }))}
              onCreate={() =>
                openEditor(
                  'Шинэ podcast',
                  podcastFields,
                  {
                    title: '',
                    description: '',
                    audioUrl: IMG.audio,
                    cover: IMG.podcast,
                    duration: '30:00',
                    published: 'саяхан',
                    guests: 'Newsac',
                    membersOnly: false,
                  },
                  (v) => {
                    store.upsertPodcast({
                      id: crypto.randomUUID(),
                      title: String(v.title).trim(),
                      description: String(v.description || 'Шинэ podcast'),
                      cover: String(v.cover),
                      audioUrl: String(v.audioUrl),
                      duration: String(v.duration),
                      published: String(v.published),
                      guests: String(v.guests || ''),
                      membersOnly: Boolean(v.membersOnly),
                    })
                    notify('Podcast нэмэгдлээ')
                  },
                )
              }
              onEdit={(id) => {
                const n = store.data.podcasts.find((x) => x.id === id)
                if (!n) return
                openEditor(
                  'Podcast засах',
                  podcastFields,
                  {
                    ...n,
                    guests: n.guests || '',
                    membersOnly: Boolean(n.membersOnly),
                  },
                  (v) => {
                    store.upsertPodcast({
                      ...n,
                      title: String(v.title).trim(),
                      description: String(v.description),
                      cover: String(v.cover),
                      audioUrl: String(v.audioUrl),
                      duration: String(v.duration),
                      published: String(v.published),
                      guests: String(v.guests || ''),
                      membersOnly: Boolean(v.membersOnly),
                    })
                    notify('Podcast хадгалагдлаа')
                  },
                  n.title,
                )
              }}
              onDelete={(id) => {
                const n = store.data.podcasts.find((x) => x.id === id)
                askDelete(n?.title || 'podcast', () => {
                  store.deletePodcast(id)
                  notify('Устгагдлаа')
                })
              }}
            />
          )}

          {tab === 'drop' && (
            <EntityList
              title="Daily Drop"
              description="Өдөр бүрийн featured контент"
              search={search}
              onSearch={setSearch}
              items={store.data.dailyDrops.map((n) => ({
                id: n.id,
                label: n.title,
                meta: `${n.date} · ${n.kind}`,
              }))}
              onCreate={() =>
                openEditor(
                  'Шинэ drop',
                  dropFields,
                  {
                    title: '',
                    date: todayIso(),
                    kind: 'podcast',
                    targetId: '',
                    teaser: '',
                    image: IMG.podcast,
                  },
                  (v) => {
                    store.upsertDailyDrop({
                      id: crypto.randomUUID(),
                      title: String(v.title).trim(),
                      date: String(v.date),
                      kind: v.kind as DailyDrop['kind'],
                      targetId: String(v.targetId).trim(),
                      teaser: String(v.teaser || 'Өнөөдрийн drop'),
                      image: String(v.image),
                    })
                    notify('Drop нэмэгдлээ')
                  },
                )
              }
              onEdit={(id) => {
                const n = store.data.dailyDrops.find((x) => x.id === id)
                if (!n) return
                openEditor(
                  'Drop засах',
                  dropFields,
                  { ...n },
                  (v) => {
                    store.upsertDailyDrop({
                      ...n,
                      title: String(v.title).trim(),
                      date: String(v.date),
                      kind: v.kind as DailyDrop['kind'],
                      targetId: String(v.targetId).trim(),
                      teaser: String(v.teaser),
                      image: String(v.image),
                    })
                    notify('Drop хадгалагдлаа')
                  },
                  n.title,
                )
              }}
              onDelete={(id) => {
                const n = store.data.dailyDrops.find((x) => x.id === id)
                askDelete(n?.title || 'drop', () => {
                  store.deleteDailyDrop(id)
                  notify('Устгагдлаа')
                })
              }}
            />
          )}

          {tab === 'live' && (
            <EntityList
              title="Livestream"
              description="Шууд / upcoming / ended"
              search={search}
              onSearch={setSearch}
              items={store.data.livestreams.map((n) => ({
                id: n.id,
                label: n.title,
                meta: n.status.toUpperCase(),
              }))}
              onCreate={() =>
                openEditor(
                  'Шинэ live',
                  liveFields,
                  {
                    title: '',
                    status: 'upcoming',
                    youtubeId: '',
                    startsAt: new Date(Date.now() + 3600000).toISOString(),
                    viewers: 0,
                    cover: IMG.live,
                    hostName: '',
                  },
                  (v) => {
                    const status = v.status as Livestream['status']
                    store.upsertLivestream({
                      id: crypto.randomUUID(),
                      title: String(v.title).trim(),
                      status,
                      youtubeId: String(v.youtubeId || '').trim() || undefined,
                      startsAt: String(v.startsAt),
                      viewers: Number(v.viewers) || (status === 'live' ? 120 : 0),
                      cover: String(v.cover),
                      hostName: String(v.hostName || '').trim() || undefined,
                    })
                    notify('Live нэмэгдлээ')
                  },
                )
              }
              onEdit={(id) => {
                const n = store.data.livestreams.find((x) => x.id === id)
                if (!n) return
                openEditor(
                  'Live засах',
                  liveFields,
                  {
                    title: n.title,
                    status: n.status,
                    youtubeId: n.youtubeId || '',
                    startsAt: n.startsAt,
                    viewers: n.viewers || 0,
                    cover: n.cover,
                    hostName: n.hostName || '',
                  },
                  (v) => {
                    store.upsertLivestream({
                      ...n,
                      title: String(v.title).trim(),
                      status: v.status as Livestream['status'],
                      youtubeId: String(v.youtubeId || '').trim() || undefined,
                      startsAt: String(v.startsAt),
                      viewers: Number(v.viewers) || 0,
                      cover: String(v.cover),
                      hostName: String(v.hostName || '').trim() || undefined,
                    })
                    notify('Live хадгалагдлаа')
                  },
                  n.title,
                )
              }}
              onDelete={(id) => {
                const n = store.data.livestreams.find((x) => x.id === id)
                askDelete(n?.title || 'live', () => {
                  store.deleteLivestream(id)
                  notify('Устгагдлаа')
                })
              }}
            />
          )}

          {tab === 'wall' && (
            <EntityList
              title="Wall"
              description="Community постууд"
              search={search}
              onSearch={setSearch}
              items={store.data.wallPosts.map((n) => ({
                id: n.id,
                label: n.text.slice(0, 60) + (n.text.length > 60 ? '…' : ''),
                meta: n.authorName,
              }))}
              onCreate={() =>
                openEditor(
                  'Шинэ пост',
                  wallFields,
                  { authorName: 'Newsac Admin', text: '', image: '' },
                  (v) => {
                    store.upsertWallPost({
                      id: crypto.randomUUID(),
                      authorName: String(v.authorName).trim() || 'Newsac Admin',
                      text: String(v.text).trim(),
                      image: String(v.image || '').trim() || undefined,
                      createdAt: new Date().toISOString(),
                      fires: 0,
                      colds: 0,
                      comments: [],
                    })
                    notify('Пост нэмэгдлээ')
                  },
                )
              }
              onEdit={(id) => {
                const n = store.data.wallPosts.find((x) => x.id === id)
                if (!n) return
                openEditor(
                  'Пост засах',
                  wallFields,
                  {
                    authorName: n.authorName,
                    text: n.text,
                    image: n.image || '',
                  },
                  (v) => {
                    store.upsertWallPost({
                      ...n,
                      authorName: String(v.authorName).trim(),
                      text: String(v.text).trim(),
                      image: String(v.image || '').trim() || undefined,
                    })
                    notify('Пост хадгалагдлаа')
                  },
                )
              }}
              onDelete={(id) => {
                askDelete('энэ пост', () => {
                  store.deleteWallPost(id)
                  notify('Устгагдлаа')
                })
              }}
            />
          )}

          {tab === 'sponsors' && (
            <EntityList
              title="Sponsor"
              description="Home / videos / shop slot"
              search={search}
              onSearch={setSearch}
              items={store.data.sponsors.map((n) => ({
                id: n.id,
                label: n.name,
                meta: `${n.slot}${n.active ? '' : ' · off'}`,
              }))}
              onCreate={() =>
                openEditor(
                  'Шинэ sponsor',
                  sponsorFields,
                  {
                    name: '',
                    tagline: '',
                    url: 'https://www.youtube.com/@Newsacchannel',
                    image: IMG.sponsor,
                    slot: 'home',
                    cpm: 100000,
                    active: true,
                  },
                  (v) => {
                    store.upsertSponsor({
                      id: crypto.randomUUID(),
                      name: String(v.name).trim(),
                      tagline: String(v.tagline || 'Sponsor'),
                      url: String(v.url),
                      image: String(v.image),
                      slot: v.slot as Sponsor['slot'],
                      active: Boolean(v.active),
                      cpm: Number(v.cpm) || 0,
                    })
                    notify('Sponsor нэмэгдлээ')
                  },
                )
              }
              onEdit={(id) => {
                const n = store.data.sponsors.find((x) => x.id === id)
                if (!n) return
                openEditor(
                  'Sponsor засах',
                  sponsorFields,
                  { ...n },
                  (v) => {
                    store.upsertSponsor({
                      ...n,
                      name: String(v.name).trim(),
                      tagline: String(v.tagline),
                      url: String(v.url),
                      image: String(v.image),
                      slot: v.slot as Sponsor['slot'],
                      active: Boolean(v.active),
                      cpm: Number(v.cpm) || 0,
                    })
                    notify('Sponsor хадгалагдлаа')
                  },
                  n.name,
                )
              }}
              onDelete={(id) => {
                const n = store.data.sponsors.find((x) => x.id === id)
                askDelete(n?.name || 'sponsor', () => {
                  store.deleteSponsor(id)
                  notify('Устгагдлаа')
                })
              }}
            />
          )}

          {tab === 'chart' && (
            <EntityList
              title="Топ дуу"
              description="Долоо хоногийн Монгол чарт"
              search={search}
              onSearch={setSearch}
              extra={
                <div className="sync-box" style={{ marginBottom: '1rem' }}>
                  <h3>YouTube Монгол music chart</h3>
                  <p>
                    Сүүлийн 45 хоногийн Монгол music видеонуудыг public view count-аар
                    эрэмбэлж шинэчилнэ.
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={chartSyncing}
                    onClick={() => {
                      setChartSyncing(true)
                      setChartSyncMsg(null)
                      void store
                        .syncMusicChart()
                        .then((count) => {
                          const msg = count
                            ? `${count} YouTube дуугаар чарт шинэчлэгдлээ.`
                            : 'Тохирох Монгол music видео олдсонгүй.'
                          setChartSyncMsg(msg)
                          notify(msg, !count)
                        })
                        .catch((error: unknown) => {
                          const msg =
                            error instanceof Error ? error.message : 'YouTube sync алдаа.'
                          setChartSyncMsg(msg)
                          notify(msg, true)
                        })
                        .finally(() => setChartSyncing(false))
                    }}
                  >
                    {chartSyncing ? 'Шинэчилж байна…' : 'YouTube-ээс чарт шинэчлэх'}
                  </button>
                  {chartSyncMsg && <p className="checkout-result">{chartSyncMsg}</p>}
                </div>
              }
              items={[...store.data.chartSongs]
                .sort((a, b) => a.rank - b.rank)
                .map((n) => ({
                  id: n.id,
                  label: `#${n.rank} ${n.title}`,
                  meta: n.artist,
                }))}
              onCreate={() =>
                openEditor(
                  'Шинэ дуу',
                  chartFields,
                  {
                    rank: store.data.chartSongs.length + 1,
                    title: '',
                    artist: '',
                    plays: '0',
                    change: 0,
                    weekOf: todayIso(),
                    spotifyTrackId: '',
                    audioUrl: IMG.audio,
                    youtubeId: '',
                    cover: IMG.news,
                    isNew: true,
                  },
                  (v) => {
                    store.upsertChartSong({
                      id: crypto.randomUUID(),
                      rank: Number(v.rank) || 1,
                      title: String(v.title).trim(),
                      artist: String(v.artist).trim(),
                      spotifyTrackId: String(v.spotifyTrackId || ''),
                      cover: String(v.cover),
                      plays: String(v.plays || '0'),
                      change: Number(v.change) || 0,
                      weekOf: String(v.weekOf || todayIso()),
                      audioUrl: String(v.audioUrl || ''),
                      youtubeId: String(v.youtubeId || '').trim() || undefined,
                      isNew: Boolean(v.isNew),
                    })
                    notify('Дуу нэмэгдлээ')
                  },
                )
              }
              onEdit={(id) => {
                const n = store.data.chartSongs.find((x) => x.id === id)
                if (!n) return
                openEditor(
                  'Дуу засах',
                  chartFields,
                  { ...n, youtubeId: n.youtubeId || '', isNew: Boolean(n.isNew) },
                  (v) => {
                    store.upsertChartSong({
                      ...n,
                      rank: Number(v.rank) || n.rank,
                      title: String(v.title).trim(),
                      artist: String(v.artist).trim(),
                      spotifyTrackId: String(v.spotifyTrackId || ''),
                      cover: String(v.cover),
                      plays: String(v.plays),
                      change: Number(v.change) || 0,
                      weekOf: String(v.weekOf),
                      audioUrl: String(v.audioUrl || ''),
                      youtubeId: String(v.youtubeId || '').trim() || undefined,
                      isNew: Boolean(v.isNew),
                    })
                    notify('Дуу хадгалагдлаа')
                  },
                  n.title,
                )
              }}
              onDelete={(id) => {
                const n = store.data.chartSongs.find((x) => x.id === id)
                askDelete(n?.title || 'дуу', () => {
                  store.deleteChartSong(id)
                  notify('Устгагдлаа')
                })
              }}
            />
          )}

          {tab === 'battle' && (
            <EntityList
              title="Battle / Cypher"
              description="Фэн санал, хоёр тал"
              search={search}
              onSearch={setSearch}
              items={store.data.battles.map((n) => ({
                id: n.id,
                label: n.title,
                meta: n.status,
              }))}
              onCreate={() =>
                openEditor(
                  'Шинэ battle',
                  battleFields,
                  {
                    title: '',
                    subtitle: 'Фэн санал · Newsac Cypher',
                    status: 'open',
                    city: 'Улаанбаатар',
                    endsAt: new Date(Date.now() + 7 * 86400000).toISOString(),
                    sideA: '',
                    sideB: '',
                    cover: IMG.battle,
                  },
                  (v) => {
                    const item: Battle = {
                      id: crypto.randomUUID(),
                      title: String(v.title).trim(),
                      subtitle: String(v.subtitle || 'Фэн санал · Newsac Cypher'),
                      status: v.status as Battle['status'],
                      endsAt: String(v.endsAt),
                      cover: String(v.cover),
                      city: String(v.city || ''),
                      sides: [
                        {
                          id: crypto.randomUUID(),
                          name: String(v.sideA).trim(),
                          image: IMG.sideA,
                          votes: 0,
                        },
                        {
                          id: crypto.randomUUID(),
                          name: String(v.sideB).trim(),
                          image: IMG.sideB,
                          votes: 0,
                        },
                      ],
                    }
                    store.upsertBattle(item)
                    notify('Battle нэмэгдлээ')
                  },
                )
              }
              onEdit={(id) => {
                const n = store.data.battles.find((x) => x.id === id)
                if (!n) return
                openEditor(
                  'Battle засах',
                  battleFields,
                  {
                    title: n.title,
                    subtitle: n.subtitle,
                    status: n.status,
                    city: n.city || '',
                    endsAt: n.endsAt,
                    sideA: n.sides[0].name,
                    sideB: n.sides[1].name,
                    cover: n.cover,
                  },
                  (v) => {
                    store.upsertBattle({
                      ...n,
                      title: String(v.title).trim(),
                      subtitle: String(v.subtitle),
                      status: v.status as Battle['status'],
                      endsAt: String(v.endsAt),
                      cover: String(v.cover),
                      city: String(v.city || ''),
                      sides: [
                        { ...n.sides[0], name: String(v.sideA).trim() },
                        { ...n.sides[1], name: String(v.sideB).trim() },
                      ],
                    })
                    notify('Battle хадгалагдлаа')
                  },
                  n.title,
                )
              }}
              onDelete={(id) => {
                const n = store.data.battles.find((x) => x.id === id)
                askDelete(n?.title || 'battle', () => {
                  store.deleteBattle(id)
                  notify('Устгагдлаа')
                })
              }}
            />
          )}

          {tab === 'audience' && (
            <div>
              <div className="admin-panel-head">
                <div>
                  <h2>Жагсаалт</h2>
                  <p>Subscriber + сүүлийн захиалга</p>
                </div>
              </div>
              <h3>Имэйл / Telegram ({store.data.subscribers.length})</h3>
              <ul className="admin-list">
                {store.data.subscribers.map((s) => (
                  <li key={s.id}>
                    <div className="admin-list-meta">
                      <strong>{s.value}</strong>
                      <span>{s.channel}</span>
                    </div>
                  </li>
                ))}
                {!store.data.subscribers.length && (
                  <li>
                    <div className="admin-list-meta">
                      <strong>Одоогоор хоосон</strong>
                    </div>
                  </li>
                )}
              </ul>
              <h3>Тасалбарын захиалга</h3>
              <ul className="admin-list">
                {store.data.ticketOrders.slice(0, 12).map((o) => (
                  <li key={o.id}>
                    <div className="admin-list-meta">
                      <strong>
                        {o.code} · {o.showTitle}
                      </strong>
                      <span>
                        {o.qty}×{o.tier} ·{' '}
                        {new Intl.NumberFormat('mn-MN').format(o.total)}₮ · {o.email}
                      </span>
                    </div>
                  </li>
                ))}
                {!store.data.ticketOrders.length && (
                  <li>
                    <div className="admin-list-meta">
                      <strong>Захиалга байхгүй</strong>
                    </div>
                  </li>
                )}
              </ul>
              <h3>Shop захиалга</h3>
              <ul className="admin-list">
                {store.data.orders.slice(0, 10).map((o) => (
                  <li key={o.id}>
                    <div className="admin-list-meta">
                      <strong>{o.email}</strong>
                      <span>
                        {new Intl.NumberFormat('mn-MN').format(o.total)}₮ · {o.method}
                      </span>
                    </div>
                  </li>
                ))}
                {!store.data.orders.length && (
                  <li>
                    <div className="admin-list-meta">
                      <strong>Захиалга байхгүй</strong>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          )}

          {tab === 'staff' && (
            <div className="staff-box">
              <h3>Staff Gmail</h3>
              <p>
                Эдгээр Gmail-ээр нэвтрэхэд Admin panel нээгдэнэ. Одоо:{' '}
                {store.data.adminEmails.length
                  ? store.data.adminEmails.join(', ')
                  : 'хоосон'}
              </p>
              <form
                className="staff-form"
                onSubmit={(e) => {
                  e.preventDefault()
                  const msg = store.addAdminEmail(staffEmail)
                  if (msg) setStaffMsg(msg)
                  else {
                    setStaffMsg('Нэмэгдлээ.')
                    setStaffEmail('')
                    notify('Staff нэмэгдлээ')
                  }
                }}
              >
                <input
                  type="email"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  required
                />
                <button type="submit" className="btn btn-primary">
                  Нэмэх
                </button>
              </form>
              {user && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ marginTop: '0.65rem' }}
                  onClick={() => {
                    const msg = store.addAdminEmail(user.email)
                    setStaffMsg(msg || `${user.email} нэмэгдлээ.`)
                    if (!msg) {
                      store.grantAdmin()
                      notify('Gmail нэмэгдлээ')
                    }
                  }}
                >
                  Миний Gmail нэмэх ({user.email})
                </button>
              )}
              {staffMsg && <p className="checkout-result">{staffMsg}</p>}
              <ul className="admin-list" style={{ marginTop: '1rem' }}>
                {store.data.adminEmails.map((email) => (
                  <li key={email}>
                    <span>{email}</span>
                    <div className="crud-actions">
                      <button
                        type="button"
                        className="danger"
                        onClick={() => {
                          askDelete(email, () => {
                            store.removeAdminEmail(email)
                            notify('Staff хасагдлаа')
                          })
                        }}
                      >
                        Хасах
                      </button>
                    </div>
                  </li>
                ))}
                {!store.data.adminEmails.length && (
                  <li>
                    <div className="admin-list-meta">
                      <strong>Одоогоор хоосон — Gmail нэмнэ үү</strong>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          )}

          {tab === 'sync' && (
            <div className="sync-box">
              <h3>YouTube sync</h3>
              <p>
                @Newsacchannel сувгийн сүүлийн upload-уудыг YouTube API-аар татна. Сүүлийн
                sync:{' '}
                {store.data.lastYoutubeSync
                  ? new Date(store.data.lastYoutubeSync).toLocaleString('mn-MN')
                  : 'байхгүй'}
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={async () => {
                  try {
                    setSyncMsg('Sync хийж байна…')
                    const n = await store.syncYoutube()
                    const msg =
                      n > 0
                        ? `${n} шинэ бичлэг нэмэгдлээ.`
                        : 'Шинэ бичлэг байхгүй · үзэлт шинэчлэгдлээ.'
                    setSyncMsg(msg)
                    notify(msg)
                  } catch (err) {
                    const m =
                      err instanceof Error ? err.message : 'YouTube sync амжилтгүй.'
                    setSyncMsg(m)
                    notify(m, true)
                  }
                }}
              >
                Одоо sync хийх
              </button>
              {syncMsg && (
                <p
                  className={`checkout-result${syncMsg.includes('амжилтгүй') ? ' is-error' : ''}`}
                >
                  {syncMsg}
                </p>
              )}
            </div>
          )}

          {tab === 'cloud' && (
            <div className="sync-box">
              <h3>Supabase Cloud sync</h3>
              <p>
                Бүх CMS өгөгдлийг <code>app_snapshots</code> хүснэгт рүү push / pull хийнэ.
                Эхлээд <code>supabase/schema.sql</code>-ийг SQL Editor дээр ажиллуулна уу.
                Сүүлийн sync:{' '}
                {store.data.lastCloudSync
                  ? new Date(store.data.lastCloudSync).toLocaleString('mn-MN')
                  : 'байхгүй'}
              </p>
              <div className="admin-quick" style={{ marginTop: '1rem' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={cloudBusy}
                  onClick={async () => {
                    setCloudBusy(true)
                    setCloudMsg(null)
                    try {
                      await store.pushCloud()
                      setCloudMsg('Cloud руу амжилттай push хийгдлээ.')
                      notify('Cloud push амжилттай')
                    } catch (e) {
                      const m = e instanceof Error ? e.message : 'Push амжилтгүй'
                      setCloudMsg(m)
                      notify(m, true)
                    } finally {
                      setCloudBusy(false)
                    }
                  }}
                >
                  Push → Cloud
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  disabled={cloudBusy}
                  onClick={async () => {
                    setCloudBusy(true)
                    setCloudMsg(null)
                    try {
                      const res = await store.pullCloud()
                      const m =
                        res === 'empty'
                          ? 'Cloud хоосон — эхлээд Push хийнэ үү.'
                          : 'Cloud-оос татагдлаа.'
                      setCloudMsg(m)
                      notify(m, res === 'empty')
                    } catch (e) {
                      const m = e instanceof Error ? e.message : 'Pull амжилтгүй'
                      setCloudMsg(m)
                      notify(m, true)
                    } finally {
                      setCloudBusy(false)
                    }
                  }}
                >
                  Pull ← Cloud
                </button>
              </div>
              {cloudMsg && (
                <p
                  className={`checkout-result${
                    cloudMsg.includes('амжилтгүй') || cloudMsg.includes('хоосон')
                      ? ' is-error'
                      : ''
                  }`}
                >
                  {cloudMsg}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {editor && (
        <EditorModal
          title={editor.title}
          subtitle={editor.subtitle}
          fields={editor.fields}
          initial={editor.values}
          onClose={() => setEditor(null)}
          onSave={(values) => {
            editor.onSave(values)
            setEditor(null)
          }}
        />
      )}

      {confirmDel && (
        <Modal
          title="Устгах уу?"
          subtitle={`«${confirmDel.label}» — буцаах боломжгүй`}
          onClose={() => setConfirmDel(null)}
        >
          <div className="admin-modal-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setConfirmDel(null)}>
              Болих
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                confirmDel.onConfirm()
                setConfirmDel(null)
              }}
            >
              Устгах
            </button>
          </div>
        </Modal>
      )}

      <Toast toast={toast} />
    </div>
  )
}

export function AdminRedirect() {
  return <Navigate to="/admin" replace />
}
