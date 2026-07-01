import { Texto, Vertical } from '@gravitate-js/excalibrr'
import React from 'react'

export function GridTitle({
  isBulkMode,
  counterpartyName,
  itemName,
}: {
  isBulkMode: boolean
  counterpartyName: string
  itemName: string
}) {
  return (
    <Vertical>
      <Texto>
        {isBulkMode
          ? `Configure ${itemName} for Multiple Counterparties`
          : `Configure ${itemName} for ${counterpartyName}`}
      </Texto>
      <Texto style={{ fontSize: '12px' }} appearance='medium'>
        Select the {itemName.toLowerCase()} that this counterparty should receive pricing for. Use filters to quickly
        find {itemName.toLowerCase()}.
      </Texto>
    </Vertical>
  )
}
