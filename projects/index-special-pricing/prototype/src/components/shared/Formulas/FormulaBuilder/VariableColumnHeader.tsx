import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'

export function VariableColumnHeader({ showValue }: { showValue?: boolean }) {
  const headerFields = [
    '%',
    'Publisher',
    'Instrument',
    'Type',
    'Diff',
    'Date Rule',
    'Required',
    'Display',
    'UOM / Currency',
    'Actions',
  ]
  if (showValue) {
    headerFields.push('Value')
  }
  const bigger = ['Instrument', 'Publisher']
  return (
    <Horizontal
      verticalCenter
      className='px-3 border-bottom'
      style={{ minHeight: 36, maxHeight: 36, background: 'var(--gray-100)' }}
    >
      {headerFields.map((label, index) => {
        const isActions = label === 'Actions' || label === 'Value'
        return (
          <Vertical
            flex={bigger.includes(label) ? 2 : 1}
            className={index > 0 ? 'mr-3' : ''}
            alignItems={isActions ? 'flex-end' : undefined}
            key={`${label}${index}`}
          >
            <Texto category='label' textTransform='uppercase' weight='600' style={{ fontSize: 10, letterSpacing: '0.6px', color: 'var(--gray-600)' }}>
              {label}
            </Texto>
          </Vertical>
        )
      })}
    </Horizontal>
  )
}
