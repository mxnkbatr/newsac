import { Link } from 'react-router-dom'
import { useStore } from '../store/StoreContext'
import type { NbaFreeAgent, NbaHot, NbaQuizQ, NbaSacfunBit, NbaStory } from '../store/types'
import { IMG } from './adminFields'
import {
  linesOf,
  nbaFaFields,
  nbaHotFields,
  nbaQuizFields,
  nbaSacfunFields,
  nbaUpdateFields,
} from './adminNbaFields'
import { EntityList, type FieldDef } from './adminUi'

export type NbaSub =
  | 'hub'
  | 'updates'
  | 'hot'
  | 'fa'
  | 'quiz'
  | 'sacfun'
  | 'reels'

type OpenEditor = (
  title: string,
  fields: FieldDef[],
  values: Record<string, string | number | boolean>,
  onSave: (values: Record<string, string | number | boolean>) => void,
  subtitle?: string,
) => void

type Props = {
  sub: NbaSub
  setSub: (s: NbaSub) => void
  setTab: (tab: 'reels' | 'sponsors') => void
  search: string
  setSearch: (s: string) => void
  openEditor: OpenEditor
  askDelete: (label: string, onConfirm: () => void) => void
  notify: (msg: string) => void
}

const SUBS: { id: NbaSub; label: string }[] = [
  { id: 'hub', label: 'Төв' },
  { id: 'updates', label: 'Мэдээлэл' },
  { id: 'hot', label: 'Hot' },
  { id: 'fa', label: 'Free Agency' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'sacfun', label: 'Sacfun' },
  { id: 'reels', label: 'Reels' },
]

export function AdminNbaPanel({
  sub,
  setSub,
  setTab,
  search,
  setSearch,
  openEditor,
  askDelete,
  notify,
}: Props) {
  const store = useStore()
  const d = store.data

  return (
    <div className="admin-nba">
      <div className="admin-panel-head">
        <div>
          <h2>NBA удирдлага</h2>
          <p>Хэсэг тус бүрээр тусдаа · гар утсаар хялбар засна</p>
        </div>
        <Link to="/nba" className="btn btn-ghost">
          /nba үзэх
        </Link>
      </div>

      <div className="admin-seg" role="tablist" aria-label="NBA хэсэг">
        {SUBS.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={sub === s.id}
            className={sub === s.id ? 'active' : ''}
            onClick={() => {
              if (s.id === 'reels') {
                setTab('reels')
                return
              }
              setSub(s.id)
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {sub === 'hub' && (
        <div className="admin-nba-hub">
          <button type="button" className="admin-nba-card" onClick={() => setSub('updates')}>
            <strong>Сүүлийн мэдээлэл</strong>
            <span>{d.nbaUpdates.length} нийтлэл</span>
            <em>Удирдах →</em>
          </button>
          <button type="button" className="admin-nba-card" onClick={() => setSub('hot')}>
            <strong>Hot news</strong>
            <span>{d.nbaHotNews.length} сэдэв</span>
            <em>Удирдах →</em>
          </button>
          <button type="button" className="admin-nba-card" onClick={() => setSub('fa')}>
            <strong>Free Agency</strong>
            <span>{d.nbaFreeAgents.length} нэр</span>
            <em>Удирдах →</em>
          </button>
          <button type="button" className="admin-nba-card" onClick={() => setSub('quiz')}>
            <strong>Quiz</strong>
            <span>{d.nbaQuiz.length} асуулт</span>
            <em>Удирдах →</em>
          </button>
          <button type="button" className="admin-nba-card" onClick={() => setSub('sacfun')}>
            <strong>Sacfun</strong>
            <span>{d.nbaSacfun.length} бит</span>
            <em>Удирдах →</em>
          </button>
          <button type="button" className="admin-nba-card" onClick={() => setTab('reels')}>
            <strong>Reels</strong>
            <span>{d.shorts.length} бичлэг · YouTube</span>
            <em>Удирдах →</em>
          </button>
          <button type="button" className="admin-nba-card" onClick={() => setTab('sponsors')}>
            <strong>NBA реклам</strong>
            <span>Sponsor slot · nba</span>
            <em>Удирдах →</em>
          </button>
        </div>
      )}

      {sub === 'updates' && (
        <EntityList
          title="NBA мэдээлэл"
          description="/nba/updates · гар утсаар нэмж/засна"
          search={search}
          onSearch={setSearch}
          items={d.nbaUpdates.map((n) => ({
            id: n.id,
            label: n.title,
            meta: `${n.tag} · ${n.when} · ${n.readMin} мин`,
          }))}
          onCreate={() =>
            openEditor(
              'Шинэ NBA мэдээлэл',
              nbaUpdateFields,
              {
                title: '',
                tag: 'News',
                when: 'саяхан',
                readMin: 3,
                image: IMG.news,
                blurb: '',
                body: '',
              },
              (v) => {
                const item: NbaStory = {
                  id: crypto.randomUUID(),
                  title: String(v.title).trim(),
                  tag: String(v.tag).trim(),
                  when: String(v.when).trim(),
                  readMin: Number(v.readMin) || 3,
                  image: String(v.image).trim() || IMG.news,
                  blurb: String(v.blurb).trim(),
                  body: linesOf(v.body),
                }
                store.upsertNbaUpdate(item)
                notify('NBA мэдээлэл нэмэгдлээ')
              },
            )
          }
          onEdit={(id) => {
            const n = d.nbaUpdates.find((x) => x.id === id)
            if (!n) return
            openEditor(
              'NBA мэдээлэл засах',
              nbaUpdateFields,
              { ...n, body: n.body.join('\n') },
              (v) => {
                store.upsertNbaUpdate({
                  ...n,
                  title: String(v.title).trim(),
                  tag: String(v.tag).trim(),
                  when: String(v.when).trim(),
                  readMin: Number(v.readMin) || 3,
                  image: String(v.image).trim() || n.image,
                  blurb: String(v.blurb).trim(),
                  body: linesOf(v.body),
                })
                notify('Хадгалагдлаа')
              },
              n.title,
            )
          }}
          onDelete={(id) => {
            const n = d.nbaUpdates.find((x) => x.id === id)
            askDelete(n?.title || 'нийтлэл', () => {
              store.deleteNbaUpdate(id)
              notify('Устгагдлаа')
            })
          }}
        />
      )}

      {sub === 'hot' && (
        <EntityList
          title="Hot news"
          description="/nba/hot"
          search={search}
          onSearch={setSearch}
          items={[...d.nbaHotNews]
            .sort((a, b) => a.rank - b.rank)
            .map((n) => ({
              id: n.id,
              label: n.title,
              meta: `#${n.rank} · ${n.heat} · ${n.team}`,
            }))}
          onCreate={() =>
            openEditor(
              'Шинэ Hot',
              nbaHotFields,
              {
                title: '',
                rank: d.nbaHotNews.length + 1,
                heat: 'HOT',
                team: 'NBA',
                readMin: 2,
                blurb: '',
                body: '',
              },
              (v) => {
                const item: NbaHot = {
                  id: crypto.randomUUID(),
                  title: String(v.title).trim(),
                  rank: Number(v.rank) || 1,
                  heat: String(v.heat).trim() || 'HOT',
                  team: String(v.team).trim(),
                  readMin: Number(v.readMin) || 2,
                  blurb: String(v.blurb).trim(),
                  body: linesOf(v.body),
                }
                store.upsertNbaHot(item)
                notify('Hot нэмэгдлээ')
              },
            )
          }
          onEdit={(id) => {
            const n = d.nbaHotNews.find((x) => x.id === id)
            if (!n) return
            openEditor(
              'Hot засах',
              nbaHotFields,
              { ...n, body: n.body.join('\n') },
              (v) => {
                store.upsertNbaHot({
                  ...n,
                  title: String(v.title).trim(),
                  rank: Number(v.rank) || n.rank,
                  heat: String(v.heat).trim(),
                  team: String(v.team).trim(),
                  readMin: Number(v.readMin) || 2,
                  blurb: String(v.blurb).trim(),
                  body: linesOf(v.body),
                })
                notify('Хадгалагдлаа')
              },
              n.title,
            )
          }}
          onDelete={(id) => {
            const n = d.nbaHotNews.find((x) => x.id === id)
            askDelete(n?.title || 'hot', () => {
              store.deleteNbaHot(id)
              notify('Устгагдлаа')
            })
          }}
        />
      )}

      {sub === 'fa' && (
        <EntityList
          title="Free Agency"
          description="/nba/free-agency"
          search={search}
          onSearch={setSearch}
          items={[...d.nbaFreeAgents]
            .sort((a, b) => a.rank - b.rank)
            .map((n) => ({
              id: n.id,
              label: n.name,
              meta: `#${n.rank} · ${n.position} · ${n.lastTeam}`,
            }))}
          onCreate={() =>
            openEditor(
              'Шинэ Free Agent',
              nbaFaFields,
              {
                name: '',
                rank: d.nbaFreeAgents.length + 1,
                position: 'G',
                lastTeam: '',
                age: '',
                fit: '',
                note: '',
                detail: '',
              },
              (v) => {
                const item: NbaFreeAgent = {
                  id: crypto.randomUUID(),
                  name: String(v.name).trim(),
                  rank: Number(v.rank) || 1,
                  position: String(v.position).trim(),
                  lastTeam: String(v.lastTeam).trim(),
                  age: String(v.age).trim(),
                  fit: String(v.fit).trim(),
                  note: String(v.note).trim(),
                  detail: linesOf(v.detail),
                }
                store.upsertNbaFreeAgent(item)
                notify('FA нэмэгдлээ')
              },
            )
          }
          onEdit={(id) => {
            const n = d.nbaFreeAgents.find((x) => x.id === id)
            if (!n) return
            openEditor(
              'FA засах',
              nbaFaFields,
              { ...n, detail: n.detail.join('\n') },
              (v) => {
                store.upsertNbaFreeAgent({
                  ...n,
                  name: String(v.name).trim(),
                  rank: Number(v.rank) || n.rank,
                  position: String(v.position).trim(),
                  lastTeam: String(v.lastTeam).trim(),
                  age: String(v.age).trim(),
                  fit: String(v.fit).trim(),
                  note: String(v.note).trim(),
                  detail: linesOf(v.detail),
                })
                notify('Хадгалагдлаа')
              },
              n.name,
            )
          }}
          onDelete={(id) => {
            const n = d.nbaFreeAgents.find((x) => x.id === id)
            askDelete(n?.name || 'FA', () => {
              store.deleteNbaFreeAgent(id)
              notify('Устгагдлаа')
            })
          }}
        />
      )}

      {sub === 'quiz' && (
        <EntityList
          title="NBA Quiz"
          description="/nba/quiz"
          search={search}
          onSearch={setSearch}
          items={d.nbaQuiz.map((n) => ({
            id: n.id,
            label: n.q,
            meta: `${n.choices.length} сонголт · зөв #${n.answer}`,
          }))}
          onCreate={() =>
            openEditor(
              'Шинэ асуулт',
              nbaQuizFields,
              { q: '', choices: '', answer: 0, explain: '' },
              (v) => {
                const choices = linesOf(v.choices)
                const item: NbaQuizQ = {
                  id: crypto.randomUUID(),
                  q: String(v.q).trim(),
                  choices,
                  answer: Math.max(0, Math.min(choices.length - 1, Number(v.answer) || 0)),
                  explain: String(v.explain).trim(),
                }
                store.upsertNbaQuiz(item)
                notify('Асуулт нэмэгдлээ')
              },
            )
          }
          onEdit={(id) => {
            const n = d.nbaQuiz.find((x) => x.id === id)
            if (!n) return
            openEditor(
              'Асуулт засах',
              nbaQuizFields,
              { ...n, choices: n.choices.join('\n') },
              (v) => {
                const choices = linesOf(v.choices)
                store.upsertNbaQuiz({
                  ...n,
                  q: String(v.q).trim(),
                  choices,
                  answer: Math.max(0, Math.min(choices.length - 1, Number(v.answer) || 0)),
                  explain: String(v.explain).trim(),
                })
                notify('Хадгалагдлаа')
              },
              n.q.slice(0, 40),
            )
          }}
          onDelete={(id) => {
            const n = d.nbaQuiz.find((x) => x.id === id)
            askDelete(n?.q.slice(0, 32) || 'асуулт', () => {
              store.deleteNbaQuiz(id)
              notify('Устгагдлаа')
            })
          }}
        />
      )}

      {sub === 'sacfun' && (
        <EntityList
          title="Sacfun"
          description="/nba/sacfun"
          search={search}
          onSearch={setSearch}
          items={d.nbaSacfun.map((n) => ({
            id: n.id,
            label: n.title,
            meta: n.text.slice(0, 48),
          }))}
          onCreate={() =>
            openEditor(
              'Шинэ Sacfun',
              nbaSacfunFields,
              { title: '', text: '' },
              (v) => {
                const item: NbaSacfunBit = {
                  id: crypto.randomUUID(),
                  title: String(v.title).trim(),
                  text: String(v.text).trim(),
                }
                store.upsertNbaSacfun(item)
                notify('Sacfun нэмэгдлээ')
              },
            )
          }
          onEdit={(id) => {
            const n = d.nbaSacfun.find((x) => x.id === id)
            if (!n) return
            openEditor(
              'Sacfun засах',
              nbaSacfunFields,
              { ...n },
              (v) => {
                store.upsertNbaSacfun({
                  ...n,
                  title: String(v.title).trim(),
                  text: String(v.text).trim(),
                })
                notify('Хадгалагдлаа')
              },
              n.title,
            )
          }}
          onDelete={(id) => {
            const n = d.nbaSacfun.find((x) => x.id === id)
            askDelete(n?.title || 'sacfun', () => {
              store.deleteNbaSacfun(id)
              notify('Устгагдлаа')
            })
          }}
        />
      )}
    </div>
  )
}
