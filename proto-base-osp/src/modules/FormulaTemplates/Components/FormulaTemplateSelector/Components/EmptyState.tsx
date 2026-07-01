import { Horizontal, Vertical } from '@gravitate-js/excalibrr'

export function EmptyState() {
  return (
    <Vertical>
      <Horizontal className='template-selector-empty-icon'>📋</Horizontal>
      <Horizontal>No templates found</Horizontal>
      <Horizontal>
        No templates match the filters you selected. Try removing some filters or adjusting your selection.
      </Horizontal>
    </Vertical>
  )
}
