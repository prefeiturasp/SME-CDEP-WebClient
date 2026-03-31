import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps'

const Dado = Given
const Quando = When
const Então = Then

const dataAtual = new Date()
const nomeDinamico = `teste-automacao-${dataAtual.getFullYear()}-${String(dataAtual.getMonth() + 1).padStart(2, '0')}-${String(dataAtual.getDate()).padStart(2, '0')}_${String(dataAtual.getHours()).padStart(2, '0')}-${String(dataAtual.getMinutes()).padStart(2, '0')}-${String(dataAtual.getSeconds()).padStart(2, '0')}`

let token
let idAcessoDocumento

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

// Cria novo nome de acesso documento
Quando('envio uma requisição POST com nome de acesso', function () {  
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/AcessoDocumento`,
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

    const idAcessoDocumento = response.body
    Cypress.env('ACESSO_DOCUMENTO_ID', idAcessoDocumento)

    cy.wrap(idAcessoDocumento).as('idAcessoDocumento')
    cy.wrap(response).as('response')
  })
})

Então('retorna o status 200 criando novo nome de acesso documento', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
  cy.get('@idAcessoDocumento').then((idAcessoDocumento) => {
    expect(idAcessoDocumento, 'id gerado').to.exist
    expect(idAcessoDocumento).to.be.a('number')
  })
})

// Nome do acesso deve ser informado
Quando('envio uma requisição POST sem acesso', function () {
  cy.request({
      method: 'POST',
      url: Cypress.config('baseUrl') + `/api/v1/AcessoDocumento`,
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

Então('retorna o status 601 o nome do acesso deve ser informado', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)
    expect(response.body).to.have.property('mensagens')
    expect(response.body).to.have.property('existemErros')
    expect(response.body.mensagens).to.include("Registro duplicado")
    expect(response.body.existemErros).to.be.true
  })
})

// Não insere nome de acesso duplicado
Quando('envio uma requisição POST com o mesmo nome', function () {
  cy.request({
      method: 'POST',
      url: Cypress.config('baseUrl') + '/api/v1/AcessoDocumento',
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

Então('retorna o status 601 sem inserir nome de acesso duplicado', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)
    expect(response.body).to.have.property('mensagens')
    expect(response.body).to.have.property('existemErros')
    expect(response.body.mensagens).to.include("Registro duplicado")
    expect(response.body.existemErros).to.be.true 
  })
})

// Não cria novo nome de acesso documento sem autenticação
Quando('tento uma requisição POST com nome de acesso', function () { 
  return cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/AcessoDocumento`,
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

Então('não cria novo nome de acesso documento sem autenticação', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Busca por todos acessos documentos
Quando('envio uma requisição GET sem documentos específico', function () {
  cy.request({
      method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/AcessoDocumento`,
      headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },        
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 200 com todos acessos documentos', function () {
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

// Não busca todos acessos documentos sem autenticação
Quando('tento uma requisição GET sem documentos específico', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/AcessoDocumento`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('não busca todos acessos documentos sem autenticação retornando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Busca por id do acesso documento
Quando('envio uma requisição GET de id acesso documento', function () {
  const idAcessoDocumento = Cypress.env('ACESSO_DOCUMENTO_ID')
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/AcessoDocumento/${idAcessoDocumento}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Então('retorna o status 200 os dados do acesso documento', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.have.property('nome')
    expect(response.body).to.have.property('id')
    expect(response.body).to.have.property('excluido')
  })
})

Então('retorna o status 200 os dados do acesso documento', function () {
  cy.get('@response').then((response) => {
     expect(response.status).to.eq(200)
      expect(response.body).to.have.property('nome')
      expect(response.body).to.have.property('id')
      expect(response.body).to.have.property('excluido')
  })
})

// Busca por id do acesso documento inválido
Quando('envio a requisição GET de id acesso inexistente', function () {
  cy.request({
      method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/AcessoDocumento/${Cypress.env('ACESSO_DOCUMENTO_INVALIDO_ID')}`,
      headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },        
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 422 que acesso documento inválido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
  })
})

// Não busca por id do acesso documento sem autenticação
Quando('tento a requisição GET de id acesso documento', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/AcessoDocumento/${Cypress.env('ACESSO_DOCUMENTO_ID')}`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('não busca por id do acesso documento sem autenticação retornando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Alterar o acesso documento
Quando('envio uma requisição PUT com id e nome do acesso', function () {
  const idAcessoDocumento = Cypress.env('ACESSO_DOCUMENTO_ID')
  cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/AcessoDocumento`,
    headers: {
      accept: 'text/plain',
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: {
      id: idAcessoDocumento,
      nome: nomeDinamico + '-alterado'
    },
    failOnStatusCode: false
  }).as('response')
})

Então('retorna o status 200 alterando o acesso documento', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
})

// ID deve ser informado para alterar o acesso documento
Quando('envio uma requisição PUT sem id do acesso', function () {  
  cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/AcessoDocumento`,
    headers: {
      accept: 'text/plain',
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: {
      "id": "",
       "nome": `${Cypress.env('ACESSO_DOCUMENTO_NOME')}`
    },
    failOnStatusCode: false
  }).as('response')
})

Então('retorna o status 422 que ID deve ser informado para alterar o acesso documento', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
  })
})

// Não altera o acesso documento sem autenticação
Quando('tento a requisição PUT com id e nome do acesso', function () {  
  cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/AcessoDocumento`,
    headers: {
      accept: 'text/plain',
      'content-type': 'application/json',
      Authorization: 'Bearer token_invalido'
    },
    body: {
      "id": `${Cypress.env('ACESSO_DOCUMENTO_ID')}`,
       "nome": `${Cypress.env('ACESSO_DOCUMENTO_NOME')}`
    },
    failOnStatusCode: false
  }).as('response')
})

Então('não altera o acesso documento sem autenticação retornando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Excluir o acesso documento
Quando('envio uma requisição DELETE com id nome do acesso', function () {
  const idAcessoDocumento = Cypress.env('ACESSO_DOCUMENTO_ID')
  cy.request({
    method: 'DELETE',
    url: Cypress.config('baseUrl') + `/api/v1/AcessoDocumento/${idAcessoDocumento}`,
    headers: {
      accept: 'text/plain',
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Então('retorna o status 200 excluindo o acesso documento', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
})

// Id deve ser informado para excluir o acesso documento
Quando('envio uma requisição DELETE sem id nome do acesso', function () {  
  cy.request({
    method: 'DELETE',
    url: Cypress.config('baseUrl') + `/api/v1/AcessoDocumento/${Cypress.env('ACESSO_DOCUMENTO_INVALIDO_ID')}`,
    headers: {
      accept: 'text/plain',
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },  
    failOnStatusCode: false
  }).as('response')
})

Então('retorna o status 422 que id informado para excluir o acesso documento', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
  })
})

// Não excluir o acesso documento sem autenticação
Quando('tento uma requisição DELETE com id nome do acesso', function () {  
  cy.request({
    method: 'DELETE',
    url: Cypress.config('baseUrl') + `/api/v1/AcessoDocumento/${Cypress.env('ACESSO_DOCUMENTO_INVALIDO_ID')}`,
    headers: {
      accept: 'text/plain',
      'content-type': 'application/json',
      Authorization: 'Bearer token_invalido'
    },  
    failOnStatusCode: false
  }).as('response')
})

Então('não exclui o acesso documento sem autenticação retornando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})