import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useStore } from '../store/StoreContext'
import { SponsorSlot } from '../components/Widgets'
import './Pages.css'
import './Battle.css'

export function BattlePage() {
  const { data, voteBattle, track } = useStore()
  const { user, hasVotedBattle, markBattleVoted, isMember, membershipTier } =
    useAuth()

  const battles = useMemo(
    () =>
      [...data.battles].sort(
        (a, b) => Number(b.status === 'open') - Number(a.status === 'open'),
      ),
    [data.battles],
  )

  function castVote(battleId: string, sideId: string) {
    if (!user) {
      window.location.href = '/auth'
      return
    }
    if (hasVotedBattle(battleId)) return
    const err = voteBattle(battleId, sideId)
    if (err) return
    markBattleVoted(battleId)
    track('battle_vote', `${battleId}:${sideId}`)
  }

  return (
    <div className="battle-page">
      <header className="page-hero">
        <div className="container">
          <div className="section-kicker">Cypher / Battle</div>
          <h1>Фэн санал</h1>
          <p>
            Долоо хоног тутмын cypher · ялагч Live слот авна.
            {isMember && membershipTier === 'vip'
              ? ' VIP Fan Pass — таны санал илүү жинтэй (дараагийн шатанд).'
              : ''}
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container battle-stack">
          {battles.length === 0 ? (
            <div className="battle-empty" role="status">
              <div className="battle-empty-mark" aria-hidden="true">
                <span />
                <span />
              </div>
              <p className="battle-empty-kicker">Cypher / Battle</p>
              <h2>Одоогоор battle байхгүй</h2>
              <p>
                Одоохондоо нээлттэй cypher алга. Шинэ battle нээгдэхэд энд фэн санал гарч ирнэ —
                дараагийн round-д бэлэн байгаарай.
              </p>
              <div className="battle-empty-actions">
                <Link to="/" className="btn btn-primary">
                  Нүүр рүү
                </Link>
                <Link to="/live" className="btn btn-ghost">
                  Live үзэх
                </Link>
              </div>
            </div>
          ) : (
            battles.map((battle) => {
            const total = battle.sides[0].votes + battle.sides[1].votes || 1
            const voted = user ? hasVotedBattle(battle.id) : false
            const closed =
              battle.status !== 'open' || +new Date(battle.endsAt) < Date.now()

            return (
              <article key={battle.id} className="battle-card">
                <div
                  className="battle-card-cover"
                  style={{ backgroundImage: `url(${battle.cover})` }}
                >
                  <div className="battle-card-shade" />
                  <div className="battle-card-head">
                    {battle.city && <span>{battle.city}</span>}
                    <strong>{closed ? 'ДУУССАН' : 'НЭЭЛТТЭЙ'}</strong>
                  </div>
                </div>
                <div className="battle-card-body">
                  <h2>{battle.title}</h2>
                  <p>{battle.subtitle}</p>
                  <p className="battle-ends">
                    Дуусах:{' '}
                    {new Date(battle.endsAt).toLocaleString('mn-MN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>

                  <div className="battle-sides">
                    {battle.sides.map((side) => {
                      const pct = Math.round((side.votes / total) * 100)
                      return (
                        <div key={side.id} className="battle-side">
                          <img src={side.image} alt="" />
                          <div className="battle-side-meta">
                            <h3>
                              {side.rapperId ? (
                                <Link to={`/rappers/${side.rapperId}`}>{side.name}</Link>
                              ) : (
                                side.name
                              )}
                            </h3>
                            <div className="battle-bar">
                              <i style={{ width: `${pct}%` }} />
                            </div>
                            <span>
                              {side.votes.toLocaleString('mn-MN')} · {pct}%
                            </span>
                            <button
                              type="button"
                              className="btn btn-primary"
                              disabled={closed || voted}
                              onClick={() => castVote(battle.id, side.id)}
                            >
                              {!user
                                ? 'Нэвтэрч санал өгөх'
                                : voted
                                  ? 'Санал өгсөн'
                                  : closed
                                    ? 'Хаагдсан'
                                    : 'Санал өгөх'}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </article>
            )
          })
          )}
          <SponsorSlot slot="battle" alwaysShow />
        </div>
      </section>
    </div>
  )
}
