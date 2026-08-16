import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { SponsorSlot } from '../components/Widgets'
import { useStore } from '../store/StoreContext'
import './Pages.css'
import './DeedLig.css'

const clubs = [
  { id: 'knights', name: 'BCH Найтс', city: 'Улаанбаатар' },
  { id: 'khuleguud', name: 'Хасын Хүлэгүүд', city: 'Улаанбаатар' },
  { id: 'apes', name: 'SG Эйпс', city: 'Улаанбаатар' },
  { id: 'miners', name: 'Омни Эрдэнэт Майнерс', city: 'Эрдэнэт' },
  { id: 'bodons', name: 'Сэлэнгэ Бодонс', city: 'Сэлэнгэ' },
  { id: 'shonkhoruud', name: 'Хаан Шонхорууд', city: 'Ховд' },
  { id: 'darkhan', name: 'Дархан Юнайтед', city: 'Дархан' },
  { id: 'brothers', name: 'Завхан Бродерс', city: 'Завхан' },
  { id: 'mongolians', name: 'Монголианс', city: 'Улаанбаатар' },
  { id: 'metal', name: 'Бишрэлт Металл', city: 'Улаанбаатар' },
]

export function DeedLigPage() {
  const { data } = useStore()
  const news = data.deedLigNews || []
  const featured = news[0]

  useEffect(() => {
    document.title = 'Дээд Лиг · Newsac'
    return () => {
      document.title = 'Newsac'
    }
  }, [])

  return (
    <div className="deed-lig-page">
      <header className="deed-hero">
        <div className="container">
          <div className="section-kicker">Newsac · Basketball</div>
          <h1>Дээд Лиг</h1>
          <p>
            Монголын сагсан бөмбөгийн Үндэсний Дээд лиг. Мэдээ, клуб, тоглолт — ерөнхий мэдээнээс
            тусдаа энд.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="section-kicker">Мэдээлэл</div>
              <h2 className="section-title">Дээд Лигийн мэдээ</h2>
            </div>
            <span className="deed-count">{news.length} нийтлэл</span>
          </div>

          {featured ? (
            <div className="deed-news">
              {news.map((u) => (
                <Link key={u.id} to={`/deed-lig/${u.id}`} className="deed-news-card">
                  <img src={u.image} alt="" loading="lazy" />
                  <div>
                    <span>
                      {u.tag} · {u.readMin} мин · {u.when}
                    </span>
                    <h3>{u.title}</h3>
                    <p>{u.blurb}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="deed-empty">Дээд Лигийн мэдээлэл тун удахгүй энд гарна.</p>
          )}
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="section-kicker">Клубууд</div>
              <h2 className="section-title">Дээд Лигийн нэрс</h2>
            </div>
          </div>
          <div className="deed-clubs">
            {clubs.map((c) => (
              <article key={c.id} className="deed-club">
                <strong>{c.name}</strong>
                <span>{c.city}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SponsorSlot slot="nba" alwaysShow />
        </div>
      </section>
    </div>
  )
}

export function DeedLigDetailPage() {
  const { id } = useParams()
  const { data } = useStore()
  const item = (data.deedLigNews || []).find((u) => u.id === id)

  useEffect(() => {
    document.title = item ? `${item.title} · Дээд Лиг` : 'Дээд Лиг · Newsac'
    return () => {
      document.title = 'Newsac'
    }
  }, [item])

  if (!item) {
    return <Navigate to="/deed-lig" replace />
  }

  return (
    <div className="deed-lig-page">
      <article className="deed-article">
        <div className="container deed-article-inner">
          <Link to="/deed-lig" className="deed-back">
            ← Дээд Лиг
          </Link>
          <div className="deed-article-cover">
            <img src={item.image} alt="" />
          </div>
          <span>
            {item.tag} · {item.readMin} мин · {item.when}
          </span>
          <h1>{item.title}</h1>
          <p className="deed-article-lead">{item.blurb}</p>
          <div className="deed-article-body">
            {item.body.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>
        </div>
      </article>
    </div>
  )
}
