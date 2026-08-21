import { Link } from 'react-router-dom'
import type { AppData } from '../store/types'
import { parseYouTubeId } from '../lib/youtube'
import { SACFUN_YOUTUBE_HANDLE, SACFUN_YOUTUBE_URL } from '../data/brand'
import { useStore } from '../store/StoreContext'
import type {
  NbaFreeAgent,
  NbaMamba,
  NbaQuizQ,
  NbaSacfunBit,
  NbaSacfunVideo,
  NbaStory,
} from '../store/types'
import { IMG } from './adminFields'
import {
  linesOf,
  nbaFaFields,
  nbaHubFields,
  nbaMambaFields,
  nbaQuizFields,
  nbaSacfunFields,
  nbaSacfunVideoFields,
  nbaUpdateFields,
} from './adminNbaFields'
import { EntityList, type FieldDef } from './adminUi'

export type NbaSub = 'hub' | 'updates' | 'fa' | 'quiz' | 'sacfun' | 'mamba'

type OpenEditor = (
  title: string,
  fields: FieldDef[],
  values: Record<string, string | number | boolean>,
  onSave: (values: Record<string, string | number | boolean>) => boolean | void,
  subtitle?: string,
) => void

type Props = {
  sub: NbaSub
  setSub: (s: NbaSub) => void
  search: string
  setSearch: (s: string) => void
  openEditor: OpenEditor
  askDelete: (label: string, onConfirm: () => void | Promise<void>) => void
  notify: (msg: string, error?: boolean) => void
  saveAndSync: (okText: string, snapshot?: AppData) => Promise<void>
}

const SUBS: { id: NbaSub; label: string }[] = [
  { id: 'hub', label: 'Төв' },
  { id: 'updates', label: 'Мэдээлэл' },
  { id: 'fa', label: 'Free Agency' },
  { id: 'mamba', label: 'Mamba' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'sacfun', label: 'Sacfun' },
]

function pointsToText(points: NbaMamba['points']) {
  return points.map((p) => `${p.h} :: ${p.p}`).join('\n')
}

function textToPoints(raw: unknown): NbaMamba['points'] {
  return String(raw || '')
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [h, ...rest] = line.split('::')
      return { h: (h || '').trim(), p: rest.join('::').trim() }
    })
    .filter((p) => p.h && p.p)
}

export function AdminNbaPanel({
  sub,
  setSub,
  search,
  setSearch,
  openEditor,
  askDelete,
  notify,
  saveAndSync,
}: Props) {
  const store = useStore()
  const d = store.data

  return (
    <div className="admin-nba">
      <div className="admin-panel-head">
        <div>
          <h2>NBA удирдлага</h2>
          <p>Хэсэг тус бүрээр тусдаа · хадгалвал Cloud руу автомат илгээнэ</p>
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
            onClick={() => setSub(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {sub === 'hub' && (
        <div className="admin-nba-hub">
          <button
            type="button"
            className="admin-nba-card"
            onClick={() => {
              const h = d.nbaHub
              openEditor(
                'NBA нүүр засах',
                nbaHubFields,
                {
                  kicker: h?.kicker || 'Newsac · Basketball',
                  title: h?.title || 'NBA',
                  subtitle: h?.subtitle || '',
                  heroImage: h?.heroImage || '',
                  featuredId: h?.featuredId || '',
                },
                (v) => {
                  const snapshot = store.setNbaHub({
                    kicker: String(v.kicker).trim() || 'Newsac · Basketball',
                    title: String(v.title).trim() || 'NBA',
                    subtitle: String(v.subtitle).trim(),
                    heroImage: String(v.heroImage).trim() || IMG.news,
                    featuredId: String(v.featuredId || '').trim(),
                  })
                  void saveAndSync('NBA нүүр хадгалагдлаа', snapshot)
                },
                'Арын зураг + гарчиг',
              )
            }}
          >
            <strong>Нүүр · арын зураг</strong>
            <span>{d.nbaHub?.title || 'NBA'}</span>
            <em>Засах →</em>
          </button>
          <button type="button" className="admin-nba-card" onClick={() => setSub('updates')}>
            <strong>Сүүлийн мэдээлэл</strong>
            <span>{d.nbaUpdates.length} нийтлэл</span>
            <em>Удирдах →</em>
          </button>
          <button type="button" className="admin-nba-card" onClick={() => setSub('fa')}>
            <strong>Free Agency</strong>
            <span>{d.nbaFreeAgents.length} нэр</span>
            <em>Удирдах →</em>
          </button>
          <button type="button" className="admin-nba-card" onClick={() => setSub('mamba')}>
            <strong>Mamba Mentality</strong>
            <span>нийтлэл засах</span>
            <em>Удирдах →</em>
          </button>
          <button type="button" className="admin-nba-card" onClick={() => setSub('quiz')}>
            <strong>Quiz</strong>
            <span>{d.nbaQuiz.length} асуулт</span>
            <em>Удирдах →</em>
          </button>
          <button type="button" className="admin-nba-card" onClick={() => setSub('sacfun')}>
            <strong>Sacfun</strong>
            <span>
              {d.nbaSacfun.length} бит · {(d.nbaSacfunVideos || []).length} бичлэг
            </span>
            <em>Удирдах →</em>
          </button>
        </div>
      )}

      {sub === 'updates' && (
        <EntityList
          title="NBA мэдээлэл"
          description="/nba/updates · нэмж/засна · Cloud руу автомат"
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
                image: '',
                midImage: '',
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
                  midImage: String(v.midImage || '').trim(),
                  blurb: String(v.blurb).trim(),
                  body: linesOf(v.body),
                }
                const snapshot = store.upsertNbaUpdate(item)
                void saveAndSync('NBA мэдээлэл нэмэгдлээ', snapshot)
              },
            )
          }
          onEdit={(id) => {
            const n = d.nbaUpdates.find((x) => x.id === id)
            if (!n) return
            openEditor(
              'NBA мэдээлэл засах',
              nbaUpdateFields,
              { ...n, body: n.body.join('\n\n') },
              (v) => {
                const snapshot = store.upsertNbaUpdate({
                  ...n,
                  title: String(v.title).trim(),
                  tag: String(v.tag).trim(),
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
            const n = d.nbaUpdates.find((x) => x.id === id)
            askDelete(n?.title || 'нийтлэл', async () => {
              const snapshot = store.deleteNbaUpdate(id)
              await saveAndSync('Устгагдлаа', snapshot)
            })
          }}
        />
      )}

      {sub === 'fa' && (
        <EntityList
          title="Free Agency"
          description="/nba/free-agency · 3:4 хөрөг, нэр, нас, өндөр, байрлал"
          search={search}
          onSearch={setSearch}
          items={[...d.nbaFreeAgents]
            .sort((a, b) => a.rank - b.rank)
            .map((n) => ({
              id: n.id,
              label: n.name,
              meta: `#${n.rank} · ${n.position} · ${n.lastTeam}${n.newTeam ? ` → ${n.newTeam}` : ''}`,
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
                newTeam: '',
                age: '',
                height: '',
                image: '',
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
                  newTeam: String(v.newTeam).trim() || String(v.lastTeam).trim(),
                  age: String(v.age).trim(),
                  height: String(v.height).trim(),
                  image: String(v.image).trim(),
                  fit: String(v.fit).trim(),
                  note: String(v.note).trim(),
                  detail: linesOf(v.detail),
                }
                const snapshot = store.upsertNbaFreeAgent(item)
                void saveAndSync('FA нэмэгдлээ', snapshot)
              },
            )
          }
          onEdit={(id) => {
            const n = d.nbaFreeAgents.find((x) => x.id === id)
            if (!n) return
            openEditor(
              'FA засах',
              nbaFaFields,
              { ...n, newTeam: n.newTeam || n.lastTeam, detail: n.detail.join('\n') },
              (v) => {
                const snapshot = store.upsertNbaFreeAgent({
                  ...n,
                  name: String(v.name).trim(),
                  rank: Number(v.rank) || n.rank,
                  position: String(v.position).trim(),
                  lastTeam: String(v.lastTeam).trim(),
                  newTeam: String(v.newTeam).trim() || String(v.lastTeam).trim(),
                  age: String(v.age).trim(),
                  height: String(v.height).trim(),
                  image: String(v.image).trim(),
                  fit: String(v.fit).trim(),
                  note: String(v.note).trim(),
                  detail: linesOf(v.detail),
                })
                void saveAndSync('Хадгалагдлаа', snapshot)
              },
              n.name,
            )
          }}
          onDelete={(id) => {
            const n = d.nbaFreeAgents.find((x) => x.id === id)
            askDelete(n?.name || 'FA', async () => {
              const snapshot = store.deleteNbaFreeAgent(id)
              await saveAndSync('Устгагдлаа', snapshot)
            })
          }}
        />
      )}

      {sub === 'mamba' && (
        <div className="admin-nba-mamba">
          <div className="admin-panel-head">
            <div>
              <h3>Mamba Mentality</h3>
              <p>/nba/mamba · нэг нийтлэл · засаад хадгална</p>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                const m = d.nbaMamba
                openEditor(
                  'Mamba засах',
                  nbaMambaFields,
                  {
                    title: m.title,
                    kicker: m.kicker,
                    lead: m.lead,
                    story: m.story.join('\n'),
                    points: pointsToText(m.points),
                    quote: m.quote,
                    takeaway: m.takeaway,
                  },
                  (v) => {
                    const points = textToPoints(v.points)
                    if (points.length < 1) {
                      notify('Дор хаяж 1 зарчим оруулна уу (Гарчиг :: тайлбар)', true)
                      return false
                    }
                    const snapshot = store.setNbaMamba({
                      title: String(v.title).trim(),
                      kicker: String(v.kicker).trim(),
                      lead: String(v.lead).trim(),
                      story: linesOf(v.story),
                      points,
                      quote: String(v.quote).trim(),
                      takeaway: String(v.takeaway).trim(),
                    })
                    void saveAndSync('Mamba хадгалагдлаа', snapshot)
                  },
                  m.title,
                )
              }}
            >
              Засах
            </button>
          </div>
          <article className="nba-sacfun-card">
            <h3>{d.nbaMamba.title}</h3>
            <p>{d.nbaMamba.lead}</p>
          </article>
        </div>
      )}

      {sub === 'quiz' && (
        <EntityList
          title="NBA Quiz"
          description="/nba/quiz · асуулт засна · зөв хариулт 0-оос эхэлнэ"
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
                const snapshot = store.upsertNbaQuiz(item)
                void saveAndSync('Асуулт нэмэгдлээ', snapshot)
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
                const snapshot = store.upsertNbaQuiz({
                  ...n,
                  q: String(v.q).trim(),
                  choices,
                  answer: Math.max(0, Math.min(choices.length - 1, Number(v.answer) || 0)),
                  explain: String(v.explain).trim(),
                })
                void saveAndSync('Хадгалагдлаа', snapshot)
              },
              n.q.slice(0, 40),
            )
          }}
          onDelete={(id) => {
            const n = d.nbaQuiz.find((x) => x.id === id)
            askDelete(n?.q.slice(0, 32) || 'асуулт', async () => {
              const snapshot = store.deleteNbaQuiz(id)
              await saveAndSync('Устгагдлаа', snapshot)
            })
          }}
        />
      )}

      {sub === 'sacfun' && (
        <>
          <div className="admin-panel-head">
            <div>
              <h3>Sacfun YouTube</h3>
              <p>
                {SACFUN_YOUTUBE_HANDLE} ·{' '}
                <a href={SACFUN_YOUTUBE_URL} target="_blank" rel="noreferrer">
                  суваг нээх
                </a>
              </p>
            </div>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={async () => {
                try {
                  const n = await store.syncSacfunYoutube()
                  await saveAndSync(
                    n > 0 ? `${n} бичлэг нэмэгдлээ` : 'Шинэ бичлэг байхгүй · жагсаалт шинэчлэгдлээ',
                  )
                } catch (err) {
                  notify(err instanceof Error ? err.message : 'Sacfun YouTube татаж чадсангүй', true)
                }
              }}
            >
              YouTube-ээс татах
            </button>
          </div>
          <EntityList
            title="Sacfun бичлэг"
            description="/nba/sacfun дээр тоглоно"
            search={search}
            onSearch={setSearch}
            items={(d.nbaSacfunVideos || []).map((n) => ({
              id: n.id,
              label: n.title,
              meta: n.youtubeId,
            }))}
            onCreate={() =>
              openEditor(
                'Sacfun бичлэг нэмэх',
                nbaSacfunVideoFields,
                { title: '', youtubeId: '' },
                (v) => {
                  const youtubeId = parseYouTubeId(String(v.youtubeId || ''))
                  if (!youtubeId) {
                    notify('Зөв YouTube линк эсвэл ID оруулна уу', true)
                    return false
                  }
                  const item: NbaSacfunVideo = {
                    id: crypto.randomUUID(),
                    youtubeId,
                    title: String(v.title).trim(),
                  }
                  const snapshot = store.upsertNbaSacfunVideo(item)
                  void saveAndSync('Бичлэг нэмэгдлээ', snapshot)
                },
              )
            }
            onEdit={(id) => {
              const n = (d.nbaSacfunVideos || []).find((x) => x.id === id)
              if (!n) return
              openEditor(
                'Бичлэг засах',
                nbaSacfunVideoFields,
                { title: n.title, youtubeId: n.youtubeId },
                (v) => {
                  const youtubeId = parseYouTubeId(String(v.youtubeId || '')) || n.youtubeId
                  const snapshot = store.upsertNbaSacfunVideo({
                    ...n,
                    title: String(v.title).trim(),
                    youtubeId,
                  })
                  void saveAndSync('Хадгалагдлаа', snapshot)
                },
                n.title,
              )
            }}
            onDelete={(id) => {
              const n = (d.nbaSacfunVideos || []).find((x) => x.id === id)
              askDelete(n?.title || 'бичлэг', async () => {
                const snapshot = store.deleteNbaSacfunVideo(id)
                await saveAndSync('Устгагдлаа', snapshot)
              })
            }}
          />
          <EntityList
            title="Sacfun карт"
            description="Fun mode текст"
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
                  const snapshot = store.upsertNbaSacfun(item)
                  void saveAndSync('Sacfun нэмэгдлээ', snapshot)
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
                  const snapshot = store.upsertNbaSacfun({
                    ...n,
                    title: String(v.title).trim(),
                    text: String(v.text).trim(),
                  })
                  void saveAndSync('Хадгалагдлаа', snapshot)
                },
                n.title,
              )
            }}
            onDelete={(id) => {
              const n = d.nbaSacfun.find((x) => x.id === id)
              askDelete(n?.title || 'sacfun', async () => {
                const snapshot = store.deleteNbaSacfun(id)
                await saveAndSync('Устгагдлаа', snapshot)
              })
            }}
          />
        </>
      )}
    </div>
  )
}
