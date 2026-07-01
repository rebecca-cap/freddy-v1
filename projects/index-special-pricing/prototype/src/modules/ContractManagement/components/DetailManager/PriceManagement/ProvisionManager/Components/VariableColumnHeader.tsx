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
      className='bg-2 p-2 border-bottom border-top'
      style={{ minHeight: '40px', maxHeight: '40px' }}
    >
      {headerFields.map((label, index) => {
        return (
          <Vertical flex={bigger.includes(label) ? 2 : 1} className='border-right mr-3' key={`${label}${index}`}>
            <Texto className='ml-3' category='label' textTransform='uppercase' appearance='hint'>
              {label}
            </Texto>
          </Vertical>
        )
      })}
    </Horizontal>
  )
}
