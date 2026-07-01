import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Switch, Tooltip } from 'antd'

export function FilterSwitch({ title, value, valueSetter, disabled, tooltipTitle }) {
  const handleChange = () => {
    valueSetter(!value)
  }

  return (
    <Horizontal verticalCenter style={{ gap: 10 }}>
      <Texto appearance={value ? 'success' : 'medium'}>{title}</Texto>
      <Tooltip title={tooltipTitle}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Switch checked={value} onChange={handleChange} disabled={disabled} />
        </div>
      </Tooltip>
    </Horizontal>
  )
}
