/* eslint-disable no-undef */
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
/// <reference types="cypress" />
import 'cypress-localstorage-commands'

let userData
let tokenData
let orderData

Cypress.Commands.add('loginSU', (username, password) => {
  console.log(Cypress.env())
  cy.session(username, () => {
    cy.request({
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      url: `${Cypress.env('EXTERNAL_API')}/token/authorize`,
      body: {
        username,
        password,
      },
      form: true,
    })
      .its('body')
      .then((res) => {
        tokenData = res
        cy.setLocalStorage('token', tokenData.access_token)
        cy.setLocalStorage('refresh', tokenData.refresh_token)
        cy.request({
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenData.access_token}` },
          method: 'POST',
          url: `${Cypress.env('EXTERNAL_API')}/Credential/GetUserInfo`,
        })
          .its('body')
          .then((res) => {
            userData = res
            cy.setLocalStorage('user', userData)
          })
      })
  })
})

Cypress.Commands.add('custRequest', (method, url, reqBody, queryString, form = false) => {
  const tokenData = cy.getLocalStorage('refresh')
  cy.request({
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenData.specWindow.localStorage.token}`,
    },
    method,
    url: `${Cypress.env('EXTERNAL_API')}/${url}`,
    body: reqBody,
    form,
    qs: queryString,
  })
})

Cypress.Commands.add('selectDropdown', (testId, optionText) => {
  // open select
  cy.get(testId).click()

  return cy
    .get('.ant-select-dropdown :not(.ant-select-dropdown-hidden)')
    .find('.ant-select-item-option')
    .each((el) => {
      if (el.text() === optionText) {
        cy.wrap(el).click()
      }
    })
})
Cypress.Commands.add('firstDropdownOption', (testId, optionClassName) => {
  // open select
  cy.get(testId).click()
  return cy.get(`.${optionClassName}-1`).click()
})

Cypress.Commands.add('multiClick', (element, times) => {
  for (let n = 0; n < times; n++) {
    cy.get(element).first().click()
  }
})

Cypress.Commands.add('getOrders', (market, sectors, priceType) => {
  cy.request({
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenData.access_token}` },
    method: 'POST',
    url: `${Cypress.env('EXTERNAL_API')}/order/accepted`,
    body: {
      sectors,
      price_type: priceType,
    },
    form: false,
    qs: {
      market,
    },
  })
    .its('body')
    .then((res) => {
      orderData = res
    })
})
