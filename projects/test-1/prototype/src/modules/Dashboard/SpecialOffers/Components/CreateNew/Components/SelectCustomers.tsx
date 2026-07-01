import { Texto, Vertical } from '@gravitate-js/excalibrr'
import { SpecialOfferMetadataResponseData } from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { CustomerSelectColumnDefs } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/Components/SelectionGrid/Columns/CustomerSelectColumnDefs'
import { SelectionGrid } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/Components/SelectionGrid/SelectionGrid'
import { GridApi } from 'ag-grid-community'
import { Form } from 'antd'
import { FormInstance } from 'antd/lib/form/Form'

export interface SelectCustomersProps {
  form: FormInstance
  currentStep: number
  metadata?: SpecialOfferMetadataResponseData
  gridRef: React.MutableRefObject<GridApi<any> | undefined>
}
export function SelectCustomers({ form, currentStep, metadata, gridRef }: SelectCustomersProps) {
  const handleFormChange = (selection) => {
    form.setFieldsValue({ CounterPartyIds: selection.map((row) => row['Value']) })
  }
  const currentValue = Form.useWatch('CounterPartyIds', form) || []
  return (
    <Vertical
      style={{ display: currentStep === 3 ? 'block' : 'none', visibility: currentStep === 3 ? 'visible' : 'hidden' }}
      className={'p-4'}
    >
      <Texto category={'h5'}>Who should receive this deal?</Texto>
      <Texto className={'mb-2'}>Choose which customers can participate</Texto>
      <SelectionGrid
        rowData={metadata?.EligibleCounterParties || []}
        handleFormChange={handleFormChange}
        idField={'Value'}
        colDefFunc={CustomerSelectColumnDefs}
        rowSelection={'multiple'}
        currentValue={currentValue}
        gridRef={gridRef}
      />
      <Form.Item name='CounterPartyIds' rules={[{ required: true, message: 'Customer is required' }]}>
        <div />
      </Form.Item>
    </Vertical>
  )
}
