import { CheckCircleFilled, CloseCircleFilled, PlusOutlined } from '@ant-design/icons'
import { useAvailabilityMaintenance } from '@api/useAvailabilityMaintenance/useAvailabilityMaintenance'
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Button, Form, Input, Select, Tooltip } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'

export function AddVolumeGroup({ addingVolumeGroup, setAddingVolumeGroup, upsertVolumeGroup }) {
  const [isTextInput, setIsTextInput] = useState(true)
  const [form] = Form.useForm()
  const { useGetUnmappedAllocationsQuery } = useAvailabilityMaintenance()
  const { data: unmappedAllocations } = useGetUnmappedAllocationsQuery()
  const saveNewVolumeGroup = async (formValues) => {
    await upsertVolumeGroup.mutateAsync([{ ...formValues, IsActive: true }])
    setAddingVolumeGroup(false)
    form.resetFields()
  }
  const selectOptions = useMemo(
    () =>
      unmappedAllocations
        ?.map((alloc) => ({ label: alloc.AllocationName, value: alloc.AllocationId }))
        .sort((a, b) => a.label?.localeCompare(b.label || '')),
    [unmappedAllocations]
  )

  useEffect(() => {
    if (addingVolumeGroup) {
      form.resetFields()
    }
  }, [isTextInput])
  if (addingVolumeGroup) {
    return (
      <Vertical className='p-4' justifyContent='space-evenly'>
        {unmappedAllocations && unmappedAllocations.length > 0 ? (
          <Horizontal verticalCenter justifyContent='space-between' className='mb-2'>
            <Texto className='mr-4'>Choose Entry Method: </Texto>
            <Horizontal>
              <GraviButton
                className='ml-4'
                buttonText='Enter Manually'
                style={{ width: 150, borderRadius: '3px 0 0 3px' }}
                theme1={isTextInput}
                onClick={() => setIsTextInput(true)}
              />

              <Tooltip title='Associate volume group to TABS discretionary allocation'>
                <GraviButton
                  buttonText='Select from External'
                  style={{ width: 150, borderRadius: '0 3px 3px 0' }}
                  onClick={() => setIsTextInput(false)}
                  theme1={!isTextInput}
                />
              </Tooltip>
            </Horizontal>
          </Horizontal>
        ) : (
          <Horizontal />
        )}
        <Form name='AddVolumeGroup' form={form} onFinish={saveNewVolumeGroup} className='mb-2'>
          <Vertical className='full-height-width' justifyContent='space-between'>
            <Horizontal justifyContent='space-between' className='mb-2' alignItems='center'>
              {isTextInput || !unmappedAllocations ? (
                <>
                  <Texto>Name: </Texto>
                  <Form.Item name='AvailableVolumeName' rules={[{ required: true, message: 'Group name is required' }]}>
                    <Input placeholder='Enter a group name' style={{ minWidth: 350 }} />
                  </Form.Item>
                </>
              ) : (
                <>
                  <Texto>Group: </Texto>
                  <Form.Item name='AllocationId' rules={[{ required: true, message: 'Group is required' }]}>
                    <Select
                      showSearch
                      options={selectOptions}
                      placeholder='Select a volume group'
                      style={{ minWidth: 350 }}
                      allowClear
                      placement='topLeft'
                      filterOption={(input, option) => option?.label?.toLowerCase().includes(input.toLowerCase())}
                    />
                  </Form.Item>
                </>
              )}
            </Horizontal>
          </Vertical>
        </Form>
        <Horizontal style={{ gap: 10 }} justifyContent='end' alignItems='flex-end' className='mb-2'>
          <GraviButton
            icon={<CloseCircleFilled style={{ fontSize: 25 }} />}
            onClick={() => {
              setAddingVolumeGroup(false)
              form.resetFields()
            }}
            className='ghost-gravi-button'
            title='Cancel'
            aria-label='Cancel'
          />
          <GraviButton
            icon={<CheckCircleFilled style={{ fontSize: 25, color: 'var(--theme-success)' }} />}
            onClick={() => form.submit()}
            className='ghost-gravi-button'
            title='Save'
            aria-label='Save'
          />
        </Horizontal>
      </Vertical>
    )
  }
  return (
    <Horizontal className='p-4' horizontalCenter verticalCenter>
      <Button
        ghost
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderColor: 'transparent',
          boxShadow: 'none',
        }}
        onClick={() => setAddingVolumeGroup(true)}
      >
        <PlusOutlined className='mr-4' style={{ color: 'var(--theme-color-2)' }} />
        <Texto category='heading-small' appearance='secondary'>
          ADD VOLUME GROUP
        </Texto>
      </Button>
    </Horizontal>
  )
}
