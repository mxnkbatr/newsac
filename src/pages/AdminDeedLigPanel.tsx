import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { AppData, DeedLigClub, NbaStory } from '../store/types'
import { useStore } from '../store/StoreContext'
import { IMG } from './adminFields'
import { deedLigClubFields, linesOf, nbaUpdateFields } from './adminNbaFields'
import { EntityList, type FieldDef } from './adminUi'

type DeedSub = 'news' | 'clubs'

type OpenEditor = (
  title: string,
  fields: FieldDef[],
  values: Record<string, string | number | boolean>,
  onSave: (values: Record<string, string | number | boolean>) => boolean | void,
  subtitle?: string,
) => void

type Props = {
  search: string
  setSearch: (s: string) => void
  openEditor: OpenEditor
  askDelete: (label: string, onConfirm: () => void | Promise<void>) => void
  saveAndSync: (okText: string, snapshot?: AppData) => Promise<void>
}

const newsFields: FieldDef[] = nbaUpdateFields.map((f) =>
  f.key === 'tag'
    ? { ...f, label: 'Tag (Тоглолт, Клуб, Playoff...)', placeholder: 'Тоглолт' }
    : f,
)

const SUBS: { id: DeedSub; label: string }[] = [
  { id: 'news', label: 'Мэдээлэл' },
  { id: 'clubs', label: 'Клубууд' },
]

export function AdminDeedLigPanel({
  search,
  setSearch,
  openEditor,
  askDelete,
  saveAndSync,
}: Props) {
  const store = useStore()
  const [sub, setSub] = useState<DeedSub>('news')
  const news = store.data.deedLigNews || []
  const clubs = [...(store.data.deedLigClubs || [])].sort((a, b) => a.rank - b.rank)

  return (
    <div className="admin-nba">
      <div className="admin-panel-head">
        <div>
          <h2>Дээд Лиг удирдлага</h2>
          <p>Мэдээлэл, клубууд — нэмж засна · Cloud руу автомат</p>
        </div>
        <Link to="/deed-lig" className="btn btn-ghost">
          /deed-lig үзэх
        </Link>
      </div>

      <div className="admin-seg" role="tablist" aria-label="Дээд Лиг хэсэг">
        {SUBS.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={sub === s.id}
            className={sub === s.id ? 'active' : ''}
            onClick={() => setSub(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {sub === 'news' && (
        <EntityList
          title="Дээд Лиг мэдээ"
          description="/deed-lig · нэмж/засна · ерөнхий мэдээ рүү орохгүй"
          search={search}
          onSearch={setSearch}
          items={news.map((n) => ({
            id: n.id,
            label: n.title,
            meta: `${n.tag} · ${n.when} · ${n.readMin} мин`,
          }))}
          onCreate={() =>
            openEditor(
              'Шинэ Дээд Лиг мэдээ',
              newsFields,
              {
                title: '',
                tag: 'Лиг',
                when: 'саяхан',
                readMin: 3,
                image: '',
                midImage: '',
                blurb: '',
                body: '',
              },
              (v) => {
                const item: NbaStory = {
                  id: crypto.randomUUID(),
                  title: String(v.title).trim(),
                  tag: String(v.tag).trim() || 'Лиг',
                  when: String(v.when).trim() || 'саяхан',
                  readMin: Number(v.readMin) || 3,
                  image: String(v.image).trim() || IMG.news,
                  midImage: String(v.midImage || '').trim(),
                  blurb: String(v.blurb).trim(),
                  body: linesOf(v.body),
                }
                const snapshot = store.upsertDeedLigNews(item)
                void saveAndSync('Дээд Лиг мэдээ нэмэгдлээ', snapshot)
              },
            )
          }
          onEdit={(id) => {
            const n = news.find((x) => x.id === id)
            if (!n) return
            openEditor(
              'Дээд Лиг мэдээ засах',
              newsFields,
              { ...n, body: n.body.join('\n\n') },
              (v) => {
                const snapshot = store.upsertDeedLigNews({
                  ...n,
                  title: String(v.title).trim(),
                  tag: String(v.tag).trim() || n.tag,
                  when: String(v.when).trim(),
                  readMin: Number(v.readMin) || 3,
                  image: String(v.image).trim() || n.image,
                  midImage: String(v.midImage || '').trim(),
                  blurb: String(v.blurb).trim(),
                  body: linesOf(v.body),
                })
                void saveAndSync('Хадгалагдлаа', snapshot)
              },
              n.title,
            )
          }}
          onDelete={(id) => {
            const n = news.find((x) => x.id === id)
            askDelete(n?.title || 'нийтлэл', async () => {
              const snapshot = store.deleteDeedLigNews(id)
              await saveAndSync('Устгагдлаа', snapshot)
            })
          }}
        />
      )}

      {sub === 'clubs' && (
        <EntityList
          title="Дээд Лиг клубууд"
          description="/deed-lig/clubs · нэр, хот, лого"
          search={search}
          onSearch={setSearch}
          items={clubs.map((n) => ({
            id: n.id,
            label: n.name,
            meta: `#${n.rank} · ${n.city}`,
          }))}
          onCreate={() =>
            openEditor(
              'Шинэ клуб',
              deedLigClubFields,
              {
                name: '',
                city: 'Улаанбаатар',
                image: '',
                rank: clubs.length + 1,
              },
              (v) => {
                const item: DeedLigClub = {
                  id: crypto.randomUUID(),
                  name: String(v.name).trim(),
                  city: String(v.city).trim() || 'Улаанбаатар',
                  image: String(v.image || '').trim(),
                  rank: Number(v.rank) || clubs.length + 1,
                }
                const snapshot = store.upsertDeedLigClub(item)
                void saveAndSync('Клуб нэмэгдлээ', snapshot)
              },
            )
          }
          onEdit={(id) => {
            const n = clubs.find((x) => x.id === id)
            if (!n) return
            openEditor(
              'Клуб засах',
              deedLigClubFields,
              { ...n },
              (v) => {
                const snapshot = store.upsertDeedLigClub({
                  ...n,
                  name: String(v.name).trim(),
                  city: String(v.city).trim() || n.city,
                  image: String(v.image || '').trim(),
                  rank: Number(v.rank) || n.rank,
                })
                void saveAndSync('Хадгалагдлаа', snapshot)
              },
              n.name,
            )
          }}
          onDelete={(id) => {
            const n = clubs.find((x) => x.id === id)
            askDelete(n?.name || 'клуб', async () => {
              const snapshot = store.deleteDeedLigClub(id)
              await saveAndSync('Устгагдлаа', snapshot)
            })
          }}
        />
      )}
    </div>
  )
}
