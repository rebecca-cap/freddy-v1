import { CREDIT_STATUS_COLOR } from '@components/TheArmory/helpers'
import { Card, Col, Row, Statistic } from 'antd'
import React from 'react'

export const CreditMonitoring = ({ selectedRow }) => {
  return (
    <Card title='Credit Monitoring' size='small'>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Statistic
            title='Credit Watch Percentage'
            value={selectedRow?.CreditWatchPercentage ? `${fmt.decimal(selectedRow.CreditWatchPercentage, 2)}%` : 'N/A'}
            valueStyle={{
              fontSize: '16px',
              color:
                selectedRow?.CreditWatchPercentage && selectedRow.CreditWatchPercentage > 80
                  ? CREDIT_STATUS_COLOR['Credit Watch']
                  : '#666',
            }}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title='Credit Hold Percentage'
            value={selectedRow?.CreditHoldPercentage ? `${fmt.decimal(selectedRow.CreditHoldPercentage, 2)}%` : 'N/A'}
            valueStyle={{
              fontSize: '16px',
              color:
                selectedRow?.CreditHoldPercentage && selectedRow.CreditHoldPercentage > 90
                  ? CREDIT_STATUS_COLOR['Credit Hold']
                  : '#666',
            }}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]} className={'mt-5'}>
        <Col span={12}>
          <Statistic
            title='Credit Watch Threshold'
            value={
              selectedRow?.CreditWatchPercentage
                ? `${fmt.currency((selectedRow.CreditWatchPercentage / 100) * selectedRow.CreditLimit, 0)}`
                : 'N/A'
            }
            valueStyle={{
              fontSize: '16px',
              color:
                selectedRow?.CreditWatchPercentage && selectedRow.CreditWatchPercentage > 80
                  ? CREDIT_STATUS_COLOR['Credit Watch']
                  : '#666',
            }}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title='Credit Hold Threshold'
            value={
              selectedRow?.CreditHoldPercentage
                ? `${fmt.currency((selectedRow.CreditHoldPercentage / 100) * selectedRow.CreditLimit, 0)}`
                : 'N/A'
            }
            valueStyle={{
              fontSize: '16px',
              color:
                selectedRow?.CreditHoldPercentage && selectedRow.CreditHoldPercentage > 90
                  ? CREDIT_STATUS_COLOR['Credit Hold']
                  : '',
            }}
          />
        </Col>
      </Row>
    </Card>
  )
}
