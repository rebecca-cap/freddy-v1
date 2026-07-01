import '../../styles.css'

import { DownloadOutlined, LineChartOutlined } from '@ant-design/icons'
import { dateFormat } from '@components/TheArmory/helpers'
import { usePromptContext } from '@contexts/PromptContext'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { FormInstance } from 'antd/lib/form/Form'
import classNames from 'classnames'
import moment from 'moment'
import React from 'react'

export function ConfirmOrder({ form }: { form: FormInstance }) {
  const { pendingTrade, tasMode, selectedItemMeta, isDateOverrideActive } = usePromptContext()
  const showAdditionalOptions =
    !!pendingTrade?.LoadingNumbers?.length ||
    !!pendingTrade?.LiftingLocationIds?.length ||
    !!pendingTrade?.DestinationStates?.length

  const selectedAdditionalProducts = pendingTrade?.SelectedItems.filter((item) => item.ItemType === 'AdditionalProduct')
  const selectedAdditionalLocations = pendingTrade?.SelectedItems.filter(
    (item) => item.ItemType === 'AdditionalLocation'
  )
  return (
    <Horizontal style={{ overflowY: 'auto' }}>
      <Vertical>
        <Horizontal
          className=' px-4 py-3 '
          verticalCenter
          style={{ backgroundColor: 'var(--gray-800)', justifyContent: 'space-between', textAlign: 'right' }}
        >
          <Texto category='heading-small' appearance='white'>
            Volume
          </Texto>
          <Texto className='test-ConfirmQuantity' category='h3' appearance='white'>
            {fmt.decimal(pendingTrade?.Quantity, 0)}
          </Texto>
        </Horizontal>
        <Horizontal
          className={classNames(
            'px-4 py-3',
            { 'bg-theme1': !tasMode && pendingTrade?.Type !== 'bid' },
            { 'bg-warning': pendingTrade?.Type === 'bid' },
            { bordered: !!tasMode },
            { 'bg-1': !!tasMode }
          )}
          verticalCenter
          style={{
            minHeight: 50,
            color: tasMode ? 'var(--theme-warning)' : 'white',
            borderColor: 'var(--theme-warning)',
          }}
        >
          <Vertical verticalCenter flex={1}>
            <Horizontal verticalCenter style={{ gap: 10 }}>
              {!tasMode && <LineChartOutlined style={{ fontSize: 15 }} />}
              {tasMode && <DownloadOutlined style={{ fontSize: 15 }} />}
              <Texto
                className='test-ConfirmType'
                category='h5'
                weight={900}
                appearance={tasMode ? 'warning' : 'white'}
                textTransform='capitalize'
              >
                {!tasMode && `${pendingTrade?.Type} Order`}
                {tasMode && 'TAS MODE'}
              </Texto>
            </Horizontal>
          </Vertical>
          {pendingTrade?.Type === 'bid' && (
            <Vertical horizontalCenter verticalCenter flex={2}>
              <Texto className='test-ConfirmBidExpiration' category='h5' appearance='white'>
                Expiring {pendingTrade.BidExpiration.format(dateFormat.DATE_TIME)}
              </Texto>
            </Vertical>
          )}
          {tasMode && (
            <Vertical horizontalCenter verticalCenter flex={2}>
              <Texto category='p2' appearance={tasMode ? 'warning' : 'white'}>
                Order will execute at market settle.
              </Texto>
            </Vertical>
          )}
          <Vertical flex={1} verticalCenter>
            <Texto weight={900} category='h5' appearance={tasMode ? 'warning' : 'white'} style={{ textAlign: 'right' }}>
              {fmt.currency(pendingTrade?.Price)} / gal
            </Texto>
          </Vertical>
        </Horizontal>
        {pendingTrade?.IsInternalUser && !tasMode && pendingTrade?.Type === 'market' && (
          <Horizontal className='mx-4 my-2 justify-sb bg-1 py-2 px-3 bordered'>
            <Texto style={{ color: 'var(--theme-option)' }} category='p2'>
              Index Price
            </Texto>
            <Texto category='h6' className='test-ConfirmIndexPrice'>
              {fmt.currency(pendingTrade?.IndexPrice)}
            </Texto>
          </Horizontal>
        )}
        {!!selectedAdditionalProducts?.length && (
          <div>
            <Horizontal className='mt-3 mx-4 justify-sb border-bottom py-1' verticalCenter>
              <Texto style={{ color: 'var(--theme-option)' }} category='p1'>
                ADDITIONAL PRODUCTS
              </Texto>
            </Horizontal>
            <Vertical className='mx-4 my-2'>
              {selectedAdditionalProducts?.map((product) => (
                <Horizontal className='justify-sb py-1 px-3 bg-1 my-1 bordered' key={product.key}>
                  <Texto category='p2'>{product.ProductName}</Texto>
                  {!product.IsPlaceholder && <Texto category='h6'>{fmt.currency(product.Price)}</Texto>}
                </Horizontal>
              ))}
            </Vertical>
          </div>
        )}
        {!!selectedAdditionalLocations?.length && (
          <div>
            <Horizontal className='mt-3 mx-4 justify-sb border-bottom py-1' verticalCenter>
              <Texto style={{ color: 'var(--theme-option)' }} category='p1'>
                ADDITIONAL LOCATIONS
              </Texto>
            </Horizontal>
            <Vertical className='mx-4 my-2'>
              {selectedAdditionalLocations?.map((location) => (
                <Horizontal
                  key={location.key}
                  className='py-1 px-3 my-1 bordered'
                  style={{ borderRadius: '0 5px 5px 0' }}
                >
                  {location.LocationName}
                </Horizontal>
              ))}
            </Vertical>
          </div>
        )}
        {pendingTrade?.Notes && (
          <>
            <Horizontal className='mt-2 mx-4 justify-sb border-bottom py-1' verticalCenter>
              <Texto style={{ color: 'var(--theme-option)' }} category='p1'>
                TRADE NOTE:
              </Texto>
            </Horizontal>
            <Horizontal className='test-ConfirmNotes mx-4 mb-2 justify-sb py-2'>
              <Texto>{pendingTrade?.Notes}</Texto>
            </Horizontal>
          </>
        )}
        {pendingTrade?.PriceAdjustmentId && !isDateOverrideActive && (
          <Horizontal className='mx-4 my-2 justify-sb bg-1 py-2 px-3 bordered'>
            <Texto style={{ color: 'var(--theme-option)' }} category='p2'>
              Lifting Days
            </Texto>
            <Texto category='h6'>{pendingTrade?.PriceAdjustmentName}</Texto>
          </Horizontal>
        )}
        {showAdditionalOptions && (
          <Horizontal className='mx-4 justify-sb bg-1 py-2 px-3 bordered'>
            <Vertical>
              {!!pendingTrade?.DestinationStates?.length && (
                <Horizontal className='justify-sb py-2'>
                  <Texto style={{ color: 'var(--theme-option)' }} category='p2'>
                    Destination States
                  </Texto>
                  {pendingTrade?.DestinationStates.map((location) => {
                    return <Texto>{location?.LocationName}</Texto>
                  })}
                </Horizontal>
              )}
              {!!pendingTrade?.LoadingNumbers?.length && (
                <Horizontal className='justify-sb py-2'>
                  <Texto style={{ color: 'var(--theme-option)' }} category='p2'>
                    Loading Numbers
                  </Texto>
                  {pendingTrade?.LoadingNumbers.map((loadingNumber) => {
                    return <Texto>{loadingNumber?.Display}</Texto>
                  })}
                </Horizontal>
              )}
              {!!pendingTrade?.LiftingLocationIds?.length && (
                <Horizontal className='justify-sb py-2'>
                  <Texto style={{ color: 'var(--theme-option)' }} category='p2'>
                    Preferred Terminal(s)
                  </Texto>
                  {pendingTrade?.LiftingLocations.map((location) => (
                    <Texto category='p2'>{location}</Texto>
                  ))}
                  )
                </Horizontal>
              )}
            </Vertical>
          </Horizontal>
        )}
        {pendingTrade?.IsInternalUser && (
          <Horizontal className='mx-4 my-2 justify-sb bg-1 py-2 px-3 bordered'>
            <Vertical>
              <Horizontal className='justify-sb py-2'>
                <Texto style={{ color: 'var(--theme-option)' }} category='p2'>
                  Contact
                </Texto>
                <Texto category='h6'>{pendingTrade?.ExternalColleagueName}</Texto>
              </Horizontal>
              <Horizontal className='justify-sb py-2'>
                <Texto style={{ color: 'var(--theme-option)' }} category='p2'>
                  Internal Counterparty
                </Texto>
                <Texto category='h6'>{pendingTrade?.InternalCounterPartyName}</Texto>
              </Horizontal>
              {pendingTrade?.ExternalCounterPartyName && (
                <Horizontal className='justify-sb py-2'>
                  <Texto style={{ color: 'var(--theme-option)' }} category='p2'>
                    External Counterparty
                  </Texto>
                  <Texto category='h6'>{pendingTrade?.ExternalCounterPartyName}</Texto>
                </Horizontal>
              )}
            </Vertical>
          </Horizontal>
        )}
        {pendingTrade?.IsInternalUser && selectedItemMeta?.ShowDateOverrideFields && (
          <Horizontal className='mx-4 my-2 justify-sb bg-1 py-2 px-3 bordered'>
            <Vertical>
              <Horizontal className='justify-sb py-2'>
                <Texto style={{ color: 'var(--theme-option)' }} category='p2'>
                  From
                </Texto>
                <Texto category='h6'>
                  {moment(pendingTrade?.OverrideStartDate).format(dateFormat.SHORT_DATE_YEAR_TIME_V2)}
                </Texto>
              </Horizontal>

              <Horizontal className='justify-sb py-2'>
                <Texto style={{ color: 'var(--theme-option)' }} category='p2'>
                  To
                </Texto>
                <Texto category='h6'>
                  {moment(pendingTrade?.OverrideEndDate).format(dateFormat.SHORT_DATE_YEAR_TIME_V2)}
                </Texto>
              </Horizontal>
            </Vertical>
          </Horizontal>
        )}
      </Vertical>
    </Horizontal>
  )
}
