import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import type { Quote } from '@modules/PricingEngine/QuoteBook/Api/types.schema'
import type React from 'react'

interface IProps {
  quoteHistoryHeaderInfo?: Quote
}

export const HistoryDrawerHeader: React.FC<IProps> = ({ quoteHistoryHeaderInfo }) => {
  const isOriginDestinationRow = !!quoteHistoryHeaderInfo?.OriginLocationName
  return (
    <Horizontal className='bg-2 p-3 bordered' flex={1} style={{ minHeight: '100px' }}>
      <Vertical verticalCenter>
        <Texto category='p2'>Quotebook</Texto>
        <Texto category='h3'>Quote History </Texto>
        <Texto>Drill down into how your quote has compared historically</Texto>
      </Vertical>
      {isOriginDestinationRow ? (
        <>
          <Vertical verticalCenter gap={5}>
            <Texto category='p2'>Origin</Texto>
            <Texto category='h4'>{quoteHistoryHeaderInfo?.OriginLocationName || 'N/A'}</Texto>
          </Vertical>
          <Vertical verticalCenter gap={5}>
            <Texto category='p2'>Destination</Texto>
            <Texto category='h4'>{quoteHistoryHeaderInfo?.DestinationLocationName || 'N/A'}</Texto>
          </Vertical>
        </>
      ) : (
        <Vertical verticalCenter gap={5}>
          <Texto category='p2'>Location</Texto>
          <Texto category='h4'>{quoteHistoryHeaderInfo?.LocationName || 'N/A'}</Texto>
        </Vertical>
      )}
      <Vertical verticalCenter gap={5}>
        <Texto category='p2'>Product</Texto>
        <Texto category='h4'>{quoteHistoryHeaderInfo?.ProductName || 'N/A'}</Texto>
      </Vertical>
      <Vertical verticalCenter gap={5}>
        <Texto category='p2'>Customer</Texto>
        <Texto category='h4'>{quoteHistoryHeaderInfo?.ExternalCounterPartyName || 'N/A'}</Texto>
      </Vertical>
    </Horizontal>
  )
}
