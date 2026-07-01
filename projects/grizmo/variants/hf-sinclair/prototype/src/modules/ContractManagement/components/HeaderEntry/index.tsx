import { FileAddOutlined } from '@ant-design/icons'
import { Footer } from '@components/shared/Navigation/Footer/Footer'
import { useContractManagementContext } from '@contexts/ContractManagement'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { isDefinedAndNotNull } from '@utils/index'
import { Form, Input, InputRef, Popover } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import moment from 'moment'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type { ContractDetails, ContractManagementMetadata } from '../../api/types.schema'
import {
  ConfirmTypeStrings,
  DateChangeConfirmContent,
} from '../../components/DateChangeConfirm/DateChangeConfirmContent'
import { pageStyles } from '../../page'
import { ConfirmTypes } from '../../utils'
import { AdditionalInfoForm } from '../AdditionalInfoForm'
import { ContractTypeCheckboxGroup } from '../ContractTypeCheckboxGroup'
import { CounterpartyInfoForm } from '../CounterpartyInfoForm'
import { TradeInfoForm } from '../TradeInfoForm'

type headerEntryProps = {
  header: ContractDetails
  metadata: ContractManagementMetadata
}

export function HeaderEntryView({ header, metadata }: headerEntryProps) {
  const { setPageMode, saveHeader, setHasContractEdits, disableFields, canWrite, details } =
    useContractManagementContext()
  const [isShowingDateConfirm, setIsShowingDateConfirm] = useState(false)
  const [confirmType, setConfirmType] = useState<ConfirmTypeStrings>()
  const [dateDiffs, setDateDiffs] = useState<number[]>([0, 0])
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const effectiveDates = Form.useWatch('EffectiveDates', form) as [moment.Moment, moment.Moment]
  const descriptionRef = useRef<InputRef>(null)

  useEffect(() => {
    if (header) {
      form.setFieldsValue(header)
    }
    if (!header && metadata) {
      form.setFieldsValue({ TradeInstrumentId: parseInt(metadata?.TradeInstrumentList?.[0]?.Value) })
    }
    descriptionRef.current?.focus()
  }, [header, metadata])

  const handleContractBackNavigation = () => {
    if (header?.TradeEntryId) {
      return setPageMode('details')
    }
    return navigate('/ContractManagement/Contracts')
  }
  const onValuesChange = (changedValues: any, allValues: any) => {
    setHasContractEdits(true)
    // if CascadeHeaderDatesToPrices is true, CascadeHeaderDatesToDetails must also be true
    if (isDefinedAndNotNull(changedValues?.CascadeHeaderDatesToDetails)) {
      if (!changedValues?.CascadeHeaderDatesToDetails && allValues?.CascadeHeaderDatesToPrices) {
        form.setFieldsValue({ CascadeHeaderDatesToPrices: false })
      }
    }
    if (isDefinedAndNotNull(changedValues?.CascadeHeaderDatesToPrices)) {
      if (changedValues?.CascadeHeaderDatesToPrices && !allValues?.CascadeHeaderDatesToDetails) {
        form.setFieldsValue({ CascadeHeaderDatesToDetails: true })
      }
    }
    if (isDefinedAndNotNull(changedValues?.EffectiveDates) && isDefinedAndNotNull(header?.EffectiveDates)) {
      const startDiff = moment(changedValues.EffectiveDates[0]).diff(moment(header.EffectiveDates[0]), 'days')
      const endDiff = moment(changedValues.EffectiveDates[1]).diff(moment(header.EffectiveDates[1]), 'days')

      setDateDiffs([startDiff, endDiff])
    }
  }

  const onFinish = (formData: any) => {
    saveHeader({
      ...formData,
      ...getCounterPartyContacts(formData.InternalCounterparty, formData.ExternalCounterparty, metadata),
      ...getTradeInstrumentType(formData?.TradeInstrumentId, metadata),
    })

    setPageMode('details')
  }

  const checkValuesAndSubmitForm = async () => {
    const pricesChecked = form.getFieldValue('CascadeHeaderDatesToPrices')
    const detailsChecked = form.getFieldValue('CascadeHeaderDatesToDetails')
    if (pricesChecked) {
      setConfirmType(ConfirmTypes.ALL_PRICES)
      setIsShowingDateConfirm(true)
      return
    }
    if (detailsChecked) {
      setConfirmType(ConfirmTypes.ALL_DETAILS)
      setIsShowingDateConfirm(true)
      return
    }
    try {
      await form.validateFields()
      form.submit()
    } catch (errorInfo) {
      const firstErrorField = form.getFieldsError().find((field) => field.errors.length > 0)

      if (firstErrorField) {
        const fieldName = firstErrorField.name?.[0]
        const input = document.querySelector(`[name="${fieldName}"], [id="${fieldName}"]`) as HTMLElement

        if (input) {
          input.focus()
          input.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
    }
  }

  return (
    <Vertical
      style={{
        padding: pageStyles.gridSpacing,
        gap: pageStyles.gridSpacing,
        overflow: 'default',
      }}
    >
      <Form style={{ fontSize: 'inherit' }} form={form} onFinish={onFinish} onValuesChange={onValuesChange}>
        <Horizontal style={{ gap: pageStyles.gridSpacing, padding: pageStyles.gridSpacing, flex: 1, height: '100%' }}>
          <Vertical flex='1 0 150px' className='bg-2 p-5 bordered'>
            <Texto category='h4' appearance='primary' style={pageStyles.heading}>
              Contract Type
            </Texto>
            <ContractTypeCheckboxGroup metadata={metadata} disableFields={disableFields} />
            <div className='mb-5'>
              <Texto category='h4' appearance='primary' style={pageStyles.heading}>
                Description
              </Texto>
              <Form.Item name='Description'>
                <Input type='text' ref={descriptionRef} />
              </Form.Item>
            </div>
            <div className='mb-5'>
              <Texto category='h4' appearance='primary' style={pageStyles.heading}>
                Comments
              </Texto>
              <Form.Item name='Comments'>
                <TextArea rows={4} />
              </Form.Item>
            </div>
          </Vertical>
          <Vertical flex={5}>
            <Vertical className='bg-2 bordered p-5' flex={1}>
              <Texto category='h4' appearance='primary' style={pageStyles.heading}>
                Contract Header
              </Texto>
              <Vertical style={{ gap: pageStyles.section.padding }}>
                <CounterpartyInfoForm header={header} disableFields={disableFields} />
                <TradeInfoForm showSetAllDateItems={details?.length > 0} form={form} metadata={metadata} />
                <AdditionalInfoForm metadata={metadata} />
              </Vertical>
            </Vertical>
            <Horizontal>
              <Popover
                title='Change All Dates?'
                content={
                  <DateChangeConfirmContent
                    setIsShowingDateConfirm={setIsShowingDateConfirm}
                    dateDiffs={dateDiffs}
                    details={details}
                    form={form}
                    confirmType={confirmType}
                    effectiveDates={effectiveDates}
                  />
                }
                visible={isShowingDateConfirm}
                placement='topRight'
              >
                <Footer
                  title='Header Entry'
                  icon={<FileAddOutlined />}
                  buttonTitle='Manage Details'
                  onClick={checkValuesAndSubmitForm}
                  canWrite={canWrite}
                  onClickCancel={() => {
                    handleContractBackNavigation()
                  }}
                  contract={header}
                />
              </Popover>
            </Horizontal>
          </Vertical>
        </Horizontal>
        <Form.Item name='detailsWithUpdatedDates' noStyle hidden />
      </Form>
    </Vertical>
  )
}

function getCounterPartyContacts(internal, external, metadata) {
  const internalCounterparty = metadata?.InternalCounterPartyList?.find((c) => c.Value === internal[0])
  const internalColleague = metadata?.InternalColleagueList?.find((c) => c.Value === internal[1])

  const externalCounterparty = metadata?.ExternalCounterPartyList?.find((c) => c.Value === external[0])
  const externalColleague = metadata?.ExternalColleagueList?.find((c) => c.Value === external[1])

  const splitExternalColleagueName = externalColleague?.Text?.split(' ')
  const splitInternalColleagueName = internalColleague?.Text?.split(' ')
  return {
    InternalCounterPartyId: internalCounterparty?.Value,
    InternalCounterPartyName: internalCounterparty?.Text,
    InternalColleagueId: internalColleague?.Value,
    InternalColleagueFirstName: splitInternalColleagueName?.[0],
    InternalColleagueLastName: splitInternalColleagueName?.[1],

    ExternalCounterPartyId: externalCounterparty?.Value,
    ExternalCounterPartyName: externalCounterparty?.Text,
    ExternalColleagueId: externalColleague?.Value,
    ExternalColleagueFirstName: splitExternalColleagueName?.[0],
    ExternalColleagueLastName: splitExternalColleagueName?.[1],
  }
}

function getTradeInstrumentType(tradeInstrumentId, metadata) {
  const selectedInstrument = metadata?.TradeInstrumentList.find((item) => item.Value === tradeInstrumentId.toString())
  return {
    TradeEntryTypeCvId: selectedInstrument?.GroupingValue,
  }
}
