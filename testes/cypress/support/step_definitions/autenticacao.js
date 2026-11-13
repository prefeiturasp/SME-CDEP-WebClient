import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

const Dado = Given
const Quando = When
const Então = Then

// Realiza a autenticação com sucesso
Dado('que acesso o endpoint de autenticação', function () {  
})

Quando('envio os dados de acesso', function () { 
  return cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/autenticacao`,
    headers: {
      accept: 'text/plain',
      'content-type': 'application/json',
    },
    body: {
      login: `${Cypress.env('LOGIN_ADM_GERAL')}`,
      senha: `${Cypress.env('SENHA')}`
    },
    failOnStatusCode: false
  }).as('response')
})

Então('retorna status 200 com o token válido', function () {
  cy.get('@response').then((response) => {
    expect([200]).to.include(response.status)
    expect(response.body).to.have.property('usuarioNome')
    expect(response.body).to.have.property('usuarioLogin')
    expect(response.body).to.have.property('token')
    expect(response.body).to.have.property('dataHoraExpiracao')
    expect(response.body).to.have.property('email')
    expect(response.body).to.have.property('autenticado')
    expect(response.body).to.have.property('perfilUsuario')
  })
})

// Login deve ser obrigatório
Quando('envio os dados sem o login', function () { 
  return cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/autenticacao`,
    headers: {
      accept: 'text/plain',
      'content-type': 'application/json',
    },
    body: {
      login:" ",
      senha: `${Cypress.env('SENHA')}`
    },
    failOnStatusCode: false
  }).as('response')
})

Então('retorna status 422 que acesso foi inválido', function () {
  cy.get('@response').then((response) => {
    expect([422]).to.include(response.status)
    expect(response.body).to.have.property('mensagens')
    expect(response.body).to.have.property('existemErros')
    expect(response.body.mensagens).to.include("É necessário informar o login.")
    expect(response.body.mensagens).to.include("O login deve conter no mínimo 5 caracteres.")
  })
})

// Senha deve ser obrigatória
Quando('envio os dados sem a senha', function () { 
  return cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/autenticacao`,
    headers: {
      accept: 'text/plain',
      'content-type': 'application/json',
    },
    body: {
      login: `${Cypress.env('LOGIN_ADM_GERAL')}`,
      senha:""
    },
    failOnStatusCode: false
  }).as('response')
})

Então('retorna status 422 que é necessário ser informada', function () {
  cy.get('@response').then((response) => {
    expect([422]).to.include(response.status)
    expect(response.body).to.have.property('mensagens')
    expect(response.body).to.have.property('existemErros')
    expect(response.body.mensagens).to.include("É necessário informar a senha.")
    expect(response.body.mensagens).to.include("A senha deve conter no mínimo 4 caracteres.")
    expect(response.body.existemErros).to.be.true
  })
})

// Não autenticar com senha inválida
Quando('envio os dados com senha inválida', function () { 
  return cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/autenticacao`,
    headers: {
      accept: 'text/plain',
      'content-type': 'application/json',
    },
    body: {
      login: `${Cypress.env('LOGIN_ADM_GERAL')}`,
      senha: `${Cypress.env('SENHA_INVALIDA')}`
    },
    failOnStatusCode: false
  }).as('response')
})

Então('retorna status 601 retorna a mensagem que está incorreta', function () {
  cy.get('@response').then((response) => {
    expect([601]).to.include(response.status)
    expect(response.body).to.have.property('mensagens')
    expect(response.body).to.have.property('existemErros')
    expect(response.body.mensagens).to.include("Usuário ou senha inválidos")
    expect(response.body.existemErros).to.be.true
  })
})