// @ts-nocheck
import { Button, Col, InputNumber, Radio, Row } from 'antd'
import { Fragment, useState } from 'react'
import { GraviButton } from '../Controls/Buttons/GraviButton'
import { CheckCard, CheckCardGroup } from '../Controls/Buttons/CheckCardGroup'

/**
 * @deprecated
 * Do not use this component. It has been flagged as 'unused' and will be removed in the future.
 */
export function ViewOptions({
  initialViewOptions,
  applyViewOptions,
  closeSelf,
}) {
  const [viewOptions, setViewOptions] = useState(initialViewOptions)

  return (
    <Fragment>
      <CompareTo
        value={viewOptions.compareTo}
        onChange={(newValue) =>
          setViewOptions({ ...viewOptions, compareTo: newValue })
        }
      />
      <PriceCount
        value={viewOptions.priceLimit}
        onChange={(newValue) =>
          setViewOptions({ ...viewOptions, priceLimit: newValue })
        }
      />
      <GroupBy
        value={viewOptions.groupBy}
        onChange={(newValue) =>
          setViewOptions({ ...viewOptions, groupBy: newValue })
        }
      />
      <ApplyOrCancel
        onClear={() => {
          setViewOptions({ ...initialViewOptions })
          closeSelf()
        }}
        onApply={() => {
          applyViewOptions(viewOptions)
          closeSelf()
        }}
      />
    </Fragment>
  )
}

const CompareTo = ({ value, onChange }) => {
  return (
    <CheckCardGroup header='COMPARE TO'>
      <CheckCard
        label='Low Price'
        value={value.toLowPrice}
        onToggle={() => onChange({ ...value, toLowPrice: !value.toLowPrice })}
      />
      <CheckCard
        label='Low Contract'
        value={value.toContract}
        onToggle={() => onChange({ ...value, toContract: !value.toContract })}
      />
      <CheckCard
        label='Low Inventory'
        value={value.toInventory}
        onToggle={() => onChange({ ...value, toInventory: !value.toInventory })}
      />
    </CheckCardGroup>
  )
}

const PriceCount = ({ value, onChange }) => {
  return (
    <CheckCardGroup header='SHOW ONLY TOP'>
      <div
        style={{ width: '100%' }}
        className='flex-div items-center justify-center p-3'
      >
        <InputNumber
          className='price-limit-input'
          min={0}
          max={10}
          defaultValue={value}
          formData={value}
          onChange={onChange}
        />
        <div className='price-limit-label'>Prices</div>
      </div>
    </CheckCardGroup>
  )
}

const GroupBy = ({ value, onChange }) => {
  return (
    <CheckCardGroup header='GROUP BY'>
      <Radio.Group
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
        }}
      >
        <Row className='p-3'>
          <Col offset={4} span={10}>
            <Radio value='terminal'>Terminal</Radio>
          </Col>
          <Col span={10}>
            <Radio value='city'>City</Radio>
          </Col>
        </Row>
      </Radio.Group>
    </CheckCardGroup>
  )
}

const ApplyOrCancel = ({ onClear, onApply }) => {
  return (
    <Row style={{ marginTop: '4em' }}>
      <Col span={12} offset={12}>
        <Row>
          <Col span={12}>
            <Button onClick={onClear}>Cancel</Button>
          </Col>
          <Col span={12}>
            <GraviButton buttonText='Apply' theme2 onClick={onApply} />
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
