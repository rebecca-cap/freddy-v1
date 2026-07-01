// Fake LLM service for the Scout prototype.
//
// This module exists so Scout can demo conversational behavior without
// calling a real model. The signature mirrors what a real client would
// expose, so swapping in an actual LLM is a one-file change.
//
// Keep responses obviously canned — do NOT try to make them feel real.
// Reviewers should never mistake fake output for live model output.
//
// Growmark variant: scenarios are framed around cost tracking / Inventory
// Replacement Cost rather than customer margin. The domain model is:
//   Output = published Price; Cost = Price − Adjustment; Adjustment = the
//   user-entered diff (the build-up). Benchmark is OPIS Low 6 PM. There are no
//   customers or competitors in this book — counterparty fields stay blank.

import type {
  ActionChip,
  AnswerBody,
  AskScoutRequest,
  ConfidenceLabel,
  FollowUp,
  ScoutAnswer,
  LlmScenario,
  PathScope,
  Source,
  SubjectTag,
  ThinkingStep,
} from '../types'

// Re-export the shared message shape so the module's public entry point
// (../index.ts) keeps working without poking into ../types directly.
export type { ScoutMessage } from '../types'

// --- Timing knobs ---
//
// One place to tune the entire demo's perceived latency. Bumping
// `stepMaxMs` makes Scout "think" longer; dropping `finalDelayMs` makes
// the answer land snappier after the last step finishes.
export const TIMING = {
  stepMinMs: 300,
  stepMaxMs: 800,
  finalDelayMs: 600,
} as const

// --- Helpers ---

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

const randomStepDelay = (): number => {
  const { stepMinMs, stepMaxMs } = TIMING
  return Math.floor(stepMinMs + Math.random() * (stepMaxMs - stepMinMs))
}

const step = (id: string, label: string, delayMs?: number): ThinkingStep => ({
  id,
  label,
  ...(delayMs !== undefined ? { delayMs } : {}),
})

const source = (id: string, label: string, detail?: string): Source => ({
  id,
  label,
  ...(detail ? { detail } : {}),
})

const answer = (
  body: AnswerBody,
  sources: Source[],
  confidence: ConfidenceLabel,
  mode?: PathScope,
  followUps?: FollowUp[],
  extra?: { actions?: ActionChip[]; confidenceNote?: string },
): ScoutAnswer => ({
  body,
  sources,
  confidence,
  ...(mode ? { mode } : {}),
  ...(followUps && followUps.length ? { followUps } : {}),
  ...(extra?.actions && extra.actions.length ? { actions: extra.actions } : {}),
  ...(extra?.confidenceNote ? { confidenceNote: extra.confidenceNote } : {}),
})

// Canonical chip label per promptId, so follow-up chips that cross-link to
// another scenario reuse that scenario's natural question wording. Labels
// mirror CHIP in ScoutChips.tsx (Growmark cost/benchmark/posting wording).
const FOLLOW_UP_LABELS: Record<string, string> = {
  'agg-flagged': 'Why are 14 rows flagged?',
  'agg-top': 'Where can I tighten cost tracking?',
  'agg-move': "How did today's OPIS Low 6 PM move affect cost?",
  'agg-unpub': 'Why are these rows unpublished?',
  'agg-sinclair-opis-rank': 'How does our Cost track OPIS Low 6 PM?',
  'agg-opis-export': 'Export the full OPIS Low 6 PM cost history',
  'agg-selection': 'Summarize the selected rows',
  'bench-why': 'Why this cost?',
  'bench-fresh': 'How fresh is the benchmark?',
  'bench-trend': '7-day OPIS Low 6 PM trend',
  'prop-why': 'Why this published price?',
  'prop-whatif': 'What if I raise the Adjustment $0.0050/gal?',
  'marg-trend': '7-day price vs cost',
}

// Build a follow-up list from target promptIds, pulling each label from the
// canonical map above.
const fu = (...promptIds: string[]): FollowUp[] =>
  promptIds.map((promptId) => ({
    promptId,
    label: FOLLOW_UP_LABELS[promptId] ?? promptId,
  }))

// --- Scenarios ---
//
// Each key maps to a `promptId` the composer / chip can send in
// AskScoutRequest. Steps describe the canned "thinking"; answer bodies hold the
// canned cost-tracking content for the Growmark book.

const AGG_FLAGGED: LlmScenario = {
  promptId: 'agg-flagged',
  steps: [
    step('s1', 'Scanning the unbranded cost book'),
    step('s2', 'Clustering by check'),
    step('s3', 'Ranking most actionable'),
    step('s4', 'Composing summary'),
  ],
  answer: answer(
    [
      {
        kind: 'p',
        text: 'These 14 flags fall into 3 checks. The stale-benchmark cluster is the most actionable — those rows are pricing off an OPIS Low 6 PM print that has not refreshed since the morning Intra Day curve, so Cost is running on an old basis.',
      },
      {
        kind: 'breakdown',
        title: 'Flags by check',
        rows: [
          { label: 'Stale benchmark (OPIS Low 6 PM older than cadence)', value: '6' },
          { label: 'Adjustment outside policy band', value: '5' },
          { label: 'Build-Up vs Output mismatch', value: '3' },
          { label: 'Total flagged', value: '14', total: true },
        ],
      },
    ],
    [
      source('src-quote-index', 'quote book index'),
      source('src-exception-engine', 'exception engine'),
      source('src-benchmark-feed', 'OPIS Low 6 PM feed'),
    ],
    'Medium',
    'agg',
    fu('agg-top', 'agg-move', 'agg-unpub'),
    {
      confidenceNote: 'Cluster counts are estimated',
      actions: [
        { id: 'open-stale-benchmark', label: 'Open 6 stale-benchmark rows', kind: 'open' },
        { id: 'open-out-of-band', label: 'Open 5 out-of-band adjustment rows', kind: 'open' },
      ],
    },
  ),
}

const AGG_TOP: LlmScenario = {
  promptId: 'agg-top',
  steps: [
    step('s1', 'Loading 7-day Adjustment history'),
    step('s2', 'Measuring drift vs build-up'),
    step('s3', 'Ranking by Adjustment drift'),
    step('s4', 'Composing summary'),
  ],
  answer: answer(
    [
      {
        kind: 'p',
        text: 'Tightest cost tracking comes from realigning the two rows where the user-entered Adjustment has drifted away from the build-up. Both sit above their own 7-day average, so the published Price is carrying a wider diff than the cost basis supports.',
      },
      {
        kind: 'breakdown',
        title: 'Adjustment drift by row',
        rows: [
          { label: '189877 @ NORTH LITTLE ROCK', value: '+$0.0150/gal vs avg' },
          { label: '189901 @ LITTLE ROCK', value: '+$0.0080/gal vs avg' },
        ],
      },
    ],
    [
      source('src-curve-point-prices', 'curve-point-prices'),
      source('src-benchmark-feed', 'OPIS Low 6 PM feed'),
      source('src-cost-engine', 'cost engine'),
    ],
    'Medium',
    'agg',
    fu('agg-flagged', 'agg-move'),
    {
      actions: [
        { id: 'open-drift', label: 'Open drift candidates', kind: 'open' },
        { id: 'align-adjustment', label: 'Align Adjustment to 7-day avg on both rows', kind: 'apply' },
      ],
    },
  ),
}

const AGG_MOVE: LlmScenario = {
  promptId: 'agg-move',
  steps: [
    step('s1', 'Reading OPIS Low 6 PM deltas'),
    step('s2', 'Mapping the move to active cost rows'),
    step('s3', 'Summing cost impact'),
    step('s4', 'Composing summary'),
  ],
  answer: answer(
    'OPIS Low 6 PM −$0.0092/gal vs the prior EOD print — replacement cost eased across the unbranded book. #2 ULS CL carried the move; gasoline grades were flat. 7 rows now show Adjustment outside policy band and should be reviewed before publish.',
    [
      source('src-benchmark-feed', 'OPIS Low 6 PM feed'),
      source('src-quote-index', 'quote book index'),
      source('src-cost-engine', 'cost engine'),
    ],
    'Medium',
    'agg',
    fu('agg-unpub', 'agg-top'),
  ),
}

const AGG_UNPUB: LlmScenario = {
  promptId: 'agg-unpub',
  steps: [
    step('s1', 'Reading publish queue'),
    step('s2', 'Grouping by publish gate'),
    step('s3', 'Composing summary'),
  ],
  answer: answer(
    '9 cost rows are held at a publish gate. 6 are awaiting the OPIS Low 6 PM EOD print before Output can refresh; the other 3 have an Adjustment pending review against the policy band. Nothing is stale enough to block close — median wait is 14 minutes.',
    [
      source('src-publish-queue', 'publish queue'),
      source('src-exception-engine', 'exception engine'),
      source('src-benchmark-feed', 'OPIS Low 6 PM feed'),
    ],
    'High',
    'agg',
    fu('agg-flagged', 'agg-move'),
    {
      actions: [
        { id: 'open-in-review', label: 'Open 9 rows at a publish gate', kind: 'open' },
      ],
    },
  ),
}

// Reframed cost-vs-benchmark scenario (promptId preserved). Compares our
// published Cost (the build-up) against the OPIS Low 6 PM benchmark per day at
// 1207 NORTH LITTLE ROCK over the May 22–29 2026 window. Posting-based — there
// are no liftings in the window to volume-weight against.
const AGG_SINCLAIR_OPIS_RANK: LlmScenario = {
  promptId: 'agg-sinclair-opis-rank',
  steps: [
    step('s1', 'Looking up OPIS Low 6 PM instrument'),
    step('s2', 'Pulling EOD curve-point prices'),
    step('s3', 'Differencing Cost vs benchmark by day'),
    step('s4', 'Composing table'),
  ],
  answer: answer(
    [
      {
        kind: 'p',
        text: 'Our published Cost (the build-up) tracks OPIS Low 6 PM closely at 1207 - NORTH LITTLE ROCK, AR - MPL- N. Using EOD prices over May 22–29 2026, Cost runs the user-entered Adjustment below the benchmark basis every day — the gap is just the diff Agustin entered.',
      },
      {
        kind: 'table',
        columns: ['Date', 'Day', 'OPIS Low 6 PM', 'Our Cost', 'Cost vs OPIS'],
        rows: [
          ['2026-05-22', 'Fri', '$3.5989', '$3.5589', '−$0.0400'],
          ['2026-05-23', 'Sat*', '$3.5989', '$3.5589', '−$0.0400'],
          ['2026-05-24', 'Sun*', '$3.5989', '$3.5589', '−$0.0400'],
          ['2026-05-25', 'Mon*', '$3.5989', '$3.5589', '−$0.0400'],
          ['2026-05-26', 'Tue', '$3.5032', '$3.4657', '−$0.0375'],
          ['2026-05-27', 'Wed', '$3.4136', '$3.3886', '−$0.0250'],
          ['2026-05-28', 'Thu', '$3.4398', '$3.4148', '−$0.0250'],
          ['2026-05-29', 'Fri', '$3.4490', '$3.4140', '−$0.0350'],
          ['7-day avg', '—', '$3.4889', '$3.4570', '−$0.0319'],
        ],
      },
      {
        kind: 'p',
        text: "Weekend rows (May 23–25) inherit Friday's EOD print — OPIS Low 6 PM does not publish on weekends. No BillOfLadingDetail liftings posted against this mapping in the window, so this comparison is posting-based, not volume-weighted.",
      },
    ],
    [
      source(
        'src-price-instruments',
        'price-instruments lookup',
        'OPIS Low 6 PM (PriceInstrumentId 1259108)',
      ),
      source(
        'src-curve-point-prices',
        'curve-point-prices',
        'Output 995325 · Adjustment 995329',
      ),
      source('src-environment', 'Environment: growmark-pe-prod'),
    ],
    'High',
    'agg',
    fu('agg-opis-export', 'agg-flagged', 'agg-top'),
    {
      confidenceNote: 'Posting-based — no liftings to volume-weight',
    },
  ),
}

// "Very large result" path: the full OPIS Low 6 PM cost history is too wide to
// render inline (every instrument × every curve point × every day), so the
// answer summarizes the shape in prose and hands the data off as a csv-link
// block. Reachable as a follow-up chip from AGG_SINCLAIR_OPIS_RANK.
const AGG_OPIS_EXPORT: LlmScenario = {
  promptId: 'agg-opis-export',
  steps: [
    step('s1', 'Expanding Output + Adjustment + Build-Up curve points'),
    step('s2', 'Joining the cost history'),
    step('s3', 'Checking for liftings in window'),
    step('s4', 'Assembling export'),
  ],
  answer: answer(
    [
      {
        kind: 'p',
        text: "The full history is wide — every curve point for Output, Adjustment, and Build-Up across the window, with Cost derived per posting. Here's the shape, then the full file to open in a spreadsheet.",
      },
      {
        kind: 'breakdown',
        title: 'Export shape',
        rows: [
          { label: 'Instruments', value: '3 (Output 995325 · Adjustment 995329 · Build-Up 995331)' },
          { label: 'Days covered', value: '8' },
          { label: 'Curve points', value: '2/day (Intra Day + End Of Day)' },
          { label: 'Liftings joined', value: '0 (none in window)', total: true },
        ],
      },
      {
        kind: 'csv-link',
        label: 'OPIS Low 6 PM cost history — 1207 NORTH LITTLE ROCK',
        filename: 'opis-low-6pm-cost-history-1207-nlr.csv',
        rows: 16,
        columns: 6,
      },
    ],
    [
      source(
        'src-price-instruments',
        'price-instruments lookup',
        'OPIS Low 6 PM (PriceInstrumentId 1259108)',
      ),
      source(
        'src-curve-point-prices',
        'curve-point-prices',
        'Output 995325 · Adjustment 995329 · Build-Up 995331 (formula-only)',
      ),
      source('src-environment', 'Environment: growmark-pe-prod'),
    ],
    'High',
    'agg',
    fu('agg-sinclair-opis-rank', 'agg-flagged'),
    {
      confidenceNote: 'No liftings in window — postings only',
    },
  ),
}

// Aggregate-over-selection: synthesized roll-up across the N rows the user
// multi-selected in the grid. `askAboutSelection` sends promptId
// 'agg-selection'. The body reads as one summary computed over the selection —
// count, average Price / Cost / Adjustment, spread, and flagged share — framed
// on Adjustment drift rather than customers. Mode 'agg' so it reads as
// book-level rather than a single row.
const AGG_SELECTION: LlmScenario = {
  promptId: 'agg-selection',
  steps: [
    step('s1', 'Loading the selected cost rows'),
    step('s2', 'Decomposing each into Price / Cost / Adjustment'),
    step('s3', 'Comparing Adjustment to policy band'),
    step('s4', 'Rolling up the spread'),
    step('s5', 'Composing summary'),
  ],
  answer: answer(
    [
      {
        kind: 'p',
        text: 'Across the selected rows the cost book is mostly healthy — Cost tracks OPIS Low 6 PM within the diff, the Price spread is tight, and only two rows carry an Adjustment-out-of-band flag.',
      },
      {
        kind: 'breakdown',
        title: 'Selection roll-up',
        rows: [
          { label: 'Rows in selection', value: '8' },
          { label: 'Avg Price', value: '$3.4889/gal' },
          { label: 'Avg Cost', value: '$3.4570/gal' },
          { label: 'Avg Adjustment', value: '$0.0319/gal' },
          { label: 'Price spread', value: '$3.4136–$3.5989/gal' },
          { label: 'Flagged', value: '2 (Adjustment out of band)', total: true },
        ],
      },
      {
        kind: 'table',
        columns: ['Mover', 'Read', 'Action'],
        rows: [
          ['Widest diff', 'Adjustment $0.0150/gal above its 7-day avg', 'Align to avg'],
          ['Stalest basis', 'Build-Up lagging the latest OPIS Low 6 PM print', 'Refresh basis'],
        ],
      },
      {
        kind: 'p',
        text: 'Net: clear the 2 Adjustment flags before publish, realign the widest-diff row to its 7-day average, and let the in-band rows ride. That keeps published Cost tracking the benchmark.',
      },
    ],
    [
      source('src-quote-index', 'quote book index'),
      source('src-curve-point-prices', 'curve-point-prices'),
      source('src-cost-engine', 'cost engine'),
      source('src-exception-engine', 'exception engine'),
    ],
    'Medium',
    'agg',
    fu('agg-flagged', 'agg-top'),
    {
      confidenceNote: 'Roll-up stats are estimated across the selection',
      actions: [
        { id: 'open-flagged-in-selection', label: 'Open 2 flagged rows', kind: 'open' },
        { id: 'align-widest-diff', label: 'Align widest-diff row to 7-day avg', kind: 'apply' },
        { id: 'export-selection-summary', label: 'Export summary', kind: 'export' },
        { id: 'copy-selection-summary', label: 'Copy summary', kind: 'copy' },
      ],
    },
  ),
}

// HERO scenario: the per-row 7-day price/cost summary for the hero mapping.
// 189877 - #2 ULS CL @ 1207 - NORTH LITTLE ROCK, AR - MPL- N, config Inventory
// Replacement Cost Unbranded (QuoteConfigurationId 29, mapping 163043), window
// May 22–29 2026. Output IS the published Price; Cost is the build-up;
// Adjustment is the user-entered diff.
const SUMMARIZE_30_DAYS: LlmScenario = {
  promptId: 'summarize-30-days',
  steps: [
    step('s1', 'Loading row context (mapping 163043)'),
    step('s2', 'Pulling Output + Adjustment curve points'),
    step('s3', 'Deriving Cost = Price − Adjustment'),
    step('s4', 'Composing summary'),
  ],
  answer: answer(
    [
      {
        kind: 'p',
        text: 'For mapping #163043 (Inventory Replacement Cost Unbranded) — 189877 - #2 ULS CL at 1207 - NORTH LITTLE ROCK, AR - MPL- N — here are the past 7 days (May 22–29, 2026). Output IS the published Price; Cost is the build-up; Adjustment is the user-entered diff.',
      },
      {
        kind: 'table',
        columns: ['Effective Time (UTC)', 'Curve Type', 'Price', 'Adjustment', 'Cost'],
        rows: [
          ['2026-05-22 12:30', 'Intra Day', '$3.6530', '$0.0400', '$3.6130'],
          ['2026-05-22 18:00', 'End Of Day', '$3.5989', '$0.0400', '$3.5589'],
          ['2026-05-26 12:30', 'Intra Day', '$3.5443', '$0.0400', '$3.5043'],
          ['2026-05-26 18:00', 'End Of Day', '$3.5032', '$0.0375', '$3.4657'],
          ['2026-05-27 12:30', 'Intra Day', '$3.4611', '$0.0250', '$3.4361'],
          ['2026-05-27 18:00', 'End Of Day', '$3.4136', '$0.0250', '$3.3886'],
          ['2026-05-28 12:30', 'Intra Day', '$3.4186', '$0.0250', '$3.3936'],
          ['2026-05-28 18:00', 'End Of Day', '$3.4398', '$0.0250', '$3.4148'],
          ['2026-05-29 12:30', 'Intra Day', '$3.4490', '$0.0350', '$3.4140'],
        ],
      },
      {
        kind: 'breakdown',
        title: 'End-Of-Day only (4 rows)',
        rows: [
          { label: 'Price avg', value: '$3.4889/gal' },
          { label: 'Price range', value: '$3.4136 – $3.5989/gal' },
          { label: 'Cost avg', value: '$3.4570/gal' },
          { label: 'Cost range', value: '$3.3886 – $3.5589/gal' },
          { label: 'Adjustment avg', value: '$0.0319/gal' },
          { label: 'Adjustment range', value: '$0.0250 – $0.0400/gal', total: true },
        ],
      },
      {
        kind: 'ul',
        items: [
          'Price comes from the Output publisher (PriceInstrumentId 995325) — the actual published curve points.',
          'Adjustment comes from the Adjustments publisher (995329) — user-entered diff, paired to the most recent value at/before each Output timestamp.',
          "Cost = Price − Adjustment (the build-up). The Build-Up instrument (995331) holds no curve points — it's a formula-only role feeding Output.",
          'No May 23/24/25 postings (weekend); May 21 is outside the 7-day window.',
        ],
      },
      {
        kind: 'p',
        text: "No BillOfLadingDetail liftings posted against this mapping in the window, so a lifted-volume-weighted average isn't computable for this period.",
      },
    ],
    [
      source(
        'src-quote-row',
        'Quote Book → Inventory Replacement Cost Unbranded (QuoteConfigurationId 29)',
        'mapping 163043',
      ),
      source(
        'src-curve-point-prices',
        'CurvePoint / CurvePointPrice',
        'Output 995325 · Adjustment 995329 · Build-Up 995331 (formula-only)',
      ),
      source(
        'src-benchmark-feed',
        'OPIS Low 6 PM (PriceInstrumentId 1259108)',
      ),
      source('src-environment', 'Environment: growmark-pe-prod'),
    ],
    'High',
    'row',
    fu('bench-why', 'prop-why', 'marg-trend'),
    {
      confidenceNote: 'No liftings in window — no volume-weighted avg.',
    },
  ),
}

const COMPARE_THREE_QUOTES: LlmScenario = {
  promptId: 'compare-three-quotes',
  steps: [
    step('s1', 'Loading the three selected cost rows'),
    step('s2', 'Decomposing each into Price / Cost / Adjustment'),
    step('s3', 'Comparing Adjustment to policy band'),
    step('s4', 'Composing comparison'),
  ],
  answer: answer(
    [
      {
        kind: 'p',
        text: 'Three cost rows, same product (#2 ULS CL) across three locations — one hold, one realign, one watch.',
      },
      {
        kind: 'table',
        columns: ['Quote', 'Read', 'Action'],
        rows: [
          ['NORTH LITTLE ROCK', 'Adjustment in policy band, Cost tracks OPIS Low 6 PM', 'Hold'],
          ['LITTLE ROCK', 'Adjustment $0.0050/gal above 7-day avg', 'Align to avg'],
          ['FORT SMITH', 'Build-Up lagging the latest OPIS print', 'Watch'],
        ],
      },
    ],
    [
      source('src-formula-lib', 'formula library'),
      source('src-benchmark-feed', 'OPIS Low 6 PM feed'),
      source('src-policy-engine', 'policy engine'),
      source('src-curve-point-prices', 'curve-point-prices'),
    ],
    'Medium',
    'row',
    fu('prop-why', 'marg-trend', 'bench-trend'),
  ),
}

const GENERIC_FALLBACK: LlmScenario = {
  promptId: '_fallback',
  steps: [
    step('s1', 'Reading current selection'),
    step('s2', 'Searching the prompt book'),
    step('s3', 'Composing answer'),
  ],
  // Dev note: in production, free text would route through the closed prompt
  // book scoped to the current selection (row, cell, or aggregate) and return a
  // structured answer like the canned chips do.
  answer: answer(
    "I can't answer free-text questions yet. Try one of the suggested questions below, or click a grid cell to focus me on a row.",
    [source('src-prompt-book', 'closed prompt book')],
    'Low',
    undefined,
    fu('agg-flagged', 'agg-top'),
  ),
}

// --- Scoped follow-up scenarios -------------------------------------------
//
// Row-scoped drill-downs surfaced as follow-up chips after a row answer. All
// framed on the Growmark cost model: Cost = Price − Adjustment; Output(Price) =
// Build-Up Cost + Adjustment. Prices in decimal $/gal.

const BENCH_WHY: LlmScenario = {
  promptId: 'bench-why',
  steps: [
    step('s1', 'Loading row benchmark basis'),
    step('s2', 'Decomposing the build-up'),
    step('s3', 'Composing answer'),
  ],
  answer: answer(
    [
      {
        kind: 'p',
        text: 'Cost is $3.4140/gal — the build-up. OPIS Low 6 PM is the mover here; the user-entered Adjustment is just subtracted off the published Price to land the cost basis.',
      },
      {
        kind: 'breakdown',
        title: 'Cost build',
        rows: [
          { label: 'OPIS Low 6 PM (benchmark basis)', value: '$3.4490/gal' },
          { label: 'Adjustment (user diff)', value: '−$0.0350/gal' },
          { label: 'Cost (build-up)', value: '$3.4140/gal', total: true },
        ],
      },
    ],
    [
      source('src-benchmark-feed', 'OPIS Low 6 PM feed'),
      source('src-adjustments', 'Adjustments publisher (995329)'),
      source('src-cost-engine', 'cost engine'),
    ],
    'High',
    'row',
    fu('bench-fresh', 'bench-trend'),
  ),
}

const BENCH_FRESH: LlmScenario = {
  promptId: 'bench-fresh',
  steps: [
    step('s1', 'Checking benchmark timestamp'),
    step('s2', 'Comparing to publish cadence'),
    step('s3', 'Composing answer'),
  ],
  answer: answer(
    'OPIS Low 6 PM refreshed off the 6 PM EOD print; the 12:30 Intra Day curve is the latest Output. Inside cadence — nothing on this row is running on a stale basis.',
    [
      source('src-benchmark-feed', 'OPIS Low 6 PM feed'),
      source('src-benchmark-sched', 'benchmark scheduler'),
    ],
    'High',
    'row',
    fu('bench-trend', 'prop-why'),
  ),
}

const BENCH_TREND: LlmScenario = {
  promptId: 'bench-trend',
  steps: [
    step('s1', 'Loading 7-day OPIS Low 6 PM history'),
    step('s2', 'Computing daily deltas'),
    step('s3', 'Composing summary'),
  ],
  answer: answer(
    [
      {
        kind: 'p',
        text: 'OPIS Low 6 PM eased steadily across the window — down most of the way on EOD prints, with one small bounce. No single print is distorting the trend.',
      },
      {
        kind: 'breakdown',
        title: '7-day OPIS Low 6 PM',
        rows: [
          { label: 'Down days', value: '2' },
          { label: 'Up days', value: '1' },
          { label: '7-day move', value: '−$0.1591/gal (Price $3.5989→$3.4398 EOD)', total: true },
        ],
      },
    ],
    [
      source('src-benchmark-history', 'benchmark history'),
      source('src-benchmark-feed', 'OPIS Low 6 PM feed'),
    ],
    'Medium',
    'row',
    fu('bench-why', 'marg-trend'),
  ),
}

const PROP_WHY: LlmScenario = {
  promptId: 'prop-why',
  steps: [
    step('s1', 'Loading published price formula'),
    step('s2', 'Decomposing the build'),
    step('s3', 'Composing answer'),
  ],
  answer: answer(
    [
      {
        kind: 'p',
        text: 'Published Price is $3.4490/gal. Output is the build-up Cost plus the user-entered Adjustment — the Adjustment is what lifts Output above the cost basis.',
      },
      {
        kind: 'breakdown',
        title: 'Price build',
        rows: [
          { label: 'Cost (build-up)', value: '$3.4140/gal' },
          { label: 'Adjustment (user diff)', value: '+$0.0350/gal' },
          { label: 'Published Price (Output 995325)', value: '$3.4490/gal', total: true },
        ],
      },
    ],
    [
      source('src-formula-lib', 'formula library'),
      source('src-adjustments', 'Adjustments publisher (995329)'),
      source('src-benchmark-feed', 'OPIS Low 6 PM feed'),
    ],
    'High',
    'row',
    fu('prop-whatif', 'marg-trend'),
  ),
}

const PROP_WHATIF: LlmScenario = {
  promptId: 'prop-whatif',
  steps: [
    step('s1', 'Modeling +$0.0050/gal Adjustment'),
    step('s2', 'Recomputing Output(Price)'),
    step('s3', 'Composing answer'),
  ],
  answer: answer(
    [
      {
        kind: 'p',
        text: 'Raising the user diff lifts Output(Price) by the same $0.0050/gal — the Cost (build-up) is untouched, since Adjustment only sits between Cost and the published Price.',
      },
      {
        kind: 'breakdown',
        title: 'Impact of +$0.0050/gal Adjustment',
        rows: [
          { label: 'New Adjustment', value: '$0.0400/gal' },
          { label: 'New published Price', value: '$3.4540/gal' },
          { label: 'Cost unchanged', value: '$3.4140/gal' },
        ],
      },
    ],
    [
      source('src-cost-engine', 'cost engine'),
      source('src-adjustments', 'Adjustments publisher (995329)'),
      source('src-curve-point-prices', 'curve-point history'),
    ],
    'Medium',
    'row',
    fu('prop-why', 'bench-why'),
  ),
}

const MARG_TREND: LlmScenario = {
  promptId: 'marg-trend',
  steps: [
    step('s1', 'Loading 7-day Price vs Cost'),
    step('s2', 'Deriving the Adjustment gap'),
    step('s3', 'Composing summary'),
  ],
  answer: answer(
    [
      {
        kind: 'p',
        text: 'The published-vs-cost gap is just the user-entered Adjustment. It narrowed from $0.0400 to $0.0250/gal mid-window, then ticked back up to $0.0350/gal on the latest curve.',
      },
      {
        kind: 'breakdown',
        title: '7-day price vs cost',
        rows: [
          { label: 'Avg Price', value: '$3.4889/gal' },
          { label: 'Avg Cost', value: '$3.4570/gal' },
          { label: 'Avg Adjustment (Price − Cost)', value: '$0.0319/gal', total: true },
        ],
      },
    ],
    [
      source('src-quote-row', 'quote book row'),
      source('src-curve-point-prices', 'curve-point-prices'),
      source('src-cost-engine', 'cost engine'),
    ],
    'High',
    'row',
    fu('bench-trend', 'prop-why'),
  ),
}

export const SCENARIOS: Record<string, LlmScenario> = {
  [AGG_FLAGGED.promptId]: AGG_FLAGGED,
  [AGG_TOP.promptId]: AGG_TOP,
  [AGG_MOVE.promptId]: AGG_MOVE,
  [AGG_UNPUB.promptId]: AGG_UNPUB,
  [AGG_SINCLAIR_OPIS_RANK.promptId]: AGG_SINCLAIR_OPIS_RANK,
  [AGG_OPIS_EXPORT.promptId]: AGG_OPIS_EXPORT,
  [AGG_SELECTION.promptId]: AGG_SELECTION,
  [SUMMARIZE_30_DAYS.promptId]: SUMMARIZE_30_DAYS,
  [COMPARE_THREE_QUOTES.promptId]: COMPARE_THREE_QUOTES,
  [BENCH_WHY.promptId]: BENCH_WHY,
  [BENCH_FRESH.promptId]: BENCH_FRESH,
  [BENCH_TREND.promptId]: BENCH_TREND,
  [PROP_WHY.promptId]: PROP_WHY,
  [PROP_WHATIF.promptId]: PROP_WHATIF,
  [MARG_TREND.promptId]: MARG_TREND,
  [GENERIC_FALLBACK.promptId]: GENERIC_FALLBACK,
}

// --- Flatten (SAV-4) ---
//
// Deterministic, no-randomness "rewrite this multi-step path into one precise
// prompt" helper. In production a model would author a single well-formed
// question that fuses the intent of every step; here we compose the kept step
// labels into a stable prompt string so the demo reads as a real flatten
// without ever varying between runs.
//
// Contract: same input labels always produce the same output. We trim each
// label, strip a trailing '?' so the fused sentence flows, lowercase the first
// letter of continuation clauses, and join with "then" / a final "and".

const stripTrailingQ = (s: string): string => s.replace(/\?+\s*$/, '').trim()

const lowerFirst = (s: string): string =>
  s.length > 0 ? s.charAt(0).toLowerCase() + s.slice(1) : s

/**
 * Fuse a path's step labels into ONE precise prompt. Deterministic — identical
 * input always yields identical output. Returns a single well-formed question.
 *
 * OBJ-4: the flattened result is saved as a `kind: 'prompt'` SavedItem (a single
 * fused prompt), NOT a `path`. It is still a first-class SavedItem with its own
 * name + description and coexists with the step-by-step path form.
 */
export function flattenStepsToPrompt(labels: string[]): string {
  const clean = labels.map(stripTrailingQ).filter((l) => l.length > 0)
  if (clean.length === 0) return ''
  if (clean.length === 1) return `${clean[0]}?`

  const [first, ...rest] = clean
  const tail = rest.map(lowerFirst)
  const last = tail[tail.length - 1]
  const middle = tail.slice(0, -1)

  // "In one pass, <first>, then <a>, then <b>, and <last>." → as a question.
  const parts = [first, ...middle].join(', then ')
  return `In one pass, ${lowerFirst(parts)}, and ${last}?`
}

// --- Subject classification (SAV-1 / OBJ-3 auto-suggest) ---
//
// Stands in for "the model that answered also tags the subject." In production
// the LLM would classify the prompt/path into the subject taxonomy; here we
// keyword-match the step labels + name deterministically so the Save modal can
// pre-select a subject the user can still override. Same input → same guess.
//
// Keyword sets are ordered by specificity; the first set with a hit wins. A
// no-match returns undefined (the field stays empty rather than guessing wrong).
const SUBJECT_KEYWORDS: Array<{ tag: SubjectTag; words: string[] }> = [
  {
    tag: 'terminal-arbs',
    words: ['arb', 'terminal', 'opis', 'rack', 'basis', 'spread', 'freight'],
  },
  {
    tag: 'lower-of-contract',
    words: ['lower of', 'contract', 'cap', 'ceiling', 'floor', 'formula', 'index'],
  },
  {
    tag: 'valuation',
    words: [
      'valuation',
      'value',
      'margin',
      'price',
      'cost',
      'benchmark',
      'peer',
      'rank',
    ],
  },
]

/**
 * Suggest a subject tag for a prompt/path from its step labels (+ optional
 * name). Deterministic keyword match; returns undefined when nothing matches.
 */
export function suggestSubject(
  labels: string[],
  name?: string,
): SubjectTag | undefined {
  const haystack = [...labels, name ?? ''].join(' ').toLowerCase()
  if (!haystack.trim()) return undefined
  for (const { tag, words } of SUBJECT_KEYWORDS) {
    if (words.some((w) => haystack.includes(w))) return tag
  }
  return undefined
}

/**
 * Deterministic one-line description for a flattened path. Mirrors the
 * step-by-step modal's auto-description but states that the steps were fused.
 */
export function flattenDescription(scope: PathScope, stepCount: number): string {
  const where =
    scope === 'agg'
      ? 'across the whole quote book'
      : 'on the row you have selected'
  return `Asks one fused question ${where} (flattened from ${stepCount} steps).`
}

// --- Public API ---

/**
 * Run a canned Scout conversation.
 *
 * Selects a scenario by `req.promptId` (falls back to `GENERIC_FALLBACK`
 * for free-text or unknown prompts), then yields each thinking step
 * through `onStep` with a realistic pause between them. Resolves with
 * the scenario's final answer after one more pause.
 *
 * Never throws and never makes a network call — this is a demo brain.
 */
export async function askScout(
  req: AskScoutRequest,
  onStep?: (step: ThinkingStep) => void,
): Promise<ScoutAnswer> {
  const scenario =
    (req.promptId && SCENARIOS[req.promptId]) || GENERIC_FALLBACK

  for (const s of scenario.steps) {
    const delay = s.delayMs ?? randomStepDelay()
    await wait(delay)
    onStep?.(s)
  }

  await wait(TIMING.finalDelayMs)
  return scenario.answer
}
