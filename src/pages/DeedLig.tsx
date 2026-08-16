import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SponsorSlot } from '../components/Widgets'
import './Pages.css'
import './DeedLig.css'

const clubs = [
  { id: 'falcons', name: 'SP Falcons', city: 'Улаанбаатар' },
  { id: 'deren', name: 'Deren FC', city: 'Дархан' },
  { id: 'ubu', name: 'FC Ulaanbaatar', city: 'Улаанбаатар' },
  { id: 'khangarid', name: 'Khangarid', city: 'Эрдэнэт' },
  { id: 'erchim', name: 'Erchim', city: 'Улаанбаатар' },
  { id: 'khoromkhon', name: 'Khoromkhon', city: 'Улаанбаатар' },
  { id: 'khovd', name: 'Khovd', city: 'Ховд' },
  { id: 'azarganuud', name: 'Tuv Azarganuud', city: 'Төв' },
]

const notes = [
  {
    tag: 'Лиг',
    title: 'Монголын хөлбөмбөгийн үндэсний Дээд лиг',
    text: 'Улирлын хүснэгт, тоглолтын хуваарь, клубын мэдээг Newsac дээр нэг дороос дагана.',
  },
  {
    tag: 'Тоглолт',
    title: 'Долоо хоногийн board',
    text: 'Төв цэнгэлдэх, дерби, голын тоглолт — recap болон highlight-ыг энд нэмнэ.',
  },
  {
    tag: 'Community',
    title: 'UB + хөдөө нэг цонх',
    text: 'Эрдэнэт, Дархан, Ховд, Улаанбаатар — Дээд Лигийг зөвхөн нийслэлээр биш харна.',
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
          <div className="section-kicker">Newsac · Football</div>
          <h1>Дээд Лиг</h1>
          <p>
            Монголын хөлбөмбөгийн үндэсний Дээд лиг. Клуб, тоглолт, улирлын яриа — NBA-тай
            зэрэгцүүлээд Newsac дээр.
          </p>
          <div className="deed-hero-links">
            <Link to="/news" className="btn btn-primary">
              Мэдээ үзэх
            </Link>
            <Link to="/live" className="btn btn-ghost">
              Live
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
