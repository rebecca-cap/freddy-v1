import React, { useMemo } from 'react'

import type { CompetitorMappingQuoteRow } from '../../Api/types.schema'
import styles from '../../styles.module.css'

type Props = {
  selectedRows: CompetitorMappingQuoteRow[]
}

export function SelectedRowsSummary({ selectedRows }: Props) {
  const summary = useMemo(() => {
    const terminals = [...new Set(selectedRows.map((r) => r.LocationName).filter(Boolean) as string[])]
    const products = [...new Set(selectedRows.map((r) => r.ProductName).filter(Boolean) as string[])]
    return { rows: selectedRows.length, terminals, products }
  }, [selectedRows])

  const renderLine = (label: string, value: React.ReactNode, title?: string) => (
    <div className={styles.selectionLine}>
      <span className={styles.selectionLineLabel}>{label}</span>
      <span className={styles.selectionLineValue} title={title}>
        {value}
      </span>
    </div>
  )

  const terminalsText = summary.terminals.join(' · ')
  const productsText = summary.products.join(' · ')

  return (
    <div className={styles.configSection}>
      <div className={styles.configLabel}>Selected Quote Rows</div>
      {renderLine('Rows selected', summary.rows)}
      {renderLine('Terminals', terminalsText, terminalsText)}
      {renderLine('Products', productsText, productsText)}
    </div>
  )
}
