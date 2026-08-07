import { Link } from 'react-router-dom'
import { YOUTUBE_CHANNEL_URL, YOUTUBE_HANDLE } from '../data/brand'
import { useStore } from '../store/StoreContext'
import './Pages.css'
import './About.css'

const pillars = [
  {
    title: 'Эксклюзив контент',
    text: 'Онцлох ярилцлага, видео, подкаст — ганц товшилтоор.',
  },
  {
    title: 'Арга хэмжээ & Тасалбар',
    text: 'Шоу, эвентүүдийн мэдээлэл болон тасалбар борлуулалт.',
  },
  {
    title: 'Smart App Experience',
    text: 'Илүү хурдан, илүү ухаалаг, илүү хүртээмжтэй шийдэл.',
  },
]

export function AboutPage() {
  const { data } = useStore()
  const about = data.about

  return (
    <div className="about-page">
      <header className="about-hero">
        <div className="container about-hero-inner">
          <p className="about-kicker">Бидний тухай</p>
          <h1>
            <span className="about-brand">NEWSAC</span>
            <span className="about-slogan">One platform. Endless entertainment.</span>
          </h1>
          <p className="about-lead">
            Newsac бол зөвхөн мэдээний платформ биш. Энэ бол хөгжим, спорт, соёл,
            энтертайнментийн ертөнцийг нэг дороос мэдрэх шинэ орон зай.
          </p>
        </div>
      </header>

      <section className="about-section">
        <div className="container about-prose">
          <h2>Бидний түүх & соёл</h2>
          <p>
            2019 оноос эхэлсэн Newsac-ийн аялал өнөөдөр Newsac.mn болон өргөжин, Монголын
            энтертайнмент салбарын шинэ дижитал экосистем болон хөгжиж байна.
          </p>
          <p>
            Үүсгэн байгуулагч Цэндийн Батбаатар (Newsac)-ийн санаачилгаар Монголын хип хоп
            соёл, хөгжмийн салбарын мэдээ мэдээлэл, уран бүтээлчдийн түүх, шинэ бүтээл,
            ярилцлага болон онцлох үйл явдлуудыг олон нийтэд хүргэсээр ирсэн билээ. Бид энэхүү
            туршлага, үзэгчдийн итгэл дээр тулгуурлан дотоодын төдийгүй дэлхийн энтертайнмент
            ертөнцийн чиг хандлагыг нэг цэгт цогцлоож байна.
          </p>
        </div>
      </section>

      <section className="about-section about-section-alt">
        <div className="container">
          <div className="about-prose">
            <h2>Экосистем & ирээдүй</h2>
            <p>
              Бид уран бүтээлчид, контент бүтээгчид болон үзэгч, сонсогчдыг шууд холбох шинэ
              түвшний орчныг бүтээхийг зорьдог.
            </p>
          </div>
          <ul className="about-pillars">
            {pillars.map((p) => (
              <li key={p.title}>
                <strong>{p.title}</strong>
                <span>{p.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="about-section">
        <div className="container about-founder">
          <div className="about-photo">
            <img src={about.photo} alt={about.name} />
            <div className="about-photo-frame" aria-hidden />
          </div>
          <div className="about-founder-copy">
            <p className="about-kicker">Үүсгэн байгуулагч</p>
            <h2>{about.name}</h2>
            <p className="about-role">{about.role}</p>
            {about.location && <p className="about-loc">{about.location}</p>}
            <p className="about-bio">{about.bio}</p>
            <div className="about-actions">
              <a
                className="btn btn-primary"
                href={YOUTUBE_CHANNEL_URL}
                target="_blank"
                rel="noreferrer"
              >
                YouTube {YOUTUBE_HANDLE}
              </a>
              <Link to="/auth" className="btn btn-ghost">
                Newsac-д нэвтрэх
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="about-welcome">
        <div className="container">
          <p className="about-kicker">Welcome to newsac.mn</p>
          <h2>Энэ бол зөвхөн эхлэл</h2>
          <p>
            Бид салбартаа шинэ хэмнэл, шинэ стандартаар тасралтгүй хөгжүүлэлт хийсээр байна.
            Welcome to the center of entertainment.
          </p>
        </div>
      </section>
    </div>
  )
}
