/// <reference types="cypress" />

describe('New Prompt Bid Order Using UI', () => {
  beforeEach(() => {
    cy.loginSU('support@capspire.com', 'ngldemo')
  })

  it('Logs in and navigates to Order Management - All', () => {
    cy.visit('/buyNow/prompt')

    const promptGridSelector = '[id="prompt-grid"]'
    const quantity = '1000'
    const price = 3
    const date = '05/31/2023: 02:45 pm'

    cy.get(promptGridSelector).should('exist')
    cy.get('[id="prompt-grid"] .ag-center-cols-viewport .ag-row').first().click()
    cy.get('[id="prompt-grid"] .ag-center-cols-viewport .ag-row-selected').should('exist')

    cy.get('[class*=test-Quantity] input').type(quantity)
    cy.get('[class*=test-Quantity] .ant-form-item-explain').should('not.exist')

    cy.get('#tradeForm_Type > label:nth-child(2)').click()

    cy.get('[class*=test-Price] input').clear()
    cy.get('[class*=test-Price] input').type(price)
    cy.get('[class*=test-Price] .ant-form-item-explain').should('not.exist')

    cy.get('[class*=test-IndexOverride] input').should('not.exist')

    cy.get('.test-BidExpiration input').click()

    cy.get('#tradeForm_BidExpiration').clear()
    cy.get('#tradeForm_BidExpiration').type(date)
    cy.get(
      'body > div:nth-child(7) > div > div > div > div > div.ant-picker-footer > ul > li.ant-picker-ok > button'
    ).click()

    cy.get('#tradeForm_BidExpiration').should('have.value', date)

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

    cy.get('.test-ConfirmType').should('contain', 'bid Order')

    cy.get('.test-ConfirmBidExpiration').should('contain', 'Expiring 05-31-2023 2:45 PM')

    cy.get('.test-ConfirmIndexPrice').should('not.exist')

    cy.get('.test-SubmitButton').should('have.text', 'confirm').should('not.be.disabled').click()
  })
})
