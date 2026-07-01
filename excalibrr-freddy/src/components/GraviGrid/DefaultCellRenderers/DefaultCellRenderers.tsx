import classNames from 'classnames'
import moment from 'moment'
import { Fragment, ReactNode } from 'react'
import { addCommasToNumber } from '../../../Utils/general'
import { BBDTag } from '../../DataDisplay/BBDTag'
import { Texto, TextoProps } from '../../DataDisplay/Texto/Texto'

import {
  CaretDownFilled,
  CaretUpFilled,
  CheckCircleFilled,
} from '@ant-design/icons'
import { Tooltip } from 'antd'

type TextCellProps = { value: any; toUpperCase: boolean; others: TextoProps }

export const TextCell: React.FC<TextCellProps> = ({
  value,
  toUpperCase,
  ...others
}) => {
  if (!value) return null
  return (
    <Texto
      style={{ textTransform: toUpperCase ? 'uppercase' : 'uppercase' }}
      {...others}
    >
      {value}
    </Texto>
  )
}

type NumberCellProps = {
  value: number
  toFixed: number
  showNA: boolean
  others: TextoProps
}

export const NumberCell: React.FC<NumberCellProps> = ({
  value,
  toFixed = 0,
  showNA,
  ...others
}) => {
  const displayNA = showNA && !value
  return (
    <Texto align='right' {...others}>
      {addCommasToNumber(value, toFixed)}
      {displayNA && 'N/A'}
    </Texto>
  )
}

type SingleDateCellProps = {
  value: Date
  dateFormat: string
  others: TextoProps
}

export const SingleDateCell: React.FC<SingleDateCellProps> = ({
  value,
  dateFormat,
  ...others
}) => (
  <Fragment>
    {value && <Texto {...others}>{moment(value).format(dateFormat)}</Texto>}
  </Fragment>
)

type TagCellProps = {
  value: string
  className: string
  tagTheme: any
  icon: ReactNode
  iconClass: string
  tipTitle: string
}

export const TagCell: React.FC<TagCellProps> = ({
  value,
  className,
  tagTheme,
  icon,
  iconClass,
  tipTitle,
}) => {
  if (!value) return null
  return (
    <Tooltip title={tipTitle}>
      <div>
        <BBDTag
          {...tagTheme}
          className={classNames('text-ellipsis', className)}
        >
          {icon && <div className={iconClass}>{icon}</div>}
          {value}
        </BBDTag>
      </div>
    </Tooltip>
  )
}

type DifferenceCellProps = {
  data: Record<string, number>
  value: number
  comparisonKey: string
  isPercent: boolean
  showCheck: boolean
  upIsError: boolean
}

export const DifferenceCell: React.FC<DifferenceCellProps> = ({
  data,
  value,
  comparisonKey,
  isPercent,
  showCheck,
  upIsError,
}) => {
  const getDiffAppearance = () => {
    if (upIsError) return 'error'
    return data[comparisonKey] > 0 ? 'success' : 'error'
  }
  const DiffDisplay = () => {
    if (showCheck && data[comparisonKey] === 0) {
      return (
        <Texto appearance='success'>
          <CheckCircleFilled className='pl-2' />
        </Texto>
      )
    } else {
      return (
        <Texto category='label' appearance={getDiffAppearance()} weight={600}>
          {data[comparisonKey] > 0 ? (
            <CaretUpFilled className='pl-2' />
          ) : (
            <CaretDownFilled className='pl-2' />
          )}
          {data[comparisonKey] > 0 ? '+' : ''}{' '}
          {data[comparisonKey]?.toLocaleString('en')}
        </Texto>
      )
    }
  }
  if (!value && value !== 0) {
    return (
      <div className='flex items-end justify-end'>
        <Texto appearance='medium'>N/A</Texto>
      </div>
    )
  }
  return (
    <div className='flex items-end justify-end'>
      <Texto category='p2' weight={600}>
        {isPercent
          ? `${(value * 100).toFixed(1)}%`
          : value?.toLocaleString('en')}
      </Texto>
      <DiffDisplay />
    </div>
  )
}

type NetValueCellProps = {
  data: Record<string, number>
  value: number
  precision: number
}

export const NetValueCell: React.FC<NetValueCellProps> = ({
  data,
  value,
  precision = 0,
  ...others
}) => {
  if (!value || value === 0) {
    return (
      <Texto align='right' appearance='medium'>
        N/A
      </Texto>
    )
  }
  return (
    <div className='flex items-end justify-end'>
      <Texto
        {...others}
        weight={600}
        category='p2'
        appearance={value > 0 ? 'success' : 'error'}
      >
        ${addCommasToNumber(value, precision)}
      </Texto>
    </div>
  )
}

type PriceDifferenceCellProps = {
  data: Record<string, number>
  value: number
  precision: number
}

export const PriceDifferenceCell: React.FC<PriceDifferenceCellProps> = ({
  data,
  value,
  precision = 0,
  ...others
}) => {
  if (!value || value === 0) {
    // @ts-ignore - align not recognized
    return <BBDTag align='right'>N/A</BBDTag>
  }
  return (
    <div className='flex items-end justify-end'>
      <BBDTag
        success={!!data.is_best}
        error={!data.is_best}
        {...others}
        // @ts-ignore - weight not recognized
        weight={600}
        category='p2'
      >
        ${addCommasToNumber(value, precision)}{' '}
        <span style={{ fontSize: '0.9em' }}>
          {data.price_difference
            ? `(${data.price_difference?.toFixed(4)})`
            : '(Lowest)'}
        </span>
      </BBDTag>
    </div>
  )
}
