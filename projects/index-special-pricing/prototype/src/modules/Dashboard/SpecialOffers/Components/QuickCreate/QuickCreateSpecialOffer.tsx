import '../CreateNew/styles.css'
import './styles.css'

import { addCommasToNumber, GraviButton, Horizontal, NotificationMessage, Texto, Vertical } from '@gravitate-js/excalibrr'
import type {
  IndexPricingFormData,
  SpecialOfferMetadataResponseData,
} from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { useSpecialOffersTyped } from '@modules/Dashboard/SpecialOffers/Api/useSpecialOffersTyped'
import { CreateNewSpecialOffer } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/CreateNewSpecialOffer'
import { Footer } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/Components/Footer'
import { PreviewPanel } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/Components/PreviewPanel'
import { SelectTimingWindows } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/Components/SelectTimingWindows'
import { StepIndicator } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/Components/StepIndicator'
import { CustomerTabsBin } from '@modules/Dashboard/SpecialOffers/Components/QuickCreate/Components/CustomerTabsBin'
import { OfferSent, type OfferSummaryRow } from '@modules/Dashboard/SpecialOffers/Components/QuickCreate/Components/OfferSent'
import { PresetBar, type PresetState } from '@modules/Dashboard/SpecialOffers/Components/QuickCreate/Components/PresetBar'
import { QuickFixedPrice } from '@modules/Dashboard/SpecialOffers/Components/QuickCreate/Components/QuickFixedPrice'
import { QuickIndexPrice } from '@modules/Dashboard/SpecialOffers/Components/QuickCreate/Components/QuickIndexPrice'
import { QuickProductSelect } from '@modules/Dashboard/SpecialOffers/Components/QuickCreate/Components/QuickProductSelect'
import { TimeframeQuickPicker } from '@modules/Dashboard/SpecialOffers/Components/QuickCreate/Components/TimeframeQuickPicker'
import { step1Fields } from '@modules/Dashboard/SpecialOffers/utils/Constants/FormConstants'
import {
  getDefaultEndTime,
  getDefaultStartTime,
} from '@modules/Dashboard/SpecialOffers/utils/Constants/TimingWindowConstants'
import {
  type CustomerFilterState,
  type DealPricing,
  DEFAULT_CUSTOMER_FILTERS,
  type FullSetupCarry,
  OFFER_PRESETS,
  type OfferPreset,
  pickFixedSpecialTemplate,
  pickIndexSpecialTemplate,
  resolvePreset,
} from '@modules/Dashboard/SpecialOffers/utils/Constants/PresetConstants'
import { createPayloadFromValues } from '@modules/Dashboard/SpecialOffers/utils/Utils/FormHelpers'
import { formatPricePerUnit } from '@utils/index'
import { getTimezoneIana } from '@modules/Dashboard/SpecialOffers/utils/Utils/TimingWindowHelpers'
import type { GridApi } from 'ag-grid-community'
import { Drawer, Form, Modal, Segmented } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import { useCallback, useEffect, useRef, useState } from 'react'

interface QuickCreateSpecialOfferProps {
  isOpen: boolean
  onClose: () => void
  metadata?: SpecialOfferMetadataResponseData
}

const QUICK_STEPS = ['Offer details', 'Timeframe']

// Demo seed: a couple pre-pinned favorites (ids exist in the EligibleCounterParties fixture) so the
// ★ Favorites group + filled stars are visible on first open. Filtered against eligible rows downstream.
const FAVORITE_SEED = [9002, 9004, 9007]

type QuickView = 'offer' | 'fullSetup'

export function QuickCreateSpecialOffer({ isOpen, onClose, metadata }: QuickCreateSpecialOfferProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [finished, setFinished] = useState(false)
  const [sent, setSent] = useState(false)
  const [summaryRows, setSummaryRows] = useState<OfferSummaryRow[]>([])

  const [selectedTemplateId, setSelectedTemplateId] = useState<number>()
  const [selectedCategory, setSelectedCategory] = useState<string>()
  const [indexPricingData, setIndexPricingData] = useState<IndexPricingFormData | null>()
  const [showIndexError, setShowIndexError] = useState(false)

  const [presets, setPresets] = useState<OfferPreset[]>(OFFER_PRESETS)
  const [selectedPresetId, setSelectedPresetId] = useState<string>()
  const [presetState, setPresetState] = useState<PresetState>('none')
  const applyingPresetRef = useRef(false)
  const [presetApplyToken, setPresetApplyToken] = useState(0)

  // Deal type = index vs fixed pricing (offer/auction is not a choice in the offer flow). Filters
  // which presets are available.
  // ponytail: presentation + preset-filtering only this pass — product/formula machinery still
  // resolves the index-special template under the hood (the only template in the mock). Upgrade
  // path: drive template/product/formula off `pricing` once fixed templates exist.
  const [pricing, setPricing] = useState<DealPricing>('index')

  // Additive customer filters, lifted here so both picker instances + presets share them.
  const [customerFilters, setCustomerFilters] = useState<CustomerFilterState>(DEFAULT_CUSTOMER_FILTERS)

  const customerGridRef = useRef<GridApi>()
  const allCustomerGridRef = useRef<GridApi>()

  // Favorites (star-pin), shared by both customer-picker instances. Session-only: this orchestrator
  // stays mounted across drawer open/close (only the Drawer's children are destroyed), so plain state
  // persists between opens and resets on page reload — and is intentionally NOT cleared in clearAndClose.
  const [favoriteIds, setFavoriteIds] = useState<number[]>(FAVORITE_SEED)
  const favoritesRef = useRef<Set<number>>(new Set(FAVORITE_SEED))
  const toggleFavorite = useCallback((id: number) => {
    setFavoriteIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }, [])
  // Sync the live ref + repaint the star column in BOTH grids whenever favorites change. AG-Grid caches
  // the cellRenderer, so a force refresh is required for the star to flip (same pattern as SelectionGrid).
  useEffect(() => {
    favoritesRef.current = new Set(favoriteIds)
    ;[customerGridRef, allCustomerGridRef].forEach((r) =>
      r.current?.refreshCells({ columns: ['__favorite'], force: true })
    )
  }, [favoriteIds])
  const calendarClickRef = useRef(0)
  const [calendarDate, setCalendarDate] = useState<Dayjs | null>(null)
  const [view, setView] = useState<QuickView>('offer')
  const [customerMaxView, setCustomerMaxView] = useState(false)
  const [fullSetupCarry, setFullSetupCarry] = useState<FullSetupCarry>()

  const [form] = Form.useForm()
  const [formulaForm] = Form.useForm()

  const { createSpecialOffer } = useSpecialOffersTyped()

  // Drives which pricing form renders + which gate Step 1 enforces + which preview branch shows.
  // Index → formula section + IndexPrice gate; Fixed → flat-price input + ReservePrice gate.
  const isIndexPricing = pricing === 'index'

  const productLocation = Form.useWatch('ProductLocation', form)
  const totalVolume = Form.useWatch('TotalVolume', form)
  const reservePrice = Form.useWatch('ReservePrice', form) as number | undefined
  const targetCustomers = Form.useWatch('CounterPartyIds', form)
  // Drives the Step-2 progressive disclosure: Configure Timing only appears for "Custom" —
  // the quick-pick options auto-fill both windows, so there's nothing left to configure.
  const timeframeChoice = Form.useWatch('__TimeframeQuick', form) as string | undefined
  const selectedVisibilityWindowStart = Form.useWatch('VisibilityWindowStartDate', form)
  const selectedVisibilityWindowStartTimeRaw = Form.useWatch('VisibilityWindowStartTime', form)
  const selectedVisibilityWindowStartTime = selectedVisibilityWindowStartTimeRaw
    ? dayjs(selectedVisibilityWindowStartTimeRaw)
    : undefined
  const selectedPickupWindowStart = Form.useWatch('PickupWindowStartDate', form)
  const selectedVisibilityWindowEnd = Form.useWatch('VisibilityWindowEndDate', form)
  const selectedPickupWindowEnd = Form.useWatch('PickupWindowEndDate', form)

  // Resolve the selected setup → primitive ProductId/LocationId so CustomerTabsBin can
  // derive each counterparty's IsAuthorized flag (same join the 4-step wizard uses).
  const firstSetupId = Array.isArray(productLocation) ? productLocation[0] : productLocation
  const productLocationSelection =
    firstSetupId != null
      ? metadata?.ProductLocationSelections?.find((pl) => pl.TradeEntrySetupId === firstSetupId)
      : undefined
  const selectedProductId = productLocationSelection?.ProductId
  const selectedLocationId = productLocationSelection?.LocationId

  // Enough configured to be worth saving as a preset — gates the from-scratch "Save as new preset".
  const hasOfferContent =
    !!firstSetupId ||
    !!indexPricingData ||
    reservePrice != null ||
    (Array.isArray(targetCustomers) && targetCustomers.length > 0) ||
    totalVolume != null

  const applyTimingDefaults = useCallback(() => {
    const timezone = getTimezoneIana(form.getFieldValue('TimeZoneId'), metadata?.ValidTimeZoneIds)
    const defaultStartTime = getDefaultStartTime(timezone)
    form.setFieldsValue({
      SendInvitesOnCreate: true,
      VisibilityStartNow: true,
      PickupStartNow: true,
      VisibilityWindowStartDate: defaultStartTime,
      VisibilityWindowStartTime: defaultStartTime,
      PickupWindowStartDate: defaultStartTime,
      PickupWindowStartTime: defaultStartTime,
      VisibilityWindowEndTime: getDefaultEndTime(timezone),
      PickupWindowEndTime: getDefaultEndTime(timezone),
      InviteTriggerDate: defaultStartTime.startOf('day'),
      InviteTriggerTime: defaultStartTime,
    })
    calendarClickRef.current = 1
  }, [form, metadata?.ValidTimeZoneIds])

  // Seed the default Index Special template + its volume defaults. Used on open and on "New offer"
  // (the latter keeps the drawer open, so the open effect below won't re-fire).
  const seedIndexTemplateDefaults = useCallback(() => {
    const template = pickIndexSpecialTemplate(metadata)
    if (template?.SpecialOfferTemplateId) {
      setSelectedTemplateId(template.SpecialOfferTemplateId)
      setSelectedCategory(template.CategoryType ?? undefined)
      form.setFieldsValue({
        SpecialOfferTemplateId: template.SpecialOfferTemplateId,
        MinimumVolumePerOrder: template.DefaultMinimumVolumePerOrder,
        MaximumVolumePerOrder: template.DefaultMaximumVolumePerOrder,
        VolumeIncrement: template.DefaultVolumeIncrement,
        CounterPartyIds: [],
      })
    }
  }, [metadata, form])

  // Open: default to Index Special with its volume defaults + timing defaults.
  useEffect(() => {
    if (!isOpen || !metadata) return
    seedIndexTemplateDefaults()
    setCalendarDate(dayjs())
    applyTimingDefaults()
  }, [isOpen, metadata, seedIndexTemplateDefaults, applyTimingDefaults])

  const clearAndClose = () => {
    form.resetFields()
    formulaForm.resetFields()
    setCurrentStep(0)
    setFinished(false)
    setSent(false)
    setPricing('index') // reset the deal type; the open effect re-seeds the index template on reopen
    setIndexPricingData(null)
    setShowIndexError(false)
    setSelectedPresetId(undefined)
    setPresetState('none')
    setCustomerFilters(DEFAULT_CUSTOMER_FILTERS)
    customerGridRef.current?.deselectAll()
    calendarClickRef.current = 0
    setCalendarDate(null)
    setView('offer')
    setCustomerMaxView(false)
    setFullSetupCarry(undefined)
    onClose()
  }

  // ---- Presets -------------------------------------------------------------
  const applyPreset = (presetId?: string) => {
    if (!presetId) {
      setSelectedPresetId(undefined)
      setPresetState('none')
      return
    }
    const preset = presets.find((p) => p.id === presetId)
    if (!preset) return
    applyingPresetRef.current = true
    const resolved = resolvePreset(preset, metadata)
    if (resolved.templateId) {
      setSelectedTemplateId(resolved.templateId)
      setSelectedCategory(resolved.category)
    }
    form.setFieldsValue(resolved.values)
    setCustomerFilters(resolved.customerFilters)
    setFavoriteIds(resolved.favoriteIds)
    // `?? null` so applying a fixed preset clears any formula left from an index preset.
    setIndexPricingData(resolved.indexPricingData ?? null)
    if (resolved.productId != null) {
      formulaForm.setFieldsValue({
        ProductId: String(resolved.productId),
        LocationId: resolved.locationId != null ? String(resolved.locationId) : undefined,
      })
    }
    setSelectedPresetId(presetId)
    setPresetState('populated')
    setPresetApplyToken((t) => t + 1)
    // applyingPresetRef stays true until the apply cascade settles — it's cleared in the
    // presetApplyToken effect below (after the customer grid re-selection + the formula
    // auto-commit re-write), so none of those imperative writes are misread as a user edit
    // by the dirty-tracking effect.
  }

  // Product/volume/formula resolve from the form values the preset writes, and the customer grid
  // now re-selects reactively in CustomerTabsBin once CounterPartyIds is filled. So all the
  // orchestrator does here is hold the dirty-guard across the apply cascade (form writes + the
  // formula auto-commit + the grid's selection echo), then release it so genuine edits afterward
  // correctly flip the offer to "dirty".
  useEffect(() => {
    if (!presetApplyToken) return
    const t = window.setTimeout(() => {
      applyingPresetRef.current = false
    }, 300)
    return () => window.clearTimeout(t)
  }, [presetApplyToken])

  // Any genuine edit to a preset-applied offer — product, volume, customers, or formula — flips it
  // to "dirty" so the Update / Save-as-new buttons appear. The formula, customers and product are
  // written via imperative setFieldsValue, which DOESN'T fire the Form's onValuesChange, so we
  // watch the resolved values directly. Suppressed while a preset is still applying (the cascade
  // writes all of these) and a no-op while 'none' (from-scratch) or after save.
  useEffect(() => {
    if (applyingPresetRef.current) return
    setPresetState((s) => (s === 'populated' || s === 'updated' ? 'dirty' : s))
  }, [productLocation, totalVolume, reservePrice, targetCustomers, indexPricingData, customerFilters, favoriteIds])

  // What a save/update snapshots from the live offer — the step-one bundle Reece's model captures,
  // incl. which customer filter toggles are on (so applying the preset restores his working view).
  const presetSnapshot = (): Partial<OfferPreset> => ({
    pricing,
    totalVolume: typeof totalVolume === 'number' ? totalVolume : undefined,
    customerCount: Array.isArray(targetCustomers) ? targetCustomers.length : undefined,
    counterPartyIds: Array.isArray(targetCustomers) ? [...targetCustomers] : undefined,
    favoriteIds: [...favoriteIds],
    fixedPrice: pricing === 'fixed' ? reservePrice : undefined,
    customerFilters,
  })

  const handleUpdatePreset = () => {
    setPresets((prev) => prev.map((p) => (p.id === selectedPresetId ? { ...p, ...presetSnapshot() } : p)))
    setPresetState('updated')
  }
  const handleSaveAsNew = (name: string) => {
    const id = `custom-${name.toLowerCase().replace(/\s+/g, '-')}`
    setPresets((prev) => [...prev, { id, name, description: 'Saved preset', pricing, ...presetSnapshot() }])
    setSelectedPresetId(id)
    setPresetState('updated')
  }

  // Presets are scoped to a pricing mechanism — only index presets show under Index, fixed under
  // Fixed. Switching the toggle swaps the list.
  const visiblePresets = presets.filter((p) => p.pricing === pricing)

  const handlePricingChange = (next: DealPricing) => {
    setPricing(next)
    // Clear a now-mismatched preset selection so the dropdown can't show a stale cross-type preset.
    const sel = presets.find((p) => p.id === selectedPresetId)
    if (sel && sel.pricing !== next) applyPreset(undefined)
    // Swap the underlying template so the payload SpecialOfferTemplateId + the preview tile label
    // reflect the mechanism ("Special" for fixed, "Index Special" for index).
    const template = next === 'fixed' ? pickFixedSpecialTemplate(metadata) : pickIndexSpecialTemplate(metadata)
    if (template?.SpecialOfferTemplateId) {
      setSelectedTemplateId(template.SpecialOfferTemplateId)
      setSelectedCategory(template.CategoryType ?? undefined)
      form.setFieldsValue({ SpecialOfferTemplateId: template.SpecialOfferTemplateId })
    }
    // Discard the other mechanism's pricing data (product / volume / customers persist across the toggle).
    if (next === 'fixed') {
      setIndexPricingData(null)
      formulaForm.resetFields()
    } else {
      form.setFieldsValue({ ReservePrice: undefined })
    }
  }

  // Full setup now navigates WITHIN this drawer (chromeless wizard view), not a second drawer.
  const handleFullSetup = () => {
    setFullSetupCarry({
      values: form.getFieldsValue(true),
      templateId: selectedTemplateId,
      category: selectedCategory,
      productSetupId: firstSetupId,
      counterPartyIds: form.getFieldValue('CounterPartyIds') || [],
      indexPricingData,
    })
    setView('fullSetup')
  }

  // ---- Step navigation -----------------------------------------------------
  const validateStepOne = () => {
    form
      .validateFields(['ProductLocation'])
      .then(() => {
        const fields = (isIndexPricing ? step1Fields.concat('IndexPrice') : step1Fields).concat('CounterPartyIds')
        form
          .validateFields(fields)
          .then(() => {
            setShowIndexError(false)
            setCurrentStep(1)
          })
          .catch(({ errorFields }) => {
            if (errorFields?.length && isIndexPricing) {
              setShowIndexError(!!errorFields.find((f) => f.name[0] === 'IndexPrice'))
            }
          })
      })
      .catch(() => {})
  }

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

  // ---- Submit --------------------------------------------------------------
  const buildSummary = (values: any): OfferSummaryRow[] => {
    const pl = metadata?.ProductLocationSelections?.find((p) => p.TradeEntrySetupId === firstSetupId)
    const rows: OfferSummaryRow[] = []
    if (pl) rows.push({ label: 'Product · location', value: `${pl.ProductName} · ${pl.LocationName}` })
    if (values.TotalVolume)
      rows.push({ label: 'Total volume', value: `${addCommasToNumber(values.TotalVolume)} ${pl?.UnitOfMeasureSymbol ?? 'gal'}` })
    const cpCount = (values.CounterPartyIds || []).length
    rows.push({ label: 'Customers', value: `${cpCount} selected` })
    if (indexPricingData?.PricingDisplayText)
      rows.push({ label: 'Price formula', value: indexPricingData.PricingDisplayText })
    if (!isIndexPricing && values.ReservePrice != null)
      rows.push({
        label: 'Offer price',
        value: formatPricePerUnit(values.ReservePrice, {
          currencyName: pl?.CurrencySymbol,
          uomSymbol: pl?.UnitOfMeasureSymbol,
        }),
      })
    return rows
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
      setSummaryRows(buildSummary(values))
      setSent(true)
      setFinished(false)
    } catch {
      setFinished(false)
    }
  }

  const onFinishFailed = (errorInfo: any) => {
    setFinished(false)
    const errors = errorInfo.errorFields.map((f: any) => f.errors[0])
    NotificationMessage('Failed to create offer', errors, true)
  }

  const handleSaveAsPresetAfterSend = (name: string) => {
    const id = `custom-${name.toLowerCase().replace(/\s+/g, '-')}`
    setPresets((prev) => [...prev, { id, name, description: 'Saved from a sent offer', pricing, ...presetSnapshot() }])
  }

  return (
    <Drawer
      className={'qc-drawer'}
      width={'100%'}
      height={'100%'}
      open={isOpen}
      onClose={clearAndClose}
      title={'Create New Offer'}
      styles={{ body: { backgroundColor: 'var(--bg-2)' } }}
      placement={'bottom'}
      destroyOnHidden
    >
      {/* Offer + Send views — kept mounted (hidden) during the customer picker so state persists. */}
      {view !== 'fullSetup' && (
      <div style={{ display: view === 'offer' ? 'block' : 'none', height: '100%' }}>
      {sent ? (
        <Vertical style={{ maxWidth: 760, margin: '0 auto', width: '100%', height: '100%' }}>
          <OfferSent
            summaryRows={summaryRows}
            presetExistingNames={presets.map((p) => p.name)}
            startedFromPreset={!!selectedPresetId}
            onSaveAsPreset={handleSaveAsPresetAfterSend}
            onNewOffer={() => {
              setSent(false)
              setCurrentStep(0)
              form.resetFields()
              formulaForm.resetFields()
              setPricing('index')
              setIndexPricingData(null)
              setSelectedPresetId(undefined)
              setPresetState('none')
              setCustomerFilters(DEFAULT_CUSTOMER_FILTERS)
              seedIndexTemplateDefaults()
              applyTimingDefaults()
            }}
            onViewOffers={clearAndClose}
          />
        </Vertical>
      ) : (
        <Form
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout='vertical'
        >
          <Vertical style={{ maxWidth: 1680, margin: '0 auto', width: '100%', height: '100%', gap: 16, overflow: 'visible' }}>
            {/* overflow:visible on this row + its parent lets the sticky preview rail below
                stick to the drawer-body scroller (excalibrr Horizontal/Vertical clip by default). */}
            <Horizontal style={{ gap: 20, alignItems: 'flex-start', flexWrap: 'wrap', width: '100%', overflow: 'visible' }}>
              <Vertical style={{ flex: '1 1 720px', minWidth: 0, gap: 16 }}>
            <Vertical className={'qc-offer-tile bg-1 border-radius-10 bordered pb-4'}>
              <Vertical className={'p-4'} style={{ gap: 16 }}>
                <Texto category={'h4'} className={'text-24'}>
                  Create New Offer - Quick Set Up
                </Texto>
                {/* Deal type — index vs fixed pricing; filters which presets are available below. */}
                <Vertical style={{ gap: 4 }}>
                  <Texto category={'label'} weight={'bold'}>
                    Deal type
                  </Texto>
                  <Segmented
                    style={{ alignSelf: 'flex-start' }}
                    value={pricing}
                    onChange={(v) => handlePricingChange(v as DealPricing)}
                    options={[
                      { label: 'Index', value: 'index' },
                      { label: 'Fixed', value: 'fixed' },
                    ]}
                  />
                </Vertical>
              </Vertical>

              <div className={'qc-stepper'}>
                <StepIndicator currentStep={currentStep} steps={QUICK_STEPS} />
              </div>

              {/* Preset control sits in the Product & volume section, as a gray box to the left of
                  the product fields (only on the offer-details step). */}
              <QuickProductSelect
                metadata={metadata}
                dealType={selectedTemplateId}
                form={form}
                formulaForm={formulaForm}
                isActive={currentStep === 0}
                presetSlot={
                  currentStep === 0 ? (
                    <PresetBar
                      presets={visiblePresets}
                      selectedPresetId={selectedPresetId}
                      presetState={presetState}
                      onSelectPreset={applyPreset}
                      onUpdatePreset={handleUpdatePreset}
                      onSaveAsNew={handleSaveAsNew}
                      existingNames={presets.map((p) => p.name)}
                      canSaveFromScratch={hasOfferContent}
                    />
                  ) : undefined
                }
              />

              {isIndexPricing ? (
                <QuickIndexPrice
                  metadata={metadata}
                  formulaForm={formulaForm}
                  offerForm={form}
                  savedIndexData={indexPricingData}
                  onSaveIndexPricing={setIndexPricingData}
                  selectedSetupId={firstSetupId}
                  isActive={currentStep === 0}
                  showIndexError={showIndexError}
                  setShowIndexError={setShowIndexError}
                />
              ) : (
                <QuickFixedPrice
                  uomSymbol={productLocationSelection?.UnitOfMeasureSymbol}
                  currencySymbol={productLocationSelection?.CurrencySymbol}
                  isActive={currentStep === 0}
                />
              )}
              <Form.Item
                name='IndexPrice'
                style={{ display: 'none' }}
                rules={[
                  {
                    validator: (_field, value) =>
                      !value && isIndexPricing ? Promise.reject('Index Price is required') : Promise.resolve(),
                  },
                ]}
              >
                <div />
              </Form.Item>

              <CustomerTabsBin
                form={form}
                isActive={currentStep === 0}
                metadata={metadata}
                gridRef={customerGridRef}
                selectedProductId={selectedProductId}
                selectedLocationId={selectedLocationId}
                onOpenFullPicker={() => setCustomerMaxView(true)}
                favoriteIds={favoriteIds}
                favoritesRef={favoritesRef}
                onToggleFavorite={toggleFavorite}
                customerFilters={customerFilters}
                onChangeFilters={setCustomerFilters}
              />

              {currentStep === 1 && <TimeframeQuickPicker form={form} validTimeZones={metadata?.ValidTimeZoneIds} />}

              <SelectTimingWindows
                form={form}
                currentStep={currentStep}
                selectedPickupWindowEnd={selectedPickupWindowEnd}
                selectedPickupWindowStart={selectedPickupWindowStart}
                selectedVisibilityWindowEnd={selectedVisibilityWindowEnd}
                selectedVisibilityWindowStart={selectedVisibilityWindowStart}
                selectedVisibilityWindowStartTime={selectedVisibilityWindowStartTime}
                validTimeZones={metadata?.ValidTimeZoneIds}
                onSetToFutureTime={handleSetToFutureTime}
                calendarClickRef={calendarClickRef}
                calendarDate={calendarDate}
                setCalendarDate={setCalendarDate}
                variant={'quick'}
                isActive={currentStep === 1}
                windowInputsActive={timeframeChoice === 'custom'}
              />
            </Vertical>

            <Footer
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              validateFormAndNavigate={validateStepOne}
              form={form}
              finished={finished}
              setFinished={setFinished}
              steps={QUICK_STEPS}
              submitLabel={'Send offer'}
            />
              </Vertical>

              {/* Live "what customers will see" rail — the lo-fi preview tiles, updating as
                  product/volume, formula, customers and timing are selected. */}
              <Vertical
                className={'qc-preview-rail bg-1 border-radius-10 bordered p-4'}
                style={{ flex: '0 0 340px', position: 'sticky', top: 0, alignSelf: 'flex-start' }}
              >
                <PreviewPanel
                  dealType={selectedTemplateId}
                  productLocation={
                    Array.isArray(productLocation)
                      ? productLocation
                      : productLocation != null
                        ? [productLocation]
                        : undefined
                  }
                  metadata={metadata}
                  totalVolume={totalVolume}
                  targetCustomers={targetCustomers}
                  selectedPickupWindowEnd={selectedPickupWindowEnd}
                  selectedPickupWindowStart={selectedPickupWindowStart}
                  selectedVisibilityWindowEnd={selectedVisibilityWindowEnd}
                  selectedVisibilityWindowStart={selectedVisibilityWindowStart}
                  form={form}
                  isIndexPricing={isIndexPricing}
                  indexPricingData={indexPricingData}
                  pricingStrategy={pricing === 'fixed' ? reservePrice : undefined}
                  isAuction={false}
                  subtitle={
                    <Horizontal verticalCenter style={{ gap: 4, flexWrap: 'wrap' }}>
                      <Texto className={'text-14 text-medium'}>Need more control?</Texto>
                      <GraviButton
                        className={'ghost-gravi-button qc-link-btn p-0'}
                        buttonText={'Switch to full setup'}
                        onClick={handleFullSetup}
                      />
                    </Horizontal>
                  }
                />
              </Vertical>
            </Horizontal>

            <Form.Item hidden name='SpecialOfferTemplateId'>
              <div />
            </Form.Item>
          </Vertical>
        </Form>
      )}
      </div>
      )}

      {/* Max-view customer picker — the SAME picker "blown out to full screen" (Command Center
          expand pattern): a 95vw modal whose grid fills the height. Same form / favorites / filters
          as the tight in-drawer instance, so selections are live and carry straight back. */}
      <Modal
        className={'qc-drawer'}
        open={customerMaxView}
        onCancel={() => setCustomerMaxView(false)}
        title={'All customers'}
        width={'95vw'}
        centered
        destroyOnClose
        footer={[
          <GraviButton
            key={'use'}
            theme1
            buttonText={'Use selection'}
            onClick={() => setCustomerMaxView(false)}
          />,
        ]}
        bodyStyle={{ padding: 0, maxHeight: '86vh', overflowY: 'auto' }}
      >
        <CustomerTabsBin
          variant={'all'}
          form={form}
          isActive={customerMaxView}
          metadata={metadata}
          gridRef={allCustomerGridRef}
          selectedProductId={selectedProductId}
          selectedLocationId={selectedLocationId}
          favoriteIds={favoriteIds}
          favoritesRef={favoritesRef}
          onToggleFavorite={toggleFavorite}
          customerFilters={customerFilters}
          onChangeFilters={setCustomerFilters}
        />
      </Modal>

      {/* In-drawer full setup — the 4-step wizard rendered chromeless (no second drawer). */}
      {view === 'fullSetup' && (
        <CreateNewSpecialOffer
          renderChromeless
          isShowingCreateNew
          setIsShowingCreateNew={() => {}}
          initialPrefill={fullSetupCarry}
          metadata={metadata}
          onClose={clearAndClose}
        />
      )}
    </Drawer>
  )
}
