import { PlusOutlined, SettingOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import {
  IndexOfferFormulaComponent,
  IndexOfferMetaData,
  SpecialOfferMetadataResponseData,
} from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { IndexOfferComponentsColumnDefs } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/Components/ConfigureIndexPrice/Components/IndexOfferComponentsColumnDefs'
import { blankFormulaComponentRow } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/Components/ConfigureIndexPrice/Utils/Constants'
import { FormulaTemplateMetadata } from '@modules/FormulaTemplates/Api/types.schema'
import { FormulaComponentsGrid } from '@modules/FormulaTemplates/Components/CreateEditDrawer/Components/FormulaComponentsGrid'
import { FormulaComponentRow } from '@modules/FormulaTemplates/Util/formConstants'
import { isDefinedAndNotNull } from '@utils/index'
import { Form, FormInstance } from 'antd'
import { Dispatch, MutableRefObject, SetStateAction, useCallback, useMemo } from 'react'

export interface FormulaComponentBuilderProps {
  metadata?: SpecialOfferMetadataResponseData
  formulaComponents: IndexOfferFormulaComponent[]
  setFormulaComponents: Dispatch<SetStateAction<IndexOfferFormulaComponent[]>>
  form: FormInstance
  addTemplate: () => void
  saveAsTemplate: () => void
  idRef: MutableRefObject<number>
}

const validateFormulaComponents =
  (metadata?: IndexOfferMetaData) => (_: unknown, value: IndexOfferFormulaComponent[]) => {
    if (!value || value.length === 0) {
      return Promise.reject('At least 1 component is required')
    }

    const fieldDisplayNames: Record<string, string> = {
      Percentage: 'Percentage',
      PricePublisherId: 'Publisher',
      PriceInstrumentId: 'Instrument',
      PriceValuationRuleId: 'Date Rule',
      PriceTypeCvId: 'Type',
    }

    const rowErrors: Map<number, string[]> = new Map()

    for (let i = 0; i < value.length; i++) {
      const component = value[i]
      const errors: string[] = []

      // Check for missing required fields
      for (const [field, displayName] of Object.entries(fieldDisplayNames)) {
        if (!isDefinedAndNotNull(component[field as keyof IndexOfferFormulaComponent])) {
          errors.push(displayName)
        }
      }

      // Check for invalid values (present but not valid for publisher)
      const publisherId = component.PricePublisherId
      if (isDefinedAndNotNull(publisherId)) {
        // Validate Instrument
        if (isDefinedAndNotNull(component.PriceInstrumentId)) {
          const validInstruments =
            metadata?.PriceInstruments?.filter((i) => i.GroupingValue === publisherId?.toString()) || []
          const isValidInstrument = validInstruments.some((i) => i.Value === component.PriceInstrumentId?.toString())
          if (!isValidInstrument) {
            errors.push('Invalid instrument')
          }
        }

        // Validate Type
        if (isDefinedAndNotNull(component.PriceTypeCvId)) {
          const validTypes = metadata?.PublisherPriceTypes?.[publisherId] || []
          const isValidType = validTypes.some((t) => t.Value === component.PriceTypeCvId?.toString())
          if (!isValidType) {
            errors.push('Invalid type')
          }
        }
      }

      if (errors.length > 0) {
        rowErrors.set(i + 1, errors)
      }
    }

    if (rowErrors.size > 0) {
      return Promise.reject(
        <ul>
          {Array.from(rowErrors.entries()).map(([rowNum, fields]) => (
            <li key={rowNum}>
              Row {rowNum}: {fields.join(', ')}
            </li>
          ))}
        </ul>
      )
    }

    return Promise.resolve()
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
    <Vertical flex={2} className={'gap-0'}>
      <Horizontal className={'mb-2'} verticalCenter justifyContent={'space-between'} style={{ width: '100%' }}>
        <Texto weight={'bold'} textTransform={'uppercase'}>
          Components
        </Texto>
        <Horizontal verticalCenter className={'gap-10 mt-2'}>
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
