import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps'

let token

Before(() => {
  cy.gerar_token().then((token_valido) => {
    token = token_valido
  })
})

Given('que possuo um token de acesso', function () {
  expect(token, 'valido').to.exist
})

Given('que não possuo um token de acesso', function () { 
})

// Retornar os tipos de acervos cadastrados
When('envio uma requisição GET para o painel gerencial', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/PainelGerencial/acervos-cadastrados`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    }, 
    timeout: 3000,          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 200 com os tipos de acervos cadastrados', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.be.an('array').and.to.have.length.greaterThan(0)

    response.body.forEach((item) => {
      expect(item).to.have.property('id').and.to.be.a('number')
      expect(item).to.have.property('nome').and.to.be.a('string').and.not.be.empty
      expect(item).to.have.property('valor').and.to.be.a('number')
    })
  })
})

// Não retornar os tipos de acervos cadastrados sem autenticação
When('tento a requisição GET para o painel gerencial', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/PainelGerencial/acervos-cadastrados`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 401 sem os tipos de acervos cadastrados', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Retornar quantidade de pesquisas mensais
When('envio a requisição GET para o painel gerencial', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/PainelGerencial/quantidade-pesquisas-mensais`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    }, 
    timeout: 3000,          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 200 com a quantidade pesquisas mensais', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.be.an('array').and.to.have.length.greaterThan(0)

    response.body.forEach((item) => {
      expect(item).to.have.property('id').and.to.be.a('number')
      expect(item).to.have.property('nome').and.to.be.a('string').and.not.be.empty
      expect(item).to.have.property('valor').and.to.be.a('number')
    })
  })
})

// Não retornar quantidade de pesquisas mensais sem autenticação
When('tento uma requisição GET para o painel gerencial', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/PainelGerencial/quantidade-pesquisas-mensais`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 401 sem quantidade pesquisas mensais', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Retornar quantidade de solicitações mensais
When('envio o GET para o painel gerencial', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/PainelGerencial/quantidade-solicitacoes-mensais`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    }, 
    timeout: 3000,          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 200 com a quantidade solicitações mensais', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.be.an('array').and.to.have.length.greaterThan(0)

    response.body.forEach((item) => {
      expect(item).to.have.property('id').and.to.be.a('number')
      expect(item).to.have.property('nome').and.to.be.a('string').and.not.be.empty
      expect(item).to.have.property('valor').and.to.be.a('number')
    })
  })
})

// Não retornar quantidade de solicitações mensais sem autenticação
When('tento enviar GET para o painel gerencial', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/PainelGerencial/quantidade-solicitacoes-mensais`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 401 sem quantidade solicitações mensais', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Buscar as solicitações por tipos de acervo
When('envio o GET para as solicitações no painel gerencial', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/PainelGerencial/solicitacoes-tipo-acervo`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    }, 
    timeout: 3000,          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 200 buscando as solicitações por tipos de acervo', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.be.an('array').and.to.have.length.greaterThan(0)

    response.body.forEach((item) => {
      expect(item).to.have.property('id').and.to.be.a('number')
      expect(item).to.have.property('nome').and.to.be.a('string').and.not.be.empty
      expect(item).to.have.property('valor').and.to.be.a('number')
    })
  })
})

// Não busca as solicitações por tipos de acervo sem autenticação
When('tento enviar o GET para as solicitações no painel gerencial', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/PainelGerencial/solicitacoes-tipo-acervo`,
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer token_invalido'
    },          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 401 sem as solicitações por tipos de acervo', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Buscar os livros emprestados
When('envio o GET para livros emprestados no painel gerencial', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/PainelGerencial/controle-livros-emprestados`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    }, 
    timeout: 3000,          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 200 buscando os livros emprestados', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.be.an('array').and.to.have.length.greaterThan(0)

    response.body.forEach((item) => {
      expect(item).to.have.property('id').and.to.be.a('number')
      expect(item).to.have.property('nome').and.to.be.a('string').and.not.be.empty
      expect(item).to.have.property('valor').and.to.be.a('number')
    })
  })
})

// Não busca os livros emprestados sem autenticação
When('tento enviar o GET para livros emprestados no painel gerencial', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/PainelGerencial/controle-livros-emprestados`,
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer token_invalido'
    },          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 401 sem os livros emprestados', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Buscar solicitações por situação
When('envio o GET para solicitações no painel gerencial', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/PainelGerencial/solicitacoes-por-situacao`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    }, 
    timeout: 3000,          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 200 buscando por situação', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.be.an('array').and.to.have.length.greaterThan(0)

    response.body.forEach((item) => {
      expect(item).to.have.property('id').and.to.be.a('number')
      expect(item).to.have.property('nome').and.to.be.a('string').and.not.be.empty
      expect(item).to.have.property('valor').and.to.be.a('number')
    })
  })
})

// Não busca solicitações por situação sem autenticação
When('tento enviar o GET para solicitações no painel gerencial', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/PainelGerencial/solicitacoes-por-situacao`,
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer token_invalido'
    },          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 401 sem buscar por situação', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})