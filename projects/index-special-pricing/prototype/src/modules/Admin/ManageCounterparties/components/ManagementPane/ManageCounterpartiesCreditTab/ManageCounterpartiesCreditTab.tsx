import '../../../styles.css'
import '../../../../../../styles.css'

import { CounterPartyMetadataResponse } from '@api/useCounterparties/types'
import { Horizontal, NothingMessage, Texto, Vertical } from '@gravitate-js/excalibrr'
import { CreditInfo } from '@modules/Admin/ManageCounterparties/components/ManagementPane/ManageCounterpartiesCreditTab/components/CreditInfo'
import { CreditLimitsAndBalancesCard } from '@modules/Admin/ManageCounterparties/components/ManagementPane/ManageCounterpartiesCreditTab/components/CreditLimitsAndBalancesCard'
import { CreditMonitoring } from '@modules/Admin/ManageCounterparties/components/ManagementPane/ManageCounterpartiesCreditTab/components/CreditMonitoring'
import { CreditStatusCard } from '@modules/Admin/ManageCounterparties/components/ManagementPane/ManageCounterpartiesCreditTab/components/CreditStatusCard'
import { CreditUtilization } from '@modules/Admin/ManageCounterparties/components/ManagementPane/ManageCounterpartiesCreditTab/components/CreditUtilization'
import { Col, Row } from 'antd'
import React from 'react'

interface ManageCounterpartiesCreditTabProps {
  metadata: CounterPartyMetadataResponse
  selectedRow: any
}
export function ManageCounterpartiesCreditTab({ metadata, selectedRow }: ManageCounterpartiesCreditTabProps) {
  if (!selectedRow) {
    return (
      <Vertical verticalCenter height='75%'>
        <Horizontal verticalCenter horizontalCenter>
          <NothingMessage
            title='Counterparty Not Selected'
            message='Select a counterparty to view the credit information for it.'
          />
        </Horizontal>
      </Vertical>
    )
  }

  if (selectedRow && !selectedRow.CreditStatusCvId && !selectedRow.CreditLimit) {
    return <CreditInfo />
  }

  const showCreditUtilization = selectedRow?.CreditLimit != null
  return (
    <Vertical className='bg-2'>
      <Horizontal className='bg-2 py-3 px-4 border-bottom'>
        <Texto category='h4'>Credit Information</Texto>
      </Horizontal>
      <div style={{ padding: '24px', height: '75%', overflow: 'auto' }}>
        <Row gutter={[16, 16]}>
          {/* Credit Status Information */}
          <Col span={24} className={'credit-card-col'}>
            <CreditStatusCard metadata={metadata} selectedRow={selectedRow} />
          </Col>

          {/* Credit Limits and Balances */}
          <Col span={24} className={'credit-card-col'}>
            <CreditLimitsAndBalancesCard selectedRow={selectedRow} />
          </Col>

          {/* Credit Monitoring */}
          <Col span={24} className={'credit-card-col'}>
            <CreditMonitoring selectedRow={selectedRow} />
          </Col>

          {/* Credit Utilization (calculated field) */}
          {showCreditUtilization && (
            <Col span={24} className={'credit-card-col'}>
              <CreditUtilization selectedRow={selectedRow} />
            </Col>
          )}
        </Row>
      </div>
    </Vertical>
  )
}
