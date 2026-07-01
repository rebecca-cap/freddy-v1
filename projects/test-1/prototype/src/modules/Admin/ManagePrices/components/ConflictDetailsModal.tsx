import './ConflictDetailsModal.css'

import { CloseOutlined } from '@ant-design/icons'
import { dateFormat } from '@components/TheArmory/helpers'
import { GraviButton, GraviGrid, Vertical } from '@gravitate-js/excalibrr'
import {
  ConflictDetailPivoted,
  ConflictDetailsData,
  ConflictDetailsResponse,
  PriceTypeInfo,
  UploadedModel,
} from '@modules/Admin/ManagePrices/api/types.schema'
import { Modal, Table } from 'antd'
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'

import { ConflictDetailColumnDefs } from './ConflictDetailColumnDefs'

interface ConflictDetailsModalProps {
  visible: boolean
  onCancel: () => void
  conflictIds: number[]
  uploadedRow?: UploadedModel
  priceTypes?: PriceTypeInfo[]
  onGetConflictDetails?: (conflictIds: number[]) => Promise<ConflictDetailsResponse>
}

export function ConflictDetailsModal({
  visible,
  onCancel,
  conflictIds,
  uploadedRow,
  priceTypes,
  onGetConflictDetails,
}: ConflictDetailsModalProps) {
  const [loading, setLoading] = useState(false)
  const [conflictData, setConflictData] = useState<ConflictDetailPivoted[]>([])
  const [conflictPriceTypes, setConflictPriceTypes] = useState<string[]>([])

  // Transform API response data to pivot price types into columns
  const pivotConflictData = (data: ConflictDetailsData[]): ConflictDetailPivoted[] => {
    return data.map((row) => {
      const pivotedRow: ConflictDetailPivoted = {
        CurvePointId: row.CurvePointId,
        EffectiveFromDateTime: row.EffectiveFromDateTime,
        EffectiveToDateTime: row.EffectiveToDateTime,
      }

      // Add each price type as a column
      row.Prices.forEach((price) => {
        pivotedRow[price.PriceType] = price.Value
      })

      return pivotedRow
    })
  }

  // Extract distinct price types from all rows (backend returns them sorted)
  const extractPriceTypes = (data: ConflictDetailsData[]): string[] => {
    const priceTypeSet = new Set<string>()
    data.forEach((row) => {
      row.Prices.forEach((price) => {
        priceTypeSet.add(price.PriceType)
      })
    })
    return Array.from(priceTypeSet)
  }

  const fetchConflictDetails = useMemo(
    () => async () => {
      setLoading(true)
      try {
        if (onGetConflictDetails) {
          const response = await onGetConflictDetails(conflictIds)
          const types = extractPriceTypes(response.Data)
          setConflictPriceTypes(types)
          const pivotedData = pivotConflictData(response.Data)
          setConflictData(pivotedData)
        }
      } catch (error) {
        console.error('Error fetching conflict details:', error)
        setConflictData([])
        setConflictPriceTypes([])
      } finally {
        setLoading(false)
      }
    },
    [conflictIds, onGetConflictDetails]
  )

  useEffect(() => {
    if (visible && conflictIds.length > 0) {
      fetchConflictDetails()
    }
  }, [visible, conflictIds, fetchConflictDetails])

  const columnDefs = useMemo(() => ConflictDetailColumnDefs(conflictPriceTypes), [conflictPriceTypes])

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (row: any) => row.data.CurvePointId,
    }),
    []
  )

  const handleClose = () => {
    setConflictData([])
    onCancel()
  }

  const controlBarProps = useMemo(
    () => ({
      title: 'Conflicting Saved Prices',
      hideActiveFilters: false,
    }),
    []
  )

  // Build uploaded row data - pivoted to match grid structure
  const uploadedRowData = useMemo(() => {
    if (!uploadedRow || !priceTypes) return []

    const formatDate = (date: string | null | undefined) => {
      return date ? moment(date).format(dateFormat.DATE_TIME) : ''
    }

    const rowData = {
      InstrumentName: uploadedRow.Model.InstrumentName || '',
      LocationName: uploadedRow.Model.LocationName || '',
      ProductName: uploadedRow.Model.ProductName || '',
      EffectiveFromDateTime: formatDate(uploadedRow.Model.EffectiveFromDateTime),
      EffectiveToDateTime: formatDate(uploadedRow.Model.EffectiveToDateTime),
    }

    // Add price type columns (already sorted by backend)
    priceTypes.forEach((priceType) => {
      rowData[priceType.Display] = uploadedRow.Model.NewPoints[priceType.PriceTypeCvId.toString()] || 0
    })

    return [rowData]
  }, [uploadedRow, priceTypes])

  const uploadedRowColumns = useMemo(() => {
    if (!uploadedRow || !priceTypes) return []

    const staticColumns = [
      { title: 'Instrument Name', dataIndex: 'InstrumentName', key: 'InstrumentName', width: 150 },
      { title: 'Location Name', dataIndex: 'LocationName', key: 'LocationName', width: 150 },
      { title: 'Product Name', dataIndex: 'ProductName', key: 'ProductName', width: 150 },
      { title: 'Effective From', dataIndex: 'EffectiveFromDateTime', key: 'EffectiveFromDateTime', width: 180 },
      { title: 'Effective To', dataIndex: 'EffectiveToDateTime', key: 'EffectiveToDateTime', width: 180 },
    ]

    const priceTypeColumns = priceTypes.map((priceType) => ({
      title: priceType.Display,
      dataIndex: priceType.Display,
      key: priceType.Display,
      width: 100,
    }))

    return [...staticColumns, ...priceTypeColumns]
  }, [uploadedRow, priceTypes])

  return (
    <Modal
      visible={visible}
      title={`Price Conflicts (${conflictIds.length})`}
      footer={[<GraviButton key='close' icon={<CloseOutlined />} buttonText='Close' onClick={handleClose} />]}
      onCancel={handleClose}
      destroyOnClose
      width='80vw'
      bodyStyle={{ height: '70vh', fontSize: '12px', display: 'flex', flexDirection: 'column' }}
    >
      <Vertical style={{ height: '100%', gap: '16px' }}>
        {uploadedRow && (
          <div>
            <h3 style={{ marginBottom: '8px' }}>Uploaded Row Data</h3>
            <Table
              dataSource={uploadedRowData}
              columns={uploadedRowColumns}
              pagination={false}
              size='small'
              rowKey='CurvePointId'
              scroll={{ x: 'max-content' }}
              style={{ marginBottom: '16px' }}
              rowClassName={() => 'uploaded-row-highlight'}
            />
          </div>
        )}
        <div style={{ flex: 1, minHeight: 0 }}>
          <GraviGrid
            columnDefs={columnDefs as any}
            rowData={conflictData}
            loading={loading}
            controlBarProps={controlBarProps}
            agPropOverrides={agPropOverrides}
          />
        </div>
      </Vertical>
    </Modal>
  )
}
