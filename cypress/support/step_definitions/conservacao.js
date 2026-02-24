import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps'

const dataAtual = new Date()
const nomeDinamico = `teste-automacao-${dataAtual.getFullYear()}-${String(dataAtual.getMonth() + 1).padStart(2, '0')}-${String(dataAtual.getDate()).padStart(2, '0')}_${String(dataAtual.getHours()).padStart(2, '0')}-${String(dataAtual.getMinutes()).padStart(2, '0')}-${String(dataAtual.getSeconds()).padStart(2, '0')}`

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

// Cria novo nome de conservação
When('envio uma requisição POST com nome de conservação', function () {
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/Conservacao`,
    headers: {
      accept: 'text/plain',
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: { 
      nome: nomeDinamico
    },
    failOnStatusCode: false
  }).then((response) => {
    console.log('Resposta do POST:', response.body)

    const idConservacao = response.body
    Cypress.env('CONSERVACAO_ID', idConservacao)

    cy.wrap(idConservacao).as('idConservacao')
    cy.wrap(response).as('response')
  })
})

Then('retorna o status 200 criando novo nome de conservação', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
  cy.get('@idConservacao').then((idConservacao) => {
    expect(idConservacao, 'id gerado').to.exist
    expect(idConservacao).to.be.a('number')
  })
})

// Nome de conservação deve ser informado
When('envio uma requisição POST sem conservação', function () {
  cy.request({
      method: 'POST',
      url: Cypress.config('baseUrl') + `/api/v1/Conservacao`,
      headers: {
      accept: 'text/plain',
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: {
      nome: ` `
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 601 o nome de conservação deve ser informado', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)
    expect(response.body).to.have.property('mensagens')
    expect(response.body).to.have.property('existemErros')
    expect(response.body.mensagens).to.include("Registro duplicado")
    expect(response.body.existemErros).to.be.true
  })
})

// Não insere nome de conservação duplicado
When('envio uma requisição POST com o mesmo nome de conservação', function () {
  cy.request({
      method: 'POST',
      url: Cypress.config('baseUrl') + '/api/v1/Conservacao',
      headers: {
      accept: 'text/plain',
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: {
      nome: nomeDinamico
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 601 sem inserir nome de conservação duplicado', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)
    expect(response.body).to.have.property('mensagens')
    expect(response.body).to.have.property('existemErros')
    expect(response.body.mensagens).to.include("Registro duplicado")
    expect(response.body.existemErros).to.be.true 
  })
})

// Não cria novo nome de conservaçãosem autenticação
When('tento uma requisição POST com nome de conservação', function () { 
  return cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/Conservacao`,
    headers: {
      accept: 'text/plain',
      'content-type': 'application/json',
      Authorization: 'Bearer token_invalido'
    },
    body: {
      nome: nomeDinamico
    },          
    failOnStatusCode: false  
  }).as('response')
})

Then('não cria novo nome de conservação sem autenticação', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Busca por todas conservação
When('envio uma requisição GET sem conservacao especifico', function () {
  cy.request({
      method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/Conservacao`,
      headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },        
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 200 com todos conservacao', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.be.an('array')

    response.body.forEach((item) => {
      expect(item).to.have.property('nome')
      expect(item).to.have.property('id')
      expect(item).to.have.property('excluido')
    })
  })
})

// Não busca todos conservação sem autenticação
When('tento uma requisição GET sem conservacao especifico', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Conservacao`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },          
    failOnStatusCode: false  
  }).as('response')
})

Then('não busca todos conservacao sem autenticação retornando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Busca por id do conservação
When('envio uma requisição GET de id conservacao', function () {
  const idConservacao = Cypress.env('CONSERVACAO_ID')  
    cy.request({
      method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/Conservacao/${idConservacao}`,
      headers: {
        accept: 'text/plain',
        Authorization: `Bearer ${token}`
      },
      failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 os dados do conservacao', function () {
  cy.get('@response').then((response) => {
     expect(response.status).to.eq(200)
      expect(response.body).to.have.property('nome')
      expect(response.body).to.have.property('id')
      expect(response.body).to.have.property('excluido')
  })
})

// Busca por id do conservação inválido
When('envio a requisição GET de id conservacao inexistente', function () {
  cy.request({
      method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/Conservacao/${Cypress.env('CONSERVACAO_INVALIDO_ID')}`,
      headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },        
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 422 que conservacao é inválido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
  })
})

// Não busca por id conservação sem autenticação
When('tento a requisição GET de id conservacao', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Conservacao/${Cypress.env('CONSERVACAO_INVALIDO_ID')}`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },          
    failOnStatusCode: false  
  }).as('response')
})

Then('não busca por id do conservacao sem autenticação retornando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Alterar o registro de conservação
When('envio uma requisição PUT com id e nome de conservação', function () {
  const idConservacao = Cypress.env('CONSERVACAO_ID')
  cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/Conservacao`,
    headers: {
      accept: 'text/plain',
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: {
      id: idConservacao,
      nome: nomeDinamico + '-alterado'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 alterando conservação', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
})

// ID deve ser informado para alterar conservação
When('envio uma requisição PUT sem id de conservação', function () {  
  cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/Conservacao`,
    headers: {
      accept: 'text/plain',
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: {
      "id": "",
       "nome": `${Cypress.env('CONSERVACAO_NOME')}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 que ID deve ser informado para alterar conservação', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
  })
})

// Não altera conservação sem autenticação
When('tento a requisição PUT com id e nome de conservação', function () {  
  cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/Conservacao`,
    headers: {
      accept: 'text/plain',
      'content-type': 'application/json',
      Authorization: 'Bearer token_invalido'
    },
    body: {
      "id": `${Cypress.env('CONSERVACAO_ID')}`,
       "nome": `${Cypress.env('CONSERVACAO_NOME')}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('não altera conservação sem autenticação retornando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Excluir registro conservação
When('envio uma requisição DELETE com id nome conservação', function () {
  const idConservacao = Cypress.env('CONSERVACAO_ID')
  cy.request({
    method: 'DELETE',
    url: Cypress.config('baseUrl') + `/api/v1/Conservacao/${idConservacao}`,
    headers: {
      accept: 'text/plain',
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 excluindo conservação', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
})

// Id deve ser informado para excluir conservação
When('envio uma requisição DELETE sem id nome conservação', function () {  
  cy.request({
    method: 'DELETE',
    url: Cypress.config('baseUrl') + `/api/v1/Conservacao/${Cypress.env('CONSERVACAO_INVALIDO_ID')}`,
    headers: {
      accept: 'text/plain',
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },  
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 que id informado para excluir conservação', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
  })
})

// Não excluir conservação sem autenticação
When('tento uma requisição DELETE com id nome conservação', function () {  
  cy.request({
    method: 'DELETE',
    url: Cypress.config('baseUrl') + `/api/v1/Conservacao/${Cypress.env('CONSERVACAO_INVALIDO_ID')}`,
    headers: {
      accept: 'text/plain',
      'content-type': 'application/json',
      Authorization: 'Bearer token_invalido'
    },  
    failOnStatusCode: false
  }).as('response')
})

Then('não exclui conservação sem autenticação retornando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})