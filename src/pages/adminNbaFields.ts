import type { FieldDef } from './adminUi'

export const nbaUpdateFields: FieldDef[] = [
  { key: 'title', label: 'Гарчиг', required: true },
  {
    key: 'image',
    label: 'Зураг',
    type: 'image',
    required: true,
    placeholder: 'Photos-оос сонгоно',
  },
  { key: 'tag', label: 'Tag (Trade, Injury...)', half: true, required: true },
  { key: 'when', label: 'Хэзээ', half: true, placeholder: '2 цагийн өмнө' },
  { key: 'readMin', label: 'Унших мин', type: 'number', half: true },
  { key: 'blurb', label: 'Товч', type: 'textarea', required: true },
  {
    key: 'body',
    label: 'Бүрэн текст (мөр бүр = 1 догол)',
    type: 'textarea',
    required: true,
  },
]

export const nbaFaFields: FieldDef[] = [
  {
    key: 'image',
    label: 'Зураг (3:4)',
    type: 'image',
    required: true,
    cropAspect: 3 / 4,
    previewAspect: '3 / 4',
    placeholder: 'Утаснаас сонгоод 3:4-өөр тайрна',
  },
  { key: 'name', label: 'Нэр', required: true },
  { key: 'rank', label: 'Rank', type: 'number', half: true, required: true },
  { key: 'position', label: 'Байрлал', half: true },
  { key: 'age', label: 'Нас', half: true },
  { key: 'height', label: 'Өндөр', half: true, placeholder: '206 см' },
  { key: 'weight', label: 'Жин', half: true, placeholder: '113 кг' },
  { key: 'lastTeam', label: 'Өмнөх баг', half: true },
  { key: 'newTeam', label: 'Шинэ баг', half: true },
  { key: 'fit', label: 'Best fit' },
  { key: 'note', label: 'Товч', type: 'textarea', required: true },
  {
    key: 'detail',
    label: 'Дэлгэрэнгүй (мөр бүр = 1 догол)',
    type: 'textarea',
    required: true,
  },
]

export const nbaQuizFields: FieldDef[] = [
  { key: 'q', label: 'Асуулт', type: 'textarea', required: true },
  {
    key: 'choices',
    label: 'Сонголтууд (мөр бүр = 1)',
    type: 'textarea',
    required: true,
  },
  {
    key: 'answer',
    label: 'Зөв хариулт (0-оос эхлэнэ)',
    type: 'number',
    half: true,
    required: true,
  },
  { key: 'explain', label: 'Тайлбар', type: 'textarea', half: true },
]

export const nbaSacfunFields: FieldDef[] = [
  { key: 'title', label: 'Гарчиг', required: true },
  { key: 'text', label: 'Текст', type: 'textarea', required: true },
]

export const nbaSacfunVideoFields: FieldDef[] = [
  { key: 'title', label: 'Гарчиг', required: true },
  { key: 'youtubeId', label: 'YouTube линк / ID', required: true, placeholder: 'https://youtu.be/...' },
]

export const nbaMambaFields: FieldDef[] = [
  { key: 'title', label: 'Гарчиг', required: true },
  { key: 'kicker', label: 'Kicker', required: true },
  { key: 'lead', label: 'Оршил', type: 'textarea', required: true },
  {
    key: 'story',
    label: 'Түүх (мөр бүр = 1 догол)',
    type: 'textarea',
    required: true,
  },
  {
    key: 'points',
    label: '4 зарчим (мөр бүр: Гарчиг :: тайлбар)',
    type: 'textarea',
    required: true,
  },
  { key: 'quote', label: 'Ишлэл', type: 'textarea', required: true },
  { key: 'takeaway', label: 'Takeaway', type: 'textarea', required: true },
]

export const nbaHubFields: FieldDef[] = [
  { key: 'kicker', label: 'Kicker', required: true, placeholder: 'Newsac · Basketball' },
  { key: 'title', label: 'Гарчиг', required: true, placeholder: 'NBA' },
  {
    key: 'subtitle',
    label: 'Тайлбар',
    type: 'textarea',
    required: true,
  },
  {
    key: 'heroImage',
    label: 'Арын зураг',
    type: 'image',
    required: true,
    placeholder: 'Photos-оос сонгоно',
  },
  {
    key: 'featuredId',
    label: 'Онцлох мэдээний ID (хоосон = эхний нийтлэл)',
    placeholder: 'nba-u-...',
  },
]

export function linesOf(value: unknown) {
  return String(value || '')
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean)
}
