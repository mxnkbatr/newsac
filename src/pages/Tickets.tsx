import { Link } from 'react-router-dom'
import { useStore } from '../store/StoreContext'
import './Pages.css'
import './Tickets.css'

function tugrik(n: number) {
  return `${new Intl.NumberFormat('mn-MN').format(n)}₮`
}

function monthSoft(date: string) {
  const parts = date.split('.')
  if (parts.length >= 2) return `${parts[0]}.${parts[1]}`
  return 'Удахгүй'
}

export function TicketsPage() {
  const { data } = useStore()
  const shows = data.shows.filter((s) => s.active)
  const soon = data.siteFlags?.ticketsClassified !== false

  return (
    <div className={`tickets-drop-page${soon ? ' is-soon' : ''}`}>
      <header className="tickets-drop-hero">
        <div className="container">
          <div className="section-kicker">{soon ? 'Tickets · Soon' : 'Tickets'}</div>
          <h1>{soon ? 'Тасалбар удахгүй' : 'Тоглолтууд'}</h1>
          <p>
            {soon
              ? 'Шинэ шоуны drop бэлтгэгдэж байна. Нээгдэхэд lineup, газар, үнэ энд бүрэн харагдана.'
              : 'Live show, cypher, arena night — тасалбар авах боломжтой.'}
          </p>
          {soon && (
            <div className="tickets-drop-badge">
              <i aria-hidden="true" />
              <span>Coming soon</span>
            </div>
          )}
        </div>
      </header>

      <section className="section">
        <div className="container tickets-drop-list">
          {shows.map((show) =>
            soon ? (
              <article key={show.id} className="ticket-card is-soon">
                <div className="ticket-card-img">
                  <img src={show.image} alt="" loading="lazy" />
                  <div className="ticket-soon-mist" aria-hidden />
                  <div className="ticket-soon-glow" aria-hidden />
                  <span className="ticket-soon-chip">{monthSoft(show.date)}</span>
                  <span className="ticket-soon-mark">Soon</span>
                </div>
                <div className="ticket-card-body">
                  <div className="ticket-date">Drop · удахгүй</div>
                  <h2>
                    <span className="ticket-soft-title">{show.title}</span>
                  </h2>
                  <p className="ticket-desc">
                    Lineup · газар · үнэ — нээгдэхэд ил болно.
                  </p>
                  <div className="ticket-soft-rows" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="ticket-card-foot">
                    <span>Notify бэлэн байлгаарай</span>
                    <em>Удахгүй</em>
                  </div>
                </div>
              </article>
            ) : (
              <article key={show.id} className="ticket-card">
                <div className="ticket-card-img">
                  <img src={show.image} alt="" loading="lazy" />
                  <span className="ticket-city">{show.city}</span>
                </div>
                <div className="ticket-card-body">
                  <div className="ticket-date">
                    {show.date} · {show.time}
                  </div>
                  <h2>{show.title}</h2>
                  <p className="ticket-artists">{show.artists}</p>
                  {show.description && <p className="ticket-desc">{show.description}</p>}
                  <dl className="ticket-facts">
                    <div>
                      <dt>Газар</dt>
                      <dd>{show.venue}</dd>
                    </div>
                    <div>
                      <dt>Хот</dt>
                      <dd>{show.city}</dd>
                    </div>
                    <div>
                      <dt>Үнэ</dt>
                      <dd>{tugrik(show.price)}~</dd>
                    </div>
                    <div>
                      <dt>VIP</dt>
                      <dd>{tugrik(show.vipPrice)}~</dd>
                    </div>
                  </dl>
                  <div className="ticket-card-foot">
                    <span>
                      Суудал: {show.seatsLeft} · VIP: {show.vipLeft}
                    </span>
                    <em>Нээлттэй</em>
                  </div>
                </div>
              </article>
            ),
          )}
          {!shows.length && <p className="empty-note">Одоогоор тоглолт байхгүй.</p>}
        </div>

        <div className="container">
          <div className="tickets-drop-panel">
            <strong>{soon ? 'Drop-д бэлэн үлдээрэй' : 'Тасалбар'}</strong>
            <p>
              {soon
                ? 'Нээгдэхэд Newsac дээр эхлээд мэдэгдэнэ. Профайл дээр push асаалттай байлгаарай.'
                : 'Тоглолт сонгоод захиалга хийнэ.'}
            </p>
            <div className="tickets-drop-actions">
              <Link to="/" className="btn btn-primary">
                Нүүр рүү
              </Link>
              <Link to="/profile" className="btn btn-ghost">
                Профайл
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
