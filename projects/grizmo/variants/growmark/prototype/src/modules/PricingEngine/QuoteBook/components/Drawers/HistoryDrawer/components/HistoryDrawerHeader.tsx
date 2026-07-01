import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import React from 'react'

interface IProps {
  quoteHistoryHeaderInfo: any
}

export const HistoryDrawerHeader: React.FC<IProps> = ({ quoteHistoryHeaderInfo }) => {
  return (
    <Horizontal className='bg-2 p-3 bordered' flex={1} style={{ minHeight: '100px' }}>
      <Vertical verticalCenter>
        <Texto category='p2'>Quotebook</Texto>
        <Texto category='h3'>Quote History </Texto>
        <Texto>Drill down into how your quote has compared historically</Texto>
      </Vertical>
      <Vertical verticalCenter style={{ gap: 5 }}>
        <Texto category='p2'>Location</Texto>
        <Texto category='h4'>{quoteHistoryHeaderInfo?.LocationName || 'N/A'}</Texto>
      </Vertical>
      <Vertical verticalCenter style={{ gap: 5 }}>
        <Texto category='p2'>Product</Texto>
        <Texto category='h4'>{quoteHistoryHeaderInfo?.ProductName || 'N/A'}</Texto>
      </Vertical>
      <Vertical verticalCenter style={{ gap: 5 }}>
        <Texto category='p2'>Customer</Texto>
        <Texto category='h4'>{quoteHistoryHeaderInfo?.ExternalCounterPartyName || 'N/A'}</Texto>
      </Vertical>
    </Horizontal>
  )
}
