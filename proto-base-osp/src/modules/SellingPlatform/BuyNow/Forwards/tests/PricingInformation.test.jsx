import React from 'react'
import { describe, vi } from 'vitest'

const fakeForm = {
  getFieldsValue: () => vi.fn(),
  setFieldsValue: () => vi.fn(),
}
describe('Forwards- Price Information', () => {
  // if mpi is tas is user cannot select bid
  it('should not allow user to select bid if mpi is tas', () => {
    // const { getByTestId } = renderWithMockedAPI(
    //   <Form initialValues={{ PricingStrategy: 'Market' }}>
    //     <PricingInformation form={fakeForm} price={1} />
    //   </Form>
    // )
    // const strategyRadio = getByTestId('Bid')
    // expect(strategyRadio).toHaveProperty('disabled', true)
    // if subtype has bid disabled user cannot select bid.
    //  market is default shown
    // if user selects bid, then the bid is shown in the price information, and bid expiration
    // if user is internal sale price is editable
    // if user is external, it is not
  })
})
