import { CREDIT_STATUS_COLOR } from '@components/TheArmory/helpers'
import {
  getCreditStatusOverrideText,
  getCreditStatusText,
} from '@modules/Admin/ManageCounterparties/components/ManagementPane/ManageCounterpartiesCreditTab/utils'
import { Card, Col, Row, Statistic } from 'antd'
import React from 'react'

export const CreditStatusCard = ({ selectedRow, metadata }) => {
  return (
    <Card title='Credit Status' size='small'>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Statistic
            title='Current Credit Status'
            value={getCreditStatusText(selectedRow?.CreditStatusCvId, metadata)}
            valueStyle={{
              fontSize: '16px',
              color: selectedRow?.CreditStatusOverrideCvId
                ? ''
                : CREDIT_STATUS_COLOR[getCreditStatusOverrideText(selectedRow?.CreditStatusCvId, metadata)],
            }}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title='Credit Status Override'
            value={getCreditStatusOverrideText(selectedRow?.CreditStatusOverrideCvId, metadata)}
            valueStyle={{
              fontSize: '16px',
              color: CREDIT_STATUS_COLOR[getCreditStatusOverrideText(selectedRow?.CreditStatusOverrideCvId, metadata)],
            }}
          />
        </Col>
      </Row>
    </Card>
  )
}
