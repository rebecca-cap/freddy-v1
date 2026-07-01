import { PlusOutlined, SettingOutlined } from '@ant-design/icons'
import { useUser } from '@contexts/UserContext'
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import React from 'react'

export function FormulaHeader({ index, addFormula, viewTemplateChooser, handleSaveAsTemplate }) {
  const { userPermissions } = useUser()
  const canWriteTemplates = userPermissions?.FormulaTemplates?.Write
  return (
    <Horizontal
      verticalCenter
      className='px-3 py-1 border-bottom'
      style={{ minHeight: 40 }}
    >
      <Vertical flex={4} className='mr-3'>
        <Texto category='heading-small' weight='700' style={{ letterSpacing: '0.5px', color: 'var(--theme-color-1)' }}>
          FORMULA {index + 1}
        </Texto>
      </Vertical>
      <Horizontal gap={10} flex={2} justifyContent='flex-end' className='mr-3' verticalCenter>
        <GraviButton icon={<PlusOutlined className='show-icon' />} buttonText='Add Row' onClick={addFormula} />
        <GraviButton
          icon={<PlusOutlined className='show-icon' />}
          buttonText='Choose Template'
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
