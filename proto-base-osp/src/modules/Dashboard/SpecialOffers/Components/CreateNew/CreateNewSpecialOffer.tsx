import './styles.css'

import { ArrowLeftOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal, NotificationMessage, Texto, Vertical } from '@gravitate-js/excalibrr'
import type {
  IndexPricingFormData,
  SpecialOffer,
  SpecialOfferMetadataResponseData,
  SpecialOfferTemplate,
} from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { useSpecialOffersTyped } from '@modules/Dashboard/SpecialOffers/Api/useSpecialOffersTyped'
import { Footer } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/Components/Footer'
import { PreviewPanel } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/Components/PreviewPanel'
import { SelectCustomers } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/Components/SelectCustomers'
import { SelectDealType } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/Components/SelectDealType'
import { SelectProductAndLocation } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/Components/SelectProductAndLocation'
import { SelectTimingWindows } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/Components/SelectTimingWindows'
import { StepIndicator } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/Components/StepIndicator'
import { steps } from '@modules/Dashboard/SpecialOffers/utils/Constants/FormConstants'
import {
  getDefaultEndTime,
  getDefaultStartTime,
} from '@modules/Dashboard/SpecialOffers/utils/Constants/TimingWindowConstants'
import { createPayloadFromValues, validateFormFields } from '@modules/Dashboard/SpecialOffers/utils/Utils/FormHelpers'
import { buildPrefillFromPriorOffer } from '@modules/Dashboard/SpecialOffers/utils/Utils/PriorOfferHelpers'
import { getTimezoneIana } from '@modules/Dashboard/SpecialOffers/utils/Utils/TimingWindowHelpers'
import type { GridApi } from 'ag-grid-community'
import { Drawer, Form } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import { type Dispatch, type SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react'

interface CreateNewSpecialOfferProps {
  isShowingCreateNew: boolean
  setIsShowingCreateNew: Dispatch<SetStateAction<boolean>>
  onClose?: () => void
  priorOffer?: SpecialOffer
  metadata?: SpecialOfferMetadataResponseData
}

export function CreateNewSpecialOffer({
  isShowingCreateNew,
  setIsShowingCreateNew,
  onClose,
  priorOffer,
  metadata,
}: CreateNewSpecialOfferProps) {
  const [finished, setFinished] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>()
  const [selectedTemplateId, setSelectedTemplateId] = useState<number>()
  const [currentStep, setCurrentStep] = useState(0)
  const [indexPricingData, setIndexPricingData] = useState<IndexPricingFormData | null>()
  const productGridRef = useRef<GridApi>()
  const customerGridRef = useRef<GridApi>()
  const [showIndexError, setShowIndexError] = useState(false)
  const calendarClickRef = useRef(0)
  const [calendarDate, setCalendarDate] = useState<Dayjs | null>(null)
  const [prefillFocusToken, setPrefillFocusToken] = useState(0)
  const hasPrefilledRef = useRef(false)
  const [formulaForm] = Form.useForm()
  const [form] = Form.useForm()
  const clearStateAndClose = () => {
    form.resetFields()
    formulaForm.resetFields()
    setCurrentStep(0)
    productGridRef?.current?.deselectAll()
    customerGridRef?.current?.deselectAll()
    setFinished(false)
    setIndexPricingData(null)
    setShowIndexError(false)
    calendarClickRef.current = 0
    setCalendarDate(null)
    hasPrefilledRef.current = false
    setIsShowingCreateNew(false)
    onClose?.()
  }

  const { createSpecialOffer, getSpecialOfferBreakdown } = useSpecialOffersTyped()

  const priorOfferId = priorOffer?.SpecialOfferId
  const { data: priorBreakdownResponse } = getSpecialOfferBreakdown(priorOfferId ?? 0)
  const priorBreakdown = priorOfferId ? priorBreakdownResponse?.Data : undefined

  const clearProductLocationIfInvalid = (template: SpecialOfferTemplate) => {
    const currentProductLocation = form.getFieldValue('ProductLocation')
    if (!currentProductLocation) return

    const validProductLocations =
      metadata?.ProductLocationSelections?.filter(
        (pl) => pl.MarketPlatformInstrumentId === template.MarketPlatformInstrumentId
      ) || []
    const validSetupIds = validProductLocations.map((pl) => pl.TradeEntrySetupId)

    const currentSetupIds = Array.isArray(currentProductLocation) ? currentProductLocation : [currentProductLocation]
    const hasInvalidSelection = currentSetupIds.some((setupId: number) => !validSetupIds.includes(setupId))

    if (hasInvalidSelection) {
      form.setFieldsValue({ ProductLocation: undefined })
      productGridRef?.current?.deselectAll()
    }
  }
  const categories = useMemo(() => {
    const types = [...new Set(metadata?.SpecialOfferTemplates?.map((t) => t.CategoryType) || [])]
    return types.map((type) => {
      const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1)
      const baseTemplate = metadata?.SpecialOfferTemplates?.find(
        (t) => t.CategoryType === type && t.Name.toLowerCase() === type.toLowerCase()
      )
      return {
        id: type,
        label: capitalizedType,
        description: baseTemplate?.Description || '',
      }
    })
  }, [metadata])

  const templates = useMemo(() => {
    if (!selectedCategory) return []
    return metadata?.SpecialOfferTemplates?.filter((t) => t.CategoryType === selectedCategory) || []
  }, [metadata, selectedCategory])

  const isIndexPricing = useMemo(() => {
    const template = metadata?.SpecialOfferTemplates?.find((t) => t.SpecialOfferTemplateId === selectedTemplateId)
    return template?.PricingMechanismMeaning === 'Index'
  }, [metadata, selectedTemplateId])

  const isAuction = useMemo(() => selectedCategory === 'auction', [selectedCategory])

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category)
    const templatesForCategory = metadata?.SpecialOfferTemplates?.filter((t) => t.CategoryType === category) || []

    // Try to preserve the user's pricing mechanism selection
    const currentTemplate = metadata?.SpecialOfferTemplates?.find(
      (t) => t.SpecialOfferTemplateId === selectedTemplateId
    )
    const templateToSelect =
      templatesForCategory.find((t) => t.PricingMechanismCvId === currentTemplate?.PricingMechanismCvId) ||
      templatesForCategory[0]

    if (templateToSelect) {
      handleSelectTemplate(templateToSelect.SpecialOfferTemplateId)
    }
  }

  const handleSelectTemplate = (id: number) => {
    const template = metadata?.SpecialOfferTemplates?.find((t) => t.SpecialOfferTemplateId === id)
    if (template) {
      // Check if pricing mechanism is changing
      const currentTemplate = metadata?.SpecialOfferTemplates?.find(
        (t) => t.SpecialOfferTemplateId === selectedTemplateId
      )
      const isCurrentIndex = currentTemplate?.PricingMechanismMeaning === 'Index'
      const isNewIndex = template.PricingMechanismMeaning === 'Index'

      // Clear pricing data when switching between Index and Fixed
      if (isCurrentIndex !== isNewIndex) {
        setIndexPricingData(null)
        formulaForm.resetFields()
        form.setFieldsValue({ FixedPrice: undefined, ReservePrice: undefined, IndexPrice: undefined })
      }

      setSelectedTemplateId(id)
      clearProductLocationIfInvalid(template)
      form.setFieldsValue({
        SpecialOfferTemplateId: id,
        MinimumVolumePerOrder: template.DefaultMinimumVolumePerOrder,
        MaximumVolumePerOrder: template.DefaultMaximumVolumePerOrder,
        VolumeIncrement: template.DefaultVolumeIncrement,
      })
    }
  }
  const productLocation = Form.useWatch('ProductLocation', form)
  const pricingStrategy = Form.useWatch('ReservePrice', form)
  const selectedVisibilityWindowStart = Form.useWatch('VisibilityWindowStartDate', form)
  const selectedVisibilityWindowStartTimeRaw = Form.useWatch('VisibilityWindowStartTime', form)
  const selectedVisibilityWindowStartTime = selectedVisibilityWindowStartTimeRaw
    ? dayjs(selectedVisibilityWindowStartTimeRaw)
    : undefined
  const selectedPickupWindowStart = Form.useWatch('PickupWindowStartDate', form)
  const selectedTargetCustomers = Form.useWatch('CounterPartyIds', form)
  const selectedVisibilityWindowEnd = Form.useWatch('VisibilityWindowEndDate', form)
  const selectedPickupWindowEnd = Form.useWatch('PickupWindowEndDate', form)

  const getInitialValues = () => {
    const template = metadata?.SpecialOfferTemplates?.[0]
    if (template?.SpecialOfferTemplateId) {
      setSelectedCategory(template.CategoryType)
      setSelectedTemplateId(template.SpecialOfferTemplateId)
      return {
        SpecialOfferTemplateId: template.SpecialOfferTemplateId,
        MinimumVolumePerOrder: template.DefaultMinimumVolumePerOrder,
        MaximumVolumePerOrder: template.DefaultMaximumVolumePerOrder,
        VolumeIncrement: template.DefaultVolumeIncrement,
        TradeEntrySetupIds: [],
        CounterPartyIds: [],
      }
    }
  }
  const onFinish = async (values: any) => {
    const payload = createPayloadFromValues({
      values,
      indexPricingData: indexPricingData ?? undefined,
      formulaMetadata: metadata?.IndexOfferMetaData,
      validTimeZones: metadata?.ValidTimeZoneIds,
    })
    try {
      await createSpecialOffer.mutateAsync(payload)
      clearStateAndClose()
    } catch {
      setFinished(false)
    }
  }

  const goNext = () => setCurrentStep(currentStep + 1)

  const validateFormAndNavigate = () => {
    if (currentStep === 0) {
      return goNext()
    }
    if (currentStep === 3) {
      return form.submit()
    }
    validateFormFields({ currentStep, form, goNext, setShowIndexError, isIndexPricing })
  }

  // Resolve the selected TradeEntrySetupId to primitive ProductId/LocationId so
  // SelectCustomers can derive each counterparty's IsAuthorized flag client-side
  // by joining against the focused authorization-lookup endpoint.
  const firstSetupId = Array.isArray(productLocation) ? productLocation[0] : productLocation
  const productLocationSelection =
    firstSetupId != null
      ? metadata?.ProductLocationSelections?.find((pl) => pl.TradeEntrySetupId === firstSetupId)
      : undefined
  const selectedProductId = productLocationSelection?.ProductId
  const selectedLocationId = productLocationSelection?.LocationId

  useEffect(() => {
    if (isShowingCreateNew && metadata) {
      // Prior-offer prefill drives its own template selection below.
      if (!priorOffer) {
        form.setFieldsValue(getInitialValues())
      }
      setCalendarDate(dayjs())
      // Set defaults for timing windows
      const defaults: Record<string, Dayjs | boolean> = {}
      // Default "Send Invites on Create" to checked
      defaults.SendInvitesOnCreate = true
      // Default "Start Now" checkboxes to checked with current date/time
      const initialTimezone = getTimezoneIana(form.getFieldValue('TimeZoneId'), metadata?.ValidTimeZoneIds)
      const defaultStartTime = getDefaultStartTime(initialTimezone)
      defaults.VisibilityStartNow = true
      defaults.PickupStartNow = true
      defaults.VisibilityWindowStartDate = defaultStartTime
      defaults.VisibilityWindowStartTime = defaultStartTime
      defaults.PickupWindowStartDate = defaultStartTime
      defaults.PickupWindowStartTime = defaultStartTime
      if (!form.getFieldValue('InviteTriggerDate')) {
        defaults.InviteTriggerDate = defaultStartTime.startOf('day')
      }
      if (!form.getFieldValue('InviteTriggerTime')) {
        defaults.InviteTriggerTime = defaultStartTime
      }
      if (!form.getFieldValue('VisibilityWindowEndTime')) {
        defaults.VisibilityWindowEndTime = getDefaultEndTime(initialTimezone)
      }
      if (!form.getFieldValue('PickupWindowEndTime')) {
        defaults.PickupWindowEndTime = getDefaultEndTime(initialTimezone)
      }
      form.setFieldsValue(defaults)
      // Skip start dates in calendar flow since "Start Now" is default
      calendarClickRef.current = 1
    }
  }, [isShowingCreateNew, metadata, priorOffer])

  // Land on the Products step before the breakdown arrives so the user sees the right step.
  useEffect(() => {
    if (isShowingCreateNew && priorOffer) {
      setCurrentStep(1)
      setPrefillFocusToken((t) => t + 1)
    }
  }, [isShowingCreateNew, priorOffer])

  // Skip the four timing date fields per PE-5195; existing "Start Now" defaults take over.
  useEffect(() => {
    if (!isShowingCreateNew || !priorOffer || !priorBreakdown || !metadata || hasPrefilledRef.current) {
      return
    }

    const prefill = buildPrefillFromPriorOffer(priorOffer, priorBreakdown, metadata)
    if (!prefill.template) return

    hasPrefilledRef.current = true

    setSelectedCategory(prefill.template.CategoryType ?? undefined)
    handleSelectTemplate(prefill.template.SpecialOfferTemplateId as number)

    const productLocationValue =
      prefill.productLocation?.TradeEntrySetupId != null ? [prefill.productLocation.TradeEntrySetupId] : undefined

    form.setFieldsValue({
      ProductLocation: productLocationValue,
      CounterPartyIds: prefill.counterPartyIds,
      ReservePrice: prefill.price,
      TimeZoneId: prefill.timeZoneId,
      TotalVolume: undefined,
    })

    if (prefill.indexPricingData) {
      setIndexPricingData(prefill.indexPricingData)
      form.setFieldsValue({ IndexPrice: prefill.indexPricingData })
    }

    setPrefillFocusToken((t) => t + 1)
  }, [isShowingCreateNew, priorOffer, priorBreakdown, metadata])

  // AG Grid selection lives in node.isSelected() — has to be set imperatively, not via form value.
  useEffect(() => {
    if (!isShowingCreateNew || !priorOffer || prefillFocusToken === 0) return

    const targetTradeEntrySetupId = (form.getFieldValue('ProductLocation') as number[] | undefined)?.[0]
    const targetCounterPartyIds = (form.getFieldValue('CounterPartyIds') as number[] | undefined) ?? []

    let cancelled = false
    let attempts = 0
    const interval = setInterval(() => {
      attempts += 1
      const productApi = productGridRef.current
      const customerApi = customerGridRef.current
      let productDone = targetTradeEntrySetupId == null
      let customerDone = targetCounterPartyIds.length === 0

      if (!productDone && productApi) {
        productApi.forEachNode((node) => {
          if (node.data?.TradeEntrySetupId === targetTradeEntrySetupId) {
            node.setSelected(true)
            productApi.ensureNodeVisible(node, 'middle')
            productDone = true
          }
        })
      }
      if (!customerDone && customerApi) {
        const idSet = new Set(targetCounterPartyIds)
        customerApi.forEachNode((node) => {
          if (idSet.has(node.data?.CounterPartyId)) {
            node.setSelected(true)
          }
        })
        if (customerApi.getSelectedRows().length > 0) customerDone = true
      }

      if ((productDone && customerDone) || attempts > 50 || cancelled) {
        clearInterval(interval)
      }
    }, 100)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [prefillFocusToken, isShowingCreateNew, priorOffer])

  const handleSetToFutureTime = useCallback(() => {
    const timezone = getTimezoneIana(form.getFieldValue('TimeZoneId'), metadata?.ValidTimeZoneIds)
    const futureTime = getDefaultStartTime(timezone)
    form.setFieldsValue({
      InviteTriggerDate: futureTime.startOf('day'),
      InviteTriggerTime: futureTime,
      VisibilityWindowStartTime: futureTime,
      PickupWindowStartTime: futureTime,
    })
  }, [form, metadata?.ValidTimeZoneIds])

  const onFinishFailed = (errorInfo: any) => {
    setFinished(false)
    const errors = errorInfo.errorFields.map((f) => f.errors[0])
    NotificationMessage('Failed to create offer', errors, true)
  }
  return (
    <Drawer
      width={'100%'}
      height={'100%'}
      open={isShowingCreateNew}
      onClose={clearStateAndClose}
      title='Create New Offer'
      styles={{ body: { backgroundColor: 'var(--bg-2)' } }}
      placement={'bottom'}
    >
      <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed} layout='vertical'>
        <Vertical gap={24} style={{ maxWidth: '1216px', margin: '0 auto', height: '100%' }}>
          <GraviButton
            className={'ghost-gravi-button p-0'}
            style={{ alignSelf: 'flex-start' }}
            buttonText={
              <Horizontal gap={10} verticalCenter className='p-0'>
                <ArrowLeftOutlined />
                <Texto className={'text-14 ml-2'} weight={'normal'}>
                  Back to Offers
                </Texto>
              </Horizontal>
            }
            onClick={clearStateAndClose}
          />

          <Horizontal gap={20} style={{ maxWidth: '1216px', minWidth: '1216px', margin: '0 auto', height: '100%' }}>
            <Vertical gap={20} flex={2} style={{ minWidth: '802px', maxWidth: '802px' }}>
              <Vertical className={'bg-1 border-radius-10 bordered pb-4'}>
                <Vertical className={'p-4'} style={{ maxHeight: 'fit-content' }}>
                  <Texto category={'h3'} className={'text-24'}>
                    Create New Offer
                  </Texto>
                  <Texto className={'text-14'}>Complete all steps to create your offer</Texto>
                </Vertical>
                <StepIndicator currentStep={currentStep} steps={steps} />
                {currentStep === 0 && (
                  <SelectDealType
                    handleSelectCategory={handleSelectCategory}
                    selectedCategory={selectedCategory}
                    handleSelectTemplate={handleSelectTemplate}
                    selectedTemplateId={selectedTemplateId}
                    categories={categories}
                    templates={templates}
                  />
                )}

                <SelectProductAndLocation
                  metadata={metadata}
                  form={form}
                  productLocation={productLocation}
                  dealType={selectedTemplateId}
                  currentStep={currentStep}
                  gridRef={productGridRef}
                  isIndexPricing={isIndexPricing}
                  isAuction={isAuction}
                  onSaveIndexPricing={setIndexPricingData}
                  savedIndexData={indexPricingData}
                  setShowIndexError={setShowIndexError}
                  showIndexError={showIndexError}
                  formulaForm={formulaForm}
                  focusTotalVolumeToken={prefillFocusToken}
                />

                <SelectTimingWindows
                  selectedPickupWindowEnd={selectedPickupWindowEnd}
                  selectedPickupWindowStart={selectedPickupWindowStart}
                  selectedVisibilityWindowEnd={selectedVisibilityWindowEnd}
                  selectedVisibilityWindowStart={selectedVisibilityWindowStart}
                  selectedVisibilityWindowStartTime={selectedVisibilityWindowStartTime}
                  form={form}
                  currentStep={currentStep}
                  validTimeZones={metadata?.ValidTimeZoneIds}
                  onSetToFutureTime={handleSetToFutureTime}
                  calendarClickRef={calendarClickRef}
                  calendarDate={calendarDate}
                  setCalendarDate={setCalendarDate}
                />
                <SelectCustomers
                  form={form}
                  currentStep={currentStep}
                  metadata={metadata}
                  gridRef={customerGridRef}
                  selectedProductId={selectedProductId}
                  selectedLocationId={selectedLocationId}
                />
              </Vertical>
              <Footer
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                validateFormAndNavigate={validateFormAndNavigate}
                form={form}
                finished={finished}
                setFinished={setFinished}
              />
            </Vertical>

            <Vertical flex={1} className={'bg-1 border-radius-10 bordered p-4'} style={{ maxWidth: '390px' }}>
              <Horizontal horizontalCenter>
                <PreviewPanel
                  dealType={selectedTemplateId}
                  productLocation={productLocation}
                  metadata={metadata}
                  pricingStrategy={pricingStrategy}
                  targetCustomers={selectedTargetCustomers}
                  selectedPickupWindowEnd={selectedPickupWindowEnd}
                  selectedPickupWindowStart={selectedPickupWindowStart}
                  selectedVisibilityWindowEnd={selectedVisibilityWindowEnd}
                  selectedVisibilityWindowStart={selectedVisibilityWindowStart}
                  form={form}
                  isIndexPricing={isIndexPricing}
                  indexPricingData={indexPricingData}
                  isAuction={isAuction}
                />
              </Horizontal>
            </Vertical>
          </Horizontal>
          <Form.Item hidden name='SpecialOfferTemplateId'>
            <div />
          </Form.Item>

          <Horizontal gap={20}>
            <Vertical flex={1} className={'p-4'} />
          </Horizontal>
        </Vertical>
      </Form>
    </Drawer>
  )
}
