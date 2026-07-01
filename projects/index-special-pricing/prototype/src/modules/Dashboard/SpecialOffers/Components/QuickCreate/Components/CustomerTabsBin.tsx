import { useUser } from '@contexts/UserContext'
import { ArrowsAltOutlined, StarFilled } from '@ant-design/icons'
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import type {
  EligibleCounterParty,
  SpecialOfferMetadataResponseData,
} from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { useSpecialOffersTyped } from '@modules/Dashboard/SpecialOffers/Api/useSpecialOffersTyped'
import { CustomerSelectColumnDefs } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/Components/SelectionGrid/Columns/CustomerSelectColumnDefs'
import { SelectionGrid } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/Components/SelectionGrid/SelectionGrid'
import { SectionHeader } from '@modules/Dashboard/SpecialOffers/Components/QuickCreate/Components/SectionHeader'
import type { CustomerFilterState } from '@modules/Dashboard/SpecialOffers/utils/Constants/PresetConstants'
import type { GridApi } from 'ag-grid-community'
import { Checkbox, Form } from 'antd'
import type { FormInstance } from 'antd'
import { type MutableRefObject, useCallback, useEffect, useMemo } from 'react'

type CustomerRow = EligibleCounterParty & { IsAuthorized: boolean }

interface CustomerTabsBinProps {
  form: FormInstance
  isActive: boolean
  metadata?: SpecialOfferMetadataResponseData
  gridRef: MutableRefObject<GridApi<any> | undefined>
  selectedProductId?: number
  selectedLocationId?: number
  /** When provided (tight view only), renders the "Expand" max-view control in the header. */
  onOpenFullPicker?: () => void
  /** 'all' = max-view: the same picker blown out to fill a full-screen modal (grid fills height). */
  variant?: 'tabs' | 'all'
  /** Favorites (star-pin) — shared across both picker instances by the orchestrator. */
  favoriteIds?: number[]
  favoritesRef?: MutableRefObject<Set<number>>
  onToggleFavorite?: (id: number) => void
  /** Additive customer filters, lifted to the orchestrator so both picker instances + presets share them. */
  customerFilters: CustomerFilterState
  onChangeFilters: (next: CustomerFilterState) => void
}

export function CustomerTabsBin({
  form,
  isActive,
  metadata,
  gridRef,
  selectedProductId,
  selectedLocationId,
  onOpenFullPicker,
  variant = 'tabs',
  favoriteIds,
  favoritesRef,
  onToggleFavorite,
  customerFilters,
  onChangeFilters,
}: CustomerTabsBinProps) {
  const { user } = useUser()
  const isInternalUser = user?.Data?.AllowedImpersonationModes?.includes('All')
  const { getAuthorizedCounterPartyIds } = useSpecialOffersTyped()
  // ponytail: prototype fallback to the first product-location so "Authorized to lift" has rows
  // before a product is picked (the mock returns the same authorized set regardless of product).
  // Real backend: drop the fallback and let authorization gate on the actual selection.
  const firstPL = metadata?.ProductLocationSelections?.[0]
  const { data: authorizedIdsResponse } = getAuthorizedCounterPartyIds({
    productId: selectedProductId ?? firstPL?.ProductId,
    locationId: selectedLocationId ?? firstPL?.LocationId,
  })

  const { authorizedOnly, availableCredit } = customerFilters
  const setFilters = (patch: Partial<CustomerFilterState>) => onChangeFilters({ ...customerFilters, ...patch })

  const currentValue: number[] = Form.useWatch('CounterPartyIds', form) || []

  // Join the authorization-lookup result against the eligible-CP list (same derivation
  // the 4-step wizard's SelectCustomers uses) so each row carries IsAuthorized.
  const allRows: CustomerRow[] = useMemo(() => {
    const eligible = metadata?.EligibleCounterParties || []
    const authorizedSet = new Set(authorizedIdsResponse?.Data ?? [])
    return eligible.map((cp) => ({
      ...cp,
      IsAuthorized: cp.CounterPartyId != null && authorizedSet.has(cp.CounterPartyId),
    }))
  }, [metadata?.EligibleCounterParties, authorizedIdsResponse?.Data])

  const nameById = useMemo(() => {
    const map: Record<number, string> = {}
    allRows.forEach((r) => {
      if (r.CounterPartyId != null) map[r.CounterPartyId] = r.Name ?? `Customer ${r.CounterPartyId}`
    })
    return map
  }, [allRows])

  // Distinct group tags → member ids, for the group-filter chips.
  const groups = useMemo(() => {
    const map = new Map<number, { name: string; memberIds: number[] }>()
    allRows.forEach((r) => {
      ;(r.AssociatedGroupTags || []).forEach((g) => {
        if (g.TagId == null) return
        const entry = map.get(g.TagId) ?? { name: g.TagName ?? `Group ${g.TagId}`, memberIds: [] }
        if (r.CounterPartyId != null) entry.memberIds.push(r.CounterPartyId)
        map.set(g.TagId, entry)
      })
    })
    return Array.from(map.entries()).map(([id, v]) => ({ id, ...v }))
  }, [allRows])

  // Favorites that actually exist among the currently-eligible rows — never filter to a stale
  // (non-eligible) favorite.
  const eligibleFavoriteIds = useMemo(
    () => (favoriteIds ?? []).filter((id) => allRows.some((r) => r.CounterPartyId === id)),
    [favoriteIds, allRows]
  )
  // Filter-chip list with a synthetic "★ Favorites" group prepended when non-empty.
  const displayGroups = useMemo(
    () => [
      ...(eligibleFavoriteIds.length
        ? [{ id: '__favorites' as const, name: 'Favorites', memberIds: eligibleFavoriteIds }]
        : []),
      ...groups,
    ],
    [eligibleFavoriteIds, groups]
  )

  // The two filter toggles STACK on the one shared grid (not mutually-exclusive). Authorized
  // narrows to authorized-to-lift; Available credit drops On-Hold rows (keeping Good Standing +
  // Watch) and sorts by available credit. Group/Favorites chips never filter — they quick-select.
  const rowData: CustomerRow[] = useMemo(() => {
    let rows = allRows
    if (authorizedOnly) rows = rows.filter((r) => r.IsAuthorized)
    if (availableCredit) {
      rows = rows
        .filter((r) => r.CreditStatusDisplay !== 'On Hold')
        .sort((a, b) => (b.AvailableCredit ?? 0) - (a.AvailableCredit ?? 0))
    }
    return rows
  }, [allRows, authorizedOnly, availableCredit])

  const setSelection = useCallback(
    (ids: number[]) => {
      form.setFieldsValue({ CounterPartyIds: Array.from(new Set(ids)) })
    },
    [form]
  )

  // Merge grid selection so picks made under other filters (rows not in this view) are preserved.
  const handleFormChange = useCallback(
    (rows: CustomerRow[]) => {
      const viewIds = new Set(rowData.map((r) => r.CounterPartyId))
      const selectedInView = rows.map((r) => r.CounterPartyId).filter((id): id is number => id != null)
      const preserved = (form.getFieldValue('CounterPartyIds') || []).filter((id: number) => !viewIds.has(id))
      setSelection([...preserved, ...selectedInView])
    },
    [rowData, form, setSelection]
  )

  // Re-apply form selection onto the grid nodes whenever the view (rowData) changes OR the
  // selected ids change — so picks stay visibly checked across filters, and a preset that fills
  // CounterPartyIds shows its customers as checked here. getRowId keeps this cheap.
  useEffect(() => {
    if (!isActive) return
    const api = gridRef.current
    if (!api) return
    const idSet = new Set(form.getFieldValue('CounterPartyIds') || [])
    api.forEachNode((node) => {
      const id = node.data?.CounterPartyId
      const shouldSelect = id != null && idSet.has(id)
      if (node.isSelected() !== shouldSelect) node.setSelected(shouldSelect)
    })
  }, [rowData, isActive, gridRef, form, currentValue])

  // Group/Favorites chips are quick-SELECT: one click adds every member of the group to the
  // selection (then deselect individually via the grid checkbox or the chip-bin ×). Clicking a
  // group whose members are all already selected clears them. Replaces the old filter-then-
  // header-select-all flow, which wasn't actually saving the per-customer clicks it was meant to.
  const toggleGroupSelection = (memberIds: number[]) => {
    const current: number[] = form.getFieldValue('CounterPartyIds') || []
    const allSelected = memberIds.length > 0 && memberIds.every((id) => current.includes(id))
    if (allSelected) {
      const remove = new Set(memberIds)
      setSelection(current.filter((id) => !remove.has(id)))
    } else {
      setSelection([...current, ...memberIds])
    }
  }

  const removeOne = (id: number) => {
    const current: number[] = form.getFieldValue('CounterPartyIds') || []
    setSelection(current.filter((x) => x !== id))
  }

  // favoritesRef + onToggleFavorite are stable (a ref + a useCallback from the orchestrator), so
  // keep deps to [isInternalUser] only — rebuilding columns on every star toggle would flicker the
  // grid and drop scroll. Star repaints come from refreshCells in the orchestrator, not a rebuild.
  const colDefFunc = useCallback(
    () => CustomerSelectColumnDefs(isInternalUser, favoritesRef, onToggleFavorite, true),
    [isInternalUser] // eslint-disable-line react-hooks/exhaustive-deps
  )

  // Right-size the embedded grid to its rows; the full-page picker ('all') keeps a tall grid.
  const tabGridHeight = Math.min(360, 100 + rowData.length * 35)

  // Group/Favorites quick-SELECT chips (incl. the synthetic ★ Favorites). Clicking selects the
  // whole group; active = every member is currently selected (clicking again clears them).
  const groupChips = (
    <Horizontal style={{ flexWrap: 'wrap', gap: 8 }}>
      {displayGroups.map((g) => {
        const isFav = g.id === '__favorites'
        const isActive = g.memberIds.length > 0 && g.memberIds.every((id) => currentValue.includes(id))
        return (
          <span
            key={g.id}
            className={`qc-groupchip${isActive ? ' is-active' : ''}${isFav ? ' qc-favchip' : ''}`}
            tabIndex={0}
            role='button'
            aria-pressed={isActive}
            onClick={() => toggleGroupSelection(g.memberIds)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                toggleGroupSelection(g.memberIds)
              }
            }}
          >
            {isFav && <StarFilled style={{ color: '#FAAD14', marginRight: 4 }} />}
            {g.name} ({g.memberIds.length})
          </span>
        )
      })}
    </Horizontal>
  )

  // Filter bar — the two stacking toggles + the group/favorites quick-select chips. Shared by the
  // tight view and the max-view modal.
  const filterBar = (
    <Vertical style={{ gap: 8 }}>
      <Horizontal verticalCenter style={{ flexWrap: 'wrap', gap: 16 }}>
        <Checkbox checked={authorizedOnly} onChange={(e) => setFilters({ authorizedOnly: e.target.checked })}>
          Authorized to lift
        </Checkbox>
        <Checkbox checked={availableCredit} onChange={(e) => setFilters({ availableCredit: e.target.checked })}>
          Available credit
        </Checkbox>
      </Horizontal>
      {displayGroups.length === 0 ? (
        <Texto className={'text-14'} appearance={'hint'}>
          No customer groups set up yet — star anyone to start a Favorites group.
        </Texto>
      ) : (
        groupChips
      )}
    </Vertical>
  )

  // Header right-slot: the "View all customers" max-view control (tight view only). The selected
  // count lives next to the "Selected customers" bin title instead. The max-view modal instance
  // gets no onOpenFullPicker, so it shows nothing here.
  const headerExtra = onOpenFullPicker ? (
    <GraviButton
      className={'ghost-gravi-button'}
      icon={<ArrowsAltOutlined />}
      buttonText={'View all customers'}
      onClick={onOpenFullPicker}
    />
  ) : undefined

  return (
    <Vertical
      className={variant === 'all' ? 'p-4' : 'qc-section p-4'}
      style={{ display: isActive ? 'flex' : 'none', gap: 16 }}
    >
      {variant === 'all' ? (
        <SectionHeader
          title={'All customers'}
          subtitle={'Search, filter, and select anyone. Picks stack below and carry back to the offer.'}
          extra={headerExtra}
        />
      ) : (
        <SectionHeader title={'Customers'} extra={headerExtra} />
      )}

      {/* Selected-customers bin — filter-agnostic, with remove */}
      <Vertical className={'qc-chipbin p-2'} style={{ gap: 8 }}>
        <Horizontal verticalCenter className={'px-2'} style={{ gap: 8 }}>
          <Texto category={'label'} weight={'bold'}>
            Selected customers
          </Texto>
          <Texto category={'label'} appearance={'medium'}>
            {currentValue.length} selected
          </Texto>
        </Horizontal>
        <Horizontal className={'px-2 pb-1'} style={{ flexWrap: 'wrap', gap: 8 }}>
          {currentValue.length === 0 ? (
            <Texto className={'text-14'} appearance={'hint'}>
              Nobody selected yet — pick from the list below.
            </Texto>
          ) : (
            currentValue.map((id) => (
              <span key={id} className={'qc-chip'}>
                {nameById[id] ?? `Customer ${id}`}
                <button
                  type='button'
                  className={'qc-chip-x'}
                  aria-label={`Remove ${nameById[id] ?? id}`}
                  onClick={() => removeOne(id)}
                >
                  ×
                </button>
              </span>
            ))
          )}
        </Horizontal>
      </Vertical>

      {filterBar}

      <SelectionGrid
        rowData={rowData}
        handleFormChange={handleFormChange}
        idField={'CounterPartyId'}
        colDefFunc={colDefFunc}
        rowSelection={'multiple'}
        currentValue={currentValue}
        gridRef={gridRef}
        storageKey={variant === 'all' ? 'QuickCreate-AllCustomers-Grid-v2' : 'QuickCreate-SelectionGrid-Customers-v2'}
        sideBar={variant === 'all' ? undefined : false}
        // Max-view: an explicit tall height so the grid sits right under the filters (no dead gap)
        // and AG gets a definite height to render into. Tight view stays row-count-sized.
        height={variant === 'all' ? '62vh' : tabGridHeight}
      />

      {/* Validation Form.Item lives with the canonical (tabs) instance; the all-grid picker is a
          secondary surface writing the same field, and renders outside a Form, so skip it there. */}
      {variant !== 'all' && (
        <Form.Item name='CounterPartyIds' rules={[{ required: true, message: 'Select at least one customer' }]}>
          <div />
        </Form.Item>
      )}
    </Vertical>
  )
}
