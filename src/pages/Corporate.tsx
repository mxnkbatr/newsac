import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  CONTACT_EMAIL,
  PARTNERSHIP_EMAIL,
  SOCIAL,
  YOUTUBE_HANDLE,
} from '../data/brand'
import './Pages.css'
import './Corporate.css'

function CorporateShell({
  kicker,
  title,
  lead,
  children,
}: {
  kicker: string
  title: string
  lead: string
  children: ReactNode
}) {
  return (
    <div className="corp-page">
      <header className="corp-hero">
        <div className="container">
          <p className="corp-kicker">{kicker}</p>
          <h1>{title}</h1>
          <p className="corp-lead">{lead}</p>
        </div>
      </header>
      <section className="section">
        <div className="container corp-body">{children}</div>
      </section>
    </div>
  )
}

export function ContactPage() {
  return (
    <CorporateShell
      kicker="Contact"
      title="Холбоо барих"
      lead="Newsac багтай холбогдох — мэдээ, хамтрал, ерөнхий асуулт."
    >
      <div className="corp-cards">
        <a className="corp-card" href={`mailto:${CONTACT_EMAIL}`}>
          <span>Ерөнхий</span>
          <strong>{CONTACT_EMAIL}</strong>
        </a>
        <a className="corp-card" href={`mailto:${PARTNERSHIP_EMAIL}`}>
          <span>Хамтрал</span>
          <strong>{PARTNERSHIP_EMAIL}</strong>
        </a>
      </div>
      <h2>Social</h2>
      <ul className="corp-links">
        <li>
          <a href={SOCIAL.facebook} target="_blank" rel="noreferrer">
            Facebook
          </a>
        </li>
        <li>
          <a href={SOCIAL.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
        </li>
        <li>
          <a href={SOCIAL.youtube} target="_blank" rel="noreferrer">
            YouTube {YOUTUBE_HANDLE}
          </a>
        </li>
      </ul>
      <p className="corp-note">
        <Link to="/about">Бидний тухай</Link> · <Link to="/partnership">Хамтран ажиллах</Link>
      </p>
    </CorporateShell>
  )
}

export function PartnershipPage() {
  return (
    <CorporateShell
      kicker="Partnership"
      title="Хамтран ажиллах"
      lead="Уран бүтээлчид, бренд, медиа, эвент — Newsac экосистемд нэгдээрэй."
    >
      <p>
        Бид контент, live, чарт, community, тасалбар зэрэг олон сувгаар хамтрагчидтай
        ажилладаг. Санаагаа илгээгээд хамт шинэ хэмнэл бүтээцгээе.
      </p>
      <div className="corp-cards">
        <a className="corp-card" href={`mailto:${PARTNERSHIP_EMAIL}`}>
          <span>Partnership</span>
          <strong>{PARTNERSHIP_EMAIL}</strong>
        </a>
      </div>
      <ul className="corp-bullets">
        <li>Артист / лейбл хамтрал</li>
        <li>Эвент &amp; тасалбар</li>
        <li>Контент / сериал / подкаст</li>
        <li>Бренд кампанит ажил</li>
      </ul>
    </CorporateShell>
  )
}

export function AdvertisePage() {
  return (
    <CorporateShell
      kicker="Advertise"
      title="Сурталчилгаа байршуулах"
      lead="Newsac.mn болон апп дээр брендээ үзэгчдэд хүргэ — мэдээ, NBA, battle, нүүр."
    >
      <p>
        Дотоод/гадаад мэдээ, NBA, live, community зэрэг өндөр анхааралтай хэсгүүдэд
        сурталчилгаа байршуулна. Формат, байрлал, хугацааг хамт тохируулна.
      </p>
      <div className="corp-cards">
        <a className="corp-card" href={`mailto:${PARTNERSHIP_EMAIL}?subject=Advertise%20with%20Newsac`}>
          <span>Advertise With Us</span>
          <strong>{PARTNERSHIP_EMAIL}</strong>
        </a>
      </div>
      <ul className="corp-bullets">
        <li>Нүүр / мэдээ / NBA слот</li>
        <li>Sponsored story &amp; drop</li>
        <li>Live / эвент пакет</li>
      </ul>
    </CorporateShell>
  )
}

export function PrivacyPage() {
  return (
    <CorporateShell
      kicker="Legal"
      title="Privacy Policy"
      lead="Newsac.mn таны хувийн мэдээллийг хэрхэн цуглуулж, ашиглах тухай."
    >
      <div className="corp-legal">
        <p>
          Бид бүртгэл, нэвтрэлт, үйлчилгээний чанар сайжруулахад шаардлагатай мэдээллийг
          цуглуулна. Имэйл, нас, хүйс зэрэг профайлын мэдээллийг зөвхөн үйлчилгээний зориулалтаар
          ашиглана.
        </p>
        <p>
          Гуравдагч тал (жишээ нь Supabase, YouTube) руу дамжуулалт үйлчилгээ ажиллахад
          шаардлагатай хэмжээнд хийгдэнэ. Бид таны мэдээллийг зөвшөөрөлгүйгээр зарж борлуулахгүй.
        </p>
        <p>
          Асуулт байвал <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> руу холбогдоно уу.
        </p>
      </div>
    </CorporateShell>
  )
}

export function TermsPage() {
  return (
    <CorporateShell
      kicker="Legal"
      title="Terms & Conditions"
      lead="Newsac.mn болон холбогдох үйлчилгээг ашиглах нөхцөл."
    >
      <div className="corp-legal">
        <p>
          Сайт, апп, контент, community функцуудыг ашигласнаар та эдгээр нөхцөлийг зөвшөөрсөнд
          тооцно. Хууль бус, доромжилсон, эрхийн зөрчилтэй контент нийтлэхийг хориглоно.
        </p>
        <p>
          Контентын эзэмшигчдийн эрх хүндлэгдэнэ. Newsac нь гуравдагч эх сурвалж (YouTube гэх
          мэт)-ийн боломжгүй байдалд хариуцлага хүлээхгүй.
        </p>
        <p>
          Нөхцөл шинэчлэгдэж болно. Асуулт:{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </div>
    </CorporateShell>
  )
}
