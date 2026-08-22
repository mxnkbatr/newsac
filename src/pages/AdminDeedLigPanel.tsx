import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { AppData, DeedLigClub, DeedLigPlayer, NbaStory } from '../store/types'
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
  /** Editor горим — гарчиг/линк нуух, шууд удирдлага */
  compact?: boolean
  onExit?: () => void
}

type Sub = 'news' | 'clubs' | 'players'

const newsFields: FieldDef[] = nbaUpdateFields.map((f) =>
  f.key === 'tag'
    ? { ...f, label: 'Tag (Тоглолт, Клуб, Playoff...)', placeholder: 'Тоглолт' }
    : f,
)

const clubFields: FieldDef[] = [
  { key: 'name', label: 'Клубын нэр', required: true },
  { key: 'city', label: 'Хот', half: true, required: true },
  { key: 'founded', label: 'Байгуулагдсан', half: true, placeholder: '2019' },
  { key: 'arena', label: 'Тайз / Arena', placeholder: 'UG Arena' },
  { key: 'image', label: 'Лого / зураг', type: 'image' },
  { key: 'blurb', label: 'Товч тайлбар', type: 'textarea' },
]

const playerBaseFields: FieldDef[] = [
  { key: 'name', label: 'Тоглогчийн нэр', required: true },
  { key: 'number', label: 'Дугаар', half: true, placeholder: '7' },
  { key: 'position', label: 'Байрлал', half: true, placeholder: 'PG / SF / C' },
  { key: 'height', label: 'Өндөр', half: true, placeholder: '198 см' },
  { key: 'age', label: 'Нас', half: true, placeholder: '24' },
  { key: 'hometown', label: 'Төрсөн газар', placeholder: 'Улаанбаатар' },
  { key: 'image', label: 'Зураг', type: 'image' },
  { key: 'note', label: 'Тэмдэглэл', type: 'textarea', placeholder: 'Гол тоглогч...' },
]

export function AdminDeedLigPanel({
  search,
  setSearch,
  openEditor,
  askDelete,
  saveAndSync,
  compact = false,
  onExit,
}: Props) {
  const store = useStore()
  const [sub, setSub] = useState<Sub>('news')
  const news = store.data.deedLigNews || []
  const clubs = store.data.deedLigClubs || []
  const players = store.data.deedLigPlayers || []

  const playerFields: FieldDef[] = [
    {
      key: 'clubId',
      label: 'Клуб',
      type: 'select',
      required: true,
      options: clubs.length
        ? clubs.map((c) => ({ value: c.id, label: c.name }))
        : [{ value: '', label: 'Эхлээд клуб нэмнэ үү' }],
    },
    ...playerBaseFields,
  ]

  return (
    <div className={`admin-nba${compact ? ' is-compact' : ''}`}>
      {!compact ? (
        <div className="admin-panel-head">
          <div>
            <h2>Дээд Лиг</h2>
            <p>Мэдээ · клуб · тоглогч (өндөр, нас, байрлал) — /deed-lig дээр гарна</p>
          </div>
          <Link to="/deed-lig" className="btn btn-ghost">
            /deed-lig үзэх
          </Link>
        </div>
      ) : null}

      <div className="admin-seg" role="tablist" aria-label="Дээд Лиг хэсэг">
        {(
          [
            { id: 'news', label: 'Мэдээ' },
            { id: 'clubs', label: 'Клубууд' },
            { id: 'players', label: 'Тоглогчид' },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            className={sub === t.id ? 'active' : ''}
            aria-selected={sub === t.id}
            onClick={() => {
              setSub(t.id)
              setSearch('')
            }}
          >
            {t.label}
          </button>
        ))}
        {compact && onExit ? (
          <button type="button" className="admin-seg-exit" onClick={onExit}>
            Гарах
          </button>
        ) : null}
      </div>

      {sub === 'news' && (
        <EntityList
          title="Дээд Лиг мэдээ"
          description="Ерөнхий /news руу орохгүй"
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
            const n = news.find((x) => x.id === id)
            if (!n) return
            openEditor(
              'Дээд Лиг мэдээ засах',
              newsFields,
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
          title="Клубууд"
          description="Нэр, хот, arena — сайт дээр /deed-lig/clubs"
          search={search}
          onSearch={setSearch}
          items={clubs.map((c) => ({
            id: c.id,
            label: c.name,
            meta: `${c.city}${c.arena ? ` · ${c.arena}` : ''} · ${
              players.filter((p) => p.clubId === c.id).length
            } тоглогч`,
          }))}
          onCreate={() =>
            openEditor(
              'Шинэ клуб',
              clubFields,
              { name: '', city: '', founded: '', arena: '', image: '', blurb: '' },
              (v) => {
                const name = String(v.name).trim()
                if (!name) return false
                const item: DeedLigClub = {
                  id: crypto.randomUUID(),
                  name,
                  city: String(v.city).trim() || 'Улаанбаатар',
                  founded: String(v.founded).trim() || undefined,
                  arena: String(v.arena).trim() || undefined,
                  image: String(v.image).trim() || undefined,
                  blurb: String(v.blurb).trim() || undefined,
                }
                const snapshot = store.upsertDeedLigClub(item)
                void saveAndSync('Клуб нэмэгдлээ', snapshot)
              },
            )
          }
          onEdit={(id) => {
            const c = clubs.find((x) => x.id === id)
            if (!c) return
            openEditor(
              'Клуб засах',
              clubFields,
              {
                name: c.name,
                city: c.city,
                founded: c.founded || '',
                arena: c.arena || '',
                image: c.image || '',
                blurb: c.blurb || '',
              },
              (v) => {
                const snapshot = store.upsertDeedLigClub({
                  ...c,
                  name: String(v.name).trim() || c.name,
                  city: String(v.city).trim() || c.city,
                  founded: String(v.founded).trim() || undefined,
                  arena: String(v.arena).trim() || undefined,
                  image: String(v.image).trim() || undefined,
                  blurb: String(v.blurb).trim() || undefined,
                })
                void saveAndSync('Клуб хадгалагдлаа', snapshot)
              },
              c.name,
            )
          }}
          onDelete={(id) => {
            const c = clubs.find((x) => x.id === id)
            askDelete(`${c?.name || 'клуб'} (+ тоглогчид)`, async () => {
              const snapshot = store.deleteDeedLigClub(id)
              await saveAndSync('Клуб устгагдлаа', snapshot)
            })
          }}
        />
      )}

      {sub === 'players' && (
        <EntityList
          title="Тоглогчид"
          description="Өндөр, нас, байрлал, дугаар — клубын хуудсанд гарна"
          search={search}
          onSearch={setSearch}
          emptyText={clubs.length ? 'Тоглогч алга' : 'Эхлээд клуб нэмнэ үү'}
          items={players.map((p) => {
            const club = clubs.find((c) => c.id === p.clubId)
            return {
              id: p.id,
              label: p.name,
              meta: `#${p.number || '—'} · ${p.position || '—'} · ${p.height || '—'} · ${p.age || '—'} нас · ${club?.name || 'Клубгүй'}`,
            }
          })}
          onCreate={() => {
            if (!clubs.length) {
              setSub('clubs')
              return
            }
            openEditor(
              'Шинэ тоглогч',
              playerFields,
              {
                clubId: clubs[0].id,
                name: '',
                number: '',
                position: '',
                height: '',
                age: '',
                hometown: '',
                image: '',
                note: '',
              },
              (v) => {
                const name = String(v.name).trim()
                const clubId = String(v.clubId).trim()
                if (!name || !clubId) return false
                const item: DeedLigPlayer = {
                  id: crypto.randomUUID(),
                  clubId,
                  name,
                  number: String(v.number).trim(),
                  position: String(v.position).trim(),
                  height: String(v.height).trim(),
                  age: String(v.age).trim(),
                  hometown: String(v.hometown).trim() || undefined,
                  image: String(v.image).trim() || undefined,
                  note: String(v.note).trim() || undefined,
                }
                const snapshot = store.upsertDeedLigPlayer(item)
                void saveAndSync('Тоглогч нэмэгдлээ', snapshot)
              },
            )
          }}
          onEdit={(id) => {
            const p = players.find((x) => x.id === id)
            if (!p) return
            openEditor(
              'Тоглогч засах',
              playerFields,
              {
                clubId: p.clubId,
                name: p.name,
                number: p.number,
                position: p.position,
                height: p.height,
                age: p.age,
                hometown: p.hometown || '',
                image: p.image || '',
                note: p.note || '',
              },
              (v) => {
                const snapshot = store.upsertDeedLigPlayer({
                  ...p,
                  clubId: String(v.clubId).trim() || p.clubId,
                  name: String(v.name).trim() || p.name,
                  number: String(v.number).trim(),
                  position: String(v.position).trim(),
                  height: String(v.height).trim(),
                  age: String(v.age).trim(),
                  hometown: String(v.hometown).trim() || undefined,
                  image: String(v.image).trim() || undefined,
                  note: String(v.note).trim() || undefined,
                })
                void saveAndSync('Тоглогч хадгалагдлаа', snapshot)
              },
              p.name,
            )
          }}
          onDelete={(id) => {
            const p = players.find((x) => x.id === id)
            askDelete(p?.name || 'тоглогч', async () => {
              const snapshot = store.deleteDeedLigPlayer(id)
              await saveAndSync('Устгагдлаа', snapshot)
            })
          }}
        />
      )}
    </div>
  )
}
