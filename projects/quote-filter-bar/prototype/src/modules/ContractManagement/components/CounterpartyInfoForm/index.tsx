import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { ContractDetails } from '@modules/ContractManagement/api/types.schema'
import { useContracts } from '@modules/ContractManagement/api/useContracts'
import { Cascader, Form } from 'antd'
import React, { useMemo } from 'react'

interface FormProps {
  header: ContractDetails
  disableFields: boolean
}

export function CounterpartyInfoForm({ header, disableFields }: FormProps) {
  const { useALLContractManagementData } = useContracts()
  const { data: rawMetadata } = useALLContractManagementData()

  const ExternalCounterPartyCascadeOptions = useMemo(() => {
    return rawMetadata?.ExternalCounterPartyList?.map((counterparty) => {
      const matchingContacts = rawMetadata?.ExternalColleagueList?.filter(
        (colleague) => colleague.GroupingValue === counterparty.Value
      )

      // For external counterparties / contacts we've made contact optional, so if a counterparty has no associated contacts, we'll still show it in the list.
      return {
        value: counterparty.Value,
        label: counterparty.Text,
        children:
          matchingContacts?.length > 0
            ? matchingContacts.map((contact) => ({ value: contact.Value, label: contact.Text }))
            : [],
      }
    }).filter((item) => !!item)
  }, [rawMetadata])
  const InternalCounterPartyCascadeOptions = useMemo(() => {
    return rawMetadata?.InternalCounterPartyList?.map((counterparty) => {
      const matchingContacts = rawMetadata?.InternalColleagueList?.filter(
        (colleague) => colleague.GroupingValue === counterparty.Value
      )
      if (matchingContacts.length > 0) {
        return {
          value: counterparty.Value,
          label: counterparty.Text,
          children: matchingContacts.map((contact) => ({ value: contact.Value, label: contact.Text })),
        }
      }
    }).filter((item) => !!item)
  }, [rawMetadata])

  return (
    <Vertical flex='none' height='auto' className='bg-1 bordered pb-4' style={{ borderRadius: 8, overflow: 'hidden' }}>
      <Horizontal verticalCenter className='p-4 bg-2 border-bottom'>
        <Texto category='h6' className='ml-3 font-weight-normal'>
          Counterparty Info
        </Texto>
      </Horizontal>
      <Horizontal className='px-4 py-3'>
        <Vertical flex={1} className='my-2 mx-4'>
          <Texto category='heading-small' appearance='medium'>
            INTERNAL
          </Texto>
        </Vertical>
        <Vertical flex={1} className='my-2 mx-4'>
          <Texto category='heading' appearance='medium'>
            EXTERNAL
          </Texto>
        </Vertical>
      </Horizontal>
      <Horizontal className='px-4'>
        <Vertical flex={1} className='my-2 mx-4'>
          <Texto className='py-2'>Internal Counterparty / Contact</Texto>
          <Form.Item
            hasFeedback
            initialValue={
              header && [header?.InternalCounterPartyId?.toString(), header?.InternalColleagueId?.toString()]
            }
            name='InternalCounterparty'
            rules={[{ required: true, message: 'Please select an internal Counterparty' }]}
          >
            {rawMetadata && (
              <Cascader
                disabled={disableFields}
                options={InternalCounterPartyCascadeOptions}
                placeholder='Select an internal counterparty/contact'
                showSearch
                defaultValue={
                  header && [header?.InternalCounterPartyId?.toString(), header?.InternalColleagueId?.toString()]
                }
              />
            )}
          </Form.Item>
        </Vertical>
        <Vertical flex={1} className='my-2 mx-4'>
          <Texto className='py-2'> External Counterparty / Contact</Texto>
          <Form.Item
            name='ExternalCounterparty'
            rules={[{ required: true, message: 'Please select an external Counterparty' }]}
            hasFeedback
            initialValue={
              header && [header?.ExternalCounterPartyId?.toString(), header?.ExternalColleagueId?.toString()]
            }
          >
            {rawMetadata && (
              <Cascader
                options={ExternalCounterPartyCascadeOptions}
                placeholder='Select an external counterparty/contact'
                showSearch
                defaultValue={
                  header && [header?.ExternalCounterPartyId?.toString(), header?.ExternalColleagueId?.toString()]
                }
                disabled={disableFields}
                changeOnSelect
              />
            )}
          </Form.Item>
        </Vertical>
      </Horizontal>
    </Vertical>
  )
}
