import './styles.css'

import { ArrowLeftOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal, NotificationMessage, Texto, Vertical } from '@gravitate-js/excalibrr'
import {
  IndexPricingFormData,
  SpecialOfferMetadataResponseData,
  SpecialOfferTemplate,
} from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { useSpecialOffers } from '@modules/Dashboard/SpecialOffers/Api/useSpecialOffers'
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
import { GridApi } from 'ag-grid-community'
import { Drawer, Form } from 'antd'
import moment from 'moment'
import type { ValidateErrorEntity } from 'rc-field-form/lib/interface'
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react'

interface CreateNewSpecialOfferProps {
  isShowingCreateNew: boolean
  setIsShowingCreateNew: Dispatch<SetStateAction<boolean>>
  metadata?: SpecialOfferMetadataResponseData
}
export function CreateNewSpecialOffer({
  isShowingCreateNew,
  setIsShowingCreateNew,
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
  const [formulaForm] = Form.useForm()
  const [form] = Form.useForm()
  const clearStateAndClose = () => {
    form.resetFields()
    formulaForm.resetFields()
    setCurrentStep(0)
    setIsShowingCreateNew(false)
    productGridRef?.current?.deselectAll()
    customerGridRef?.current?.deselectAll()
    setFinished(false)
    setIndexPricingData(null)
    setShowIndexError(false)
  }

  const { createSpecialOffer } = useSpecialOffers()

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
  const selectedVisibilityWindowStartTime = Form.useWatch('VisibilityWindowStartTime', form)
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

  useEffect(() => {
    if (isShowingCreateNew && metadata) {
      form.setFieldsValue(getInitialValues())
      // Set default time values for timing windows
      const timeDefaults: Record<string, moment.Moment> = {}
      if (!form.getFieldValue('InviteTriggerDate')) {
        timeDefaults.InviteTriggerDate = moment().startOf('day')
      }
      if (!form.getFieldValue('InviteTriggerTime')) {
        timeDefaults.InviteTriggerTime = getDefaultStartTime()
      }
      if (!form.getFieldValue('VisibilityWindowStartTime')) {
        timeDefaults.VisibilityWindowStartTime = getDefaultStartTime()
      }
      if (!form.getFieldValue('VisibilityWindowEndTime')) {
        timeDefaults.VisibilityWindowEndTime = getDefaultEndTime()
      }
      if (!form.getFieldValue('PickupWindowStartTime')) {
        timeDefaults.PickupWindowStartTime = getDefaultStartTime()
      }
      if (!form.getFieldValue('PickupWindowEndTime')) {
        timeDefaults.PickupWindowEndTime = getDefaultEndTime()
      }
      if (Object.keys(timeDefaults).length > 0) {
        form.setFieldsValue(timeDefaults)
      }
    } else if (!isShowingCreateNew) {
      clearStateAndClose()
    }
  }, [isShowingCreateNew, metadata])

  const onFinishFailed = (errorInfo: ValidateErrorEntity) => {
    setFinished(false)
    const message = errorInfo.errorFields[0].errors[0]
    NotificationMessage('Unable to save', message, true)
  }

  const handleSetToFutureTime = useCallback(() => {
    const futureTime = getDefaultStartTime()
    form.setFieldsValue({
      InviteTriggerDate: futureTime.clone().startOf('day'),
      InviteTriggerTime: futureTime,
      VisibilityWindowStartTime: futureTime.clone(),
      PickupWindowStartTime: futureTime.clone(),
    })
  }, [form])

  return (
    <Drawer
      width={'100%'}
      height={'100%'}
      visible={isShowingCreateNew}
      onClose={() => setIsShowingCreateNew(false)}
      title='Create New Offer'
      bodyStyle={{ backgroundColor: 'var(--bg-2)' }}
      placement={'bottom'}
    >
      <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed} layout='vertical'>
        <Vertical className={'gap-24 '} style={{ maxWidth: '1216px', margin: '0 auto', height: '100%' }}>
          <GraviButton
            className={'ghost-gravi-button p-0'}
            buttonText={
              <Horizontal verticalCenter className='gap-10 p-0'>
                <ArrowLeftOutlined />
                <Texto className={'text-14'} weight={'normal'}>
                  Back to Offers
                </Texto>
              </Horizontal>
            }
            onClick={clearStateAndClose}
          />

          <Horizontal
            className={'gap-20'}
            style={{ maxWidth: '1216px', minWidth: '1216px', margin: '0 auto', height: '100%' }}
          >
            <Vertical flex={2} className={'gap-20'} style={{ minWidth: '802px', maxWidth: '802px' }}>
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
                />

                <SelectTimingWindows
                  selectedPickupWindowEnd={selectedPickupWindowEnd}
                  selectedPickupWindowStart={selectedPickupWindowStart}
                  selectedVisibilityWindowEnd={selectedVisibilityWindowEnd}
                  selectedVisibilityWindowStart={selectedVisibilityWindowStart}
                  selectedVisibilityWindowStartTime={selectedVisibilityWindowStartTime}
                  form={form}
                  currentStep={currentStep}
                  onSetToFutureTime={handleSetToFutureTime}
                />
                <SelectCustomers form={form} currentStep={currentStep} metadata={metadata} gridRef={customerGridRef} />
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

          <Horizontal className={'gap-20'}>
            <Vertical flex={1} className={'p-4'} />
          </Horizontal>
        </Vertical>
      </Form>
    </Drawer>
  )
}
