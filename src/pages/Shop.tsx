import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useStore } from '../store/StoreContext'
import './Pages.css'
import './Shop.css'

function LockMark() {
  return (
    <span className="shop-lock" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="34" height="34">
        <path
          fill="currentColor"
          d="M17 8h-1V6a4 4 0 1 0-8 0v2H7a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2Zm-7-2a2 2 0 1 1 4 0v2h-4V6Zm7 13H7v-9h10v9Zm-5-2a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
        />
      </svg>
    </span>
  )
}

function ShopSoon() {
  return (
    <div className="shop-soon-page">
      <header className="shop-soon-hero">
        <div className="container">
          <div className="section-kicker">Shop</div>
          <h1>Coming soon</h1>
          <p>Newsac дэлгүүр — бараа нэмэгдэх хүртэл түгжээтэй. Тун удахгүй.</p>
          <div className="shop-soon-badge">
            <LockMark />
            <span>LOCKED · DROP SOON</span>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="shop-soon-stage">
            <div className="shop-soon-glow" aria-hidden />
            <LockMark />
            <strong>Merch · Digital · Tip</strong>
            <p>
              Red Tee, hoodie, digital тайлан, Fire tip — бүгд удахгүй энд нээгдэнэ. Бараа
              нэмэгдмэгц сагс идэвхжинэ.
            </p>
            <div className="shop-soon-actions">
              <Link to="/" className="btn btn-primary">
                Нүүр рүү
              </Link>
              <Link to="/membership" className="btn btn-ghost">
                Fan Pass
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

/** Бараа нэмэгдэх хүртэл shop түгжээтэй — admin-аас нээж болно */
export function ShopPage() {
  const { data, addToCart } = useStore()
  const soon = data.siteFlags?.shopSoon !== false
  if (soon) return <ShopSoon />

  const products = data.products.filter((p) => p.active)

  return (
    <div>
      <header className="page-hero">
        <div className="container">
          <div className="section-kicker">Shop</div>
          <h1>Newsac Shop</h1>
          <p>Merch, digital, tip — сагсанд хийгээд захиал.</p>
        </div>
      </header>
      <section className="section">
        <div className="container shop-grid">
          {products.map((p) => (
            <article key={p.id} className="shop-card">
              <div className="shop-card-img">
                <img src={p.image} alt="" loading="lazy" />
              </div>
              <div className="shop-card-body">
                <h2>{p.name}</h2>
                <p>{p.description}</p>
                <div className="shop-card-meta">
                  <strong>{new Intl.NumberFormat('mn-MN').format(p.price)}₮</strong>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => addToCart(p.id)}
                  >
                    Сагс
                  </button>
                </div>
              </div>
            </article>
          ))}
          {!products.length && <p className="empty-note">Одоогоор бараа байхгүй.</p>}
        </div>
      </section>
    </div>
  )
}

export function MembershipPage() {
  const { data } = useStore()
  const { user, isMember, membershipTier, activateMembership } = useAuth()
  const [done, setDone] = useState<string | null>(null)
  const soon = data.siteFlags?.passSoon !== false

  if (soon) {
    return (
      <div className="shop-soon-page">
        <header className="shop-soon-hero">
          <div className="container">
            <div className="section-kicker">Fan Pass</div>
            <h1>Coming soon</h1>
            <p>
              Newsac Pass — early ticket, exclusive drop, live replay. Тун удахгүй нээгдэнэ.
            </p>
            <div className="shop-soon-badge">
              <span aria-hidden="true">★</span>
              <span>LOCKED · NEWSAC PASS SOON</span>
            </div>
          </div>
        </header>

        <section className="section">
          <div className="container">
            <div className="shop-soon-stage">
              <div className="shop-soon-glow" aria-hidden />
              <strong>Fan · Street · VIP</strong>
              <p>
                Complex-style membership удахгүй. Early access, member news, podcast, ticket —
                нэг Pass-аар. Нээгдэхэд эндээс QPay-аар авна.
              </p>
              <div className="shop-soon-actions">
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

  const tiers = [
    {
      id: 'fan' as const,
      name: 'Fan Pass',
      price: '9,900₮',
      months: 1,
      perks: ['Wall early react', 'Daily Drop мэдэгдэл', 'Battle санал'],
    },
    {
      id: 'street' as const,
      name: 'Street Pass',
      price: '19,900₮',
      months: 1,
      perks: [
        'Fan Pass бүгд',
        'Early video / member news',
        'Podcast members-only',
        'Ticket early access',
      ],
    },
    {
      id: 'vip' as const,
      name: 'VIP Pass',
      price: '49,900₮',
      months: 1,
      perks: [
        'Street Pass бүгд',
        'VIP шоуны эрт худалдаа',
        'Artist Hub live replay',
        'Sponsor-free Music (удахгүй)',
      ],
    },
  ]

  return (
    <div>
      <header className="page-hero">
        <div className="container">
          <div className="section-kicker">Fan Pass</div>
          <h1>Newsac Pass</h1>
          <p>
            Complex-style membership — early ticket, exclusive drop, live replay.
            {isMember && membershipTier
              ? ` Одоо: ${membershipTier.toUpperCase()} · ${new Date(user!.membershipUntil!).toLocaleDateString('mn-MN')} хүртэл.`
              : ''}
          </p>
        </div>
      </header>
      <section className="section">
        <div className="container member-grid member-grid-tiers">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`member-card ${membershipTier === tier.id && isMember ? 'is-active' : ''}`}
            >
              <h2>
                {tier.name}
                <span>{tier.price}/сар</span>
              </h2>
              <ul>
                {tier.perks.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              {!user ? (
                <Link to="/auth" className="btn btn-primary">
                  Эхлээд нэвтрэх
                </Link>
              ) : isMember && membershipTier === tier.id ? (
                <p className="member-active">Идэвхтэй</p>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    activateMembership(tier.months, tier.id)
                    setDone(tier.name)
                  }}
                >
                  QPay-аар авах (demo)
                </button>
              )}
            </div>
          ))}
          {done && <p className="checkout-result">{done} идэвхжлээ!</p>}
        </div>
      </section>
    </div>
  )
}
