import { useUser } from '@contexts/UserContext'
import { Texto } from '@gravitate-js/excalibrr'
import { useQueryClient } from '@tanstack/react-query'
import { Select } from 'antd'
import React from 'react'

const { Option } = Select

export function ImpersonationSelect({ user }) {
  const { impersonationCounterparties } = useUser()
  const queryClient = useQueryClient()
  const currentCounterparty =
    localStorage.getItem('Gravitate-Current-CounterParty') || user?.Data?.CounterPartyId.toString()

  const onChange = async (value) => {
    localStorage.setItem('Gravitate-Impersonation-Mode', value === 'All' ? 'All' : 'single')
    localStorage.setItem('Gravitate-Current-CounterParty', value === 'All' ? 'All' : value)
    await queryClient.invalidateQueries({ queryKey: ['userInfo'] })
    window.location.reload()
  }

  if (user?.Data?.AllowedImpersonationModes?.length === 1 && user?.Data?.AllowedImpersonationModes.includes('Single')) {
    return null
  }
  return (
    <div className='flex-1 vertical-flex justify-sa p-4'>
      <Texto category='heading-small' className='mb-3' appearance='medium'>
        IMPERSONATION
      </Texto>
      <Select
        onChange={onChange}
        placeholder='All Companies'
        showSearch
        className='market-select'
        defaultValue={currentCounterparty}
        style={{ width: '100%' }}
        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
      >
        {impersonationCounterparties?.map((d) => (
          <Option value={d.Value} label={d.Text} key={d.Value}>
            {d.Text}
          </Option>
        ))}
      </Select>
    </div>
  )
}
