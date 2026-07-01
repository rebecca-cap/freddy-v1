import { DownOutlined, EnvironmentOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons'
import { Horizontal, NothingMessage, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Checkbox, Input } from 'antd'
import React, { useEffect, useState } from 'react'

export function AvailableProducts({ metadata, selectedRows, createUpdateLocationManagementMutation, canWrite }) {
  const selectedProduct = selectedRows[0]
  const associatedProducts = selectedProduct?.MarketPlatformAssociatedProducts.map((id) => id.toString())

  useEffect(() => {
    const productGroups = Array.from(
      new Set(metadata?.Data?.MarketPlatformProducts.map((product) => product.GroupingValue))
    ).filter(Boolean)

    const productSelectionList = productGroups.map((group) => {
      const groupProducts = metadata?.Data?.MarketPlatformProducts?.filter(
        (product) => product.GroupingValue && product.GroupingValue === group
      ).map((product) => {
        return { ...product, selected: associatedProducts?.includes(product.Value.toString()) }
      })

      const allItemsSelected = groupProducts?.length
        ? groupProducts.filter((p) => p.selected === true).length === groupProducts.length
        : false

      return { Value: group, Text: group, selected: allItemsSelected, collapsed: false, groupProducts }
    })
    setProductGroups(productSelectionList)
    setSearchResults(searchProducts(searchString, productSelectionList))
  }, [selectedProduct])

  const [productGroups, setProductGroups] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [searchString, setSearchString] = useState(null)

  const collapseHeader = (event, group) => {
    const isClickingHeader = event.target.innerHTML !== event.target.textContent || event.target.textContent
    if (!isClickingHeader) return

    const updateProductGroups = productGroups.map((item) => {
      if (item.Value === group.Value) {
        return { ...item, collapsed: !item.collapsed }
      }
      return item
    })
    setProductGroups(updateProductGroups)
    setSearchResults(searchProducts(searchString, updateProductGroups))
  }

  const handleGroupChange = (group) => {
    const updateProductGroups = productGroups.map((item) => {
      const searchResultGroupProducts = searchResults
        .find((searchGroup) => item.Value === searchGroup.Value)
        ?.groupProducts?.map((searchProduct) => searchProduct.Value)

      if (item.Value === group.Value) {
        const updatedSelectedProducts = item.groupProducts.map((product) => {
          return {
            ...product,
            selected: searchResultGroupProducts.includes(product.Value) ? !item.selected : item.selected,
          }
        })

        const allItemsSelected =
          updatedSelectedProducts.filter((p) => p.selected).length === searchResultGroupProducts.length

        return { ...item, selected: allItemsSelected, groupProducts: updatedSelectedProducts }
      }
      return item
    })
    setProductGroups(updateProductGroups)
    setSearchResults(searchProducts(searchString, updateProductGroups))
    return saveAssociatedProducts(updateProductGroups)
  }

  const handleProductChange = (group, product) => {
    const updateProductGroups = productGroups.map((item) => {
      if (item.Value === group.Value) {
        const updatedSelectedProducts = item.groupProducts.map((productItem) => {
          if (productItem.Value === product.Value) {
            return { ...product, selected: !productItem.selected }
          }
          return productItem
        })

        const allItemsSelected = updatedSelectedProducts.filter((p) => p.selected).length === item.groupProducts.length

        return { ...item, selected: allItemsSelected, groupProducts: updatedSelectedProducts }
      }
      return item
    })
    setProductGroups(updateProductGroups)
    setSearchResults(searchProducts(searchString, updateProductGroups))
    return saveAssociatedProducts(updateProductGroups)
  }

  const saveAssociatedProducts = (updateProductGroups) => {
    const selectedProductIds: string[] = []

    updateProductGroups.forEach((g) => {
      g.groupProducts.forEach((p) => {
        if (p.selected) {
          selectedProductIds.push(p.Value)
        }
      })
    })

    const updatedLocation = {
      ...selectedProduct,
      MarketPlatformAssociatedProducts: [...selectedProductIds],
    }
    return createUpdateLocationManagementMutation.mutateAsync([updatedLocation])
  }

  const searchProducts = (input, searchList?) => {
    const list = searchList || productGroups
    const searchText = input?.toLowerCase()

    setSearchString(searchText)

    if (!searchText) {
      setSearchResults(list)
      return list
    }

    const matchingGroups = []

    list.forEach((group) => {
      const matchingProducts = []
      group.groupProducts.forEach((product) => {
        if (product.Text.toLowerCase().includes(searchText)) {
          matchingProducts.push(product)
        }
      })

      if (matchingProducts.length > 0) {
        matchingGroups.push({
          ...group,
          groupProducts: matchingProducts,
        })
      }
    })

    setSearchResults(matchingGroups)

    return matchingGroups
  }
  return (
    <Vertical style={{ minHeight: 'auto' }}>
      <Horizontal className='px-4 pt-3 py-2 bg-2'>
        <Texto category='h3'>Available Products</Texto>
      </Horizontal>
      <Horizontal>
        <Input
          prefix={<SearchOutlined />}
          placeholder='Quick Search'
          value={searchString}
          onChange={(event) => searchProducts(event.target.value)}
          allowClear
          disabled={!selectedProduct}
        />
      </Horizontal>
      {!!searchResults?.length && selectedProduct && (
        <Vertical
          style={{
            maxHeight: '78%',
            overflowY: 'auto',
          }}
        >
          {searchResults.map((group) => {
            return (
              <div>
                <Horizontal
                  className='px-4 py-2 bordered justify-sb'
                  verticalCenter
                  onClick={(event) => collapseHeader(event, group)}
                  style={{
                    backgroundColor: group?.selected ? 'var(--theme-color-2-dim)' : '',
                  }}
                >
                  <Horizontal verticalCenter style={{ gap: 10 }}>
                    <Checkbox
                      disabled={searchString || !group?.groupProducts?.length || !canWrite}
                      checked={group?.selected}
                      onChange={() => handleGroupChange(group)}
                    />
                    <EnvironmentOutlined />
                    <Texto category='p2' weight={600} style={{ color: group?.selected ? 'var(--theme-color-2)' : '' }}>
                      {group?.Text}
                    </Texto>
                  </Horizontal>
                  <Horizontal verticalCenter style={{ gap: 10 }}>
                    <Texto
                      className='px-2 py-1'
                      appearance='white'
                      style={{
                        backgroundColor: 'var(--theme-color-2)',
                        borderRadius: 3,
                        minWidth: 30,
                        textAlign: 'center',
                      }}
                    >
                      {group.selected ? 'ALL' : group.groupProducts.filter((item) => item.selected).length}
                    </Texto>
                    {group?.collapsed ? <RightOutlined /> : <DownOutlined style={{ color: 'var(--theme-color-2)' }} />}
                  </Horizontal>
                </Horizontal>
                {!group.collapsed && (
                  <Horizontal className='bordered  bg-1'>
                    <Vertical className='mx-4 my-2'>
                      {!!group?.groupProducts?.length &&
                        group?.groupProducts.map((product) => {
                          return (
                            <Horizontal
                              className='my-1 p-2 bordered'
                              verticalCenter
                              style={{
                                gap: 10,
                                borderRadius: 5,
                                borderColor: product?.selected ? 'var(--theme-color-2)' : '',
                                backgroundColor: product?.selected ? 'var(--theme-color-2-dim)' : '',
                              }}
                              onClick={() => canWrite && handleProductChange(group, product)}
                            >
                              <Checkbox checked={product?.selected} disabled={!canWrite} />
                              <Texto category='p1' weight={600}>
                                {product?.Text}
                              </Texto>
                            </Horizontal>
                          )
                        })}
                      {!group?.groupProducts?.length && (
                        <Horizontal
                          className='my-1 p-2'
                          verticalCenter
                          horizontalCenter
                          style={{ gap: 10, borderRadius: 5 }}
                        >
                          <Texto appearance='hint'>There are no products for this product group</Texto>
                        </Horizontal>
                      )}
                    </Vertical>
                  </Horizontal>
                )}
              </div>
            )
          })}
        </Vertical>
      )}
      {!selectedProduct && (
        <Vertical verticalCenter>
          <Horizontal verticalCenter horizontalCenter>
            <NothingMessage
              title='Location Not Selected'
              message='Select a location to manage the available products for it.'
            />
          </Horizontal>
        </Vertical>
      )}
    </Vertical>
  )
}
