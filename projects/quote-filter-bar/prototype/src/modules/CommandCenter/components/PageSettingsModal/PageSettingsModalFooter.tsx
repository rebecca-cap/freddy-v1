import { GraviButton, Horizontal } from '@gravitate-js/excalibrr'

export function PageSettingsModalFooter({ onCancel, onSave }: { onCancel: () => void; onSave: () => void }) {
  return (
    <Horizontal justifyContent='flex-end' className='px-4'>
      <GraviButton buttonText='Cancel' onClick={onCancel} />
      <GraviButton success buttonText='Save' onClick={onSave} />
    </Horizontal>
  )
}
