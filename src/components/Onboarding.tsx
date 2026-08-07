import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Onboarding.css'

const STORAGE_KEY = 'newsac_onboarding_v1'

const slides = [
  {
    tag: 'Culture & Beyond',
    title: 'Дэлхийн ба Монголын энтертайнмент нэг дор',
    desc: '2019 оноос эхэлсэн хип хоп, хөгжмийн соёлын хэмнэлийг дижитал орон зайд хамгийн түрүүлж мэдэр.',
  },
  {
    tag: 'Exclusive Content',
    title: 'Зөвхөн мэдээ биш. Шинэ мэдрэмж.',
    desc: 'Эксклюзив ярилцлага, онцлох контент, подкаст болон арга хэмжээний тасалбарыг ганц товшилтоор.',
  },
  {
    tag: 'The Ecosystem',
    title: 'Уран бүтээлчид ба фанатуудын холбоос',
    desc: 'Энтертайнмент салбарын ирээдүйн экосистемд тавтай морил. Илүү хурдан, илүү ухаалаг.',
  },
] as const

function shouldShow() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== '1'
  } catch {
    return true
  }
}

function markDone() {
  try {
    localStorage.setItem(STORAGE_KEY, '1')
  } catch {
    /* ignore */
  }
}

export function Onboarding() {
  const [ready, setReady] = useState(false)
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (!shouldShow()) {
      setReady(true)
      return
    }

    const boot = () => {
      setOpen(true)
      setReady(true)
    }

    if (document.body.classList.contains('splash-done')) {
      boot()
      return
    }

    const obs = new MutationObserver(() => {
      if (document.body.classList.contains('splash-done')) {
        obs.disconnect()
        boot()
      }
    })
    obs.observe(document.body, { attributes: true, attributeFilter: ['class'] })

    const fallback = window.setTimeout(boot, 2200)
    return () => {
      obs.disconnect()
      window.clearTimeout(fallback)
    }
  }, [])

  function finish() {
    markDone()
    setLeaving(true)
    window.setTimeout(() => {
      setOpen(false)
      window.dispatchEvent(new Event('newsac-onboarding-done'))
    }, 380)
  }

  function next() {
    if (step >= slides.length - 1) {
      finish()
      return
    }
    setStep((s) => s + 1)
  }

  if (!ready || !open) return null

  const slide = slides[step]
  const last = step === slides.length - 1

  return (
    <div className={`onboard${leaving ? ' onboard-out' : ''}`} role="dialog" aria-modal="true" aria-label="Newsac танилцуулга">
      <div className="onboard-bg" aria-hidden="true">
        <div className="onboard-glow" />
        <div className="onboard-grain" />
      </div>

      <button type="button" className="onboard-skip" onClick={finish}>
        Алгасах
      </button>

      <div className="onboard-brand" aria-hidden="true">
        <img src="/logo.png" alt="" />
        <strong>Newsac</strong>
      </div>

      <div key={step} className="onboard-slide">
        <p className="onboard-tag">{slide.tag}</p>
        <h1>{slide.title}</h1>
        <p className="onboard-desc">{slide.desc}</p>
      </div>

      <div className="onboard-foot">
        <div className="onboard-dots" aria-hidden="true">
          {slides.map((_, i) => (
            <button
              key={slides[i].tag}
              type="button"
              className={i === step ? 'active' : ''}
              onClick={() => setStep(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {last ? (
          <div className="onboard-cta">
            <Link to="/auth" className="btn btn-primary onboard-btn" onClick={finish}>
              Newsac-д нэвтрэх
            </Link>
            <button type="button" className="btn btn-ghost onboard-btn" onClick={finish}>
              Get Started
            </button>
          </div>
        ) : (
          <button type="button" className="btn btn-primary onboard-btn" onClick={next}>
            Үргэлжлүүлэх
          </button>
        )}
      </div>
    </div>
  )
}
