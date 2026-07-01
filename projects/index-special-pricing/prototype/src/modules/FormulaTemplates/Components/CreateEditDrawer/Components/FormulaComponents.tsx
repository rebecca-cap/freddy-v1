import { PlusOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { FormulaTemplateMetadata } from '@modules/FormulaTemplates/Api/types.schema'
import { FormulaComponentsGrid } from '@modules/FormulaTemplates/Components/CreateEditDrawer/Components/FormulaComponentsGrid'
import { PlaceholderExplanationModal } from '@modules/FormulaTemplates/Components/CreateEditDrawer/Components/PlaceholderExplanationModal'
import { blankRow, FormulaComponentRow } from '@modules/FormulaTemplates/Util/formConstants'
import { SectionTitle } from '@modules/FormulaTemplates/Util/formHelpers'
import { Form } from 'antd'
import type { FormInstance } from 'antd'
import { useRef } from 'react'

interface FormulaComponentsProps {
  metadata?: FormulaTemplateMetadata
  formulaComponents: FormulaComponentRow[]
  setFormulaComponents: React.Dispatch<React.SetStateAction<FormulaComponentRow[]>>
  form: FormInstance
}
export function FormulaComponents({ metadata, formulaComponents, setFormulaComponents, form }: FormulaComponentsProps) {
  const idRef = useRef(0)

  const addComponent = () => {
    setFormulaComponents([...formulaComponents, blankRow(idRef.current++)])
    form.setFieldsValue({ FormulaTemplateVariables: formulaComponents })
  }

  return (
    <>
      <Horizontal verticalCenter justifyContent={'space-between'} className='mb-2' style={{ width: '100%' }}>
        <SectionTitle title={'Components'} />
        <GraviButton
          appearance={'outline'}
          buttonText={'Add Component'}
          icon={<PlusOutlined />}
          onClick={addComponent}
        />
      </Horizontal>
      <PlaceholderExplanationModal />

      <Vertical style={{ width: '100%', height: '350px' }} className={'mb-5'}>
        <FormulaComponentsGrid
          metadata={metadata}
          formulaComponents={formulaComponents}
          setFormulaComponents={setFormulaComponents}
          form={form}
        />
        <Form.Item name='FormulaTemplateVariables'>
          <div />
        </Form.Item>
      </Vertical>
    </>
  )
}
