import { Horizontal, NothingMessage, Vertical } from '@gravitate-js/excalibrr'
import { CREDIT_STATUS_INFO } from '@modules/Admin/ManageCounterparties/components/ManagementPane/ManageCounterpartiesCreditTab/utils'
import { Avatar, List } from 'antd'
import React from 'react'

export const CreditInfo: React.FC = () => {
  return (
    <Vertical verticalCenter height='100%'>
      <Horizontal flex={1} verticalCenter horizontalCenter>
        <NothingMessage
          title='Credit Details Unavailable'
          message='No credit information available for the selected counterparty. Credit details may be integrated per counterparty.'
        />
      </Horizontal>

      <Horizontal flex={3}>
        <List
          itemLayout='horizontal'
          style={{ width: '100%' }}
          dataSource={CREDIT_STATUS_INFO}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    style={{
                      backgroundColor: item.color,
                      verticalAlign: 'middle',
                    }}
                    size={12}
                    shape='circle'
                  />
                }
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Horizontal>
    </Vertical>
  )
}
