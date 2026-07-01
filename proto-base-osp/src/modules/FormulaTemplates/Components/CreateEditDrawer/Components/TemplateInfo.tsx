import { Horizontal, Vertical } from '@gravitate-js/excalibrr'
import {
  FormulaTemplateDetails,
  FormulaTemplateMetadata,
} from '@modules/FormulaTemplates/Api/usePriceFormulaTemplate'
import { ViewMode } from '@modules/FormulaTemplates/Util/formConstants'
import { SectionTitle } from '@modules/FormulaTemplates/Util/formHelpers'
import { toAntOption } from '@utils/index'
import { Form, Input, Select } from 'antd'

interface TemplateInfoProps {
  metadata?: FormulaTemplateMetadata
  existingTemplates?: FormulaTemplateDetails[]
  viewMode?: ViewMode
  selectedTemplate: Partial<FormulaTemplateDetails> | null
}

export function TemplateInfo({
  metadata,
  existingTemplates = [],
  viewMode = 'Create',
  selectedTemplate,
}: TemplateInfoProps) {
  const validateUniqueTemplateName = (_: unknown, value: string) => {
    if (!value) return Promise.reject(new Error('Template name is required'))

    const isDuplicate = existingTemplates.some(
      (template) =>
        template.Name.toLowerCase().trim() === value.toLowerCase().trim() &&
        (viewMode !== 'Edit' || template.FormulaTemplateId !== selectedTemplate?.FormulaTemplateId)
    )

    if (isDuplicate) {
      return Promise.reject(new Error('A template with this name already exists'))
    }
    return Promise.resolve()
  }

  return (
    <>
      <SectionTitle title={'Template Information'} />

      <Horizontal gap={20} className='mb-5' style={{ width: '100%' }}>
        <Vertical flex={1}>
          <Form.Item label={'Template Name'} name={'Name'} rules={[{ validator: validateUniqueTemplateName }]}>
            <Input />
          </Form.Item>
        </Vertical>
        <Vertical flex={1}>
          <Form.Item label={'Product'} name={'FormulaTemplateApplicableProducts'}>
            <Select
              allowClear
              options={metadata?.Products.map(toAntOption)}
              mode={'multiple'}
              showArrow
              showSearch
              filterOption={(input: string, option?: { label: string; value: string }) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </Vertical>
        <Vertical flex={1}>
          <Form.Item label={'Location'} name={'FormulaTemplateApplicableLocations'}>
            <Select
              allowClear
              options={metadata?.Locations.map(toAntOption)}
              mode={'multiple'}
              showArrow
              showSearch
              filterOption={(input: string, option?: { label: string; value: string }) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </Vertical>{' '}
        <Vertical flex={1}>
          <Form.Item label={'Category'} name={'FormulaTemplateCategoryId'}>
            <Select
              allowClear
              options={metadata?.FormulaTemplateCategories.map(toAntOption)}
              showArrow
              showSearch
              filterOption={(input: string, option?: { label: string; value: string }) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </Vertical>
      </Horizontal>
    </>
  )
}
