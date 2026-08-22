import { useMemo, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useStore } from '../store/StoreContext'
import { useAuth } from '../context/AuthContext'
import { MelbetBanner } from '../components/MelbetBanner'
import { ShareButton } from '../components/ShareButton'
import type { NewsRegion } from '../store/types'
import { newsRegionLabel, resolveNewsRegion } from '../lib/newsRegion'
import './Pages.css'

export function NewsPage() {
  const { data, track } = useStore()
  const { isMember } = useAuth()
  const [tab, setTab] = useState<NewsRegion>('domestic')

  const filtered = useMemo(
    () => data.news.filter((item) => resolveNewsRegion(item) === tab),
    [data.news, tab],
  )

  const domesticCount = data.news.filter((n) => resolveNewsRegion(n) === 'domestic').length
  const foreignCount = data.news.filter((n) => resolveNewsRegion(n) === 'foreign').length
  const kpopCount = data.news.filter((n) => resolveNewsRegion(n) === 'kpop').length
  const yellowCount = data.news.filter((n) => resolveNewsRegion(n) === 'yellow').length

  return (
    <div>
      <header className="page-hero">
        <div className="container">
          <div className="section-kicker">Мэдээ · Мэдээлэл</div>
          <h1>Мэдээ</h1>
          <p>Дотоод, гадаад, K-pop болон шар мэдээ — нэг дороос.</p>
          <div className="news-region-tabs" role="tablist" aria-label="Мэдээний төрөл">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'domestic'}
              className={tab === 'domestic' ? 'active' : ''}
              onClick={() => setTab('domestic')}
            >
              Дотоод мэдээ
              <span>{domesticCount}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'foreign'}
              className={tab === 'foreign' ? 'active' : ''}
              onClick={() => setTab('foreign')}
            >
              Гадаад мэдээ
              <span>{foreignCount}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'kpop'}
              className={tab === 'kpop' ? 'active' : ''}
              onClick={() => setTab('kpop')}
            >
              K-pop
              <span>{kpopCount}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'yellow'}
              className={tab === 'yellow' ? 'active' : ''}
              onClick={() => setTab('yellow')}
            >
              Шар мэдээ
              <span>{yellowCount}</span>
            </button>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container news-list">
          {filtered.length === 0 && (
            <p className="empty-note">
              {tab === 'domestic'
                ? 'Одоогоор дотоод мэдээ байхгүй.'
                : tab === 'foreign'
                  ? 'Одоогоор гадаад мэдээ байхгүй.'
                  : tab === 'kpop'
                    ? 'Одоогоор K-pop мэдээ байхгүй.'
                    : 'Одоогоор шар мэдээ байхгүй.'}
            </p>
          )}
          {filtered.map((item) => (
            <Link
              key={item.id}
              to={`/news/${item.id}`}
              className="news-row"
              onClick={() => track('news_click', item.id)}
            >
              <div className="news-row-img">
                <img src={item.image} alt="" loading="lazy" />
              </div>
              <div>
                <span className="meta">
                  {newsRegionLabel(resolveNewsRegion(item))} · {item.category} · {item.date} ·{' '}
                  {item.readMin} мин
                  {item.membersOnly ? ' · MEMBER' : ''}
                </span>
                <h2>{item.title}</h2>
                <p>{item.excerpt}</p>
                {item.membersOnly && !isMember && (
                  <span className="meta">Зөвхөн member</span>
                )}
              </div>
              <ShareButton
                variant="icon"
                path={`/news/${item.id}`}
                title={item.title}
                text={item.excerpt}
              />
            </Link>
          ))}
          <MelbetBanner />
        </div>
      </section>
    </div>
  )
}

export function NewsDetailPage() {
  const { id } = useParams()
  const { data, track, addNewsComment } = useStore()
  const { user, isMember } = useAuth()
  const [text, setText] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const item = data.news.find((n) => n.id === id)

  if (!item) {
    return (
      <div className="page-hero">
        <div className="container">
          <h1>Мэдээ олдсонгүй</h1>
          <Link to="/news" className="btn btn-ghost" style={{ marginTop: '1.5rem' }}>
            Буцах
          </Link>
        </div>
      </div>
    )
  }

  if (item.membersOnly && !isMember) {
    return (
      <div className="page-hero">
        <div className="container">
          <h1>Member only</h1>
          <p>Энэ шинжилгээг үзэхийн тулд membership идэвхжүүлнэ үү.</p>
          <Link to="/membership" className="btn btn-primary" style={{ marginTop: '1.25rem' }}>
            Membership
          </Link>
        </div>
      </div>
    )
  }

  const comments = [...(item.comments || [])].sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  )

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user) {
      setErr('Сэтгэгдэл бичихийн тулд нэвтэрнэ үү.')
      return
    }
    const msg = addNewsComment(item!.id, {
      authorName: user.name,
      authorId: user.id,
      text,
    })
    if (msg) {
      setErr(msg)
      return
    }
    setText('')
    setErr(null)
  }

  return (
    <article>
      <header className="page-hero">
        <div className="container detail-head">
          <div className="section-kicker">
            {newsRegionLabel(resolveNewsRegion(item))} · {item.category} · {item.date}
          </div>
          <h1>{item.title}</h1>
          <p>{item.excerpt}</p>
          <div className="detail-share">
            <ShareButton
              path={`/news/${item.id}`}
              title={item.title}
              text={item.excerpt}
            />
          </div>
        </div>
      </header>
      <div className="container detail-layout">
        <img
          src={item.image}
          alt=""
          className="detail-cover"
          onLoad={() => track('news_click', item.id)}
        />
        <div className="detail-body">
          {(item.body?.trim() || item.excerpt || '')
            .split(/\n\n+/)
            .map((para) => para.trim())
            .filter(Boolean)
            .map((para, i) => (
              <p key={`${i}-${para.slice(0, 24)}`}>{para}</p>
            ))}
          {!item.body?.trim() && !item.excerpt?.trim() ? (
            <p className="detail-empty">Энэ мэдээнд текст оруулаагүй байна.</p>
          ) : null}
          <Link
            to="/news"
            className="section-link"
            style={{ marginTop: '2rem', display: 'inline-block' }}
          >
            ← Бүх мэдээ
          </Link>
        </div>

        <section className="news-comments" aria-label="Сэтгэгдэл">
          <div className="news-comments-head">
            <h2>Сэтгэгдэл</h2>
            <span>{comments.length}</span>
          </div>

          {user ? (
            <form className="news-comment-form" onSubmit={onSubmit}>
              <div className="news-comment-composer">
                <span className="news-comment-avatar" aria-hidden>
                  {user.name.slice(0, 1).toUpperCase()}
                </span>
                <div className="news-comment-composer-main">
                  <label className="news-comment-who" htmlFor="news-comment-input">
                    {user.name}
                  </label>
                  <textarea
                    id="news-comment-input"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Юу гэж бодож байна вэ?"
                    rows={3}
                    maxLength={800}
                    required
                  />
                  <div className="news-comment-form-actions">
                    <span className="news-comment-count">{text.length}/800</span>
                    <button type="submit" className="btn btn-primary" disabled={!text.trim()}>
                      Илгээх
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="news-comment-login">
              <span className="news-comment-avatar ghost" aria-hidden>
                ?
              </span>
              <div>
                <p>Сэтгэгдэл үлдээхийн тулд нэвтэрнэ үү.</p>
                <Link to="/auth" className="btn btn-primary">
                  Нэвтрэх
                </Link>
              </div>
            </div>
          )}

          {err && <p className="news-comment-err">{err}</p>}

          <ul className="news-comment-list">
            {comments.length === 0 && (
              <li className="news-comment-empty">
                <strong>Анхны сэтгэгдлийг та бичээрэй</strong>
                <span>Мэдээний талаар бодлоо хуваалцаарай.</span>
              </li>
            )}
            {comments.map((c) => (
              <li key={c.id}>
                <span className="news-comment-avatar" aria-hidden>
                  {c.authorName.slice(0, 1).toUpperCase()}
                </span>
                <div className="news-comment-body">
                  <div className="news-comment-meta">
                    <strong>{c.authorName}</strong>
                    <em>
                      {new Date(c.createdAt).toLocaleString('mn-MN', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </em>
                  </div>
                  <p>{c.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  )
}
