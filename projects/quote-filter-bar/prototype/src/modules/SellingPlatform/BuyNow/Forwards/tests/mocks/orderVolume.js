import { renderHook } from '@testing-library/react'
import { Form } from 'antd'

import { fakeSubtypes } from './subtypes'

const { result } = await renderHook(() => Form.useForm())

export const initialValues = {
  selectedDealType: fakeSubtypes[0].VolumeDistributionTypeMeaning,
  formData: {
    Period: 'Total',
    Volume: undefined,
  },
  periodCount: 4,
  setVolumePeriod: jest.fn(),
  form: { ...result.current[0] },
}

export const calculationValues = {
  selectedDealType: fakeSubtypes[0].VolumeDistributionTypeMeaning,
  formData: {
    Period: 'Total',
    Volume: 400,
  },
  periodCount: 4,
  volumePeriod: 'Total',
  testVolumeInput: 800,
  form: { ...result.current[0] },
}

export const mockedProps = {
  selectedDealType: fakeSubtypes[0].VolumeDistributionTypeMeaning,
  periodCount: '',
  period: 'Total',
  setVolumePeriod: jest.fn(),
}
