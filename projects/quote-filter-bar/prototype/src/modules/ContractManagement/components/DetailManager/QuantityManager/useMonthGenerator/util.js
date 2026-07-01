import _ from 'lodash'
import moment from 'moment'

export function distributeVolume(months, quantity, isMonthlyDistribution) {
  const perMonthQuantity = isMonthlyDistribution ? quantity : Math.floor(quantity / months.length)
  const monthlyQuantities = months.map((month) => {
    return { Quantity: perMonthQuantity, IsActive: true, QuantityDateTime: month, TradeEntryQuantityId: 0 }
  })
  const floorSum = monthlyQuantities.map((item) => item.Quantity).reduce((a, b) => a + b, 0)
  let differenceToDistribute = quantity - floorSum

  while (differenceToDistribute > 0) {
    const q = monthlyQuantities[differenceToDistribute % monthlyQuantities.length]
    if (!q) break
    q.Quantity += 1
    differenceToDistribute -= 1
  }
  return monthlyQuantities
}

export function getMonthsInRange(managedDetail) {
  const months = []
  const managedDetailCopy = _.cloneDeep(managedDetail)
  if (!managedDetailCopy.EffectiveDates[0]) {
    alert('Please select a start date')
  }
  const startDate = moment(managedDetailCopy?.EffectiveDates[0]).startOf('month')
  const endDate = moment(managedDetailCopy?.EffectiveDates[1]).startOf('month')

  while (startDate.isSameOrBefore(endDate)) {
    const monthString = startDate.format()

    if (!months.includes(monthString)) {
      months.push(monthString)
    }
    startDate.add(1, 'month')
  }
  return months
}
