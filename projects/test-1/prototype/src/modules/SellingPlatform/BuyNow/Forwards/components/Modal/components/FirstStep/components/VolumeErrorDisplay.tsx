import { ClockCircleFilled } from '@ant-design/icons'
import { useForwardsCreation } from '@contexts/ForwardsContext'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import React, { useEffect } from 'react'

export function VolumeErrorDisplay({ form, volumeValue, constraints, deliveryPeriods, selectedSubtype }) {
  const { error, setError } = useForwardsCreation()
  useEffect(() => {
    validateMonthlyAndTotalVolumes(
      form,
      deliveryPeriods,
      constraints,
      selectedSubtype?.VolumeDistributionTypeMeaning,
      setError
    )
  }, [volumeValue])

  return (
    error && (
      <Horizontal
        className='px-4 py-2 round-border'
        style={{ backgroundColor: ' var(--theme-error-dim)' }}
        flex={1}
        verticalCenter
      >
        <Vertical verticalCenter flex={0}>
          <Horizontal verticalCenter style={{ gap: 10 }}>
            <ClockCircleFilled style={{ color: 'var(--theme-error)', fontSize: 12 }} />
            <Texto category='p2' appearance='error'>
              VOLUME ERROR
            </Texto>
          </Horizontal>
        </Vertical>
        <Vertical verticalCenter flex={0}>
          <Horizontal className='justify-end'>
            <Texto category='p2' weight={900} appearance='error'>
              {error}
            </Texto>
          </Horizontal>
        </Vertical>
      </Horizontal>
    )
  )
}

export const validateMonthlyAndTotalVolumes = (
  form,
  volumeRows,
  constraints,
  subtype,
  setError,
  setWarningMessage?,
  totalCreditBalance?
) => {
  const totalVolume = form.getFieldValue('Volume')
  if (setWarningMessage) {
    setWarningMessage('')
  }

  if (totalVolume !== undefined) {
    const volumeRowsOrderVolume = volumeRows.map((row) => parseInt(row.orderVolume))
    if (volumeRowsOrderVolume.includes(0)) {
      return setError('Order volume cannot be 0')
    }
    if (totalVolume > constraints.MaxVolume) {
      return setError(`Order volume cannot exceed max of ${fmt.decimal(constraints.MaxVolume, 0)} gal(s)`)
    }
    if (subtype === 'PullAnytime' && totalVolume < Math.max(constraints.MinVolume, constraints.MinMonthlyVolume)) {
      return setError(
        `Order volume must be at least ${fmt.decimal(
          Math.max(constraints.MinVolume, constraints.MinMonthlyVolume),
          0
        )} gal(s)`
      )
    }
    if (subtype !== 'PullAnytime' && totalVolume < constraints.MinVolume) {
      return setError(`Order volume must be at least ${fmt.decimal(constraints.MinVolume, 0)} gal(s)`)
    }
    if (subtype !== 'PullAnytime' && volumeRowsOrderVolume.some((volume) => volume < constraints.MinMonthlyVolume)) {
      return setError(`Order monthly volume must be at least ${fmt.decimal(constraints.MinMonthlyVolume, 0)} gal(s)`)
    }
    if (subtype !== 'PullAnytime' && volumeRowsOrderVolume.some((volume) => volume > constraints.MaxMonthlyVolume)) {
      return setError(
        `Order monthly volume cannot exceed max of ${fmt.decimal(constraints.MaxMonthlyVolume, 0)} gal(s)`
      )
    }
    if (totalVolume % constraints.VolumeIncrement !== 0) {
      return setError(`Order volume must be in increments of ${fmt.decimal(constraints.VolumeIncrement, 0)}`)
    }

    if (totalCreditBalance && totalCreditBalance - totalVolume < 0) {
      return setError(
        `Insufficient Credit (${fmt.decimal(totalCreditBalance, 0)} - ${fmt.decimal(totalVolume, 0)} = ${fmt.decimal(
          totalCreditBalance - totalVolume,
          0
        )})`
      )
    }

    if (setWarningMessage && totalVolume > constraints.WarningVolume) {
      setWarningMessage('You have entered a high volume. Please check before proceeding.')
      return setError('')
    }
  }

  return setError('')
}
