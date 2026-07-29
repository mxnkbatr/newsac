import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store/StoreContext'
import type { Show, TicketOrder } from '../store/types'
import './Pages.css'
import './Tickets.css'

function tugrik(n: number) {
  return `${new Intl.NumberFormat('mn-MN').format(n)}₮`
}

export function TicketsPage() {
  const { data, buyTicket } = useStore()
  const shows = data.shows.filter((s) => s.active)
  const [selected, setSelected] = useState<Show | null>(shows[0] || null)
  const [tier, setTier] = useState<TicketOrder['tier']>('standard')
  const [qty, setQty] = useState(1)
  const [email, setEmail] = useState('')
  const [method, setMethod] = useState<TicketOrder['method']>('qpay')
  const [result, setResult] = useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const current = useMemo(
    () => shows.find((s) => s.id === selected?.id) || shows[0] || null,
    [shows, selected],
  )

  const unit = current ? (tier === 'vip' ? current.vipPrice : current.price) : 0
  const left = current ? (tier === 'vip' ? current.vipLeft : current.seatsLeft) : 0
  const total = unit * qty

  function onBuy(e: FormEvent) {
    e.preventDefault()
    if (!current) return
    const res = buyTicket(current.id, tier, qty, email, method)
    if (typeof res === 'string') setResult(res)
    else {
      setResult(
        `Амжилттай! Код: ${res.code} · ${res.qty}× ${res.tier.toUpperCase()} · ${tugrik(res.total)} · ${method.toUpperCase()} (demo)`,
      )
      setQty(1)
    }
  }

  return (
    <div>
      <header className="page-hero">
        <div className="container">
          <div className="section-kicker">Tickets</div>
          <h1>Тоглолтын тасалбар</h1>
          <p>Live show, cypher, arena night — гар утсаараа шууд захиалаарай.</p>
        </div>
      </header>

      <section className="section">
        <div className="container tickets-layout">
          <div className="tickets-list">
            {shows.map((show) => (
              <button
                key={show.id}
                type="button"
                className={`ticket-card ${current?.id === show.id ? 'active' : ''}`}
                onClick={() => {
                  setSelected(show)
                  setResult(null)
                  setSheetOpen(true)
                }}
              >
                <div className="ticket-card-img fx-media">
                  <img src={show.image} alt="" loading="lazy" />
                  <span>{show.city}</span>
                </div>
                <div className="ticket-card-body">
                  <div className="ticket-date">
                    {show.date} · {show.time}
                  </div>
                  <h2>{show.title}</h2>
                  <p>{show.artists}</p>
                  <div className="ticket-meta">
                    <span>{show.venue}</span>
                    <strong>{tugrik(show.price)}~</strong>
                  </div>
                </div>
              </button>
            ))}
            {!shows.length && <p className="empty-note">Одоогоор тоглолт байхгүй.</p>}
          </div>

          {current && (
            <aside className={`ticket-buy ${sheetOpen ? 'open' : ''}`}>
              <button
                type="button"
                className="sheet-close"
                aria-label="Хаах"
                onClick={() => setSheetOpen(false)}
              >
                <span />
              </button>
              <div className="ticket-buy-hero">
                <img src={current.image} alt="" />
                <div>
                  <div className="section-kicker">Захиалга</div>
                  <h3>{current.title}</h3>
                  <p>
                    {current.venue} · {current.city}
                  </p>
                  <p>
                    {current.date} · {current.time}
                  </p>
                </div>
              </div>

              <p className="ticket-desc">{current.description}</p>

              <div className="tier-row">
                <button
                  type="button"
                  className={tier === 'standard' ? 'active' : ''}
                  onClick={() => setTier('standard')}
                >
                  Standard
                  <em>{tugrik(current.price)}</em>
                  <span>{current.seatsLeft} үлдсэн</span>
                </button>
                <button
                  type="button"
                  className={tier === 'vip' ? 'active' : ''}
                  onClick={() => setTier('vip')}
                >
                  VIP
                  <em>{tugrik(current.vipPrice)}</em>
                  <span>{current.vipLeft} үлдсэн</span>
                </button>
              </div>

              <form className="ticket-form" onSubmit={onBuy}>
                <label>
                  Тоо ширхэг
                  <div className="qty">
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                    >
                      −
                    </button>
                    <span>{qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.min(left, q + 1))}
                    >
                      +
                    </button>
                  </div>
                </label>

                <label>
                  Имэйл
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@email.com"
                  />
                </label>

                <div className="pay-methods">
                  {(
                    [
                      ['qpay', 'QPay'],
                      ['socialpay', 'SocialPay'],
                      ['card', 'Карт'],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      className={method === id ? 'active' : ''}
                      onClick={() => setMethod(id)}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="ticket-total">
                  <span>Нийт</span>
                  <strong>{tugrik(total)}</strong>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block fx-press"
                  disabled={left < 1}
                >
                  Тасалбар авах · {method.toUpperCase()}
                </button>
              </form>

              {result && <p className="checkout-result">{result}</p>}
              <p className="pay-note">
                * Demo захиалга. Бодит QR/e-ticket дараа холбогдоно. Имэйл рүү код илгээнэ гэж төсөөл.
              </p>
              <Link to="/shop" className="section-link">
                Merch shop →
              </Link>
            </aside>
          )}
        </div>

        <div
          className={`sheet-scrim ${sheetOpen ? 'on' : ''}`}
          onClick={() => setSheetOpen(false)}
        />
        {current && (
          <button
            type="button"
            className="mobile-sheet-fab"
            onClick={() => setSheetOpen(true)}
          >
            Тасалбар авах · {tugrik(current.price)}~
          </button>
        )}
      </section>
    </div>
  )
}
