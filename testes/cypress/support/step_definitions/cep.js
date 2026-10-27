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

// Buscar dados com CEP válido
Quando('envio uma requisição GET com CEP válido', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/cep/${Cypress.env('CEP_VALIDO')}`,
    headers: {
      accept: 'text/plain'
    }, 
    timeout: 3000,          
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 200 de confirmação da busca', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)    
  })
})

// CEP informado deve ser inválido
Quando('envio uma requisição GET com CEP inválido', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/cep/${Cypress.env('CEP_INVALIDO')}`,
    headers: {
      accept: 'text/plain'
    },
  timeout: 120000,          
  failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 204 que não foi possível buscar os dados', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(204) 
  })
})

// CEP deve ser informado para busca
Quando('tento a requisição GET para o endpoint buscar sem o cep', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/cep/`,
    headers: {
      accept: 'text/plain'
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('não realiza a consulta retornando o status 404', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(404)
  })
})
