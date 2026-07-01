import { ExpiryField } from '@components/shared/EntityReport/components/EntityAction/components/ViewOnlineOrderDetails/components/UpdateFields/ExpiryField'
import { PriceAndVolumeFields } from '@components/shared/EntityReport/components/EntityAction/components/ViewOnlineOrderDetails/components/UpdateFields/PriceAndVolumeFields'
import { Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { Model } from '@hooks/useOnlineOrderViewTypes'
import type { FormInstance } from 'antd'
import React, { useMemo, useState } from 'react'

export interface BidUpdateFieldsProps {
  orderDetails: Model
  form: FormInstance
  calculateVolumes: (value: number) => void
  canWrite: boolean
  showDateOverrideFields?: boolean
}
export function BidUpdateFields({
  orderDetails,
  form,
  calculateVolumes,
  canWrite,
  showDateOverrideFields,
}: BidUpdateFieldsProps) {
  const constraints = {
    VolumeConstraintMaximumVolume: orderDetails?.VolumeConstraintMaximumVolume,
    VolumeConstraintMinimumVolume: orderDetails?.VolumeConstraintMinimumVolume,
    VolumeConstraintMinimumVolumeIncrement: orderDetails?.VolumeConstraintMinimumVolumeIncrement,
    VolumeConstraintMonthlyMaximumVolume: orderDetails?.VolumeConstraintMonthlyMaximumVolume,
    VolumeConstraintMonthlyMinimumVolume: orderDetails?.VolumeConstraintMonthlyMinimumVolume,
    VolumeDistributionTypeCodeValueMeaning: orderDetails?.VolumeDistributionTypeCodeValueMeaning,
    VolumeConstraintWarningVolumeThreshold: orderDetails?.VolumeConstraintWarningVolumeThreshold,
  }
  const [volume, setVolume] = useState(0)
  const uomSymbol = orderDetails?.UnitOfMeasureSymbol ?? defaultUnitOfMeasureSymbol
  const volumeRules = [
    {
      validator: (_, value) => {
        const newPromise = Promise
        if (!value) {
          return newPromise.reject(new Error('Volume is required'))
        }
        if (value === 0) {
          return newPromise.reject(new Error('Volume cannot be 0'))
        }
        if (value < constraints.VolumeConstraintMinimumVolume) {
          return newPromise.reject(
            new Error(
              `Volume must be at least ${fmt.decimal(constraints.VolumeConstraintMinimumVolume, 0)} ${uomSymbol}(s)`
            )
          )
        }
        if (value > constraints.VolumeConstraintMaximumVolume) {
          return newPromise.reject(
            new Error(
              `Volume cannot exceed max of ${fmt.decimal(constraints.VolumeConstraintMaximumVolume, 0)} ${uomSymbol}(s)`
            )
          )
        }
        if (value % constraints.VolumeConstraintMinimumVolumeIncrement !== 0) {
          return newPromise.reject(
            new Error(
              `Volume must be in increments of ${fmt.decimal(constraints.VolumeConstraintMinimumVolumeIncrement, 0)}`
            )
          )
        }
        return newPromise.resolve()
      },
    },
  ]
  const getQuantityFieldStatus = useMemo(
    () => (getStatus?: boolean) => {
      const value = form.getFieldValue('Quantity')
      if (!value && value !== undefined) {
        return getStatus ? 'error' : 'Volume is required'
      }
      if (value && value === 0) {
        return getStatus ? 'error' : 'Volume cannot be 0'
      }
      if (value && value < constraints.VolumeConstraintMinimumVolume) {
        return getStatus
          ? 'error'
          : `Volume must be at least ${fmt.decimal(constraints.VolumeConstraintMinimumVolume, 0)} ${uomSymbol}(s)`
      }
      if (value && value > constraints.VolumeConstraintMaximumVolume) {
        return getStatus
          ? 'error'
          : `Volume cannot exceed max of ${fmt.decimal(constraints.VolumeConstraintMaximumVolume, 0)} ${uomSymbol}(s)`
      }
      if (value && value % constraints.VolumeConstraintMinimumVolumeIncrement !== 0) {
        return getStatus
          ? 'error'
          : `Volume must be in increments of ${fmt.decimal(constraints.VolumeConstraintMinimumVolumeIncrement, 0)}`
      }
      // change to warning volume when BE sends it
      if (value && value > constraints.VolumeConstraintWarningVolumeThreshold) {
        return getStatus ? 'warning' : 'High volume. Please check before proceeding.'
      }
      return undefined
    },
    [form.getFieldValue('Quantity'), volume]
  )

  const onVolumeChange = (value) => {
    setVolume(value)
    form.setFieldsValue({ Quantity: value })
    calculateVolumes(value)
  }
  if (!showDateOverrideFields) {
    return (
      <Horizontal verticalCenter className='m-1' justifyContent='flex-end' gap='15px'>
        <Horizontal flex={1} verticalCenter style={{ minWidth: '325px' }}>
          <PriceAndVolumeFields
            getQuantityFieldStatus={getQuantityFieldStatus}
            volumeRules={volumeRules}
            canWrite={canWrite}
            onVolumeChange={onVolumeChange}
            orderDetails={orderDetails}
          />
        </Horizontal>
        <ExpiryField canWrite={canWrite} orderDetails={orderDetails} />
      </Horizontal>
    )
  }
  return (
    <Horizontal flex={2} justifyContent='flex-end' style={{ maxWidth: '370px' }}>
      <Vertical flex={0.7} className='mr-2' style={{ minWidth: '170px', maxWidth: '170px' }}>
        <PriceAndVolumeFields
          getQuantityFieldStatus={getQuantityFieldStatus}
          volumeRules={volumeRules}
          canWrite={canWrite}
          onVolumeChange={onVolumeChange}
          orderDetails={orderDetails}
        />
      </Vertical>
      <Vertical flex={1.3} style={{ minWidth: '210px', maxWidth: '210px' }}>
        <Horizontal flex={1} />
        <ExpiryField canWrite={canWrite} orderDetails={orderDetails} />
      </Vertical>
    </Horizontal>
  )
}
