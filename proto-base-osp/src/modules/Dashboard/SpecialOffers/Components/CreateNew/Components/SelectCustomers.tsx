import { useUser } from '@contexts/UserContext'
import { Texto, Vertical } from '@gravitate-js/excalibrr'
import { SpecialOfferMetadataResponseData } from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { useSpecialOffersTyped } from '@modules/Dashboard/SpecialOffers/Api/useSpecialOffersTyped'
import { CustomerSelectColumnDefs } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/Components/SelectionGrid/Columns/CustomerSelectColumnDefs'
import { SelectionGrid } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/Components/SelectionGrid/SelectionGrid'
import { GridApi } from 'ag-grid-community'
import type { FormInstance } from 'antd'
import { Form } from 'antd'
import { useCallback, useMemo } from 'react'

export interface SelectCustomersProps {
  form: FormInstance
  currentStep: number
  metadata?: SpecialOfferMetadataResponseData
  gridRef: React.MutableRefObject<GridApi<any> | undefined>
  selectedProductId?: number
  selectedLocationId?: number
}
export function SelectCustomers({
  form,
  currentStep,
  metadata,
  gridRef,
  selectedProductId,
  selectedLocationId,
}: SelectCustomersProps) {
  const { user } = useUser()
  const isInternalUser = user?.Data?.AllowedImpersonationModes?.includes('All')
  const { getAuthorizedCounterPartyIds } = useSpecialOffersTyped()
  const { data: authorizedIdsResponse } = getAuthorizedCounterPartyIds({
    productId: selectedProductId,
    locationId: selectedLocationId,
  })

  const handleFormChange = (selection) => {
    form.setFieldsValue({ CounterPartyIds: selection.map((row) => row['CounterPartyId']) })
  }
  const currentValue = Form.useWatch('CounterPartyIds', form) || []
  const colDefFunc = useCallback(() => CustomerSelectColumnDefs(isInternalUser), [isInternalUser])

  // Join the focused authorization-lookup result against the eligible-CP list to
  // produce a derived rowData with IsAuthorized set per CP. Falls back to false
  // until both a product-location is selected and the authorization query resolves.
  const rowData = useMemo(() => {
    const eligible = metadata?.EligibleCounterParties || []
    const authorizedSet = new Set(authorizedIdsResponse?.Data ?? [])
    return eligible.map((cp) => ({
      ...cp,
      IsAuthorized: cp.CounterPartyId != null && authorizedSet.has(cp.CounterPartyId),
    }))
  }, [metadata?.EligibleCounterParties, authorizedIdsResponse?.Data])

  return (
    <Vertical
      style={{ display: currentStep === 3 ? 'block' : 'none', visibility: currentStep === 3 ? 'visible' : 'hidden' }}
      className={'p-4'}
    >
      <Texto category={'h5'}>Who should receive this deal?</Texto>
      <Texto className={'mb-2'}>Choose which customers can participate</Texto>
      <SelectionGrid
        rowData={rowData}
        handleFormChange={handleFormChange}
        idField={'CounterPartyId'}
        colDefFunc={colDefFunc}
        rowSelection={'multiple'}
        currentValue={currentValue}
        gridRef={gridRef}
        storageKey={'OfferCreateFlow-SelectionGrid-Customers'}
      />
      <Form.Item name='CounterPartyIds' rules={[{ required: true, message: 'Customer is required' }]}>
        <div />
      </Form.Item>
    </Vertical>
  )
}
