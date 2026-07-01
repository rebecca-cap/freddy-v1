import { CheckOutlined, CloseOutlined, EditFilled } from '@ant-design/icons'
import { dateFormat } from '@components/TheArmory/helpers'
import { GraviButton, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { SpecialOfferBreakdownResponseData } from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { useSpecialOffersTyped } from '@modules/Dashboard/SpecialOffers/Api/useSpecialOffersTyped'
import { Card, DatePicker, Form } from 'antd'
import dayjs from '@utils/dayjs'
import type { Dayjs } from '@utils/dayjs'
import { useEffect, useMemo, useState } from 'react'

const { Meta } = Card

interface InvitationManagementProps {
  data: SpecialOfferBreakdownResponseData
  canWrite: boolean
}

export function InvitationManagement({ data, canWrite }: InvitationManagementProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [form] = Form.useForm()
  const [isLoading, setIsLoading] = useState(false)
  const { saveNotificationDate } = useSpecialOffersTyped()

  const timeZoneText = data?.OfferInfo?.TimeZoneAlias ?? null

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
          Sent: {dayjs(data.OfferInfo.InvitationNotificationSentDateTimeUTC).format(dateFormat.MONTH_DATE_TIME)}
          {timeZoneText ? ` ${timeZoneText}` : ''}
        </Texto>
      )
    }
    const canEdit = canWrite && dayjs(data.OfferInfo.VisibilityStartDateTime).isAfter(dayjs())
    return (
      <Horizontal verticalCenter justifyContent={'space-between'} style={{ height: '22px' }}>
        <Texto style={{ color: 'inherit' }} className={'text-14'}>
          Scheduled:{' '}
          {data.OfferInfo.InvitationNotificationTriggerDateTimeUTC
            ? `${dayjs(data.OfferInfo.InvitationNotificationTriggerDateTimeUTC).format(dateFormat.MONTH_DATE_TIME)}${
                timeZoneText ? ` ${timeZoneText}` : ''
              }`
            : 'Not Set'}
        </Texto>
        {canEdit && (
          <GraviButton className={'ghost-gravi-button p-0'} icon={<EditFilled />} onClick={() => setIsEditing(true)} />
        )}
      </Horizontal>
    )
  }, [data, canWrite, timeZoneText])

  const handleSubmitForm = async (values) => {
    setIsLoading(true)
    try {
      await saveNotificationDate.mutateAsync({
        SpecialOfferId: data.OfferInfo.SpecialOfferId as number,
        InvitationTriggerDateTimeTZ: values.InvitationTriggerDateTime?.format('YYYY-MM-DDTHH:mm:ss'),
      })
      setIsEditing(false)
    } catch (e) {
      // Error notification handled by mutation's onError in useSpecialOffers.ts
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    if (isEditing) {
      const date =
        data.OfferInfo.InvitationNotificationSentDateTimeUTC || data.OfferInfo.InvitationNotificationTriggerDateTimeUTC
      if (date) {
        form.setFieldsValue({ InvitationTriggerDateTime: dayjs(date) })
      } else {
        form.setFieldsValue({ InvitationTriggerDateTime: undefined })
      }
    }
  }, [isEditing])

  const getDisabledTime = (current: Dayjs | null) => {
    if (!current) {
      return {}
    }

    const isToday = dayjs(current).isSame(dayjs(), 'day')
    const now = dayjs()
    const isVisStart = dayjs(current).isSame(dayjs(data.OfferInfo.VisibilityStartDateTime), 'day')
    const visStart = dayjs(data.OfferInfo.VisibilityStartDateTime)

    return {
      disabledHours: () => {
        const hours: number[] = []
        if (isToday) {
          for (let i = 0; i < now.hour(); i++) {
            hours.push(i)
          }
        }
        if (isVisStart) {
          for (let i = visStart.hour() + 1; i < 24; i++) {
            hours.push(i)
          }
        }
        return hours
      },
      disabledMinutes: (selectedHour: number) => {
        const minutes: number[] = []
        if (isToday && selectedHour === now.hour()) {
          for (let i = 0; i <= now.minute(); i++) {
            minutes.push(i)
          }
        }
        if (isVisStart && selectedHour === visStart.hour()) {
          for (let i = visStart.minute() + 1; i < 60; i++) {
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
        InvitationTriggerDateTime: undefined,
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
                  (dayjs(current).isAfter(dayjs(data.OfferInfo.VisibilityStartDateTime).endOf('day')) ||
                    dayjs(current).isBefore(dayjs().startOf('day')))
                }
                disabledTime={getDisabledTime}
                showTime={{ use12Hours: true, format: 'hh:mm A' }}
                format='MM/DD/YY h:mm A'
              />
            </Form.Item>
            {timeZoneText && <Texto className='ml-2' style={{ marginTop: 5 }}>{timeZoneText}</Texto>}
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
        <Meta
          title={<Texto weight='600'>Invitation Status</Texto>}
          description={isEditing ? editingInvitation : invitationStatusDescription}
        />
      </Card>
    </div>
  )
}
