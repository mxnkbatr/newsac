import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store/StoreContext'
import { useAuth } from '../context/AuthContext'
import './Widgets.css'

export function SponsorSlot({ slot }: { slot: 'home' | 'videos' | 'shop' }) {
  const { data, track } = useStore()
  const sponsor = data.sponsors.find((s) => s.active && s.slot === slot)
  if (!sponsor) return null

  return (
    <a
      className="sponsor-slot"
      href={sponsor.url}
      target="_blank"
      rel="noreferrer"
      onClick={() => track('sponsor_click', sponsor.id)}
    >
      <img src={sponsor.image} alt="" />
      <div>
        <span className="sponsor-kicker">Sponsor</span>
        <strong>{sponsor.name}</strong>
        <p>{sponsor.tagline}</p>
      </div>
    </a>
  )
}

export function PollWidget() {
  const { data, votePoll } = useStore()
  const { user, hasVotedPoll, markPollVoted } = useAuth()
  const poll = data.polls.find((p) => p.active)
  if (!poll) return null

  const total = poll.options.reduce((s, o) => s + o.votes, 0) || 1
  const voted = hasVotedPoll(poll.id)

  return (
    <div className="poll-widget">
      <div className="section-kicker">Санал асуулга</div>
      <h3>{poll.question}</h3>
      <div className="poll-options">
        {poll.options.map((o) => {
          const pct = Math.round((o.votes / total) * 100)
          return (
            <button
              key={o.id}
              type="button"
              className="poll-option"
              disabled={voted}
              onClick={() => {
                if (!user) {
                  window.location.href = '/auth'
                  return
                }
                votePoll(poll.id, o.id)
                markPollVoted(poll.id)
              }}
            >
              <div className="poll-option-top">
                <span>{o.label}</span>
                <em>{voted ? `${pct}%` : `${o.votes}`}</em>
              </div>
              <div className="poll-bar">
                <i style={{ width: voted ? `${pct}%` : '0%' }} />
              </div>
            </button>
          )
        })}
      </div>
      {!user && (
        <Link to="/auth" className="section-link">
          Санал өгөхийн тулд нэвтрэх →
        </Link>
      )}
    </div>
  )
}

export function NewsletterBox() {
  const { subscribe } = useStore()
  const [channel, setChannel] = useState<'email' | 'telegram'>('email')
  const [value, setValue] = useState('')
  const [msg, setMsg] = useState<string | null>(null)

  return (
    <div className="newsletter-box">
      <div className="section-kicker">Жагсаалт</div>
      <h3>Шинэ drop / бичлэг / шоу — шууд мэдэгдэл</h3>
      <p>YouTube algorithm-аас хамаарахгүйгээр имэйл эсвэл Telegram-аар ав.</p>
      <div className="newsletter-tabs">
        <button
          type="button"
          className={channel === 'email' ? 'active' : ''}
          onClick={() => setChannel('email')}
        >
          Имэйл
        </button>
        <button
          type="button"
          className={channel === 'telegram' ? 'active' : ''}
          onClick={() => setChannel('telegram')}
        >
          Telegram
        </button>
      </div>
      <form
        className="newsletter-form"
        onSubmit={(e) => {
          e.preventDefault()
          const err = subscribe(channel, value)
          setMsg(err || 'Амжилттай бүртгэгдлээ!')
          if (!err) setValue('')
        }}
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={channel === 'email' ? 'you@email.com' : '@username эсвэл утас'}
          required
        />
        <button type="submit" className="btn btn-primary">
          Бүртгүүлэх
        </button>
      </form>
      {msg && <p className="newsletter-msg">{msg}</p>}
    </div>
  )
}
