import { dateFormat } from '@components/TheArmory/helpers'
import { useIndexOffersContext } from '@contexts/IndexOffersContext'
import { BBDTag, Texto, Vertical } from '@gravitate-js/excalibrr'
import { TitleText } from '@modules/SellingPlatform/BuyNow/IndexOffers/Components/TitleText'
import dayjs from '@utils/dayjs'
import { formatWithCommas, parseCommas } from '@utils/index'
import { Form, InputNumber, Select } from 'antd'
import styles from '../styles.module.css'

export function IndexOfferDetails() {
  const { entryData } = useIndexOffersContext()
  const selectedOffer = entryData?.SelectedIndexOffer
  const timeZoneAlias = entryData?.SpecialOfferData?.LocationTimeZoneAlias || serverTimeZoneAlias

  const formatLiftingDate = (date?: string) => {
    if (!date) return '-'
    return `${dayjs(date).format(dateFormat.MONTH_DATE_YEAR_TIME)}${timeZoneAlias ? ` ${timeZoneAlias}` : ''}`
  }
  const constraints = selectedOffer?.Constraints
  const uomSymbol = defaultUnitOfMeasureSymbol

  const loadingNumberOptions =
    selectedOffer?.LoadingNumbers?.map((ln) => ({
      value: ln.LoadingNumberId,
      label: `${ln.Display}`,
    })) ?? []

  const allowMultiple = selectedOffer?.Constraints?.AllowMultipleLoadingNumbers

  const volumeValidator = (_: unknown, value: number | null | undefined) => {
    if (value == null) {
      return Promise.reject(new Error('Volume is required'))
    }
    if (value === 0) {
      return Promise.reject(new Error('Volume cannot be 0'))
    }
    if (constraints?.MinVolume && value < constraints.MinVolume) {
      return Promise.reject(
        new Error(`Volume must be at least ${fmt.decimal(constraints.MinVolume, 0)} ${uomSymbol}(s)`)
      )
    }
    const effectiveMax = entryData?.SpecialOfferData?.EffectiveMaxPerOrder ?? constraints?.MaxVolume
    if (effectiveMax && value > effectiveMax) {
      return Promise.reject(new Error(`Volume cannot exceed max of ${fmt.decimal(effectiveMax, 0)} ${uomSymbol}(s)`))
    }
    if (constraints?.VolumeIncrement && value % constraints.VolumeIncrement !== 0) {
      return Promise.reject(new Error(`Volume must be in increments of ${fmt.decimal(constraints.VolumeIncrement, 0)}`))
    }
    return Promise.resolve()
  }

  return (
    <Vertical flex={2}>
      <TitleText title={'details'} />
      <div className={`mt-4 ${styles.detailsGrid}`}>
        <div>
          <Texto category={'p2'}>Product</Texto>
          <Texto className={'mt-1'} weight={'bold'}>
            {selectedOffer?.ProductName ?? '-'}
          </Texto>
        </div>
        <div>
          <Texto category={'p2'}> Location</Texto>
          <Texto className={'mt-1'} weight={'bold'}>
            {selectedOffer?.LocationName ?? '-'}
          </Texto>
        </div>
        <div>
          <Texto category={'p2'}>Lifting From</Texto>
          <Texto className={'mt-1'} weight={'bold'}>
            {formatLiftingDate(entryData?.SpecialOfferData?.OrderEffectiveStartDateTime)}
          </Texto>
        </div>
        <div>
          <Texto category={'p2'}>Lifting To</Texto>
          <Texto className={'mt-1'} weight={'bold'}>
            {formatLiftingDate(entryData?.SpecialOfferData?.OrderEffectiveEndDateTime)}
          </Texto>
        </div>
      </div>
      <Texto category={'p2'} className={'mt-4'}>
        Volume
      </Texto>
      <div className='mt-2' style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <Form.Item name='Volume' rules={[{ validator: volumeValidator }]}>
          <InputNumber
            placeholder={'Enter volume'}
            style={{ width: 200 }}
            min={0}
            step={constraints?.VolumeIncrement ?? 1}
            formatter={formatWithCommas}
            parser={parseCommas}
          />
        </Form.Item>
        <BBDTag style={{ marginTop: 4 }}>{uomSymbol?.toUpperCase()}</BBDTag>
      </div>
      {loadingNumberOptions.length > 0 && (
        <>
          <Texto weight={'bold'} className={'mt-4'}>
            LOADING NUMBERS
          </Texto>
          <Form.Item
            name='LoadingNumbersIds'
            rules={[{ required: true, message: 'Loading number(s) must be chosen' }]}
            style={{ flex: 1 }}
            className={'mt-2'}
          >
            <Select
              placeholder='Select Loading Number(s)'
              allowClear
              showSearch
              mode={allowMultiple ? 'multiple' : undefined}
              options={loadingNumberOptions}
              optionFilterProp='label'
            />
          </Form.Item>
        </>
      )}
    </Vertical>
  )
}
