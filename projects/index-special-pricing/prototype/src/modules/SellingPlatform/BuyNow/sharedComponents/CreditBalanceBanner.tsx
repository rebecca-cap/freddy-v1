import '../Prompt/styles.css'

import { CheckOutlined, CloseCircleFilled, WarningFilled } from '@ant-design/icons'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import React, { useMemo } from 'react'

interface CreditData {
  creditHold: boolean
  creditStatus: 'CreditHold' | 'CreditWatch' | string
  remainingCreditBalance: number
  totalCreditBalance: number
}

interface CreditBalanceBannerProps {
  creditData?: CreditData
}

type BannerType = 'hold' | 'warning' | 'normal'

type CreditInfo = {
  title: string
  message: string
  type: BannerType
  icon: React.ReactNode
  remainingCreditBalance?: number
}

export const CreditBalanceBanner: React.FC<CreditBalanceBannerProps> = ({ creditData }) => {
  const showBalanceBanner = !!creditData?.remainingCreditBalance
  const showBalance = showBalanceBanner && creditData?.creditStatus !== 'CreditHold'

  const creditInfo = useMemo<CreditInfo>(() => {
    const status = creditData?.creditStatus

    switch (status) {
      case 'CreditHold':
        return {
          title: 'Credit Hold',
          message: 'Orders Blocked',
          type: 'hold',
          icon: <CloseCircleFilled />,
          remainingCreditBalance: creditData?.remainingCreditBalance,
        }
      case 'CreditWatch':
        return {
          title: 'Available',
          message: 'Credit Warning',
          type: 'warning',
          icon: <WarningFilled />,
          remainingCreditBalance: creditData?.remainingCreditBalance,
        }
      default:
        return {
          title: 'Available',
          message: '',
          type: 'normal',
          icon: <CheckOutlined />,
          remainingCreditBalance: creditData?.remainingCreditBalance,
        }
    }
  }, [creditData?.creditStatus, creditData?.remainingCreditBalance])

  if (!showBalanceBanner) return null

  return (
    <Horizontal className={`credit-balance-wrapper ${creditInfo?.type}`}>
      <div className={`mr-2 text-size-6 credit-balance-icon ${creditInfo?.type}`}>{creditInfo?.icon}</div>
      <Vertical>
        <Texto category={'h6'}>
          {showBalance && fmt.currency(creditInfo.remainingCreditBalance || 0, 0)} {creditInfo?.title}
        </Texto>
        <Texto category={'label'}>{creditInfo?.message}</Texto>
      </Vertical>
    </Horizontal>
  )
}
