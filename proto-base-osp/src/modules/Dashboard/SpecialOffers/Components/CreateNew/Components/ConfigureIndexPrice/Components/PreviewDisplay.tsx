import { BBDTag, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import {
  IndexPricingFormData,
  SpecialOfferMetadataResponseData,
} from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { getPriceAdjustValue } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/Util/indexConfigHelpers'
import { Divider } from 'antd'
import { useMemo } from 'react'

interface PreviewDisplayProps {
  savedIndexData?: IndexPricingFormData | null
  isAuction: boolean
  metadata?: SpecialOfferMetadataResponseData
}

export function PreviewDisplay({ savedIndexData, isAuction, metadata }: PreviewDisplayProps) {
  const displayItems = useMemo(() => {
    const effectiveTimeText =
      metadata?.IndexOfferMetaData?.EffectiveTimes?.find((item) => item.Value == savedIndexData?.PricingEffectiveTimes)
        ?.Text || ''
    return [
      { label: 'Effective Time:', value: effectiveTimeText },
      { label: 'Weekend Rule:', value: savedIndexData?.PricingWeekendBehavior },
      { label: 'Holiday Rule:', value: savedIndexData?.PricingHolidayBehavior },
    ]
  }, [savedIndexData, metadata?.IndexOfferMetaData])

  const formula = useMemo(() => {
    return savedIndexData?.PricingDisplayText || ''
  }, [savedIndexData?.PricingDisplayText])

  const priceAugment = useMemo(() => {
    return getPriceAdjustValue(savedIndexData, isAuction)
  }, [savedIndexData, isAuction])

  if (!savedIndexData) {
    return (
      <Vertical>
        <Texto className={'text-wrap-whitespace text-14'}>Index Pricing</Texto>
        <Texto>Not configured yet</Texto>
      </Vertical>
    )
  }
  return (
    <Vertical>
      <Horizontal gap={10} className={'mb-2'}>
        <Texto className={'text-wrap-whitespace text-14'}>Index Pricing</Texto> <BBDTag>Formula</BBDTag>
      </Horizontal>

      <Vertical>
        <Texto textTransform={'uppercase'} category={'label'} className={'text-muted'}>
          Pricing Display Name
        </Texto>
        <Texto className={'formula-text'}>{formula}</Texto>
      </Vertical>
      <Divider className={'my-2'} />
      <Horizontal justifyContent={'space-between'} style={{ width: '100%' }}>
        <Texto className={'text-muted'}>{isAuction ? 'Reserve Price' : 'Differential'}</Texto>
        <Texto
          appearance={isAuction ? 'default' : 'secondary'}
          style={
            !isAuction && savedIndexData?.FormulaDifferential < 0
              ? { color: 'var(--theme-error)', fontWeight: 'bold' }
              : undefined
          }
        >
          {priceAugment}
        </Texto>
      </Horizontal>
      <Divider className={'my-2'} />
      <Vertical gap={4}>
        <Texto textTransform={'uppercase'} className={'text-muted mb-2'} category={'label'}>
          Pricing Context
        </Texto>
        {displayItems.map(({ label, value }) => (
          <Horizontal key={label} justifyContent={'space-between'} style={{ width: '100%' }}>
            <Texto className={'text-muted'}>{label}</Texto>
            <Texto>{value}</Texto>
          </Horizontal>
        ))}
      </Vertical>
    </Vertical>
  )
}
