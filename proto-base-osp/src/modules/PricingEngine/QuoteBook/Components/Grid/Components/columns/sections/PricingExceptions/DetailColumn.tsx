import type {
  PriceException,
  Quote,
  QuoteBookMetadataResponse,
} from '@modules/PricingEngine/QuoteBook/Api/types.schema'
import {
  resolveComponentName,
  resolveSeverityLabel,
} from '@modules/PricingEngine/QuoteBook/Components/Grid/Components/columns/helpers'
import type { ColDef, ICellRendererParams } from 'ag-grid-community'
import { Tag, Tooltip } from 'antd'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'

import styles from './PricingExceptionColumns.module.css'

export function ExceptionDetailsColumn(metadata?: QuoteBookMetadataResponse): ColDef<Quote> {
  return {
    colId: 'PriceExceptionDetails',
    headerName: 'Details',
    editable: false,
    sortable: true,
    cellClass: styles.detailCell,
    filterValueGetter: (params) => {
      const exceptions = params?.data?.PriceExceptions
      if (!exceptions || exceptions.length === 0) return 'None'
      return exceptions.map((e) => resolveComponentName(e.ComponentCvId, metadata))
    },
    valueGetter: (params) => {
      const exceptions = params?.data?.PriceExceptions
      if (!exceptions || exceptions.length === 0) return ''
      return exceptions.map((e) => resolveComponentName(e.ComponentCvId, metadata))
    },
    cellRenderer: (params: ICellRendererParams<Quote>) => {
      const exceptions = params?.data?.PriceExceptions
      if (!exceptions || exceptions.length === 0) return ''
      return <ResponsiveTagCluster exceptions={exceptions} metadata={metadata} />
    },
  }
}

function SeverityMiniTag({
  name,
  severity,
  metadata,
}: {
  name: string
  severity: PriceException['Severity']
  metadata?: QuoteBookMetadataResponse
}) {
  const label = resolveSeverityLabel(severity, metadata)
  return (
    <Tag color={label === 'Critical' ? 'error' : 'warning'} className={`${styles.tagBase} ${styles.miniTag}`}>
      {name}
    </Tag>
  )
}

export function ResponsiveTagCluster({
  exceptions,
  metadata,
}: {
  exceptions: PriceException[]
  metadata?: QuoteBookMetadataResponse
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const overflowRef = useRef<HTMLSpanElement>(null)
  const [visibleCount, setVisibleCount] = useState(exceptions.length)

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const recompute = () => {
      const containerWidth = container.clientWidth
      const tagEls = measureRef.current?.querySelectorAll<HTMLElement>('[data-tag]') ?? []
      const overflowWidth = overflowRef.current?.offsetWidth ?? 0
      const gap = 4

      let used = 0
      let fit = 0
      for (let i = 0; i < tagEls.length; i++) {
        const w = tagEls[i].offsetWidth + (i > 0 ? gap : 0)
        const remaining = exceptions.length - (i + 1)
        const reserve = remaining > 0 ? overflowWidth + gap : 0
        if (used + w + reserve <= containerWidth) {
          used += w
          fit = i + 1
        } else {
          break
        }
      }

      setVisibleCount(Math.max(1, fit))
    }

    recompute()
    const ro = new ResizeObserver(recompute)
    ro.observe(container)
    return () => ro.disconnect()
  }, [exceptions])
  const sortedExceptions = useMemo(
    () => [...exceptions].sort((a, b) => (a.Severity ?? 0) - (b.Severity ?? 0)),
    [exceptions]
  )
  const visible = sortedExceptions.slice(0, visibleCount)
  const hidden = sortedExceptions.slice(visibleCount)

  return (
    <div ref={containerRef} className={`${styles.tagRow} ${styles.tagCluster}`}>
      <div ref={measureRef} className={`${styles.tagRow} ${styles.measureLayer}`} aria-hidden>
        {exceptions.map((e, i) => (
          <span data-tag key={`m-${e.ComponentCvId}-${i}`}>
            <SeverityMiniTag
              name={resolveComponentName(e.ComponentCvId, metadata)}
              severity={e.Severity}
              metadata={metadata}
            />
          </span>
        ))}
        <span ref={overflowRef}>
          <Tag className={`${styles.tagBase} ${styles.overflowTag}`}>+{exceptions.length}</Tag>
        </span>
      </div>

      {visible.map((e, i) => {
        const name = resolveComponentName(e.ComponentCvId, metadata)
        return (
          <Tooltip key={`${e.ComponentCvId}-${i}`} title={name}>
            <SeverityMiniTag name={name} severity={e.Severity} metadata={metadata} />
          </Tooltip>
        )
      })}
      {hidden.length > 0 && (
        <Tooltip
          title={
            <div className={styles.tooltipList}>
              {hidden.map((e, i) => (
                <SeverityMiniTag
                  key={`${e.ComponentCvId}-${i}`}
                  name={resolveComponentName(e.ComponentCvId, metadata)}
                  severity={e.Severity}
                  metadata={metadata}
                />
              ))}
            </div>
          }
        >
          <Tag className={`${styles.tagBase} ${styles.overflowTag}`}>+{hidden.length}</Tag>
        </Tooltip>
      )}
    </div>
  )
}
