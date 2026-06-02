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

// Retornar o crédito autor resumido
Quando('envio uma requisição GET para resumo de crédito autor', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/CreditoAutor/resumido`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 200 com o crédito autor resumido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)    
  })
})

// Retornar o crédito autor resumido do tipo 1
Quando('envio uma requisição GET para crédito resumido 1', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/CreditoAutor/resumido?tipo=1`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 200 com o crédito autor resumido do tipo 1', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)    
  })
})

// Retornar o crédito autor resumido do tipo 2
Quando('envio uma requisição GET para crédito resumido 2', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/CreditoAutor/resumido?tipo=2`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 200 com o crédito autor resumido do tipo 2', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)    
  })
})

// Retornar o crédito autor resumido do tipo 3
Quando('envio uma requisição GET para crédito resumido 3', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/CreditoAutor/resumido?tipo=3`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 200 com o crédito autor resumido do tipo 3', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)    
  })
})

// Não retorna crédito autor resumido sem autenticação
Quando('tento a requisição GET para resumo de crédito autor', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/CreditoAutor/resumido`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 401 sem crédito autor resumido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Retornar o crédito autor
Quando('envio uma requisição GET para crédito autor', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/CreditoAutor`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 200 com o crédito autor', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)    
  })
})

// Retornar o crédito autor do tipo 1
Quando('envio uma requisição GET para crédito 1', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/CreditoAutor?Tipo=1`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 200 com o crédito autor do tipo 1', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)    
  })
})

// Retornar o crédito autor do tipo 2
Quando('envio uma requisição GET para crédito 2', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/CreditoAutor?Tipo=2`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 200 com o crédito autor do tipo 2', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)    
  })
})

// Retornar o crédito autor do tipo 3
Quando('envio uma requisição GET para crédito 3', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/CreditoAutor?Tipo=3`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 200 com o crédito autor do tipo 3', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)    
  })
})

// Não retorna crédito autor sem autenticação
Quando('tento a requisição GET para crédito autor', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/CreditoAutor`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 401 sem crédito autor', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Retornar o crédito autor por id
Quando('envio uma requisição GET com id crédito autor', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/CreditoAutor/1`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 200 do id crédito autor', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(204)    
  })
})

// Não retorna crédito autor por id sem autenticação
Quando('tento a requisição GET com id crédito autor', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/CreditoAutor/1`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 401 sem id crédito autor', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Criar o crédito autor
Quando('envio uma requisição POST crédito autor', function () {
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
    url: Cypress.config('baseUrl') + `/api/v1/CreditoAutor`,
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

Então('retorna o status 200 criando crédito autor', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)

    const id = response.body

    cy.log(`id criado: ${id}`)

    expect(id).to.exist

    this.idCreditoAutor = id
  })
})

// Não criar o crédito autor sem nome 
Quando('envio a requisição POST crédito autor', function () {
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/CreditoAutor`,
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

Então('retorna o status 422 não criando crédito autor sem nome', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)

    const body = response.body

    cy.log(`id: ${body}`)

    expect(body).to.exist

  })
})

// Não criar crédito autor sem autenticação
Quando('tento a requisição POST crédito autor', function () {
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
    url: Cypress.config('baseUrl') + `/api/v1/CreditoAutor`,
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

Então('retorna o status 401 sem criar crédito autor', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Alterar o crédito autor
Quando('envio uma requisição PUT crédito autor', function () {
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
    url: Cypress.config('baseUrl') + `/api/v1/CreditoAutor`,
    headers: {
      accept: 'text/plain',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
	  body: {
      "id": this.idCreditoAutor,
      "nome": nomeAlterar,
      "tipo": 1
    },
    failOnStatusCode: false
  }).as('putCreditoAutor')
})

Então('retorna o status 200 alterando crédito autor', function () {
  cy.get('@putCreditoAutor').then((response) => {
    cy.log(JSON.stringify(response.body))
    expect(response.status, JSON.stringify(response.body)).to.eq(200)
    expect(this.idCreditoAutor).to.exist
  })
})

// Não alterar crédito autor sem id  
Quando('envio uma requisição PUT crédito autor sem id', function () {
  cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/CreditoAutor`,
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
  }).as('putCreditoAutor')
})

Então('retorna o status 422 não alterando crédito autor sem id', function () {
  cy.get('@putCreditoAutor').then((response) => {
    expect(response.status).to.eq(422)
  })
})

// Não alterar crédito autor sem autenticação
Quando('tento a requisição PUT crédito autor', function () {
  cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/CreditoAutor`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },         
    body: {
      "id": this.idCreditoAutor,
      "nome": "Teste automatizado",
      "tipo": 1
    },
    failOnStatusCode: false  
  }).as('putCreditoAutor')
})

Então('retorna o status 401 sem alterar crédito autor', function () {
  cy.get('@putCreditoAutor').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Deletar o crédito autor
Quando('envio uma requisição DELETE crédito autor', function () {
  cy.request({
    method: 'DELETE',
    url: Cypress.config('baseUrl') + `/api/v1/CreditoAutor/${this.idCreditoAutor}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('deleteResponse')
})

Então('retorna o status 200 excluindo crédito autor', function () {
  cy.get('@deleteResponse').then((response) => {
    cy.log(JSON.stringify(response.body))
    expect(response.status, JSON.stringify(response.body)).to.eq(200)
    expect(this.idCreditoAutor).to.exist
  })
})

// Não deletar crédito autor sem id  
Quando('envio uma requisição DELETE crédito autor sem id', function () {
  cy.request({
    method: 'DELETE',
    url: Cypress.config('baseUrl') + `/api/v1/CreditoAutor/ `,
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

Então('retorna o status 405 não deletando crédito autor sem id', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(405)
  })
})

// Não deletar crédito autor sem autenticação
Quando('tento a requisição DELETE crédito autor', function () {
  cy.request({
    method: 'DELETE',
    url: Cypress.config('baseUrl') + `/api/v1/CreditoAutor/1`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },         
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 401 sem deletar crédito autor', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})