import { PlusOutlined, SettingOutlined } from '@ant-design/icons'
import { useUser } from '@contexts/UserContext'
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import React from 'react'

export function FormulaHeader({ index, addFormula, viewTemplateChooser, handleSaveAsTemplate }) {
  const { userPermissions } = useUser()
  const canWriteTemplates = userPermissions?.FormulaTemplates?.Write
  return (
    <Horizontal verticalCenter className='bg-2 px-3 py-1 border-bottom'>
      <Vertical flex={4} className='mr-3'>
        <Texto category='heading-small' appearance='medium'>
          FORMULA {index + 1}
        </Texto>
      </Vertical>
      <Horizontal flex={2} justifyContent='flex-end' className='mr-3 gap-10' verticalCenter>
        <GraviButton icon={<PlusOutlined className='show-icon' />} buttonText='Add Row' onClick={addFormula} />
        <GraviButton
          icon={<PlusOutlined className='show-icon' />}
          buttonText='Add Template'
          onClick={viewTemplateChooser}
          appearance={'outline'}
        />
        {canWriteTemplates && (
          <GraviButton
            appearance={'outline'}
            icon={<SettingOutlined />}
            buttonText='Save As Template'
            onClick={handleSaveAsTemplate}
          />
        )}
      </Horizontal>
    </Horizontal>
  )
}
