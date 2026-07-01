import { render } from '@testing-library/react'
import React from 'react'

import { App } from '../App'

vi.mock('react-ga')
it('Renders an AuthenticatedRoute component', async () => {
  const { findAllByRole } = render(<App />)
  const imgs = await findAllByRole('img')
  expect(imgs).toHaveLength(1)
})
