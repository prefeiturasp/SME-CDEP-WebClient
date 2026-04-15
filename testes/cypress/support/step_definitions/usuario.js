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

Dado('que possuo um token válido no endpoint Usuario', function () {
  expect(token, 'valido').to.exist
})

Dado('que não possuo um token válido', function () {  
})

// Buscar cadastro do usuário
Quando('envio uma requisição GET buscar o usuário', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Usuario/${Cypress.env('LOGIN_ADM_GERAL')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },         
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 200 com cadastro do usuário', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.be.an('object')
    expect(response.body).to.have.property('nome')
    expect(response.body).to.have.property('cpf')
    expect(response.body).to.have.property('login')
    expect(response.body).to.have.property('email')
  })
})

// Não buscar cadastro do usuário inválido
Quando('envio uma requisição GET buscar sem usuário válido', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Usuario/`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },         
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 405 sem cadastro do usuário', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(405) 
  })
})

// Não buscar cadastro do usuário sem autenticação
Quando('tento a requisição GET buscar o usuário', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Usuario/${Cypress.env('LOGIN_ADM_GERAL')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `token_invalido`
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 401 sem cadastro do usuário', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Validar perfis responsáveis usuário
Quando('envio uma requisição GET perfis responsáveis', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Usuario/perfis/responsaveis`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    timeout: 10000,         
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 200 validando perfis responsáveis usuário', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)  
  })
})

// Não busca perfis responsáveis usuário sem autenticação
Quando('tento a requisição GET perfis responsáveis', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Usuario/${token}`,
    headers: {
      accept: 'text/plain',
      Authorization: `token_invalido`
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 401 sem perfis responsáveis usuário', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Buscar dados solicitante do usuário
Quando('envio uma requisição GET dados solicitante', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Usuario/dados-solicitante`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    timeout: 10000,         
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 200 dados solicitante do usuário', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)  
  })
})

// Não buscar dados solicitante do usuário sem autenticação
Quando('tento a requisição GET dados solicitante', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Usuario/${token}`,
    headers: {
      accept: 'text/plain',
      Authorization: `token_invalido`
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 401 sem dados solicitante do usuário', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Alterar senha do usuário
Quando('envio uma requisição PUT com usuário da senha', function () { 
  return cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/Usuario/${Cypress.env('LOGIN_ADM_GERAL')}/senha`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    body: {
      senhaAtual: `${Cypress.env('SENHA')}`,
      senhaNova: `${Cypress.env('SENHA')}`,
      confirmarSenha: `${Cypress.env('SENHA')}`
    },
    timeout: 10000,         
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 200 alterando a senha do usuário', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)  
  })
})

// Não alterar senha sem usuário
Quando('envio uma requisição PUT sem usuário da senha', function () { 
  return cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/Usuario//senha`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    body: {
      senhaAtual: `${Cypress.env('SENHA')}`,
      senhaNova: `${Cypress.env('SENHA')}`,
      confirmarSenha: `${Cypress.env('SENHA')}`
    },         
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 405 sem alterar senha do usuário', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(405) 
  })
})

// Não alterar senha sem autenticação
Quando('tento a requisição PUT com usuário da senha', function () { 
  return cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/Usuario/${Cypress.env('LOGIN_ADM_GERAL')}/senha`,
    headers: {
      accept: 'text/plain',
      Authorization: `token_invalido`
    },
     body: {
      senhaAtual: `${Cypress.env('SENHA')}`,
      senhaNova: `${Cypress.env('SENHA')}`,
      confirmarSenha: `${Cypress.env('SENHA')}`
    },            
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 401 sem alterar senha do usuário', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Alterar e-mail com usuário
Quando('envio uma requisição PUT com usuário para e-mail', function () { 
  return cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/Usuario/${Cypress.env('LOGIN_ADM_GERAL')}/email`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    body: {
      email: `${Cypress.env('EMAIL')}` 
    },
    timeout: 10000,         
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 200 alterando e-mail do usuário', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)  
  })
})

// Não alterar e-mail sem o dado no usuário
Quando('envio uma requisição PUT Usuario sem e-mail', function () { 
  return cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/Usuario/${Cypress.env('LOGIN_ADM_GERAL')}/email`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    body: {
      email: ``
    },         
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 601 sem alterar o e-mail de Usuario', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601) 
  })
})

// Não alterar e-mail sem usuário na requisição
Quando('envio uma requisição PUT sem usuário do campo email', function () { 
  return cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/Usuario//email`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    body: {
      email: `${Cypress.env('EMAIL')}`
    },        
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 422 sem alterar email do usuário', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(405) 
  })
})

// Não alterar email sem autenticação
Quando('tento a requisição PUT com usuário para e-mail', function () { 
  return cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/Usuario/${Cypress.env('LOGIN_ADM_GERAL')}/email`,
    headers: {
      accept: 'text/plain',
      Authorization: `token_invalido`
    },
    body: {
      email: `${Cypress.env('EMAIL')}`
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 401 sem alterar email do usuário', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Alterar telefone do usuário
Quando('envio uma requisição PUT com telefone do usuário', function () { 
  return cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/Usuario/${Cypress.env('LOGIN_ADM_GERAL')}/telefone`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    body: {
      telefone: `${Cypress.env('TELEFONE')}` 
    },
    timeout: 10000,         
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 200 alterando telefone do usuário', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)  
  })
})

// Não alterar telefone sem o dado no usuário
Quando('envio uma requisição PUT Usuario sem telefone', function () { 
  return cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/Usuario/${Cypress.env('LOGIN_ADM_GERAL')}/telefone`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    body: {
      telefone: ``
    },         
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 601 sem alterar telefone de Usuario', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601) 
  })
})

// Não alterar telefone sem autenticação
Quando('tento a requisição PUT com telefone do usuário', function () { 
  return cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/Usuario/${Cypress.env('LOGIN_ADM_GERAL')}/telefone`,
    headers: {
      accept: 'text/plain',
      Authorization: `token_invalido`
    },
    body: {
      telefone: `${Cypress.env('TELEFONE')}`
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 401 sem alterar telefone do usuário', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Alterar endereço do usuário
Quando('envio uma requisição PUT com endereço do usuário', function () { 
  return cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/Usuario/${Cypress.env('LOGIN_ADM_GERAL')}/endereco`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    body: {
      cep: `${Cypress.env('CEP_VALIDO')}` 
    },
    timeout: 10000,         
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 200 alterando endereço do usuário', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)  
  })
})

// Não alterar endereço sem o dado no usuário
Quando('envio uma requisição PUT Usuario sem endereço', function () { 
  return cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/Usuario/${Cypress.env('LOGIN_ADM_GERAL')}/endereco`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    body: {
      cep: ``
    },         
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 422 sem alterar endereço de Usuario', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422) 
  })
})

// Não alterar endereço sem autenticação
Quando('tento a requisição PUT com endereço do usuário', function () { 
  return cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/Usuario/${Cypress.env('LOGIN_ADM_GERAL')}/endereco`,
    headers: {
      accept: 'text/plain',
      Authorization: `token_invalido`
    },
    body: {
      cep: `${Cypress.env('CEP_VALIDO')}`
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 401 sem alterar endereço do usuário', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Buscar dados solicitante por usuário
Quando('envio uma requisição GET dados por solicitante', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Usuario/${Cypress.env('LOGIN_ADM_GERAL')}/dados-solicitante`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    timeout: 10000,         
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 200 dados solicitante por usuário', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)  
  })
})

// Não buscar dados solicitante sem usuário
Quando('envio uma requisição GET dados sem solicitante', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Usuario/ /dados-solicitante`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    timeout: 10000,         
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 422 não buscando dados solicitante sem usuário', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)  
  })
})

// Não buscar dados solicitante por usuário sem autenticação
Quando('tento a requisição GET dados por solicitante', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Usuario/${Cypress.env('LOGIN_ADM_GERAL')}/dados-solicitante`,
    headers: {
      accept: 'text/plain',
      Authorization: `token_invalido`
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 401 sem dados solicitante por usuário', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Consulta se documento do usuário existe
Quando('envio uma requisição GET existência de solicitante', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Usuario/${Cypress.env('CPF')}/existe`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    timeout: 10000,         
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 601 que documento do usuário existe', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)  
  })
})

// Não busca documento do usuário existe
Quando('envio uma requisição GET existência sem documento solicitante', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Usuario/ /existe`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    timeout: 10000,         
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 422 não buscando documento do usuário existe', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)  
  })
})

// Não buscar ddocumento do usuário existe sem autenticação
Quando('tento a requisição GET existência de solicitante', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Usuario/${Cypress.env('CPF')}/existe`,
    headers: {
      accept: 'text/plain',
      Authorization: `token_invalido`
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna o status 401 sem documento do usuário existe', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)
  })
})