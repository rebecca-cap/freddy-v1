import { EditOutlined, FileTextOutlined, SaveOutlined } from '@ant-design/icons'
import uploadAnim from '@assets/Animation/upload_anim.json'
import { dateFormat } from '@components/TheArmory/helpers'
import {
  GraviButton,
  Horizontal,
  LoadingAnimation,
  NotificationMessage,
  Texto,
  Vertical,
} from '@gravitate-js/excalibrr'
import { Quote } from '@modules/PricingEngine/QuoteBook/api/types.schema'
import { QuoteBookPublishConfirmDrawerGrid } from '@modules/PricingEngine/QuoteBook/components/Drawers/QuoteBookPublishConfirmDrawer/components/Grid'
import { DatePicker, TimePicker } from 'antd'
import moment from 'moment'
import React, { useMemo, useState } from 'react'

interface QuoteBookPublishConfirmContentProps {
  dirtyQuotes: Quote[]
  setIsConfirmDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
  publishEOD: any
  handleGridReset: any
  setPublishMode: React.Dispatch<React.SetStateAction<boolean>>
  publicationMode: string
  title: string
  isUsingMarketMove?: boolean
}

export function QuoteBookPublishConfirmContent({
  dirtyQuotes,
  setIsConfirmDrawerOpen,
  publishEOD,
  handleGridReset,
  setPublishMode,
  publicationMode,
  title,
  isUsingMarketMove,
}: QuoteBookPublishConfirmContentProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [IntraDayStartTime, setIntraDayStartTime] = useState(moment())

  const TargetPeriodEffectiveTo = useMemo(() => {
    return dirtyQuotes[0]?.TargetPeriodEffectiveTo
  }, [dirtyQuotes])

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const PublicationRows = dirtyQuotes
        .filter((q) => !q.SpreadParentMappingId)
        .map((dq) => {
          return {
            QuoteConfigurationMappingId: dq?.QuoteConfigurationMappingId,
            BaseCurvePointPriceId: dq?.StrategyBase?.PriceId,
            BaseQuotedValueId: dq?.StrategyBase?.QuotedValueId,
            StrategyBaseTypeCvId: dq?.StrategyBaseTypeCvId,
            Adjustment: dq?.Adjustment,
            MarketMoveOverride: dq.MarketMoveOverride ?? null,
            MarketMove: dq.MarketMoveValue ?? null,
          }
        })

      const payload = {
        PublicationMode: publicationMode,
        PublicationRows,
        IntraDayStartTime: IntraDayStartTime.format('YYYY-MM-DDTHH:mm:ss.SSS'),
      }

      const response = await publishEOD.mutateAsync({ ...payload })
      if (!response?.Validations.length) {
        setIsSaving(false)
        NotificationMessage('Published successfully', 'Price(s) have been published', false)
        setIsConfirmDrawerOpen(false)
        handleGridReset()
        setPublishMode(false)
      } else {
        setIsSaving(false)
        setPublishMode(false)
        NotificationMessage('Publish failed', response?.Validations[0]?.Message || 'Could not publish price(s)')
      }
    } catch (error) {
      console.error('An error occurred while processing the request:', error)
      setPublishMode(false)
      setIsSaving(false)
      NotificationMessage('Error', 'An error occurred while processing the request')
    }
  }

  if (isSaving) {
    return (
      <Horizontal verticalCenter horizontalCenter fullHeight width='100%'>
        <LoadingAnimation
          title={`Publishing ${dirtyQuotes?.length} price(s)`}
          message='This might take a minute. Please wait until the upload results are ready.'
          animationData={uploadAnim}
          loop
          height={400}
          width={400}
        />
      </Horizontal>
    )
  }

  const disabledDate = (current) => {
    const maxDate = moment(TargetPeriodEffectiveTo)

    return (current && current < moment().endOf('day').subtract(1, 'day')) || current > maxDate
  }

  const disabledTime = (current) => {
    const currentMoment = moment()
    const today = moment().startOf('day')

    const disabledHours = () => {
      if (IntraDayStartTime.isAfter(today, 'day')) {
        return []
      }
      const currentHour = currentMoment.hour()
      return Array.from({ length: currentHour }, (_, index) => index)
    }

    const disabledMinutes = (selectedHour) => {
      if (IntraDayStartTime.isAfter(today, 'day')) {
        return []
      }
      if (selectedHour === currentMoment.hour()) {
        const currentMinute = currentMoment.minute()
        return Array.from({ length: currentMinute }, (_, index) => index)
      }
      return []
    }

    return {
      disabledHours,
      disabledMinutes,
    }
  }

  const handleDateChange = (newDate) => {
    const updatedDateTime = moment(newDate).set({
      hour: IntraDayStartTime.hours(),
      minute: IntraDayStartTime.minutes(),
    })

    const isValidTime = !updatedDateTime.isBefore(moment(), 'minute')
    if (!isValidTime) {
      const currentTime = moment()
      updatedDateTime.hours(currentTime.hours())
      updatedDateTime.minutes(currentTime.minutes())
    }

    setIntraDayStartTime(updatedDateTime)
  }

  const handleTimeChange = (newTime) => {
    const hours = newTime.hours()
    const minutes = newTime.minutes()
    const updatedDateTime = moment(IntraDayStartTime).set({
      hour: parseInt(hours, 10),
      minute: parseInt(minutes, 10),
    })
    const isValidTime = !updatedDateTime.isBefore(moment(), 'minute')

    if (!isValidTime) {
      const currentTime = moment()
      updatedDateTime.hours(currentTime.hours())
      updatedDateTime.minutes(currentTime.minutes())
    }
    setIntraDayStartTime(updatedDateTime)
  }

  return (
    <Horizontal height='100%'>
      <Vertical style={{ justifyContent: 'space-between' }} verticalCenter>
        <div style={{ height: '100%' }}>
          <QuoteBookPublishConfirmDrawerGrid
            publicationMode={publicationMode}
            dirtyQuotes={dirtyQuotes}
            isUsingMarketMove={isUsingMarketMove}
          />
        </div>
        <div>
          <Horizontal style={{ width: '100%', justifyContent: 'space-between' }}>
            <Horizontal
              flex='none'
              className='py-3 pl-4'
              style={{
                minWidth: '300px',
                alignItems: 'center',
                borderBottom: '3px solid var(--theme-color-2)',
                color: 'var(--theme-color-2)',
              }}
            >
              <Horizontal className='mr-2' style={{ fontSize: '2em' }}>
                <FileTextOutlined />
              </Horizontal>
              <Texto category='h5' style={{ color: 'inherit' }}>
                {title} Publisher
              </Texto>
              {publicationMode === 'IntraDay' && (
                <Horizontal verticalCenter style={{ gap: 20 }}>
                  <DatePicker
                    hideDisabledOptions
                    disabledDate={disabledDate}
                    onSelect={handleDateChange}
                    defaultValue={moment()}
                    value={IntraDayStartTime}
                    className='ml-4'
                    style={{ minWidth: 300 }}
                    use12Hours
                    format={dateFormat.DATE}
                    placeholder='Select date'
                    allowClear={false}
                  />
                  <TimePicker
                    disabledTime={disabledTime}
                    defaultValue={moment()}
                    value={IntraDayStartTime}
                    placeholder='Select time'
                    format={dateFormat.TIME}
                    onSelect={handleTimeChange}
                    onChange={handleTimeChange}
                    allowClear={false}
                  />
                </Horizontal>
              )}
            </Horizontal>
            <Horizontal className='p-4 justify-end' style={{ gap: 20 }} verticalCenter>
              <GraviButton
                icon={<EditOutlined />}
                buttonText='Keep Editing'
                onClick={() => setIsConfirmDrawerOpen(false)}
              />
              <GraviButton
                icon={<SaveOutlined />}
                theme2
                buttonText='Confirm Publish'
                onClick={handleSave}
                disabled={!dirtyQuotes.length}
              />
            </Horizontal>
          </Horizontal>
        </div>
      </Vertical>
    </Horizontal>
  )
}
