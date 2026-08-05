import type { FieldDef } from './adminUi'

export function todayDot() {
  return new Date().toISOString().slice(0, 10).replace(/-/g, '.')
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export const newsFields: FieldDef[] = [
  { key: 'title', label: 'Гарчиг', required: true },
  { key: 'excerpt', label: 'Товч', type: 'textarea', required: true },
  { key: 'body', label: 'Бүрэн текст', type: 'textarea' },
  { key: 'category', label: 'Ангилал', half: true },
  { key: 'date', label: 'Огноо', half: true, placeholder: '2026.08.06' },
  { key: 'readMin', label: 'Унших мин', type: 'number', half: true },
  { key: 'image', label: 'Зураг URL', type: 'url', half: true },
  { key: 'membersOnly', label: 'Members only', type: 'checkbox' },
]

export const videoFields: FieldDef[] = [
  { key: 'title', label: 'Гарчиг', required: true },
  { key: 'youtubeId', label: 'YouTube ID', required: true },
  { key: 'description', label: 'Тайлбар', type: 'textarea' },
  { key: 'views', label: 'Үзэлт', half: true },
  { key: 'duration', label: 'Үргэлжлэх', half: true, placeholder: '3:21' },
  { key: 'published', label: 'Нийтэлсэн', half: true },
  { key: 'membersOnly', label: 'Members only', type: 'checkbox', half: true },
]

export const rapperFields: FieldDef[] = [
  { key: 'name', label: 'Нэр', required: true },
  { key: 'aka', label: 'AKA', half: true },
  { key: 'city', label: 'Хот', half: true },
  { key: 'years', label: 'Жил', half: true },
  { key: 'streams', label: 'Streams', half: true },
  { key: 'bio', label: 'Bio', type: 'textarea' },
  { key: 'story', label: 'Түүх', type: 'textarea' },
  { key: 'image', label: 'Зураг URL', type: 'url' },
  { key: 'tags', label: 'Tags (таслалаар)', placeholder: 'Trap, UB' },
  { key: 'ownerEmail', label: 'Artist Gmail' },
  { key: 'verified', label: 'Verified артист', type: 'checkbox' },
]

export const productFields: FieldDef[] = [
  { key: 'name', label: 'Нэр', required: true },
  { key: 'description', label: 'Тайлбар', type: 'textarea' },
  { key: 'price', label: 'Үнэ (₮)', type: 'number', half: true, required: true },
  { key: 'stock', label: 'Нөөц', type: 'number', half: true },
  {
    key: 'type',
    label: 'Төрөл',
    type: 'select',
    half: true,
    options: [
      { value: 'merch', label: 'Merch' },
      { value: 'digital', label: 'Digital' },
      { value: 'tip', label: 'Tip' },
    ],
  },
  { key: 'image', label: 'Зураг URL', type: 'url', half: true },
  { key: 'active', label: 'Идэвхтэй', type: 'checkbox' },
]

export const showFields: FieldDef[] = [
  { key: 'title', label: 'Тоглолт', required: true },
  { key: 'artists', label: 'Артистууд' },
  { key: 'venue', label: 'Газар', half: true },
  { key: 'city', label: 'Хот', half: true },
  { key: 'date', label: 'Огноо', half: true },
  { key: 'time', label: 'Цаг', half: true },
  { key: 'price', label: 'Standard ₮', type: 'number', half: true },
  { key: 'vipPrice', label: 'VIP ₮', type: 'number', half: true },
  { key: 'seatsLeft', label: 'Standard үлдэгдэл', type: 'number', half: true },
  { key: 'vipLeft', label: 'VIP үлдэгдэл', type: 'number', half: true },
  { key: 'description', label: 'Тайлбар', type: 'textarea' },
  { key: 'image', label: 'Зураг URL', type: 'url' },
  { key: 'active', label: 'Идэвхтэй', type: 'checkbox' },
]

export const podcastFields: FieldDef[] = [
  { key: 'title', label: 'Гарчиг', required: true },
  { key: 'description', label: 'Тайлбар', type: 'textarea' },
  { key: 'audioUrl', label: 'Audio URL', type: 'url', required: true },
  { key: 'cover', label: 'Cover URL', type: 'url' },
  { key: 'duration', label: 'Үргэлжлэх', half: true },
  { key: 'published', label: 'Нийтэлсэн', half: true },
  { key: 'guests', label: 'Зочин' },
  { key: 'membersOnly', label: 'Members only', type: 'checkbox' },
]

export const dropFields: FieldDef[] = [
  { key: 'title', label: 'Гарчиг', required: true },
  { key: 'date', label: 'Огноо (YYYY-MM-DD)', required: true },
  {
    key: 'kind',
    label: 'Төрөл',
    type: 'select',
    options: [
      { value: 'news', label: 'News' },
      { value: 'video', label: 'Video' },
      { value: 'podcast', label: 'Podcast' },
      { value: 'short', label: 'Short' },
    ],
  },
  { key: 'targetId', label: 'Target ID', required: true },
  { key: 'teaser', label: 'Teaser', type: 'textarea' },
  { key: 'image', label: 'Зураг URL', type: 'url' },
]

export const liveFields: FieldDef[] = [
  { key: 'title', label: 'Гарчиг', required: true },
  {
    key: 'status',
    label: 'Төлөв',
    type: 'select',
    options: [
      { value: 'live', label: 'Live' },
      { value: 'upcoming', label: 'Upcoming' },
      { value: 'ended', label: 'Ended' },
    ],
  },
  { key: 'youtubeId', label: 'YouTube ID' },
  { key: 'startsAt', label: 'Эхлэх (ISO)' },
  { key: 'viewers', label: 'Үзэгчид', type: 'number', half: true },
  { key: 'cover', label: 'Cover URL', type: 'url', half: true },
  { key: 'hostName', label: 'Host нэр' },
]

export const wallFields: FieldDef[] = [
  { key: 'authorName', label: 'Зохиогч', required: true },
  { key: 'text', label: 'Текст', type: 'textarea', required: true },
  { key: 'image', label: 'Зураг URL', type: 'url' },
]

export const sponsorFields: FieldDef[] = [
  { key: 'name', label: 'Нэр', required: true },
  { key: 'tagline', label: 'Tagline' },
  { key: 'url', label: 'URL', type: 'url' },
  { key: 'image', label: 'Зураг URL', type: 'url' },
  {
    key: 'slot',
    label: 'Slot',
    type: 'select',
    options: [
      { value: 'home', label: 'Home' },
      { value: 'videos', label: 'Videos' },
      { value: 'shop', label: 'Shop' },
    ],
  },
  { key: 'cpm', label: 'CPM', type: 'number', half: true },
  { key: 'active', label: 'Идэвхтэй', type: 'checkbox', half: true },
]

export const chartFields: FieldDef[] = [
  { key: 'rank', label: 'Rank', type: 'number', half: true, required: true },
  { key: 'title', label: 'Дуу', half: true, required: true },
  { key: 'artist', label: 'Артист', required: true },
  { key: 'plays', label: 'Plays', half: true },
  { key: 'change', label: 'Өөрчлөлт', type: 'number', half: true },
  { key: 'weekOf', label: 'Долоо хоног', half: true },
  { key: 'spotifyTrackId', label: 'Spotify track ID', half: true },
  { key: 'audioUrl', label: 'Audio URL', type: 'url' },
  { key: 'youtubeId', label: 'YouTube ID' },
  { key: 'cover', label: 'Cover URL', type: 'url' },
  { key: 'isNew', label: 'Шинэ', type: 'checkbox' },
]

export const battleFields: FieldDef[] = [
  { key: 'title', label: 'Гарчиг', required: true },
  { key: 'subtitle', label: 'Дэд гарчиг' },
  {
    key: 'status',
    label: 'Төлөв',
    type: 'select',
    options: [
      { value: 'open', label: 'Нээлттэй' },
      { value: 'closed', label: 'Хаалттай' },
    ],
  },
  { key: 'city', label: 'Хот', half: true },
  { key: 'endsAt', label: 'Дуусах (ISO)', half: true },
  { key: 'sideA', label: 'Тал 1 нэр', required: true, half: true },
  { key: 'sideB', label: 'Тал 2 нэр', required: true, half: true },
  { key: 'cover', label: 'Cover URL', type: 'url' },
]

export const IMG = {
  news: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80',
  rapper: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80',
  product: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
  show: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1400&q=80',
  podcast: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80',
  live: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=80',
  sponsor: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=900&q=80',
  battle: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?auto=format&fit=crop&w=1400&q=80',
  sideA: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
  sideB: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
  audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
}
