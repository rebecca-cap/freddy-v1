// Fake LLM service for the Scout prototype.
//
// This module exists so Scout can demo conversational behavior without
// calling a real model. The signature mirrors what a real client would
// expose, so swapping in an actual LLM is a one-file change.
//
// Keep responses obviously canned — do NOT try to make them feel real.
// Reviewers should never mistake fake output for live model output.
//
// Canned content is lifted from the wireframe at:
//   Kit Round 4 - Gizmo Option A/gizmo-demo.html
// (getThinkingSteps + buildAgg/buildRow + getConfidence).

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
// another scenario reuse that scenario's natural question wording. Aggregate
// labels mirror AGGREGATE_CHIPS in ScoutChips.tsx; the scoped labels are
// lifted verbatim from the wireframe's scopedChips() (gizmo-demo.html).
const FOLLOW_UP_LABELS: Record<string, string> = {
  'agg-flagged': 'Why are these rack rows flagged?',
  'agg-top': 'Where am I leaving margin on the rack?',
  'agg-move': "How did today's rack market move?",
  'agg-unpub': 'Why are these rack rows unpublished?',
  'agg-sinclair-opis-rank': 'Where does Sinclair rank vs OPIS Unbranded?',
  'agg-opis-export': 'Export the full 30-day OPIS curve history',
  'agg-selection': 'Summarize the selected rows',
  'agg-terminal-arbs': 'Analyze the terminal arb relationships between the selected quote rows.',
  'arbs-price-target': 'What price difference should I keep Denver at to not lose volume to N Platte?',
  'bench-why': 'Why this cost?',
  'bench-fresh': 'How fresh is the OPIS rack print?',
  'bench-trend': '7-day OPIS rack trend',
  'prop-why': 'Why this proposed post?',
  'prop-whatif': 'What if I lift the post $0.0050/gal?',
  'marg-trend': '30-day margin trend',
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
// AskScoutRequest. Steps come from getThinkingSteps in the wireframe;
// answer bodies come from buildAgg / buildRow / generic free-text fallback.

const AGG_FLAGGED: LlmScenario = {
  promptId: 'agg-flagged',
  steps: [
    step('s1', 'Scanning all 836 rows'),
    step('s2', 'Clustering by condition'),
    step('s3', 'Ranking most actionable'),
    step('s4', 'Composing summary'),
  ],
  answer: answer(
    [
      {
        kind: 'p',
        text: 'These 23 flags fall into 3 Sinclair rack-arb clusters. The danger-zone cluster is the most actionable — those terminals run a Denver-vs-N Platte spread above $0.40/gal and are bleeding share to the cheaper alternative.',
      },
      {
        kind: 'breakdown',
        title: 'Flags by cluster',
        rows: [
          { label: 'Spread > $0.40 danger zone', value: '11' },
          { label: 'Spread $0.25–$0.40 watch zone', value: '8' },
          { label: 'Stale OPIS rack print', value: '4' },
          { label: 'Total flagged', value: '23', total: true },
        ],
      },
    ],
    [
      source('src-quote-index', 'quote book index'),
      source('src-exception-engine', 'exception engine'),
      source('src-terminal-arb-log', 'terminal-arb log'),
    ],
    'Medium',
    'agg',
    fu('agg-top', 'agg-move', 'agg-unpub'),
    {
      confidenceNote: 'Cluster counts are estimated',
      actions: [
        { id: 'open-danger-zone', label: 'Open danger-zone spread rows', kind: 'open' },
        { id: 'open-watch-zone', label: 'Open watch-zone rows', kind: 'open' },
      ],
    },
  ),
}

// Wireframe source: buildAgg() in gizmo-demo.html (lines ~4134–4140).
// Headline copy lifted verbatim; thinking steps follow the same scan→
// cluster→rank→compose shape as agg-flagged because that's the canonical
// "aggregate" path in the wireframe.
const AGG_TOP: LlmScenario = {
  promptId: 'agg-top',
  steps: [
    step('s1', 'Loading 30-day lift history'),
    step('s2', 'Estimating uplift headroom per row'),
    step('s3', 'Ranking by weekly margin gain'),
    step('s4', 'Composing summary'),
  ],
  answer: answer(
    [
      {
        kind: 'p',
        text: 'Top uplift candidates, each from a $0.0050/gal rack lift. Both terminals are posting below the regional OPIS rack band on #2 ULSD — low risk, fast read.',
      },
      {
        kind: 'breakdown',
        title: 'Rack headroom',
        rows: [
          { label: 'NORFOLK #2 ULSD', value: '+$0.0210/gal headroom' },
          { label: 'LINCOLN MAG #2 ULSD', value: '+$0.0150/gal headroom' },
        ],
      },
    ],
    [
      source('src-lift-log', '30-day lift log'),
      source('src-terminal-arb-log', 'terminal-arb log'),
      source('src-margin-engine', 'margin engine'),
    ],
    'Medium',
    'agg',
    fu('agg-flagged', 'agg-move'),
    {
      actions: [
        { id: 'open-uplift', label: 'Open uplift candidates', kind: 'open' },
        { id: 'apply-lift', label: 'Apply $0.0050/gal lift to both rows', kind: 'apply' },
      ],
    },
  ),
}

const AGG_MOVE: LlmScenario = {
  promptId: 'agg-move',
  steps: [
    step('s1', 'Reading OPIS / Argus deltas'),
    step('s2', 'Mapping moves to active quotes'),
    step('s3', 'Summing margin impact'),
    step('s4', 'Composing summary'),
  ],
  answer: answer(
    "OPIS / Argus rack prints moved the Denver and Omaha posts today — net +$24K margin impact across the Sinclair Unbranded book. #2 ULSD carried the move (+$0.0061/gal); gasoline rack was flat. 18 terminal-arb spreads crossed the $0.25 watch threshold and should be reviewed before publish.",
    [
      source('src-benchmark-feed', 'OPIS / Argus rack feed'),
      source('src-quote-index', 'quote book index'),
      source('src-margin-engine', 'margin engine'),
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
    step('s2', 'Grouping by blocker'),
    step('s3', 'Composing summary'),
  ],
  answer: answer(
    "25 of 412 Sinclair terminal posts awaiting review. The rest are auto-publishing on the Sinclair EOD cadence — these 25 hit a margin-guard or spread-band check on a terminal-arb pair that needs a human read. Median wait is 14 minutes; nothing is stale enough to block close.",
    [
      source('src-publish-queue', 'publish queue'),
      source('src-exception-engine', 'exception engine'),
    ],
    'High',
    'agg',
    fu('agg-flagged', 'agg-move'),
    {
      actions: [
        { id: 'open-in-review', label: 'Open 25 rows in review', kind: 'open' },
      ],
    },
  ),
}

// Real-scenario showcase: snapshot from a live sinclair-pe-prod run comparing
// HF Sinclair's posted UB price against the other OPIS Competitor UB postings
// (Marathon, Valero) at LAS VEGAS NV - 910 over the 9-day window ending
// 2026-05-26. First scenario in the demo to use a structured `kind: 'table'`
// answer block — body is paragraph → table → paragraph.
const AGG_SINCLAIR_OPIS_RANK: LlmScenario = {
  promptId: 'agg-sinclair-opis-rank',
  steps: [
    step('s1', 'Looking up OPIS Competitor UB instruments'),
    step('s2', 'Pulling 30 days of curve-point prices'),
    step('s3', 'Joining BOL liftings by location'),
    step('s4', 'Ranking by day and composing table'),
  ],
  answer: answer(
    [
      {
        kind: 'p',
        text: "Sinclair posted the lowest UB price (rank 1 of 3) every day in the window at LAS VEGAS NV - 910 — 3 of 3 against Marathon and Valero. Price band $3.64–$4.06/gal, $0.10–$0.35/gal below the other two.",
      },
      {
        kind: 'table',
        columns: ['Date', 'Day', 'Sinclair rank', 'Liftings', 'Top customer'],
        rows: [
          ['2026-05-26', 'Tue', '1 of 3', '13', 'OFFEN PETROLEUM LLC (5)'],
          ['2026-05-25', 'Mon', '1 of 3', '24', 'OFFEN PETROLEUM LLC (14)'],
          ['2026-05-24', 'Sun', '1 of 3*', '32', 'OFFEN PETROLEUM LLC (13)'],
          ['2026-05-23', 'Sat', '1 of 3', '52', 'OFFEN PETROLEUM LLC (35)'],
          ['2026-05-22', 'Fri', '1 of 3', '51', 'OFFEN PETROLEUM LLC (32)'],
          ['2026-05-21', 'Thu', '1 of 3', '30', 'OFFEN PETROLEUM LLC (13)'],
          ['2026-05-20', 'Wed', '1 of 3', '38', 'OFFEN PETROLEUM LLC (15)'],
          ['2026-05-19', 'Tue', '1 of 3', '31', 'OFFEN PETROLEUM LLC (14)'],
          ['2026-05-18', 'Mon', '1 of 3', '21', 'S & S FUELS LLC (7)'],
        ],
      },
      {
        kind: 'p',
        text: "OPIS Competitor UB set here is narrow — only Marathon, Sinclair, and Valero — so rank ceiling is 3. Sundays inherit Saturday's posting; OPIS doesn't publish on Sundays. Liftings span LocationIds 71/72/73/234/273; nearly all volume sits at LAS VEGAS-HF (73). OFFEN PETROLEUM led 22 of 31 days across the full month.",
      },
    ],
    [
      source(
        'src-price-publishers',
        'price-publishers + price-instruments lookups',
      ),
      source(
        'src-curve-point-prices',
        'curve-point-prices',
        'Sinclair 278484 · Marathon 334732 · Valero 301262',
      ),
      source(
        'src-bol-liftings',
        'bol-liftings',
        'ProductId 126 · LocationIds 71/72/73/234/273',
      ),
      source('src-environment', 'Environment: sinclair-pe-prod'),
    ],
    'High',
    'agg',
    fu('agg-opis-export', 'agg-flagged', 'agg-top'),
    {
      confidenceNote: 'OPIS UB set has only 3 postings — rank ceiling is 3',
    },
  ),
}

// "Very large result" path: the full 30-day OPIS curve-point export is too wide
// and too tall to render inline (every instrument × every curve point × every
// day, joined to liftings), so the answer summarizes the shape in prose and
// hands the data off as a csv-link block instead of a cramped giant table.
// Reachable as a follow-up chip from AGG_SINCLAIR_OPIS_RANK ('agg-opis-export').
const AGG_OPIS_EXPORT: LlmScenario = {
  promptId: 'agg-opis-export',
  steps: [
    step('s1', 'Expanding all OPIS UB curve points'),
    step('s2', 'Joining 30 days of curve-point prices'),
    step('s3', 'Attaching BOL liftings per row'),
    step('s4', 'Assembling export'),
  ],
  answer: answer(
    [
      {
        kind: 'p',
        text: "The full history is too large to show here — it's every OPIS Competitor UB curve point joined to 30 days of prices and matched liftings, well past what reads cleanly inline. Here's the shape, then the full file to open in a spreadsheet.",
      },
      {
        kind: 'breakdown',
        title: 'Export shape',
        rows: [
          { label: 'Instruments', value: '3 (Marathon · Sinclair · Valero)' },
          { label: 'Days covered', value: '30' },
          { label: 'Curve points', value: '14 per instrument' },
          { label: 'Liftings joined', value: '912' },
          { label: 'Total rows', value: '4,820', total: true },
        ],
      },
      {
        kind: 'csv-link',
        label: 'OPIS UB curve history — LAS VEGAS NV 910',
        filename: 'opis-ub-curve-history-las-vegas-910.csv',
        rows: 4820,
        columns: 11,
      },
    ],
    [
      source('src-price-publishers', 'price-publishers + price-instruments lookups'),
      source('src-curve-point-prices', 'curve-point-prices'),
      source('src-bol-liftings', 'bol-liftings', 'ProductId 126 · LocationIds 71/72/73/234/273'),
    ],
    'High',
    'agg',
    fu('agg-sinclair-opis-rank', 'agg-flagged'),
    {
      confidenceNote: 'Result too large to render inline — exported as CSV',
    },
  ),
}

// Aggregate-over-selection: synthesized roll-up across the N rows the user
// multi-selected in the grid. `askAboutSelection` sends promptId
// 'agg-selection' (falls back to GENERIC_FALLBACK if this is ever removed).
// The body reads as one summary computed over the selection — count, flagged
// share, proposed-price spread, top movers, then a recommendation. Counts are
// illustrative of a ~mid-size selection; the surface stamps the real N into the
// user message ("Summarize the N selected rows"), while this canned answer
// speaks to the selection in aggregate. Mode 'agg' so it reads as book-level
// rather than a single row.
const AGG_SELECTION: LlmScenario = {
  promptId: 'agg-selection',
  steps: [
    step('s1', 'Loading the selected rows'),
    step('s2', 'Decomposing each proposed price'),
    step('s3', 'Comparing to OPIS rack band + policy'),
    step('s4', 'Rolling up the spread'),
    step('s5', 'Composing summary'),
  ],
  answer: answer(
    [
      {
        kind: 'p',
        text: 'Across the selected Sinclair rack rows the book is mostly healthy — about a quarter carry a spread-band flag, and the spread on proposed posts is tight. Two terminals are doing most of the work on either tail.',
      },
      {
        kind: 'breakdown',
        title: 'Selection roll-up',
        rows: [
          { label: 'Rows in selection', value: '8' },
          { label: 'Flagged', value: '2 (spread band)' },
          { label: 'Avg proposed', value: '$3.4500/gal' },
          { label: 'Proposed spread', value: '$3.3900–$3.5100/gal' },
          { label: 'Avg margin', value: '$0.0386/gal' },
          { label: 'Net weekly margin', value: '+$1,180/wk', total: true },
        ],
      },
      {
        kind: 'table',
        columns: ['Mover', 'Read', 'Action'],
        rows: [
          ['Under-band terminal', '$0.0150/gal below the OPIS rack band, posting room', 'Lift $0.0050/gal'],
          ['Too-pricey terminal', '$0.0480/gal spread over the cheaper paired terminal — bleeding share', 'Pull in to hold volume'],
        ],
      },
      {
        kind: 'p',
        text: 'Net: clear the 2 spread-band flags before publish, lift the under-band terminal, and let the mid-band rows ride. That captures most of the upside without widening any terminal arb.',
      },
    ],
    [
      source('src-quote-index', 'quote book index'),
      source('src-terminal-arb-log', 'terminal-arb log'),
      source('src-margin-engine', 'margin engine'),
      source('src-exception-engine', 'exception engine'),
    ],
    'Medium',
    'agg',
    fu('agg-flagged', 'agg-top'),
    {
      confidenceNote: 'Roll-up stats are estimated across the selection',
      actions: [
        { id: 'open-flagged-in-selection', label: 'Open 2 flagged rows', kind: 'open' },
        { id: 'apply-lift-under-band', label: 'Apply $0.0050/gal lift to under-band terminal', kind: 'apply' },
        { id: 'export-selection-summary', label: 'Export summary', kind: 'export' },
        { id: 'copy-selection-summary', label: 'Copy summary', kind: 'copy' },
      ],
    },
  ),
}

// --- Hero scenarios: Denver vs N Platte terminal-arb substitution ----------
//
// The two flagship Sinclair Unbranded Rack scenarios. AGG_TERMINAL_ARBS is the
// substitution analysis (does Denver lose ULSD volume to N Platte?), and it
// cross-links to ARBS_PRICE_TARGET (what spread should I hold Denver at?).
// Real HFS counterparties; decimal $/gal; env sinclair-pe-prod; window
// 2026-02-28 → 2026-05-29 (46 dual-active days). #2 ULSD - 0032 (Product 67),
// DENVER mapping 1278 (location 1142) vs N PLATTE mapping 1983 (location 1633).
const AGG_TERMINAL_ARBS: LlmScenario = {
  promptId: 'agg-terminal-arbs',
  steps: [
    step('s1', 'Loading the selected quote rows'),
    step('s2', 'Joining 46 dual-active days of liftings'),
    step('s3', 'Correlating spread vs Denver volume share'),
    step('s4', 'Drilling per-customer switching'),
    step('s5', 'Composing analysis'),
  ],
  answer: answer(
    [
      {
        kind: 'p',
        text: "Yes — a real, moderate price-driven substitution signal between the two rows. Primary metric r(Spread, Denver share) = -0.509 over 46 overlap days: when Denver gets pricier than N Platte, Denver's volume share falls. Spread (DEN-NPL) ranges -$0.24 to +$0.86, median +$0.37, mean +$0.33 — Denver is structurally the pricier row (only 3 of 46 dual days had Denver cheaper). Substitution runs mostly one direction (N Platte is the cheaper alternative).",
      },
      {
        kind: 'table',
        columns: ['Pair', 'r', 'Interpretation'],
        rows: [
          ['Denver vs N Platte vol (raw)', '-0.131', 'Misleading — near zero'],
          ['Spread vs Denver share', '-0.509', 'PRIMARY — moderate negative = substitution'],
          ['Spread vs Denver vol (abs)', '-0.684', 'Strong — Denver vol drops when Denver gets pricey'],
          ['Spread vs N Platte vol (abs)', '+0.185', "Weak — NPL doesn't strongly pick up the slack"],
          ['Denver own-quote vs Denver vol', '-0.415', 'Own-price elasticity present'],
          ['N Platte own-quote vs N Platte vol', '+0.123', 'No clear own-price elasticity at NPL'],
        ],
      },
      {
        kind: 'csv-link',
        label: '90-Day Volume Summary',
        filename: 'sinclair_den_npl_volume_90d.csv',
        rows: 3,
        columns: 4,
      },
      {
        kind: 'table',
        columns: ['Row', 'Total Gallons', 'Combined Share', 'Active Days'],
        rows: [
          ['DENVER (1278)', '4,858,844', '79.0%', '79'],
          ['N PLATTE (1983)', '1,294,099', '21.0%', '48'],
          ['Combined', '6,152,943', '100%', '81 (10 dark)'],
        ],
      },
      {
        kind: 'csv-link',
        label: 'Top 5 Dual Customers — Behavioral Switching',
        filename: 'sinclair_den_npl_top5_dual_cps.csv',
        rows: 5,
        columns: 6,
      },
      {
        kind: 'table',
        columns: ['Counterparty', 'DEN gal', 'NPL gal', 'DEN %', 'r(spread,DEN share)', 'Verdict'],
        rows: [
          ['BRAD HALL & ASSOC (177)', '179,858', '18,800', '90.5%', '-0.905 (n=4)', 'TRUE switcher — cleanest signal'],
          ['MUSKET CORP (761)', '282,609', '195,948', '59.1%', '-0.626 (n=12)', 'Switcher — picks cheaper terminal'],
          ['OFFEN PETROLEUM (800)', '2,063,525', '43,064', '98.0%', '-0.229', 'Not really dual (98% DEN)'],
          ['MAVERIK INC (704)', '307,430', '104,543', '74.6%', '+0.519 / -0.189', 'No switching — operational'],
          ['TARTAN OIL (1056)', '7,719', '411,277', '1.8%', '-0.743 (n=6)', 'Effectively NPL-only'],
        ],
      },
      {
        kind: 'csv-link',
        label: 'Denver vs N Platte daily ULSD',
        filename: 'sinclair_denver_vs_nplatte_ulsd_daily.csv',
        rows: 91,
        columns: 10,
      },
    ],
    [
      source('src-quote-index', 'quote book index'),
      source('src-terminal-arb-log', 'terminal-arb log'),
      source(
        'src-bol-liftings',
        'vQuoteToBillOfLadingDetail',
        'QuoteConfiguration 2 · Mappings 1278/1983 · Product 67',
      ),
      source('src-environment', 'Environment: sinclair-pe-prod'),
    ],
    'High',
    'agg',
    fu('arbs-price-target'),
    {
      confidenceNote: 'Correlations computed over 46 dual-active days',
    },
  ),
}

const ARBS_PRICE_TARGET: LlmScenario = {
  promptId: 'arbs-price-target',
  steps: [
    step('s1', 'Bucketing days by Denver-vs-N Platte spread'),
    step('s2', 'Computing Denver share per bucket'),
    step('s3', 'Fitting the spread → share curve'),
    step('s4', 'Drilling Brad Hall switching threshold'),
    step('s5', 'Composing recommendation'),
  ],
  answer: answer(
    [
      {
        kind: 'p',
        text: 'The practical break point is ~$0.25/gal — keep Denver no more than ~$0.20–$0.25 above N Platte to hold ~90% of the substitutable volume. Above $0.40 the floor falls out and Denver share collapses to ~45%.',
      },
      {
        kind: 'table',
        columns: ['Spread Range', 'n days', 'Mean DEN Share', 'Median DEN Share', 'Read'],
        rows: [
          ['< $0.10 (incl. negative)', '6', '91.9%', '92.5%', 'Denver dominates — no meaningful substitution'],
          ['$0.10 – $0.25', '5', '90.0%', '90.1%', 'Still safe — share intact'],
          ['$0.25 – $0.40', '17', '75.0%', '88.5%', 'Erosion begins — high day-to-day variance'],
          ['$0.40 – $0.55', '17', '44.6%', '48.4%', 'Major substitution — share roughly halved'],
          ['> $0.55', '1', '54.0%', '—', 'Single observation — insufficient signal'],
        ],
      },
      {
        kind: 'p',
        text: 'Linear regression: DenverShare ≈ 90% − 70% × Spread($/gal).',
      },
      {
        kind: 'table',
        columns: ['Target spread', 'Expected Denver share'],
        rows: [
          ['$0.00', '~90%'],
          ['$0.10', '~83%'],
          ['$0.20', '~76%'],
          ['$0.30', '~69%'],
          ['$0.40', '~62% (curve flattens here in reality)'],
          ['$0.50', '~55%'],
        ],
      },
      {
        kind: 'ul',
        items: [
          'Safe zone: spread ≤ $0.20 — historically held 90%+ Denver share, low volatility.',
          'Watch zone: $0.20–$0.35 — Denver still gets most volume but bleeding to N Platte (esp. Brad Hall, Musket); acceptable if incremental margin/gal beats the lost-volume cost.',
          'Danger zone: spread ≥ $0.40 — substitution kicks in hard (17 days at this level → only 44.6% Denver share); only makes sense if you want volume to move to N Platte.',
          'Brad Hall personal break point ~$0.30–$0.35.',
        ],
      },
      {
        kind: 'ul',
        items: [
          'Asymmetric data — only 3 of 46 dual days had Denver cheaper; curve well-anchored only for positive spreads.',
          'Danger-zone average dragged down by a sustained May 2–8 N Platte high-volume burst.',
          'Switching is concentrated in Brad Hall + Musket + some Maverik allocations.',
          'N Platte ran ~21% of combined volume with 35 zero-lift days — may not absorb a large migration.',
        ],
      },
      {
        kind: 'csv-link',
        label: 'Brad Hall — Switching Threshold',
        filename: 'bradhall_switching_threshold.csv',
        rows: 4,
        columns: 6,
      },
      {
        kind: 'table',
        columns: ['Date', 'Spread', 'DEN gal', 'NPL gal', 'DEN %', 'Behavior'],
        rows: [
          ['2026-05-11', '+$0.30', '9,444', '3,752', '71.6%', 'Still buys at Denver'],
          ['2026-05-22', '+$0.31', '2,379', '2,502', '48.7%', 'Splits ~50/50'],
          ['2026-05-01', '+$0.51', '3,098', '7,515', '29.2%', 'Mostly N Platte'],
          ['2026-05-06', '+$0.51', '1,738', '5,031', '25.7%', 'Mostly N Platte'],
        ],
      },
      {
        kind: 'ul',
        items: [
          'env sinclair-pe-prod — QuoteConfiguration 2 (Sinclair Unbranded Rack Prices)',
          'QuoteConfigurationMapping 1278 (Denver) & 1983 (N Platte), Product 67 (#2 ULSD - 0032)',
          '46 dual-active days from vQuoteToBillOfLadingDetail, window 2026-02-28 → 2026-05-29',
          'per-customer drill on top 5 dual CPs',
        ],
      },
      {
        kind: 'p',
        text: 'Bottom line: hold the Denver-vs-N Platte spread at ≤ $0.25/gal to preserve ~90% share; above $0.25 is a deliberate trade of share for margin, and above $0.40 expect to lose ~half the substitutable volume.',
      },
    ],
    [
      source('src-terminal-arb-log', 'terminal-arb log'),
      source(
        'src-bol-liftings',
        'vQuoteToBillOfLadingDetail',
        'QuoteConfiguration 2 · Mappings 1278/1983 · Product 67',
      ),
      source('src-margin-engine', 'margin engine'),
      source('src-environment', 'Environment: sinclair-pe-prod'),
    ],
    'High',
    'agg',
    fu('agg-terminal-arbs'),
    {
      confidenceNote: 'Spread → share curve anchored on positive spreads only',
    },
  ),
}

const SUMMARIZE_30_DAYS: LlmScenario = {
  promptId: 'summarize-30-days',
  steps: [
    step('s1', 'Loading row context'),
    step('s2', 'Cross-referencing recent lifts'),
    step('s3', 'Reading realized margin from lifts'),
    step('s4', 'Composing summary'),
  ],
  answer: answer(
    [
      {
        kind: 'p',
        text: 'Steady 30 days on this terminal rack row — realized margin is within tolerance and no spread-band flags fired in the window.',
      },
      {
        kind: 'breakdown',
        title: 'Last 30 days',
        rows: [
          { label: 'Lifts', value: '14' },
          { label: 'Acceptance rate', value: '64%' },
          { label: 'Realized margin', value: '$0.0188/gal' },
          { label: 'Slippage vs proposed', value: '$0.0017/gal' },
          { label: 'Avg volume', value: '~3,400 gal/day' },
          { label: 'Last lift', value: '9 days ago · $0.0211/gal' },
        ],
      },
    ],
    [
      source('src-quote-row', 'quote book row'),
      source('src-lift-log', '30-day lift log'),
      source('src-history', 'history archive'),
    ],
    'High',
    'row',
    fu('bench-why', 'prop-why', 'marg-trend'),
  ),
}

const COMPARE_THREE_QUOTES: LlmScenario = {
  promptId: 'compare-three-quotes',
  steps: [
    step('s1', 'Loading the three selected rows'),
    step('s2', 'Decomposing each proposed price'),
    step('s3', 'Comparing to OPIS rack band'),
    step('s4', 'Composing comparison'),
  ],
  answer: answer(
    [
      {
        kind: 'p',
        text: 'Three Sinclair terminal posts, same product (#2 ULSD), three different stories — one hold, one pull-in, one watch.',
      },
      {
        kind: 'table',
        columns: ['Quote', 'Read', 'Action'],
        rows: [
          ['Row 1', 'Mid OPIS rack band, healthy margin', 'Hold'],
          ['Row 2', 'Spread too wide vs N Platte — bleeding share', 'Pull in'],
          ['Row 3', 'Low margin, but 3 lifts accepted in a row', 'Watch'],
        ],
      },
    ],
    [
      source('src-formula-lib', 'formula library'),
      source('src-terminal-arb-log', 'terminal-arb log'),
      source('src-policy-engine', 'policy engine'),
      source('src-lift-log', '30-day lift log'),
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
// Row-scoped drill-downs surfaced as follow-up chips after a row answer.
// Question copy is lifted verbatim from the wireframe's scopedChips()
// (gizmo-demo.html:2984–3015); the wireframe never authored real answers for
// these (they fell through to "static demo response"), so the bodies below are
// new — written in the same canned voice as the scenarios above. Prices and
// small margin deltas in decimal $/gal, matching the existing copy.

const BENCH_WHY: LlmScenario = {
  promptId: 'bench-why',
  steps: [
    step('s1', 'Loading row benchmark'),
    step('s2', 'Decomposing landed cost'),
    step('s3', 'Composing answer'),
  ],
  answer: answer(
    [
      {
        kind: 'p',
        text: 'Landed cost is $3.4420/gal — the OPIS rack print for this terminal is the mover, up $0.0120/gal week-over-week. Freight and fees are flat and within their usual band.',
      },
      {
        kind: 'breakdown',
        title: 'Cost build',
        rows: [
          { label: 'OPIS rack', value: '$3.3900/gal' },
          { label: 'Freight', value: '+$0.0480/gal' },
          { label: 'Fees', value: '+$0.0040/gal' },
          { label: 'Landed cost', value: '$3.4420/gal', total: true },
        ],
      },
    ],
    [
      source('src-benchmark-feed', 'OPIS / Argus rack feed'),
      source('src-freight-table', 'freight table'),
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
    "OPIS rack print refreshed 6 minutes ago off the 2:00pm print — well inside the 30-minute staleness window on the Sinclair EOD cadence. Nothing on this terminal row is running on a stale rack cost.",
    [
      source('src-benchmark-feed', 'OPIS / Argus rack feed'),
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
    step('s1', 'Loading 7-day benchmark history'),
    step('s2', 'Computing daily deltas'),
    step('s3', 'Composing summary'),
  ],
  answer: answer(
    [
      {
        kind: 'p',
        text: 'OPIS rack for this terminal is up $0.0310/gal over 7 days, most of it in the last two sessions. The trend is steady rather than spiky — no single print is distorting the average.',
      },
      {
        kind: 'breakdown',
        title: '7-day OPIS rack',
        rows: [
          { label: 'Up days', value: '5' },
          { label: 'Flat days', value: '2' },
          { label: '7-day move', value: '+$0.0310/gal', total: true },
        ],
      },
    ],
    [
      source('src-benchmark-history', 'benchmark history'),
      source('src-benchmark-feed', 'OPIS / Argus rack feed'),
    ],
    'Medium',
    'row',
    fu('bench-why', 'marg-trend'),
  ),
}

const PROP_WHY: LlmScenario = {
  promptId: 'prop-why',
  steps: [
    step('s1', 'Loading proposed price formula'),
    step('s2', 'Decomposing margin build'),
    step('s3', 'Composing answer'),
  ],
  answer: answer(
    [
      {
        kind: 'p',
        text: "Proposed rack post $3.4810/gal. The margin matches this terminal's tier policy and sits $0.0040/gal under the regional OPIS rack band — a little headroom if you want it.",
      },
      {
        kind: 'breakdown',
        title: 'Price build',
        rows: [
          { label: 'Cost', value: '$3.4420/gal' },
          { label: 'Target margin', value: '+$0.0390/gal' },
          { label: 'Proposed', value: '$3.4810/gal', total: true },
        ],
      },
    ],
    [
      source('src-formula-lib', 'formula library'),
      source('src-policy-engine', 'policy engine'),
      source('src-terminal-arb-log', 'terminal-arb log'),
    ],
    'High',
    'row',
    fu('prop-whatif', 'marg-trend'),
  ),
}

const PROP_WHATIF: LlmScenario = {
  promptId: 'prop-whatif',
  steps: [
    step('s1', 'Modeling +$0.0050/gal margin'),
    step('s2', 'Checking spread band + acceptance'),
    step('s3', 'Composing answer'),
  ],
  answer: answer(
    [
      {
        kind: 'p',
        text: 'A $0.0050/gal lift keeps you well under the $0.25/gal Denver–N Platte spread band — on the substitution curve you stay in the safe zone holding ~90% share. Low risk.',
      },
      {
        kind: 'breakdown',
        title: 'Impact of +$0.0050/gal',
        rows: [
          { label: 'New proposed', value: '$3.4860/gal' },
          { label: 'vs OPIS rack band', value: '−$0.0010/gal' },
          { label: 'Weekly margin', value: '+$60/wk' },
        ],
      },
    ],
    [
      source('src-margin-engine', 'margin engine'),
      source('src-terminal-arb-log', 'terminal-arb log'),
      source('src-lift-log', '30-day lift log'),
    ],
    'Medium',
    'row',
    fu('prop-why', 'bench-why'),
  ),
}

const MARG_TREND: LlmScenario = {
  promptId: 'marg-trend',
  steps: [
    step('s1', 'Loading 30-day realized margin'),
    step('s2', 'Comparing to proposed'),
    step('s3', 'Composing summary'),
  ],
  answer: answer(
    [
      {
        kind: 'p',
        text: 'Realized margin on this rack row is tracking proposed within tolerance. The gap is widest right after an OPIS rack move and closes within a day or two as lifts land.',
      },
      {
        kind: 'breakdown',
        title: '30-day margin',
        rows: [
          { label: 'Proposed', value: '$0.0205/gal' },
          { label: 'Realized', value: '$0.0188/gal' },
          { label: 'Slippage', value: '$0.0017/gal', total: true },
        ],
      },
    ],
    [
      source('src-quote-row', 'quote book row'),
      source('src-lift-log', '30-day lift log'),
      source('src-margin-engine', 'margin engine'),
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
  [AGG_TERMINAL_ARBS.promptId]: AGG_TERMINAL_ARBS,
  [ARBS_PRICE_TARGET.promptId]: ARBS_PRICE_TARGET,
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
