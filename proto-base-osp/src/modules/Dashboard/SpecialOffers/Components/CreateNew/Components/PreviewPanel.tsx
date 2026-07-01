import { dateFormat } from '@components/TheArmory/helpers'
import { Texto, Vertical } from '@gravitate-js/excalibrr'
import {
  IndexPricingFormData,
  SpecialOfferMetadataResponseData,
} from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { PreviewDisplay } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/Components/ConfigureIndexPrice/Components/PreviewDisplay'
import { formatPricePerUnit, isDefinedAndNotNull } from '@utils/index'
import { Form } from 'antd'
import type { FormInstance } from 'antd'
import dayjs from '@utils/dayjs'
import type { Dayjs } from '@utils/dayjs'
import { useMemo } from 'react'

interface PreviewPanelProps {
  dealType?: number
  productLocation?: number[]
  pricingStrategy?: number
  targetCustomers?: string[]
  metadata?: SpecialOfferMetadataResponseData
  selectedVisibilityWindowStart?: Dayjs
  selectedVisibilityWindowEnd?: Dayjs
  selectedPickupWindowStart?: Dayjs
  selectedPickupWindowEnd?: Dayjs
  form: FormInstance
  isIndexPricing: boolean
  indexPricingData?: IndexPricingFormData | null
  isAuction: boolean
}

export function PreviewPanel({
  dealType,
  productLocation,
  pricingStrategy,
  targetCustomers,
  metadata,
  selectedVisibilityWindowStart,
  selectedVisibilityWindowEnd,
  selectedPickupWindowStart,
  selectedPickupWindowEnd,
  form,
  isIndexPricing,
  indexPricingData,
  isAuction,
}: PreviewPanelProps) {
  const dealTypeLabel = useMemo(() => {
    if (!dealType || !metadata?.SpecialOfferTemplates) return ''
    const item = metadata.SpecialOfferTemplates.find((t) => t.SpecialOfferTemplateId === dealType)
    return item?.Name || dealType
  }, [dealType, metadata])

  const getProductValue = () => {
    if (!productLocation || !productLocation?.length || !metadata?.ProductLocationSelections) return ''
    const item = metadata.ProductLocationSelections.find((p) => p.TradeEntrySetupId === productLocation?.[0])
    if (!item) return ''
    return (
      <Texto className={'text-wrap-whitespace text-14'}>
        {item?.ProductName} @ {item?.LocationName}
      </Texto>
    )
  }
  const getPricingStrategyValue = () => {
    if (isIndexPricing) {
      return <PreviewDisplay savedIndexData={indexPricingData} isAuction={isAuction} metadata={metadata} />
    }

    if (!dealType || !isDefinedAndNotNull(pricingStrategy)) return ''

    const dealName = metadata?.SpecialOfferTemplates.find((t) => t.SpecialOfferTemplateId === dealType)?.Name
    const preface = dealName?.includes('Auction') ? 'Reserve' : 'Fixed'
    const selection = metadata?.ProductLocationSelections?.find((p) => p.TradeEntrySetupId === productLocation?.[0])

    return (
      <Texto className={'text-wrap-whitespace text-14'}>
        {preface}:{' '}
        {formatPricePerUnit(pricingStrategy, {
          currencyName: selection?.CurrencySymbol,
          uomSymbol: selection?.UnitOfMeasureSymbol,
        })}
      </Texto>
    )
  }
  const visibilityStartTime = Form.useWatch('VisibilityWindowStartTime', form)
  const visibilityEndTime = Form.useWatch('VisibilityWindowEndTime', form)
  const pickupStartTime = Form.useWatch('PickupWindowStartTime', form)
  const pickupEndTime = Form.useWatch('PickupWindowEndTime', form)
  const selectedTimeZoneId = Form.useWatch('TimeZoneId', form)
  const selectedTimeZoneLabel = useMemo(() => {
    if (!selectedTimeZoneId || !metadata?.ValidTimeZoneIds) return ''
    return metadata.ValidTimeZoneIds.find((tz) => Number(tz.Value) === selectedTimeZoneId)?.Text ?? ''
  }, [selectedTimeZoneId, metadata])
  const getTimingWindowsValue = () => {
    if (
      !selectedVisibilityWindowStart ||
      !selectedVisibilityWindowEnd ||
      !selectedPickupWindowStart ||
      !selectedPickupWindowEnd
    )
      return ''
    const VisStartDateTime = dayjs(selectedVisibilityWindowStart)
      .set('hour', dayjs(visibilityStartTime, 'HH:mm').hour())
      .set('minute', dayjs(visibilityStartTime, 'HH:mm').minute())
    const VisEndDateTime = dayjs(selectedVisibilityWindowEnd)
      .set('hour', dayjs(visibilityEndTime, 'HH:mm').hour())
      .set('minute', dayjs(visibilityEndTime, 'HH:mm').minute())
    const PickStartDateTime = dayjs(selectedPickupWindowStart)
      .set('hour', dayjs(pickupStartTime, 'HH:mm').hour())
      .set('minute', dayjs(pickupStartTime, 'HH:mm').minute())
    const PickEndDateTime = dayjs(selectedPickupWindowEnd)
      .set('hour', dayjs(pickupEndTime, 'HH:mm').hour())
      .set('minute', dayjs(pickupEndTime, 'HH:mm').minute())
    return (
      <>
        {selectedTimeZoneLabel && (
          <Texto className={'text-wrap-whitespace text-12 mb-2'} appearance={'medium'}>
            Timezone: {selectedTimeZoneLabel}
          </Texto>
        )}
        <Texto>Visibility:</Texto>
        <Texto className={'text-wrap-whitespace text-14'}>
          {VisStartDateTime.format(dateFormat.SHORT_DATE_TIME_COMMA)} -{' '}
          {VisEndDateTime.format(dateFormat.SHORT_DATE_TIME_COMMA)}
        </Texto>
        <Texto>Pickup:</Texto>
        <Texto className={'text-wrap-whitespace text-14'}>
          {PickStartDateTime.format(dateFormat.SHORT_DATE_TIME_COMMA)} -{' '}
          {PickEndDateTime.format(dateFormat.SHORT_DATE_TIME_COMMA)}
        </Texto>
      </>
    )
  }
  const getTargetCustomersValue = () => {
    if (!targetCustomers || !metadata?.EligibleCounterParties) return ''
    if (targetCustomers.length === 0) return ''
    return <Texto className={'text-14'}>{targetCustomers.length} Customers</Texto>
  }
  const items = useMemo(
    () => [
      {
        label: 'Product & Location',
        value: getProductValue(),
      },
      { label: 'Pricing Strategy', value: getPricingStrategyValue() },
      { label: 'Timing Windows', value: getTimingWindowsValue() },
      { label: 'Target Customers', value: getTargetCustomersValue() },
    ],
    [
      productLocation,
      pricingStrategy,
      targetCustomers,
      metadata,
      selectedVisibilityWindowStart,
      selectedVisibilityWindowEnd,
      selectedPickupWindowStart,
      selectedPickupWindowEnd,
      visibilityStartTime,
      visibilityEndTime,
      pickupStartTime,
      pickupEndTime,
      isIndexPricing,
      indexPricingData,
      isAuction,
      selectedTimeZoneLabel,
    ]
  )

  return (
    <Vertical>
      <Vertical className={'mb-4'}>
        <Texto category={'h5'} className={'text-16'}>
          {dealTypeLabel}
        </Texto>
        <Texto className={'text-14 text-muted'}>What customers will see</Texto>
      </Vertical>
      {items.map((item) => (
        <Vertical
          className={`mb-4 p-3 border-radius-5 ${item.value ? 'bg-1 bordered' : 'bg-2 dotted-border'}`}
          key={item.label}
        >
          <Texto className={'text-muted mb-2'}>{item.label}</Texto>
          {item.value ? (
            item.value
          ) : (
            <Texto appearance={'medium'}>
              <em>Not configured</em>
            </Texto>
          )}
        </Vertical>
      ))}
    </Vertical>
  )
}
