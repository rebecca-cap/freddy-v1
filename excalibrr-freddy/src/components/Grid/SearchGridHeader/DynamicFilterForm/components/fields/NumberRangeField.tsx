import { DataItem } from '@components/DataDisplay/DataItem'
import { Form, Input } from 'antd'
import { Fragment } from 'react'
import type { BaseFieldProps, Filter } from '../../types'

export function NumberRangeField<F extends Filter>({
  title,
  filter_column,
}: BaseFieldProps<F>) {
  return (
    <Fragment key={title}>
      <DataItem label={title}>
        <Form.Item key={`${title}min`} name={`${filter_column as string}_min`}>
          <Input style={{ width: '75px' }} placeholder='Min' />
        </Form.Item>
      </DataItem>
      <DataItem extraClass='detail-data-no-label mr-4'>
        <Form.Item key={`${title}max`} name={`${filter_column as string}_max`}>
          <Input style={{ width: '75px' }} placeholder='Max' />
        </Form.Item>
      </DataItem>
    </Fragment>
  )
}
