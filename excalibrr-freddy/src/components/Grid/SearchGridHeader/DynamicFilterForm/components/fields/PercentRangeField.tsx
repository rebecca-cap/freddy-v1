import { Form, Input } from 'antd'
import { Horizontal } from '@components/Layout/Horizontal'
import { DataItem } from '@components/DataDisplay/DataItem'
import type { BaseFieldProps, Filter } from '../../types'
import { FormInstance } from 'antd/es/form/Form'
import { useEffect } from 'react'

export function PercentRangeField<F extends Filter>({
  title,
  filter_column,
  form,
  filters,
  setFilters,
}: BaseFieldProps<F> & {
  form: FormInstance
  filters: F
  setFilters?: (filters: F) => void
}) {
  const min = form.getFieldValue(`${filter_column as string}_min`)
  const max = form.getFieldValue(`${filter_column as string}_max`)
  useEffect(() => {
    if (min === '')
      setFilters?.({ ...filters, [`${filter_column as string}_min`]: null })
    if (max === '')
      setFilters?.({ ...filters, [`${filter_column as string}_max`]: null })
  }, [min, max])

  return (
    <Horizontal
      key={title}
      style={{
        alignItems: 'center',
        width: '200px',
        justifyContent: 'space-between',
        marginRight: '16px',
        position: 'relative',
      }}
      className='percent-range-input'
    >
      <DataItem
        label={`Min. ${title}`}
        labelExtras={{ style: { paddingTop: '0px' } }}
      >
        <Form.Item key={`${title}min`} name={`${filter_column as string}_min`}>
          <Input
            style={{ width: '75px', marginRight: '0' }}
            placeholder='Min %'
          />
        </Form.Item>
      </DataItem>
      <DataItem
        label={`Max. ${title}`}
        labelExtras={{ style: { paddingTop: '0px' } }}
      >
        <Form.Item
          key={`${title}min`}
          name={`${filter_column as string}_max`}
          style={{
            marginRight: '0px',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Input
            style={{ width: '75px', marginRight: '0' }}
            placeholder='Max %'
            className='right-aligned-percent-input'
          />
        </Form.Item>
      </DataItem>
    </Horizontal>
  )
}
