import { useEffect } from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import { SponsorSlot } from '../components/Widgets'
import { ShareButton } from '../components/ShareButton'
import { useStore } from '../store/StoreContext'
import './Pages.css'
import './Nba.css'
import './DeedLig.css'

const deedFilters = [
  {
    to: '/deed-lig/updates',
    label: 'Мэдээлэл',
    match: (p: string) => p === '/deed-lig' || p.startsWith('/deed-lig/updates'),
  },
  {
    to: '/deed-lig/clubs',
    label: 'Багууд',
    match: (p: string) => p.startsWith('/deed-lig/clubs'),
  },
]

function useDeedTitle(title: string) {
  useEffect(() => {
    document.title = `${title} · Newsac`
    return () => {
      document.title = 'Newsac'
    }
  }, [title])
}

function DeedPageFilter({ sticky = false }: { sticky?: boolean }) {
  const { pathname } = useLocation()

  return (
    <nav className={`nba-filter${sticky ? ' sticky' : ''}`} aria-label="Дээд Лиг хэсэг сонгох">
      <div className="nba-filter-rail">
        {deedFilters.map((f) => {
          const active = f.match(pathname)
          return (
            <Link
              key={f.to}
              to={f.to}
              className={`nba-filter-chip${active ? ' active' : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              {f.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

function DeedBack() {
  return (
    <Link to="/deed-lig/updates" className="nba-back">
      ← Дээд Лиг
    </Link>
  )
}

function DeedSubHead({
  kicker,
  title,
  desc,
}: {
  kicker: string
  title: string
  desc: string
}) {
  return (
    <header className="nba-subhero">
      <div className="container">
        <DeedBack />
        <DeedPageFilter sticky />
        <div className="section-kicker">{kicker}</div>
        <h1>{title}</h1>
        <p>{desc}</p>
      </div>
    </header>
  )
}

/** Дээд Лиг нүүр — NBA-тай ижил hub */
export function DeedLigPage() {
  useDeedTitle('Дээд Лиг')
  const { data } = useStore()
  const news = data.deedLigNews || []
  const clubs = data.deedLigClubs || []
  const featured = news[0]

  return (
    <div className="nba-page deed-lig-page">
      <header className="nba-hero">
        <div className="container nba-hero-grid">
          <div>
            <div className="section-kicker">Newsac · Basketball</div>
            <h1>Дээд Лиг</h1>
            <p>Доорх filter-оос хэсгээ сонгоод орно.</p>
            <DeedPageFilter />
          </div>
          {featured ? (
            <Link to={`/deed-lig/updates/${featured.id}`} className="nba-feature">
              <img src={featured.image} alt="" />
              <div className="nba-feature-shade" />
              <div className="nba-feature-copy">
                <span>
                  {featured.tag} · {featured.readMin} мин
                </span>
                <strong>{featured.title}</strong>
                <em>Бүрэн унших →</em>
              </div>
            </Link>
          ) : (
            <div className="nba-feature deed-feature-empty">
              <div className="nba-feature-shade" />
              <div className="nba-feature-copy">
                <span>Мэдээлэл</span>
                <strong>Дээд Лигийн мэдээ тун удахгүй</strong>
                <em>Админ панелиас нэмнэ</em>
              </div>
            </div>
          )}
        </div>
      </header>

      <section className="nba-section">
        <div className="container">
          <div className="nba-section-head">
            <div>
              <div className="section-kicker">Browse</div>
              <h2>Хэсэг сонгох</h2>
            </div>
            <p>Filter chip дарж солино</p>
          </div>
          <div className="nba-filter-hint">
            <p>
              <Link to="/deed-lig/updates">Мэдээлэл</Link>
              <span>{news.length} нийтлэл</span>
            </p>
            <p>
              <Link to="/deed-lig/clubs">Багууд</Link>
              <span>{clubs.length} нэр</span>
            </p>
          </div>
          <SponsorSlot slot="nba" alwaysShow />
        </div>
      </section>
    </div>
  )
}

export function DeedLigUpdatesPage() {
  useDeedTitle('Дээд Лиг мэдээлэл')
  const { data } = useStore()
  const news = data.deedLigNews || []

  return (
    <div className="nba-page deed-lig-page">
      <DeedSubHead
        kicker="Updates"
        title="Сүүлийн үеийн мэдээлэл"
        desc="Нийтлэл дээр дарж бүрэн уншина."
      />
      <section className="nba-section">
        <div className="container nba-list">
          {news.length ? (
            news.map((u) => (
              <Link key={u.id} to={`/deed-lig/updates/${u.id}`} className="nba-list-card">
                <img src={u.image} alt="" loading="lazy" />
                <div>
                  <span className="nba-update-tag">
                    {u.tag} · {u.readMin} мин · {u.when}
                  </span>
                  <h2>{u.title}</h2>
                  <p>{u.blurb}</p>
                </div>
                <ShareButton
                  variant="icon"
                  path={`/deed-lig/updates/${u.id}`}
                  title={u.title}
                  text={u.blurb}
                />
              </Link>
            ))
          ) : (
            <p className="deed-empty">Дээд Лигийн мэдээлэл тун удахгүй энд гарна.</p>
          )}
        </div>
      </section>
    </div>
  )
}

export function DeedLigUpdateDetailPage() {
  const { id } = useParams()
  const { data } = useStore()
  const item = (data.deedLigNews || []).find((u) => u.id === id)
  useDeedTitle(item?.title || 'Дээд Лиг')

  if (!item) {
    return <Navigate to="/deed-lig/updates" replace />
  }

  return (
    <div className="nba-page deed-lig-page">
      <article className="nba-article">
        <div className="container nba-article-inner">
          <DeedBack />
          <Link to="/deed-lig/updates" className="nba-crumb">
            ← Мэдээлэл
          </Link>
          <div className="nba-article-cover">
            <img src={item.image} alt="" />
          </div>
          <span className="nba-update-tag">
            {item.tag} · {item.readMin} мин · {item.when}
          </span>
          <h1>{item.title}</h1>
          <div className="detail-share">
            <ShareButton
              path={`/deed-lig/updates/${item.id}`}
              title={item.title}
              text={item.blurb}
            />
          </div>
          <p className="nba-article-lead">{item.blurb}</p>
          <div className="nba-article-body">
            {item.body.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>
        </div>
      </article>
    </div>
  )
}

export function DeedLigClubsPage() {
  useDeedTitle('Дээд Лиг багууд')
  const { data } = useStore()
  const clubs = data.deedLigClubs || []
  const players = data.deedLigPlayers || []

  return (
    <div className="nba-page deed-lig-page">
      <DeedSubHead
        kicker="Teams"
        title="Багууд"
        desc="Баг дээр дарж тоглогчдын мэдээлэл үзнэ."
      />
      <section className="nba-section">
        <div className="container">
          {clubs.length ? (
            <div className="deed-clubs">
              {clubs.map((c) => {
                const roster = players.filter((p) => p.clubId === c.id).length
                return (
                  <Link key={c.id} to={`/deed-lig/clubs/${c.id}`} className="deed-club">
                    {c.image ? <img src={c.image} alt="" className="deed-club-logo" /> : null}
                    <strong>{c.name}</strong>
                    <span>{c.city}</span>
                    <em>
                      {roster} тоглогч{c.arena ? ` · ${c.arena}` : ''}
                    </em>
                  </Link>
                )
              })}
            </div>
          ) : (
            <p className="deed-empty">Багийн мэдээлэл тун удахгүй.</p>
          )}
        </div>
      </section>
    </div>
  )
}

export function DeedLigClubDetailPage() {
  const { id } = useParams()
  const { data } = useStore()
  const club = (data.deedLigClubs || []).find((c) => c.id === id)
  const roster = (data.deedLigPlayers || []).filter((p) => p.clubId === id)
  useDeedTitle(club?.name || 'Баг')

  if (!club) {
    return <Navigate to="/deed-lig/clubs" replace />
  }

  return (
    <div className="nba-page deed-lig-page">
      <header className="nba-subhero">
        <div className="container">
          <DeedBack />
          <DeedPageFilter sticky />
          <Link to="/deed-lig/clubs" className="nba-crumb">
            ← Багууд
          </Link>
          <div className="section-kicker">{club.city}</div>
          <h1>{club.name}</h1>
          <p>
            {[club.arena, club.founded ? `Байгуулагдсан ${club.founded}` : '', `${roster.length} тоглогч`]
              .filter(Boolean)
              .join(' · ')}
          </p>
          {club.blurb ? <p className="deed-club-blurb">{club.blurb}</p> : null}
        </div>
      </header>

      <section className="nba-section">
        <div className="container">
          <div className="nba-section-head">
            <div>
              <div className="section-kicker">Roster</div>
              <h2>Тоглогчид</h2>
            </div>
          </div>

          {roster.length ? (
            <div className="deed-players">
              {roster.map((p) => (
                <article key={p.id} className="deed-player">
                  {p.image ? (
                    <img src={p.image} alt="" className="deed-player-photo" />
                  ) : (
                    <div className="deed-player-photo is-empty" aria-hidden="true">
                      {p.number || '·'}
                    </div>
                  )}
                  <div className="deed-player-body">
                    <div className="deed-player-top">
                      <strong>{p.name}</strong>
                      {p.number ? <span className="deed-player-num">#{p.number}</span> : null}
                    </div>
                    <ul className="deed-player-stats">
                      {p.position ? <li>Байрлал · {p.position}</li> : null}
                      {p.height ? <li>Өндөр · {p.height}</li> : null}
                      {p.age ? <li>Нас · {p.age}</li> : null}
                      {p.hometown ? <li>Төрсөн · {p.hometown}</li> : null}
                    </ul>
                    {p.note ? <p>{p.note}</p> : null}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="deed-empty">Энэ клубын тоглогчид тун удахгүй нэмэгдэнэ.</p>
          )}
        </div>
      </section>
    </div>
  )
}

/** Хуучин /deed-lig/:id холбоосыг шинэ замаар чиглүүлнэ */
export function DeedLigLegacyDetailRedirect() {
  const { id } = useParams()
  if (!id || id === 'updates' || id === 'clubs') {
    return <Navigate to="/deed-lig" replace />
  }
  return <Navigate to={`/deed-lig/updates/${id}`} replace />
}
