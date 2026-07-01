import { fireEvent, screen } from '@testing-library/react'
import { renderWithMockedAPI } from '@tests/utils'
import React from 'react'

import { OrderVolume } from '../Components/Modal/Components/FirstStep/Components/OrderVolume'
import { calculationValues, initialValues } from './mocks/orderVolume'

describe('Order Volume', () => {
  // check if it renders
  it('should render with initial values', () => {
    const { getByText } = renderWithMockedAPI(<OrderVolume {...initialValues} form={initialValues.form} />)
    expect(getByText('ORDER VOLUME')).toBeDefined()

    initialValues.form.setFieldsValue({ ...initialValues.formData })

    const values = initialValues.form.getFieldsValue(true)
    expect(values.Period).toEqual(initialValues.formData.Period)
    expect(values.Volume).toEqual(initialValues.form.Volume)
  })

  it('volume value is updated correctly', () => {
    renderWithMockedAPI(<OrderVolume {...initialValues} />)

    const inputField = screen.getByTestId('volume-input')

    fireEvent.change(inputField, { target: { value: '5000' } })

    expect(inputField.value).toBe('5,000')
  })

  it('monthly volume is calculated correctly', async () => {
    renderWithMockedAPI(<OrderVolume {...calculationValues} form={calculationValues.form} />)

    calculationValues.form.setFieldsValue({ ...calculationValues.formData })

    const inputField = screen.getByTestId('volume-input')
    fireEvent.input(inputField, { target: { value: calculationValues.testVolumeInput } })

    expect(calculationValues.form.getFieldValue('Volume')).toBe(calculationValues.testVolumeInput)

    const monthlyVolume = fmt.decimal(calculationValues.form.getFieldValue('Volume') / calculationValues.periodCount, 0)

    const monthlyVolumeElement = screen.getByText('Monthly Volume')
    const monthlyVolumeValue = monthlyVolumeElement.nextElementSibling.textContent

    expect(monthlyVolumeValue).toBe(monthlyVolume)
  })

  // it('should have initialValue correct', () => {
  //   renderWithMockedAPI(<InitialValuesTest />)
  //   // const values = form.getFieldsValue()
  //   // expect(values === initialValues)
  // })
  //
  // it('should render', () => {
  //   const { getByText } = renderWithMockedAPI(<OrderVolume {...mockedProps} />)
  //   expect(getByText('Order Volume')).toBeDeafined()
  //   expect(getByText('APPLY VOLUME BY:')).toBeDefined()
  //
  //   const totalRadio = getByLabelText('Total')
  //
  //   // Simulate clicking the 'Total' radio button
  //   fireEvent.click(totalRadio)
  //
  //   // Verify that the setVolumePeriod function is called with the correct value
  //   expect(mockedProps.setVolumePeriod).toHaveBeenCalledWith(mockedProps.volumePeriod)
  // })
})
