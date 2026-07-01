import { dateFormat } from '@components/TheArmory/helpers'
import { GraviButton, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { DatePicker, Form, Switch, Tooltip } from 'antd'
import { FormInstance } from 'antd/lib/form/Form'
import moment, { Moment } from 'moment'
import React from 'react'

type DateItem = Moment | Date | string | null
export interface OrderDatesProps {
  dateOverrideMaxDate?: DateItem
  dateOverrideMinDate?: DateItem
  currentFromDate: DateItem
  currentToDate: DateItem
  enteredFromDate: DateItem
  enteredToDate: DateItem
  form: FormInstance
  showDateOverrideFields?: boolean
  defaultEndDate?: DateItem
  setIsDateOverrideActive?: React.Dispatch<React.SetStateAction<boolean>>
  isDateOverrideActive?: boolean
  orderViewModal?: boolean
}

export function OrderDates({
  dateOverrideMaxDate,
  dateOverrideMinDate,
  currentFromDate,
  currentToDate,
  enteredFromDate,
  enteredToDate,
  form,
  showDateOverrideFields,
  defaultEndDate,
  setIsDateOverrideActive,
  isDateOverrideActive = false,
  orderViewModal = false,
}: OrderDatesProps) {
  const disabledFromDate = (current) =>
    moment(current).isBefore(moment(dateOverrideMinDate)) ||
    moment(current).isSameOrAfter(moment(dateOverrideMaxDate)) ||
    moment(current).isSameOrAfter(moment(enteredToDate)) ||
    moment(current).add(1, 'minute').isBefore(moment())
  const disabledToDate = (current) => {
    return (
      moment(current).isSameOrBefore(moment(dateOverrideMinDate)) ||
      moment(current).isSameOrBefore(moment(enteredFromDate)) ||
      moment(current).isAfter(moment(dateOverrideMaxDate))
    )
  }
  if (orderViewModal) {
    // view online order modal
    return (
      <>
        <Horizontal flex={1} verticalCenter className='m-1' justifyContent='flex-end'>
          <Horizontal flex={0.2} verticalCenter>
            <Texto category='p2' weight='bold'>
              From:
            </Texto>
          </Horizontal>
          <Horizontal flex={0.8} verticalCenter>
            <Form.Item name='FromDateTime' rules={[{ required: true, message: 'Please select a date' }]}>
              <DatePicker
                className='border-radius-5'
                showTime
                format={dateFormat.SHORT_DATE_YEAR_TIME_V2}
                size='small'
                style={{ width: '160px' }}
                disabledDate={disabledFromDate}
              />
            </Form.Item>
          </Horizontal>
        </Horizontal>
        <Horizontal flex={1} verticalCenter className='m-1' justifyContent='flex-end'>
          <Horizontal flex={0.2} verticalCenter>
            <Texto category='p2' weight='bold'>
              To:
            </Texto>
          </Horizontal>
          <Horizontal flex={0.8} verticalCenter>
            <Form.Item name='ToDateTime' rules={[{ required: true, message: 'Please select a date' }]}>
              <DatePicker
                className='border-radius-5 '
                showTime
                format={dateFormat.SHORT_DATE_YEAR_TIME_V2}
                showNow={false}
                size='small'
                style={{ width: '160px' }}
                disabledDate={disabledToDate}
              />
            </Form.Item>
          </Horizontal>
        </Horizontal>
      </>
    )
  }
  return (
    <>
      {showDateOverrideFields && (
        <Horizontal className='mt-1 mx-4 my-3 justify-sb'>
          <Texto style={{ color: 'var(--theme-option)' }} category='p2'>
            Override Order Dates
          </Texto>
          <Form.Item name='OverrideOrderDateTime' valuePropName='checked'>
            <Switch
              onChange={(checked: boolean) => {
                if (setIsDateOverrideActive) {
                  setIsDateOverrideActive(checked)
                }
                if (checked) {
                  form.setFieldsValue({ OverrideStartDate: moment(currentFromDate) })
                  form.setFieldsValue({
                    OverrideEndDate: currentToDate ? moment(currentToDate) : moment(defaultEndDate),
                  })
                }
              }}
              defaultChecked={isDateOverrideActive}
            />
          </Form.Item>
        </Horizontal>
      )}
      <Horizontal className='mt-1 mx-4 my-3 justify-sb'>
        <Texto style={{ color: 'var(--theme-option)' }} category='p2'>
          From
        </Texto>

        {!isDateOverrideActive ? (
          <Texto className='ml-1'>
            {currentFromDate ? moment(currentFromDate).format(dateFormat.SHORT_DATE_YEAR_TIME_V2) : ''}
          </Texto>
        ) : (
          <Form.Item
            name='OverrideStartDate'
            style={{ minWidth: '50%' }}
            rules={[{ required: true, message: 'Please select a date' }]}
          >
            <DatePicker
              className='w-full'
              showTime
              format={dateFormat.SHORT_DATE_YEAR_TIME_V2}
              disabledDate={disabledFromDate}
            />
          </Form.Item>
        )}
      </Horizontal>
      <Horizontal className='mt-1 mx-4 justify-sb'>
        <Texto style={{ color: 'var(--theme-option)' }} category='p2'>
          To
        </Texto>

        {!isDateOverrideActive ? (
          <>
            {currentToDate ? (
              <Texto className='ml-1'>{moment(currentToDate).format(dateFormat.SHORT_DATE_YEAR_TIME_V2)}</Texto>
            ) : (
              <Tooltip placement='leftTop' title='Enter volume and select lifting days to see order end date.'>
                <GraviButton className='ghost-gravi-button' buttonText={<Texto weight='normal'>- - -</Texto>} />
              </Tooltip>
            )}
          </>
        ) : (
          <Form.Item
            name='OverrideEndDate'
            style={{ minWidth: '50%' }}
            rules={[{ required: true, message: 'Please select a date' }]}
          >
            <DatePicker
              className='w-full'
              showTime
              format={dateFormat.SHORT_DATE_YEAR_TIME_V2}
              disabledDate={disabledToDate}
              showNow={false}
            />
          </Form.Item>
        )}
      </Horizontal>
    </>
  )
}
