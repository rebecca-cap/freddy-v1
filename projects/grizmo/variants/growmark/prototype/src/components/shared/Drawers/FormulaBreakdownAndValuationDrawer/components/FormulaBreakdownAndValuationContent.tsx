import { EnvironmentFilled, ExperimentFilled, LoadingOutlined } from '@ant-design/icons'
import { FormulaBreakdownAndValuationDetail } from '@components/shared/Drawers/FormulaBreakdownAndValuationDrawer/api/schema.type'
import { FormulaEditor } from '@components/shared/Formulas/FormulaEditor'
import { dateFormat } from '@components/TheArmory/helpers'
import { BBDTag, GraviGrid, Horizontal, NothingMessage, Texto, Vertical } from '@gravitate-js/excalibrr'
import { getNumSign } from '@utils/index'
import { Tooltip } from 'antd'
import moment from 'moment'
import React, { useMemo } from 'react'

import { columnDefs } from './columnDefs'

interface CostValuationProps {
  isFetchingData?: boolean
  data?: FormulaBreakdownAndValuationDetail
}

export function FormulaBreakdownAndValuationContent({ isFetchingData, data }: CostValuationProps) {
  const getColumnDefs = useMemo(columnDefs, [])
  const agPropOverrides = useMemo(
    () => ({
      getRowId: (row) => row?.data?.FormulaResultComponentId.toString(),
      suppressDragLeaveHidesColumns: true,
      rowGroupPanelShow: 'never' as const,
    }),
    []
  )
  if (isFetchingData) {
    return (
      <Horizontal fullHeight horizontalCenter verticalCenter>
        <Texto category='h1'>
          <LoadingOutlined />
        </Texto>
      </Horizontal>
    )
  }

  if (!data) {
    return (
      <Horizontal fullHeight horizontalCenter verticalCenter>
        <Texto className='bg-3 p-4' category='h5' style={{ borderRadius: 10 }}>
          <NothingMessage title='' message='No valuation details found' />
        </Texto>
      </Horizontal>
    )
  }

  return (
    <Vertical>
      <Horizontal className='p-4 bg-2 bordered'>
        <Vertical flex={5} style={{ gap: 10 }}>
          <Horizontal verticalCenter>
            <Tooltip title='Product'>
              <BBDTag className='py-1' style={{ whiteSpace: 'normal' }} success>
                <Horizontal verticalCenter>
                  <ExperimentFilled
                    style={{
                      marginRight: 5,
                      fontSize: 12,
                      color: 'var(--theme-color-2)',
                    }}
                  />
                  <Texto category='h6'>{data?.ForProductName}</Texto>
                </Horizontal>
              </BBDTag>
            </Tooltip>
            <Texto category='h5' className='mr-2'>
              @
            </Texto>
            <Tooltip title='Location'>
              <BBDTag className='py-1' success>
                <Horizontal verticalCenter>
                  <EnvironmentFilled
                    style={{
                      marginRight: 5,
                      fontSize: 12,
                      color: 'var(--theme-color-2)',
                    }}
                  />
                  <Texto category='h6'>{data?.ForLocationName}</Texto>
                </Horizontal>
              </BBDTag>
            </Tooltip>
          </Horizontal>
          <Horizontal verticalCenter>
            <Texto className='mr-3 mt-1'>COUNTERPARTY: </Texto>
            <Texto category='h6'>{data?.ForCounterPartyName}</Texto>
          </Horizontal>
        </Vertical>
        <Vertical flex={2} style={{ gap: 10 }}>
          <Horizontal verticalCenter justifyContent='flex-end'>
            <Texto category='p2' className='px-3'>
              PRICE:
            </Texto>
            <Texto category='h4'>{data && `${getNumSign(data?.Result)}${fmt.currency(data?.Result)}`}</Texto>
          </Horizontal>
          <Horizontal verticalCenter justifyContent='flex-end'>
            <Texto category='p2' className='px-3'>
              AS OF DATE:
            </Texto>
            <Texto category='h6'>{moment(data?.CalculationDate).format(dateFormat.MONTH_DATE_YEAR_TIME)}</Texto>
          </Horizontal>
        </Vertical>
      </Horizontal>
      <Horizontal className='px-4 py-2' verticalCenter>
        <Texto className='mr-4'>Formula Name:</Texto>
        <Texto category='h6'>{data?.CalculationName}</Texto>
      </Horizontal>
      <Horizontal flex={1}>
        <FormulaEditor value={data?.Formula} readOnly />
      </Horizontal>
      <Horizontal flex={7} fullHeight style={{ width: '100%' }}>
        <Vertical>
          <GraviGrid
            controlBarProps={{
              title: 'Variables',
            }}
            agPropOverrides={agPropOverrides}
            rowData={data?.ResultComponents}
            columnDefs={getColumnDefs}
          />
        </Vertical>
      </Horizontal>
    </Vertical>
  )
}
