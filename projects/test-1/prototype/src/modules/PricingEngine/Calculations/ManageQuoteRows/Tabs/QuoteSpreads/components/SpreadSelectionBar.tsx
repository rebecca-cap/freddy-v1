import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import React, { useMemo } from 'react'

interface Props {
  selectedRows: any[]
  onSubmit: () => void
  onCancel: () => void
}

export const SpreadSelectionBar: React.FC<Props> = ({ selectedRows, onSubmit, onCancel }) => {
  const isMultiple = useMemo(() => selectedRows?.length > 1, [selectedRows])
  return (
    <Horizontal
      style={{
        position: 'relative',
        bottom: 0,
        height: 80,
        backgroundColor: 'var(--theme-color-2-dim)',
        width: '100%',
      }}
    >
      <Vertical verticalCenter horizontalCenter className='bg-theme1'>
        <Texto category='h4' appearance='white' className='flex items-center' style={{ gap: '1rem' }}>
          <span style={{ fontWeight: 500 }}>UPDATE</span>
          <span style={{ fontWeight: 600 }}> SPREADS</span>
        </Texto>
      </Vertical>
      <Vertical flex={11} verticalCenter className='px-4'>
        <Horizontal verticalCenter style={{ gap: '1rem' }}>
          <div style={{ flexGrow: 1 }}>
            <Texto category='h5' weight={600}>
              {selectedRows?.length} item{isMultiple ? 's' : null} {isMultiple ? 'are' : 'is'} selected. Once selection
              is finished, you may select the anchor row for the items to become spreads upon.
            </Texto>
          </div>
          <div>
            <Horizontal style={{ gap: '1rem' }}>
              <GraviButton
                size='large'
                className='rounded'
                buttonText='Cancel'
                style={{
                  width: '100%',
                  borderColor: 'var(--theme-success)',
                  borderRadius: 5,
                }}
                onClick={onCancel}
              />
              <GraviButton
                size='large'
                success
                buttonText='Select Anchor Quote Row'
                onClick={onSubmit}
                style={{
                  width: '100%',
                  borderColor: 'var(--theme-success)',
                  borderRadius: 5,
                }}
                htmlType='submit'
              />
            </Horizontal>
          </div>
        </Horizontal>
      </Vertical>
    </Horizontal>
  )
}
