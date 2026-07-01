import { LoadingOutlined } from '@ant-design/icons'
import { CounterPartyMetadataResponse } from '@api/useCounterparties/types'
import { GraviButton, Horizontal, NothingMessage, NotificationMessage, Texto, Vertical } from '@gravitate-js/excalibrr'
import { UseMutationResult } from '@tanstack/react-query'
import { Form, Select } from 'antd'
import React, { useEffect, useState } from 'react'

interface ManageCounterpartiesProductLocationsProps {
  metadata: CounterPartyMetadataResponse
  selectedRow: any
  createOrUpdateMutation: UseMutationResult<any, unknown, any, unknown>
  isLoading: boolean
  canWrite: boolean
}
export function ManageCounterpartiesDistributionListTab({
  metadata,
  selectedRow,
  createOrUpdateMutation,
  isLoading,
  canWrite,
}: ManageCounterpartiesProductLocationsProps) {
  const [form] = Form.useForm()
  const [userHasChanges, setUserHasChanges] = useState(false)
  const [internalColleagues, setInternalColleagues] = useState([])
  const [externalColleagues, setExternalColleagues] = useState([])

  const InternalColleagueOptions = metadata?.InternalColleagueList?.map((item) => {
    return { value: item.Value, label: item.Text }
  })
  const ExternalColleagueOptions = metadata?.ExternalColleagueList?.map((item) => {
    return { value: item.Value, label: item.Text }
  })

  useEffect(() => {
    const MarketPlatformInternalColleagueIds = metadata?.MarketPlatformInternalColleagueIds?.map((id) => {
      const item = metadata?.InternalColleagueList?.find((col) => col.Value === id?.toString())
      return item?.Value
    })

    const MarketPlatformExternalColleagueIds = metadata?.MarketPlatformExternalColleagueIds?.map((id) => {
      const item = metadata?.ExternalColleagueList?.find((col) => col.Value === id?.toString())
      return item?.Value
    })

    setInternalColleagues(MarketPlatformInternalColleagueIds)
    setExternalColleagues(MarketPlatformExternalColleagueIds)

    form.resetFields()
    form.setFieldsValue({ MarketPlatformInternalColleagueIds })
    form.setFieldsValue({ MarketPlatformExternalColleagueIds })
    setUserHasChanges(false)
  }, [selectedRow, metadata])

  const cancelSelection = async () => {
    await setUserHasChanges(false)
    form.setFieldsValue({ MarketPlatformInternalColleagueIds: internalColleagues })
    form.setFieldsValue({ MarketPlatformExternalColleagueIds: externalColleagues })
  }

  const saveDistributionList = async () => {
    const MarketPlatformInternalColleagueIds: number[] = form
      .getFieldValue('MarketPlatformInternalColleagueIds')
      .map((id: string) => parseInt(id, 10))

    const MarketPlatformExternalColleagueIds: number[] = form
      .getFieldValue('MarketPlatformExternalColleagueIds')
      .map((id: string) => parseInt(id, 10))

    const updatedRow = {
      ...metadata,
      MarketPlatformInternalColleagueIds,
      MarketPlatformExternalColleagueIds,
    }
    const payload = { ...updatedRow }
    try {
      const response = await createOrUpdateMutation.mutateAsync(payload)
      if (response?.ActionStatus === 'Success' || response?.ActionStatus === 'Info') {
        setInternalColleagues(MarketPlatformInternalColleagueIds)
        setExternalColleagues(MarketPlatformExternalColleagueIds)
        setUserHasChanges(false)
        NotificationMessage('Counterparty distribution list updated', 'Market Platform email recipients updated', false)
      } else {
        NotificationMessage(
          'Counterparty distribution list could not be updated',
          'There was an error saving email(s)',
          true
        )
      }
    } catch (error) {
      console.log(error)
      NotificationMessage(
        'Counterparty distribution list could not be updated',
        'There was an error saving email(s)',
        true
      )
    }
  }

  if (!selectedRow) {
    return (
      <Vertical verticalCenter height='75%'>
        <Horizontal verticalCenter horizontalCenter>
          <NothingMessage
            title='Counterparty Not Selected'
            message='Select a counterparty to manage the related email distribution lists for it.'
          />
        </Horizontal>
      </Vertical>
    )
  }

  if (isLoading) {
    return (
      <Horizontal verticalCenter horizontalCenter width='100%'>
        <LoadingOutlined style={{ color: 'var(--theme-color-2', fontSize: 50 }} />
      </Horizontal>
    )
  }

  return (
    <Vertical className='bg-2'>
      <Horizontal className='bg-2 py-3 px-4 border-bottom'>
        <Texto category='h4'>Manage Counterparty Email Distribution List</Texto>
      </Horizontal>
      <Horizontal height='75%'>
        <Vertical verticalCenter horizontalCenter>
          <Form
            className='px-4'
            name='DistributionList'
            form={form}
            style={{ width: '100%', overflow: 'auto' }}
            onFinish={canWrite && saveDistributionList}
            onFieldsChange={() => setUserHasChanges(true)}
          >
            <Texto className='my-4' category='heading'>
              Market Platform Notifications
            </Texto>
            <Horizontal>
              <Texto category='h5'>Internal Colleagues</Texto>
            </Horizontal>
            <Horizontal className='pt-2 pb-4'>
              <Form.Item name='MarketPlatformInternalColleagueIds' style={{ width: '100%' }}>
                <Select
                  disabled={createOrUpdateMutation.isLoading || !canWrite}
                  optionFilterProp='children'
                  showSearch
                  allowClear
                  placeholder='Select Internal colleagues(s)'
                  options={InternalColleagueOptions}
                  mode='multiple'
                  filterOption={(input, option) => (option?.label ?? '')?.toLowerCase().includes(input.toLowerCase())}
                />
              </Form.Item>
            </Horizontal>
            <Texto category='h5'>External Colleagues</Texto>
            <Horizontal className='pt-2 pb-4'>
              <Form.Item name='MarketPlatformExternalColleagueIds' style={{ width: '100%' }}>
                <Select
                  disabled={createOrUpdateMutation.isLoading || !canWrite}
                  optionFilterProp='children'
                  showSearch
                  allowClear
                  placeholder='Select External colleagues(s)'
                  options={ExternalColleagueOptions}
                  mode='multiple'
                  filterOption={(input, option) => (option?.label ?? '')?.toLowerCase().includes(input.toLowerCase())}
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
          disabled={!userHasChanges || createOrUpdateMutation.isLoading || !canWrite}
        />
        <GraviButton
          theme2
          buttonText='Apply'
          style={{ width: 125 }}
          disabled={!userHasChanges || createOrUpdateMutation.isLoading || !canWrite}
          onClick={saveDistributionList}
        />
      </Horizontal>
    </Vertical>
  )
}
