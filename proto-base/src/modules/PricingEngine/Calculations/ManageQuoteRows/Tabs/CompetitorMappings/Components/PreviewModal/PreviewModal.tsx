import { CloseOutlined } from '@ant-design/icons'
import { GraviGrid } from '@gravitate-js/excalibrr'
import { Alert, Button, Drawer, Empty } from 'antd'
import React, { useMemo } from 'react'

import type { CompetitorMatchResultGroup } from '../../Api/types.schema'

import { StatCards } from './StatCards'
import { getPreviewColumnDefs } from './columnDefs'

type Props = {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
  results: CompetitorMatchResultGroup[]
  isCreating: boolean
}

type FlatRow = {
  RowId: string
  GroupKey: string
  CompetitorName: string
  PublisherName: string
  TerminalName: string
  ProductName: string
  QuoteCompetitorCategoryName: string | null
  IsCompetitorPriceAssociated: boolean
  // Set when a selected quote row had zero matches — we still emit a row so
  // the group header appears in the preview, so the user can see all their
  // selections reflected even when nothing matched.
  IsPlaceholder?: boolean
}

// Green tint on rows that will be created (matches the prototype banding).
const NEW_ROW_STYLE = { backgroundColor: 'var(--theme-success-trans, #f0fdf4)' as const }

export function PreviewModal({ open, onCancel, onConfirm, results, isCreating }: Props) {
  const { rows, stats } = useMemo(() => {
    const flat: FlatRow[] = []
    let competitorsFound = 0
    let newMappings = 0
    let alreadyExist = 0
    results.forEach((group) => {
      const groupKey = `${group.ConfigurationName ?? ''} | ${group.CounterPartyName ?? ''} | ${group.TerminalName ?? ''} | ${group.ProductName ?? ''}`
      const competitors = group.Competitors ?? []
      if (competitors.length === 0) {
        // Emit a placeholder so the group header still renders for selected
        // quote rows with no matches. Doesn't affect any of the stats counts.
        flat.push({
          RowId: `${group.QuoteConfigurationMappingId ?? 'm?'}::__empty`,
          GroupKey: groupKey,
          CompetitorName: '',
          PublisherName: '',
          TerminalName: group.TerminalName ?? '',
          ProductName: group.ProductName ?? '',
          QuoteCompetitorCategoryName: null,
          IsCompetitorPriceAssociated: false,
          IsPlaceholder: true,
        })
        return
      }
      competitors.forEach((c) => {
        competitorsFound += 1
        if (c.IsCompetitorPriceAssociated) alreadyExist += 1
        else newMappings += 1
        flat.push({
          RowId: `${group.QuoteConfigurationMappingId ?? 'm?'}::${c.PriceInstrumentId ?? 'pi?'}`,
          GroupKey: groupKey,
          CompetitorName: c.CompetitorName ?? '',
          PublisherName: c.PublisherName ?? '',
          TerminalName: c.TerminalName ?? '',
          ProductName: c.ProductName ?? '',
          QuoteCompetitorCategoryName: c.QuoteCompetitorCategoryName ?? null,
          IsCompetitorPriceAssociated: !!c.IsCompetitorPriceAssociated,
        })
      })
    })
    return {
      rows: flat,
      stats: { quoteRowCount: results.length, competitorsFound, newMappings, alreadyExist },
    }
  }, [results])

  const columnDefs = useMemo(() => getPreviewColumnDefs(), [])
  const noMatches = stats.competitorsFound === 0
  const allExist = !noMatches && stats.newMappings === 0

  const footer = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <span style={{ color: 'var(--theme-text-secondary, #666)', fontSize: 13 }}>
        {noMatches
          ? null
          : `${stats.newMappings} new mapping${stats.newMappings === 1 ? '' : 's'} will be created` +
            (stats.alreadyExist > 0 ? ` (${stats.alreadyExist} existing skipped)` : '')}
      </span>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button onClick={onCancel}>Cancel</Button>
        {!noMatches && (
          <Button type='primary' disabled={stats.newMappings === 0} loading={isCreating} onClick={onConfirm}>
            Create {stats.newMappings} Mapping{stats.newMappings === 1 ? '' : 's'}
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <Drawer
      title='Review New Competitor Mappings'
      placement='bottom'
      height='75vh'
      open={open}
      onClose={onCancel}
      // Move the close icon to the right via `extra` (antd's default puts it
      // on the left of the title).
      closable={false}
      extra={<Button type='text' icon={<CloseOutlined />} onClick={onCancel} aria-label='Close' />}
      footer={footer}
      styles={{ body: { display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' } }}
    >
      {noMatches ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <Empty
            imageStyle={{ height: 120 }}
            description={
              <div style={{ maxWidth: 480, margin: '0 auto' }}>
                <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--theme-text-primary)', marginBottom: 8 }}>
                  No matching competitors found
                </div>
                <div style={{ fontSize: 14, color: 'var(--theme-text-secondary, #666)', lineHeight: 1.5 }}>
                  Try adjusting the publisher or hierarchy selections and search again.
                </div>
              </div>
            }
          />
        </div>
      ) : (
        <>
          <div style={{ padding: '16px 24px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <StatCards {...stats} />
            {allExist && (
              <Alert
                type='info'
                showIcon
                message='All matched competitors already have existing mappings for the selected quote rows.'
              />
            )}
          </div>
          <div style={{ flex: 1, minHeight: 0, padding: '12px 0 0' }}>
            <GraviGrid
              rowData={rows}
              columnDefs={columnDefs}
              sideBar={false}
              rowGroupPanelShow={'never' as const}
              controlBarProps={{
                title: 'Matching Results',
                showSelectedCount: false,
                hideActiveFilters: true,
              }}
              agPropOverrides={{
                getRowId: (p: { data: FlatRow }) => p.data.RowId,
                groupDisplayType: 'groupRows',
                groupDefaultExpanded: -1,
                suppressAggFuncInHeader: true,
                getRowStyle: (params: { data?: FlatRow }) =>
                  params?.data && !params.data.IsPlaceholder && !params.data.IsCompetitorPriceAssociated
                    ? NEW_ROW_STYLE
                    : undefined,
              }}
            />
          </div>
        </>
      )}
    </Drawer>
  )
}
