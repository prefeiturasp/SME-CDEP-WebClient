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

// Criar cadastro de editora
Quando('envio uma requisição POST editora', function () {
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
    url: Cypress.config('baseUrl') + `/api/v1/Editora`,
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

Então('retorna o status 200 criando editora', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)

    const id = response.body

    cy.log(`id criado: ${id}`)

    expect(id).to.exist

    this.idEditora = id
  })
})

// Não criar a editora sem nome 
Quando('envio a requisição POST editora', function () {
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/Editora`,
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

Então('retorna o status 422 não criando editora sem nome', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)

    const body = response.body

    cy.log(`id: ${body}`)

    expect(body).to.exist

  })
})

// Não criar editora sem autenticação
Quando('tento a requisição POST editora', function () {
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
    url: Cypress.config('baseUrl') + `/api/v1/Editora`,
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

Então('retorna o status 401 sem criar editora', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Retornar editora por id
Quando('envio uma requisição GET com id editora', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Editora/${this.idEditora}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 200 do id editora', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)    
  })
})

// Não retorna editora por id sem autenticação
Quando('tento a requisição GET com id editora', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Editora/${this.idEditora}`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 401 sem id editora', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Retornar editora resumido
Quando('envio uma requisição GET para resumo de editora', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Editora/resumido`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 200 com editora resumido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)    
  })
})

// Não retorna editora resumido sem autenticação
Quando('tento a requisição GET para resumo de editora', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Editora/resumido`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 401 sem editora resumido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Retornar cadastro de editora
Quando('envio uma requisição GET para editora', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Editora`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 200 com editora', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)    
  })
})

// Não retorna editora sem autenticação
Quando('tento a requisição GET para editora', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Editora`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 401 sem editora', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Alterar a editora
Quando('envio uma requisição PUT editora', function () {
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
    url: Cypress.config('baseUrl') + `/api/v1/Editora`,
    headers: {
      accept: 'text/plain',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
	  body: {
      "id": this.idEditora,
      "nome": nomeAlterar,
      "tipo": 1
    },
    failOnStatusCode: false
  }).as('putEditora')
})

Então('retorna o status 200 alterando editora', function () {
  cy.get('@putEditora').then((response) => {
    cy.log(JSON.stringify(response.body))
    expect(response.status, JSON.stringify(response.body)).to.eq(200)
    expect(this.idEditora).to.exist
  })
})

// Não alterar editora sem id  
Quando('envio uma requisição PUT editora sem id', function () {
  cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/Editora`,
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
  }).as('putEditora')
})

Então('retorna o status 422 não alterando editora sem id', function () {
  cy.get('@putEditora').then((response) => {
    expect(response.status).to.eq(422)
  })
})

// Não alterar editora sem autenticação
Quando('tento a requisição PUT editora', function () {
  cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/Editora`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },         
    body: {
      "id": this.idEditora,
      "nome": "Teste automatizado",
      "tipo": 1
    },
    failOnStatusCode: false  
  }).as('putEditora')
})

Então('retorna o status 401 sem alterar editora', function () {
  cy.get('@putEditora').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Deletar a editora
Quando('envio uma requisição DELETE editora', function () {
  cy.request({
    method: 'DELETE',
    url: Cypress.config('baseUrl') + `/api/v1/Editora/${this.idEditora}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('deleteResponse')
})

Então('retorna o status 200 excluindo editora', function () {
  cy.get('@deleteResponse').then((response) => {
    cy.log(JSON.stringify(response.body))
    expect(response.status, JSON.stringify(response.body)).to.eq(200)
    expect(this.idEditora).to.exist
  })
})

// Não deletar editora sem id   
Quando('envio uma requisição DELETE editora sem id', function () {
  cy.request({
    method: 'DELETE',
    url: Cypress.config('baseUrl') + `/api/v1/Editora/ `,
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

Então('retorna o status 405 não deletando editora sem id', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(405)
  })
})

// Não deletar editora sem autenticação
Quando('tento a requisição DELETE editora', function () {
  cy.request({
    method: 'DELETE',
    url: Cypress.config('baseUrl') + `/api/v1/Editora/1`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },         
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 401 sem deletar editora', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})