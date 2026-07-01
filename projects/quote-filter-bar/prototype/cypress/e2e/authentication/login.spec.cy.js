/// <reference types="cypress" />

describe('Portal Login Using UI', () => {
  it('Logs in and navigates to Order Management - All', () => {
    cy.visit('/login')
    cy.location('pathname').should('equal', '/login')
    cy.get('[data-cy="input-username"]').type('support@capspire.com').should('have.value', 'support@capspire.com')
    cy.get('[data-cy="input-password"]').type('ngldemo').should('have.value', 'ngldemo')
    cy.get('[data-cy="button-login-submit"]').click()

    cy.intercept('POST', '**/token/authorize').as('token')
    cy.wait('@token')
      .its('response.statusCode')
      .should('eq', 200)
      .then(() => {
        cy.location('pathname').should('equal', '/')
      })
  })
})
