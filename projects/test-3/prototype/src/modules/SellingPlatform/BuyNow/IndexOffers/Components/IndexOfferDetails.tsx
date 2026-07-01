import { useIndexOffersContext } from '@contexts/IndexOffersContext'
import { BBDTag, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { formatWithCommas, parseCommas } from '@utils/index'
import { Form, InputNumber, Select } from 'antd'

export function IndexOfferDetails() {
  const { entryData } = useIndexOffersContext()
  const selectedOffer = entryData?.SelectedIndexOffer
  const constraints = selectedOffer?.Constraints

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
      return Promise.reject(new Error(`Volume must be at least ${fmt.decimal(constraints.MinVolume, 0)} gal(s)`))
    }
    if (constraints?.MaxVolume && value > constraints.MaxVolume) {
      return Promise.reject(new Error(`Volume cannot exceed max of ${fmt.decimal(constraints.MaxVolume, 0)} gal(s)`))
    }
    if (constraints?.VolumeIncrement && value % constraints.VolumeIncrement !== 0) {
      return Promise.reject(new Error(`Volume must be in increments of ${fmt.decimal(constraints.VolumeIncrement, 0)}`))
    }
    return Promise.resolve()
  }

  return (
    <Vertical flex={2}>
      <Texto category='h6' weight={900} className='mr-2'>
        DETAILS
      </Texto>
      <Horizontal className={'mt-4'}>
        <Vertical>
          <Texto>Product</Texto>
          <Texto className={'mt-2'} weight={'bold'}>
            {selectedOffer?.ProductName ?? '-'}
          </Texto>
        </Vertical>
        <Vertical>
          <Texto>Location</Texto>
          <Texto className={'mt-2'} weight={'bold'}>
            {selectedOffer?.LocationName ?? '-'}
          </Texto>
        </Vertical>
      </Horizontal>
      <Texto className={'mt-4'}>Volume</Texto>
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
        <BBDTag style={{ marginTop: 4 }}>GAL</BBDTag>
      </div>
      {loadingNumberOptions.length > 0 && (
        <>
          <Texto weight={'bold'} className={'mt-4'}>
            LOADING NUMBERS (OPTIONAL)
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
