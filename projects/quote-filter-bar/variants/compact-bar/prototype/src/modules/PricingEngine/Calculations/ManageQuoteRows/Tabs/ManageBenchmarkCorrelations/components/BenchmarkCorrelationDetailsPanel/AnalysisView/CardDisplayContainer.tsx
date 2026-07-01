import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import React from 'react'

export function CardDisplayContainer({
  title,
  data,
}: {
  title: string
  data: { label: string; value: string | number }[]
}) {
  return (
    <Horizontal flex={1} justifyContent='center' className='my-1 mx-2 px-4 display-card-container'>
      <Vertical flex={1} className='p-2 px-5 bordered bg-1 border-radius-5 '>
        <Horizontal className='mb-2' justifyContent='space-between'>
          <Texto category='h6'>{title}</Texto>
          {/* <BBDTag>Last 90 days</BBDTag> */}
        </Horizontal>

        <Horizontal flex={1} className='mb-2' justifyContent='space-between'>
          <Vertical flex={1}>
            <Texto weight='bold' category='p2'>
              {data[0].value}
            </Texto>
            <Texto className='display-card-lighter-text'>{data[0].label}</Texto>
          </Vertical>
          <Vertical flex={1}>
            <Texto weight='bold' category='p2'>
              {data[1].value}
            </Texto>
            <Texto className='display-card-lighter-text'>{data[1].label !== 'R-Squared' && data[1].label}</Texto>
            {data[1].label === 'R-Squared' && (
              <Texto className='display-card-lighter-text'>
                R<sup>2</sup> (explained)
              </Texto>
            )}
          </Vertical>
        </Horizontal>
        <Horizontal flex={1} className='mb-2' justifyContent='space-between'>
          <Vertical flex={1}>
            <Texto weight='bold' category='p2'>
              {data[2].value}
            </Texto>
            <Texto className='display-card-lighter-text'>{data[2].label}</Texto>
          </Vertical>
          <Vertical flex={1}>
            <Texto weight='bold' category='p2'>
              {data[3].value}
            </Texto>
            <Texto className='display-card-lighter-text' textTransform='capitalize'>
              {data[3].label}
            </Texto>
          </Vertical>
        </Horizontal>
      </Vertical>
    </Horizontal>
  )
}
