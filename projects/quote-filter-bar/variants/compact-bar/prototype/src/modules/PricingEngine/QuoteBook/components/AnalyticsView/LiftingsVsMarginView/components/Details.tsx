import { CopyOutlined } from '@ant-design/icons'
import { DetailDataDTO } from '@api/useQuoteBookAnalytics/response'
import { addCommasToNumber } from '@gravitate-js/excalibrr'
import { Button, message, Table } from 'antd'
import classNames from 'classnames'
import React from 'react'

interface LiftingVsMarginDetailsProps {
  details: DetailDataDTO[]
  selected?: string | null
  onSelect?: (date: string) => void
}

function LiftingVsMarginDetails({ details, selected, onSelect }: LiftingVsMarginDetailsProps) {
  const handleCopy = () => {
    const tableData = details.map((row) => [row.Date, row.Margin.toFixed(4), row.Volume.toLocaleString()].join('\t'))
    const tableHeader = ['Date', 'Margin', 'Volume'].join('\t')
    const clipboardData = [tableHeader, ...tableData].join('\n')

    navigator.clipboard.writeText(clipboardData).then(
      () => {
        message.success('Table copied to clipboard')
      },
      () => {
        message.error('Failed to copy table')
      }
    )
  }
  const columnWidth = 40
  const columns = [
    {
      title: 'Date',
      dataIndex: 'Date',
      key: 'date',
      width: columnWidth + 20,
      render: (value: string) => value,
    },
    {
      title: 'Margin',
      dataIndex: 'Margin',
      key: 'margin',
      align: 'right',
      width: columnWidth,
      render: (value: number) => fmt.marginDecimal(value),
    },
    {
      title: 'Volume',
      dataIndex: 'Volume',
      key: 'volume',
      width: columnWidth,
      align: 'right',
      render: (value: number) => addCommasToNumber(value, 0),
    },
    {
      title: (
        <Button
          className='copy-btn'
          icon={<CopyOutlined />}
          onClick={handleCopy}
          style={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}
          type='text'
        />
      ),
      dataIndex: '',
      key: '',
      align: 'right',
      width: 10,
    },
  ]

  return (
    <div style={{ overflowY: 'auto', position: 'relative' }}>
      <Table
        sticky
        showHeader
        columns={columns}
        dataSource={details}
        pagination={false}
        rowKey={(record) => record.Date}
        rowClassName={(record) => classNames({ 'ant-table-row-selected': record.Date === selected })}
        onRow={(record) => ({
          onClick: () => onSelect && onSelect(record.Date),
        })}
      />
    </div>
  )
}

LiftingVsMarginDetails.defaultProps = {
  selected: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onSelect: () => {},
}

export { LiftingVsMarginDetails }
