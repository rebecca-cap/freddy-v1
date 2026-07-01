import { dateFormat } from '@components/TheArmory/helpers'
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { createDisabledTimeForDate } from '@modules/Dashboard/SpecialOffers/utils/Utils/TimingWindowHelpers'
import { Checkbox, DatePicker, Form, TimePicker } from 'antd'
import { FormInstance } from 'antd/lib/form/Form'
import moment from 'moment'
import { useCallback, useEffect, useMemo, useState } from 'react'

interface SelectInvitationDateProps {
  form: FormInstance
  selectedVisibilityWindowStart?: moment.Moment
  selectedVisibilityWindowStartTime?: moment.Moment
  onSetToFutureTime: () => void
}

export function SelectInvitationDate({
  form,
  selectedVisibilityWindowStart,
  selectedVisibilityWindowStartTime,
  onSetToFutureTime,
}: SelectInvitationDateProps) {
  const sendOnCreate = Form.useWatch('SendInvitesOnCreate', form)
  const inviteTriggerDate = Form.useWatch('InviteTriggerDate', form)
  const inviteTriggerTime = Form.useWatch('InviteTriggerTime', form)

  // Refresh "now" periodically to prevent stale closure in time comparisons
  const [currentMinute, setCurrentMinute] = useState(() => moment().startOf('minute'))

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMinute(moment().startOf('minute'))
    }, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const getDisabledDate = useCallback(
    (current: moment.Moment) => {
      if (!current) return false
      if (moment(current).isSame(moment(), 'day')) return false
      return (
        moment(current).isBefore(moment(), 'day') ||
        (selectedVisibilityWindowStart ? moment(current).isAfter(moment(selectedVisibilityWindowStart), 'day') : false)
      )
    },
    [selectedVisibilityWindowStart]
  )

  const getDisabledTimeWithVisibilityCheck = useCallback(() => {
    const baseDisabled = createDisabledTimeForDate(inviteTriggerDate)

    if (!selectedVisibilityWindowStart || !selectedVisibilityWindowStartTime) {
      return baseDisabled
    }

    const inviteDate = inviteTriggerDate || moment()
    const visibilityStartDate = moment(selectedVisibilityWindowStart)

    if (!moment(inviteDate).isSame(visibilityStartDate, 'day')) {
      return baseDisabled
    }

    const visibilityHour = selectedVisibilityWindowStartTime.hours()
    const visibilityMinute = selectedVisibilityWindowStartTime.minutes()

    return {
      disabledHours: () => {
        const disabled = baseDisabled.disabledHours?.() || []
        // Disable hours after visibility start
        for (let i = visibilityHour + 1; i < 24; i++) {
          if (!disabled.includes(i)) {
            disabled.push(i)
          }
        }
        return disabled
      },
      disabledMinutes: (selectedHour: number) => {
        const disabled = baseDisabled.disabledMinutes?.(selectedHour) || []

        if (selectedHour === visibilityHour) {
          // Disable minutes after visibility start minute
          for (let i = visibilityMinute + 1; i < 60; i++) {
            if (!disabled.includes(i)) {
              disabled.push(i)
            }
          }
        }
        return disabled
      },
    }
  }, [inviteTriggerDate, selectedVisibilityWindowStart, selectedVisibilityWindowStartTime])

  const validateTriggerDate = useCallback(
    (_, value: moment.Moment) => {
      if (sendOnCreate) {
        return Promise.resolve()
      }
      if (!value) {
        return Promise.reject(new Error('Date is required'))
      }
      if (getDisabledDate(value)) {
        return Promise.reject(new Error('Adjust date'))
      }
      return Promise.resolve()
    },
    [sendOnCreate, getDisabledDate]
  )

  const validateTriggerTime = useCallback(
    (_, value: moment.Moment) => {
      if (sendOnCreate) {
        return Promise.resolve()
      }
      if (!value) {
        return Promise.reject(new Error('Invite time is required'))
      }

      const disabledConfig = getDisabledTimeWithVisibilityCheck()
      const selectedHour = value.hours()
      const selectedMinute = value.minutes()

      const disabledHours = disabledConfig.disabledHours?.() || []
      if (disabledHours.includes(selectedHour)) {
        return Promise.reject(new Error('Adjust time'))
      }

      const disabledMinutes = disabledConfig.disabledMinutes?.(selectedHour) || []
      if (disabledMinutes.includes(selectedMinute)) {
        return Promise.reject(new Error('Adjust time'))
      }

      return Promise.resolve()
    },
    [sendOnCreate, getDisabledTimeWithVisibilityCheck]
  )

  const isTimeInPast = useMemo(() => {
    if (sendOnCreate || !inviteTriggerDate || !inviteTriggerTime) {
      return false
    }

    const triggerDateTime = moment(inviteTriggerDate)
      .hours(inviteTriggerTime.hours())
      .minutes(inviteTriggerTime.minutes())
      .seconds(0)

    return !triggerDateTime.clone().startOf('minute').isAfter(currentMinute)
  }, [sendOnCreate, inviteTriggerDate, inviteTriggerTime, currentMinute])

  const warnings = useMemo(() => {
    const errors: { text: string }[] = []

    if (sendOnCreate) {
      return errors
    }

    if (inviteTriggerDate && inviteTriggerTime) {
      const triggerDateTime = moment(inviteTriggerDate)
        .hours(inviteTriggerTime.hours())
        .minutes(inviteTriggerTime.minutes())
        .seconds(0)

      const triggerMinute = triggerDateTime.clone().startOf('minute')

      if (!triggerMinute.isAfter(currentMinute)) {
        errors.push({
          text: 'Invitation date and time must be at least 1 minute in the future',
        })
      }

      if (selectedVisibilityWindowStart && selectedVisibilityWindowStartTime) {
        const visibilityStartDateTime = moment(selectedVisibilityWindowStart)
          .hours(selectedVisibilityWindowStartTime.hours())
          .minutes(selectedVisibilityWindowStartTime.minutes())
          .seconds(0)

        if (triggerDateTime.startOf('minute').isAfter(visibilityStartDateTime.startOf('minute'))) {
          errors.push({
            text: 'Invitation date and time must be at or before the Visibility Start',
          })
        }
      }
    }

    return errors
  }, [
    sendOnCreate,
    inviteTriggerDate,
    inviteTriggerTime,
    selectedVisibilityWindowStart,
    selectedVisibilityWindowStartTime,
    currentMinute,
  ])

  return (
    <Vertical className={'p-4 bordered mb-4 border-radius-5'}>
      <Horizontal justifyContent='space-between' verticalCenter>
        <Texto category={'h5'}>Send Invites</Texto>
      </Horizontal>
      <Horizontal className={'gap-10 mb-2'} verticalCenter>
        <Form.Item name={'SendInvitesOnCreate'} valuePropName='checked'>
          <Checkbox
            onChange={(check) => {
              if (check) form.resetFields(['InviteTriggerDate'])
            }}
          />
        </Form.Item>
        <Texto className={'text-14'}>Send Invites on Create</Texto>
      </Horizontal>
      <Horizontal className={'gap-10 mb-2'} style={{ width: '100%' }}>
        <Texto className={`text-14 pt-1`} appearance={sendOnCreate ? 'hint' : 'default'}>
          Invite Trigger Date:
        </Texto>
        <Horizontal className={'gap-10'}>
          <Form.Item name={'InviteTriggerDate'} rules={[{ validator: validateTriggerDate }]}>
            <DatePicker
              disabled={sendOnCreate}
              format={dateFormat.DATE_SLASH}
              disabledDate={getDisabledDate}
              className={'border-radius-5'}
            />
          </Form.Item>{' '}
          <Texto className={'text-14 pt-1'}>at</Texto>
          <Form.Item name={'InviteTriggerTime'} rules={[{ validator: validateTriggerTime }]}>
            <TimePicker
              disabled={sendOnCreate}
              format={dateFormat.TIME}
              className={'border-radius-5'}
              disabledTime={getDisabledTimeWithVisibilityCheck}
            />
          </Form.Item>
        </Horizontal>
      </Horizontal>
      {warnings?.map((err, index) => (
        <Texto key={index} appearance={'error'} className={'mb-1 text-14'}>
          {err.text}
        </Texto>
      ))}
      {isTimeInPast && (
        <GraviButton
          buttonText='Set to future time'
          onClick={onSetToFutureTime}
          size='small'
          appearance='outline'
          className='mt-2'
        />
      )}
    </Vertical>
  )
}
