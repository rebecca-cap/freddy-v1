import { ConfirmTypeStrings } from '@modules/ContractManagement/components/DateChangeConfirm/DateChangeConfirmContent'
import { isDefined } from '@utils/index'
import moment from 'moment'

// eslint-disable-next-line no-shadow
export enum ProvisionTypes {
  FIXED = 'Fixed',
  FORMULA = 'Formula',
  LESSEROF2 = 'Lesser Of 2',
  LESSEROF3 = 'Lesser Of 3',
  INTEGRATED = 'Integrated',
}
export const ConfirmTypes: { ALL_DETAILS: ConfirmTypeStrings; ALL_PRICES: ConfirmTypeStrings } = {
  ALL_DETAILS: 'ALL_DETAILS',
  ALL_PRICES: 'ALL_PRICES',
}
export function findMyType(variables, isExtracted) {
  const groups = groupVariables(variables)
  const x = Object.keys(groups)
  const typeByLength = [
    ProvisionTypes.FIXED,
    ProvisionTypes.FORMULA,
    ProvisionTypes.LESSEROF2,
    ProvisionTypes.LESSEROF3,
  ]
  return isExtracted ? ProvisionTypes.INTEGRATED : typeByLength[x.length]
}

export function groupVariables(variables, isExtracted?: boolean) {
  const groups = {}
  variables?.forEach((variable) => {
    if (isExtracted) {
      const group = variable.VariableName
      groups[group] = [variable]
    } else {
      const hasGroup = variable.VariableName.split('_').length
      if (hasGroup < 3) return ProvisionTypes.FIXED

      if (hasGroup === 4) {
        const group = variable.VariableName[variable.VariableName.length - 1]
        if (groups[group]) {
          groups[group].push(variable)
        } else {
          groups[group] = [variable]
        }
      }
    }
  })
  return groups
}

export const groupInList = (variables, isExtracted?: boolean) => {
  const array = []
  const groups = groupVariables(variables, isExtracted)

  Object.keys(groups).forEach((key) => {
    array.push(groups[key])
  })
  return array
}

export function getPriceStatus(newProvision, type, price, detailFromDate?, detailToDate?) {
  if (!newProvision.CurrencyId || !newProvision.UnitOfMeasureId || !newProvision.PayOrReceiveCodeValueDisplay) {
    return 'Needs Configuration'
  }
  if (type === ProvisionTypes.FIXED) {
    const provisionValue = price || newProvision.FixedValue

    if (!isDefined(provisionValue) || provisionValue === 0) {
      return 'Needs Price'
    }
  }

  const valuesArray = [ProvisionTypes.FIXED, ProvisionTypes.FORMULA, ProvisionTypes.LESSEROF2, ProvisionTypes.LESSEROF3]
  const grouping = groupInList(newProvision?.Formula?.FormulaVariables)
  if (grouping.length < valuesArray.indexOf(type) && type !== ProvisionTypes.FIXED) {
    return 'Needs Formula(s)'
  }

  if (detailFromDate && detailToDate && !priceHasValidDates(newProvision, detailFromDate, detailToDate)) {
    return 'Invalid Date(s)'
  }

  return 'Valid'
}

export const checkDetailForOverlappingPriceDates = (detail) => {
  const { Prices } = detail
  for (let i = 0; i < Prices.length; i++) {
    for (let j = i + 1; j < Prices.length; j++) {
      const price1 = Prices[i]
      const price2 = Prices[j]

      const fromDate1 = new Date(price1.FromDate)
      const toDate1 = new Date(price1.ToDate)
      const fromDate2 = new Date(price2.FromDate)
      const toDate2 = new Date(price2.ToDate)

      if (fromDate1 <= toDate2 && toDate1 >= fromDate2) {
        return true // Overlapping dates found
      }
    }
  }
  return false // No overlapping dates found
}

export const checkDetailForInvalidPriceDates = (detail) => {
  const { Prices, FromDateTime, ToDateTime } = detail
  Prices?.forEach((price) => {
    const hasValidDates = priceHasValidDates(price, FromDateTime, ToDateTime)
    if (!hasValidDates) {
      price.Status = 'Invalid Date(s)'
    } else {
      price.Status = 'Valid'
    }
  })
}

const priceHasValidDates = (price, FromDateTime, ToDateTime) => {
  const DetailFromDateTime = moment(FromDateTime).startOf('day')
  const DetailToDateTime = moment(ToDateTime).endOf('day')
  const priceFromDate = moment(price.FromDate).startOf('day')
  const priceToDate = moment(price.ToDate).endOf('day')

  if (priceFromDate < DetailFromDateTime || priceToDate > DetailToDateTime) {
    return false
  }
  return true
}

export const DetailEffectiveDatesFormValidator = async (_, value, header) => {
  if (!value || value.length !== 2) {
    return Promise.reject(new Error('Please select a valid date range'))
  }

  const contractFromDate = moment(header.EffectiveDates[0]).startOf('day')
  const contractToDate = moment(header.EffectiveDates[1]).endOf('day')
  const detailFromDate = moment(value[0]).startOf('day')
  const detailToDate = moment(value[1]).endOf('day')

  if (detailFromDate.isBefore(contractFromDate) || detailToDate.isAfter(contractToDate)) {
    return Promise.reject(new Error('Date range must be within contract dates'))
  }

  return Promise.resolve()
}
