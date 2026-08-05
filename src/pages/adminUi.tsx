import {
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react'

export type FieldType = 'text' | 'textarea' | 'number' | 'select' | 'checkbox' | 'url'

export type FieldDef = {
  key: string
  label: string
  type?: FieldType
  placeholder?: string
  options?: { value: string; label: string }[]
  half?: boolean
  required?: boolean
}

export type ToastState = { text: string; error?: boolean } | null

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
    if (f.half && fields[i + 1]?.half) {
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

  const submit = (e: FormEvent) => {
    e.preventDefault()
    for (const f of fields.filter((x) => x.required)) {
      const v = values[f.key]
      if (v === undefined || v === null || String(v).trim() === '') return
    }
    onSave(values)
  }

  return (
    <Modal title={title} subtitle={subtitle} onClose={onClose}>
      <form className="admin-form" onSubmit={submit}>
        <FormFields fields={fields} values={values} setValues={setValues} />
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
