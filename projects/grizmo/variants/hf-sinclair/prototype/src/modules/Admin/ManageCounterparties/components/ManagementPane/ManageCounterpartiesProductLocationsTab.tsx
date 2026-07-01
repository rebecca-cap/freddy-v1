import { CounterPartyMetadataResponse } from '@api/useCounterparties/types'
import { GraviButton, Horizontal, NothingMessage, NotificationMessage, Texto, Vertical } from '@gravitate-js/excalibrr'
import { UseMutationResult } from '@tanstack/react-query'
import { Form, Select } from 'antd'
import React, { useEffect, useState } from 'react'

interface ManageCounterpartiesProductLocationsProps {
  metadata: CounterPartyMetadataResponse
  selectedRow: any
  createOrUpdateMutation: UseMutationResult<any, unknown, any, unknown>
  canWrite: boolean
}
export function ManageCounterpartiesProductLocationsTab({
  metadata,
  selectedRow,
  createOrUpdateMutation,
  canWrite,
}: ManageCounterpartiesProductLocationsProps) {
  const [form] = Form.useForm()

  const [userHasChanges, setUserHasChanges] = useState(false)
  const [products, setProducts] = useState([])
  const [locations, setLocations] = useState([])

  const productOptions = metadata?.Data?.ProductList?.map((item) => {
    return { value: item.Value, label: item.Text }
  })
  const locationOptions = metadata?.Data?.LocationList?.map((item) => {
    return { value: item.Value, label: item.Text }
  })

  useEffect(() => {
    const SelectedProducts = selectedRow?.MappedProductIds?.map((id) => {
      const item = productOptions.find((product) => product.value === id.toString())
      return item?.value
    })

    const SelectedLocations = selectedRow?.MappedLocationIds?.map((id) => {
      const item = locationOptions.find((product) => product.value === id.toString())
      return item?.value
    })

    setProducts(SelectedProducts)
    setLocations(SelectedLocations)

    form.resetFields()
    form.setFieldsValue({ SelectedProducts })
    form.setFieldsValue({ SelectedLocations })
    setUserHasChanges(false)
  }, [selectedRow])

  const cancelSelection = async () => {
    await setUserHasChanges(false)
    form.setFieldsValue({ SelectedProducts: products })
    form.setFieldsValue({ SelectedLocations: locations })
  }

  const saveProductLocations = async () => {
    const MappedProductIds = form.getFieldValue('SelectedProducts')
    const MappedLocationIds = form.getFieldValue('SelectedLocations')

    const updatedRow = {
      ...selectedRow,
      MappedProductIds,
      MappedLocationIds,
    }
    const payload = [{ ...updatedRow }]
    const response = await createOrUpdateMutation.mutateAsync(payload)
    if (response?.ActionStatus === 'Success') {
      setProducts(MappedProductIds)
      setLocations(MappedLocationIds)
      setUserHasChanges(false)
      NotificationMessage('Counterparty updated', 'Product(s) / Location(s) updated', false)
    } else {
      NotificationMessage(
        'Counterparty could not be updated',
        'There was an error savingProduct(s) / Location(s)',
        false
      )
    }
  }

  if (!selectedRow) {
    return (
      <Vertical verticalCenter height='75%'>
        <Horizontal verticalCenter horizontalCenter>
          <NothingMessage
            title='Counterparty Not Selected'
            message='Select a counterparty to manage the related product(s)/locations(s) for it.'
          />
        </Horizontal>
      </Vertical>
    )
  }

  return (
    <Vertical className='bg-2'>
      <Horizontal className='bg-2 py-3 px-4 border-bottom'>
        <Texto category='h4'>Enabled Product / Locations</Texto>
      </Horizontal>
      <Horizontal height='75%'>
        <Vertical verticalCenter horizontalCenter>
          <Form
            className='px-4'
            name='CounterpartyProductLocations'
            form={form}
            style={{ width: '100%', overflow: 'auto' }}
            onFinish={canWrite && saveProductLocations}
            onFieldsChange={() => setUserHasChanges(true)}
          >
            <Texto category='h5'>Enabled Products</Texto>
            <Horizontal className='pt-2 pb-4'>
              <Form.Item name='SelectedProducts' style={{ width: '100%' }}>
                <Select
                  optionFilterProp='children'
                  showSearch
                  placeholder='Select Products(s)'
                  options={productOptions}
                  mode='multiple'
                  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                  disabled={!canWrite}
                />
              </Form.Item>
            </Horizontal>
            <Texto category='h5'>Enabled Locations</Texto>
            <Horizontal className='pt-2 pb-4'>
              <Form.Item name='SelectedLocations' style={{ width: '100%' }}>
                <Select
                  optionFilterProp='children'
                  showSearch
                  placeholder='Select Locations(s)'
                  options={locationOptions}
                  mode='multiple'
                  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                  disabled={!canWrite}
                />
              </Form.Item>
            </Horizontal>
          </Form>
        </Vertical>
      </Horizontal>
      <Horizontal className='justify-center' width='100%' style={{ gap: 20 }}>
        <GraviButton
          theme4
          buttonText='Cancel'
          style={{ width: 125 }}
          onClick={cancelSelection}
          disabled={!userHasChanges || !canWrite}
        />
        <GraviButton
          theme2
          buttonText='Apply'
          style={{ width: 125 }}
          disabled={!userHasChanges || !canWrite}
          onClick={saveProductLocations}
        />
      </Horizontal>
    </Vertical>
  )
}
