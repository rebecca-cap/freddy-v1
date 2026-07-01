import { CopyOutlined, DeleteOutlined, EditOutlined, WarningOutlined } from '@ant-design/icons'
import { HoverPopoverList } from '@components/shared/Grid/cellRenderers/HoverPopoverList'
import { dateFormat } from '@components/TheArmory/helpers'
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import {
  FormulaTemplateApplicableLocation,
  FormulaTemplateApplicableProduct,
  FormulaTemplateDetails,
  FormulaTemplateMetadata,
} from '@modules/FormulaTemplates/Api/types.schema'
import { ViewMode } from '@modules/FormulaTemplates/Util/formConstants'
import { ColDef } from 'ag-grid-community'
import { Popconfirm, Tooltip } from 'antd'
import moment from 'moment'
import { Dispatch, SetStateAction } from 'react'

interface FormulaTemplatesColumnDefsProps {
  setViewMode: Dispatch<SetStateAction<ViewMode>>
  handleDelete: (id: number) => void
  setSelectedTemplate: Dispatch<SetStateAction<Partial<FormulaTemplateDetails> | null>>
  metadata?: FormulaTemplateMetadata
  canWrite?: boolean
}

export function FormulaTemplatesColumnDefs({
  handleDelete,
  setSelectedTemplate,
  setViewMode,
  metadata,
  canWrite,
}: FormulaTemplatesColumnDefsProps): ColDef[] {
  return [
    Name(),
    ContractType(),
    Products(metadata),
    Locations(metadata),
    Formula(),
    LastModified(),
    Actions({ handleDelete, setSelectedTemplate, setViewMode, canWrite }),
  ]
}

function Name(): ColDef {
  return {
    field: 'Name',
    headerName: 'Name',
  }
}

function ContractType(): ColDef {
  return {
    field: 'FormulaTemplateCategoryDisplay',
    headerName: 'Contract Type',
  }
}

function Products(metadata?: FormulaTemplateMetadata): ColDef {
  return {
    field: 'FormulaTemplateApplicableProducts',
    headerName: 'Products',
    autoHeight: true,
    filterValueGetter: ({ data }) => {
      return data.FormulaTemplateApplicableProducts?.map((item) => {
        const productName = metadata?.Products?.find((p) => p.Value === item.ProductId.toString())?.Text
        return productName || item.ProductId.toString()
      }).filter((item): item is string => item !== undefined)
    },
    cellRenderer: ({ value }: { value: FormulaTemplateApplicableProduct[] }) => {
      const productList = value
        .map((item) => {
          const productName = metadata?.Products?.find((p) => p.Value === item.ProductId.toString())?.Text
          return productName || item.ProductId.toString()
        })
        .filter((item): item is string => item !== undefined)
      const productTitle = (
        <GraviButton
          className={'ghost-gravi-button p-0'}
          buttonText={
            <Texto weight={'normal'} style={{ textDecoration: 'underline' }}>
              Multiple Products
            </Texto>
          }
        />
      )
      return <HoverPopoverList list={productList} title={productTitle} />
    },
  }
}

function Locations(metadata?: FormulaTemplateMetadata): ColDef {
  return {
    field: 'FormulaTemplateApplicableLocations',
    headerName: 'Locations',
    autoHeight: true,
    filterValueGetter: ({ data }) => {
      return data.FormulaTemplateApplicableLocations?.map((item) => {
        const locationName = metadata?.Locations?.find((l) => l.Value === item.LocationId.toString())?.Text
        return locationName || item.LocationId.toString()
      }).filter((item): item is string => item !== undefined)
    },
    cellRenderer: ({ value }: { value: FormulaTemplateApplicableLocation[] }) => {
      const locationList = value
        .map((item) => {
          const locationName = metadata?.Locations?.find((l) => l.Value === item.LocationId.toString())?.Text
          return locationName || item.LocationId.toString()
        })
        .filter((item): item is string => item !== undefined)
      const locationTitle = (
        <GraviButton
          className={'ghost-gravi-button p-0'}
          buttonText={
            <Texto weight={'normal'} style={{ textDecoration: 'underline' }}>
              Multiple Locations
            </Texto>
          }
        />
      )
      return <HoverPopoverList list={locationList} title={locationTitle} />
    },
  }
}

function Formula(): ColDef {
  return {
    field: 'Formula',
    headerName: 'Formula',
    cellRenderer: ({ value }) => {
      return (
        <Texto
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontFamily: 'monospace',
          }}
        >
          {value}
        </Texto>
      )
    },
  }
}

function LastModified(): ColDef {
  return {
    field: 'CreatedDateTime',
    headerName: 'Last Modified',
    filter: 'agDateColumnFilter',
    filterParams: { inRangeInclusive: true },
    filterValueGetter: ({ data }) => moment(data.CreatedDateTime).startOf('day').toDate(),
    valueFormatter: ({ value }) => moment(value).format(dateFormat.DATE_SLASH),
  }
}

function Actions({
  setSelectedTemplate,
  handleDelete,
  setViewMode,
  canWrite,
}: {
  setSelectedTemplate: Dispatch<SetStateAction<Partial<FormulaTemplateDetails> | null>>
  handleDelete: (id: number) => void
  setViewMode: Dispatch<SetStateAction<ViewMode>>
  canWrite?: boolean
}): ColDef {
  return {
    filter: false,
    sortable: false,
    maxWidth: 150,
    field: 'Actions',
    headerName: 'Actions',
    cellRenderer: ({ data }: { data: FormulaTemplateDetails }) => {
      if (!canWrite) return ''
      return (
        <Horizontal className={'gap-10'}>
          <Tooltip title={'Edit'}>
            <GraviButton
              className={'ghost-gravi-button'}
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedTemplate(data)
                setViewMode('Edit')
              }}
            />
          </Tooltip>
          <Tooltip title={'Duplicate'}>
            <GraviButton
              className={'ghost-gravi-button'}
              icon={<CopyOutlined />}
              onClick={() => {
                setSelectedTemplate(data)
                setViewMode('Duplicate')
              }}
            />
          </Tooltip>
          <Popconfirm
            icon={<WarningOutlined />}
            placement='topRight'
            title={
              <Vertical style={{ minWidth: '350px' }}>
                <Texto>Are you sure you want to delete formula template:</Texto>
                <Texto> {data.Name}?</Texto>
              </Vertical>
            }
            onConfirm={() => handleDelete(data.FormulaTemplateId)}
            okText='Delete'
            cancelText='Cancel'
          >
            <Tooltip title={'Delete'}>
              <GraviButton className={'ghost-gravi-button'} icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Horizontal>
      )
    },
  }
}
