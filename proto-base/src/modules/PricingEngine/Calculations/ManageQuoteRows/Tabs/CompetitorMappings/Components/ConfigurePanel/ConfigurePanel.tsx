import { InboxOutlined } from '@ant-design/icons'
import { Texto, Vertical } from '@gravitate-js/excalibrr'
import React from 'react'

import type {
  CompetitorMappingQuoteRow,
  CompetitorMappingsMetadata,
  FindMatchingCompetitorsRequest,
} from '../../Api/types.schema'
import styles from '../../styles.module.css'

import { CurrentMappings } from './CurrentMappings'
import { MatchingForm } from './MatchingForm'
import { SelectedRowsSummary } from './SelectedRowsSummary'

type Props = {
  canWrite: boolean
  selectedRows: CompetitorMappingQuoteRow[]
  metadata: CompetitorMappingsMetadata | undefined
  isFinding: boolean
  onFindMatching: (request: FindMatchingCompetitorsRequest) => void
}

export function ConfigurePanel({ canWrite, selectedRows, metadata, isFinding, onFindMatching }: Props) {
  if (!selectedRows.length) {
    return (
      <div className={styles.panelRoot}>
        <div className={styles.configCard}>
          <Vertical horizontalCenter className={styles.emptyState}>
            <InboxOutlined className={styles.emptyStateIcon} />
            <Texto weight={600} style={{ marginBottom: 4 }}>
              No quote rows selected
            </Texto>
            <Texto appearance='medium' style={{ fontSize: 11 }}>
              Select one or more quote rows on the left to begin creating competitor mappings.
            </Texto>
          </Vertical>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.panelRoot}>
      <div className={styles.configCard}>
        <div className={styles.configCardHeader}>Configure Matching</div>
        <SelectedRowsSummary selectedRows={selectedRows} />
        <MatchingForm
          canWrite={canWrite}
          selectedRows={selectedRows}
          metadata={metadata}
          isFinding={isFinding}
          onFindMatching={onFindMatching}
        />
      </div>
      <CurrentMappings selectedRows={selectedRows} />
    </div>
  )
}
