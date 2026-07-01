import React from 'react'

// --- Quote Filter Bar -------------------------------------------------------
// Hi-fi implementation of the lo-fi "Quote Filter Bar" (design-system/lofi
// round-2). Same interaction model — high-frequency control as one-click chips,
// lower-frequency controls as dropdowns, removable filter tokens, always-visible
// result count + Clear all, sticky on scroll, and an honest zero-results state.
//
// Lo-fi → hi-fi note: the lo-fi modeled the high-frequency chips as lifecycle
// "Status" (Pending/Quoted/…). The QuoteBook data has no lifecycle-status field,
// so the chips bind to the real high-frequency field on the rows — Product —
// with Location as the dropdown and a counterparty search. The model is intact;
// only the bound fields changed. See HANDOFF.md.

export interface QuoteFilters {
  products: string[]
  location: string | null
  search: string
  sort: string
}

export const EMPTY_QUOTE_FILTERS: QuoteFilters = {
  products: [],
  location: null,
  search: '',
  sort: 'product',
}

export const SORT_OPTIONS = [
  { value: 'product', label: 'Product (A–Z)' },
  { value: 'price-desc', label: 'Price (high → low)' },
  { value: 'price-asc', label: 'Price (low → high)' },
  { value: 'counterparty', label: 'Counterparty (A–Z)' },
]

export function quoteFiltersActive(f: QuoteFilters): boolean {
  return f.products.length > 0 || !!f.location || f.search.trim().length > 0
}

interface Props {
  productOptions: string[]
  locationOptions: string[]
  value: QuoteFilters
  onChange: (next: QuoteFilters) => void
  totalCount: number
  filteredCount: number
}

const C = {
  primary: '#2563eb',
  primarySoftBg: '#eff6ff',
  primarySoftBorder: '#bfdbfe',
  border: '#d1d5db',
  borderLight: '#e5e7eb',
  text: '#111827',
  textMuted: '#6b7280',
  surface: '#ffffff',
  surfaceAlt: '#f9fafb',
}

export function QuoteFilterBar({
  productOptions,
  locationOptions,
  value,
  onChange,
  totalCount,
  filteredCount,
}: Props) {
  const active = quoteFiltersActive(value)

  const toggleProduct = (p: string) => {
    const has = value.products.includes(p)
    onChange({ ...value, products: has ? value.products.filter((x) => x !== p) : [...value.products, p] })
  }
  const clearAll = () => onChange({ ...EMPTY_QUOTE_FILTERS, sort: value.sort })

  const chip = (label: string, selected: boolean, onClick: () => void) => (
    <button
      key={label}
      type='button'
      onClick={onClick}
      style={{
        font: 'inherit',
        fontSize: 12,
        lineHeight: 1.4,
        padding: '4px 12px',
        borderRadius: 9999,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        border: `1px solid ${selected ? C.primary : C.border}`,
        background: selected ? C.primary : C.surface,
        color: selected ? '#fff' : C.text,
        fontWeight: selected ? 600 : 400,
      }}
    >
      {label}
    </button>
  )

  const selectStyle = (isSet: boolean): React.CSSProperties => ({
    font: 'inherit',
    fontSize: 12,
    padding: '5px 10px',
    borderRadius: 4,
    background: C.surface,
    color: isSet ? C.text : C.textMuted,
    border: `1px solid ${isSet ? C.primary : C.border}`,
    fontWeight: isSet ? 500 : 400,
    cursor: 'pointer',
  })

  const token = (label: string, onRemove: () => void) => (
    <span
      key={label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 12,
        background: C.primarySoftBg,
        border: `1px solid ${C.primarySoftBorder}`,
        color: '#1e40af',
        borderRadius: 9999,
        padding: '3px 8px 3px 10px',
      }}
    >
      {label}
      <span
        role='button'
        onClick={onRemove}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 15,
          height: 15,
          borderRadius: '50%',
          background: C.primarySoftBorder,
          color: '#1e40af',
          fontSize: 10,
          cursor: 'pointer',
        }}
      >
        ✕
      </span>
    </span>
  )

  return (
    <div
      className='quotebook-filter-bar'
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 6,
        background: C.surfaceAlt,
        borderBottom: `1px solid ${C.borderLight}`,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
          padding: '10px 16px',
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: C.textMuted }}>
          Product
        </span>
        <span style={{ display: 'inline-flex', gap: 4, flexWrap: 'wrap' }}>
          {chip('All', value.products.length === 0, () => onChange({ ...value, products: [] }))}
          {productOptions.map((p) => chip(p, value.products.includes(p), () => toggleProduct(p)))}
        </span>

        <select
          style={selectStyle(!!value.location)}
          value={value.location ?? ''}
          onChange={(e) => onChange({ ...value, location: e.target.value || null })}
        >
          <option value=''>Location: All</option>
          {locationOptions.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        <input
          placeholder='Search counterparty…'
          value={value.search}
          onChange={(e) => onChange({ ...value, search: e.target.value })}
          style={{ ...selectStyle(value.search.trim().length > 0), minWidth: 180 }}
        />

        <select
          style={selectStyle(false)}
          value={value.sort}
          onChange={(e) => onChange({ ...value, sort: e.target.value })}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              Sort: {o.label}
            </option>
          ))}
        </select>

        <span style={{ flex: 1 }} />

        <span style={{ fontSize: 12, color: C.textMuted }}>
          {active ? (
            <>
              <b style={{ color: C.text }}>{filteredCount}</b> of {totalCount} quotes
            </>
          ) : (
            <>
              <b style={{ color: C.text }}>{totalCount}</b> quotes
            </>
          )}
        </span>
        <button
          type='button'
          onClick={clearAll}
          disabled={!active}
          style={{
            font: 'inherit',
            fontSize: 12,
            border: 'none',
            background: 'none',
            cursor: active ? 'pointer' : 'default',
            color: active ? C.primary : C.border,
            padding: '4px 6px',
          }}
        >
          Clear all
        </button>
      </div>

      {active && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap',
            padding: '6px 16px 10px',
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: C.textMuted }}>
            Filters
          </span>
          {value.products.map((p) => token(p, () => toggleProduct(p)))}
          {value.location && token(value.location, () => onChange({ ...value, location: null }))}
          {value.search.trim() && token(`“${value.search.trim()}”`, () => onChange({ ...value, search: '' }))}
        </div>
      )}
    </div>
  )
}
