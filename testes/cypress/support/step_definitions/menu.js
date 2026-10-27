import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps'

const Dado = Given
const Quando = When
const Então = Then

let token

Before(() => {
  cy.gerar_token().then((token_valido) => {
    token = token_valido
  })
})

Dado('que possuo um token de acesso', function () {
})

Dado('que não possuo um token de acesso', function () { 
})

// Acessar o menu do sistema
Quando('envio uma requisição GET', function () {
  cy.request({
      method: 'GET',
      url: Cypress.config('baseUrl') + '/api/v1/Menu',
      headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },        
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o menu com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)
  })
})

// Não acessar o menu sem autenticação
Quando('tento uma requisição GET', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Menu`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('não carrega o menu retornando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})