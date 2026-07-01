import './styles.css'

import { CloudUploadOutlined, DownloadOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import { ErrorsDrawer } from '@components/shared/Uploaders/ErrorsDrawer'
import { useUser } from '@contexts/UserContext'
import { GraviButton, GraviGrid, Horizontal, NotificationMessage, Texto, Vertical } from '@gravitate-js/excalibrr'
import { PriceUploadData, UploadedModel } from '@modules/Admin/ManagePrices/api/types.schema'
import { useManagePrices } from '@modules/Admin/ManagePrices/api/useManagePrices'
import { toAntOption } from '@utils/index'
import { GridApi } from 'ag-grid-community'
import { Checkbox, Form, Select } from 'antd'
import { useEffect, useMemo, useRef, useState } from 'react'

import { getColumnDefs } from './components/colDefs'
import { ConflictDetailsModal } from './components/ConflictDetailsModal'

export function ManagePricesPage() {
  const { userPermissions } = useUser()
  const canWrite = !!userPermissions?.Prices?.Write
  const gridRef = useRef<GridApi<UploadedModel> | null>(null)
  const hiddenFileInput = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<PriceUploadData | null>(null)
  const [gridRows, setGridRows] = useState<UploadedModel[]>([])
  const [recordCount, setRecordCount] = useState({ updated: 0, warning: 0, error: 0 })
  const [priceUploadType, setPriceUploadType] = useState('')
  const { useMetadataQuery, getTemplateForPublisher, uploadFile, submitPrices, getConflictDetails } = useManagePrices()
  const { data: pricesMetadata } = useMetadataQuery()
  const [form] = Form.useForm()

  const [uploadErrors, setUploadErrors] = useState<string[]>([])
  const [isConflictModalVisible, setIsConflictModalVisible] = useState(false)
  const [selectedConflictIds, setSelectedConflictIds] = useState<number[]>([])
  const [selectedUploadedRow, setSelectedUploadedRow] = useState<UploadedModel | undefined>(undefined)

  useEffect(() => {
    form.setFieldsValue({ CurveIdentifierTypeId: 'PriceInstrumentId' })
  }, [])

  const handleConflictClick = (conflictIds: number[], uploadedRow: UploadedModel) => {
    setSelectedConflictIds(conflictIds)
    setSelectedUploadedRow(uploadedRow)
    setIsConflictModalVisible(true)
  }

  const handleConflictModalClose = () => {
    setIsConflictModalVisible(false)
    setSelectedConflictIds([])
    setSelectedUploadedRow(undefined)
  }

  const columnDefs = useMemo(
    () => getColumnDefs(data, priceUploadType, setUploadErrors, handleConflictClick),
    [data, priceUploadType]
  )

  const handleDownload = async () => {
    form.submit()
    const pricePublisherId = form.getFieldValue('PricePublisherId')
    const priceUploadTypeId = form.getFieldValue('PriceUploadTypeId')
    const curveIdentifierTypeId = form.getFieldValue('CurveIdentifierTypeId')
    const includeFutureEffectivePrices = form.getFieldValue('IncludeFutureEffectivePrices') || false

    if (pricePublisherId && priceUploadTypeId && curveIdentifierTypeId) {
      const response = await getTemplateForPublisher(
        pricePublisherId,
        curveIdentifierTypeId,
        priceUploadTypeId,
        includeFutureEffectivePrices
      )
      const dataBlob = new Blob([response as any])
      const responseText = await response.text()

      if (responseText.includes('workbook')) {
        const url = window.URL.createObjectURL(dataBlob)
        const link = document.createElement('a')
        const filename = `PriceTemplate_${priceUploadType}.xlsx`
        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
      } else {
        const errors = JSON.parse(responseText)
        NotificationMessage(
          errors[0]?.Category || 'Error',
          errors[0]?.Message || 'Unable to download excel with selected options'
        )
      }
    }
  }

  const handleUploadClick = () => {
    hiddenFileInput.current?.click()
  }

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length === 0) return
    setIsLoading(true)
    const newFile = event.target.files?.[0]
    if (!newFile) return

    const formData = new FormData()
    formData.append('file', newFile)

    try {
      const response = await uploadFile(formData)
      if (response && response.Data) {
        const sheetData = response.Data[0]
        const uploadType = sheetData.UploadConfiguration.UploadType
        setData(sheetData)
        setGridRows(sheetData.UploadedModels)
        setPriceUploadType(uploadType)
        setRecordCount((prev) => {
          return {
            ...prev,
            error: sheetData.UploadedModels.filter((item) => item.Model.ValidationMessages.length > 0).length || 0,
          }
        })
      } else {
        NotificationMessage(
          response?.Validations?.[0]?.Category || 'Error Uploading File',
          response?.Validations?.[0]?.Message || 'Unable to upload file',
          true
        )
      }
    } catch (error) {
      console.log(error)
      NotificationMessage('Error', 'Failed to upload file', true)
    }
    setIsLoading(false)
    gridRef?.current?.redrawRows()
  }
  const handleSave = async () => {
    if (!data) return

    setIsLoading(true)
    const payload = [
      {
        UploadConfiguration: data.UploadConfiguration,
        UniqueId: data.UniqueId,
        UploadedModels: data.UploadedModels,
        SheetName: data.SheetName,
        SheetValidations: data.SheetValidations,
        PriceTypes: data.PriceTypes,
      },
    ]
    try {
      const response = await submitPrices(payload)
      const recordsUpdated = (response?.Data?.Saved || 0) + (response?.Data?.Updated || 0)

      if (response && response?.Data) {
        setGridRows([])
        setIsLoading(false)
        setRecordCount((prev) => {
          return { ...prev, updated: response.TotalRecords || 0 }
        })
        if (hiddenFileInput.current) {
          hiddenFileInput.current.value = ''
        }
        NotificationMessage('Success', `${recordsUpdated} record(s) saved`, false)
      } else {
        NotificationMessage(
          response?.Validations?.[0]?.Category || 'Error Uploading File',
          response?.Validations?.[0]?.Message || 'Unable to upload file',
          true
        )
        setIsLoading(false)
      }
    } catch (error) {
      console.log(error)
      NotificationMessage('Error', 'Failed to save records', true)
      setIsLoading(false)
    }
  }

  const handleAbort = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.value = ''
    }
    setGridRows([])
    setData(null)
    setRecordCount({ updated: 0, warning: 0, error: 0 })
    setIsLoading(false)
  }

  return (
    <>
      <ErrorsDrawer uploadErrors={uploadErrors} setUploadErrors={(errors: string[]) => setUploadErrors(errors)} />
      <Form form={form} style={{ height: '100%' }}>
        <Vertical flex={2}>
          <Horizontal className='mt-3' flex={0.2} style={{ minHeight: 130 }}>
            <Vertical flex={0.5}>
              <Horizontal className='full-height-width' flex={1}>
                <GraviButton
                  className='full-height-width '
                  icon={<DownloadOutlined />}
                  buttonText='Download Template'
                  onClick={handleDownload}
                  appearance='outline'
                />
              </Horizontal>
              <Horizontal flex={1}>
                <GraviButton
                  className='full-height-width'
                  icon={<CloudUploadOutlined />}
                  buttonText='Upload File'
                  onClick={handleUploadClick}
                  appearance='outline'
                  disabled={!canWrite}
                />
              </Horizontal>
            </Vertical>
            <Vertical className='p-3 border-top bg-2' flex={1}>
              <Horizontal>
                <Form.Item
                  name='PriceUploadTypeId'
                  rules={[{ required: true, message: 'Please select a publisher to download a template' }]}
                  style={{ flex: 1 }}
                >
                  <Select
                    placeholder='Select upload type'
                    className='full-height-width'
                    optionFilterProp='children'
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    showSearch
                    options={pricesMetadata?.Data?.PriceUploadTypeList?.map(toAntOption)}
                    onChange={setPriceUploadType}
                  />
                </Form.Item>
              </Horizontal>
              <Horizontal>
                <Form.Item
                  name='PricePublisherId'
                  rules={[{ required: true, message: 'Please select a publisher to download a template' }]}
                  style={{ flex: 1 }}
                >
                  <Select
                    placeholder='Select a Publisher'
                    className='full-height-width'
                    optionFilterProp='children'
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    showSearch
                    options={pricesMetadata?.Data?.PricePublisherList?.map(toAntOption)}
                  />
                </Form.Item>
              </Horizontal>
            </Vertical>
            <Vertical className='p-3 border-top bg-2' flex={1}>
              <Horizontal>
                <Form.Item
                  name='CurveIdentifierTypeId'
                  rules={[{ required: true, message: 'Please select a price instrument ID' }]}
                  style={{ flex: 1 }}
                >
                  <Select
                    placeholder='Select a Price Instrument ID'
                    className='full-height-width'
                    optionFilterProp='children'
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    showSearch
                    options={pricesMetadata?.Data?.CurveIdentifierTypeList?.map(toAntOption)}
                  />
                </Form.Item>
              </Horizontal>
              <Horizontal>
                <Horizontal verticalCenter className={'mr-2'}>
                  <Texto>Include Future Effective Dates: </Texto>
                </Horizontal>
                <Form.Item name={'IncludeFutureEffectivePrices'} valuePropName='checked' style={{ flex: 1 }}>
                  <Checkbox />
                </Form.Item>
              </Horizontal>
            </Vertical>
            <Vertical className='p-2 border-top border-right bg-2' flex={1}>
              <Horizontal justifyContent='flex-end' className='p-2'>
                <input type='file' onChange={handleUpload} ref={hiddenFileInput} style={{ display: 'none' }} />
              </Horizontal>
            </Vertical>
            <Vertical className='p-3' flex={0.5}>
              <Horizontal
                verticalCenter
                className='p-3 border-error full-height-width'
                style={{ backgroundColor: recordCount?.error > 0 ? 'var(--theme-error-dim)' : '' }}
              >
                <Vertical height='auto'>
                  <Texto category='h5'> {recordCount?.error} </Texto>
                  <Texto> Record Errors</Texto>
                </Vertical>
                <ExclamationCircleFilled className='text-error text-size-8' />
              </Horizontal>
            </Vertical>
          </Horizontal>
          <Horizontal flex={1.7}>
            <Vertical>
              <GraviGrid
                columnDefs={columnDefs}
                controlBarProps={{
                  title: 'Manage Prices',
                  hideActiveFilters: false,
                }}
                rowData={gridRows}
                loading={isLoading}
                externalRef={gridRef as React.MutableRefObject<GridApi>}
                agPropOverrides={{
                  getRowId: (row) => row.data.Row.toString(),
                }}
              />
            </Vertical>
          </Horizontal>
          {canWrite && (
            <Horizontal className='justify-end pr-5 py-2' style={{ gap: 50 }} flex={0.1}>
              <GraviButton buttonText='Abort' onClick={handleAbort} />
              <GraviButton buttonText='Save All' onClick={handleSave} success disabled={recordCount.error > 0} />
            </Horizontal>
          )}
        </Vertical>
      </Form>
      <ConflictDetailsModal
        visible={isConflictModalVisible}
        onCancel={handleConflictModalClose}
        conflictIds={selectedConflictIds}
        uploadedRow={selectedUploadedRow}
        priceTypes={data?.PriceTypes}
        onGetConflictDetails={getConflictDetails}
      />
    </>
  )
}
