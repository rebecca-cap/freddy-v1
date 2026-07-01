import { CheckboxColumn } from '@components/shared/Grid/sharedColumnDefs/CheckboxColumn'
import { BBDTag, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { EligibleCounterPartyGroupTag } from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { ColDef } from 'ag-grid-community'
import { Popover } from 'antd'
import React from 'react'

export function CustomerSelectColumnDefs(isInternalUser?: boolean) {
  const columns = [CheckboxColumn('CounterPartyId'), NameColumn(), AuthorizedColumn()]
  if (isInternalUser) {
    columns.push(GroupsColumn(), CurrentStatusColumn(), AvailableCreditColumn())
  }
  return columns as ColDef[]
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
          <Horizontal gap={4} fullHeight verticalCenter>
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
    headerName: 'Current Status',
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
