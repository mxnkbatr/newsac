import {
  useEffect,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from 'react'
import { ImageCropper } from '../components/ImageCropper'
import { uploadPublicImage } from '../lib/mediaUpload'
import { supabaseConfigured } from '../lib/supabase'

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'checkbox'
  | 'url'
  | 'image'

export type FieldDef = {
  key: string
  label: string
  type?: FieldType
  placeholder?: string
  options?: { value: string; label: string }[]
  half?: boolean
  required?: boolean
  /** width / height, e.g. 3/4 for portraits */
  cropAspect?: number
  previewAspect?: string
}

export type ToastState = { text: string; error?: boolean } | null

/** Phone gallery/camera → Supabase Storage URL, or compressed data URL fallback */
function fileToCompressedDataUrl(file: File, maxSide = 1400, quality = 0.78): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('read failed'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('image failed'))
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height))
        const w = Math.max(1, Math.round(img.width * scale))
        const h = Math.max(1, round(img.height * scale))
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('canvas'))
          return
        }
        ctx.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = String(reader.result)
    }
    reader.readAsDataURL(file)
  })
}

function round(n: number) {
  return Math.max(1, Math.round(n))
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('read failed'))
    reader.onload = () => resolve(String(reader.result || ''))
    reader.readAsDataURL(file)
  })
}

async function resolveImageFile(file: File): Promise<string> {
  if (supabaseConfigured) {
    try {
      return await uploadPublicImage(file)
    } catch {
      /* fall back to data URL if storage bucket missing */
    }
  }
  try {
    return await fileToCompressedDataUrl(file)
  } catch {
    return readFileAsDataUrl(file)
  }
}

export function Toast({ toast }: { toast: ToastState }) {
  if (!toast) return null
  return (
    <div className={`admin-toast${toast.error ? ' is-error' : ''}`} role="status">
      {toast.text}
    </div>
  )
}

export function Modal({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string
  subtitle?: string
  onClose: () => void
  children: ReactNode
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="admin-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="admin-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-modal-head">
          <div>
            <h3 id="admin-modal-title">{title}</h3>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button type="button" className="admin-modal-close" onClick={onClose} aria-label="Хаах">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function ImageField({
  def,
  value,
  onChange,
}: {
  def: FieldDef
  value: string | number | boolean
  onChange: (v: string | number | boolean) => void
}) {
  return (
    <PhotoPicker
      id={def.key}
      label={def.label}
      value={String(value || '')}
      onChange={(url) => onChange(url)}
      placeholder={def.placeholder}
      required={def.required}
      cropAspect={def.cropAspect}
      previewAspect={def.previewAspect}
    />
  )
}

export function PhotoPicker({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
  cropAspect,
  previewAspect,
}: {
  id: string
  label: string
  value: string
  onChange: (url: string) => void
  placeholder?: string
  required?: boolean
  cropAspect?: number
  previewAspect?: string
}) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [cropSrc, setCropSrc] = useState<string | null>(null)

  const upload = (file: File) => {
    setBusy(true)
    setErr(null)
    void resolveImageFile(file)
      .then((url) => onChange(url))
      .catch((ex: unknown) => {
        setErr(ex instanceof Error ? ex.message : 'Зураг оруулж чадсангүй')
      })
      .finally(() => setBusy(false))
  }

  const pick = (file: File | undefined) => {
    if (!file) return
    if (cropAspect) {
      setCropSrc(URL.createObjectURL(file))
      return
    }
    upload(file)
  }

  const closeCrop = () => {
    if (cropSrc) URL.revokeObjectURL(cropSrc)
    setCropSrc(null)
  }

  const previewStyle: CSSProperties | undefined = previewAspect
    ? { aspectRatio: previewAspect, maxWidth: previewAspect === '3 / 4' ? 220 : undefined }
    : undefined

  return (
    <div className="admin-field admin-field-image">
      <span className="admin-field-label">
        {label}
        {required ? ' *' : ''}
      </span>
      {value ? (
        <div className="admin-image-preview" style={previewStyle}>
          <img src={value} alt="" />
        </div>
      ) : (
        <div className="admin-image-preview is-empty" style={previewStyle}>
          Photos
        </div>
      )}
      <div className="admin-image-actions">
        <label className={`admin-image-pick${busy ? ' is-busy' : ''}`}>
          <input
            id={`f-${id}-gallery`}
            type="file"
            accept="image/*"
            disabled={busy}
            onChange={(e) => {
              pick(e.target.files?.[0])
              e.target.value = ''
            }}
          />
          {busy ? 'Илгээж байна…' : cropAspect ? 'Photos-оос сонгоод тайрах' : 'Photos-оос сонгох'}
        </label>
        <label className={`admin-image-pick is-camera${busy ? ' is-busy' : ''}`}>
          <input
            id={`f-${id}-camera`}
            type="file"
            accept="image/*"
            capture="environment"
            disabled={busy}
            onChange={(e) => {
              pick(e.target.files?.[0])
              e.target.value = ''
            }}
          />
          Камер
        </label>
      </div>
      {cropAspect ? (
        <p className="admin-field-hint">Босоо 3:4 хүрээнд чирж, томруулаад тайрна. Бүх хөрөг ижил хэмжээтэй.</p>
      ) : null}
      {err ? <p className="admin-field-error">{err}</p> : null}
      <details className="admin-image-url">
        <summary>эсвэл холбоос / URL</summary>
        <input
          id={`f-${id}`}
          type="url"
          value={value.startsWith('data:') ? '' : value}
          placeholder={placeholder || 'https://...'}
          onChange={(e) => onChange(e.target.value)}
        />
      </details>
      {cropSrc && cropAspect ? (
        <ImageCropper
          src={cropSrc}
          aspect={cropAspect}
          onCancel={closeCrop}
          onConfirm={(file) => {
            closeCrop()
            upload(file)
          }}
        />
      ) : null}
    </div>
  )
}

function Field({
  def,
  value,
  onChange,
}: {
  def: FieldDef
  value: string | number | boolean
  onChange: (v: string | number | boolean) => void
}) {
  const type = def.type || 'text'
  if (type === 'checkbox') {
    return (
      <label className="admin-check">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
        />
        {def.label}
      </label>
    )
  }

  if (type === 'image') {
    return <ImageField def={def} value={value} onChange={onChange} />
  }

  return (
    <div className="admin-field">
      <label htmlFor={`f-${def.key}`}>{def.label}</label>
      {type === 'textarea' ? (
        <textarea
          id={`f-${def.key}`}
          value={String(value ?? '')}
          placeholder={def.placeholder}
          required={def.required}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : type === 'select' ? (
        <select
          id={`f-${def.key}`}
          value={String(value ?? '')}
          required={def.required}
          onChange={(e) => onChange(e.target.value)}
        >
          {(def.options || []).map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={`f-${def.key}`}
          type={type === 'number' ? 'number' : type === 'url' ? 'url' : 'text'}
          value={value === undefined || value === null ? '' : String(value)}
          placeholder={def.placeholder}
          required={def.required}
          onChange={(e) =>
            onChange(type === 'number' ? Number(e.target.value) : e.target.value)
          }
        />
      )}
    </div>
  )
}

export function FormFields({
  fields,
  values,
  setValues,
}: {
  fields: FieldDef[]
  values: Record<string, string | number | boolean>
  setValues: (next: Record<string, string | number | boolean>) => void
}) {
  const rows: FieldDef[][] = []
  for (let i = 0; i < fields.length; i++) {
    const f = fields[i]
    if (f.type === 'image') {
      rows.push([f])
      continue
    }
    if (f.half && fields[i + 1]?.half && fields[i + 1].type !== 'image') {
      rows.push([f, fields[i + 1]])
      i++
    } else {
      rows.push([f])
    }
  }

  return (
    <>
      {rows.map((row, idx) =>
        row.length === 2 ? (
          <div className="admin-field-row" key={idx}>
            {row.map((f) => (
              <Field
                key={f.key}
                def={f}
                value={values[f.key]}
                onChange={(v) => setValues({ ...values, [f.key]: v })}
              />
            ))}
          </div>
        ) : (
          <Field
            key={row[0].key}
            def={row[0]}
            value={values[row[0].key]}
            onChange={(v) => setValues({ ...values, [row[0].key]: v })}
          />
        ),
      )}
    </>
  )
}

export function EditorModal({
  title,
  subtitle,
  fields,
  initial,
  onClose,
  onSave,
}: {
  title: string
  subtitle?: string
  fields: FieldDef[]
  initial: Record<string, string | number | boolean>
  onClose: () => void
  onSave: (values: Record<string, string | number | boolean>) => void
}) {
  const [values, setValues] = useState(initial)
  const [formError, setFormError] = useState<string | null>(null)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    for (const f of fields.filter((x) => x.required)) {
      const v = values[f.key]
      if (v === undefined || v === null || String(v).trim() === '') {
        setFormError(`«${f.label}» заавал бөглөнө үү`)
        return
      }
    }
    setFormError(null)
    onSave(values)
  }

  return (
    <Modal title={title} subtitle={subtitle} onClose={onClose}>
      <form className="admin-form" onSubmit={submit}>
        <FormFields fields={fields} values={values} setValues={setValues} />
        {formError ? <p className="admin-field-error">{formError}</p> : null}
        <div className="admin-modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Болих
          </button>
          <button type="submit" className="btn btn-primary">
            Хадгалах
          </button>
        </div>
      </form>
    </Modal>
  )
}

export function EntityList({
  title,
  description,
  items,
  search,
  onSearch,
  onCreate,
  onEdit,
  onDelete,
  emptyText = 'Одоогоор хоосон',
  extra,
}: {
  title: string
  description?: string
  items: { id: string; label: string; meta?: string }[]
  search: string
  onSearch: (v: string) => void
  onCreate: () => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  emptyText?: string
  extra?: ReactNode
}) {
  const filtered = items.filter((i) => {
    const q = search.trim().toLowerCase()
    if (!q) return true
    return (
      i.label.toLowerCase().includes(q) || (i.meta || '').toLowerCase().includes(q)
    )
  })

  return (
    <div>
      <div className="admin-panel-head">
        <div>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        <button type="button" className="btn btn-primary" onClick={onCreate}>
          + Нэмэх
        </button>
      </div>
      {extra}
      <div className="admin-toolbar">
        <input
          className="admin-search"
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Хайх..."
        />
        <span className="admin-count">
          {filtered.length} / {items.length}
        </span>
      </div>
      {filtered.length === 0 ? (
        <div className="admin-empty">{emptyText}</div>
      ) : (
        <ul className="admin-list">
          {filtered.map((item) => (
            <li key={item.id}>
              <div className="admin-list-meta">
                <strong>{item.label}</strong>
                {item.meta && <span>{item.meta}</span>}
              </div>
              <div className="crud-actions">
                <button type="button" onClick={() => onEdit(item.id)}>
                  Засах
                </button>
                <button type="button" className="danger" onClick={() => onDelete(item.id)}>
                  Устгах
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
