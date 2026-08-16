import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SponsorSlot } from '../components/Widgets'
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

const notes = [
  {
    tag: 'Лиг',
    title: 'Монголын сагсан бөмбөгийн Үндэсний Дээд лиг',
    text: 'Улирлын хүснэгт, тоглолтын хуваарь, клубын мэдээг Newsac дээр нэг дороос дагана.',
  },
  {
    tag: 'Тоглолт',
    title: 'Долоо хоногийн board',
    text: 'МBank Arena, дерби, playoff — recap болон highlight-ыг энд нэмнэ.',
  },
  {
    tag: 'Community',
    title: 'UB + хөдөө нэг цонх',
    text: 'Эрдэнэт, Дархан, Ховд, Сэлэнгэ, Завхан — Дээд Лигийг зөвхөн нийслэлээр биш харна.',
  },
]

export function DeedLigPage() {
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
            Монголын сагсан бөмбөгийн Үндэсний Дээд лиг. Клуб, тоглолт, улирлын яриа — NBA-тай
            зэрэгцүүлээд Newsac дээр.
          </p>
          <div className="deed-hero-links">
            <Link to="/news" className="btn btn-primary">
              Мэдээ үзэх
            </Link>
            <Link to="/nba" className="btn btn-ghost">
              NBA
            </Link>
          </div>
        </div>
      </header>

      <section className="section">
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

      <section className="section section-alt">
        <div className="container deed-notes">
          {notes.map((n) => (
            <article key={n.title} className="deed-note">
              <span>{n.tag}</span>
              <h3>{n.title}</h3>
              <p>{n.text}</p>
            </article>
          ))}
        </div>
        <div className="container" style={{ marginTop: '1.25rem' }}>
          <SponsorSlot slot="nba" alwaysShow />
        </div>
      </section>
    </div>
  )
}
