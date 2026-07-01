import { fireEvent } from '@testing-library/react'
import { renderWithMockedAPI } from '@tests/utils'
import React from 'react'

import { SubTypeSelect } from '../components/Modal/components/FirstStep/components/SubtypeSelect'
import { fakeSubtypes, initialValues, mockedProps, noSubtypeProps } from './mocks/subtypes'

describe('SubType Select', () => {
  it('should render', () => {
    const { getByText } = renderWithMockedAPI(<SubTypeSelect {...mockedProps} />)
    expect(getByText('DEAL TYPE')).toBeDefined()
  })

  it('should render skeleton without subtypes', () => {
    const { getByRole } = renderWithMockedAPI(<SubTypeSelect {...noSubtypeProps} />)
    expect(getByRole('heading').classList.contains('ant-skeleton-title')).toBe(true)
  })

  it('should have initialValue correct', () => {
    const form = {
      setFieldsValue: jest.fn(),
      getFieldsValue: jest.fn(),
    }
    renderWithMockedAPI(<SubTypeSelect {...mockedProps} form={form} />)
    const values = form.getFieldsValue()
    expect(values === initialValues)
  })

  it('should call setSubtype when a subtype is selected', () => {
    const form = {
      setFieldsValue: jest.fn(),
      getFieldsValue: jest.fn(),
    }
    const { getByText } = renderWithMockedAPI(<SubTypeSelect {...mockedProps} form={form} />)
    const option = getByText(fakeSubtypes[0].Name)
    fireEvent.click(option)
    const selectedOption = fakeSubtypes[0]
    expect(form.setFieldsValue).toHaveBeenCalledWith({ SelectedSubtype: { ...selectedOption } })
    expect(mockedProps.setSelectedSubtype).toHaveBeenCalledWith(selectedOption)
  })
})
