import { ExportOutlined, LeftOutlined } from '@ant-design/icons'
import { dateFormat } from '@components/TheArmory/helpers'
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { TemplateSelectorHeaderContext } from '@modules/FormulaTemplates/Api/templateSelectorTypes'
import dayjs from '@utils/dayjs'
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
    return [dayjs(headerContext.effectiveFromDate), dayjs(headerContext.effectiveToDate)]
  }, [headerContext?.effectiveFromDate, headerContext?.effectiveToDate])

  return (
    <Vertical
      style={{
        minHeight: 'fit-content',
        maxHeight: 'fit-content',
        flex: 'none',
        padding: '4px 0',
      }}
    >
      {effectiveDates && (
        <Horizontal verticalCenter>
          <Texto
            style={{
              fontSize: '12px',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              color: 'var(--gray-500)',
            }}
          >
            Effective: {effectiveDates[0]?.format(dateFormat.DATE_SLASH)} -{' '}
            {effectiveDates[1]?.format(dateFormat.DATE_SLASH)}
          </Texto>
        </Horizontal>
      )}

      <Horizontal verticalCenter style={{ minHeight: 'fit-content', marginTop: effectiveDates ? '8px' : '0' }}>
        <Vertical style={{ minHeight: 'fit-content' }}>
          <Texto category='h3' style={{ fontWeight: 700 }}>
            Formula Template Selector
          </Texto>
          <Texto appearance='medium' style={{ fontSize: '13px', marginTop: '4px' }}>
            Select a pre-built formula template to quickly apply common pricing calculations to your formula.
          </Texto>
        </Vertical>
        <Horizontal gap={8}>
          {manageTemplatesLink && (
            <GraviButton
              icon={<ExportOutlined />}
              buttonText='Manage Formula Templates'
              onClick={() => window.open(manageTemplatesLink, '_blank')}
              appearance='outline'
              style={{ textDecoration: 'underline' }}
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
    </Vertical>
  )
}
