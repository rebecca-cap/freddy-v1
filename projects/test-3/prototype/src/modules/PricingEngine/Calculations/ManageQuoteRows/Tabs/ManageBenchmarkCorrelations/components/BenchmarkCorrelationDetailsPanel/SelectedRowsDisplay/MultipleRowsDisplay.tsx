import '../../styles.css'

import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import {
  BenchmarkCorrelation,
  benchmarkKeyMap,
} from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/api/schema.types'
import { Tooltip } from 'antd'
import React, { useEffect } from 'react'

export interface MultipleRowsDisplayProps {
  updateAssignedBenchmarks: boolean
  selectedRows: BenchmarkCorrelation[]
}

type AssignedBenchmarksInfo = {
  benchmark: string
  count: number
}

export function MultipleRowsDisplay({ updateAssignedBenchmarks, selectedRows }: MultipleRowsDisplayProps) {
  const [assignedBenchmarksInfo, setAssignedBenchmarksInfo] = React.useState<AssignedBenchmarksInfo[]>([])

  const generateAssignedBenchmarks = () => {
    const assignedBenchmarks: AssignedBenchmarksInfo[] = []

    selectedRows.forEach((row) => {
      const benchmarks = Object.values(benchmarkKeyMap)
      benchmarks.forEach((benchmarkKey) => {
        if (row[benchmarkKey]) {
          const existingAssignedBenchmark = assignedBenchmarks.find((ab) => ab.benchmark === row[benchmarkKey].Name)
          if (existingAssignedBenchmark) {
            existingAssignedBenchmark.count += 1
          } else {
            assignedBenchmarks.push({ benchmark: row[benchmarkKey].Name, count: 1 })
          }
        }
      })
    })
    setAssignedBenchmarksInfo(assignedBenchmarks)
  }

  useEffect(() => {
    generateAssignedBenchmarks()
  }, [selectedRows, updateAssignedBenchmarks])

  return (
    <Horizontal verticalCenter className='mx-4 pt-4 px-4'>
      <Vertical className='pb-2' verticalCenter>
        <Texto category='h4'>{selectedRows?.length} Rows Selected</Texto>
        <Horizontal className='mt-2 bg-1 border-rounded bordered px-3 pt-3 rounded border-radius-5'>
          <Vertical>
            <Texto className='pb-2' category='p2' weight={900}>
              Assigned Benchmarks
            </Texto>
            {assignedBenchmarksInfo.map((assignedBenchmark) => {
              return <DisplayRow key={assignedBenchmark?.benchmark} assignedBenchmark={assignedBenchmark} />
            })}
          </Vertical>
        </Horizontal>
      </Vertical>
    </Horizontal>
  )
}

function DisplayRow({ assignedBenchmark }) {
  const [isEllipsis, setIsEllipsis] = React.useState(false)
  const textRef = React.useRef<HTMLSpanElement | null>(null)

  React.useEffect(() => {
    const checkEllipsis = () => {
      if (textRef?.current) {
        setIsEllipsis(textRef.current.scrollWidth > textRef.current.clientWidth)
      }
    }
    checkEllipsis()

    window.addEventListener('resize', checkEllipsis)
    return () => window.removeEventListener('resize', checkEllipsis)
  }, [])

  return (
    <Horizontal className='benchmark-row justify-sb' key={assignedBenchmark?.benchmark}>
      <Tooltip
        className='benchmark-panel-tooltip'
        placement='bottomLeft'
        title={isEllipsis ? assignedBenchmark.benchmark : ''}
        key={assignedBenchmark.benchmark}
        trigger='hover'
      >
        <span ref={textRef} className='benchmark-panel-text' key={assignedBenchmark.benchmark}>
          {assignedBenchmark.benchmark}
        </span>
        <Texto category='p2'>{assignedBenchmark.count} rows</Texto>
      </Tooltip>
    </Horizontal>
  )
}
