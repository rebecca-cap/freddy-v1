import { Texto } from '@gravitate-js/excalibrr'
import React from 'react'

export type OrderAction = 'Withdraw' | 'Accept'

export const typeFilterParams = {
  filterOptions: [
    'empty',
    {
      displayKey: 'index',
      displayName: 'Index',
      predicate: (_, cellValue) => cellValue === 'Index',
      numberOfInputs: 0,
    },
    {
      displayKey: 'bid',
      displayName: 'Bid',
      predicate: (_, cellValue) => cellValue === 'Bid',
      numberOfInputs: 0,
    },
    {
      displayKey: 'market',
      displayName: 'Market',
      predicate: (_, cellValue) => cellValue === 'Market',
      numberOfInputs: 0,
    },
  ],
  maxNumConditions: 0,
}

export const orderOriginTypeFilterParams = {
  filterOptions: [
    'empty',
    {
      displayKey: 'marketplace',
      displayName: 'Marketplace',
      predicate: (_, cellValue) => cellValue === 'Marketplace',
      numberOfInputs: 0,
    },
    {
      displayKey: 'auction',
      displayName: 'Auction',
      predicate: (_, cellValue) => cellValue === 'Auction',
      numberOfInputs: 0,
    },
    {
      displayKey: 'special',
      displayName: 'Special',
      predicate: (_, cellValue) => cellValue === 'Special',
      numberOfInputs: 0,
    },
  ],
  maxNumConditions: 0,
}

export function ColoredText({ value }) {
  const getColor = (value) => {
    if (value === 0) return 'default'
    if (value > 0) return 'success'
    if (value < 0) return 'error'
  }
  return (
    <Texto align='center' appearance={getColor(value)} style={{ fontWeight: 900 }}>
      ${fmt.decimal(value)}
    </Texto>
  )
}
