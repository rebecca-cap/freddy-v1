import { Progress } from 'antd'
import React from 'react'

export const AllocationColumn = (isDemo?: boolean) =>
  isDemo
    ? [
        {
          headerName: 'Allocation',
          marryChildren: true,
          children: [
            {
              minWidth: 130,
              filter: 'agNumberColumnFilter',
              field: 'Allocation',
              editable: false,
              hide: true,
              headerName: '',
              cellRenderer: (params) => {
                const isHeavy = params.value > 75
                return (
                  <Progress
                    trailColor={isHeavy ? 'var(--theme-warning-dim)' : 'var(--theme-success-dim)'}
                    percent={params.value}
                    status='active'
                    strokeColor={isHeavy ? 'var(--theme-warning)' : 'var(--theme-success)'}
                  />
                )
              },
            },
          ],
        },
      ]
    : []
