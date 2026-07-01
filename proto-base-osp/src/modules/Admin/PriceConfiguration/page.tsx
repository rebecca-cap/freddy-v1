import { usePriceConfigurations } from '@api/usePriceConfigurations'
import { Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { Empty } from 'antd'
import React, { useState } from 'react'

import { PriceConfigurationDetail } from './components/PriceConfigurationDetail'
import { ProductGroups } from './components/ProductGroups'

export function PriceConfiguration() {
  const { useMetadataQuery, usePriceConfigurationsQuery } = usePriceConfigurations()
  const { data: configMeta } = useMetadataQuery()
  const { data: priceConfigurations } = usePriceConfigurationsQuery()

  const [selectedProductGroup, setSelectedProductGroup] = useState({
    locationId: '',
    locationName: '',
    productId: '',
    productName: '',
  })

  return (
    <Horizontal style={{ minWidth: 1000, height: '100%' }}>
      <Vertical flex={3} className='bg-1' style={{ minWidth: 300 }}>
        <ProductGroups
          configMeta={configMeta}
          selectedProductGroup={selectedProductGroup}
          setSelectedProductGroup={setSelectedProductGroup}
        />
      </Vertical>
      {selectedProductGroup.locationId && selectedProductGroup.productId && (
        <Vertical flex={12}>
          <PriceConfigurationDetail
            selectedProductGroup={selectedProductGroup}
            configMeta={configMeta}
            priceConfigurations={priceConfigurations}
          />
        </Vertical>
      )}
      {!selectedProductGroup.locationId && !selectedProductGroup.productId && (
        <Vertical flex={12} horizontalCenter>
          <Empty description='Select a product group to get started' style={{ marginTop: 100 }} />
        </Vertical>
      )}
    </Horizontal>
  )
}
