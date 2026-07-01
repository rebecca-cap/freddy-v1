import { InfoCircleOutlined } from '@ant-design/icons'
import { useLocationManagement } from '@api/useLocationManagement'
import { useProductManagement } from '@api/useProductManagement'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { UseQueryResult } from '@tanstack/react-query'
import { Form, Input, Modal, Select } from 'antd'
import { useEffect, useMemo } from 'react'
import { PageSettingsModalFooter } from './PageSettingsModalFooter'
import { PageSettingFilters } from '../../api/types.schema'

interface PageSettingsModalProps {
  isModalOpen: boolean
  onClose: () => void
  pageSettingFilters: PageSettingFilters
  setPageSettingFilters: (filters: PageSettingFilters) => void
}
export type HierarchyItem = {
  Key: number
  Name: string
  Kind: string
  Levels: string[]
}

export function PageSettingsModal({
  isModalOpen,
  onClose,
  pageSettingFilters,
  setPageSettingFilters,
}: PageSettingsModalProps) {
  const [form] = Form.useForm()
  const { useHierarchyListQuery: useLocationHierarchyListQuery } = useLocationManagement()
  const { data: locationHierarchyList } = useLocationHierarchyListQuery() as UseQueryResult<HierarchyItem[]>
  const { useHierarchyListQuery: useProductHierarchyListQuery } = useProductManagement()
  const { data: productHierarchyList } = useProductHierarchyListQuery() as UseQueryResult<HierarchyItem[]>
  function getAntOptionsFromHierarchyList(hierarchyList: HierarchyItem[]) {
    return hierarchyList?.map((item: HierarchyItem) => ({
      label: item.Name,
      value: item.Key,
    }))
  }
  const productHeirarchyList = useMemo(() => {
    return getAntOptionsFromHierarchyList(productHierarchyList ?? [])
  }, [productHierarchyList])

  const locationHeirarchyList = useMemo(() => {
    return getAntOptionsFromHierarchyList(locationHierarchyList ?? [])
  }, [locationHierarchyList])

  const onFinish = (values: any) => {
    setPageSettingFilters({
      LocationHierarchyTypeCvId: values.LocationHierarchy,
      ProductHierarchyTypeCvId: values.ProductHierarchy,
    })
    onClose()
  }

  useEffect(() => {
    form.setFieldsValue({
      LocationHierarchy: pageSettingFilters.LocationHierarchyTypeCvId,
      ProductHierarchy: pageSettingFilters.ProductHierarchyTypeCvId,
    })
  }, [pageSettingFilters, form])

  return (
    <Modal
      title='Command Center Page Settings'
      visible={isModalOpen}
      onCancel={onClose}
      footer={
        <PageSettingsModalFooter
          onCancel={onClose}
          onSave={() => {
            form.submit()
          }}
        />
      }
    >
      <Form form={form} layout='vertical' onFinish={onFinish}>
        <Vertical className='p-4'>
          <Vertical verticalCenter className='mb-4'>
            <Texto category='h6'>Location Hierarchy</Texto>
            <Form.Item name='LocationHierarchy'>
              <Select options={locationHeirarchyList} className='w-full' />
            </Form.Item>
          </Vertical>
          <Vertical verticalCenter className='mb-4'>
            <Texto category='h6'>Product Hierarchy</Texto>
            <Form.Item name='ProductHierarchy'>
              <Select options={productHeirarchyList} className='w-full' />
            </Form.Item>
          </Vertical>
          <Vertical className='p-4 bordered bg-2 mt-4'>
            <Horizontal verticalCenter className='mb-2'>
              <InfoCircleOutlined />
              <Texto category='h6' className='ml-2'>
                Important Note
              </Texto>
            </Horizontal>
            <Texto category='p2'>
              Changing these hierarchies will affect how data is aggregated across all command center widgets. The
              changes will apply immediately after saving, and may require a command center refresh to display updated
              data properly.
            </Texto>
          </Vertical>
        </Vertical>
      </Form>
    </Modal>
  )
}
