import { PercentageOutlined } from '@ant-design/icons'
import { useContractManagementContext } from '@contexts/ContractManagement'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { ContractManagementMetadata, Detail } from '@modules/ContractManagement/api/types.schema'
import { useContracts } from '@modules/ContractManagement/api/useContracts'
import { Form, InputNumber } from 'antd'
import { FormInstance } from 'antd/lib/form/Form'
import React, { useEffect, useMemo, useState } from 'react'

import { EditableQuantity } from './EditableQuantity'
import { MonthlyVolumeDrawer } from './MonthlyVolumeDrawer'
import { UOMInput } from './UOMInput'
import { useMonthGenerator } from './useMonthGenerator'
import { VolumeBasisInput } from './VolumeBasisInput'

interface QuantityManagerProps {
  managedDetail: Detail | null
  setManagedDetail: React.Dispatch<React.SetStateAction<Detail>>
  metadata: ContractManagementMetadata
  setHasDetailEdits: React.Dispatch<React.SetStateAction<boolean>>
  form: FormInstance
  showQuantity: boolean
}
export function QuantityManager({
  managedDetail,
  setManagedDetail,
  metadata,
  setHasDetailEdits,
  form,
  showQuantity,
}: QuantityManagerProps) {
  const { canWrite, header, activeTabId, disableFields, contract } = useContractManagementContext()
  const { useContractDetailNetGrossDefault } = useContracts()

  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const monthlyGenerator = useMonthGenerator({ managedDetail, setManagedDetail })
  const { data: defaultNetGrossValues, isFetching: isNetGrossDefaultsFetching } = useContractDetailNetGrossDefault(
    managedDetail?.FromLocationId,
    managedDetail?.ProductId,
    header?.ExternalCounterPartyId,
    header?.TradeEntryTypeCvId,
    activeTabId
  )
  const isDisabled = useMemo(() => {
    return (disableFields && (managedDetail?.TradeEntryDetailId || 0) > 0) || !canWrite
  }, [contract, disableFields, managedDetail, canWrite])

  useEffect(() => {
    if (!managedDetail?.NetOrGrossCvId) {
      form.setFieldsValue({ NetOrGrossCvId: defaultNetGrossValues?.NetOrGrossCvId?.toString() })
    }
  }, [defaultNetGrossValues])

  if (showQuantity) {
    return (
      <Horizontal className='px-4 py-2 bg-3 bordered items-center'>
        <Vertical>
          <Horizontal>
            <Texto category='h4' className=''>
              Quantity Details:
            </Texto>
          </Horizontal>
          <Horizontal className='items-center py-3' style={{ gap: '1rem' }}>
            <EditableQuantity
              quantity={monthlyGenerator.quantity}
              setQuantity={monthlyGenerator.setQuantity}
              setHasDetailEdits={setHasDetailEdits}
              setIsDrawerVisible={setIsDrawerVisible}
              setManagedDetail={setManagedDetail}
              canWrite={canWrite}
            />
            <div>
              <Texto appearance='primary' category='label'>
                Min Allocation
              </Texto>
              <Form.Item name='MinimumAllocation'>
                <InputNumber
                  onChange={(value) => {
                    setHasDetailEdits(true)
                    setManagedDetail({ ...managedDetail, MinimumAllocation: value })
                  }}
                  size='large'
                  addonAfter={<PercentageOutlined />}
                  min={0}
                  max={200}
                  defaultValue={managedDetail?.MinimumAllocation || 90}
                  step={10}
                  style={{ maxWidth: '125px' }}
                  disabled={!canWrite}
                />
              </Form.Item>
            </div>
            <div>
              <Texto appearance='primary' category='label'>
                Max Allocation
              </Texto>
              <Form.Item name='MaximumAllocation'>
                <InputNumber
                  onChange={(value) => {
                    setManagedDetail({ ...managedDetail, MaximumAllocation: value })
                  }}
                  size='large'
                  addonAfter={<PercentageOutlined />}
                  min={0}
                  max={200}
                  defaultValue={managedDetail?.MaximumAllocation || 110}
                  step={10}
                  style={{ maxWidth: '125px' }}
                  disabled={!canWrite}
                />
              </Form.Item>
            </div>
            <UOMInput setManagedDetail={setManagedDetail} metadata={metadata} canWrite={canWrite} />
            <VolumeBasisInput
              managedDetail={managedDetail}
              setManagedDetail={setManagedDetail}
              metadata={metadata}
              canWrite={canWrite}
              defaultNetGrossValue={defaultNetGrossValues}
              isNetGrossDefaultsFetching={isNetGrossDefaultsFetching}
              isDisabled={isDisabled}
            />
            <div className='border-left pl-3'>
              <Texto appearance='medium' category='p2' align='right'>
                Total Detail Quantity
              </Texto>
              <Texto appearance='secondary' category='h2'>
                {monthlyGenerator.totalDetailQuantity ? fmt.decimal(monthlyGenerator.totalDetailQuantity, 0) : 0}
              </Texto>
            </div>
            <MonthlyVolumeDrawer
              totalDetailQuantity={monthlyGenerator.totalDetailQuantity}
              onClose={() => setIsDrawerVisible(false)}
              visible={isDrawerVisible}
              managedDetail={managedDetail}
              monthlyRows={monthlyGenerator.monthlyRows}
              setMonthlyRows={monthlyGenerator.setMonthlyRows}
              canWrite={canWrite}
              quantity={monthlyGenerator.quantity}
            />
          </Horizontal>
        </Vertical>
      </Horizontal>
    )
  }
  return (
    <Horizontal className='px-4 py-2 bg-3'>
      <UOMInput setManagedDetail={setManagedDetail} metadata={metadata} canWrite={canWrite} />
      <VolumeBasisInput
        managedDetail={managedDetail}
        setManagedDetail={setManagedDetail}
        metadata={metadata}
        canWrite={canWrite}
        defaultNetGrossValue={defaultNetGrossValues}
        isNetGrossDefaultsFetching={isNetGrossDefaultsFetching}
        isDisabled={isDisabled}
      />
    </Horizontal>
  )
}
