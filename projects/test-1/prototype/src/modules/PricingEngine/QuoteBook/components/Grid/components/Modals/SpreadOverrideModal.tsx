import '../../../../styles.css'

import { UpdateNotificationMessage } from '@components/shared/Grid/Messages/UpdateNotificationMessage'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { PublicationModes, Quote } from '@modules/PricingEngine/QuoteBook/api/types.schema'
import { UseMutationResult } from '@tanstack/react-query'
import { isDefinedAndNotNull } from '@utils/index'
import { InputNumber, Modal } from 'antd'
import React, { useEffect, useRef, useState } from 'react'

type SpreadOverrideModalProps = {
  isSpreadOverrideModalOpen: boolean
  setIsSpreadOverrideModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  selectedSpreadOverrideRow: Quote | undefined
  saveSpreadOverrides: UseMutationResult<any, unknown, any, unknown>
  publicationMode: PublicationModes
  handleAdjustmentUpdate: () => void

  originalRowData?: Quote[]
}

export function SpreadOverrideModal({
  isSpreadOverrideModalOpen,
  setIsSpreadOverrideModalOpen,
  selectedSpreadOverrideRow,
  saveSpreadOverrides,
  publicationMode,
  originalRowData,
  handleAdjustmentUpdate,
}: SpreadOverrideModalProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const defaultValue = selectedSpreadOverrideRow?.SpreadOverrideId
    ? selectedSpreadOverrideRow.SpreadOverride
    : selectedSpreadOverrideRow?.Adjustment
  const [overrideValue, setOverrideValue] = useState<number | null>(defaultValue ?? null)

  const anchorRow = originalRowData?.find(
    (row) => row.QuoteConfigurationMappingId === selectedSpreadOverrideRow?.SpreadParentMappingId
  )

  const applyOverride = async () => {
    const payload = {
      PublicationMode: publicationMode,
      QuoteConfigurationMappingId: selectedSpreadOverrideRow?.QuoteConfigurationMappingId,
      OverrideValue: overrideValue,
    }
    const response = await saveSpreadOverrides.mutateAsync(payload)
    UpdateNotificationMessage({ response, numberOfRecords: 1, title: 'Spread row(s) Save Successful' })
    setIsSpreadOverrideModalOpen(false)
  }

  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.select()
      }
    }, 100)
  }, [isSpreadOverrideModalOpen])

  return (
    <Modal
      className='spread-override-modal'
      visible={isSpreadOverrideModalOpen}
      title={<Texto category='h6'>Override Spread Differential</Texto>}
      destroyOnClose
      width={400}
      centered
      cancelButtonProps={{ disabled: saveSpreadOverrides?.isLoading, tabIndex: 1 }}
      onCancel={() => {
        setIsSpreadOverrideModalOpen(false)
      }}
      okButtonProps={{
        disabled: !isDefinedAndNotNull(overrideValue),
        loading: saveSpreadOverrides?.isLoading,
        tabIndex: 0,
      }}
      okText='Apply Override'
      onOk={() => {
        applyOverride().then(() => {
          handleAdjustmentUpdate()
        })
      }}
    >
      <Vertical>
        <Texto className='mb-2' category='h5'>
          Product:
        </Texto>
        <Texto className='mb-4' category='p2'>
          {selectedSpreadOverrideRow?.ProductName}
        </Texto>
        <Texto className='mb-2' category='h5'>
          Anchor row
        </Texto>
        <Texto className='mb-4' category='p2'>
          {anchorRow?.ProductName}
        </Texto>
        <Horizontal className='mb-4'>
          <Texto className='mr-2'>Current Differential:</Texto>
          <Texto>{fmt.currency(defaultValue ?? 0)}</Texto>
        </Horizontal>
        <Texto>Override Differential for Current Period</Texto>
        <InputNumber
          className='w-full mt-1'
          autoFocus
          defaultValue={defaultValue ?? 0}
          step='0.0001'
          prefix='$'
          precision={fmt.currentPrecision}
          onChange={(value) => setOverrideValue(value)}
          ref={inputRef}
        />
        <Texto className='mt-2' category='p2'>
          <span style={{ fontWeight: 'bolder' }}>Important: </span>This override will only apply to the current pricing
          period. The spread will revert to the standard value for future pricing periods.
        </Texto>
      </Vertical>
    </Modal>
  )
}
