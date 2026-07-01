import { Texto, Vertical } from '@gravitate-js/excalibrr'
import {
  IndexPricingFormData,
  ProductLocationSelection,
  SpecialOfferMetadataResponseData,
} from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { ConfigureFixedPrice } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/Components/ConfigureFixedPrice'
import { ConfigureIndexPrice } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/Components/ConfigureIndexPrice/ConfigureIndexPrice'
import { ConfigureVolume } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/Components/ConfigureVolume'
import { ProductLocationSelectColumnDefs } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/Components/SelectionGrid/Columns/ProductLocationSelectColumnDefs'
import { SelectionGrid } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/Components/SelectionGrid/SelectionGrid'
import { FixedPriceInfo, ReservePriceInfo } from '@modules/Dashboard/SpecialOffers/utils/Constants/FormConstants'
import { GridApi } from 'ag-grid-community'
import type { FormInstance } from 'antd'
import { Form, Segmented } from 'antd'
import { useMemo, useRef } from 'react'

export interface SelectProductsLocationsProps {
  metadata?: SpecialOfferMetadataResponseData
  productLocation: string
  dealType?: number
  currentStep: number
  form: FormInstance
  gridRef: React.MutableRefObject<GridApi | undefined>
  isIndexPricing?: boolean
  isAuction: boolean
  onSaveIndexPricing: (data: IndexPricingFormData | null) => void
  savedIndexData?: IndexPricingFormData | null
  setShowIndexError: React.Dispatch<React.SetStateAction<boolean>>
  showIndexError: boolean
  formulaForm: FormInstance
  focusTotalVolumeToken?: number
  /** When provided, overrides the default `currentStep === 1` visibility gate so the
   *  same picker can be composed into a flow with a different step layout (e.g. the
   *  two-step quick-create). Omit to keep the 4-step wizard's behavior. */
  isActive?: boolean
}
export function SelectProductAndLocation({
  metadata,
  productLocation,
  dealType,
  currentStep,
  form,
  gridRef,
  isIndexPricing,
  isAuction,
  onSaveIndexPricing,
  savedIndexData,
  setShowIndexError,
  showIndexError,
  formulaForm,
  focusTotalVolumeToken,
  isActive,
}: SelectProductsLocationsProps) {
  const isVisible = isActive ?? currentStep === 1
  const saveIndexPricing = (value) => {
    onSaveIndexPricing(value)
    form.setFieldsValue({ IndexPrice: value })
    formulaForm.resetFields()
    setShowIndexError(false)
  }
  const price = useMemo(() => {
    const selectedTemplate = metadata?.SpecialOfferTemplates?.find((t) => t.SpecialOfferTemplateId === dealType)
    const dealName = selectedTemplate?.Name || ''
    if (dealName.includes('Auction')) {
      return ReservePriceInfo
    }
    return FixedPriceInfo
  }, [dealType, metadata?.SpecialOfferTemplates])

  const filteredProductLocations = useMemo(() => {
    if (!dealType || !metadata?.ProductLocationSelections) {
      return []
    }

    const selectedTemplate = metadata.SpecialOfferTemplates?.find((t) => t.SpecialOfferTemplateId === dealType)

    if (!selectedTemplate) {
      return metadata.ProductLocationSelections
    }

    return metadata.ProductLocationSelections.filter(
      (pl) => pl.MarketPlatformInstrumentId === selectedTemplate.MarketPlatformInstrumentId
    )
  }, [dealType, metadata?.ProductLocationSelections, metadata?.SpecialOfferTemplates])

  const handleFormChange = (selection: ProductLocationSelection[]) => {
    const newValue = selection.length > 0 ? selection.map((s) => s['TradeEntrySetupId']) : undefined
    form.setFieldsValue({ ProductLocation: newValue })
    if (selection?.[0]) {
      formulaForm.setFieldsValue({
        ProductId: selection[0].ProductId?.toString(),
        LocationId: selection[0].LocationId?.toString(),
      })
    }
    const selectedItem = selection?.[0]
    form.setFieldsValue({ TimeZoneId: selectedItem?.TimeZoneId ?? undefined })
  }
  const currentValue = Form.useWatch('ProductLocation', form)
  const idRef = useRef(0)

  const selectedSetup = useMemo(
    () => metadata?.ProductLocationSelections?.find((pl) => pl.TradeEntrySetupId === currentValue?.[0]),
    [metadata?.ProductLocationSelections, currentValue]
  )
  const uomSymbol = selectedSetup?.UnitOfMeasureSymbol ?? defaultUnitOfMeasureSymbol
  const currencySymbol = selectedSetup?.CurrencySymbol ?? defaultCurrencySymbol

  return (
    <Vertical
      className={'p-4'}
      style={{ visibility: isVisible ? 'visible' : 'hidden', display: isVisible ? 'block' : 'none' }}
    >
      <Texto category={'h4'} className={'text-18'}>
        Select a Product
      </Texto>
      <Texto className={'mb-4 text-14'}>Choose a product and configure volume requirements</Texto>
      <SelectionGrid
        rowData={filteredProductLocations}
        idField={'TradeEntrySetupId'}
        colDefFunc={ProductLocationSelectColumnDefs}
        rowSelection={'single'}
        handleFormChange={handleFormChange}
        currentValue={currentValue}
        gridRef={gridRef}
        storageKey={'OfferCreateFlow-SelectionGrid-Products'}
      />
      <Form.Item name='ProductLocation' rules={[{ required: true, message: 'Product is required' }]}>
        <div />
      </Form.Item>

      <Vertical
        style={{
          visibility: productLocation ? 'visible' : 'hidden',
          display: productLocation ? 'block' : 'none',
        }}
      >
        <ConfigureVolume form={form} uomSymbol={uomSymbol} focusTotalVolumeToken={focusTotalVolumeToken} />
        <Texto category={'h4'} className={'text-18'}>
          Pricing Strategy
        </Texto>
        <Texto className={'mb-4 text-14'}>Choose how you want to set your price</Texto>
        <Segmented
          options={['Fixed Price', 'Index Price']}
          block
          value={isIndexPricing ? 'Index Price' : 'Fixed Price'}
          style={{ pointerEvents: 'none' }}
          className={'mb-4'}
        />
        <Vertical
          style={{ visibility: isIndexPricing ? 'visible' : 'hidden', display: isIndexPricing ? 'block' : 'none' }}
        >
          <ConfigureIndexPrice
            metadata={metadata}
            onSaveIndexPricing={saveIndexPricing}
            savedIndexData={savedIndexData}
            isAuction={isAuction}
            idRef={idRef}
            showIndexError={showIndexError}
            setShowIndexError={setShowIndexError}
            formulaForm={formulaForm}
            offerForm={form}
            selectedProductLocation={currentValue?.[0] || undefined}
          />
          <Form.Item
            style={{ marginTop: '-20px' }}
            name='IndexPrice'
            rules={[
              {
                validator: (field, value) => {
                  if (!value && isIndexPricing) {
                    return Promise.reject('Index Price is required')
                  }
                  return Promise.resolve()
                },
              },
            ]}
          >
            <div />
          </Form.Item>
          <Form.Item
            style={{ marginTop: '-20px' }}
            name='ReservePrice'
            rules={[
              {
                validator: (field, value) => {
                  if ((value === null || value === undefined) && isIndexPricing && isAuction) {
                    return Promise.reject('Reserve Price is required')
                  }
                  return Promise.resolve()
                },
              },
            ]}
          >
            <div />
          </Form.Item>
        </Vertical>

        {!isIndexPricing && (
          <ConfigureFixedPrice price={price} uomSymbol={uomSymbol} currencySymbol={currencySymbol} />
        )}
      </Vertical>
    </Vertical>
  )
}
