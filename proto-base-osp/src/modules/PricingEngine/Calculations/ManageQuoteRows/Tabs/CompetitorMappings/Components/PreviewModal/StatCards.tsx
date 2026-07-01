import { PlusOutlined } from '@ant-design/icons'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import React from 'react'

import styles from '../../styles.module.css'

type Props = {
  quoteRowCount: number
  competitorsFound: number
  newMappings: number
  alreadyExist: number
}

type Section = { label: string; value: number; hint: string; icon?: React.ReactNode }

// Divider-separated label/value sections, matching the Measurement Details
// header banner pattern.
export function StatCards({ quoteRowCount, competitorsFound, newMappings, alreadyExist }: Props) {
  const sections: Section[] = [
    { label: 'Quote Rows', value: quoteRowCount, hint: quoteRowCount === 1 ? 'selected' : 'selected rows' },
    {
      label: 'Competitors Found',
      value: competitorsFound,
      hint: competitorsFound === 1 ? 'total match' : 'total matches',
    },
    {
      label: 'New Mappings',
      value: newMappings,
      hint: 'will be created',
      // Suppress the plus at zero — "+ 0" reads like an action prompt.
      icon: newMappings > 0 ? <PlusOutlined className={styles.statValueIcon} /> : undefined,
    },
    { label: 'Already Exist', value: alreadyExist, hint: 'will be skipped' },
  ]

  return (
    <Horizontal className={styles.statBanner} verticalCenter gap={0} flex='none' height='auto'>
      {sections.map((s, i) => (
        <React.Fragment key={s.label}>
          {i > 0 && <div className={styles.statDivider} />}
          <Vertical gap={2} flex='none' height='auto' className={styles.statSection}>
            <Texto className={styles.statLabel} weight={700}>
              {s.label}
            </Texto>
            {/* Inline fontSize/weight beat Texto's own inline `fontSize: fontSizeMap[category]`. */}
            <Horizontal verticalCenter gap={8} flex='none' height='auto'>
              {s.icon}
              <Texto
                className={styles.statValue}
                weight={800}
                style={{ fontSize: 28, lineHeight: 1.1, letterSpacing: '-0.5px' }}
              >
                {s.value.toLocaleString()}
              </Texto>
            </Horizontal>
            <Texto className={styles.statHint}>{s.hint}</Texto>
          </Vertical>
        </React.Fragment>
      ))}
    </Horizontal>
  )
}
