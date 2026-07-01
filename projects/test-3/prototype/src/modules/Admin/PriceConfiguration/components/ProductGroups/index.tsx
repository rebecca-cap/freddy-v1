import '../../styles.css'

import { ApartmentOutlined, ExperimentFilled, ReloadOutlined } from '@ant-design/icons'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import React from 'react'

export function ProductGroups({ configMeta, selectedProductGroup, setSelectedProductGroup }) {
  const locations = configMeta?.Data.LocationGroupList
  const products = configMeta?.Data.ProductGroupList

  const handleProductGroupSelection = (locationId, locationName, productId, productName) => {
    setSelectedProductGroup({ locationId, productId, locationName, productName })
  }
  return (
    <Horizontal style={{ width: '100%' }}>
      <Vertical>
        <Horizontal className='mt-3 p-4 border-bottom' horizontalCenter verticalCenter style={{ gap: 10 }}>
          <Vertical className='py-4' flex={1} verticalCenter horizontalCenter height='auto'>
            <ReloadOutlined
              style={{
                fontSize: 30,
                backgroundColor: 'var(--theme-color-2)',
                color: 'white',
                padding: 10,
                borderRadius: '20%',
              }}
            />
          </Vertical>
          <Vertical flex={3} height='auto'>
            <Texto category='h5'>PRICE CONFIGS</Texto>
            <Texto appearance='hint'>Manage how pricing is determined for each market platform instrument </Texto>
          </Vertical>
        </Horizontal>
        <Horizontal className='p-4 border-bottom' verticalCenter>
          <Texto category='p2' weight={600} appearance='secondary'>
            PRODUCT GROUPS
          </Texto>
        </Horizontal>
        <div style={{ overflowY: 'scroll' }}>
          {locations &&
            locations.map((location) => {
              return (
                <React.Fragment key={location.Value}>
                  <Horizontal className='p-4 border-bottom ' verticalCenter style={{ gap: 10 }}>
                    <Vertical verticalCenter>
                      <ApartmentOutlined
                        style={{
                          fontSize: 20,
                          color: 'var(--theme-color-2)',
                        }}
                      />
                    </Vertical>
                    <Vertical flex={3}>
                      <Texto category='p2' weight={600}>
                        {location.Text}
                      </Texto>
                      <Texto appearance='hint'>{products.length} Product Groups </Texto>
                    </Vertical>
                  </Horizontal>
                  <Horizontal className='m-4' verticalCenter horizontalCenter>
                    <Vertical horizontalCenter style={{ gap: 10 }}>
                      {products?.map((product) => {
                        const isSelected =
                          selectedProductGroup.productId === product.Value &&
                          selectedProductGroup?.locationId === location.Value
                        return (
                          <Horizontal
                            key={`${location.Value}-${product.Value}`}
                            className='bordered px-4 py-2 round-border product-group-hover'
                            verticalCenter
                            style={{
                              width: 200,
                              borderColor: 'var(--theme-color-2)',
                              backgroundColor: isSelected ? 'var(--theme-color-2)' : undefined,
                              cursor: 'pointer',
                            }}
                            onClick={() =>
                              handleProductGroupSelection(location.Value, location.Text, product.Value, product.Text)
                            }
                          >
                            <ExperimentFilled
                              style={{
                                marginRight: 20,
                                fontSize: 12,
                                color: isSelected ? 'white' : 'var(--theme-color-2)',
                              }}
                            />
                            <Texto category='p2' weight={600} style={{ color: isSelected ? 'white' : '' }}>
                              {product.Text}
                            </Texto>
                          </Horizontal>
                        )
                      })}
                    </Vertical>
                  </Horizontal>
                </React.Fragment>
              )
            })}
        </div>

        <Horizontal />
      </Vertical>
    </Horizontal>
  )
}
