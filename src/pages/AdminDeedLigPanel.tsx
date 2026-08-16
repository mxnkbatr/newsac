import { Link } from 'react-router-dom'
import type { AppData, NbaStory } from '../store/types'
import { useStore } from '../store/StoreContext'
import { IMG } from './adminFields'
import { linesOf, nbaUpdateFields } from './adminNbaFields'
import { EntityList, type FieldDef } from './adminUi'

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

const fields: FieldDef[] = nbaUpdateFields.map((f) =>
  f.key === 'tag'
    ? { ...f, label: 'Tag (Тоглолт, Клуб, Playoff...)', placeholder: 'Тоглолт' }
    : f,
)

export function AdminDeedLigPanel({
  search,
  setSearch,
  openEditor,
  askDelete,
  saveAndSync,
}: Props) {
  const store = useStore()
  const items = store.data.deedLigNews || []

  return (
    <div className="admin-nba">
      <div className="admin-panel-head">
        <div>
          <h2>Дээд Лиг мэдээлэл</h2>
          <p>Ерөнхий Мэдээ цэсээс тусдаа · зөвхөн /deed-lig дээр гарна</p>
        </div>
        <Link to="/deed-lig" className="btn btn-ghost">
          /deed-lig үзэх
        </Link>
      </div>

      <EntityList
        title="Дээд Лиг мэдээ"
        description="Admin-аас нэмсэн нийтлэл ерөнхий /news руу орохгүй"
        search={search}
        onSearch={setSearch}
        items={items.map((n) => ({
          id: n.id,
          label: n.title,
          meta: `${n.tag} · ${n.when} · ${n.readMin} мин`,
        }))}
        onCreate={() =>
          openEditor(
            'Шинэ Дээд Лиг мэдээ',
            fields,
            {
              title: '',
              tag: 'Лиг',
              when: 'саяхан',
              readMin: 3,
              image: '',
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
                blurb: String(v.blurb).trim(),
                body: linesOf(v.body),
              }
              const snapshot = store.upsertDeedLigNews(item)
              void saveAndSync('Дээд Лиг мэдээ нэмэгдлээ', snapshot)
            },
          )
        }
        onEdit={(id) => {
          const n = items.find((x) => x.id === id)
          if (!n) return
          openEditor(
            'Дээд Лиг мэдээ засах',
            fields,
            { ...n, body: n.body.join('\n') },
            (v) => {
              const snapshot = store.upsertDeedLigNews({
                ...n,
                title: String(v.title).trim(),
                tag: String(v.tag).trim() || n.tag,
                when: String(v.when).trim(),
                readMin: Number(v.readMin) || 3,
                image: String(v.image).trim() || n.image,
                blurb: String(v.blurb).trim(),
                body: linesOf(v.body),
              })
              void saveAndSync('Хадгалагдлаа', snapshot)
            },
            n.title,
          )
        }}
        onDelete={(id) => {
          const n = items.find((x) => x.id === id)
          askDelete(n?.title || 'нийтлэл', async () => {
            const snapshot = store.deleteDeedLigNews(id)
            await saveAndSync('Устгагдлаа', snapshot)
          })
        }}
      />
    </div>
  )
}
