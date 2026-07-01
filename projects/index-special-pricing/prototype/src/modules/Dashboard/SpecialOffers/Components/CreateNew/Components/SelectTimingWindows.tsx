import { CheckOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons'
import { MetadataListResponseItem } from '@api/globalTypes'
import { dateFormat } from '@components/TheArmory/helpers'
import { BBDTag, GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { DatePicker } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/Components/DayjsDatePicker'
import { SelectInvitationDate } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/Components/SelectInvitationDate'
import { TimeSelect } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/Components/TimeSelect'
import { getDefaultStartTime, timingWindowList, weekDays } from '@modules/Dashboard/SpecialOffers/utils/Constants/TimingWindowConstants'
import {
  buildDateTimeInTimezone,
  CalendarDay,
  generateCalendarDays,
  getAndSetClickResult,
  getTimezoneIana,
  isValidDateSelection,
  nowInTimezone,
} from '@modules/Dashboard/SpecialOffers/utils/Utils/TimingWindowHelpers'
import type { Dayjs } from '@utils/dayjs'
import dayjs from '@utils/dayjs'
import type { FormInstance } from 'antd'
import { Button, Checkbox, Form } from 'antd'
import { Dispatch, MutableRefObject, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'

export interface SelectTimingWindowsProps {
  form: FormInstance
  currentStep: number
  selectedVisibilityWindowStart?: Dayjs
  selectedVisibilityWindowStartTime?: Dayjs
  selectedPickupWindowStart?: Dayjs
  selectedVisibilityWindowEnd?: Dayjs
  selectedPickupWindowEnd?: Dayjs
  validTimeZones?: MetadataListResponseItem[]
  onSetToFutureTime: () => void
  calendarClickRef: MutableRefObject<number>
  calendarDate: Dayjs | null
  setCalendarDate: Dispatch<SetStateAction<Dayjs | null>>
  /** Overrides the default `currentStep === 2` visibility gate when provided, so the
   *  same timing step can live at a different index (e.g. step 2 of the quick-create). */
  isActive?: boolean
  /** 'quick' = quick-create layout: no master "Configure Timing" header, the calendar is
   *  de-tiled and always shown in its own qc-section, and the window cards are gated by
   *  `windowInputsActive`. Omit (default) for the full-setup wizard layout. */
  variant?: 'wizard' | 'quick'
  /** Quick variant only: show the Visibility/Pickup window cards (custom timeframe chosen). */
  windowInputsActive?: boolean
}

export function SelectTimingWindows({
  form,
  currentStep,
  selectedPickupWindowStart,
  selectedVisibilityWindowStart,
  selectedVisibilityWindowStartTime,
  selectedVisibilityWindowEnd,
  selectedPickupWindowEnd,
  validTimeZones,
  onSetToFutureTime,
  calendarClickRef,
  calendarDate,
  setCalendarDate,
  isActive,
  variant,
  windowInputsActive = true,
}: SelectTimingWindowsProps) {
  const isQuick = variant === 'quick'
  // Round the portaled dropdown panels in the quick-create drawer only; the full-setup wizard
  // (default variant) leaves popClass undefined so its dropdowns keep antd defaults.
  const popClass = isQuick ? 'qc-pop' : undefined
  const isVisible = isActive ?? currentStep === 2
  const visibilityStartNow = Form.useWatch('VisibilityStartNow', form)
  const pickupStartNow = Form.useWatch('PickupStartNow', form)

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
    const startTime = getDefaultStartTime(selectedTimezone)
    if (visibilityStartNow) {
      form.setFieldsValue({
        VisibilityWindowStartDate: startTime,
        VisibilityWindowStartTime: startTime,
      })
    }
    if (pickupStartNow) {
      form.setFieldsValue({
        PickupWindowStartDate: startTime,
        PickupWindowStartTime: startTime,
      })
    }
  }, [selectedTimezone, visibilityStartNow, pickupStartNow, form])

  const visibilityEndTimeRaw = Form.useWatch('VisibilityWindowEndTime', form)
  const visibilityEndTime = visibilityEndTimeRaw ? dayjs(visibilityEndTimeRaw) : undefined
  const pickupStartTimeRaw = Form.useWatch('PickupWindowStartTime', form)
  const pickupStartTime = pickupStartTimeRaw ? dayjs(pickupStartTimeRaw) : undefined
  const pickupEndTimeRaw = Form.useWatch('PickupWindowEndTime', form)
  const pickupEndTime = pickupEndTimeRaw ? dayjs(pickupEndTimeRaw) : undefined

  const visibilityWindowWarnings = useMemo(() => {
    const errors: { text: string }[] = []

    if (!visibilityStartNow && selectedVisibilityWindowStart && selectedVisibilityWindowStartTime) {
      const startDateTime = buildDateTimeInTimezone(
        selectedVisibilityWindowStart,
        selectedVisibilityWindowStartTime.hour(),
        selectedVisibilityWindowStartTime.minute(),
        selectedTimezone
      )

      const startMinute = startDateTime.startOf('minute')

      if (!startMinute.isAfter(currentMinute)) {
        errors.push({ text: 'Visibility start date and time must be at least 1 minute in the future' })
      }
    }

    if (
      selectedVisibilityWindowEnd &&
      visibilityEndTime &&
      selectedVisibilityWindowStart &&
      selectedVisibilityWindowStartTime
    ) {
      const endDateTime = buildDateTimeInTimezone(
        selectedVisibilityWindowEnd,
        visibilityEndTime.hour(),
        visibilityEndTime.minute(),
        selectedTimezone
      )
      const startDateTime = buildDateTimeInTimezone(
        selectedVisibilityWindowStart,
        selectedVisibilityWindowStartTime.hour(),
        selectedVisibilityWindowStartTime.minute(),
        selectedTimezone
      )

      if (endDateTime.isSameOrBefore(startDateTime)) {
        errors.push({ text: 'Visibility end must be after start' })
      }
    }

    return errors
  }, [
    visibilityStartNow,
    selectedVisibilityWindowStart,
    selectedVisibilityWindowStartTime,
    selectedVisibilityWindowEnd,
    visibilityEndTime,
    currentMinute,
    selectedTimezone,
  ])

  const pickupWindowWarnings = useMemo(() => {
    const errors: { text: string }[] = []

    if (!pickupStartNow && selectedPickupWindowStart && pickupStartTime) {
      const startDateTime = buildDateTimeInTimezone(
        selectedPickupWindowStart,
        pickupStartTime.hour(),
        pickupStartTime.minute(),
        selectedTimezone
      )

      const startMinute = startDateTime.startOf('minute')

      if (!startMinute.isAfter(currentMinute)) {
        errors.push({ text: 'Pickup start date and time must be at least 1 minute in the future' })
      }
    }

    if (!(visibilityStartNow && pickupStartNow) && selectedVisibilityWindowStart && selectedVisibilityWindowStartTime) {
      const visibilityStart = visibilityStartNow
        ? currentMinute
        : buildDateTimeInTimezone(
            selectedVisibilityWindowStart,
            selectedVisibilityWindowStartTime.hour(),
            selectedVisibilityWindowStartTime.minute(),
            selectedTimezone
          )

      const pickupStart = pickupStartNow
        ? currentMinute
        : selectedPickupWindowStart && pickupStartTime
          ? buildDateTimeInTimezone(selectedPickupWindowStart, pickupStartTime.hour(), pickupStartTime.minute(), selectedTimezone)
          : undefined

      if (pickupStart && pickupStart.isBefore(visibilityStart)) {
        errors.push({ text: 'Pickup start must be at or after Visibility start' })
      }
    }

    if (selectedPickupWindowEnd && pickupEndTime && selectedPickupWindowStart && pickupStartTime) {
      const endDateTime = buildDateTimeInTimezone(
        selectedPickupWindowEnd,
        pickupEndTime.hour(),
        pickupEndTime.minute(),
        selectedTimezone
      )
      const startDateTime = buildDateTimeInTimezone(
        selectedPickupWindowStart,
        pickupStartTime.hour(),
        pickupStartTime.minute(),
        selectedTimezone
      )

      if (endDateTime.isSameOrBefore(startDateTime)) {
        errors.push({ text: 'Pickup end must be after start' })
      }
    }

    return errors
  }, [
    pickupStartNow,
    selectedPickupWindowStart,
    pickupStartTime,
    selectedPickupWindowEnd,
    pickupEndTime,
    selectedVisibilityWindowStart,
    selectedVisibilityWindowStartTime,
    currentMinute,
    selectedTimezone,
  ])

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCalendarDate((prev) => {
      const current = prev ?? dayjs()
      return direction === 'prev' ? current.subtract(1, 'month') : current.add(1, 'month')
    })
  }

  const calendarDays = generateCalendarDays(calendarDate ?? dayjs())

  const isDateDisabledByRules = (dayInfo: CalendarDay): boolean => {
    if (dayInfo.isPast) return true
    switch (calendarClickRef.current) {
      case 1:
        return !isValidDateSelection({
          newDate: dayInfo.date,
          windowType: 'visibility',
          position: 'end',
          selectedVisibilityWindowStart,
          selectedPickupWindowStart,
          form,
        })
      case 2:
        return !isValidDateSelection({
          newDate: dayInfo.date,
          windowType: 'pickup',
          position: 'start',
          selectedVisibilityWindowStart,
          selectedPickupWindowStart,
          form,
        })
      case 3:
        return !isValidDateSelection({
          newDate: dayInfo.date,
          windowType: 'pickup',
          position: 'end',
          selectedVisibilityWindowStart,
          selectedPickupWindowStart,
          form,
        })
      default:
        return false
    }
  }

  const handleDateClick = (dayInfo: CalendarDay) => () => {
    if (dayInfo.isPast) return
    getAndSetClickResult({
      clickRef: calendarClickRef,
      dayInfo,
      selectedVisibilityWindowStart,
      selectedPickupWindowStart,
      form,
      visibilityStartNow,
      pickupStartNow,
      selectedTimezone,
    })
  }

  const getDisabledDate = (current: Dayjs, fieldName: string) => {
    if (!current) return false
    const isPast = dayjs(current).isBefore(dayjs().startOf('day'))

    if (fieldName === 'VisibilityWindowEndDate' && selectedVisibilityWindowStart) {
      return isPast || dayjs(current).isBefore(dayjs(selectedVisibilityWindowStart), 'day')
    }
    if (fieldName === 'PickupWindowStartDate' && selectedVisibilityWindowStart) {
      return isPast || dayjs(current).isBefore(dayjs(selectedVisibilityWindowStart), 'day')
    }
    if (fieldName === 'PickupWindowEndDate' && selectedPickupWindowStart) {
      return isPast || dayjs(current).isBefore(dayjs(selectedPickupWindowStart), 'day')
    }

    return isPast
  }

  // Helper to get warnings for each window
  const getWindowWarnings = (title: string) => {
    if (title.includes('Visibility')) {
      return visibilityWindowWarnings
    }
    if (title.includes('Pickup')) {
      return pickupWindowWarnings
    }
    return []
  }

  const showCheck = (title: string) => {
    if (title.includes('Visibility') && selectedVisibilityWindowStart && selectedVisibilityWindowEnd) {
      return true
    }
    return !!(title.includes('Pickup') && selectedPickupWindowEnd && selectedPickupWindowStart)
  }
  const nextUpField = useMemo(() => {
    switch (calendarClickRef.current) {
      case 0:
        return visibilityStartNow ? 'Visibility End Date' : 'Visibility Start Date'
      case 1:
        return 'Visibility End Date'
      case 2:
        return pickupStartNow ? 'Pickup End Date' : 'Pickup Start Date'
      case 3:
        return 'Pickup End Date'
      case 4:
        return 'Click any to reset'
      default:
        return ''
    }
  }, [calendarClickRef.current, visibilityStartNow, pickupStartNow])

  const invitationDate = (
    <SelectInvitationDate
      form={form}
      selectedVisibilityWindowStart={selectedVisibilityWindowStart}
      selectedVisibilityWindowStartTime={selectedVisibilityWindowStartTime}
      validTimeZones={validTimeZones}
      onSetToFutureTime={onSetToFutureTime}
      popupClassName={popClass}
    />
  )

  const timeQuickStarts = [
    { label: 'Now', value: () => getNow() },
    { label: '+1h', value: () => getNow().add(1, 'hour') },
    { label: '+6h', value: () => getNow().add(6, 'hour') },
    { label: '6:00 PM', value: () => getNow().hour(18).minute(0) },
    { label: 'Midnight', value: () => getNow().hour(0).minute(0) },
  ]

  const windowCards = timingWindowList.map((window) => {
    const isStartNow = window.startNowFieldName === 'VisibilityStartNow' ? visibilityStartNow : pickupStartNow
    return (
      <Vertical key={window.title} className={'p-4 bordered mb-4 border-radius-5'}>
        <Horizontal justifyContent='space-between' verticalCenter>
          <Texto category={'h5'}>{window.title}</Texto>
          {showCheck(window.title) && <CheckOutlined style={{ color: 'var(--theme-success)' }} />}
        </Horizontal>
        <Texto className={'mb-2 text-14'} appearance={'medium'}>
          {window.description}
        </Texto>
        <Horizontal className={'mb-2'} verticalCenter style={{ gap: 8 }}>
          <Form.Item name={window.startNowFieldName} valuePropName='checked' className={'mb-0'}>
            <Checkbox
              onChange={(e) => {
                if (e.target.checked) {
                  const startTime = getDefaultStartTime(selectedTimezone)
                  form.setFieldsValue({
                    [window.startDateName]: startTime,
                    [window.startTimeName]: startTime,
                  })
                }
              }}
            />
          </Form.Item>
          <Texto className={'text-14'}>Start Now</Texto>
        </Horizontal>
        <Horizontal className={'mb-2'} verticalCenter style={{ flexWrap: 'wrap', gap: 8 }}>
          <Texto className={'text-14'} style={{ minWidth: 40 }} appearance={isStartNow ? 'hint' : 'default'}>
            Start:
          </Texto>
          <Form.Item
            className={'mb-0'}
            name={window.startDateName}
            rules={[{ required: !isStartNow, message: 'Start date is required' }]}
          >
            <DatePicker
              disabled={isStartNow}
              format={dateFormat.DATE_SLASH}
              disabledDate={(current) => getDisabledDate(current, window.startDateName)}
              className={'border-radius-5'}
              popupClassName={popClass}
            />
          </Form.Item>
          <Texto className={'text-14'} appearance={isStartNow ? 'hint' : 'default'}>
            at
          </Texto>
          <Form.Item
            className={'mb-0'}
            name={window.startTimeName}
            rules={[{ required: !isStartNow, message: 'Start time is required' }]}
          >
            <TimeSelect disabled={isStartNow} popupClassName={popClass} quickStarts={timeQuickStarts} />
          </Form.Item>
          {selectedTimezone && <BBDTag>{selectedTimezone}</BBDTag>}
        </Horizontal>
        <Horizontal verticalCenter style={{ flexWrap: 'wrap', gap: 8 }}>
          <Texto className={'text-14'} style={{ minWidth: 40 }}>
            End:
          </Texto>
          <Form.Item className={'mb-0'} name={window.endDateName} rules={[{ required: true, message: 'End date is required' }]}>
            <DatePicker
              format={dateFormat.DATE_SLASH}
              disabledDate={(current) => getDisabledDate(current, window.endDateName)}
              className={'border-radius-5'}
              popupClassName={popClass}
            />
          </Form.Item>
          <Texto className={'text-14'}>at</Texto>
          <Form.Item className={'mb-0'} name={window.endTimeName} rules={[{ required: true, message: 'End time is required' }]}>
            <TimeSelect popupClassName={popClass} quickStarts={timeQuickStarts} />
          </Form.Item>
          {selectedTimezone && <BBDTag>{selectedTimezone}</BBDTag>}
        </Horizontal>
        {getWindowWarnings(window.title)?.map((err, index) => (
          <Texto key={index} appearance={'error'} className={'mb-1 text-14'}>
            {err.text}
          </Texto>
        ))}
      </Vertical>
    )
  })

  const calendarBody = (
    <>
      <Horizontal className={'mb-2'} justifyContent='space-between' verticalCenter>
        <Vertical>
          <Texto category={'h4'} className={'text-18'}>
            Calendar View
          </Texto>
          <Texto className={'mb-2 text-14'}>When customers can see and bid on your deal</Texto>
        </Vertical>

        <GraviButton
          size={'small'}
          icon={<LeftOutlined />}
          onClick={() => navigateMonth('prev')}
          appearance='outline'
          className={'border-radius-5'}
        />
        <Texto className={'mx-2 text-14'}>{(calendarDate ?? dayjs()).format('MMMM YYYY')}</Texto>
        <GraviButton
          size={'small'}
          icon={<RightOutlined />}
          onClick={() => navigateMonth('next')}
          appearance='outline'
          className={'border-radius-5'}
        />
      </Horizontal>

      <Vertical className={'p-2 mb-2 border-radius-5'}>
        <Horizontal className={'mb-2'} verticalCenter style={{ gap: 20 }}>
          <Horizontal verticalCenter>
            <div
              style={{ width: 15, height: 15, border: '1px solid var(--visibility-border)' }}
              className={
                'timing-window-visibility-selected timing-window-visibility-range border-radius-5 timing-window-visibility-border-thin'
              }
            />
            <Texto className={'ml-2 text-14'}>Visibility</Texto>
          </Horizontal>
          <Horizontal verticalCenter>
            <div
              style={{ width: 15, height: 15 }}
              className={
                'timing-window-pickup-selected timing-window-pickup-range border-radius-5 timing-window-pickup-border-thin'
              }
            />
            <Texto className={'ml-2 text-14'}>Pickup</Texto>
          </Horizontal>
        </Horizontal>

        <Vertical className={'p-4 bordered border-radius-5'}>
          <Horizontal className={'mb-1'} style={{ gap: 10 }}>
            {weekDays.map((day) => (
              <Vertical key={day}>
                <Texto className={'text-14'} category={'p2'} weight='bold' align={'center'}>
                  {day}
                </Texto>
              </Vertical>
            ))}
          </Horizontal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
            {calendarDays.map((dayInfo, index) => {
              const date = dayjs(dayInfo.date)
              const isInRange = () => {
                const ranges = [
                  [selectedVisibilityWindowStart, selectedVisibilityWindowEnd],
                  [selectedPickupWindowStart, selectedPickupWindowEnd],
                ]
                const includedRanges: string[] = []
                const current = dayjs(dayInfo.date)
                ranges.forEach((range, idx) => {
                  if (range?.[1]) {
                    const start = dayjs(range[0])
                    const end = dayjs(range[1])
                    current.isBetween(start, end, 'day', '[]')
                      ? includedRanges.push(idx === 0 ? 'visibility' : 'pickup')
                      : null
                  } else if (range?.[0]) {
                    current.isSame(dayjs(range[0]), 'day')
                      ? includedRanges.push(idx === 0 ? 'visibility' : 'pickup')
                      : null
                  }
                })
                return includedRanges
              }

              return (
                <Button
                  key={index}
                  disabled={isDateDisabledByRules(dayInfo)}
                  onClick={handleDateClick(dayInfo)}
                  className={`border-radius-5 cal-button ${
                    (selectedVisibilityWindowStart && dayjs(selectedVisibilityWindowStart).isSame(date, 'day')) ||
                    (selectedVisibilityWindowEnd && dayjs(selectedVisibilityWindowEnd).isSame(date, 'day'))
                      ? 'timing-window-visibility-selected timing-window-visibility-border '
                      : (selectedPickupWindowStart && dayjs(selectedPickupWindowStart).isSame(date, 'day')) ||
                        (selectedPickupWindowEnd && dayjs(selectedPickupWindowEnd).isSame(date, 'day'))
                      ? 'timing-window-pickup-selected timing-window-pickup-border '
                      : dayInfo.isToday
                      ? 'timing-window-today'
                      : 'timing-window-calendar-day'
                  } }
                  ${
                    isInRange().includes('visibility') && isInRange().includes('pickup')
                      ? ' timing-window-both'
                      : isInRange().includes('visibility')
                      ? ' timing-window-visibility-range'
                      : isInRange().includes('pickup')
                      ? ' timing-window-pickup-range'
                      : ''
                  }
                  `}
                >
                  <Horizontal horizontalCenter verticalCenter>
                    <Texto
                      className={`text-14  `}
                      appearance={isDateDisabledByRules(dayInfo) ? 'hint' : 'default'}
                      weight={'normal'}
                    >
                      {dayInfo.day.toString()}
                    </Texto>
                  </Horizontal>
                </Button>
              )
            })}
          </div>
        </Vertical>
        <Texto className={'text-muted mt-2'}>
          {calendarClickRef.current < 4
            ? `Click any date to quickly fill the next empty field: ${nextUpField} `
            : `Click any date to reset`}
        </Texto>
      </Vertical>
    </>
  )

  if (isQuick) {
    // Quick-create: each part is its own full-width qc-section (no master "Configure Timing"
    // header, no calendar tile). Invites + calendar always show; the window cards only when a
    // custom timeframe is chosen.
    return (
      <Vertical
        className={'timing-window-container'}
        style={{ display: isVisible ? 'block' : 'none', visibility: isVisible ? 'visible' : 'hidden' }}
      >
        <Vertical className={'qc-section p-4'}>{invitationDate}</Vertical>
        {/* Kept mounted (display-gated, not conditionally rendered) so the window-date Form.Items
            stay registered — otherwise Form.useWatch goes undefined and the always-on calendar +
            preview rail can't reflect the windows the quick-timeframe picks set. */}
        <Vertical className={'qc-section p-4'} style={{ display: windowInputsActive ? undefined : 'none' }}>
          {windowCards}
        </Vertical>
        <Vertical className={'qc-section p-4'}>{calendarBody}</Vertical>
      </Vertical>
    )
  }

  return (
    <Vertical
      style={{ display: isVisible ? 'block' : 'none', visibility: isVisible ? 'visible' : 'hidden' }}
      className={'p-4 timing-window-container'}
    >
      <Texto category={'h4'} className={'text-18'}>
        Configure Timing
      </Texto>
      <Texto className={'mb-4 text-14'} appearance={'medium'}>
        Set when customers can see and respond to your deal.
      </Texto>
      {invitationDate}
      {windowCards}
      <Vertical className={'p-4 bordered mb-4 border-radius-5'}>{calendarBody}</Vertical>
    </Vertical>
  )
}
