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

// Criar cadastro de Série/Coleção
Quando('envio uma requisição POST seriecolecao', function () {
  const agora = new Date()
  const ano = agora.getFullYear()
  const mes = String(agora.getMonth() + 1).padStart(2, '0')
  const dia = String(agora.getDate()).padStart(2, '0')
  const hora = String(agora.getHours()).padStart(2, '0')
  const minuto = String(agora.getMinutes()).padStart(2, '0')
  const segundo = String(agora.getSeconds()).padStart(2, '0')

  const nomeDinamico = `teste-${ano}-${mes}-${dia}-${hora}-${minuto}-${segundo}`

  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/SerieColecao`,
    headers: {
      accept: 'text/plain',
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: {
      nome: nomeDinamico,
      tipo: 1
    },
    failOnStatusCode: false
  }).as('response')
})

Então('retorna o status 200 criando seriecolecao', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)

    const id = response.body

    cy.log(`id criado: ${id}`)

    expect(id).to.exist

    this.idSerieColecao = id
  })
})

// Não criar Série/Coleção sem nome
Quando('envio a requisição POST seriecolecao', function () {
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/SerieColecao`,
    headers: {
      accept: 'text/plain',
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: {
      tipo: 1
    },
    failOnStatusCode: false
  }).as('response')
})

Então('retorna o status 422 não criando seriecolecao sem nome', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)

    const body = response.body

    cy.log(`id: ${body}`)

    expect(body).to.exist

  })
})

// Não criar Série/Coleção sem autenticação
Quando('tento a requisição POST seriecolecao', function () {
  const agora = new Date()
  const ano = agora.getFullYear()
  const mes = String(agora.getMonth() + 1).padStart(2, '0')
  const dia = String(agora.getDate()).padStart(2, '0')
  const hora = String(agora.getHours()).padStart(2, '0')
  const minuto = String(agora.getMinutes()).padStart(2, '0')
  const segundo = String(agora.getSeconds()).padStart(2, '0')

  const nomeDinamico = `teste-${ano}-${mes}-${dia}-${hora}-${minuto}-${segundo}`

  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/SerieColecao`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },body: {
      nome: nomeDinamico,
      tipo: 1
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 401 sem criar seriecolecao', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Retornar Série/Coleção por id
Quando('envio uma requisição GET com id seriecolecao', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/SerieColecao/${this.idSerieColecao}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 200 do id seriecolecao', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)    
  })
})

// Não retorna Série/Coleção por id sem autenticação
Quando('tento a requisição GET com id seriecolecao', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/SerieColecao/${this.idSerieColecao}`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 401 sem id seriecolecao', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Retornar Série/Coleção resumido
Quando('envio uma requisição GET para resumo de seriecolecao', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/SerieColecao/resumido`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 200 com seriecolecao resumido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)    
  })
})

// Não retorna Série/Coleção resumido sem autenticação
Quando('tento a requisição GET para resumo de seriecolecao', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/SerieColecao/resumido`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 401 sem seriecolecao resumido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Retornar cadastro de Série/Coleção
Quando('envio uma requisição GET para seriecolecao', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/SerieColecao`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 200 com seriecolecao', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)    
  })
})

// Não retorna Série/Coleção sem autenticação
Quando('tento a requisição GET para seriecolecao', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/SerieColecao`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 401 sem seriecolecao', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Alterar a Série/Coleção
Quando('envio uma requisição PUT seriecolecao', function () {
  const agora = new Date()
  const ano = agora.getFullYear()
  const mes = String(agora.getMonth() + 1).padStart(2, '0')
  const dia = String(agora.getDate()).padStart(2, '0')
  const hora = String(agora.getHours()).padStart(2, '0')
  const minuto = String(agora.getMinutes()).padStart(2, '0')
  const segundo = String(agora.getSeconds()).padStart(2, '0')

  const nomeAlterar = `teste-${ano}-${mes}-${dia}-${hora}-${minuto}-${segundo}`

  cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/SerieColecao`,
    headers: {
      accept: 'text/plain',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
	  body: {
      "id": this.idSerieColecao,
      "nome": nomeAlterar,
      "tipo": 1
    },
    failOnStatusCode: false
  }).as('putSerieColecao')
})

Então('retorna o status 200 alterando seriecolecao', function () {
  cy.get('@putSerieColecao').then((response) => {
    cy.log(JSON.stringify(response.body))
    expect(response.status, JSON.stringify(response.body)).to.eq(200)
    expect(this.idSerieColecao).to.exist
  })
})

// Não alterar Série/Coleção sem id  
Quando('envio uma requisição PUT seriecolecao sem id', function () {
  cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/SerieColecao`,
    headers: {
      accept: 'text/plain',
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: {
      "id": " ",
      "nome": "Teste automatizado",
      "tipo": 1
    },
    failOnStatusCode: false
  }).as('putSerieColecao')
})

Então('retorna o status 422 não alterando seriecolecao sem id', function () {
  cy.get('@putSerieColecao').then((response) => {
    expect(response.status).to.eq(422)
  })
})

// Não alterar Série/Coleção sem autenticação
Quando('tento a requisição PUT seriecolecao', function () {
  cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/SerieColecao`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },         
    body: {
      "id": this.idSerieColecao,
      "nome": "Teste automatizado",
      "tipo": 1
    },
    failOnStatusCode: false  
  }).as('putSerieColecao')
})

Então('retorna o status 401 sem alterar seriecolecao', function () {
  cy.get('@putSerieColecao').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Deletar a Série/Coleção
Quando('envio uma requisição DELETE seriecolecao', function () {
  cy.request({
    method: 'DELETE',
    url: Cypress.config('baseUrl') + `/api/v1/SerieColecao/${this.idSerieColecao}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('deleteResponse')
})

Então('retorna o status 200 excluindo seriecolecao', function () {
  cy.get('@deleteResponse').then((response) => {
    cy.log(JSON.stringify(response.body))
    expect(response.status, JSON.stringify(response.body)).to.eq(200)
    expect(this.idSerieColecao).to.exist
  })
})

// Não deletar Série/Coleção sem id   
Quando('envio uma requisição DELETE seriecolecao sem id', function () {
  cy.request({
    method: 'DELETE',
    url: Cypress.config('baseUrl') + `/api/v1/SerieColecao/ `,
    headers: {
      accept: 'text/plain',
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: {
      tipo: 1
    },
    failOnStatusCode: false
  }).as('response')
})

Então('retorna o status 405 não deletando seriecolecao sem id', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(405)
  })
})

// Não deletar Série/Coleção sem autenticação
Quando('tento a requisição DELETE seriecolecao', function () {
  cy.request({
    method: 'DELETE',
    url: Cypress.config('baseUrl') + `/api/v1/SerieColecao/1`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },         
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 401 sem deletar seriecolecao', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})