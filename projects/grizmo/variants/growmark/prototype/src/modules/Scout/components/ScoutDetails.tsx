// ScoutDetails — collapsible "Show details" panel below the answer body.
//
// Spec (response-cards-spec.html §details): a compact accordion that, when
// opened, lists the reasoning steps Scout took (⚡ Steps) and the sources it
// pulled from (📎 Sources). Starts collapsed. The toggle line carries a quiet
// count summary ("Show details · N steps · M sources"). Renders nothing when
// there is neither a step nor a source.
//
// This replaces the old split where thinking steps rendered at the top of the
// bubble and sources rendered in a separate footer — both now fold in here once
// the answer has resolved. The live (streaming) step view still belongs to
// ScoutThinkingSteps.

import { RightOutlined } from '@ant-design/icons'
import { useState } from 'react'

import type { Source } from '../types'

import './ScoutDetails.css'

export interface DetailStep {
  id: string
  label: string
}

interface DetailsProps {
  steps: DetailStep[]
  sources: Source[]
}

const summarize = (stepCount: number, sourceCount: number): string => {
  const parts: string[] = []
  if (stepCount > 0) parts.push(`${stepCount} step${stepCount === 1 ? '' : 's'}`)
  if (sourceCount > 0) {
    parts.push(`${sourceCount} source${sourceCount === 1 ? '' : 's'}`)
  }
  return parts.join(' · ')
}

export const ScoutDetails = ({ steps, sources }: DetailsProps) => {
  const [open, setOpen] = useState(false)

  const hasSteps = steps.length > 0
  const hasSources = sources.length > 0
  if (!hasSteps && !hasSources) return null

  const summary = summarize(steps.length, sources.length)

  return (
    <div className={`scout-details${open ? ' is-open' : ''}`}>
      <button
        type='button'
        className='scout-details__toggle'
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <RightOutlined className='scout-details__chev' aria-hidden='true' />
        <span className='scout-details__toggle-label'>
          {open ? 'Hide details' : 'Show details'}
        </span>
        <span className='scout-details__count'>· {summary}</span>
      </button>

      {open ? (
        <div className='scout-details__panel'>
          {hasSteps ? (
            <>
              <div className='scout-details__section-label'>Steps</div>
              <ul className='scout-details__steps'>
                {steps.map((s) => (
                  <li key={s.id} className='scout-details__step'>
                    <span className='scout-details__step-ic' aria-hidden='true'>
                      ✓
                    </span>
                    <span>{s.label}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {hasSources ? (
            <>
              <div className='scout-details__section-label'>Sources</div>
              <div className='scout-details__sources'>
                {sources.map((src) => (
                  <span key={src.id} className='scout-details__src-pill'>
                    {src.label}
                  </span>
                ))}
              </div>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
