import { addCommasToNumber, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { SectionHeader } from '@modules/Dashboard/SpecialOffers/Components/QuickCreate/Components/SectionHeader'
import type { SpecialOfferMetadataResponseData } from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { volumeInputList } from '@modules/Dashboard/SpecialOffers/utils/Constants/FormConstants'
import type { FormInstance } from 'antd'
import { Checkbox, Form, InputNumber, Select } from 'antd'
import { useMemo, useState, type ReactNode } from 'react'

interface QuickProductSelectProps {
  metadata?: SpecialOfferMetadataResponseData
  /** Selected Index-Special template id, used to scope the product list (same as the wizard grid). */
  dealType?: number
  form: FormInstance
  formulaForm: FormInstance
  isActive: boolean
  /** Gray preset box rendered to the left of the product fields (offer-details step only). */
  presetSlot?: ReactNode
}

/**
 * Quick-create product picker — three dropdowns (Product / Terminal / Volume) in place of the
 * 4-step wizard's AG-Grid picker + volume-config. The "quick" part: pick a product+terminal and a
 * total volume and move on. Resolves to the same `ProductLocation` (TradeEntrySetupId) the grid
 * produced, so customer authorization, the formula filter, and the payload all keep working.
 * Per-order Min/Max/Increment are seeded from the template at open and surfaced read-only under the
 * volume input — the template's governing constraints (hidden before; Reece wants them visible).
 * An "Override per-order limits for this offer" checkbox reveals editable fields (this deal only —
 * the template defaults are never edited from here).
 */
export function QuickProductSelect({ metadata, dealType, form, formulaForm, isActive, presetSlot }: QuickProductSelectProps) {
  const productLocationValue = Form.useWatch('ProductLocation', form)
  const currentSetupId = Array.isArray(productLocationValue) ? productLocationValue[0] : productLocationValue

  // The active template governs both the product scope and the per-order volume constraints.
  const selectedTemplate = useMemo(
    () => metadata?.SpecialOfferTemplates?.find((t) => t.SpecialOfferTemplateId === dealType),
    [metadata?.SpecialOfferTemplates, dealType]
  )
  // Template-governed per-order constraint defaults — the read-only reference shown under the input.
  const minVol = selectedTemplate?.DefaultMinimumVolumePerOrder
  const maxVol = selectedTemplate?.DefaultMaximumVolumePerOrder
  const incrVol = selectedTemplate?.DefaultVolumeIncrement

  // Override the per-order limits for THIS offer only (template defaults untouched). Progressive
  // disclosure: hidden until the rep opts in (mirrors PricingDisplaySection's custom-name checkbox).
  const [overrideLimits, setOverrideLimits] = useState(false)
  // Watched overrides — undefined until the override Form.Items mount, so fall back to the default.
  const wMin = Form.useWatch('MinimumVolumePerOrder', form) as number | undefined
  const wMax = Form.useWatch('MaximumVolumePerOrder', form) as number | undefined
  const wIncr = Form.useWatch('VolumeIncrement', form) as number | undefined
  const effMin = overrideLimits ? wMin ?? minVol : minVol
  const effMax = overrideLimits ? wMax ?? maxVol : maxVol
  const effIncr = overrideLimits ? wIncr ?? incrVol : incrVol

  const handleToggleOverride = (checked: boolean) => {
    setOverrideLimits(checked)
    // On check: seed the editable fields from the template defaults. On uncheck: revert any
    // override back to the defaults (the form value is what flows to the payload either way).
    form.setFieldsValue({
      MinimumVolumePerOrder: minVol,
      MaximumVolumePerOrder: maxVol,
      VolumeIncrement: incrVol,
    })
  }

  // Scope to the selected template's instrument (mirrors SelectProductAndLocation.filteredProductLocations).
  const filteredPLs = useMemo(() => {
    const pls = metadata?.ProductLocationSelections ?? []
    if (!selectedTemplate) return pls
    return pls.filter((pl) => pl.MarketPlatformInstrumentId === selectedTemplate.MarketPlatformInstrumentId)
  }, [metadata?.ProductLocationSelections, selectedTemplate])

  const currentSetup = useMemo(
    () => filteredPLs.find((pl) => pl.TradeEntrySetupId === currentSetupId),
    [filteredPLs, currentSetupId]
  )

  // Local product hold so the Terminal list can populate before a full setup (product+location) exists.
  const [pendingProductId, setPendingProductId] = useState<number>()
  const effectiveProductId = pendingProductId ?? currentSetup?.ProductId

  const productOptions = useMemo(() => {
    const seen = new Map<number, string>()
    filteredPLs.forEach((pl) => {
      if (pl.ProductId != null && !seen.has(pl.ProductId)) seen.set(pl.ProductId, pl.ProductName ?? `Product ${pl.ProductId}`)
    })
    return Array.from(seen, ([value, label]) => ({ value, label }))
  }, [filteredPLs])

  const terminalOptions = useMemo(
    () =>
      filteredPLs
        .filter((pl) => pl.ProductId === effectiveProductId)
        .map((pl) => ({ value: pl.TradeEntrySetupId, label: pl.LocationName ?? `Terminal ${pl.LocationId}` })),
    [filteredPLs, effectiveProductId]
  )

  const uom = currentSetup?.UnitOfMeasureSymbol ?? defaultUnitOfMeasureSymbol

  const onProductChange = (productId: number) => {
    setPendingProductId(productId)
    // Clear any previously-resolved setup so the terminal must be re-picked for the new product.
    form.setFieldsValue({ ProductLocation: undefined })
  }

  const onTerminalChange = (setupId: number) => {
    const setup = filteredPLs.find((pl) => pl.TradeEntrySetupId === setupId)
    form.setFieldsValue({ ProductLocation: [setupId], TimeZoneId: setup?.TimeZoneId ?? undefined })
    if (setup) {
      formulaForm.setFieldsValue({
        ProductId: setup.ProductId?.toString(),
        LocationId: setup.LocationId?.toString(),
      })
    }
  }

  return (
    <Vertical className={'qc-section p-4'} style={{ display: isActive ? 'flex' : 'none', gap: 16 }}>
      <SectionHeader title={'Product & volume'} />
      <Horizontal style={{ gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {presetSlot && <div style={{ flex: '0 0 280px' }}>{presetSlot}</div>}
        <div className={'qc-field-grid'} style={{ flex: '1 1 auto', minWidth: 0 }}>
        <Vertical style={{ gap: 4 }}>
          <Texto category={'label'} weight={'bold'}>
            Product
          </Texto>
          <Select
            style={{ width: '100%' }}
            placeholder={'Select product…'}
            value={effectiveProductId ?? undefined}
            options={productOptions}
            showSearch
            optionFilterProp={'label'}
            onChange={onProductChange}
            popupClassName={'qc-pop'}
          />
        </Vertical>

        <Vertical style={{ gap: 4 }}>
          <Texto category={'label'} weight={'bold'}>
            Terminal / location
          </Texto>
          <Select
            style={{ width: '100%' }}
            placeholder={'Select terminal…'}
            value={currentSetupId ?? undefined}
            options={terminalOptions}
            disabled={effectiveProductId == null}
            showSearch
            optionFilterProp={'label'}
            onChange={onTerminalChange}
            popupClassName={'qc-pop'}
          />
        </Vertical>

        <Vertical style={{ gap: 4 }}>
          <Texto category={'label'} weight={'bold'}>
            Volume ({uom})
          </Texto>
          <Form.Item
            name={'TotalVolume'}
            style={{ marginBottom: 0 }}
            rules={[{ validator: (_f, v) => (!v || v <= 0 ? Promise.reject('Volume is required') : Promise.resolve()) }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              precision={0}
              placeholder={'e.g. 42,000'}
              formatter={(value) => (parseFloat(value as string) ? addCommasToNumber(parseFloat(value as string)) : (value as string))}
              parser={(value) => value?.replace(/(,*)/g, '') as unknown as number}
            />
          </Form.Item>
          {(effMin != null || effMax != null || effIncr != null) && (
            <Texto className={'text-12 text-medium'}>
              {[
                effMin != null ? `Min ${addCommasToNumber(effMin)}` : null,
                effMax != null ? `Max ${addCommasToNumber(effMax)}` : null,
                effIncr != null ? `Increments of ${addCommasToNumber(effIncr)}` : null,
              ]
                .filter(Boolean)
                .join(' · ')}{' '}
              {uom}
            </Texto>
          )}
          {/* Override the per-order limits for this offer only — sits under the limits caption for
              context; the editable fields reveal full-width below the grid when checked. */}
          <Checkbox
            style={{ marginTop: 2 }}
            checked={overrideLimits}
            onChange={(e) => handleToggleOverride(e.target.checked)}
          >
            Override per-order limits for this offer
          </Checkbox>
        </Vertical>
        </div>
      </Horizontal>

      {overrideLimits && (
        <Horizontal style={{ gap: 16, flexWrap: 'wrap' }}>
          {volumeInputList.map((item) => (
            <Vertical key={item.name} style={{ flex: 1, gap: 4, minWidth: 160 }}>
              <Texto category={'label'} weight={'bold'}>
                {item.title}
              </Texto>
              <Form.Item
                name={item.name}
                style={{ marginBottom: 0 }}
                rules={[{ validator: (field, value) => item.validator(field, value, form) }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  precision={0}
                  formatter={(value) =>
                    parseFloat(value as string) ? addCommasToNumber(parseFloat(value as string)) : (value as string)
                  }
                  parser={(value) => value?.replace(/(,*)/g, '') as unknown as number}
                />
              </Form.Item>
            </Vertical>
          ))}
        </Horizontal>
      )}

      {/* Keeps the required ProductLocation gate the wizard relied on. */}
      <Form.Item name={'ProductLocation'} hidden rules={[{ required: true, message: 'Product is required' }]}>
        <div />
      </Form.Item>
    </Vertical>
  )
}
