import { Horizontal, Vertical } from '@gravitate-js/excalibrr'
import React, { useState } from 'react'

import { useCompetitorMappingsTyped } from './Api/useCompetitorMappingsTyped'
import type {
  CompetitorMappingQuoteRow,
  CompetitorMatchResultGroup,
  FindMatchingCompetitorsRequest
} from './Api/types.schema'
import { ConfigurePanel } from './Components/ConfigurePanel/ConfigurePanel'
import { CompetitorMappingsGrid } from './Components/Grid/CompetitorMappingsGrid'
import { PreviewModal } from './Components/PreviewModal/PreviewModal'

type CompetitorMappingsTabProps = {
  canWrite: boolean
}

export function CompetitorMappingsTab({ canWrite }: CompetitorMappingsTabProps) {
  const {
    useCompetitorMappingQuoteRows,
    useCompetitorMappingsMetadata,
    useFindMatchingCompetitorsMutation,
    useBulkCreateMappingsMutation
  } = useCompetitorMappingsTyped()

  const { data: quoteRowsResponse, isLoading } = useCompetitorMappingQuoteRows()
  const quoteRows = quoteRowsResponse?.Data ?? undefined
  const { data: metadata } = useCompetitorMappingsMetadata()
  const findMatchingMutation = useFindMatchingCompetitorsMutation()
  const bulkCreateMutation = useBulkCreateMappingsMutation()

  const [selectedRows, setSelectedRows] = useState<CompetitorMappingQuoteRow[]>([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [matchResults, setMatchResults] = useState<CompetitorMatchResultGroup[]>([])
  const [lastMatchRequest, setLastMatchRequest] = useState<FindMatchingCompetitorsRequest | null>(null)
  const [expandedMappingIds, setExpandedMappingIds] = useState<number[]>([])

  const onFindMatching = async (request: FindMatchingCompetitorsRequest) => {
    const response = await findMatchingMutation.mutateAsync(request)
    setMatchResults(response?.Data ?? [])
    setLastMatchRequest(request)
    setPreviewOpen(true)
  }

  const onConfirmCreate = async () => {
    if (!lastMatchRequest) return
    const associations = matchResults.flatMap((group) =>
      (group.Competitors ?? [])
        .filter((c) => !c.IsCompetitorPriceAssociated)
        .map((c) => ({
          QuoteConfigurationMappingId: group.QuoteConfigurationMappingId ?? 0,
          PriceInstrumentId: c.PriceInstrumentId ?? 0,
          QuoteCompetitorCategoryId: c.QuoteCompetitorCategoryId ?? null,
          IsHiddenByDefault: false,
          IsHighlighted: false
        }))
    )

    await bulkCreateMutation.mutateAsync({ Associations: associations })

    // Spec Preview & Confirm Modal: auto-expand affected rows after success.
    setExpandedMappingIds(
      matchResults.map((g) => g.QuoteConfigurationMappingId).filter((id): id is number => id != null)
    )
    setPreviewOpen(false)
    setSelectedRows([])
  }

  return (
    <Vertical>
      <Horizontal fullHeight>
        <Vertical flex="12">
          <CompetitorMappingsGrid
            canWrite={canWrite}
            quoteRows={quoteRows}
            isLoading={isLoading}
            metadata={metadata}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            expandedMappingIds={expandedMappingIds}
          />
        </Vertical>
        <Vertical flex="4">
          <ConfigurePanel
            canWrite={canWrite}
            selectedRows={selectedRows}
            metadata={metadata}
            isFinding={findMatchingMutation.isPending}
            onFindMatching={onFindMatching}
          />
        </Vertical>
      </Horizontal>
      <PreviewModal
        open={previewOpen}
        onCancel={() => setPreviewOpen(false)}
        results={matchResults}
        onConfirm={onConfirmCreate}
        isCreating={bulkCreateMutation.isPending}
      />
    </Vertical>
  )
}
