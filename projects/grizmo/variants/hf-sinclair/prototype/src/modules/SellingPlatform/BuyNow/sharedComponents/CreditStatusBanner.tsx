import '../Prompt/styles.css'

import { WarningFilled } from '@ant-design/icons'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import React, { useMemo } from 'react'

interface CreditData {
  creditHold?: boolean
  creditStatus?: 'CreditHold' | 'CreditWatch' | string
  totalCreditBalance?: number | null
  remainingCreditBalance?: number | null
  EstimatedRemainingCreditBalance?: number | null
}

interface GridStatusBannerProps {
  creditData: CreditData | null
}

type CreditInfo = {
  title: string
  message: string
  type: 'hold' | 'warning'
} | null

export const CreditStatusBanner: React.FC<GridStatusBannerProps> = ({ creditData }) => {
  if (!creditData) return null

  const { creditStatus } = creditData

  const creditInfo = useMemo<CreditInfo>(() => {
    if (creditStatus === 'CreditHold') {
      return {
        title: 'Credit Hold - Ordering Unavailable',
        message: 'Your account has exceeded the credit limit. Please contact support to resolve.',
        type: 'hold',
      }
    }

    if (creditStatus === 'CreditWatch') {
      return {
        title: 'Credit Limit Warning',
        message: 'Low Credit allowance remaining',
        type: 'warning',
      }
    }

    return null
  }, [creditStatus])

  if (!creditInfo) return null

  return (
    <Horizontal className={`control-bar-banner ${creditInfo?.type}`}>
      <span className={`mr-2 text-size-8 banner-warning-icon ${creditInfo?.type}`}>
        <WarningFilled />
      </span>
      <Vertical>
        <Texto category={'h5'} appearance={creditStatus === 'CreditHold' ? 'white' : 'default'}>
          {creditInfo?.title}
        </Texto>
        <Texto appearance={creditStatus === 'CreditHold' ? 'white' : 'default'} category={'p2'}>
          {creditInfo?.message}
        </Texto>
      </Vertical>
    </Horizontal>
  )
}
