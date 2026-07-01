import { GraviGrid, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { columnDefinitions } from '@modules/SellingPlatform/BuyNow/Forwards/Components/Modal/Components/SecondStep/Components/VolumeAllocationColumnDefs'
import React, { useCallback, useMemo, useRef } from 'react'

import { VolumeErrorDisplay } from '../../FirstStep/Components/VolumeErrorDisplay'
import { NumberEditor } from './cellEditors'

export function VolumeAllocation({
  form,
  deliveryPeriods,
  setDeliveryPeriods,
  constraints,
  selectedSubtype,
  orderEntryInfo,
  setTotalVolume,
}) {
  const gridRef = useRef(null)

  const handleGridUpdate = useCallback(
    (updatedDeliveryPeriod, key) => {
      const copyDeliveryPeriods = [...deliveryPeriods]
      const index = copyDeliveryPeriods.findIndex(
        (item) =>
          item.ItemKey.TradeEntrySetupId === updatedDeliveryPeriod.ItemKey.TradeEntrySetupId &&
          item.ItemKey.DeliveryPeriodConfigurationId === updatedDeliveryPeriod.ItemKey.DeliveryPeriodConfigurationId
      )

      if (index > -1) {
        copyDeliveryPeriods[index][key] = parseFloat(updatedDeliveryPeriod[key])

        const newTotalVolume = copyDeliveryPeriods.map((period) => period.orderVolume).reduce((a, b) => a + b, 0)
        if (key === 'orderVolume') {
          form.setFieldsValue({ Volume: newTotalVolume })
          setTotalVolume(newTotalVolume)
        }
        const calculateWeightedAverage = (weighted: boolean) => {
          const total = copyDeliveryPeriods
            ?.map((item) => (!weighted ? 1 : item.orderVolume))
            .reduce((acc, curr) => acc + curr, 0)

          const totalPrice = copyDeliveryPeriods
            .map((item) => (!weighted ? 1 : item.orderVolume) * item.Price)
            .reduce((acc, curr) => acc + curr, 0)
          const average = totalPrice / total

          return fmt.decimal(average)
        }
        if (selectedSubtype?.ContractPricingMethodMeaning === 'WeightedAverage') {
          const price = calculateWeightedAverage(true)
          form.setFieldsValue({ Price: price })
          form.setFieldsValue({ OverridePrice: price })
        }
        if (selectedSubtype?.ContractPricingMethodMeaning === 'HighPrice') {
          const price = Math.max(...copyDeliveryPeriods.map((item) => item.Price))
          form.setFieldsValue({ Price: price })
          form.setFieldsValue({ OverridePrice: price })
        }
        if (selectedSubtype?.ContractPricingMethodMeaning === 'DeliveryPeriod') {
          const price = calculateWeightedAverage(false)
          form.setFieldsValue({ Price: price })
          form.setFieldsValue({ OverridePrice: price })
        }

        setDeliveryPeriods([...copyDeliveryPeriods])
      }
    },
    [deliveryPeriods, form, selectedSubtype, setDeliveryPeriods, setTotalVolume]
  )
  const columnDefs = useMemo(
    () => columnDefinitions(handleGridUpdate, selectedSubtype, orderEntryInfo),
    [selectedSubtype, orderEntryInfo, handleGridUpdate]
  )
  return (
    <Vertical flex={1}>
      <Texto category='h5' className='mt-3 mb-3' style={{ color: 'var(--theme-color-1)' }}>
        Volume Allocation
      </Texto>
      <Horizontal className='py-3'>
        <div style={{ width: '100%' }}>
          <GraviGrid
            enableFilterContextMenu
            ref={gridRef}
            rowData={deliveryPeriods}
            agPropOverrides={{
              frameworkComponents: {
                number: NumberEditor,
              },
              getRowId: (row) => row.data?.ItemKey.DeliveryPeriodConfigurationId,
            }}
            columnDefs={columnDefs}
            sideBar={false}
            rowGroupPanelShow='never'
            headerHeight={25}
            domLayout='autoHeight'
          />
        </div>
      </Horizontal>
      <Horizontal>
        <VolumeErrorDisplay
          form={form}
          constraints={constraints}
          deliveryPeriods={deliveryPeriods}
          volumeValue={form.getFieldValue('Volume')}
          selectedSubtype={selectedSubtype}
        />
      </Horizontal>
    </Vertical>
  )
}
