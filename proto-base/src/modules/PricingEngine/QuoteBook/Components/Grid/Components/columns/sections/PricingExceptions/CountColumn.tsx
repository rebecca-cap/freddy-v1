import { StopFilled, WarningFilled } from '@ant-design/icons'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import type {
  PriceException,
  Quote,
  QuoteBookMetadataResponse,
} from '@modules/PricingEngine/QuoteBook/Api/types.schema'
import { resolveSeverityLabel } from '@modules/PricingEngine/QuoteBook/Components/Grid/Components/columns/helpers'
import type { ColDef, ICellRendererParams } from 'ag-grid-community'

import styles from './PricingExceptionColumns.module.css'

interface SeverityCountDisplayProps {
  criticalCount: number
  warningCount: number
}

export function SeverityCountDisplay({ criticalCount, warningCount }: SeverityCountDisplayProps) {
  return (
    <Horizontal verticalCenter gap={5} className={'py-2'}>
      {criticalCount > 0 && (
        <Horizontal gap={2}>
          <StopFilled style={{ color: 'var(--theme-error)' }} />
          <Texto className={styles.ellipsisText}>
            {criticalCount} Critical
            {warningCount > 0 && ', '}
          </Texto>
        </Horizontal>
      )}

      {warningCount > 0 && (
        <Horizontal gap={2}>
          <WarningFilled style={{ color: 'var(--theme-warning)' }} />
          <Texto className={styles.ellipsisText}>{warningCount} Warning</Texto>
        </Horizontal>
      )}
    </Horizontal>
  )
}

interface ExceptionCountSummaryProps {
  exceptions: PriceException[]
  metadata?: QuoteBookMetadataResponse
}

export function ExceptionCountSummary({ exceptions, metadata }: ExceptionCountSummaryProps) {
  const labels = exceptions.map((e) => resolveSeverityLabel(e.Severity, metadata))
  const criticalCount = labels.filter((name) => name === 'Critical').length
  const warningCount = labels.filter((name) => name === 'Warning').length

  return <SeverityCountDisplay criticalCount={criticalCount} warningCount={warningCount} />
}

export function ExceptionCountColumn(metadata?: QuoteBookMetadataResponse): ColDef<Quote> {
  return {
    field: 'PriceExceptions',
    headerName: '',
    editable: false,
    sortable: true,
    filterValueGetter: (params) => {
      const exceptions = params?.data?.PriceExceptions
      if (!exceptions || exceptions.length === 0) return 'None'
      const labels = exceptions.map((e) => resolveSeverityLabel(e.Severity, metadata))
      return ['Critical', 'Warning'].filter((name) => labels.includes(name as 'Critical' | 'Warning'))
    },
    valueGetter: (params) => {
      const exceptions = params?.data?.PriceExceptions
      if (!exceptions || exceptions.length === 0) return null
      return exceptions.length
    },
    cellRenderer: (params: ICellRendererParams<Quote>) => {
      const exceptions = params?.data?.PriceExceptions
      if (!exceptions || exceptions.length === 0) return ''
      return <ExceptionCountSummary exceptions={exceptions} metadata={metadata} />
    },
  }
}
