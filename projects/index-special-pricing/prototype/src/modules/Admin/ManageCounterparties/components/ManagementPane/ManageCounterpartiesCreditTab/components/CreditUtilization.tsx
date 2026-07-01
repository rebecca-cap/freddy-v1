import { CREDIT_STATUS_COLOR } from '@components/TheArmory/helpers'
import { Card, Col, Row, Statistic } from 'antd'
import React from 'react'

export const CreditUtilization = ({ selectedRow }) => {
  const utilization =
    selectedRow?.CreditLimit === 0
      ? fmt.decimal(0, 2)
      : fmt.decimal(((selectedRow?.ARBalance || 0) / (selectedRow?.CreditLimit || 0)) * 100, 2)

  return (
    <Card title='Credit Utilization' size='small'>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Statistic
            title='Utilization Percentage'
            value={utilization ? `${utilization}%` : 'N/A'}
            valueStyle={{
              fontSize: '16px',
              color:
                (selectedRow.ARBalance / selectedRow.CreditLimit) * 100 > 90
                  ? CREDIT_STATUS_COLOR['Credit Hold']
                  : (selectedRow.ARBalance / selectedRow.CreditLimit) * 100 > 75
                  ? CREDIT_STATUS_COLOR['Credit Watch']
                  : CREDIT_STATUS_COLOR['Good Standing'],
            }}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title='Available Credit'
            value={fmt.currency(selectedRow.CreditLimit - selectedRow.ARBalance, 0)}
            valueStyle={{
              fontSize: '16px',
              color:
                selectedRow.CreditLimit - selectedRow.ARBalance > 0
                  ? CREDIT_STATUS_COLOR['Good Standing']
                  : CREDIT_STATUS_COLOR['Credit Hold'],
            }}
          />
        </Col>
      </Row>
    </Card>
  )
}
