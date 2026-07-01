import { ValueSetterParams } from 'ag-grid-community'
import { NotificationMessage } from '../../DataDisplay/NotificationMessage'

export const validateNotEmptyString = (params: ValueSetterParams) => {
  if (params.newValue !== '') {
    params.data[params.colDef.field!] = params.newValue
    return true
  } else {
    NotificationMessage('Field required', 'Please enter a value')
    return false
  }
}

export const validateInt = (
  params: ValueSetterParams,
  min: number,
  max: number
) => {
  const value = +params.newValue
  if (!isNaN(value)) {
    if ((min || min === 0) && value < min) {
      NotificationMessage(
        'Value is below minimum',
        'The minimum for this field is' + min + '.'
      )
      return false
    }
    if ((max || max === 0) && value > max) {
      NotificationMessage(
        'Value is above maximum',
        'The minimum for this field is' + max + '.'
      )
      return false
    }
    params.data[params.colDef.field!] = parseInt(params.newValue)
    return true
  }
  NotificationMessage('Value should be a number', 'Please enter numbers only.')
  return false
}

export const validateFloat = (
  params: ValueSetterParams,
  min: number,
  max: number
) => {
  const value = +params.newValue

  if (!isNaN(value)) {
    if ((min || min === 0) && value < min) {
      NotificationMessage(
        'Value is below minimum',
        `The minimum for this field is ${min}.`
      )
      return false
    }
    if ((max || max === 0) && value > max) {
      NotificationMessage(
        'Value is above maximum',
        `The minimum for this field is ${max}.`
      )
      return false
    }
    params.data[params.colDef.field!] = parseFloat(params.newValue)
    return true
  }
  NotificationMessage(
    'Value should be a number',
    'Please enter a valid number.'
  )
  return false
}
