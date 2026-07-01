import { ApartmentOutlined, EnvironmentOutlined, UserSwitchOutlined } from '@ant-design/icons'
import { useNetOrGrossTyped } from '@api/useNetGross/useNetGrossTyped'
import { FormulaStatusSpinner } from '@components/shared/Formulas/FormulaEditor/components/StatusLoader'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { getIcon } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/QuoteRows/components/Grid/columns/util'
import { Divider, Popover } from 'antd'
import React, { useState } from 'react'

export function NetGrossDefaultRenderer({ value, data }) {
  const [popoverVisible, setPopoverVisible] = useState(false)
  const hasDefaultRule = !!data.DefaultNetOrGrossCvId
  const hasRuleApplied = !!data.NetOrGrossCvId
  const isOverridden =
    hasDefaultRule && hasRuleApplied && data?.NetOrGrossCvId?.toString() !== data?.DefaultNetOrGrossCvId?.toString()

  const { useNetGrossGetDefault } = useNetOrGrossTyped()
  const query = useNetGrossGetDefault(data, { enabled: popoverVisible && hasDefaultRule })

  return (
    <Horizontal
      verticalCenter
      style={{
        gap: 10,
      }}
    >
      <Popover
        overlayClassName='quoterow-rule-popover'
        trigger='hover'
        placement='bottom'
        open={popoverVisible && hasDefaultRule}
        onOpenChange={(open) => setPopoverVisible(open)}
        content={() => {
          return (
            <Vertical style={{ minWidth: 400 }}>
              {query.isFetching || query.isLoading ? (
                <Vertical justifyContent='center' alignItems='center' className='p-3' style={{ minHeight: 300 }}>
                  <div>
                    <Texto align='center'>Loading Rules</Texto>
                    <FormulaStatusSpinner />
                  </div>
                </Vertical>
              ) : (
                <>
                  <Horizontal alignItems='center' justifyContent='space-between' className='p-3'>
                    <Texto>NET / GROSS:</Texto>
                    <Horizontal gap='0.35rem'>
                      <span>{getIcon(data?.NetOrGrossCvId, value, data?.DefaultNetOrGrossCvId)}</span>
                      <Texto>{value}</Texto>
                    </Horizontal>
                  </Horizontal>
                  <Horizontal className={`${isOverridden ? `bg-warning-dim` : `bg-success-dim`} p-3`}>
                    <Texto>
                      This quote row has {isOverridden ? 'updated to override' : 'matched with'} the following net /
                      gross rule:
                    </Texto>
                  </Horizontal>
                  <Horizontal justifyContent='space-between' className='p-3'>
                    <Texto>Rule #</Texto>
                    <Texto category='p2'>{query.data?.NetGrossDefault?.Order}</Texto>
                  </Horizontal>
                  <Divider className='m-1' />
                  <Horizontal className='p-3'>
                    <Texto appearance='medium'>Matching Data</Texto>
                  </Horizontal>
                  <Horizontal
                    justifyContent='space-between'
                    style={{ borderBottom: '1px solid var(--gray-200)' }}
                    className='p-3'
                  >
                    <Horizontal gap='0.25rem' alignItems='center'>
                      <EnvironmentOutlined />
                      <Texto weight='bold'>Location</Texto>
                    </Horizontal>
                    <Texto>{query.data?.NetGrossDefault?.Location || 'ANY'}</Texto>
                  </Horizontal>
                  <Horizontal
                    justifyContent='space-between'
                    style={{ borderBottom: '1px solid var(--gray-200)' }}
                    className='p-3'
                  >
                    <Horizontal gap='0.25rem' alignItems='center'>
                      <ApartmentOutlined />
                      <Texto weight='bold'> Product</Texto>
                    </Horizontal>
                    <Texto>{query.data?.NetGrossDefault?.QuoteConfiguration || 'ANY'}</Texto>
                  </Horizontal>
                  <Horizontal
                    justifyContent='space-between'
                    style={{ borderBottom: '1px solid var(--gray-200)' }}
                    className='p-3'
                  >
                    <Horizontal gap='0.25rem' alignItems='center'>
                      <UserSwitchOutlined />
                      <Texto weight='bold'>Counterparty</Texto>
                    </Horizontal>
                    <Texto>{query.data?.NetGrossDefault?.CounterParty || 'ANY'}</Texto>
                  </Horizontal>
                </>
              )}
            </Vertical>
          )
        }}
      >
        <div className='p-4' style={{ display: 'flex', gap: 10, verticalAlign: 'center', width: '100%' }}>
          <Texto>{getIcon(data?.NetOrGrossCvId, value, data?.DefaultNetOrGrossCvId)}</Texto>
          <Texto category='p2'>{value}</Texto>
        </div>
      </Popover>
    </Horizontal>
  )
}
