import { WarningFilled } from '@ant-design/icons'
import { BBDTag, GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Drawer, InputNumber } from 'antd'
import moment from 'moment'
import React, { useEffect, useMemo, useState } from 'react'

export function MonthlyVolumeDrawer({
  managedDetail,
  monthlyRows,
  setMonthlyRows,
  visible,
  onClose,
  totalDetailQuantity,
  canWrite,
  quantity,
}) {
  const [hasError, setHasError] = useState(false)
  const [formVolumes, setFormVolumes] = useState([...monthlyRows])
  const onChangeMonthRow = (updateIndex, value) => {
    const updatedRows = formVolumes.map((row, index) => {
      if (updateIndex === index) {
        return { ...row, Quantity: value }
      }
      return row
    })
    setFormVolumes(updatedRows)
    validationErrors(updatedRows)
  }
  useEffect(() => {
    setFormVolumes([...monthlyRows])
  }, [monthlyRows])

  useEffect(() => {
    validationErrors(monthlyRows)
  }, [managedDetail?.FrequencyCodeValueDisplay])

  const validationErrors = (updatedRows) => {
    const rowsTotalQuantity = updatedRows.map((item) => item.Quantity).reduce((a, b) => a + b, 0)
    if (rowsTotalQuantity !== totalDetailQuantity) {
      setHasError(true)
    } else {
      setHasError(false)
    }
  }
  const rowTotal = useMemo(() => formVolumes.map((item) => item.Quantity).reduce((a, b) => a + b, 0), [formVolumes])

  return (
    <Drawer
      destroyOnClose
      bodyStyle={{ padding: 0 }}
      title='Manage Monthly Volumes'
      visible={visible}
      onClose={onClose}
    >
      <Vertical flex={1} justifyContent='flex-end'>
        <Vertical flex='none' height='auto'>
          <TotalContractQuantity managedDetail={managedDetail} totalDetailQuantity={totalDetailQuantity} />
        </Vertical>
        <Vertical flex='0 1 auto' scroll>
          <Vertical flex='1 1 auto' justifyContent='flex-end'>
            <Texto className='mb-3 px-3' category='h5'>
              Monthly Volume
            </Texto>
          </Vertical>
          {formVolumes.map((row, index) => {
            return (
              <Horizontal
                flex='none'
                height='50px'
                className='monthly-volume  bg-3 my-2 py-3 pl-3 pr-1'
                key={`${row}-${index}`}
              >
                <Vertical verticalCenter flex={2}>
                  <Texto category='h6'>{moment(row.QuantityDateTime).format('MMM YY')}</Texto>
                </Vertical>
                <Vertical verticalCenter flex={1}>
                  <InputNumber
                    disabled={!canWrite}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                    value={row.Quantity}
                    size='large'
                    step={1000}
                    onChange={(value) => {
                      onChangeMonthRow(index, value)
                    }}
                    controls={false}
                  />
                </Vertical>
              </Horizontal>
            )
          })}
        </Vertical>

        <Horizontal className='justify-sb  my-2 py-2 px-3'>
          <Vertical verticalCenter flex='none'>
            <Texto category='heading-small'>Total</Texto>
          </Vertical>
          <Vertical verticalCenter flex={1}>
            <Texto category='h4' className='pr-3' align='right'>
              {fmt.decimal(rowTotal, 0)}
            </Texto>
          </Vertical>
        </Horizontal>
        <Vertical flex='none' height='80px'>
          {hasError && <VolumeError />}
        </Vertical>
        {canWrite && (
          <Horizontal verticalCenter flex='none' height='80px' className=' bg-3 px-3' justifyContent='right'>
            <GraviButton onClick={onClose} className='mr-3' buttonText='Cancel' />
            <GraviButton
              success
              buttonText='Save'
              disabled={hasError}
              onClick={() => {
                setMonthlyRows(formVolumes)
                onClose()
              }}
            />
          </Horizontal>
        )}
      </Vertical>
    </Drawer>
  )
}

function VolumeError() {
  return (
    <Horizontal
      flex={1}
      horizontalCenter
      className='p-3 round-border'
      style={{ backgroundColor: 'var(--theme-error', alignItems: 'center', gap: 10 }}
    >
      <WarningFilled style={{ color: 'white' }} />
      <Texto appearance='white' category='p2'>
        Monthly volumes do not match total.
      </Texto>
    </Horizontal>
  )
}

function TotalContractQuantity({ totalDetailQuantity, managedDetail }) {
  return (
    <Vertical className='mb-4 p-3 bg-2' flex='none' height='auto'>
      <Horizontal>
        <Texto category='h6'> Total Quantity</Texto>
      </Horizontal>
      <Horizontal justifyContent='space-between'>
        <Vertical verticalCenter>
          <Texto category='h2' appearance='secondary'>
            {fmt.decimal(totalDetailQuantity, 0)}
          </Texto>
        </Vertical>
        <Vertical alignItems='flex-end' flex={2} verticalCenter horizontalCenter>
          <Texto appearance='medium' align='right' className='mb-2' weight={600}>
            Frequency Type
          </Texto>
          <BBDTag className='mr-0' theme2>
            <Texto appearance='secondary' align='right' category='h6'>
              {managedDetail.FrequencyCodeValueDisplay}
            </Texto>
          </BBDTag>
        </Vertical>
      </Horizontal>
    </Vertical>
  )
}
