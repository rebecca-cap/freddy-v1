import { GraviGrid, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import type { QuoteBookMetadataResponse } from '@modules/PricingEngine/QuoteBook/Api/types.schema'
import type { PendingExceptionRow } from '@modules/PricingEngine/QuoteBook/Api/usePriceExceptionConfirmFlow'
import { resolveSeverityLabel } from '@modules/PricingEngine/QuoteBook/Components/Grid/Components/columns/helpers'
import { SeverityCountDisplay } from '@modules/PricingEngine/QuoteBook/Components/Grid/Components/columns/sections/PricingExceptions/CountColumn'
import type { GetRowIdParams } from 'ag-grid-community'
import { Modal } from 'antd'
import { useMemo } from 'react'
import { getPriceExceptionConfirmColumnDefs } from './PriceExceptionConfirmColumnDefs'
import styles from './PriceExceptionConfirmModal.module.css'

interface PriceExceptionConfirmModalProps {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
  rows: PendingExceptionRow[]
  metadata?: QuoteBookMetadataResponse
}

export function PriceExceptionConfirmModal({
  open,
  onCancel,
  onConfirm,
  rows,
  metadata,
}: PriceExceptionConfirmModalProps) {
  const sortedRows = useMemo(() => {
    const withSeverity = rows.map((r) => ({
      ...r,
      hasCritical: r.exceptions.some((e) => resolveSeverityLabel(e.Severity, metadata) === 'Critical'),
      hasWarning: r.exceptions.some((e) => resolveSeverityLabel(e.Severity, metadata) === 'Warning'),
    }))
    withSeverity.sort((a, b) => Number(b.hasCritical) - Number(a.hasCritical))
    return withSeverity
  }, [rows, metadata])

  const criticalRowCount = sortedRows.filter((r) => r.hasCritical).length
  const warningRowCount = sortedRows.filter((r) => r.hasWarning).length

  const columnDefs = useMemo(() => getPriceExceptionConfirmColumnDefs(metadata), [metadata])
  const agPropOverrides = useMemo(
    () => ({
      getRowId: (row: GetRowIdParams<PendingExceptionRow>) => row.data.mappingId.toString(),
      rowGroupPanelShow: 'never' as const,
      rowHeight: 35,
      headerHeight: 30
    }),
    []
  )

  return (
    <Modal
      open={open}
      title={<Texto category='h5'>Pricing Exceptions Detected</Texto>}
      destroyOnHidden
      width={600}
      centered
      okText='Save Anyway'
      cancelText='Cancel'
      onOk={onConfirm}
      onCancel={onCancel}
    >
      <Vertical className={styles.body} gap={24}>
        <Horizontal verticalCenter gap={24}>
          <Texto category='p2' textTransform={'capitalize'}>
            {sortedRows.length} row{sortedRows.length !== 1 ? 's' : ''} {sortedRows.length === 1 ? 'has' : 'have'}{' '}
            pricing exceptions:
          </Texto>
          <SeverityCountDisplay criticalCount={criticalRowCount} warningCount={warningRowCount} />
        </Horizontal>
        <div className={styles.gridWrapper}>
          <GraviGrid columnDefs={columnDefs} rowData={sortedRows} agPropOverrides={agPropOverrides}  />
        </div>
        <Texto category='p2' >Do you want to save anyway?</Texto>
      </Vertical>
    </Modal>
  )
}
