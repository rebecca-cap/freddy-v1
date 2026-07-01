// answerToPlainText — flatten a Scout AnswerBody into a plain-text string.
//
// Used by surface agents for "Copy answer" action chips and any text export.
// Dependency-free, pure. A string body is returned verbatim; a block array is
// walked block-by-block and joined with blank lines between blocks.

import type { AnswerBody, AnswerBlock } from '../types'

const blockToText = (block: AnswerBlock): string => {
  switch (block.kind) {
    case 'p':
      return block.text
    case 'ul':
      return block.items.map((item) => `- ${item}`).join('\n')
    case 'table': {
      const header = block.columns.join(' | ')
      const rows = block.rows.map((row) => row.join(' | '))
      return [header, ...rows].join('\n')
    }
    case 'breakdown': {
      const lines: string[] = []
      if (block.title) lines.push(block.title)
      for (const row of block.rows) {
        lines.push(
          row.total
            ? `${row.label}: ${row.value} (total)`
            : `${row.label}: ${row.value}`,
        )
      }
      return lines.join('\n')
    }
    case 'csv-link':
      return `[CSV] ${block.label} — ${block.filename} (${block.rows}×${block.columns})`
    default: {
      // Exhaustiveness guard — keeps TS honest if a new block kind is added.
      const _exhaustive: never = block
      void _exhaustive
      return ''
    }
  }
}

export function toPlainText(body: AnswerBody): string {
  if (typeof body === 'string') return body
  return body.map(blockToText).join('\n\n')
}
