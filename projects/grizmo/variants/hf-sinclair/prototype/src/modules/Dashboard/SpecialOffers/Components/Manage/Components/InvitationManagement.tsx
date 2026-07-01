import { CheckOutlined, CloseOutlined, EditFilled } from '@ant-design/icons'
import { dateFormat } from '@components/TheArmory/helpers'
import { GraviButton, Horizontal, NotificationMessage, Texto } from '@gravitate-js/excalibrr'
import { useSpecialOffers } from '@modules/Dashboard/SpecialOffers/Api/useSpecialOffers'
import { Card, DatePicker, Form } from 'antd'
import Meta from 'antd/es/card/Meta'
import { useForm } from 'antd/lib/form/Form'
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'

export function InvitationManagement({ data, canWrite }: { data: any; canWrite: boolean }) {
  const [isEditing, setIsEditing] = useState(false)
  const [form] = useForm()
  const [isLoading, setIsLoading] = useState(false)
  const { saveNotificationDate } = useSpecialOffers()
  const invitationStatusDescription = useMemo(() => {
    if (!data)
      return (
        <Texto style={{ color: 'inherit' }} className={'text-14'}>
          N/A
        </Texto>
      )

    if (data.OfferInfo.InvitationNotificationSentDateTimeUTC) {
      return (
        <Texto>
          Sent:{' '}
          {moment
            .parseZone(data.OfferInfo.InvitationNotificationSentDateTimeUTC)
            .local()
            .format(dateFormat.MONTH_DATE_TIME)}
        </Texto>
      )
    }
    const canEdit = canWrite && moment(data.OfferInfo.VisibilityStartDateTime).isAfter(moment())
    return (
      <Horizontal verticalCenter justifyContent={'space-between'} style={{ height: '22px' }}>
        <Texto style={{ color: 'inherit' }} className={'text-14'}>
          Scheduled:{' '}
          {data.OfferInfo.InvitationNotificationTriggerDateTimeUTC
            ? moment
                .parseZone(data.OfferInfo.InvitationNotificationTriggerDateTimeUTC)
                .local()
                .format(dateFormat.MONTH_DATE_TIME)
            : 'Not Set'}
        </Texto>
        {canEdit && (
          <GraviButton className={'ghost-gravi-button p-0'} icon={<EditFilled />} onClick={() => setIsEditing(true)} />
        )}
      </Horizontal>
    )
  }, [data, canWrite])

  const handleSubmitForm = async (values) => {
    setIsLoading(true)
    try {
      await saveNotificationDate.mutateAsync({
        SpecialOfferId: data.OfferInfo.SpecialOfferId as number,
        InvitationTriggerDateTimeTZ: values.InvitationTriggerDateTime,
      })
      setIsEditing(false)
    } catch (e) {
      const message = e?.json?.Validations?.[0]?.Message || 'Could not update date'
      NotificationMessage('Unable to update date', message, true)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    if (isEditing) {
      const date =
        data.OfferInfo.InvitationNotificationSentDateTimeUTC || data.OfferInfo.InvitationNotificationTriggerDateTimeUTC
      if (date) {
        form.setFieldsValue({ InvitationTriggerDateTime: moment.parseZone(date).local() })
      } else {
        form.setFieldsValue({ InvitationTriggerDateTime: undefined })
      }
    }
  }, [isEditing])

  const getDisabledTime = (current: moment.Moment | null) => {
    if (!current) {
      return {}
    }

    const isToday = moment(current).isSame(moment(), 'day')
    const now = moment()
    const isVisStart = moment(current).isSame(moment(data.OfferInfo.VisibilityStartDateTime), 'day')
    const visStart = moment(data.OfferInfo.VisibilityStartDateTime)

    return {
      disabledHours: () => {
        const hours: number[] = []
        if (isToday) {
          for (let i = 0; i < now.hours(); i++) {
            hours.push(i)
          }
        }
        if (isVisStart) {
          for (let i = visStart.hours() + 1; i < 24; i++) {
            hours.push(i)
          }
        }
        return hours
      },
      disabledMinutes: (selectedHour: number) => {
        const minutes: number[] = []
        if (isToday && selectedHour === now.hours()) {
          for (let i = 0; i <= now.minutes(); i++) {
            minutes.push(i)
          }
        }
        if (isVisStart && selectedHour === visStart.hours()) {
          for (let i = visStart.minutes() + 1; i < 60; i++) {
            minutes.push(i)
          }
        }
        return minutes
      },
    }
  }
  useEffect(() => {
    if (data.OfferInfo.InvitationNotificationTriggerDateTimeUTC) {
      form.setFieldsValue({
        InvitationTriggerDateTime: moment.parseZone(data.OfferInfo.InvitationNotificationTriggerDateTimeUTC).local(),
      })
    } else {
      form.setFieldsValue({
        InvitationTriggerDateTime: undefined,
      })
    }
  }, [data.OfferInfo.InvitationNotificationTriggerDateTimeUTC])

  const editingInvitation = useMemo(() => {
    return (
      <Form onFinish={handleSubmitForm} form={form}>
        <Horizontal verticalCenter justifyContent={'space-between'}>
          <Horizontal flex={2}>
            <Form.Item name='InvitationTriggerDateTime' rules={[{ required: true, message: 'Date is required' }]}>
              <DatePicker
                disabledDate={(current) =>
                  current &&
                  (moment(current).isAfter(moment(data.OfferInfo.VisibilityStartDateTime).endOf('day')) ||
                    moment(current).isBefore(moment().startOf('day')))
                }
                disabledTime={getDisabledTime}
                showTime
              />
            </Form.Item>
          </Horizontal>
          <Horizontal flex={1} justifyContent={'flex-end'}>
            <GraviButton
              disabled={isLoading}
              style={{ borderRadius: '50%' }}
              error
              className={'mr-2'}
              icon={<CloseOutlined />}
              onClick={() => setIsEditing(false)}
            />

            <GraviButton
              loading={isLoading}
              style={{ borderRadius: '50%' }}
              success
              icon={<CheckOutlined />}
              onClick={() => form.submit()}
            />
          </Horizontal>
        </Horizontal>
      </Form>
    )
  }, [data])

  return (
    <div className='offer-info-item'>
      <Card className='offer-info-card'>
        <Meta title='Invitation Status' description={isEditing ? editingInvitation : invitationStatusDescription} />
      </Card>
    </div>
  )
}
