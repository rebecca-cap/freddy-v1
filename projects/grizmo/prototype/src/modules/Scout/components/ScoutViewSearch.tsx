// ScoutViewSearch — shared search input, parameterized by view
// ('library' | 'activity'). Both views share the search treatment under
// `state.search[view]`. (The library's "Starred only" filter lives on the
// labeled ★ Favorites chip in ScoutLibrary, not here.)
//
// Search has a 150ms debounce: the input maintains a local value for snappy
// typing, then flushes to the store after the user pauses. Clearing flushes
// immediately. The component re-syncs its local value when the upstream store
// value changes externally (e.g., switching tabs and switching back).

import { CloseOutlined, SearchOutlined } from '@ant-design/icons'
import { useEffect, useRef, useState } from 'react'

import { useScout } from '../state/ScoutContext'

import './ScoutViewSearch.css'

export interface ScoutViewSearchProps {
  view: 'library' | 'activity'
  placeholder: string
}

const DEBOUNCE_MS = 150

export const ScoutViewSearch = ({
  view,
  placeholder,
}: ScoutViewSearchProps) => {
  const { state, actions } = useScout()
  const upstream = state.search[view]

  const [local, setLocal] = useState(upstream)
  const debounceRef = useRef<number | null>(null)

  // Re-sync local from upstream when the store value changes externally — e.g.
  // a sibling component clears the filter, or the user navigates away and back
  // and the upstream value is what we want to display.
  useEffect(() => {
    setLocal(upstream)
  }, [upstream])

  // Flush local → store after debounce window. Clearing the field via the ×
  // button bypasses the debounce (handled below).
  useEffect(() => {
    if (local === upstream) return undefined
    const id = window.setTimeout(() => {
      actions.setSearch(view, local)
    }, DEBOUNCE_MS)
    debounceRef.current = id
    return () => window.clearTimeout(id)
  }, [local, upstream, view, actions])

  const handleClear = () => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current)
      debounceRef.current = null
    }
    setLocal('')
    actions.setSearch(view, '')
  }

  return (
    <div className='scout-view-search'>
      <div className='scout-view-search__input-wrap'>
        <SearchOutlined className='scout-view-search__lead' />
        <input
          type='search'
          className='scout-view-search__input'
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          placeholder={placeholder}
          aria-label={`Search ${view}`}
        />
        {local ? (
          <button
            type='button'
            className='scout-view-search__clear'
            onClick={handleClear}
            aria-label='Clear search'
          >
            <CloseOutlined />
          </button>
        ) : null}
      </div>
    </div>
  )
}
