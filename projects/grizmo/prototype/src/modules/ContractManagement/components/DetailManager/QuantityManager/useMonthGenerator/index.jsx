import { useEffect, useMemo, useState } from 'react'

import { distributeVolume, getMonthsInRange } from './util'

export const useMonthGenerator = ({ managedDetail, setManagedDetail }) => {
  const getQuantity = () => {
    const validMonthlies = managedDetail?.Quantities?.filter((q) => q.IsActive)
    if (managedDetail.FrequencyCodeValueDisplay === 'Per Month') {
      return managedDetail.Quantity / validMonthlies.length
    }
    return managedDetail.Quantity || 0
  }
  const [quantity, setQuantity] = useState(getQuantity())
  const [monthlyRows, setMonthlyRows] = useState([])

  // always maintain a total quantity for display
  const totalDetailQuantity = useMemo(() => {
    return monthlyRows?.map((row) => row.Quantity).reduce((a, b) => a + b, 0)
  }, [monthlyRows])

  useEffect(() => {
    setManagedDetail((prev) => {
      prev.Quantity = monthlyRows?.map((row) => row.Quantity).reduce((a, b) => a + b, 0)
      prev.Quantities = monthlyRows
      return prev
    })
  }, [monthlyRows])

  useEffect(() => {
    if (!managedDetail?.Quantity) {
      regenerateRows()
    } else {
      const validMonthlies = managedDetail?.Quantities?.filter((q) => q.IsActive)
      setMonthlyRows(validMonthlies)
    }
  }, [])

  const regenerateRows = () => {
    const months = getMonthsInRange(managedDetail)
    const monthlyQuantities = distributeVolume(
      months,
      quantity,
      managedDetail?.FrequencyCodeValueDisplay === 'Per Month'
    )
    setMonthlyRows(monthlyQuantities)

    const updatedQuantity = monthlyQuantities?.map((d) => d.Quantity).reduce((a, b) => a + b, 0)
    setManagedDetail((prev) => {
      prev.Quantity = updatedQuantity
      prev.Quantities = monthlyQuantities
      return prev
    })
  }
  // we will generate monthly rows when the user does the following:
  // 1. changes the quantity
  // 2. changes the frequency type (so per month / per contract)
  // 3. changes the effective dates.
  useEffect(() => {
    if (managedDetail?.ToDateTime && managedDetail?.FromDateTime && monthlyRows.length !== 0) {
      regenerateRows()
    }
  }, [managedDetail?.ToDateTime, managedDetail?.FromDateTime, quantity, managedDetail.FrequencyCodeValueDisplay])

  return { quantity, setQuantity, monthlyRows, setMonthlyRows, totalDetailQuantity }
}
