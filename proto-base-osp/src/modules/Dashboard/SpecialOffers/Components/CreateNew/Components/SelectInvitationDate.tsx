import { MetadataListResponseItem } from '@api/globalTypes'
import { dateFormat } from '@components/TheArmory/helpers'
import { BBDTag, GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { getDefaultStartTime } from '@modules/Dashboard/SpecialOffers/utils/Constants/TimingWindowConstants'
import {
  buildDateTimeInTimezone,
  createDisabledTimeForDate,
  getTimezoneIana,
  nowInTimezone,
} from '@modules/Dashboard/SpecialOffers/utils/Utils/TimingWindowHelpers'
import { toAntOptionParsedNumberValue } from '@utils/index'
import { Checkbox, DatePicker, Form, Select, TimePicker } from 'antd'
import type { FormInstance } from 'antd'
import dayjs from '@utils/dayjs'
import type { Dayjs } from '@utils/dayjs'
import { useCallback, useEffect, useMemo, useState } from 'react'

interface SelectInvitationDateProps {
  form: FormInstance
  selectedVisibilityWindowStart?: Dayjs
  selectedVisibilityWindowStartTime?: Dayjs
  onSetToFutureTime: () => void
  validTimeZones?: MetadataListResponseItem[]
}

export function SelectInvitationDate({
  form,
  selectedVisibilityWindowStart,
  selectedVisibilityWindowStartTime,
  onSetToFutureTime,
  validTimeZones,
}: SelectInvitationDateProps) {
  const sendOnCreate = Form.useWatch('SendInvitesOnCreate', form)
  const inviteTriggerDate = Form.useWatch('InviteTriggerDate', form)
  const inviteTriggerTime = Form.useWatch('InviteTriggerTime', form)
  const selectedTimeZoneId = Form.useWatch('TimeZoneId', form)

  const selectedTimezone = useMemo(
    () => getTimezoneIana(selectedTimeZoneId, validTimeZones),
    [selectedTimeZoneId, validTimeZones]
  )

  // Refresh "now" periodically to prevent stale closure in time comparisons
  // Uses selected timezone when available so validation compares against the correct "now"
  const getNow = useCallback(() => nowInTimezone(selectedTimezone).startOf('minute'), [selectedTimezone])

  const [currentMinute, setCurrentMinute] = useState(getNow)

  useEffect(() => {
    setCurrentMinute(getNow())
    const interval = setInterval(() => {
      setCurrentMinute(getNow())
    }, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [getNow])

  useEffect(() => {
    if (!selectedTimezone) return
    if (!sendOnCreate) return
    const startTime = getDefaultStartTime(selectedTimezone)
    form.setFieldsValue({
      InviteTriggerDate: startTime.startOf('day'),
      InviteTriggerTime: startTime,
    })
  }, [selectedTimezone, sendOnCreate, form])

  const getDisabledDate = useCallback(
    (current: Dayjs) => {
      if (!current) return false
      if (dayjs(current).isSame(dayjs(), 'day')) return false
      return (
        dayjs(current).isBefore(dayjs(), 'day') ||
        (selectedVisibilityWindowStart ? dayjs(current).isAfter(dayjs(selectedVisibilityWindowStart), 'day') : false)
      )
    },
    [selectedVisibilityWindowStart]
  )

  const getDisabledTimeWithVisibilityCheck = useCallback(() => {
    const baseDisabled = createDisabledTimeForDate(inviteTriggerDate, selectedTimezone)

    if (!selectedVisibilityWindowStart || !selectedVisibilityWindowStartTime) {
      return baseDisabled
    }

    const inviteDate = inviteTriggerDate || dayjs()
    const visibilityStartDate = dayjs(selectedVisibilityWindowStart)

    if (!dayjs(inviteDate).isSame(visibilityStartDate, 'day')) {
      return baseDisabled
    }

    const visibilityHour = selectedVisibilityWindowStartTime.hour()
    const visibilityMinute = selectedVisibilityWindowStartTime.minute()

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
  }, [inviteTriggerDate, selectedVisibilityWindowStart, selectedVisibilityWindowStartTime, selectedTimezone])

  const validateTriggerDate = useCallback(
    (_, value: Dayjs) => {
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
    (_, value: Dayjs) => {
      if (sendOnCreate) {
        return Promise.resolve()
      }
      if (!value) {
        return Promise.reject(new Error('Invite time is required'))
      }

      const disabledConfig = getDisabledTimeWithVisibilityCheck()
      const selectedHour = value.hour()
      const selectedMinute = value.minute()

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

    const triggerDateTime = buildDateTimeInTimezone(
      inviteTriggerDate,
      inviteTriggerTime.hour(),
      inviteTriggerTime.minute(),
      selectedTimezone
    )

    return !triggerDateTime.startOf('minute').isAfter(currentMinute)
  }, [sendOnCreate, inviteTriggerDate, inviteTriggerTime, currentMinute, selectedTimezone])

  const warnings = useMemo(() => {
    const errors: { text: string }[] = []

    if (sendOnCreate) {
      return errors
    }

    if (inviteTriggerDate && inviteTriggerTime) {
      const triggerDateTime = buildDateTimeInTimezone(
        inviteTriggerDate,
        inviteTriggerTime.hour(),
        inviteTriggerTime.minute(),
        selectedTimezone
      )

      const triggerMinute = triggerDateTime.startOf('minute')

      if (!triggerMinute.isAfter(currentMinute)) {
        errors.push({
          text: 'Invitation trigger date and time must be at least 1 minute in the future',
        })
      }

      if (selectedVisibilityWindowStart && selectedVisibilityWindowStartTime) {
        const visibilityStartDateTime = buildDateTimeInTimezone(
          selectedVisibilityWindowStart,
          selectedVisibilityWindowStartTime.hour(),
          selectedVisibilityWindowStartTime.minute(),
          selectedTimezone
        )

        if (triggerMinute.isAfter(visibilityStartDateTime.startOf('minute'))) {
          errors.push({
            text: 'Invitation trigger date and time must be at or before the Visibility Start',
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
    selectedTimezone,
  ])

  return (
    <Vertical className={'p-4 bordered mb-4 border-radius-5'}>
      <Horizontal justifyContent='space-between' verticalCenter>
        <Texto category={'h5'}>Send Invites</Texto>
      </Horizontal>
      <Horizontal gap={10} className={'mb-2'} verticalCenter>
        <Form.Item name={'SendInvitesOnCreate'} valuePropName='checked'>
          <Checkbox
            onChange={(check) => {
              if (check) form.resetFields(['InviteTriggerDate'])
            }}
          />
        </Form.Item>
        <Texto className={'text-14'}>Send Invites on Create</Texto>
      </Horizontal>
      <Horizontal gap={10} className={'mb-2'} style={{ width: '100%' }}>
        <Texto className={`text-14 pt-1`} appearance={sendOnCreate ? 'hint' : 'default'}>
          Invite Trigger Date:
        </Texto>
        <Horizontal gap={10}>
          <Form.Item name={'InviteTriggerDate'} rules={[{ validator: validateTriggerDate }]}>
            <DatePicker
              disabled={sendOnCreate}
              format={dateFormat.DATE_SLASH}
              disabledDate={getDisabledDate}
              className={'border-radius-5'}
            />
          </Form.Item>
          <Texto className={'text-14 pt-1'}>at</Texto>
          <Form.Item name={'InviteTriggerTime'} rules={[{ validator: validateTriggerTime }]}>
            <TimePicker
              disabled={sendOnCreate}
              format={dateFormat.TIME}
              className={'border-radius-5'}
              disabledTime={getDisabledTimeWithVisibilityCheck}
            />
          </Form.Item>
          {selectedTimezone && <BBDTag style={{ alignSelf: 'center' }}>{selectedTimezone}</BBDTag>}
        </Horizontal>
      </Horizontal>
      <Horizontal gap={10} className={'my-2'} style={{ width: '100%' }}>
        <Texto className={'text-14 pt-1'}>Time Zone:</Texto>
        <Horizontal gap={10}>
          <Form.Item name={'TimeZoneId'} rules={[{ required: true, message: 'Time zone is required' }]}>
            <Select
              showSearch
              placeholder='Select time zone'
              className={'border-radius-5'}
              style={{ minWidth: 250 }}
              optionFilterProp='label'
              options={validTimeZones?.map(toAntOptionParsedNumberValue)}
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
