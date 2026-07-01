import { Vertical } from '@gravitate-js/excalibrr'
import { SpecialOfferBreakdownResponseData } from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { useSpecialOffers } from '@modules/Dashboard/SpecialOffers/Api/useSpecialOffers'
import { SendReminderFooter } from '@modules/Dashboard/SpecialOffers/Components/Manage/Components/SendReminder/Components/SendReminderFooter'
import { SendReminderHeader } from '@modules/Dashboard/SpecialOffers/Components/Manage/Components/SendReminder/Components/SendReminderHeader'
import { Form, Modal } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { Dispatch, SetStateAction, useMemo, useRef, useState } from 'react'

import { CustomerSelectColumnDefs } from '../../../CreateNew/Components/SelectionGrid/Columns/CustomerSelectColumnDefs'
import { SelectionGrid } from '../../../CreateNew/Components/SelectionGrid/SelectionGrid'

interface SendReminderProps {
  data: SpecialOfferBreakdownResponseData | undefined
  sendReminderModalOpen: boolean
  setSendReminderModalOpen: Dispatch<SetStateAction<boolean>>
}

export function SendReminderModal({ data, sendReminderModalOpen, setSendReminderModalOpen }: SendReminderProps) {
  /*
   TODO:
    -get real data once new property is populated on EP
    -update current value
    -update row data
    -test flow
  */
  const [isLoading, setIsLoading] = useState(false)
  const gridRef = useRef()

  const { triggerInvitationNotification } = useSpecialOffers()
  const rowData = useMemo(() => {
    return data?.CustomerEngagement?.InvitedCounterParties || []
  }, [data])
  const [form] = useForm()
  const handleFormChange = (selection) => {
    form.setFieldsValue({ CounterPartyIds: selection.map((row) => row['Value']) })
  }
  const onClose = () => {
    form.resetFields()
    setSendReminderModalOpen(false)
  }

  const currentValue = Form.useWatch('CounterPartyIds', form) || []
  const onFinish = async (values) => {
    setIsLoading(true)
    try {
      await triggerInvitationNotification.mutateAsync({
        SpecialOfferId: data?.OfferInfo?.SpecialOfferId,
        CounterPartyIds: values.CounterPartyIds,
      })
    } finally {
      setIsLoading(false)
      onClose()
    }
  }
  return (
    <Modal
      centered
      visible={sendReminderModalOpen}
      onCancel={() => setSendReminderModalOpen(false)}
      footer={<SendReminderFooter isLoading={isLoading} onClose={onClose} form={form} currentValue={currentValue} />}
      title={<SendReminderHeader />}
      width={800}
    >
      <Form form={form} layout='vertical' onFinish={onFinish}>
        <Vertical style={{ fontSize: '12px' }}>
          <SelectionGrid
            rowData={rowData}
            handleFormChange={handleFormChange}
            idField={'Value'}
            colDefFunc={CustomerSelectColumnDefs}
            rowSelection={'multiple'}
            currentValue={currentValue}
            isLoading={isLoading}
            gridRef={gridRef}
          />
          <Form.Item name='CounterPartyIds' rules={[{ required: true, message: 'Customer is required' }]}>
            <div />
          </Form.Item>
        </Vertical>
      </Form>
    </Modal>
  )
}
