import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store/StoreContext'
import { useAuth } from '../context/AuthContext'
import { SponsorSlot } from '../components/Widgets'
import type { Order, Product } from '../store/types'
import './Pages.css'
import './Shop.css'

function tugrik(n: number) {
  return `${new Intl.NumberFormat('mn-MN').format(n)}₮`
}

export function ShopPage() {
  const { data, cart, addToCart, setCartQty, checkout, clearCart } = useStore()
  const [filter, setFilter] = useState<'all' | Product['type']>('all')
  const [email, setEmail] = useState('')
  const [method, setMethod] = useState<Order['method']>('qpay')
  const [result, setResult] = useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const products = data.products.filter(
    (p) => p.active && (filter === 'all' || p.type === filter),
  )

  const lines = useMemo(
    () =>
      cart
        .map((c) => {
          const p = data.products.find((x) => x.id === c.productId)
          return p ? { ...c, product: p } : null
        })
        .filter(Boolean) as { productId: string; qty: number; product: Product }[],
    [cart, data.products],
  )

  const total = lines.reduce((s, l) => s + l.product.price * l.qty, 0)

  function onCheckout(e: FormEvent) {
    e.preventDefault()
    const res = checkout(email, method)
    if (typeof res === 'string') setResult(res)
    else {
      setResult(
        `Амжилттай! Захиалга #${res.id.slice(0, 8)} · ${tugrik(res.total)} · ${method.toUpperCase()} (demo)`,
      )
    }
  }

  return (
    <div>
      <header className="page-hero">
        <div className="container">
          <div className="section-kicker">Shop</div>
          <h1>Newsac дэлгүүр</h1>
          <p>Merch, digital тайлан, Fire tip — гар утсаараа нэг товчоор.</p>
        </div>
      </header>

      <section className="section">
        <div className="container shop-layout">
          <div>
            <div className="shop-filters">
              {(['all', 'merch', 'digital', 'tip'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  className={filter === f ? 'active' : ''}
                  onClick={() => setFilter(f)}
                >
                  {f === 'all' ? 'Бүгд' : f}
                </button>
              ))}
            </div>

            <SponsorSlot slot="shop" />

            <div className="shop-grid">
              {products.map((p) => (
                <article key={p.id} className="shop-card">
                  <div className="shop-card-img">
                    <img src={p.image} alt="" loading="lazy" />
                    <span>{p.type}</span>
                  </div>
                  <div className="shop-card-body">
                    <h2>{p.name}</h2>
                    <p>{p.description}</p>
                    <div className="shop-card-row">
                      <strong>{tugrik(p.price)}</strong>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          addToCart(p.id)
                          setSheetOpen(true)
                        }}
                      >
                        Сагслах
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className={`shop-cart ${sheetOpen ? 'open' : ''}`}>
            <button
              type="button"
              className="sheet-close"
              aria-label="Хаах"
              onClick={() => setSheetOpen(false)}
            >
              <span />
            </button>
            <h3>Сагс</h3>
            {lines.length === 0 ? (
              <p className="empty-note">Сагс хоосон.</p>
            ) : (
              <ul className="cart-list">
                {lines.map((l) => (
                  <li key={l.productId}>
                    <div>
                      <strong>{l.product.name}</strong>
                      <em>{tugrik(l.product.price)}</em>
                    </div>
                    <div className="qty">
                      <button type="button" onClick={() => setCartQty(l.productId, l.qty - 1)}>
                        −
                      </button>
                      <span>{l.qty}</span>
                      <button type="button" onClick={() => setCartQty(l.productId, l.qty + 1)}>
                        +
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="cart-total">
              <span>Нийт</span>
              <strong>{tugrik(total)}</strong>
            </div>

            <form className="checkout-form" onSubmit={onCheckout}>
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
              <button type="submit" className="btn btn-primary btn-block" disabled={!lines.length}>
                Төлөх · {method.toUpperCase()}
              </button>
              {lines.length > 0 && (
                <button type="button" className="btn btn-ghost btn-block" onClick={clearCart}>
                  Сагс цэвэрлэх
                </button>
              )}
            </form>
            {result && <p className="checkout-result">{result}</p>}
            <p className="pay-note">* Төлбөр demo горим — бодит QPay/SocialPay дараа холбогдоно.</p>
          </aside>
        </div>

        <div
          className={`sheet-scrim ${sheetOpen ? 'on' : ''}`}
          onClick={() => setSheetOpen(false)}
        />
        <button
          type="button"
          className="mobile-sheet-fab"
          onClick={() => setSheetOpen(true)}
        >
          Сагс {lines.length > 0 && <em>{lines.reduce((s, l) => s + l.qty, 0)}</em>}
        </button>
      </section>
    </div>
  )
}

export function MembershipPage() {
  const { user, isMember, membershipTier, activateMembership } = useAuth()
  const [done, setDone] = useState<string | null>(null)

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
