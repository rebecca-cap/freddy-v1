describe('New Prompt Market Order Using UI', () => {
  beforeEach(() => {
    cy.loginSU('support@capspire.com', 'ngldemo')
  })

  it('Logs in and navigates to Order Management - All', () => {
    cy.visit('/buyNow/prompt')

    const promptGridSelector = '[id="prompt-grid"]'
    const quantity = '1000'
    const price = 2.5
    const indexOverride = 2.4

    cy.get(promptGridSelector).should('exist')
    cy.get('[id="prompt-grid"] .ag-center-cols-viewport .ag-row').first().click()
    cy.get('[id="prompt-grid"] .ag-center-cols-viewport .ag-row-selected').should('exist')

    cy.get('[class*=test-Quantity] input').type(quantity)
    cy.get('[class*=test-Quantity] .ant-form-item-explain').should('not.exist')

    cy.get('[class*=test-Price] input').clear()
    cy.get('[class*=test-Price] input').type(price)
    cy.get('[class*=test-Price] .ant-form-item-explain').should('not.exist')

    cy.get('[class*=test-IndexOverride] input').clear()
    cy.get('[class*=test-IndexOverride] input').type(indexOverride)
    cy.get('[class*=test-IndexOverride] .ant-form-item-explain').should('not.exist')

    cy.get('[class*=test-BidExpiration] input').should('not.exist')

    const Notes = 'Lorem ipsum dolor sit...'
    cy.get('[class*=test-AdditionalOptions] [class*=test-Notes]').clear()
    cy.get('[class*=test-AdditionalOptions] [class*=test-Notes]').type(Notes)
    cy.get('[class*=test-AdditionalOptions] [class*=test-Notes] .ant-form-item-explain').should('not.exist')

    cy.get('[class*=test-Contact]')
      .scrollIntoView()
      .click()
      .get('.ant-select-item-option')
      .first()
      .scrollIntoView()
      .click()

    cy.firstDropdownOption('.test-InternalCounterpartySelect', 'test-InternalCounterpartyOption')

    cy.get('.test-SendExternalNotification input[type="checkbox"]').check().should('be.checked')

    cy.get('.test-SubmitButton').should('have.text', 'create').should('not.be.disabled').click()

    cy.get('.test-ConfirmQuantity').should('contain', '1,000')

    cy.get('.test-ConfirmType').should('contain', 'market Order')

    cy.get('.test-ConfirmIndexPrice').should('contain', '$2.4000')

    cy.get('.test-SubmitButton').should('have.text', 'confirm').should('not.be.disabled').click()
  })
})
