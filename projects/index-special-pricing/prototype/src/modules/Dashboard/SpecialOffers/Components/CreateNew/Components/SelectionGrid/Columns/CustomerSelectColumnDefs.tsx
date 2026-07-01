import { CheckboxColumn } from '@components/shared/Grid/sharedColumnDefs/CheckboxColumn'
import { StarFilled, StarOutlined } from '@ant-design/icons'
import { BBDTag, GraviButton, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { EligibleCounterPartyGroupTag } from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { ColDef } from 'ag-grid-community'
import { Popover } from 'antd'
import React, { type MutableRefObject } from 'react'

export function CustomerSelectColumnDefs(
  isInternalUser?: boolean,
  favoritesRef?: MutableRefObject<Set<number>>,
  onToggleFavorite?: (id: number) => void,
  // The quick-create picker's filters (groups / authorized / credit) read from these columns,
  // so it always shows them — independent of the internal-user gate the wizard uses.
  forPicker?: boolean
) {
  const columns: ColDef[] = []
  // Leftmost star-pin column — only when the favorites plumbing is wired (quick-create).
  if (favoritesRef && onToggleFavorite) columns.push(FavoriteColumn(favoritesRef, onToggleFavorite))
  columns.push(CheckboxColumn('CounterPartyId'), NameColumn(), AuthorizedColumn())
  if (isInternalUser || forPicker) {
    columns.push(GroupsColumn(), CurrentStatusColumn(), AvailableCreditColumn())
  }
  return columns as ColDef[]
}

// Star-pin a customer as a standing "favorite" — separate from the selection checkbox.
// Reads the live favoritesRef (not a captured value) so AG-Grid's cached renderer reflects
// toggles after a refreshCells({columns:['__favorite'], force:true}). See QuickCreateSpecialOffer.
function FavoriteColumn(
  favoritesRef: MutableRefObject<Set<number>>,
  onToggleFavorite: (id: number) => void
): ColDef {
  return {
    colId: '__favorite',
    headerName: '',
    pinned: 'left',
    minWidth: 44,
    maxWidth: 44,
    sortable: false,
    filter: false,
    suppressMenu: true,
    cellStyle: { padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    cellRenderer: ({ data }: { data: { CounterPartyId?: number } }) => {
      const id = data?.CounterPartyId
      if (id == null) return null
      const on = favoritesRef.current.has(id)
      return (
        <GraviButton
          className={'ghost-gravi-button qc-fav-btn'}
          icon={on ? <StarFilled style={{ color: '#FAAD14' }} /> : <StarOutlined />}
          onClick={(e: { stopPropagation?: () => void }) => {
            e?.stopPropagation?.()
            onToggleFavorite(id)
          }}
        />
      )
    },
  }
}

function NameColumn(): ColDef {
  return {
    headerName: 'Counterparty',
    field: 'Name',
  }
}

function AuthorizedColumn(): ColDef {
  return {
    headerName: 'Authorized',
    valueGetter: ({ data }) => (data?.IsAuthorized ? 'Yes' : 'No'),
    filter: 'agSetColumnFilter',
  }
}

function GroupsColumn(): ColDef {
  return {
    headerName: 'Groups',
    field: 'AssociatedGroupTags',
    minWidth: 200,
    autoHeight: true,
    valueGetter: ({ data }) => {
      const groups: EligibleCounterPartyGroupTag[] = data?.AssociatedGroupTags || []
      return groups.map((g) => g.TagName).sort((a, b) => a.localeCompare(b))
    },
    cellRenderer: ({ data }) => {
      const groups: EligibleCounterPartyGroupTag[] = data?.AssociatedGroupTags || []
      if (!groups || groups.length === 0) {
        return null
      }

      const sortedGroups = [...groups].sort((a, b) => a.TagName.localeCompare(b.TagName))
      if (sortedGroups?.length <= 2) {
        return (
          <Horizontal fullHeight verticalCenter style={{ gap: 4 }}>
            {sortedGroups.map((group) => (
              <BBDTag key={group.TagId}>{group.TagName}</BBDTag>
            ))}
          </Horizontal>
        )
      }

      return (
        <Popover
          placement='bottomLeft'
          content={
            <div style={{ maxHeight: '65vh', overflowY: 'auto' }}>
              {sortedGroups.map((group) => (
                <Horizontal key={group.TagId}>
                  <Texto>{group.TagName}</Texto>
                </Horizontal>
              ))}
            </div>
          }
        >
          MULTIPLE GROUPS ({sortedGroups.length})
        </Popover>
      )
    },
    filterParams: {
      valueFormatter: (params) => params.value,
    },
  }
}

function CurrentStatusColumn(): ColDef {
  return {
    headerName: 'Credit Status',
    field: 'CreditStatusDisplay',
  }
}

function AvailableCreditColumn(): ColDef {
  return {
    headerName: 'Available Credit',
    field: 'AvailableCredit',
    type: 'numericColumn',
    valueFormatter: ({ value }) => (value == null ? '' : fmt.currency(value, 0)),
  }
}
