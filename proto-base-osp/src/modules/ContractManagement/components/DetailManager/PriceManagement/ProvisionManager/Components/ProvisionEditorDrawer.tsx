import { GraviButton } from '@gravitate-js/excalibrr'
import { ContractManagementMetadata, Detail, Price } from '@modules/ContractManagement/api/types.schema'
import { ProvisionEditor } from '@modules/ContractManagement/components/DetailManager/PriceManagement/ProvisionManager/Components/ProvisionEditor'
import { PEFormulaTemplateEndpoints } from '@modules/FormulaTemplates/Api/FormulaTemplateEndpoints'
import {
  TemplateSelectorHeaderContext,
  TemplateSelectorMetadata,
} from '@modules/FormulaTemplates/Api/templateSelectorTypes'
import { FormulaTemplateDetails } from '@modules/FormulaTemplates/Api/types.schema'
import { usePriceFormulaTemplate } from '@modules/FormulaTemplates/Api/usePriceFormulaTemplate'
import { FormulaTemplateDrawer } from '@modules/FormulaTemplates/Components/CreateEditDrawer/FormulaTemplateDrawer'
import { FormulaTemplateSelector } from '@modules/FormulaTemplates/Components/FormulaTemplateSelector/FormulaTemplateSelector'
import {
  getTemplateDetails,
  getUpdatedProvision,
} from '@modules/FormulaTemplates/Components/FormulaTemplateSelector/Util/selectorHelpers'
import { Drawer, Form, Space } from 'antd'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'

/** Maps ContractManagementMetadata to TemplateSelectorMetadata for use with FormulaTemplateSelector */
function mapContractMetadataToSelectorMetadata(
  metadata: ContractManagementMetadata | undefined
): TemplateSelectorMetadata | undefined {
  if (!metadata) return undefined

  return {
    ProductList: metadata.ProductList,
    LocationList: metadata.LocationList,
    PriceTypeList: metadata.PriceTypeList,
    PricePublisherList: metadata.PricePublisherList,
    PriceInstrumentList: metadata.PriceInstrumentList,
    TradePriceValuationRuleList: metadata.TradePriceValuationRuleList,
    FormulaTemplates: metadata.FormulaTemplateDdtos,
  }
}

interface ProvisionEditorDrawerProps {
  metadata?: ContractManagementMetadata
  provisionToEdit?: Price
  setProvisionToEdit: Dispatch<SetStateAction<Price | undefined>>
  updateManagedDetail: (updatedPrice: Price) => void
  managedDetail: Detail
}
export const ProvisionEditorDrawer = ({
  metadata,
  provisionToEdit,
  setProvisionToEdit,
  updateManagedDetail,
  managedDetail,
}: ProvisionEditorDrawerProps) => {
  const [provisionForm] = Form.useForm()
  const [isChoosingTemplate, setIsChoosingTemplate] = useState(false)
  const [targetGroupIndex, setTargetGroupIndex] = useState<number | null>(null)
  const [isTemplateDrawerVisible, setIsTemplateDrawerVisible] = useState(false)
  const [templateToCreate, setTemplateToCreate] = useState<Partial<FormulaTemplateDetails> | null>(null)
  const provisionEditorVisible = !!provisionToEdit
  const clearProvisionToEdit = () => setProvisionToEdit(undefined)

  // Adapter: Map ContractManagementMetadata to TemplateSelectorMetadata
  const selectorMetadata = useMemo(() => mapContractMetadataToSelectorMetadata(metadata), [metadata])

  // Header context with effective dates for FormulaTemplateSelector
  const headerContext: TemplateSelectorHeaderContext | undefined = useMemo(() => {
    if (!provisionToEdit?.FromDate || !provisionToEdit?.ToDate) return undefined
    return {
      effectiveFromDate: provisionToEdit.FromDate,
      effectiveToDate: provisionToEdit.ToDate,
    }
  }, [provisionToEdit?.FromDate, provisionToEdit?.ToDate])

  const handleSaveProvision = (values) => {
    if (!provisionToEdit) return

    const names = values.Groups.map((group, groupIndex) =>
      group.map((variable, variableIndex) => {
        variable.VariableName = `var_${variableIndex + 1}_group_${groupIndex + 1}`
        return variable
      })
    )
    const variables = names.reduce((acc, group) => {
      return [...acc, ...group]
    })
    variables?.forEach((variable) => {
      if (variable.PriceTypeCvId) {
        variable.PriceTypeDisplayName = metadata?.PriceTypeList?.find(
          (item) => item.Value == variable.PriceTypeCvId
        )?.Text
      }
      if (variable.PriceValuationRuleId) {
        variable.PriceValuationRuleName = metadata?.TradePriceValuationRuleList?.find(
          (item) => item.Value == variable.PriceValuationRuleId
        )?.Text
      }

      if (!variable.Differential) variable.Differential = 0
      if (variable.PricePublisherId) {
        variable.PricePublisherName = metadata?.PricePublisherList.find(
          (pb) => pb.Value.toString() === variable?.PricePublisherId
        )?.Text
      }
      if (variable.PricePublisherId && variable.PriceInstrumentId) {
        variable.PriceInstrumentName = metadata?.PublisherPriceInstruments[variable.PricePublisherId].find(
          (pb) => pb.Value.toString() === variable?.PriceInstrumentId
        )?.Text
      }
    })

    const copy: Price = { ...provisionToEdit }
    if (copy.Formula) {
      copy.Formula.FormulaVariables = variables
      copy.Formula.Name = values.Name
    }
    updateManagedDetail(copy)
    clearProvisionToEdit()
  }
  const viewTemplateChooser = (groupIndex: number) => {
    const currentFormValues = provisionForm.getFieldsValue()

    if (currentFormValues.Groups && currentFormValues.Groups.length > 0) {
      const variables = currentFormValues.Groups.flatMap((group, gIdx) =>
        group.map((variable, vIdx) => ({
          ...variable,
          VariableName: `var_${vIdx + 1}_group_${gIdx + 1}`,
        }))
      )

      const updatedProvision = { ...provisionToEdit }
      if (updatedProvision.Formula) {
        updatedProvision.Formula = {
          ...updatedProvision.Formula,
          Name: currentFormValues.Name || updatedProvision.Formula.Name,
          FormulaVariables: variables,
        }
      }
      setProvisionToEdit(updatedProvision as Price)
    }

    setTargetGroupIndex(groupIndex)
    setIsChoosingTemplate(true)
  }

  const onTemplateSelect = (selectedTemplate: FormulaTemplateDetails) => {
    if (targetGroupIndex === null) return

    const updatedProvision = getUpdatedProvision(provisionToEdit, selectedTemplate, targetGroupIndex, metadata)
    setProvisionToEdit(updatedProvision as Price)

    // Switch back to ProvisionEditor view
    setTargetGroupIndex(null)
    setIsChoosingTemplate(false)
  }
  const { useMetadataQuery } = usePriceFormulaTemplate()
  const { data: templateMetadata } = useMetadataQuery()
  const handleSaveAsTemplate = (groupIndex: number) => {
    const templateDetails = getTemplateDetails(provisionForm, managedDetail, groupIndex, templateMetadata)

    setTemplateToCreate(templateDetails)
    setIsTemplateDrawerVisible(true)
  }
  return (
    <>
      <Drawer
        className='provision-drawer'
        height='85vh'
        title={'Edit Provision'}
        visible={provisionEditorVisible}
        onClose={clearProvisionToEdit}
        placement='bottom'
        extra={
          !isChoosingTemplate && (
            <Space>
              <GraviButton success buttonText='Save' onClick={provisionForm.submit} />
            </Space>
          )
        }
        bodyStyle={isChoosingTemplate ? { backgroundColor: 'var(--bg-2)', paddingTop: 0 } : {}}
      >
        {isChoosingTemplate ? (
          <FormulaTemplateSelector
            isChoosingTemplate={isChoosingTemplate}
            setIsChoosingTemplate={setIsChoosingTemplate}
            metadata={selectorMetadata}
            manageTemplatesLink='/ContractManagement/FormulaTemplates'
            headerContext={headerContext}
            onTemplateSelect={onTemplateSelect}
          />
        ) : (
          <ProvisionEditor
            form={provisionForm}
            data={provisionToEdit}
            metadata={metadata}
            onSave={handleSaveProvision}
            viewTemplateChooser={viewTemplateChooser}
            handleSaveAsTemplate={handleSaveAsTemplate}
          />
        )}
      </Drawer>
      <FormulaTemplateDrawer
        viewMode='Create'
        isDrawerVisible={isTemplateDrawerVisible}
        setIsDrawerVisible={setIsTemplateDrawerVisible}
        selectedTemplate={templateToCreate}
        setSelectedTemplate={setTemplateToCreate}
        existingTemplates={metadata?.FormulaTemplateDdtos}
        endpoints={PEFormulaTemplateEndpoints}
      />
    </>
  )
}
