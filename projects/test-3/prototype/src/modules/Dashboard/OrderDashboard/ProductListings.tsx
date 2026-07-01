import './styles.css'

import { EnvironmentFilled } from '@ant-design/icons'
import { getComputedStyleValue } from '@components/TheArmory/helpers'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Collapse, Skeleton } from 'antd'
import React from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from 'recharts'

const { Panel } = Collapse

export function ProductListings({ productListings, isFetching }) {
  const groupedProductListings: { LocationId: number; LocationName: string; Products: any[] }[] =
    productListings?.Data?.reduce((result, product) => {
      const { LocationId, LocationName, ...rest } = product
      const existingLocation = result.find((location) => location.LocationId === LocationId)

      if (existingLocation) {
        existingLocation.Products.push(rest)
      } else {
        result.push({
          LocationId,
          LocationName,
          Products: [rest],
        })
      }
      return result
    }, [])

  if (!productListings || isFetching)
    return (
      <Horizontal className='p-4' style={{ minHeight: '100%', minWidth: '100%' }} horizontalCenter>
        <Skeleton active />
      </Horizontal>
    )

  return (
    <Vertical flex={1}>
      <Horizontal className='p-2 bg-1 header-container' verticalCenter>
        <Texto category='h4'>Product Listings</Texto>
      </Horizontal>
      <div className={'bg-2'} style={{ overflowY: 'auto', margin: 0, padding: 0 }}>
        {groupedProductListings?.map((item) => {
          return <ProductListing listing={item} key={item.LocationName} />
        })}
      </div>
    </Vertical>
  )
}

function ProductListingHeader({ listing }) {
  return (
    <Horizontal className='justify-sb p-2 mr-4' verticalCenter width='100%' height={'auto'}>
      <Texto category='h5'>
        <EnvironmentFilled className='pr-2' />
        {listing?.LocationName}
      </Texto>
      <Texto className={'mr-4'} category='p1' style={{ color: 'var(--gray-600)' }}>
        {listing?.Products?.length} Products
      </Texto>
    </Horizontal>
  )
}

function ProductListingRow({ product }) {
  const chartData = product?.SparkChartPoints.map((point, index) => {
    return { name: index.toString(), uv: point }
  })

  const strokeColor = getComputedStyleValue(
    document.documentElement,
    product?.IsPriceUp ? '--theme-color-2' : '--theme-error'
  ).trim()
  const fillColor = getComputedStyleValue(
    document.documentElement,
    product?.IsPriceUp ? '--theme-color-2-dim' : '--theme-error-dim'
  ).trim()

  const tooltipContent = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload
      return (
        <div className='bg-1 bordered px-1' style={{ verticalAlign: 'center' }}>
          <Texto category='label'>{fmt.currency(dataPoint.uv)}</Texto>
        </div>
      )
    }
    return null
  }

  return (
    <Horizontal className='bg-2 px-1 py-2 justify-sb' verticalCenter width='100%'>
      <Horizontal className={'mr-4'} flex={1} verticalCenter>
        <ResponsiveContainer width='100%' height={40}>
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              bottom: 10,
            }}
          >
            <YAxis domain={['auto', 'auto']} hide />
            <Tooltip content={tooltipContent} />
            <Area type='monotone' dataKey='uv' stroke={strokeColor} fill={fillColor} />
          </AreaChart>
        </ResponsiveContainer>
      </Horizontal>
      <Horizontal flex={2}>
        <Texto category='p2'>{product.ProductName}</Texto>
      </Horizontal>
      <Horizontal flex={1} justifyContent={'flex-end'}>
        <Texto category='p2'>${fmt.decimal(product?.Price)}</Texto>
      </Horizontal>
    </Horizontal>
  )
}

function ProductListing({ listing }) {
  return (
    <Horizontal className='product-listing'>
      <Collapse style={{ minWidth: '100%' }} defaultActiveKey='1' expandIconPosition='right' bordered>
        <Panel key='1' header={<ProductListingHeader listing={listing} />}>
          <Vertical>
            {listing?.Products.map((product) => {
              return <ProductListingRow product={product} key={product?.ProductId} />
            })}
          </Vertical>
        </Panel>
      </Collapse>
    </Horizontal>
  )
}
