import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Select } from 'antd'
import React, { useEffect, useMemo } from 'react'

export function ChartController({
  benchmarks,
  againstOptions,
  selectedBenchmark,
  setSelectedBenchmark,
  selectedAgainst,
  setSelectedAgainst,
}) {
  const formattedAgainstOptions = useMemo(() => {
    return againstOptions.map((option) => {
      return {
        value: option.value,
        label: (
          <Horizontal verticalCenter>
            {option.icon}
            <Texto>{option.text}</Texto>
          </Horizontal>
        ),
        icon: option.icon,
        text: option.text,
      }
    })
  }, [againstOptions])

  const benchmarkOptions = useMemo(() => {
    return benchmarks?.map((benchmark) => {
      return {
        value: benchmark.Value,
        label: benchmark.Text,
      }
    })
  }, [benchmarks])
  useEffect(() => {
    if (benchmarkOptions?.length > 0) {
      setSelectedBenchmark(benchmarkOptions[0].value)
    }
  }, [benchmarkOptions])

  return (
    <Vertical
      style={{
        borderBottom: '1px var(--gray-300) solid',
        borderRight: '1px var(--gray-300) solid',
        borderLeft: '1px var(--gray-300) solid',
      }}
    >
      <Horizontal className='px-4 pt-2 pb-4' verticalCenter style={{ gap: 20 }}>
        <Texto category='h5' style={{ color: '#7C97B6' }}>
          Chart Options
        </Texto>
      </Horizontal>
      <Horizontal className='px-4 py-1' verticalCenter>
        <Texto className='ml-2' style={{ whiteSpace: 'nowrap' }}>
          Quote Price vs.
        </Texto>
        {benchmarkOptions?.length > 0 ? (
          <Select
            options={benchmarkOptions}
            value={selectedBenchmark}
            placeholder='Select Benchmark'
            onChange={(e) => {
              setSelectedBenchmark(e)
            }}
            style={{ width: '100%' }}
            bordered={false}
            defaultValue={benchmarkOptions?.[0]}
            showSearch
            filterOption={(input, option) =>
              typeof option?.label === 'string' && option.label.toLowerCase().includes(input.toLowerCase())
            }
          />
        ) : (
          <Texto className='ml-4' appearance='medium'>
            No Benchmarks Configured
          </Texto>
        )}
      </Horizontal>

      <Horizontal className='px-4 py-1' verticalCenter style={{ gap: 20 }}>
        <Texto className='ml-2'>Against:</Texto>
        <Select
          style={{ width: '100%' }}
          bordered={false}
          defaultValue={selectedAgainst}
          onChange={(value) => setSelectedAgainst(value)}
          options={formattedAgainstOptions}
          showSearch
          filterOption={(input, option) =>
            typeof option?.text === 'string' && option.text.toLowerCase().includes(input.toLowerCase())
          }
        />
      </Horizontal>
    </Vertical>
  )
}
