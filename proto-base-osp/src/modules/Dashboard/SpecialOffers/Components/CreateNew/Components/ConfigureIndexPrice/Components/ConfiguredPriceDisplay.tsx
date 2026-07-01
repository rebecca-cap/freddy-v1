import { CloseOutlined, EditOutlined, RiseOutlined } from '@ant-design/icons'
import { BBDTag, GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import {
  IndexPricingFormData,
  SpecialOfferMetadataResponseData,
} from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { getPriceAdjustValue } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/Util/indexConfigHelpers'
import { PriceAdjustLabel } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/Components/ConfigureIndexPrice/Components/PriceAdjustLabel'
import { Button, Popconfirm } from 'antd'
import { useMemo } from 'react'

interface ConfiguredPriceDisplayProps {
  savedIndexData: IndexPricingFormData | null
  onSaveIndexPricing: (formData: IndexPricingFormData | null) => void
  formula: string
  openConfig: React.Dispatch<React.SetStateAction<boolean>>
  isAuction: boolean
  metadata?: SpecialOfferMetadataResponseData
  uomSymbol?: string
}

export function ConfiguredPriceDisplay({
  savedIndexData,
  onSaveIndexPricing,
  formula,
  openConfig,
  isAuction,
  metadata,
  uomSymbol,
}: ConfiguredPriceDisplayProps) {
  const priceAugment = useMemo(() => {
    return getPriceAdjustValue(savedIndexData, isAuction)
  }, [savedIndexData, isAuction])

  const effectiveTime = useMemo(
    () =>
      metadata?.IndexOfferMetaData?.EffectiveTimes?.find((item) => item.Value == savedIndexData?.PricingEffectiveTimes)
        ?.Text || '',
    [metadata?.IndexOfferMetaData, savedIndexData?.PricingEffectiveTimes]
  )
  const priceStyle = useMemo(() => {
    if (!isAuction) {
      if (typeof savedIndexData?.FormulaDifferential === 'number' && savedIndexData.FormulaDifferential > 0) {
        return { color: 'var(--theme-success)', fontWeight: 'bold' }
      }
    }
  }, [isAuction, savedIndexData?.FormulaDifferential])
  return (
    <Vertical gap={16} className={'bordered border-radius-10 p-4'} verticalCenter>
      <Horizontal>
        <Vertical className={'index-pricing-icon-container'} verticalCenter horizontalCenter>
          <RiseOutlined style={{ color: 'var(--theme-color-1)', fontSize: '24px' }} />
        </Vertical>
        <Vertical gap={4} className={'ml-2'}>
          <Horizontal gap={10}>
            <Texto category={'h6'}>Index Pricing </Texto>
            <BBDTag>Formula</BBDTag>
          </Horizontal>
          <Texto>Active Configuration</Texto>
        </Vertical>
        <Popconfirm
          title={'Are you sure you want to delete this configuration?'}
          onConfirm={() => {
            onSaveIndexPricing(null)
          }}
          trigger={'click'}
        >
          <GraviButton className={'ghost-gravi-button'} icon={<CloseOutlined />} />
        </Popconfirm>
      </Horizontal>

      <Vertical
        className={'bordered p-4 border-radius-5'}
        style={{ flexWrap: 'wrap', whiteSpace: 'break-spaces', width: '100%', backgroundColor: 'var(--bg-2)' }}
      >
        <Texto>Pricing Display Name:</Texto>
        <Texto weight={'bold'} className={'formula-text'}>
          {formula}
        </Texto>
      </Vertical>
      <Vertical>
        <Texto>Components ({savedIndexData?.formulaComponents?.length})</Texto>
        <Horizontal style={{ flexWrap: 'wrap', width: '100%' }}>
          {savedIndexData?.formulaComponents?.map((component) => (
            <BBDTag
              style={{ background: 'var(--bg-1)' }}
              className={'m-1 '}
              key={`${component.DisplayName} + ${component.IdForGrid}`}
            >
              <Texto className={'text-wrap'}> {component.DisplayName}</Texto>
            </BBDTag>
          ))}
        </Horizontal>
      </Vertical>

      <Vertical
        className={'bordered p-2 border-radius-5'}
        style={{ flexWrap: 'wrap', whiteSpace: 'break-spaces', width: '100%', backgroundColor: 'var(--bg-3)' }}
      >
        <Texto className={'text-muted'}>
          <PriceAdjustLabel isAuction={isAuction} />
        </Texto>
        <Texto category={'h5'} appearance={isAuction ? 'default' : 'secondary'} style={priceStyle}>
          {priceAugment}
        </Texto>
        <Texto>per {uomSymbol ?? defaultUnitOfMeasureSymbol}</Texto>
      </Vertical>

      <Vertical gap={10}>
        <Horizontal justifyContent={'space-between'} style={{ width: '100%' }}>
          <Vertical flex={1} justifyContent={'flex-start'}>
            <Texto>Effective Time:</Texto>
            <Texto className={'text-14'}>{effectiveTime}</Texto>
          </Vertical>
          <Vertical flex={1}>
            <Texto>Weekend Rule:</Texto>
            <Texto className={'text-14'}>{savedIndexData?.PricingWeekendBehavior}</Texto>
          </Vertical>
        </Horizontal>
        <Horizontal>
          <Vertical>
            <Texto>Holiday Rule:</Texto>
            <Texto className={'text-14'}>{savedIndexData?.PricingHolidayBehavior}</Texto>
          </Vertical>
        </Horizontal>
      </Vertical>

      <Horizontal className={'mt-4'}>
        <Button className={'pl-0'} type={'link'} onClick={() => openConfig(true)}>
          <EditOutlined /> Edit Configuration
        </Button>
      </Horizontal>
    </Vertical>
  )
}
