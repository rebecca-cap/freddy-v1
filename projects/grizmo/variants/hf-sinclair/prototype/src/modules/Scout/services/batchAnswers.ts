// batchAnswers — synthesize per-row answers for a "run this path across N
// selected rows" batch job.
//
// NO BACKEND. This is the canned brain behind `startBatchRun` /
// `completeBatchRun` / `showBatchAnswerForRow` in state/ScoutContext.tsx. The
// grid/surface agent calls `buildBatchAnswers(rowIds, pathLabel)` once a batch
// run kicks off, then hands the result straight into
// `completeBatchRun(answers)`; `showBatchAnswerForRow(rowId)` later renders the
// matching AnswerBody when the user clicks a row in the batch.
//
// Deterministic by design: content varies by a stable hash of each rowId (and,
// secondarily, by index) so every row reads differently — but the SAME rowId
// always yields the SAME answer. No clock, no Math.random. Re-running a batch
// over the same selection reproduces the same per-row bodies.
//
// Prices are decimal $/gal (never cents), matching fakeLlm.ts voice.

import type { AnswerBody } from '../types'

// Stable, dependency-free string hash (djb2). Used only to pick deterministic
// canned values per rowId — not security-sensitive.
const hashRowId = (rowId: string): number => {
  let h = 5381
  for (let i = 0; i < rowId.length; i += 1) {
    h = (h * 33) ^ rowId.charCodeAt(i)
  }
  return Math.abs(h)
}

// Format a $/gal price to the book's 4-decimal convention.
const gal = (n: number): string => `$${n.toFixed(4)}/gal`
const galSigned = (n: number): string =>
  `${n >= 0 ? '+' : '−'}$${Math.abs(n).toFixed(4)}/gal`

// Three plausible per-row "reads" the path can land on. Which one a row gets is
// decided by its hash, so the batch spreads across all three deterministically.
type RowRead = 'lift' | 'hold' | 'lower'

const readForRow = (rowId: string): RowRead => {
  const reads: RowRead[] = ['lift', 'hold', 'lower']
  return reads[hashRowId(rowId) % reads.length]
}

// Build one row's AnswerBody — a short price-build breakdown plus a one-line
// recommendation, slanted by the row's read. Cost/margin numbers wiggle by the
// row hash so no two rows look copy-pasted.
const buildRowAnswer = (rowId: string, index: number): AnswerBody => {
  const h = hashRowId(rowId)
  const read = readForRow(rowId)

  // Deterministic per-row cost in a realistic ULSD/gas band ($1.88–$2.04).
  const cost = 1.88 + (h % 160) / 1000
  // Target margin $0.0320–$0.0470/gal.
  const margin = 0.032 + (h % 16) / 1000
  const proposed = cost + margin
  // Peer-median offset that motivates the recommendation.
  const vsPeer =
    read === 'lower'
      ? 0.004 + (h % 6) / 1000 // above median → lower
      : read === 'lift'
        ? -(0.003 + (h % 5) / 1000) // under median → headroom to lift
        : (h % 3) / 1000 - 0.001 // ~mid band → hold

  const lifts = 8 + (h % 12)
  const accepted = Math.max(1, Math.round(lifts * (0.5 + (h % 4) / 10)))

  const recommendation =
    read === 'lift'
      ? `Headroom of ${galSigned(Math.abs(vsPeer))} under peer median and ${accepted} of ${lifts} recent lifts accepted — a $0.0050/gal lift reads low-risk.`
      : read === 'lower'
        ? `Sits ${galSigned(vsPeer)} above peer median — the flag is real. Trim toward median before publish.`
        : `Mid-band with healthy margin and a steady accept rate (${accepted}/${lifts}). Hold.`

  return [
    {
      kind: 'breakdown',
      title: `Row ${index + 1} · price build`,
      rows: [
        { label: 'Landed cost', value: gal(cost) },
        { label: 'Target margin', value: galSigned(margin) },
        { label: 'Proposed', value: gal(proposed), total: true },
        { label: 'vs peer median', value: galSigned(vsPeer) },
      ],
    },
    {
      kind: 'p',
      text: recommendation,
    },
  ]
}

/**
 * Build the per-row answer map for a batch run.
 *
 * Given the selected `rowIds` (and the optional human `pathLabel` for flavor —
 * currently unused in the body copy but kept in the signature so the surface
 * agent can pass it through), returns a `Record<rowId, AnswerBody>` with one
 * short, plausible, deterministic answer per row. Feed straight into
 * `completeBatchRun(answers)`.
 */
export function buildBatchAnswers(
  rowIds: string[],
  _pathLabel?: string,
): Record<string, AnswerBody> {
  const out: Record<string, AnswerBody> = {}
  rowIds.forEach((rowId, index) => {
    out[rowId] = buildRowAnswer(rowId, index)
  })
  return out
}
