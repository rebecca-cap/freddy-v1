import { CREDIT_STATUS_COLOR } from '@components/TheArmory/helpers'
import { Card, Col, Row, Statistic } from 'antd'
import React from 'react'

export const CreditLimitsAndBalancesCard = ({ selectedRow }) => {
  return (
    <Card title='Credit Limits & Balances' size='small'>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Statistic
            title='Credit Limit'
            value={selectedRow?.CreditLimit ? fmt.currency(selectedRow.CreditLimit, 0) : 'N/A'}
            valueStyle={{ fontSize: '16px' }}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title='AR Balance'
            value={selectedRow?.ARBalance ? fmt.currency(selectedRow.ARBalance, 0) : 'N/A'}
            valueStyle={{
              fontSize: '16px',
              color:
                selectedRow?.ARBalance && selectedRow.ARBalance > 0
                  ? CREDIT_STATUS_COLOR['Good Standing']
                  : CREDIT_STATUS_COLOR['Credit Hold'],
            }}
          />
        </Col>
      </Row>
    </Card>
  )
}
