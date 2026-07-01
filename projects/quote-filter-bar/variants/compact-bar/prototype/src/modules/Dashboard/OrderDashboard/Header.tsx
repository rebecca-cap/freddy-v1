import './styles.css'

import { CREDIT_STATUS_APPEARANCE } from '@components/TheArmory/helpers'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Skeleton } from 'antd'
import React, { useMemo } from 'react'

export function Header({ user, creditData, isLoading }) {
  const showCreditStatus = creditData?.Data?.CreditStatusDisplay

  const creditAvailabilityAmount = useMemo(() => {
    const creditHoldAmount = creditData?.Data?.CreditLimit * (creditData?.Data?.CreditHoldPercentage / 100)
    return creditHoldAmount - creditData?.Data?.Arbalance
  }, [creditData?.Data?.CreditLimit, creditData?.Data?.CreditHoldPercentage, creditData?.Data?.Arbalance])

  const showCreditInfo = useMemo(() => {
    if (isLoading) return false
    return (
      creditData?.Data &&
      creditData?.Data?.CreditStatusDisplay !== 'Not Applicable' &&
      creditData?.Data?.CounterPartyCreditId !== null &&
      creditData?.Data?.CreditLimit !== null
    )
  }, [
    creditData,
    isLoading,
    creditData?.Data?.CreditStatusDisplay,
    creditData?.Data?.CounterPartyCreditId,
    creditData?.Data?.CreditLimit,
  ])

  return (
    <Horizontal
      className='bg-1 justify-sb header-container'
      width='100%'
      style={{ padding: '10px 60px' }}
      verticalCenter
    >
      <Horizontal height={90}>
        <Vertical verticalCenter>
          <Texto category={'heading'}>Customer Dashboard</Texto>
          <Texto category='h3' textTransform='capitalize'>
            Welcome {user?.First}
          </Texto>
        </Vertical>
      </Horizontal>

      {isLoading && (
        <Horizontal className={'justify-end'} style={{ width: '20%' }}>
          <Vertical>
            <Skeleton active />
          </Vertical>
        </Horizontal>
      )}
      {showCreditInfo && (
        <Horizontal>
          {showCreditStatus && (
            <Vertical style={{ alignItems: 'end' }} className={'mr-5'}>
              <Texto category='h5'>Credit Status</Texto>
              <Texto
                appearance={CREDIT_STATUS_APPEARANCE[creditData?.Data?.CreditStatusDisplay] || ''}
                category='h3'
                textTransform='capitalize'
              >
                {creditData?.Data?.CreditStatusDisplay}
              </Texto>
            </Vertical>
          )}
          <Vertical style={{ alignItems: 'end' }}>
            <Texto category='h5'>Credit Availability </Texto>
            <Texto category='h3' style={{ color: 'var(--theme-color-1)' }}>
              ${fmt.decimal(creditAvailabilityAmount, 0)}
            </Texto>
          </Vertical>
        </Horizontal>
      )}
    </Horizontal>
  )
}
