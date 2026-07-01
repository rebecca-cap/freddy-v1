import { GraviButton, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { isDefinedAndNotNull } from '@utils/index'
import { Checkbox, Tooltip } from 'antd'
import { FormInstance } from 'antd/lib/form/Form'
import React, { useEffect, useMemo } from 'react'

type AdditionalProductsProps = {
  form: FormInstance
  selectedItemMeta: any
  isPriceExpired: boolean
  formField: string
  orderEntryInfo?: any
  deliveryPeriods?: any
}

export function AdditionalProducts({
  form,
  selectedItemMeta,
  isPriceExpired,
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
    <div
      className='mx-4 my-3 justify-sb py-2 flex-row'
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr)', gap: 5 }}
    >
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
  const [isSelected, setIsSelected] = React.useState(form.getFieldValue('SelectedItems')?.includes(product.key))
  const [isEllipsis, setIsEllipsis] = React.useState(false)
  const textRef = React.useRef<HTMLSpanElement | null>(null)

  React.useEffect(() => {
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
        className='round-border checkable-button'
        success={isSelected}
        style={{
          borderRadius: 15,
          alignItems: 'center',
          display: 'flex',
        }}
        onClick={(event) => {
          event.stopPropagation()
          setIsSelected(!isSelected)
          handleCheckboxChange(product.key)
        }}
        buttonText={
          <Horizontal verticalCenter style={{ width: '100%', justifyContent: 'space-between' }}>
            <Horizontal verticalCenter style={{ gap: 5 }}>
              <Checkbox
                onClick={(event) => {
                  event.stopPropagation()
                  setIsSelected(!isSelected)
                  handleCheckboxChange(product.key)
                }}
                checked={isSelected}
                key={product.key}
              />
              <span
                ref={textRef}
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontSize: 12,
                }}
              >
                {product.ProductName}
              </span>
            </Horizontal>
            <Horizontal style={{ minWidth: 60, fontSize: 12 }}>
              <Texto className='ml-3' appearance={isSelected && 'white'}>
                {!product?.IsPlaceholder ? fmt.currency(getAdditionalProductPrice(product?.Price)) : ''}
              </Texto>
            </Horizontal>
          </Horizontal>
        }
      />
    </Tooltip>
  )
}
