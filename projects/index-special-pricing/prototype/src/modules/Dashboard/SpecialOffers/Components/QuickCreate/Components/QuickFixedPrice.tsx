import { Texto, Vertical } from '@gravitate-js/excalibrr'
import { SectionHeader } from '@modules/Dashboard/SpecialOffers/Components/QuickCreate/Components/SectionHeader'
import { Form, InputNumber } from 'antd'

interface QuickFixedPriceProps {
  uomSymbol?: string
  currencySymbol?: string
  /** Hidden on Step 2 (kept mounted so the ReservePrice field stays registered). */
  isActive: boolean
}

/**
 * Fixed-pricing section for quick-create — the counterpart to QuickIndexPrice. A single flat
 * "Offer price" input (field name `ReservePrice` → payload `FixedPrice`), styled to match the
 * other quick-create sections: shared SectionHeader + a bold `category='label'` field label +
 * a content-width input (not stretched). No selling subtitle — the header says it all.
 */
export function QuickFixedPrice({ uomSymbol, currencySymbol, isActive }: QuickFixedPriceProps) {
  const uom = uomSymbol ?? defaultUnitOfMeasureSymbol
  return (
    <Vertical className={'qc-section p-4'} style={{ display: isActive ? undefined : 'none', gap: 16 }}>
      <SectionHeader title={'Fixed price'} />
      <Vertical style={{ gap: 4 }}>
        <Texto category={'label'} weight={'bold'}>
          Offer price{uom ? ` (per ${uom})` : ''}
        </Texto>
        <Form.Item name={'ReservePrice'} rules={[{ required: true, message: 'Price is required' }]} style={{ marginBottom: 0 }}>
          <InputNumber
            min={0.0001}
            max={999}
            precision={fmt.currentPrecision}
            prefix={currencySymbol ?? defaultCurrencySymbol}
            className={'border-radius-5'}
            style={{ width: 240 }}
          />
        </Form.Item>
      </Vertical>
    </Vertical>
  )
}
