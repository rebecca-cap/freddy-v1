import { ApartmentOutlined, ExperimentFilled } from '@ant-design/icons'
import { useProductManagement } from '@api/useProductManagement'
import { Horizontal } from '@gravitate-js/excalibrr'
import { Tabs } from 'antd'
import React from 'react'

import { ManageProductGroups } from './ManageProductGroups'
import { RelatedProducts } from './RelatedProducts'

export default function ManagementPane({ selectedRows, canWrite }) {
  const {
    useMetadataQuery,
    useProductManagementQuery,
    createUpdateProductManagementMutation,
    upsertProductGroupMutation,
    useProductGroupDeleteMutation,
  } = useProductManagement()
  const { data: metadata } = useMetadataQuery()
  const { data: products } = useProductManagementQuery()
  const upsertProductGroup = upsertProductGroupMutation()
  const deleteProductGroup = useProductGroupDeleteMutation()

  const tabs = [
    {
      key: '0',
      value: 'ProductGroups',
      Text: 'Product Groups',
      icon: (
        <ApartmentOutlined
          style={{
            fontSize: 12,
            color: 'var(--theme-color-2)',
          }}
        />
      ),
      component: (
        <ManageProductGroups
          metadata={metadata}
          products={products}
          canWrite={canWrite}
          upsertProductGroup={upsertProductGroup}
          deleteProductGroup={deleteProductGroup}
        />
      ),
    },
    {
      key: '1',
      value: 'RelatedProducts',
      Text: 'Related Products',
      icon: (
        <ExperimentFilled
          style={{
            marginRight: 20,
            fontSize: 12,
            color: 'var(--theme-color-2)',
          }}
        />
      ),
      component: (
        <RelatedProducts
          metadata={metadata}
          products={products}
          selectedRows={selectedRows}
          createUpdateProductManagementMutation={createUpdateProductManagementMutation}
          canWrite={canWrite}
        />
      ),
    },
  ]

  return (
    <Horizontal style={{ height: '100vh', overflow: 'auto' }}>
      <Tabs style={{ minWidth: '100%' }}>
        {tabs?.map((tab) => {
          return (
            <Tabs.TabPane
              tab={
                <span>
                  {tab.icon} {tab.Text}
                </span>
              }
              key={tab.key}
            >
              <Horizontal>{tab.component}</Horizontal>
            </Tabs.TabPane>
          )
        })}
      </Tabs>
    </Horizontal>
  )
}
