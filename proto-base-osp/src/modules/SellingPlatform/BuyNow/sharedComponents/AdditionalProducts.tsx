import { GraviButton, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { isDefinedAndNotNull } from '@utils/index'
import { Checkbox, Tooltip } from 'antd'
import type { FormInstance } from 'antd'
import {useEffect, useMemo, useRef, useState} from 'react'

type AdditionalProductsProps = {
  form: FormInstance
  selectedItemMeta: any
  formField: string
  orderEntryInfo?: any
  deliveryPeriods?: any
}

export function AdditionalProducts({
  form,
  selectedItemMeta,
  formField,
  orderEntryInfo,
  deliveryPeriods,
}: AdditionalProductsProps) {
  useEffect(() => {
    if (!Array.isArray(form.getFieldValue('SelectedItems'))) {
      form.setFieldsValue({ SelectedItems: [] })
    }
  }, [form])

  const getVolumes = (TradeEntrySetupId) => {
    const volumePriceData: { Volume: number; Price: number }[] = []

    deliveryPeriods?.forEach((period) => {
      period.AdditionalItems?.forEach((additionalItem) => {
        if (additionalItem.ItemKey.TradeEntrySetupId === TradeEntrySetupId) {
          volumePriceData.push({ Volume: period.orderVolume, Price: additionalItem.Price })
        }
      })
    })
    return volumePriceData
  }

  const getAverage = (TradeEntrySetupId, isWeightedAverage = false) => {
    const volumes = getVolumes(TradeEntrySetupId)
    const total = volumes.map((volume) => (!isWeightedAverage ? 1 : volume.Volume)).reduce((acc, curr) => acc + curr, 0)
    const totalPrice = volumes
      .map((volume) => (!isWeightedAverage ? 1 : volume.Volume) * volume.Price)
      .reduce((acc, curr) => acc + curr, 0)
    const average = totalPrice / total
    return average
  }

  const getProductsWithPrice = (products) => {
    if (selectedItemMeta?.selectedSubtype?.ContractPricingMethodMeaning === 'HighPrice') {
      const getHighPrice = (product) => {
        const matchedAdditionalItemPrices: number[] = []

        orderEntryInfo?.Data?.SelectedItems.forEach((item) => {
          item.AdditionalItems.forEach((additionalItem) => {
            if (additionalItem.ItemKey.TradeEntrySetupId === product.ItemKey.TradeEntrySetupId) {
              matchedAdditionalItemPrices.push(additionalItem.Price)
            }
          })
        })
        const maxPrice = Math.max(...matchedAdditionalItemPrices)
        return maxPrice
      }

      const updatedProducts = products.map((item) => {
        return { ...item, Price: getHighPrice(item) }
      })
      return updatedProducts
    }

    if (selectedItemMeta?.selectedSubtype?.ContractPricingMethodMeaning === 'WeightedAverage') {
      const updatedProducts = products.map((item) => {
        return { ...item, Price: getAverage(item.ItemKey.TradeEntrySetupId, true) }
      })
      return updatedProducts
    }

    if (selectedItemMeta?.selectedSubtype?.ContractPricingMethodMeaning === 'DeliveryPeriod') {
      const updatedProducts = products.map((item) => {
        return { ...item, Price: getAverage(item.ItemKey.TradeEntrySetupId) }
      })
      return updatedProducts
    }

    return products
  }

  const additionalProducts = useMemo(() => {
    const products = selectedItemMeta?.AdditionalItems.filter((item) => item.ItemType === 'AdditionalProduct')
    return getProductsWithPrice(products)
  }, [selectedItemMeta])

  const getAdditionalProductPrice = useMemo(() => {
    return (additionalProductPrice: number) => {
      if (isDefinedAndNotNull(form.getFieldValue(formField))) {
        const productSaleDifference = additionalProductPrice - parseFloat(selectedItemMeta.Price)
        const adjustedProductPrice = parseFloat(form.getFieldValue(formField)) + productSaleDifference
        return fmt.decimal(adjustedProductPrice)
      }
      return additionalProductPrice
    }
  }, [form.getFieldValue(formField)])

  const handleCheckboxChange = (key) => {
    const selectedFormItems = form.getFieldsValue(true)?.SelectedItems
    if (selectedFormItems.includes(key)) {
      const updatedItems = selectedFormItems.filter((item) => item !== key)
      form.setFieldsValue({ SelectedItems: updatedItems })
    } else {
      const updatedItems = [...selectedFormItems, key]

      form.setFieldsValue({ SelectedItems: updatedItems })
    }
  }
  return (
    <div className='mx-4 my-3 justify-sb py-2 flex-row additional-options-grid'>
      {additionalProducts.map((product) => {
        return (
          <CheckButton
            key={product.key}
            product={product}
            form={form}
            handleCheckboxChange={handleCheckboxChange}
            getAdditionalProductPrice={getAdditionalProductPrice}
          />
        )
      })}
    </div>
  )
}

function CheckButton({ product, form, handleCheckboxChange, getAdditionalProductPrice }) {
  const [isSelected, setIsSelected] = useState(form.getFieldValue('SelectedItems')?.includes(product.key))
  const [isEllipsis, setIsEllipsis] = useState(false)
  const textRef = useRef<HTMLSpanElement | null>(null)

useEffect(() => {
    const checkEllipsis = () => {
      if (textRef?.current) {
        setIsEllipsis(textRef.current?.scrollWidth > textRef.current.clientWidth)
      }
    }
    checkEllipsis()

    window.addEventListener('resize', checkEllipsis)
    return () => window.removeEventListener('resize', checkEllipsis)
  }, [])

  return (
    <Tooltip title={isEllipsis ? product?.ProductName : ''} style={{ width: '100%' }}>
      <GraviButton
        className={`checkable-button ${isSelected ? 'checkable-success-button' : 'checkable-unchecked-button '}`}
        onClick={(event) => {
          event.stopPropagation()
          setIsSelected(!isSelected)
          handleCheckboxChange(product.key)
        }}
        children={
          <Horizontal verticalCenter style={{ width: '100%', justifyContent: 'space-between' }}>
            <Horizontal verticalCenter gap={5}>
              <Checkbox
                onClick={(event) => {
                  event.stopPropagation()
                  setIsSelected(!isSelected)
                  handleCheckboxChange(product.key)
                }}
                checked={isSelected}
                key={product.key}
              />
              <Texto ref={textRef} className={`checkable-button-text ${isSelected ? 'selected-text' : ''}`}>
                {product.ProductName}
              </Texto>
            </Horizontal>
            <Horizontal style={{ minWidth: 60, fontSize: 12 }}>
              <Texto className={`ml-3 checkable-button-text ${isSelected ? 'selected-text' : ''}`}>
                {!product?.IsPlaceholder ? fmt.currency(getAdditionalProductPrice(product?.Price)) : ''}
              </Texto>
            </Horizontal>
          </Horizontal>
        }
      />
    </Tooltip>
  )
}
