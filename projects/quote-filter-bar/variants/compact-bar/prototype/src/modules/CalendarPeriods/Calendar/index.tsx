import '@fullcalendar/react/dist/vdom'
import '@fullcalendar/core'

import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { useCalendarPeriods } from '@api/useCalendarPeriods'
import { useUser } from '@contexts/UserContext'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import { GraviButton, Texto } from '@gravitate-js/excalibrr'
import { CreateModal } from '@modules/CalendarPeriods/Calendar/components/CreateModal'
import { DatePicker, message, Modal, Popover, Select, Switch } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'

export const CalendarPeriods: React.FC = () => {
  const calendarRef = React.createRef()

  const { userPermissions } = useUser()
  const canWrite = !!userPermissions?.CalendarPeriod?.Write

  const {
    useCalendarPeriodsMetadataQuery,
    useCalendarPeriodsQuery,
    useCalendarPeriodsUpdateMutation,
    useCalendarPeriodsDeleteMutation,
    useCalendarPeriodsCreateMutation,
  } = useCalendarPeriods()
  const { data: metadata, isLoading: isMetadataLoading } = useCalendarPeriodsMetadataQuery()

  // Initialize mutations
  const updateMutation = useCalendarPeriodsUpdateMutation()
  const deleteMutation = useCalendarPeriodsDeleteMutation()
  const createMutation = useCalendarPeriodsCreateMutation()

  const [startDate, setStartDate] = useState(moment().clone().weekday(0).toDate())
  const [endDate, setEndDate] = useState(moment().clone().weekday(6).toDate())
  const [selectedCalendarId, setSelectedCalendarId] = useState()
  const [includeFutureEvents, setIncludeFutureEvents] = useState(false)
  const [calendarEvents, setCalendarEvents] = useState([])
  const [openPopovers, setOpenPopovers] = useState([])

  // Create event state handlers
  const [selectedPeriodTypeCvId, setSelectedPeriodTypeCvId] = useState()
  const closePopover = (eventInfo) =>
    setOpenPopovers((current) => current.filter((p) => p === eventInfo.event._def.extendedProps.CalendarPeriodId))
  const openPopover = (eventInfo) =>
    setOpenPopovers((current) => [...current, eventInfo.event._def.extendedProps.CalendarPeriodId])
  const [deletingEventId, setDeletingEventId] = useState(null)
  const [removeModalOpen, setRemoveModalOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const handleRemoveModalCancel = () => setRemoveModalOpen(false)
  const handleRemoveModalOpen = () => setRemoveModalOpen(true)
  const handleCreateModalCancel = () => setCreateModalOpen(false)
  const handleCreateModalOpen = () => setCreateModalOpen(true)

  const customWeekStartEndFormat = (value) =>
    `${moment(value).startOf('week').format('MM/DD')} ~ ${moment(value).endOf('week').format('MM/DD')}`

  const { data: calendarPeriods, isLoading: isCalendarPeriodsLoading } = useCalendarPeriodsQuery(
    startDate,
    endDate,
    selectedCalendarId
  )

  useEffect(() => {
    const eventModels = calendarPeriods?.Data?.map((item) => {
      return {
        title: item.Name,
        start: item.PeriodFromDate,
        end: item.PeriodToDate,
        CalendarPeriodId: item.CalendarPeriodId,
        CalendarId: item.CalendarId,
        PeriodTypeCvId: item.PeriodTypeCvId,
        color:
          item.PeriodTypeCvId.toString() == metadata?.Data?.PeriodTypeList[0].Value
            ? 'var(--theme-color-2)'
            : 'var(--theme-color-4)',
      }
    })
    setCalendarEvents(eventModels)
  }, [calendarPeriods])

  useEffect(() => {
    setSelectedCalendarId(metadata?.Data?.CalendarList[0].Value)
  }, [metadata])

  const popoverContent = (eventInfo) => {
    return (
      <GraviButton
        buttonText='Remove Event'
        error
        onClick={() => handleRemoveClick(eventInfo.event._def.extendedProps.CalendarPeriodId)}
      />
    )
  }

  const handleRemoveClick = (CalendarPeriodId) => {
    setDeletingEventId(CalendarPeriodId)
    handleRemoveModalOpen()
  }

  const renderEventContent = (eventInfo) => {
    return (
      <Popover trigger='click' content={popoverContent(eventInfo)}>
        <div style={{ height: '100%' }}>
          <div className='p-2'>{eventInfo.timeText}</div>
          <div className='p-2'>{eventInfo.event.title}</div>
        </div>
      </Popover>
    )
  }

  const onDateRangeChange = (date, dateString) => {
    setStartDate(date.clone().weekday(0).toDate())
    setEndDate(date.clone().weekday(6).toDate())

    const calendarApi = calendarRef.current.getApi()
    calendarApi.gotoDate(date.toDate())
  }

  const movePrevious = () => {
    calendarRef?.current?.getApi().prev()
  }

  const moveNext = () => {
    calendarRef?.current?.getApi().next()
  }

  const handleDateSet = (dateInfo) => {
    setStartDate(dateInfo.startStr)
    setEndDate(dateInfo.endStr)
  }

  const isSameDay = (d1, d2) => {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
  }

  const handleChangeEvent = async (changeEvent) => {
    const payload = {
      PeriodFromDate: moment(changeEvent.event.start).milliseconds(0).seconds(0).local().format('YYYY-MM-DD HH:mm:ss'),
      PeriodToDate: moment(changeEvent.event.end).milliseconds(0).seconds(0).local().format('YYYY-MM-DD HH:mm:ss'),
      CalendarPeriodId: changeEvent.event._def.extendedProps.CalendarPeriodId,
      PeriodTypeCvId: changeEvent.event._def.extendedProps.PeriodTypeCvId,
      CalendarId: changeEvent.event._def.extendedProps.CalendarId,
    }

    const response = await updateMutation.mutateAsync(payload)
    if (response?.Validations.length) {
      message.error(response?.Validations[0]?.Message, 5)
      return false
    }
    return true
  }

  const handleDeleteEvent = () => {
    const payload = {
      CalendarPeriodId: deletingEventId,
      IncludeFuturePeriods: includeFutureEvents,
    }
    deleteMutation.mutateAsync(payload)
    handleRemoveModalCancel()
  }

  const handleCreateEvent = async (values) => {
    const payload = {
      ...values,
      CalendarId: selectedCalendarId,
      Start: moment(values.Start).milliseconds(0).seconds(0).local().format('YYYY-MM-DD HH:mm:ss'),
      End: moment(values.End).milliseconds(0).seconds(0).local().format('YYYY-MM-DD HH:mm:ss'),
    }

    const response = await createMutation.mutateAsync(payload)
    if (response?.Validations.length) {
      message.error(response?.Validations[0]?.Message, 5)
    }
    handleCreateModalCancel()
  }

  const onSwitchChange = (checked: boolean) => {
    setIncludeFutureEvents(checked)
  }

  return (
    <>
      <Modal
        visible={removeModalOpen}
        title='Remove Event'
        footer={[
          <GraviButton buttonText='Cancel' onClick={handleRemoveModalCancel} />,
          <GraviButton buttonText='Confirm' theme2 onClick={handleDeleteEvent} />,
        ]}
        onCancel={handleRemoveModalCancel}
      >
        <Texto category='h3'>Include future occurrences?</Texto>
        <Switch onChange={onSwitchChange} />
      </Modal>
      <CreateModal
        createModalOpen={createModalOpen}
        metadata={metadata}
        handleCreateEvent={handleCreateEvent}
        handleCreateModalCancel={handleCreateModalCancel}
      />
      <div
        className='calendar-toolbar-container '
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: 10,
        }}
      >
        <Texto category='h3'>Calendar Periods</Texto>
        <Texto category='h3'>|</Texto>
        <Select
          style={{ width: 200, marginLeft: 10 }}
          defaultValue={metadata?.Data?.CalendarList[0].Value}
          value={selectedCalendarId?.toString()}
          onChange={setSelectedCalendarId}
        >
          {metadata?.Data?.CalendarList?.map((item) => (
            <Select.Option key={item.Value}>{item.Text}</Select.Option>
          ))}
        </Select>
        <div style={{ flexGrow: 1 }} />
        {canWrite && <GraviButton theme2 buttonText='Create' onClick={handleCreateModalOpen} />}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <GraviButton
            style={{
              height: 25,
              width: 25,
              borderRadius: 100,
            }}
            theme2
            icon={<LeftOutlined />}
            onClick={movePrevious}
            appearance='outline'
          />
          <DatePicker
            defaultValue={moment()}
            format={customWeekStartEndFormat}
            value={moment(startDate)}
            picker='week'
            onChange={onDateRangeChange}
          />
          <GraviButton
            style={{
              height: 25,
              width: 25,
              borderRadius: 100,
            }}
            theme2
            icon={<RightOutlined />}
            onClick={moveNext}
            appearance='outline'
          />
        </div>
      </div>

      <div className='calendar-container' style={{ height: '86vh' }}>
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          headerToolbar={false}
          ref={calendarRef}
          events={calendarEvents}
          height='100%'
          contentHeight='100%'
          scrollTime='00:00:00'
          expandRows
          allDaySlot={false}
          initialView='timeGridWeek'
          editable={canWrite}
          eventDurationEditable={canWrite}
          eventResizableFromStart={canWrite}
          datesSet={handleDateSet}
          selectMirror
          weekends
          eventClick={openPopover}
          eventChange={(changeEvent) => handleChangeEvent(changeEvent)}
          eventContent={canWrite && renderEventContent}
        />
      </div>
    </>
  )
}
