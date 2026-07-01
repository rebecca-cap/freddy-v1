import { PlusOutlined } from '@ant-design/icons'
import { useUser } from '@contexts/UserContext'
import { GraviButton, GraviGrid } from '@gravitate-js/excalibrr'
import { FormulaTemplateEndpoints } from '@modules/FormulaTemplates/Api/FormulaTemplateEndpoints'
import { FormulaTemplateDetails } from '@modules/FormulaTemplates/Api/types.schema'
import { ViewMode } from '@modules/FormulaTemplates/Util/formConstants'
import { SetStateAction, useMemo } from 'react'

import { usePriceFormulaTemplate } from '../../Api/usePriceFormulaTemplate'
import { FormulaTemplatesColumnDefs } from './ColumnDefs'

export interface FormulaTemplateGridProps {
  isDrawerVisible: boolean
  setIsDrawerVisible: React.Dispatch<SetStateAction<boolean>>
  selectedTemplate: Partial<FormulaTemplateDetails> | null
  setSelectedTemplate: React.Dispatch<SetStateAction<Partial<FormulaTemplateDetails> | null>>
  setViewMode: React.Dispatch<SetStateAction<ViewMode>>
  formulaTemplates?: FormulaTemplateDetails[]
  endpoints: FormulaTemplateEndpoints
}
export function FormulaTemplatesGrid({
  setIsDrawerVisible,
  setSelectedTemplate,
  setViewMode,
  formulaTemplates,
  endpoints,
}: FormulaTemplateGridProps) {
  const { useMetadataQuery, useDeleteFormulaTemplateMutation } = usePriceFormulaTemplate(endpoints)
  const handleDelete = async (id: number) => {
    await useDeleteFormulaTemplateMutation.mutateAsync([id])
  }
  const { userPermissions } = useUser()
  const canWrite = userPermissions?.FormulaTemplates?.Write
  const agPropOverrides = useMemo(() => ({ getRowId: (row) => row.data.FormulaTemplateId }), [])
  const controlBarProps = useMemo(
    () => ({
      title: 'Formula Templates',
      hideActiveFilters: false,
      actionButtons: canWrite && (
        <GraviButton
          buttonText={'Add New Formula Template'}
          icon={<PlusOutlined />}
          theme1
          onClick={() => setIsDrawerVisible(true)}
        />
      ),
    }),
    [canWrite]
  )
  const { data: metadata } = useMetadataQuery()
  const columnDefs = useMemo(
    () => FormulaTemplatesColumnDefs({ handleDelete, setSelectedTemplate, setViewMode, metadata, canWrite }),
    [handleDelete, setSelectedTemplate, setViewMode, metadata, formulaTemplates, canWrite]
  )

  return (
    <GraviGrid
      rowData={formulaTemplates}
      controlBarProps={controlBarProps}
      columnDefs={columnDefs}
      agPropOverrides={agPropOverrides}
      storageKey={'FormulaTemplates'}
    />
  )
}
