import { useEffect, useState } from 'react'
import { YOUTUBE_HANDLE, YOUTUBE_POSTS_URL } from '../data/brand'
import { youtubeThumb } from '../lib/youtube'
import { fetchYoutubePosts, type YoutubeChannelPost } from '../lib/youtubePosts'
import './Pages.css'
import './YoutubePosts.css'

function linkify(text: string) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g)
  return parts.map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noreferrer">
        {part}
      </a>
    ) : (
      <span key={i}>{part}</span>
    ),
  )
}

function PostCard({ post }: { post: YoutubeChannelPost }) {
  return (
    <article className="yt-post">
      <header className="yt-post-head">
        <img src="/logo.png" alt="" width={40} height={40} />
        <div>
          <strong>Newsac</strong>
          <span>{post.published || YOUTUBE_HANDLE}</span>
        </div>
        {post.likes ? <em>{post.likes} likes</em> : null}
      </header>

      {post.text ? <p className="yt-post-text">{linkify(post.text)}</p> : null}

      {post.images.length > 0 && (
        <div className={`yt-post-images count-${Math.min(post.images.length, 4)}`}>
          {post.images.slice(0, 4).map((src) => (
            <a key={src} href={post.url} target="_blank" rel="noreferrer">
              <img src={src} alt="" loading="lazy" />
            </a>
          ))}
        </div>
      )}

      {post.videoId && (
        <a
          className="yt-post-video"
          href={`https://www.youtube.com/watch?v=${post.videoId}`}
          target="_blank"
          rel="noreferrer"
        >
          <img src={youtubeThumb(post.videoId)} alt="" loading="lazy" />
          <span>Бичлэг үзэх</span>
        </a>
      )}

      {post.poll && post.poll.length > 0 && (
        <ul className="yt-post-poll">
          {post.poll.map((opt) => (
            <li key={opt.text}>{opt.text}</li>
          ))}
        </ul>
      )}

      <a className="yt-post-open" href={post.url} target="_blank" rel="noreferrer">
        YouTube дээр нээх →
      </a>
    </article>
  )
}

export function YoutubePostsPage() {
  const [posts, setPosts] = useState<YoutubeChannelPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    void fetchYoutubePosts().then((payload) => {
      if (cancelled) return
      setPosts(payload.posts || [])
      setError(payload.posts?.length ? null : payload.error || null)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="yt-posts-page">
      <header className="yt-posts-hero">
        <div className="container">
          <p className="yt-posts-kicker">YouTube · Posts</p>
          <h1>{YOUTUBE_HANDLE}</h1>
          <p className="yt-posts-lead">
            Сувгийн Posts — сайт дээр шууд. Бүрэн харах:{' '}
            <a href={YOUTUBE_POSTS_URL} target="_blank" rel="noreferrer">
              youtube.com/@Newsacchannel/posts
            </a>
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container yt-posts-feed">
          {loading && <p className="yt-posts-status">Постууд ачаалж байна…</p>}
          {!loading && error && posts.length === 0 && (
            <div className="yt-posts-empty">
              <p>{error}</p>
              <a className="btn btn-primary" href={YOUTUBE_POSTS_URL} target="_blank" rel="noreferrer">
                YouTube Posts нээх
              </a>
            </div>
          )}
          {!loading &&
            posts.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
      </section>
    </div>
  )
}
