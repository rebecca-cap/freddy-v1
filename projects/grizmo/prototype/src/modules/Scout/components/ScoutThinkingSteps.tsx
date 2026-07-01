// ScoutThinkingSteps — the live (streaming) thinking card.
//
// Wireframe source: `.thinking-card` + `.thinking-step` (gizmo-demo.html). Spec
// (response-cards-spec.html §thinking): a header ("Working on it…" + spinner)
// plus a vertical step list that reveals one step at a time — finished steps
// stay (✓), the active step shimmers, pending steps are not shown yet.
//
// This component is now STREAMING-ONLY. Once an answer resolves, the steps are
// preserved into the answer's collapsible Details panel (ScoutDetails), which
// owns the "finished" presentation — so there's no finished/collapse mode here.
//
// IMPORTANT: no timing logic. Step status is computed in ScoutBubble from the
// message's raw `thinking[]` + `thinkingComplete`; this stays a pure view.

import './ScoutThinkingSteps.css'

export type StepStatus = 'pending' | 'active' | 'done'

export interface DisplayStep {
  id: string
  label: string
  status: StepStatus
}

interface ThinkingProps {
  steps: DisplayStep[]
}

export const ScoutThinkingSteps = ({ steps }: ThinkingProps) => {
  const visible = steps.filter((s) => s.status !== 'pending')
  if (visible.length === 0) return null

  return (
    <div className='scout-thinking'>
      <div className='scout-thinking__header'>
        <span className='scout-thinking__spinner' aria-hidden='true' />
        <span>Working on it…</span>
      </div>
      <ul className='scout-thinking__list'>
        {visible.map((s) => (
          <li key={s.id} className={`scout-thinking__step is-${s.status}`}>
            <span className='scout-thinking__icon' aria-hidden='true'>
              {s.status === 'done' ? '✓' : ''}
            </span>
            <span className='scout-thinking__label'>{s.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
