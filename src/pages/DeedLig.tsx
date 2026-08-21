import { useEffect } from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import { ArticleBlocks } from '../components/ArticleBlocks'
import { ShareButton } from '../components/ShareButton'
import { useStore } from '../store/StoreContext'
import './Pages.css'
import './Nba.css'

const deedFilters = [
  {
    to: '/deed-lig',
    label: 'Мэдээлэл',
    match: (p: string) => p === '/deed-lig' || p.startsWith('/deed-lig/updates'),
  },
  {
    to: '/deed-lig/clubs',
    label: 'Клубууд',
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
        <DeedPageFilter sticky />
        <div className="section-kicker">{kicker}</div>
        <h1>{title}</h1>
        <p>{desc}</p>
      </div>
    </header>
  )
}

export function DeedLigPage() {
  useDeedTitle('Дээд Лиг мэдээлэл')
  const { data } = useStore()
  const news = data.deedLigNews || []

  return (
    <div className="nba-page">
      <DeedSubHead
        kicker="Дээд Лиг"
        title="Мэдээ мэдээлэл"
        desc="Нийтлэл дээр дарж бүрэн уншина."
      />
      <section className="nba-section">
        <div className="container nba-list">
          {news.length === 0 ? (
            <p className="empty-note">Дээд Лигийн мэдээлэл тун удахгүй энд гарна.</p>
          ) : (
            news.map((u) => (
              <div key={u.id} className="share-card">
                <Link to={`/deed-lig/updates/${u.id}`} className="nba-list-card">
                  <img src={u.image} alt="" loading="lazy" />
                  <div>
                    <span className="nba-update-tag">
                      {u.tag} · {u.readMin} мин · {u.when}
                    </span>
                    <h2>{u.title}</h2>
                    <p>{u.blurb}</p>
                  </div>
                </Link>
                <ShareButton
                  variant="icon"
                  title={u.title}
                  text={u.blurb}
                  path={`/deed-lig/updates/${u.id}`}
                />
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}

export function DeedLigClubsPage() {
  useDeedTitle('Дээд Лиг клубууд')
  const { data } = useStore()
  const clubs = [...(data.deedLigClubs || [])].sort((a, b) => a.rank - b.rank)

  return (
    <div className="nba-page">
      <DeedSubHead
        kicker="Дээд Лиг"
        title="Клубууд"
        desc="Үндэсний Дээд лигийн клубууд — хотоор."
      />
      <section className="nba-section">
        <div className="container nba-list">
          {clubs.length === 0 ? (
            <p className="empty-note">Клуб нэмэгдээгүй байна.</p>
          ) : (
            clubs.map((c) => (
              <article
                key={c.id}
                className={`nba-list-card${c.image ? '' : ' nba-list-card-plain'}`}
              >
                {c.image ? (
                  <img src={c.image} alt="" loading="lazy" />
                ) : (
                  <span className="nba-update-tag">{String(c.rank).padStart(2, '0')}</span>
                )}
                <div>
                  <h2>{c.name}</h2>
                  <p>{c.city}</p>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  )
}

export function DeedLigDetailPage() {
  const { id } = useParams()
  const { data } = useStore()
  const item = (data.deedLigNews || []).find((u) => u.id === id)
  useDeedTitle(item?.title || 'Дээд Лиг')

  if (!item) {
    return <Navigate to="/deed-lig" replace />
  }

  return (
    <div className="nba-page">
      <article className="nba-article">
        <div className="container nba-article-inner">
          <Link to="/deed-lig" className="nba-back">
            ← Мэдээлэл
          </Link>
          <DeedPageFilter />
          <div className="nba-article-cover">
            <img src={item.image} alt="" />
          </div>
          <span className="nba-update-tag">
            {item.tag} · {item.readMin} мин · {item.when}
          </span>
          <h1>{item.title}</h1>
          <p className="nba-article-lead">{item.blurb}</p>
          <div className="detail-share">
            <ShareButton
              title={item.title}
              text={item.blurb}
              path={`/deed-lig/updates/${item.id}`}
            />
          </div>
          <div className="nba-article-body">
            <ArticleBlocks lines={item.body} midSrc={item.midImage} />
          </div>
        </div>
      </article>
    </div>
  )
}

/** Хуучин /deed-lig/:id холбоосыг шинэ зам руу */
export function DeedLigLegacyRedirect() {
  const { id } = useParams()
  const { data } = useStore()
  const exists = (data.deedLigNews || []).some((u) => u.id === id)
  if (exists && id) return <Navigate to={`/deed-lig/updates/${id}`} replace />
  return <Navigate to="/deed-lig" replace />
}
