import { Link, useParams } from 'react-router-dom'
import { useStore } from '../store/StoreContext'
import { useAuth } from '../context/AuthContext'
import './Pages.css'

export function NewsPage() {
  const { data, track } = useStore()
  const { isMember } = useAuth()

  return (
    <div>
      <header className="page-hero">
        <div className="container">
          <div className="section-kicker">Мэдээ · Шинжилгээ</div>
          <h1>Зах зээлийн мэдээ</h1>
          <p>Монголын хип-хоп дахь чиг хандлага, тоо баримт, соёлын яриа.</p>
        </div>
      </header>

      <section className="section">
        <div className="container news-list">
          {data.news.map((item) => (
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
                  {item.category} · {item.date} · {item.readMin} мин
                  {item.membersOnly ? ' · MEMBER' : ''}
                </span>
                <h2>{item.title}</h2>
                <p>{item.excerpt}</p>
                {item.membersOnly && !isMember && (
                  <span className="meta">Зөвхөн member</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export function NewsDetailPage() {
  const { id } = useParams()
  const { data, track } = useStore()
  const { isMember } = useAuth()
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

  return (
    <article>
      <header className="page-hero">
        <div className="container detail-head">
          <div className="section-kicker">
            {item.category} · {item.date}
          </div>
          <h1>{item.title}</h1>
          <p>{item.excerpt}</p>
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
          {item.body.split('\n\n').map((para) => (
            <p key={para.slice(0, 24)}>{para}</p>
          ))}
          <Link to="/news" className="section-link" style={{ marginTop: '2rem', display: 'inline-block' }}>
            ← Бүх мэдээ
          </Link>
        </div>
      </div>
    </article>
  )
}
