import { CloudUploadOutlined, DownloadOutlined } from '@ant-design/icons'
import { APIResponse } from '@api/globalTypes'
import { ErrorsDrawer } from '@components/shared/Uploaders/ErrorsDrawer'
import { dateFormat } from '@components/TheArmory/helpers'
import { useUser } from '@contexts/UserContext'
import {
  GraviButton,
  GraviGrid,
  Horizontal,
  NotificationMessage,
  RangePicker,
  useLocalStorage,
  Vertical,
} from '@gravitate-js/excalibrr'
import { useNavigationBlock } from '@hooks/useNavigationBlock'
import { usePriceEngineCalendars } from '@modules/Admin/ManagePriceEngineCalendars/api'
import { CalendarMetadata } from '@modules/Admin/ManagePriceEngineCalendars/api/types'
import moment from 'moment'
import { useMemo, useRef, useState } from 'react'

import { getColumnDefs } from './components/columnDefs'
import { getUploadPreviewColumnDefs } from './components/uploadPreviewColumnDefs'
import { HolidayValidationResult, validateUploadedHolidays } from './components/validation'

export function ManageHolidaysPage({ metadata }: { metadata?: APIResponse<CalendarMetadata> }) {
  const storageKey = 'manage-price-engine-calendars'
  const hiddenFileInput = useRef<HTMLInputElement>(null)

  const { value: dates, setValue: setDates } = useLocalStorage(`${storageKey}-dates`, [
    moment().startOf('day'),
    moment().endOf('day'),
  ])

  const { userPermissions } = useUser()
  const canWrite = userPermissions?.CalendarPeriod?.Write

  const { getHolidays, deleteHolidays, downloadTemplate, uploadTemplate, submitUploadedHolidays } =
    usePriceEngineCalendars()

  // Upload preview state
  const [isLoading, setIsLoading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [uploadedData, setUploadedData] = useState<HolidayValidationResult[]>([])
  const [uploadErrors, setUploadErrors] = useState<string[]>([])

  const hasUnsavedChanges = uploadedData.length > 0

  useNavigationBlock({
    blockCondition: hasUnsavedChanges,
    modalTitle: 'Calendar has unsaved changes',
    modalContent: 'If you leave this page, you will lose any unsaved changes. Are you sure?',
  })

  const {
    data: calendarPeriods,
    isLoading: isCalendarPeriodsLoading,
    refetch,
  } = getHolidays({
    StartDate: dates?.[0] ? moment(dates[0]).format(dateFormat.ISO) : undefined,
    EndDate: dates?.[1] ? moment(dates[1]).format(dateFormat.ISO) : undefined,
  })

  const errorCount = useMemo(() => uploadedData.filter((row) => row.validationErrors.length > 0).length, [uploadedData])

  const handleDownload = () => {
    if (!dates?.[0] || !dates?.[1]) return

    setIsDownloading(true)
    downloadTemplate(moment(dates[0]).format(dateFormat.ISO), moment(dates[1]).format(dateFormat.ISO))
      .then((resp) => {
        const url = window.URL.createObjectURL(new Blob([resp]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'holidays_template.xlsx')
        document.body.appendChild(link)
        link.click()
        link.remove()
      })
      .finally(() => setIsDownloading(false))
  }

  const handleDelete = (data: any) =>
    deleteHolidays.mutate({
      CalendarPeriodIds: [data.CalendarPeriodId],
    })

  const handleUploadClick = () => {
    hiddenFileInput.current?.click()
  }

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return
    setIsLoading(true)

    const newFile = event.target.files[0]
    const formData = new FormData()
    formData.append('file', newFile)

    try {
      const response = await uploadTemplate(formData)
      if (response?.Data?.length > 0) {
        // First run frontend validation
        const validatedData = validateUploadedHolidays(
          response.Data,
          metadata?.Data?.CalendarList || [],
          calendarPeriods?.Data || []
        )

        // Then parse backend validations (duplicate checks) and add to per-row errors
        if (response?.Validations?.length > 0) {
          response.Validations.forEach((validation: { Message: string }) => {
            const match = validation.Message?.match(/^Row (\d+):(.*)/)
            if (match) {
              const rowIndex = parseInt(match[1], 10)
              const errorMessage = match[2].trim()
              // Find the row by rowIndex (rowIndex is Excel row: 1-indexed + header, so row 2 = index 0)
              const dataIndex = rowIndex - 2
              if (dataIndex >= 0 && dataIndex < validatedData.length) {
                validatedData[dataIndex].validationErrors.push(errorMessage)
              }
            }
          })
        }

        setUploadedData(validatedData)
      } else {
        NotificationMessage('Error', 'No holidays found in the uploaded file', true)
      }
    } catch (error) {
      NotificationMessage('Error', 'Failed to upload file', true)
    }
    setIsLoading(false)

    if (hiddenFileInput.current) {
      hiddenFileInput.current.value = ''
    }
  }

  const handleSaveAll = async () => {
    if (errorCount > 0) return

    setIsLoading(true)
    try {
      const dataToSubmit = uploadedData.map((row) => row.originalData)
      await submitUploadedHolidays.mutateAsync(dataToSubmit as any)

      setUploadedData([])
      refetch()
      NotificationMessage('Success', 'Holidays saved successfully', false)
    } catch (error) {
      NotificationMessage('Error', 'Failed to save holidays', true)
    }
    setIsLoading(false)
  }

  const handleAbort = () => {
    setUploadedData([])
    if (hiddenFileInput.current) {
      hiddenFileInput.current.value = ''
    }
  }

  const agPropOverrides = useMemo(() => ({ getRowId: (row) => row.data.CalendarPeriodId }), [])
  const previewAgPropOverrides = useMemo(
    () => ({
      getRowId: (row) => row?.data?.rowIndex,
    }),
    [uploadedData]
  )

  const columnDefs = useMemo(
    () => getColumnDefs(handleDelete),

    [handleDelete, calendarPeriods?.Data]
  )

  const uploadPreviewColumnDefs = useMemo(() => getUploadPreviewColumnDefs(setUploadErrors), [setUploadErrors])

  const controlBarProps = useMemo(
    () => ({
      title: uploadedData.length > 0 ? 'Upload Preview' : 'Manage Holidays',
      actionButtons:
        !uploadedData.length > 0 ? (
          <Horizontal horizontalCenter className={'gap-10'}>
            <Horizontal horizontalCenter>
              <GraviButton
                icon={<DownloadOutlined />}
                buttonText='Download Template'
                onClick={handleDownload}
                appearance='outline'
                loading={isDownloading}
              />
              {canWrite && (
                <GraviButton
                  icon={<CloudUploadOutlined />}
                  buttonText='Upload File'
                  onClick={handleUploadClick}
                  appearance='outline'
                />
              )}
            </Horizontal>
            <input
              type='file'
              onChange={handleUpload}
              ref={hiddenFileInput}
              style={{ display: 'none' }}
              accept='.xlsx,.xls,.csv'
            />

            <RangePicker
              placement='bottomRight'
              inputKey='Dates'
              dates={dates?.map((date) => moment(date))}
              onChange={(dates) => setDates(dates?.map((date) => moment(date)))}
            />
          </Horizontal>
        ) : null,
    }),
    [canWrite, dates, handleDownload, uploadedData]
  )

  return (
    <>
      <ErrorsDrawer uploadErrors={uploadErrors} setUploadErrors={setUploadErrors} />
      <Vertical style={{ height: '100%' }}>
        {uploadedData.length > 0 ? (
          <GraviGrid
            key='upload-preview-grid'
            rowData={uploadedData}
            columnDefs={uploadPreviewColumnDefs}
            agPropOverrides={previewAgPropOverrides}
            controlBarProps={controlBarProps}
            loading={isLoading}
          />
        ) : (
          <GraviGrid
            key='holidays-main-grid'
            storageKey={storageKey}
            rowData={calendarPeriods?.Data}
            columnDefs={columnDefs}
            agPropOverrides={agPropOverrides}
            controlBarProps={controlBarProps}
            loading={isCalendarPeriodsLoading}
          />
        )}

        {uploadedData.length > 0 && canWrite && (
          <Horizontal className='justify-end pr-5 py-3' style={{ gap: 20 }}>
            <GraviButton buttonText='Abort' onClick={handleAbort} />
            <GraviButton buttonText='Save All' onClick={handleSaveAll} success disabled={errorCount > 0} />
          </Horizontal>
        )}
      </Vertical>
    </>
  )
}
