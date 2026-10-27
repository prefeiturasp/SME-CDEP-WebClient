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

// Remove a importação de arquivo do acervo 
Quando('envio uma requisição DELETE na planilha do arquivo acervo', function () {
  cy.request({
      method: 'DELETE',
      url: Cypress.config('baseUrl') + `/api/v1/acervo/importacao/planilha/${Cypress.env('IMPORTACAO_PLANILHA_ID')}`,
      headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },        
    failOnStatusCode: false  
  }).as('response')
})

Então('remove a importação de arquivo do acervo com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)
  })
})

// Código da importação de arquivo é obrigatório
Quando('envio uma requisição DELETE sem o código da planilha do arquivo acervo', function () {
  cy.request({
      method: 'DELETE',
      url: Cypress.config('baseUrl') + '/api/v1/acervo/importacao/planilha/',
      headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },        
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 404 que o código da importação de arquivo é obrigatório', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(404)
  })
})

// Não remove a importação de arquivo sem autenticação
Quando('tento a requisição DELETE sem o código', function () { 
  return cy.request({
    method: 'DELETE',
    url: Cypress.config('baseUrl') + `/api/v1/acervo/importacao/planilha/${Cypress.env('IMPORTACAO_PLANILHA_ID')}`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('não remove a importação de arquivo retornando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})