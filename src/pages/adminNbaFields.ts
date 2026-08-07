import type { FieldDef } from './adminUi'

export const nbaUpdateFields: FieldDef[] = [
  { key: 'title', label: 'Гарчиг', required: true },
  { key: 'tag', label: 'Tag (Trade, Injury...)', half: true, required: true },
  { key: 'when', label: 'Хэзээ', half: true, placeholder: '2 цагийн өмнө' },
  { key: 'readMin', label: 'Унших мин', type: 'number', half: true },
  { key: 'image', label: 'Зураг URL', type: 'url', half: true },
  { key: 'blurb', label: 'Товч', type: 'textarea', required: true },
  {
    key: 'body',
    label: 'Бүрэн текст (мөр бүр = 1 догол)',
    type: 'textarea',
    required: true,
  },
]

export const nbaHotFields: FieldDef[] = [
  { key: 'title', label: 'Гарчиг', required: true },
  { key: 'rank', label: 'Rank', type: 'number', half: true, required: true },
  { key: 'heat', label: 'Heat (HOT/MID)', half: true },
  { key: 'team', label: 'Баг / сэдэв', half: true },
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
  { key: 'name', label: 'Нэр', required: true },
  { key: 'rank', label: 'Rank', type: 'number', half: true, required: true },
  { key: 'position', label: 'Position', half: true },
  { key: 'lastTeam', label: 'Last team', half: true },
  { key: 'age', label: 'Нас', half: true },
  { key: 'fit', label: 'Best fit', half: true },
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

export function linesOf(value: unknown) {
  return String(value || '')
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean)
}
