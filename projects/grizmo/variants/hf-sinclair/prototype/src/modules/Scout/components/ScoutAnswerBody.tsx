// ScoutAnswerBody — render the main answer text + structured blocks.
//
// Accepts a plain string (single paragraph, the common case) OR an array of
// blocks: { kind: 'p' | 'ul' | 'table' | 'breakdown', ... }. No markdown
// parser — we control the input from `services/fakeLlm.ts` so structured input
// is opt-in.
//
// Wireframe source: gizmo-demo.html — the `.msg-gizmo` answer body uses
// paragraph text, the `.reason` inset card (our `breakdown` block — a compact
// label → value decomposition), and a `table.grid` for multi-column compares.

import { FileExcelOutlined, DownloadOutlined } from '@ant-design/icons'

import { useScout } from '../state/ScoutContext'
import type { AnswerBlock, AnswerBody } from '../types'

import './ScoutAnswerBody.css'

interface BodyProps {
  body: AnswerBody
}

// Deterministic toast ids for the csv-link affordance — an incrementing module
// counter, never clock/random, mirroring ScoutActionChips.
let csvToastCounter = 0
const makeCsvToastId = (): string => {
  csvToastCounter += 1
  return `toast-csv-${csvToastCounter}`
}

// csv-link — a result too large to render inline reads as "take this to a
// spreadsheet". A click-to-download chip showing filename + a rows×columns
// metric, NOT a cramped giant table. The download is a prototype stub (toast).
const CsvLinkBlock = ({
  block,
}: {
  block: Extract<AnswerBlock, { kind: 'csv-link' }>
}) => {
  const { actions } = useScout()
  const handleDownload = () =>
    actions.addToast({
      id: makeCsvToastId(),
      kind: 'success',
      text: `Downloaded ${block.filename}`,
    })
  return (
    <button
      type='button'
      className='scout-body__csv'
      onClick={handleDownload}
    >
      <span className='scout-body__csv-icon'>
        <FileExcelOutlined />
      </span>
      <span className='scout-body__csv-text'>
        <span className='scout-body__csv-label'>{block.label}</span>
        <span className='scout-body__csv-meta'>
          {block.filename} · {block.rows.toLocaleString()} rows ×{' '}
          {block.columns.toLocaleString()} columns
        </span>
      </span>
      <span className='scout-body__csv-action'>
        <DownloadOutlined />
      </span>
    </button>
  )
}

const renderBlock = (block: AnswerBlock, idx: number) => {
  if (block.kind === 'p') {
    return (
      <p key={idx} className='scout-body__p'>
        {block.text}
      </p>
    )
  }
  if (block.kind === 'ul') {
    return (
      <ul key={idx} className='scout-body__ul'>
        {block.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    )
  }
  if (block.kind === 'breakdown') {
    // Wireframe `.reason` card: a compact label → value decomposition.
    return (
      <div key={idx} className='scout-body__breakdown'>
        {block.title ? (
          <div className='scout-body__breakdown-title'>{block.title}</div>
        ) : null}
        {block.rows.map((row, i) => (
          <div
            key={i}
            className={`scout-body__breakdown-row${
              row.total ? ' is-total' : ''
            }`}
          >
            <span className='scout-body__breakdown-label'>{row.label}</span>
            <span className='scout-body__breakdown-value'>{row.value}</span>
          </div>
        ))}
      </div>
    )
  }
  if (block.kind === 'csv-link') {
    return <CsvLinkBlock key={idx} block={block} />
  }
  // table
  return (
    <table key={idx} className='scout-body__table'>
      <thead>
        <tr>
          {block.columns.map((c, i) => (
            <th key={i}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {block.rows.map((row, ri) => (
          <tr key={ri}>
            {row.map((cell, ci) => (
              <td key={ci}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export const ScoutAnswerBody = ({ body }: BodyProps) => {
  if (typeof body === 'string') {
    if (body.length === 0) return null
    return <p className='scout-body__p'>{body}</p>
  }
  if (body.length === 0) return null
  return <div className='scout-body'>{body.map(renderBlock)}</div>
}
