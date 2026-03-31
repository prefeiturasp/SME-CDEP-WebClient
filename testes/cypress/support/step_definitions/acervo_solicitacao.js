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
  expect(token, 'valido').to.exist
})

Dado('que não possuo um token de acesso', function () { 
})

// Retornar o acervo solicitação
Quando('envio uma requisição GET com id do acervo', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/AcervoSolicitacao?acervosIds=${Cypress.env('ASSUNTO_ID')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 200 com o acervo solicitação', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)    
  })
})

// Não retornar sem acervo solicitação
Quando('envio uma requisição GET sem id acervo', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/AcervoSolicitacao?acervosIds=`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('não retornar sem acervo solicitação', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)    
  })
})

// Não retornar acervo solicitação sem autenticação
Quando('tento a requisição GET das condições aceitas', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/AcervoSolicitacao?acervosIds=${Cypress.env('ASSUNTO_ID')}`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 401 sem o termo de compromisso', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Retornar o acervo solicitação por id
Quando('envio uma requisição GET com id do acervo solicitado', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/AcervoSolicitacao/${Cypress.env('ASSUNTO_ID')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 200 com o acervo solicitação por id', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)    
  })
})

// Não retornar sem acervo solicitação por id
Quando('envio uma requisição GET sem id acervo solicitado', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/AcervoSolicitacao/`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false  
  }).as('response')
})

Então('não retornar sem acervo solicitação por id', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)
  })
})

// Não retornar o acervo solicitação por id sem autenticação
Quando('tento a requisição GET com id do acervo solicitado', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/AcervoSolicitacao/${Cypress.env('ASSUNTO_ID')}`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 401 sem acervo solicitação por id', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Retornar o acervo da minha solicitação
Quando('envio uma requisição GET acervo solicitado', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/AcervoSolicitacao/minha-solicitacao/${Cypress.env('ASSUNTO_ID')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 200 com o acervo da minha solicitação', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)    
  })
})

// Não retornar sem acervo da minha solicitação
Quando('envio uma requisição GET sem acervo solicitado', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/AcervoSolicitacao/minha-solicitacao/`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false  
  }).as('response')
})

Então('não retornar sem acervo da minha solicitação', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
  })
})

// Não retornar o acervo da minha solicitação sem autenticação
Quando('tento a requisição GET acervo solicitado', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/AcervoSolicitacao/minha-solicitacao/${Cypress.env('ASSUNTO_ID')}`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 401 sem acervo da minha solicitação', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})