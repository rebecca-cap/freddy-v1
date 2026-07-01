import { ExportOutlined, LeftOutlined } from '@ant-design/icons'
import { dateFormat } from '@components/TheArmory/helpers'
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { TemplateSelectorHeaderContext } from '@modules/FormulaTemplates/Api/templateSelectorTypes'
import moment from 'moment'
import { useMemo } from 'react'

interface HeaderProps {
  setIsChoosingTemplate: (isChoosingTemplate: boolean) => void
  manageTemplatesLink?: string
  headerContext?: TemplateSelectorHeaderContext
}

export function Header({ setIsChoosingTemplate, manageTemplatesLink, headerContext }: HeaderProps) {
  const effectiveDates = useMemo(() => {
    if (!headerContext?.effectiveFromDate || !headerContext?.effectiveToDate) {
      return null
    }
    return [moment(headerContext.effectiveFromDate), moment(headerContext.effectiveToDate)]
  }, [headerContext?.effectiveFromDate, headerContext?.effectiveToDate])

  return (
    <>
      {effectiveDates && (
        <Horizontal verticalCenter>
          <Texto category={'p1'}>
            Effective: {effectiveDates[0]?.format(dateFormat.DATE_SLASH)} -{' '}
            {effectiveDates[1]?.format(dateFormat.DATE_SLASH)}
          </Texto>
        </Horizontal>
      )}

      <Horizontal verticalCenter className={'my-4'} style={{ minHeight: 'fit-content' }}>
        <Vertical style={{ minHeight: 'fit-content' }}>
          <Texto category='h3'>Formula Template Selector</Texto>
          <Texto category={'p2'} appearance={'medium'}>
            Select a pre-built formula template to quickly apply common pricing calculations to your formula.
          </Texto>
        </Vertical>
        <Horizontal>
          {manageTemplatesLink && (
            <GraviButton
              icon={<ExportOutlined />}
              buttonText='Manage Formula Templates'
              onClick={() => window.open(manageTemplatesLink, '_blank')}
              className='mr-2 '
              appearance='outline'
            />
          )}
          <GraviButton
            icon={<LeftOutlined />}
            buttonText='Exit Templates'
            onClick={() => {
              setIsChoosingTemplate(false)
            }}
            className='ghost-gravi-button'
          />
        </Horizontal>
      </Horizontal>
    </>
  )
}
