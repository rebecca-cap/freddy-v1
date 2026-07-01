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
import type { Quote } from '@modules/PricingEngine/QuoteBook/Api/types.schema'
import { QuoteBookPublishConfirmDrawerGrid } from '@modules/PricingEngine/QuoteBook/Components/Drawers/QuoteBookPublishConfirmDrawer/components/Grid'
import dayjs from '@utils/dayjs'
import { DatePicker, TimePicker } from 'antd'
import type React from 'react'
import { useMemo, useState } from 'react'

interface QuoteBookPublishConfirmContentProps {
  dirtyQuotes: Quote[]
  setIsConfirmDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
  publishEOD: any
  handleGridReset: any
  setPublishMode: React.Dispatch<React.SetStateAction<boolean>>
  publicationMode: string
  title: string
  isUsingMarketMove?: boolean
  showOriginDestinationColumns?: boolean
  showLocationColumn?: boolean
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
  showOriginDestinationColumns,
  showLocationColumn,
}: QuoteBookPublishConfirmContentProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [IntraDayStartTime, setIntraDayStartTime] = useState(dayjs())

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
            Freight: dq.UsesFreight ? dq.FreightValue ?? null : null,
            Tax: dq.UsesTax ? dq.TaxValue ?? null : null,
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
    const maxDate = dayjs(TargetPeriodEffectiveTo)

    return (current && current < dayjs().endOf('day').subtract(1, 'day')) || current > maxDate
  }

  const disabledTime = (current) => {
    const currentDayjs = dayjs()
    const today = dayjs().startOf('day')

    const disabledHours = () => {
      if (IntraDayStartTime.isAfter(today, 'day')) {
        return []
      }
      const currentHour = currentDayjs.hour()
      return Array.from({ length: currentHour }, (_, index) => index)
    }

    const disabledMinutes = (selectedHour) => {
      if (IntraDayStartTime.isAfter(today, 'day')) {
        return []
      }
      if (selectedHour === currentDayjs.hour()) {
        const currentMinute = currentDayjs.minute()
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
    let updatedDateTime = dayjs(newDate).set('hour', IntraDayStartTime.hour()).set('minute', IntraDayStartTime.minute())

    const isValidTime = !updatedDateTime.isBefore(dayjs(), 'minute')
    if (!isValidTime) {
      const currentTime = dayjs()
      updatedDateTime = updatedDateTime.hour(currentTime.hour()).minute(currentTime.minute())
    }

    setIntraDayStartTime(updatedDateTime)
  }

  const handleTimeChange = (newTime) => {
    const hours = newTime.hour()
    const minutes = newTime.minute()
    let updatedDateTime = dayjs(IntraDayStartTime).set('hour', parseInt(hours, 10)).set('minute', parseInt(minutes, 10))
    const isValidTime = !updatedDateTime.isBefore(dayjs(), 'minute')

    if (!isValidTime) {
      const currentTime = dayjs()
      updatedDateTime = updatedDateTime.hour(currentTime.hour()).minute(currentTime.minute())
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
            showOriginDestinationColumns={showOriginDestinationColumns}
            showLocationColumn={showLocationColumn}
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
                <Horizontal verticalCenter gap={20}>
                  <DatePicker
                    hideDisabledOptions
                    disabledDate={disabledDate}
                    onSelect={handleDateChange}
                    defaultValue={dayjs()}
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
                    defaultValue={dayjs()}
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
            <Horizontal className='p-4 justify-end' gap={20} verticalCenter>
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
