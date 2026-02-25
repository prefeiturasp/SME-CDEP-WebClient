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

// Retornar situações de acervos de empréstimos
When('envio uma requisição GET para acervos de empréstimos', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/AcervoEmprestimo/situacoes`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },        
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 200 com todas situações', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.be.an('array').and.to.have.length.greaterThan(0)

    response.body.forEach((item) => {
      expect(item).to.have.property('id').and.to.be.a('number')
      expect(item).to.have.property('nome').and.to.be.a('string').and.not.be.empty
    })
  })
})

// Não retorna situações de acervos de empréstimos sem autenticação
When('tento a requisição GET para acervos de empréstimos', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/AcervoEmprestimo/situacoes`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 401 sem situações dos acervos', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Prorrogar empréstimo de acervo
When('envio uma requisição PUT na solicitação', function () { 
  return cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/AcervoEmprestimo/prorrogar`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    body: {
      acervoSolicitacaoItemId: `${Cypress.env('ACERVO_SOLICITACAO_ITEM_ID')}`,
      dataDevolucao: `${Cypress.env('DATA_DEVOLUCAO')}`
    },        
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 200 prorrogando o empréstimo', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)    
  })
})

// Prorrogar empréstimo somente com data posterior
When('envio uma requisição PUT na solicitação informando data inferior', function () { 
  return cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/AcervoEmprestimo/prorrogar`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    body: {
      acervoSolicitacaoItemId: `${Cypress.env('ACERVO_SOLICITACAO_ITEM_ID')}`,
      dataDevolucao: `${Cypress.env('DATA_DEVOLUCAO_INVALIDA')}`
    },          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 601 que prorroga somente com data posterior', function () {
cy.get('@response').then((response) => {
  expect(response.status).to.equal(601)
  })
})

// Código da solicitação é obrigatório
When('envio uma requisição PUT sem o ID', function () { 
  return cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/AcervoEmprestimo/prorrogar`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    body: {
      acervoSolicitacaoItemId: ` `,
      dataDevolucao: `${Cypress.env('DATA_DEVOLUCAO')}`
    },       
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 422 que o código da solicitação é obrigatório', function () {
cy.get('@response').then((response) => {
  expect(response.status).to.equal(422)
  })
})

// Código da solicitação inválido
When('envio uma requisição PUT com o ID incorreto', function () { 
  return cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/AcervoEmprestimo/prorrogar`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    body: {
      acervoSolicitacaoItemId: `${Cypress.env('ACERVO_SOLICITACAO_ITEM_INVALIDO')} `,
      dataDevolucao: `${Cypress.env('DATA_DEVOLUCAO')}`
    },       
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 422 que o código da solicitação inválido', function () {
cy.get('@response').then((response) => {
  expect(response.status).to.equal(422)
  })
})

// Não prorrogar empréstimo de acervo sem autenticação
When('tento a requisição PUT na solicitação', function () { 
  return cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/AcervoEmprestimo/prorrogar`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },
    body: {
      acervoSolicitacaoItemId: `${Cypress.env('ACERVO_SOLICITACAO_ITEM_ID')}`,
      dataDevolucao: `${Cypress.env('DATA_DEVOLUCAO')}`
    },           
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 401 sem prorrogar empréstimo de acervo', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Devolver empréstimo de acervo
When('envio a requisição PUT na solicitação', function () { 
  return cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/AcervoEmprestimo/${Cypress.env('ACERVO_SOLICITACAO_ITEM_ID')}/devolver`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },      
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 200 devolvendo o empréstimo', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)    
  })
})

// Código da solicitação inválido na devolução
When('envio uma requisição PUT com ID incorreto', function () { 
  return cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/AcervoEmprestimo/${Cypress.env('ACERVO_SOLICITACAO_ITEM_INVALIDO')}/devolver`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },     
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 422 que devolução é inválida', function () {
cy.get('@response').then((response) => {
  expect(response.status).to.equal(422)
  })
})

// Código da solicitação vazio na devolução
When('envio uma requisição PUT com o ID vazio', function () { 
  return cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/AcervoEmprestimo//devolver`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },     
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 404 que a devolução deve ser preenchido', function () {
cy.get('@response').then((response) => {
  expect(response.status).to.equal(404)
  })
})

// Não devolver empréstimo de acervo sem autenticação
When('tento a requisição PUT na solicitação de devolução', function () { 
  return cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/AcervoEmprestimo/${Cypress.env('ACERVO_SOLICITACAO_ITEM_ID')}/devolver`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },        
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 401 sem devolver empréstimo de acervo', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})