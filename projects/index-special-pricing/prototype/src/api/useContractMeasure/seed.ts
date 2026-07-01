import { Contract, MeasurementBreakdownResponse } from './types'

export const seedContracts: Contract[] = [
  {
    contract_id: '697',
    effective_from: '2023-07-28T15:20:47.902Z',
    effective_to: '2023-07-28T15:20:47.902Z',
    external_company: 'Flints Hills Resources',
    internal_company: 'Gravitate Purchasing',
    ratability: 0.6,
    volume: 4300000,
    price_comparison: {
      is_better: false,
      under_count: 224,
      under_average: -0.032,
      over_count: 141,
      over_average: 0.015,
    },
    deltas: {
      header: ['Competitor 1', 'Competitor 2', 'Spot'],
      details: [
        {
          terminal: 'Council.Bluff.IA',
          product: 'Regular',
          deltas: [
            {
              name: 'Competitor 1',
              value: -0.384,
            },
            {
              name: 'Competitor 2',
              value: 0.98,
            },
            {
              name: 'Spot',
              value: -0.54,
            },
          ],
        },
        {
          terminal: 'Council.Bluff.IA',
          product: 'B11',
          deltas: [
            {
              name: 'Competitor 1',
              value: -0.384,
            },
            {
              name: 'Competitor 2',
              value: 0.384,
            },
            {
              name: 'Spot',
              value: 1.384,
            },
          ],
        },
      ],
    },
  },
  {
    contract_id: '689',
    effective_from: '2023-07-28T15:20:47.902Z',
    effective_to: '2023-07-28T15:20:47.902Z',
    external_company: 'Flints Hills Resources',
    internal_company: 'Gravitate Purchasing',
    ratability: 0.88,
    volume: 3800000,
    price_comparison: {
      is_better: true,
      under_count: 204,
      under_average: -0.052,
      over_count: 139,
      over_average: 0.019,
    },
    deltas: {
      header: ['Competitor 1', 'Competitor 2', 'Spot'],
      details: [
        {
          terminal: 'Council.Bluff.IA',
          product: 'Regular',
          deltas: [
            {
              name: 'Competitor 1',
              value: -0.384,
            },
            {
              name: 'Competitor 2',
              value: 0.98,
            },
            {
              name: 'Spot',
              value: -0.54,
            },
          ],
        },
        {
          terminal: 'Council.Bluff.IA',
          product: 'B11',
          deltas: [
            {
              name: 'Competitor 1',
              value: -0.384,
            },
            {
              name: 'Competitor 2',
              value: 0.384,
            },
            {
              name: 'Spot',
              value: 1.384,
            },
          ],
        },
      ],
    },
  },
  {
    contract_id: '699',
    effective_from: '2023-07-28T15:20:47.902Z',
    effective_to: '2023-07-28T15:20:47.902Z',
    external_company: 'Flints Hills Resources',
    internal_company: 'Gravitate Purchasing',
    ratability: 0.88,
    volume: 4900000,
    price_comparison: {
      is_better: false,
      under_count: 224,
      under_average: -0.032,
      over_count: 141,
      over_average: 0.014,
    },
    deltas: {
      header: ['Competitor 1', 'Competitor 2', 'Spot'],
      details: [
        {
          terminal: 'Council.Bluff.IA',
          product: 'Regular',
          deltas: [
            {
              name: 'Competitor 1',
              value: -0.384,
            },
            {
              name: 'Competitor 2',
              value: 0.98,
            },
            {
              name: 'Spot',
              value: -0.54,
            },
          ],
        },
        {
          terminal: 'Council.Bluff.IA',
          product: 'B11',
          deltas: [
            {
              name: 'Competitor 1',
              value: -0.384,
            },
            {
              name: 'Competitor 2',
              value: 0.384,
            },
            {
              name: 'Spot',
              value: 1.384,
            },
          ],
        },
      ],
    },
  },
]

export const seedBreakdownResponse: MeasurementBreakdownResponse = {
  contract_performance: {
    has_volume: true,
    graph_data: [
      {
        volume: 4231,
        price_delta: -0.012,
        date: '2023-07-25T08:17:47.283Z',
      },
      {
        volume: 6012,
        price_delta: -0.018,
        date: '2023-07-22T15:29:53.987Z',
      },
      {
        volume: 6543,
        price_delta: 0.009,
        date: '2023-07-27T16:44:19.121Z',
      },
      {
        volume: 2821,
        price_delta: 0.014,
        date: '2023-07-19T03:58:32.699Z',
      },
      {
        volume: 8821,
        price_delta: -0.01,
        date: '2023-07-13T02:37:22.843Z',
      },
      {
        volume: 5864,
        price_delta: -0.019,
        date: '2023-07-14T17:51:35.093Z',
      },
      {
        volume: 7123,
        price_delta: 0.001,
        date: '2023-07-26T09:06:41.001Z',
      },
      {
        volume: 5324,
        price_delta: -0.017,
        date: '2023-07-12T19:22:57.441Z',
      },
      {
        volume: 3045,
        price_delta: 0.012,
        date: '2023-07-20T10:37:43.155Z',
      },
      {
        volume: 9276,
        price_delta: 0.006,
        date: '2023-07-23T23:55:11.886Z',
      },
      {
        volume: 7465,
        price_delta: 0.01,
        date: '2023-07-15T01:07:29.354Z',
      },
      {
        volume: 1111,
        price_delta: 0.001,
        date: '2023-07-18T05:33:11.508Z',
      },
      {
        volume: 4782,
        price_delta: -0.006,
        date: '2023-07-24T05:16:04.779Z',
      },
      {
        volume: 3033,
        price_delta: -0.007,
        date: '2023-07-17T10:42:22.836Z',
      },
      {
        volume: 6023,
        price_delta: -0.016,
        date: '2023-07-29T02:15:39.983Z',
      },
      {
        volume: 3678,
        price_delta: 0.017,
        date: '2023-07-21T04:50:48.001Z',
      },
      {
        volume: 8790,
        price_delta: 0.002,
        date: '2023-07-30T05:01:20.001Z',
      },
      {
        volume: 2689,
        price_delta: -0.011,
        date: '2023-07-28T22:31:06.582Z',
      },
      {
        volume: 4876,
        price_delta: 0.004,
        date: '2023-07-16T20:58:29.120Z',
      },
      {
        volume: 3456,
        price_delta: -0.005,
        date: '2023-07-11T13:12:16.314Z',
      },
    ],
    ratable_volume: 4000,
    price_delta_max: 0.1,
    price_delta_min: 0,
    volume_max: 60000,
  },
  grid: {
    has_volume: true,
    rows: [
      {
        date: '2023-07-31T20:00:58.101Z',
        contracted_volume: 0,
        lifted_volume: 0,
        savings: 12900,
        deltas: [
          {
            name: '',
            value: 1,
          },
          {
            name: '',
            value: 2,
          },
          {
            name: '',
            value: 3,
          },
        ],
      },
      {
        date: '2023-07-31T20:00:58.101Z',
        contracted_volume: 0,
        lifted_volume: 0,
        savings: 3100,
        deltas: [
          {
            name: '',
            value: 0.5,
          },
          {
            name: '',
            value: 1.5,
          },
          {
            name: '',
            value: 2.5,
          },
        ],
      },
      {
        date: '2023-07-31T20:00:58.101Z',
        contracted_volume: 0,
        lifted_volume: 0,
        savings: 4500,
        deltas: [
          {
            name: '',
            value: 2.2,
          },
          {
            name: '',
            value: 3.3,
          },
          {
            name: '',
            value: 1.1,
          },
        ],
      },
      {
        date: '2023-07-31T20:00:58.101Z',
        contracted_volume: 0,
        lifted_volume: 0,
        savings: 7600,
        deltas: [
          {
            name: '',
            value: 0.7,
          },
          {
            name: '',
            value: 1.2,
          },
          {
            name: '',
            value: 2.1,
          },
        ],
      },
      {
        date: '2023-07-31T20:00:58.101Z',
        contracted_volume: 0,
        lifted_volume: 0,
        savings: 5500,
        deltas: [
          {
            name: '',
            value: 3,
          },
          {
            name: '',
            value: 1,
          },
          {
            name: '',
            value: 2,
          },
        ],
      },
      {
        date: '2023-07-31T20:00:58.101Z',
        contracted_volume: 0,
        lifted_volume: 0,
        savings: 8900,
        deltas: [
          {
            name: '',
            value: 1.8,
          },
          {
            name: '',
            value: 2.7,
          },
          {
            name: '',
            value: 0.9,
          },
        ],
      },
      {
        date: '2023-07-31T20:00:58.101Z',
        contracted_volume: 0,
        lifted_volume: 0,
        savings: 2100,
        deltas: [
          {
            name: '',
            value: 1.5,
          },
          {
            name: '',
            value: 0.5,
          },
          {
            name: '',
            value: 2,
          },
        ],
      },
      {
        date: '2023-07-31T20:00:58.101Z',
        contracted_volume: 0,
        lifted_volume: 0,
        savings: 6500,
        deltas: [
          {
            name: '',
            value: 0.1,
          },
          {
            name: '',
            value: 0.2,
          },
          {
            name: '',
            value: 0.3,
          },
        ],
      },
      {
        date: '2023-07-31T20:00:58.101Z',
        contracted_volume: 0,
        lifted_volume: 0,
        savings: 4300,
        deltas: [
          {
            name: '',
            value: 2.9,
          },
          {
            name: '',
            value: 1.6,
          },
          {
            name: '',
            value: 3.2,
          },
        ],
      },
      {
        date: '2023-07-31T20:00:58.101Z',
        contracted_volume: 0,
        lifted_volume: 0,
        savings: 11000,
        deltas: [
          {
            name: '',
            value: 0.6,
          },
          {
            name: '',
            value: 1.1,
          },
          {
            name: '',
            value: 2.2,
          },
        ],
      },
    ],
  },
}
