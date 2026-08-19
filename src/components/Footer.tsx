import { Link } from 'react-router-dom'
import {
  BRAND_DOMAIN,
  CONTACT_EMAIL,
  PARTNERSHIP_EMAIL,
  SOCIAL,
  YOUTUBE_HANDLE,
} from '../data/brand'
import './Footer.css'

const year = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="footer" id="site-footer">
      <div className="container footer-top">
        <div className="footer-brand">
          <div className="footer-logo-row">
            <img src="/logo.png" alt="" width={44} height={44} />
            <div>
              <strong>Newsac</strong>
              <em>{BRAND_DOMAIN}</em>
            </div>
          </div>
          <p>
            One Platform. Endless Entertainment.
            <br />
            Монгол болон дэлхийн хип-хоп, спорт, соёл, энтертайнментийг нэг дор холбосон
            шинэ үеийн нэгдсэн медиа экосистем.
          </p>
        </div>

        <div className="footer-col">
          <h4>Компани</h4>
          <ul>
            <li>
              <Link to="/about">Бидний тухай</Link>
            </li>
            <li>
              <Link to="/contact">Холбоо барих</Link>
            </li>
            <li>
              <Link to="/partnership">Хамтран ажиллах</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Холбоо барих</h4>
          <ul className="footer-contact">
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </li>
            <li>
              <a href={`mailto:${PARTNERSHIP_EMAIL}`}>{PARTNERSHIP_EMAIL}</a>
            </li>
          </ul>
          <h4 className="footer-social-label">Social</h4>
          <ul className="footer-social">
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
        </div>

        <div className="footer-col footer-app">
          <h4>Newsac App</h4>
          <p>Тун удахгүй.. App Store / Google Play</p>
          <div className="footer-store-row" aria-hidden="true">
            <span className="footer-store">App Store</span>
            <span className="footer-store">Google Play</span>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>
          © {year} Newsac.mn
          <br className="footer-br" />
          All Rights Reserved.
        </span>
        <nav className="footer-legal" aria-label="Legal">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms &amp; Conditions</Link>
        </nav>
      </div>
    </footer>
  )
}
