import { PlusOutlined, SettingOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import {
  IndexOfferFormulaComponent,
  SpecialOfferMetadataResponseData,
} from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { IndexOfferComponentsColumnDefs } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/Components/ConfigureIndexPrice/Components/IndexOfferComponentsColumnDefs'
import { blankFormulaComponentRow } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/Components/ConfigureIndexPrice/Utils/Constants'
import { FormulaTemplateMetadata } from '@modules/FormulaTemplates/Api/types.schema'
import { FormulaComponentsGrid } from '@modules/FormulaTemplates/Components/CreateEditDrawer/Components/FormulaComponentsGrid'
import { FormulaComponentRow } from '@modules/FormulaTemplates/Util/formConstants'
import { Form, FormInstance } from 'antd'
import { Dispatch, MutableRefObject, SetStateAction, useCallback, useMemo } from 'react'
import { validateFormulaComponents } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/Components/ConfigureIndexPrice/Utils/IndexFormHelpers'

export interface FormulaComponentBuilderProps {
  metadata?: SpecialOfferMetadataResponseData
  formulaComponents: IndexOfferFormulaComponent[]
  setFormulaComponents: Dispatch<SetStateAction<IndexOfferFormulaComponent[]>>
  form: FormInstance
  addTemplate: () => void
  saveAsTemplate: () => void
  idRef: MutableRefObject<number>
}

export function FormulaComponentBuilder({
  metadata,
  formulaComponents,
  setFormulaComponents,
  form,
  addTemplate,
  saveAsTemplate,
  idRef,
}: FormulaComponentBuilderProps) {
  const addRow = () => {
    const newComponents = [...formulaComponents, blankFormulaComponentRow(idRef.current++)]
    setFormulaComponents(newComponents)
    form.setFieldsValue({ FormulaTemplateVariables: newComponents })
  }

  const handleDelete = useCallback(
    (data: IndexOfferFormulaComponent) => {
      const newComponents = formulaComponents.filter((row) => row.IdForGrid !== data.IdForGrid)
      setFormulaComponents(newComponents)
      form.setFieldsValue({ FormulaTemplateVariables: newComponents })
    },
    [formulaComponents, setFormulaComponents, form]
  )

  const columnDefs = useMemo(
    () =>
      IndexOfferComponentsColumnDefs({
        metadata: metadata?.IndexOfferMetaData,
        handleDelete,
      }),
    [metadata?.IndexOfferMetaData, handleDelete]
  )

  const gridMetadata: Partial<FormulaTemplateMetadata> | undefined = useMemo(() => {
    const indexMeta = metadata?.IndexOfferMetaData
    if (!indexMeta) return undefined
    const allPriceTypes = Object.values(indexMeta.PublisherPriceTypes || {}).flat()
    return {
      Publishers: indexMeta.PricePublishers,
      Instruments: indexMeta.PriceInstruments,
      DateRules: indexMeta.TradePriceValuationRules,
      PriceTypes: allPriceTypes,
      PublisherPriceTypes: indexMeta.PublisherPriceTypes,
    }
  }, [metadata?.IndexOfferMetaData])

  return (
    <Vertical gap={0} flex={2}>
      <Horizontal className={'mb-2'} verticalCenter justifyContent={'space-between'} style={{ width: '100%' }}>
        <Texto weight={'bold'} textTransform={'uppercase'}>
          Components
        </Texto>
        <Horizontal gap={10} verticalCenter className={'mt-2'}>
          <GraviButton appearance={'outline'} buttonText={'Add Row'} icon={<PlusOutlined />} onClick={addRow} />
          <GraviButton
            appearance={'outline'}
            buttonText={'Add Template'}
            icon={<PlusOutlined />}
            onClick={addTemplate}
          />
          <GraviButton
            appearance={'outline'}
            buttonText={'Save As Template'}
            icon={<SettingOutlined />}
            onClick={saveAsTemplate}
          />
        </Horizontal>
      </Horizontal>
      <Vertical style={{ width: '100%', height: '350px' }}>
        <FormulaComponentsGrid
          columnDefs={columnDefs}
          setFormulaComponents={setFormulaComponents as React.Dispatch<React.SetStateAction<FormulaComponentRow[]>>}
          formulaComponents={formulaComponents as FormulaComponentRow[]}
          form={form}
          metadata={gridMetadata}
        />
      </Vertical>
      <div style={{ minHeight: '75px', overflowY: 'auto' }}>
        <Form.Item
          name={'FormulaTemplateVariables'}
          rules={[{ validator: validateFormulaComponents(metadata?.IndexOfferMetaData) }]}
          style={{ marginTop: '-25px' }}
        >
          <div />
        </Form.Item>
      </div>
    </Vertical>
  )
}
