import { GraviGrid, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { NumberEditor } from '@modules/SellingPlatform/BuyNow/Forwards/Components/Modal/Components/SecondStep/Components/cellEditors'
import dayjs from '@utils/dayjs'
import { ColDef, GridApi } from 'ag-grid-community'
import React, { MutableRefObject, useRef } from 'react'

export function VolumeAllocation({
  orderDetails,
  orderHasAdditionalInfo,
  form,
  deliveryPeriods,
  setDeliveryPeriods,
  selectedSubtype,
  setUserHasChanges,
}) {
  const showDeliveryPeriods =
    !!orderDetails?.OrderDetails?.length && orderDetails?.TradeTypeCodeValueMeaning !== 'Prompt'
  const gridRef = useRef() as MutableRefObject<GridApi>

  const handleGridUpdate = (updatedDeliveryPeriod, key) => {
    const copyDeliveryPeriods = [...deliveryPeriods]
    const index = copyDeliveryPeriods.findIndex(
      (item) => item.TradeEntryDetailId === updatedDeliveryPeriod.TradeEntryDetailId
    )

    if (index > -1) {
      copyDeliveryPeriods[index][key] = parseFloat(updatedDeliveryPeriod[key])

      const newTotalVolume = copyDeliveryPeriods.map((period) => period.Quantity).reduce((a, b) => a + b, 0)
      if (key === 'orderVolume') {
        form.setFieldsValue({ Quantity: newTotalVolume })
      }
      const calculateWeightedAverage = () => {
        const weights = copyDeliveryPeriods.map((item) => item.Quantity / newTotalVolume)
        const weightedPrices = weights.map((weight, i) => weight * copyDeliveryPeriods[i].Price)
        return fmt.decimal(weightedPrices.reduce((a, b) => a + b, 0))
      }
      if (selectedSubtype?.ContractPricingMethodMeaning === 'WeightedAverage') {
        const price = calculateWeightedAverage()
        form.setFieldsValue({ Price: price })
        form.setFieldsValue({ OverridePrice: price })
      }
      if (selectedSubtype?.ContractPricingMethodMeaning === 'HighPrice') {
        const price = Math.max(...copyDeliveryPeriods.map((item) => item.Price))
        form.setFieldsValue({ Price: price })
        form.setFieldsValue({ OverridePrice: price })
      }
      if (selectedSubtype?.ContractPricingMethodMeaning === 'DeliveryPeriod') {
        const price = Math.max(...copyDeliveryPeriods.map((item) => item.Price))
        form.setFieldsValue({ Price: price })
        form.setFieldsValue({ OverridePrice: price })
      }

      setDeliveryPeriods([...copyDeliveryPeriods])
      setUserHasChanges(true)
    }
  }

  if (!showDeliveryPeriods) {
    return <div />
  }

  return (
    showDeliveryPeriods && (
      <div className='flex-half'>
        <Vertical className='mx-3' style={{ marginRight: orderHasAdditionalInfo ? 0 : 50 }}>
          <Horizontal className='border-bottom'>
            <Texto category='h5' appearance='medium'>
              FUTURES
            </Texto>
          </Horizontal>
          <div className='mt-3' style={{ height: 200 }}>
            <GraviGrid
              enableFilterContextMenu
              externalRef={gridRef}
              rowData={deliveryPeriods}
              agPropOverrides={{
                frameworkComponents: {
                  number: NumberEditor,
                },
                columnDefs: columnDefinitions(
                  handleGridUpdate,
                  orderDetails?.VolumeDistributionTypeCodeValueMeaning,
                  orderDetails
                ),
                getRowId: (row) => row.data.TradeEntryDetailId,
                rowHeight: 50,
              }}
              sideBar={false}
              rowGroupPanelShow='never'
              headerHeight={25}
            />
          </div>
        </Vertical>
      </div>
    )
  )
}

function columnDefinitions(handleVolumeUpdate, selectedSubtype, orderEntryInfo) {
  const isInternalUser = orderEntryInfo?.IsInternalUser
  const isEditable = orderEntryInfo.OrderStatusCodeValueMeaning === 'Pending'
  const isPriceEditable = isInternalUser && selectedSubtype === 'WeightedAverage'

  const columnConfig = {
    resizable: false,
    suppressMenu: true,
    suppressColumnsToolPanel: true,
    filter: false,
    sortable: false,
  }
  const columnDefs = [
    {
      headerName: 'Delivery Period',
      field: 'FromDateTime',
      minWidth: 115,
      ...columnConfig,
      valueFormatter: ({ value }) => dayjs(value).format('MMM YYYY'),
    },
  ]

  if (orderEntryInfo?.VolumeDistributionTypeCodeValueMeaning !== 'PullAnytime') {
    columnDefs.push({
      headerName: 'Monthly Price',
      field: 'Price',
      editable: isPriceEditable && isEditable,
      cellEditor: 'number',
      cellEditorParams: {
        max: 999999999,
        min: 0,
      },
      cellEditorPopup: false,
      valueFormatter: fmt.decimal,
      onCellValueChanged: (params) => {
        handleVolumeUpdate(params.data, 'Price')
      },
      minWidth: 115,
      ...columnConfig,
    })
    columnDefs.push({
      ...columnConfig,
      headerName: 'Quantity',
      field: 'Quantity',
      editable: isEditable,
      cellEditor: 'number',
      cellEditorParams: {
        max: 999999999,
        min: 0,
      },
      cellEditorPopup: false,
      minWidth: 100,
      valueFormatter: ({ value }) => fmt.decimal(value, 0),
      onCellValueChanged: (params) => {
        handleVolumeUpdate(params.data, 'orderVolume')
      },
    })
  }

  return columnDefs as ColDef[]
}
