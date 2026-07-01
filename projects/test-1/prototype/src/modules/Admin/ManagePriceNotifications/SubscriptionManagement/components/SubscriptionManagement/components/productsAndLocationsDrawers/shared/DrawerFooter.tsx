import { GraviButton, Horizontal, Texto } from '@gravitate-js/excalibrr'
import React from 'react'

export function DrawerFooter({ selections, totalItems, itemName, onClose, onSave }) {
  return (
    <Horizontal justifyContent='space-between' verticalCenter className='p-2'>
      <Texto category='p2' appearance='medium'>
        {`${selections.length} of ${totalItems} ${itemName} selected`}
      </Texto>

      <div>
        <GraviButton onClick={onClose} style={{ marginRight: '8px' }} buttonText='Cancel' />
        <GraviButton onClick={() => onSave(selections)} theme1 buttonText='Save Changes' />
      </div>
    </Horizontal>
  )
}
