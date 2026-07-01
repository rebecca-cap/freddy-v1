import { ArrowLeftOutlined, CheckCircleFilled, EditOutlined, StopFilled, SyncOutlined } from '@ant-design/icons'
import { dateFormat } from '@components/TheArmory/helpers'
import { useContractManagementContext } from '@contexts/ContractManagement'
import { BBDTag, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { ContractDetails, ContractManagementMetadata, Detail } from '@modules/ContractManagement/api/types.schema'
import { Button, Divider } from 'antd'
import moment from 'moment'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { pageStyles } from '../../page'

interface SectionMenuProps {
  title: string
  backgroundColor?: string
  children: React.ReactNode
}

const SectionMenu: React.FC<SectionMenuProps> = ({ title, children, backgroundColor }) => {
  return (
    <Vertical
      className='mt-4'
      style={{
        border: '1px solid var(--gray-200)',
        borderRadius: 8,
        height: 'auto',
        backgroundColor: backgroundColor ?? 'white',
      }}
    >
      {title && (
        <Horizontal
          style={{
            backgroundColor: 'var(--bg-2)',
            borderBottom: '1px solid var(--gray-200)',
            padding: '1em',
          }}
        >
          <Texto category='h6' weight={600}>
            {title}
          </Texto>
        </Horizontal>
      )}
      <Horizontal style={{ padding: pageStyles.gridSpacing }}>{children}</Horizontal>
    </Vertical>
  )
}

const CounterpartyRender: React.FC<{ contract: ContractDetails }> = ({ contract }) => {
  return (
    <Vertical>
      <Horizontal justifyContent='space-between'>
        <Texto appearance='medium'>
          <b>Internal</b> Company
        </Texto>
        <Texto appearance='primary' category='h6'>
          {contract?.InternalCounterPartyName}
        </Texto>
      </Horizontal>
      <Horizontal justifyContent='space-between'>
        <Texto appearance='medium'>
          <b>Internal </b> Contact
        </Texto>
        <Texto align='right' appearance='primary'>
          {contract?.InternalColleagueFirstName} {contract?.InternalColleagueLastName}
        </Texto>
      </Horizontal>
      <Horizontal>
        <Divider />
      </Horizontal>
      <Horizontal justifyContent='space-between'>
        <Texto appearance='medium'>
          <b>External</b> Company
        </Texto>
        <Texto align='right' category='h6' appearance='primary'>
          {contract?.ExternalCounterPartyName}
        </Texto>
      </Horizontal>
      <Horizontal justifyContent='space-between'>
        <Texto appearance='medium'>
          <b> External </b>Contact
        </Texto>
        <Texto appearance='primary' align='right'>
          {contract.ExternalColleagueId
            ? `${contract?.ExternalColleagueFirstName} ${contract?.ExternalColleagueLastName}`
            : 'N/A'}
        </Texto>
      </Horizontal>
    </Vertical>
  )
}

export const TotalQuantityRender: React.FC<{ header: ContractDetails; details: Detail[] }> = ({ header, details }) => {
  return (
    <Vertical verticalCenter>
      <Horizontal verticalCenter justifyContent='space-between'>
        <Texto appearance='medium' className='mb-2' category='p2'>
          Require Quantities
        </Texto>
        <Texto appearance='medium' align='right' className='mb-2' weight={600} category='p2'>
          {header?.ContractManagementRequiresQuantities || header?.ContractManagementRequiresQuantities === null
            ? 'Total Quantity'
            : ''}
        </Texto>
      </Horizontal>
      <Horizontal verticalCenter justifyContent='space-between'>
        <BBDTag style={{ width: 'min-content' }} className='mr-0 mt-3' theme2>
          <Texto category='h6' appearance='secondary'>
            {header?.ContractManagementRequiresQuantities || header?.ContractManagementRequiresQuantities === null
              ? 'Yes'
              : 'No'}
          </Texto>
        </BBDTag>
        {(header?.ContractManagementRequiresQuantities || header?.ContractManagementRequiresQuantities === null) && (
          <Texto align='right' category='h1' appearance='secondary'>
            {fmt.decimal(
              details?.map((d) => d.Quantity).reduce((a, b) => a + b, 0),
              0
            )}
          </Texto>
        )}
      </Horizontal>
    </Vertical>
  )
}

const ContractDatesRender: React.FC<{ contract: ContractDetails; metadata: ContractManagementMetadata }> = ({
  contract,
  metadata,
}) => {
  const contractCalendarName =
    metadata?.PricingCalendars?.find((calendar) => calendar.Value === contract?.ValuationCalendarId?.toString())
      ?.Text || 'N/A'

  return (
    <Vertical>
      <Horizontal verticalCenter justifyContent='space-between'>
        <Texto appearance='medium'>Effective Dates</Texto>
        <Texto appearance='primary' category='h6'>
          {moment(contract?.EffectiveDates[0]).format('L')} - {moment(contract?.EffectiveDates[1]).format('L')}
        </Texto>
      </Horizontal>
      <Horizontal justifyContent='space-between'>
        <Texto appearance='medium'>Contract Date</Texto>
        <Texto appearance='primary'>{moment(contract?.TradeEntryDateTime).format('L')}</Texto>
      </Horizontal>
      <Horizontal justifyContent='space-between'>
        <Texto appearance='medium'>Contract Calendar</Texto>
        <Texto appearance='primary'>{contractCalendarName}</Texto>
      </Horizontal>
    </Vertical>
  )
}

export function HeaderDisplay({ debug = false }: { debug?: boolean }) {
  const { setPageMode, header, details, activeTabId, canWrite, metadata } = useContractManagementContext()

  const navigate = useNavigate()
  const showEdit = activeTabId === '0' && canWrite

  if (debug) {
    return (
      <Vertical scroll style={{ height: '100%', gap: pageStyles.gridSpacing }} flex={1} className=' bg-2 p-3 bordered'>
        <Button icon={<EditOutlined />} onClick={() => setPageMode('header')}>
          Edit Header Info
        </Button>
        <pre>{JSON.stringify(details, null, 2)}</pre>
      </Vertical>
    )
  }
  return (
    <div
      style={{
        height: '100%',
        overflow: 'auto',
        flexDirection: 'column',
      }}
      className=' bg-2 p-3 bordered'
    >
      <Horizontal>
        <Button
          style={{ color: 'inherit', padding: 0, marginLeft: '1em', height: '20px' }}
          type='link'
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/ContractManagement/Contracts')}
        >
          Back to All Contracts
        </Button>
      </Horizontal>
      <ContractStatusDisplay header={header} />
      {showEdit && (
        <Button icon={<EditOutlined />} onClick={() => setPageMode('header')} style={{ width: '100%' }}>
          Edit Header Info
        </Button>
      )}
      <Divider className='my-3' />
      <Horizontal verticalCenter justifyContent='space-between'>
        <Texto category='heading-small' style={{ fontSize: 11 }}>
          Contract Type
        </Texto>
        <div
          style={{
            backgroundColor: 'var(--theme-color-1-dim)',
            padding: '0.3rem',
            borderRadius: 16,
            maxWidth: 130,
          }}
        >
          <Texto appearance='primary' style={{ fontWeight: 600, textAlign: 'center', fontSize: 11 }}>
            {header?.TradeInstrumentName}
          </Texto>
        </div>
      </Horizontal>
      {header?.Description && <SectionMenu title='Description' children={<Texto>{header?.Description}</Texto>} />}
      <SectionMenu title='Counterparty Info' children={<CounterpartyRender contract={header} />} />
      <SectionMenu title='Contract Dates' children={<ContractDatesRender contract={header} metadata={metadata} />} />
      <Vertical justifyContent='flex-end' flex='none' height='auto'>
        <div>
          <SectionMenu
            backgroundColor='transparent'
            children={<TotalQuantityRender header={header} details={details} />}
          />
        </div>
      </Vertical>
    </div>
  )
}

function ContractStatusDisplay({ header }) {
  if (!header?.TradeEntryId) {
    return <PendingDisplay header={header} />
  }
  if (header?.OrderStatusCodeValueDisplay === 'Canceled') {
    return <CancelledDisplay header={header} />
  }
  if (header?.OrderStatusCodeValueDisplay === 'Accepted') {
    return <AcceptedDisplay header={header} />
  }
  if (header?.OrderStatusCodeValueDisplay === 'Draft') {
    return <DraftDisplay header={header} />
  }
  return <Texto category='h4'>Contract {header.TradeEntryId}</Texto>
}

function CancelledDisplay({ header }) {
  return (
    <Horizontal
      verticalCenter
      justifyContent='space-between'
      className='my-2 p-3 round-corner'
      style={{ background: 'var(--theme-error-dim)', border: 'solid 1px var(--theme-error)' }}
    >
      <Vertical flex={1} justifyContent='center'>
        <Texto category='h4' appearance='error'>
          Contract {header.TradeEntryId}
        </Texto>
        <Texto appearance='error'>Created: {moment(header.CreatedDateTime).format(dateFormat.DATE_TIME)}</Texto>
      </Vertical>
      <Horizontal flex='none' width='auto' alignItems='flex-end' verticalCenter>
        <Texto appearance='error' weight={500} category='h5' className='pr-2'>
          <b>Canceled</b>
        </Texto>
        <Texto appearance='error' category='h2'>
          <StopFilled />
        </Texto>
      </Horizontal>
    </Horizontal>
  )
}

function AcceptedDisplay({ header }) {
  return (
    <Horizontal
      verticalCenter
      justifyContent='space-between'
      className='my-2 p-3 round-corner'
      style={{ background: 'var(--theme-success-dim)', border: 'solid 1px var(--theme-success)' }}
    >
      <Vertical flex={1} justifyContent='center'>
        <Texto category='h4'>Contract {header.TradeEntryId}</Texto>
        <Texto>Created: {moment(header.CreatedDateTime).format(dateFormat.DATE_TIME)}</Texto>
      </Vertical>
      <Horizontal flex='none' width='auto' alignItems='flex-end' verticalCenter>
        <Texto appearance='success' weight={500} category='h5' className='pr-2'>
          <b>{header.OrderStatusCodeValueDisplay}</b>
        </Texto>
        <Texto appearance='success' category='h2'>
          <CheckCircleFilled />
        </Texto>
      </Horizontal>
    </Horizontal>
  )
}

function PendingDisplay({ header }) {
  return (
    <Horizontal
      verticalCenter
      justifyContent='space-between'
      className='my-2 p-3 round-corner'
      style={{ background: 'var(--theme-color-1-dim)', border: 'solid 1px var(--theme-color-1)' }}
    >
      <Vertical flex={1} justifyContent='center'>
        <Texto category='h4'>Creating Contract</Texto>
        <Texto>Enter your contract details.</Texto>
      </Vertical>
      <Horizontal flex='none' width='auto' alignItems='flex-end' verticalCenter>
        <Texto weight={500} category='h5' className='pr-2'>
          <b>Awaiting Save</b>
        </Texto>
        <Texto category='h2'>
          <SyncOutlined />
        </Texto>
      </Horizontal>
    </Horizontal>
  )
}

function DraftDisplay({ header }) {
  return (
    <Horizontal
      verticalCenter
      justifyContent='space-between'
      className='my-2 p-3 round-corner'
      style={{ background: 'var(--theme-color-1-dim)', border: 'solid 1px var(--theme-color-1)' }}
    >
      <Vertical flex={1} justifyContent='center'>
        <Texto category='h4'>Draft Saved</Texto>
        <Texto>Created: {moment(header.CreatedDateTime).format(dateFormat.DATE_TIME)}</Texto>
      </Vertical>
      <Horizontal flex='none' width='auto' alignItems='flex-end' verticalCenter>
        <Texto weight={500} category='h5' className='pr-2'>
          <b>Awaiting Activation</b>
        </Texto>
        <Texto category='h2'>
          <EditOutlined />
        </Texto>
      </Horizontal>
    </Horizontal>
  )
}
