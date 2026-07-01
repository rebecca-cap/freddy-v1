import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import React, { useMemo } from 'react'

import type { CompetitorMappingQuoteRow } from '../../Api/types.schema'
import styles from '../../styles.module.css'

type Props = {
  selectedRows: CompetitorMappingQuoteRow[]
}

// Cap inline rendering — beyond this, show a "and N more" footer instead
// of mounting thousands of DOM nodes.
const MAX_RENDERED_ROWS = 50

export function CurrentMappings({ selectedRows }: Props) {
  const totalMappings = useMemo(
    () => selectedRows.reduce((sum, r) => sum + (r.CompetitorAssociationCount ?? 0), 0),
    [selectedRows]
  )

  const visibleRows = useMemo(
    () => (selectedRows.length > MAX_RENDERED_ROWS ? selectedRows.slice(0, MAX_RENDERED_ROWS) : selectedRows),
    [selectedRows]
  )
  const hiddenCount = selectedRows.length - visibleRows.length

  return (
    <div className={styles.configCard}>
      <div className={styles.configCardHeader}>
        <span>Current Mappings</span>
        <span className={styles.headerBadge}>{totalMappings} total</span>
      </div>
      {visibleRows.map((row) => {
        const count = row.CompetitorAssociationCount ?? 0
        const hasMappings = count > 0
        return (
          <div className={styles.currentMappingsRow} key={row.QuoteConfigurationMappingId}>
            <div>
              <Texto weight={500}>{row.ProductName}</Texto>
              <div className={styles.currentMappingsRowMeta}>
                {row.SelectedCounterPartyName} · {row.LocationName}
              </div>
            </div>
            <Horizontal verticalCenter gap={8}>
              <Texto appearance='medium' className={styles.currentMappingsCompetitors}>
                {hasMappings ? `${count} mapped` : 'No competitors mapped'}
              </Texto>
            </Horizontal>
          </div>
        )
      })}
      {hiddenCount > 0 && (
        <div className={styles.currentMappingsRow}>
          <Texto appearance='medium'>
            …and {hiddenCount.toLocaleString()} more row{hiddenCount === 1 ? '' : 's'} (
            {selectedRows.length.toLocaleString()} selected total)
          </Texto>
        </div>
      )}
    </div>
  )
}
