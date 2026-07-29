import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useStore } from '../store/StoreContext'
import type { WallPost } from '../store/types'
import './Pages.css'
import './Wall.css'

function timeAgo(iso: string) {
  const diff = Date.now() - +new Date(iso)
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'саяхан'
  if (m < 60) return `${m} мин`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} цаг`
  return `${Math.floor(h / 24)} өдөр`
}

export function WallPage() {
  const { user } = useAuth()
  const { data, upsertWallPost, reactWallPost, addWallComment, deleteWallPost, isAdmin } =
    useStore()
  const [text, setText] = useState('')
  const [image, setImage] = useState('')
  const [sheetPost, setSheetPost] = useState<WallPost | null>(null)
  const [comment, setComment] = useState('')

  const posts = useMemo(
    () => [...data.wallPosts].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
    [data.wallPosts],
  )

  function compose(e: FormEvent) {
    e.preventDefault()
    if (!user) return
    const body = text.trim()
    if (!body) return
    upsertWallPost({
      id: crypto.randomUUID(),
      authorName: user.name,
      authorId: user.id,
      text: body,
      image: image.trim() || undefined,
      createdAt: new Date().toISOString(),
      fires: 0,
      colds: 0,
      comments: [],
    })
    setText('')
    setImage('')
  }

  function submitComment(e: FormEvent) {
    e.preventDefault()
    if (!user || !sheetPost || !comment.trim()) return
    addWallComment(sheetPost.id, {
      authorName: user.name,
      authorId: user.id,
      text: comment,
    })
    setComment('')
  }

  const activeSheet = sheetPost
    ? data.wallPosts.find((p) => p.id === sheetPost.id) || sheetPost
    : null

  return (
    <div className="wall-page">
      <header className="page-hero">
        <div className="container">
          <div className="section-kicker">Community</div>
          <h1>Wall</h1>
          <p>Пост · зураг · Fire / Cold · сэтгэгдэл — Instagram маягийн feed.</p>
        </div>
      </header>

      <section className="section">
        <div className="container wall-wrap">
          {user ? (
            <form className="wall-compose" onSubmit={compose}>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Юу бодож байна вэ?"
                rows={3}
                required
              />
              <input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Зургийн URL (заавал биш)"
              />
              <button type="submit" className="btn btn-primary">
                Нийтлэх
              </button>
            </form>
          ) : (
            <p className="wall-login-hint">
              Постлохын тулд <Link to="/auth">нэвтэрнэ үү</Link>.
            </p>
          )}

          <div className="wall-feed">
            {posts.map((post) => (
              <article key={post.id} className="wall-card">
                <header className="wall-card-head">
                  <span className="wall-avatar">{post.authorName.slice(0, 1).toUpperCase()}</span>
                  <div>
                    <strong>{post.authorName}</strong>
                    <em>{timeAgo(post.createdAt)}</em>
                  </div>
                  {isAdmin && (
                    <button
                      type="button"
                      className="wall-delete"
                      onClick={() => deleteWallPost(post.id)}
                      aria-label="Устгах"
                    >
                      ×
                    </button>
                  )}
                </header>
                <p className="wall-text">{post.text}</p>
                {post.image && (
                  <div className="wall-media fx-media">
                    <img src={post.image} alt="" loading="lazy" />
                  </div>
                )}
                <footer className="wall-actions">
                  <button type="button" onClick={() => reactWallPost(post.id, 'fire')}>
                    Fire {post.fires}
                  </button>
                  <button type="button" onClick={() => reactWallPost(post.id, 'cold')}>
                    Cold {post.colds}
                  </button>
                  <button type="button" onClick={() => setSheetPost(post)}>
                    Сэтгэгдэл {post.comments.length}
                  </button>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div
        className={`sheet-scrim ${activeSheet ? 'on' : ''}`}
        onClick={() => setSheetPost(null)}
        aria-hidden={!activeSheet}
      />
      <aside className={`wall-sheet ${activeSheet ? 'open' : ''}`} aria-hidden={!activeSheet}>
        {activeSheet && (
          <>
            <button type="button" className="sheet-close" onClick={() => setSheetPost(null)}>
              <span />
            </button>
            <h3>Сэтгэгдэл</h3>
            <ul className="wall-comments">
              {activeSheet.comments.length === 0 && (
                <li className="empty-note">Одоогоор хоосон.</li>
              )}
              {activeSheet.comments.map((c) => (
                <li key={c.id}>
                  <strong>{c.authorName}</strong>
                  <span>{c.text}</span>
                  <em>{timeAgo(c.createdAt)}</em>
                </li>
              ))}
            </ul>
            {user ? (
              <form className="wall-comment-form" onSubmit={submitComment}>
                <input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Сэтгэгдэл бичих..."
                  required
                />
                <button type="submit" className="btn btn-primary">
                  Илгээх
                </button>
              </form>
            ) : (
              <p className="empty-note">
                <Link to="/auth">Нэвтэрч</Link> сэтгэгдэл үлдээнэ үү.
              </p>
            )}
          </>
        )}
      </aside>
    </div>
  )
}
