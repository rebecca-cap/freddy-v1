import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { toAntOption } from '@utils/index'
import { GridApi } from 'ag-grid-community'
import { Cascader, Popover, Select } from 'antd'
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'

// needs types
interface IProps {
  api: GridApi
  data: any
  metadata: {
    Data: {
      [key: string]: any[]
    }
  }
}

export const CostLinkEditor = forwardRef((params: IProps, editorRef) => {
  const [selectedId, setSelectedId] = useState<string>()
  const productInputRef = useRef<HTMLSelectElement>()

  useEffect(() => {
    productInputRef?.current?.focus()
  }, [])

  useEffect(() => {
    if (selectedId) {
      params.api.stopEditing()
    }
  }, [selectedId])

  /* Component Editor Lifecycle methods */
  useImperativeHandle(editorRef, () => {
    return {
      // the final value to send to the grid, on completion of editing
      getValue() {
        // this simple editor doubles any value entered into the input
        return selectedId
      },

      // Gets called once before editing starts, to give editor a chance to
      // cancel the editing before it even starts.
      isCancelBeforeStart() {
        return false
      },

      // Gets called once when editing is finished (eg if Enter is pressed).
      // If you return true, then the result of the edit will be ignored.
      isCancelAfterEnd() {
        return false
      },
    }
  })

  const source = params?.metadata?.Data?.CostSourceTypes.find((o) => o.Value == params?.data?.CostSourceType)
  const name = source?.Text.toLowerCase().trim()

  const [selectedProductId, setSelectedProductId] = useState(null)
  const [selectedLocationId, setSelectedLocationId] = useState(null)

  const selectedProduct = useMemo(
    () => params?.metadata?.Data?.Products?.find((o) => o.Value == selectedProductId),
    [selectedProductId, params?.metadata?.Data?.Products]
  )
  const selectedLocation = useMemo(
    () => params?.metadata?.Data?.Locations?.find((o) => o.Value == selectedLocationId),
    [selectedLocationId, params?.metadata?.Data?.Locations]
  )

  const contractFilter = useCallback(
    (contract) => {
      if (selectedProduct && contract.Product !== selectedProduct.Text) return false
      if (selectedLocation && contract.Location !== selectedLocation.Text) return false
      return true
    },
    [selectedProduct, selectedLocation]
  )

  const searchFilter = useCallback(
    (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
    []
  )

  return (
    <Popover
      placement='bottom'
      open
      content={() => {
        if (params.data.CostSourceType?.toLowerCase()?.includes('instrument')) {
          if (!params?.metadata) return null
          const { PricePublishers, PublisherPriceInstruments } = params?.metadata?.Data

          return (
            <Vertical width={700} gap='1rem' className='p-3'>
              <Texto category='label' appearance='medium'>
                Select a Price Instrument
              </Texto>
              <div style={{ width: '100%', flex: 1 }}>
                <Cascader
                  showSearch
                  onChange={([_publisher, instrument]) => {
                    setSelectedId(instrument as string)
                  }}
                  style={{ width: '100%' }}
                  popupMatchSelectWidth
                  options={PricePublishers.filter(
                    (pp) => Object.keys(PublisherPriceInstruments).includes(pp.Value) // only show publishers that have at least one instrument
                  )
                    .map(toAntOption)
                    .map((pp) => ({ ...pp, children: PublisherPriceInstruments[pp.value].map(toAntOption) }))}
                />
              </div>
            </Vertical>
          )
        }
        if (params.data.CostSourceType?.toLowerCase()?.includes('contract')) {
          return (
            <Vertical width={500} gap='1rem' className='p-3'>
              <Texto category='label' appearance='hint'>
                Filter results using product and location
              </Texto>
              <Horizontal width='100%' gap='1rem'>
                <Vertical className='flex-1'>
                  <Texto category='label'>Product</Texto>
                  <Select
                    // @ts-ignore
                    ref={productInputRef}
                    placeholder='Filter by Product'
                    filterOption={searchFilter}
                    showSearch
                    value={selectedProductId}
                    onChange={(value) => setSelectedProductId(value)}
                    options={params?.metadata?.Data?.Products?.map((o) => ({ value: o.Value, label: o.Text }))}
                    popupMatchSelectWidth
                  />
                </Vertical>
                <Vertical className='flex-1'>
                  <Texto category='label'>Location</Texto>
                  <Select
                    placeholder='Filter by Location'
                    filterOption={searchFilter}
                    showSearch
                    value={selectedLocationId}
                    options={params?.metadata?.Data?.Locations?.map(toAntOption) ?? []}
                    onChange={(value) => setSelectedLocationId(value)}
                    popupMatchSelectWidth
                    className='flex-1'
                  />
                </Vertical>
              </Horizontal>
              <Vertical>
                <Texto category='label'>Contract</Texto>
                <Select
                  filterOption={searchFilter}
                  showSearch
                  value={selectedId}
                  onChange={(id) => setSelectedId(id)}
                  placeholder='Select a Contract'
                  options={
                    params?.metadata?.Data?.ContractManagementCostSources?.filter(contractFilter).map(toAntOption) ?? []
                  }
                />
              </Vertical>
            </Vertical>
          )
        }
      }}
    >
      <div />
    </Popover>
  )
})
