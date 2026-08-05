import { Link } from 'react-router-dom'
import { YOUTUBE_CHANNEL_URL } from '../data/brand'
import './Footer.css'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-logo-row">
            <img src="/logo.png" alt="" width={40} height={40} />
            <strong>Newsac</strong>
          </div>
          <p>
            Монголын хип-хоп зах зээлийн мэдээ, шинжилгээ, рэпперийн түүх — нэг
            платформ дээр.
          </p>
        </div>

        <div>
          <h4>Цэс</h4>
          <ul>
            <li>
              <Link to="/news">Мэдээ</Link>
            </li>
            <li>
              <Link to="/videos">Бичлэг</Link>
            </li>
            <li>
              <Link to="/live">Шууд</Link>
            </li>
            <li>
              <Link to="/wall">Wall</Link>
            </li>
            <li>
              <Link to="/rappers">Рэпперүүд</Link>
            </li>
            <li>
              <Link to="/rankings">Рейтинг</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4>Оролцох</h4>
          <ul>
            <li>
              <Link to="/podcasts">Podcast</Link>
            </li>
            <li>
              <Link to="/tickets">Тасалбар</Link>
            </li>
            <li>
              <Link to="/shop">Дэлгүүр</Link>
            </li>
            <li>
              <Link to="/shorts">Shorts</Link>
            </li>
            <li>
              <Link to="/membership">Fan Pass</Link>
            </li>
            <li>
              <Link to="/battle">Battle</Link>
            </li>
            <li>
              <Link to="/artist">Artist Hub</Link>
            </li>
            <li>
              <Link to="/admin">Admin</Link>
            </li>
            <li>
              <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noreferrer">
                YouTube
              </a>
            </li>
            <li>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} Newsac. Бүх эрх хуулиар хамгаалагдсан.
          <span className="footer-credit"> · Developed by Munkhbaatar Dorjsuren</span>
        </span>
        <span className="footer-pulse">LIVE CULTURE</span>
      </div>
    </footer>
  )
}
