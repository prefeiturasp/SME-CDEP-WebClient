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

// Busca por todos os assuntos
When('envio uma requisição GET sem assunto específico', function () {
  cy.request({
      method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/Assunto?nome=`,
      headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },        
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 200 com todos os assuntos', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
})

// Busca por assunto específico
When('envio uma requisição GET com assunto', function () {
  cy.request({
      method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/Assunto?nome=${Cypress.env('ASSUNTO_NOME')}`,
      headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },        
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 200 com os dados do assunto específico', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
})

// Não busca por assunto sem autenticação
When('tento uma requisição GET de assunto', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Assunto?nome=`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },          
    failOnStatusCode: false  
  }).as('response')
})

Then('não busca por assunto sem autenticação retornando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Busca por assunto resumido
When('envio a requisição GET', function () {
  cy.request({
      method: 'GET',
      url: Cypress.config('baseUrl') + '/api/v1/Assunto/resumido',
      headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },        
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 200 com assunto resumido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.be.an('array').and.not.be.empty

    expect(response.body[0]).to.have.property('id')
    expect(response.body[0].id).to.be.a('number').and.to.be.greaterThan(0)

    expect(response.body[0]).to.have.property('nome')
    expect(response.body[0].nome).to.be.a('string').and.not.be.empty
  })
})

// Não busca por assunto resumido sem autenticação
When('tento uma requisição GET', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Assunto/resumido`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },          
    failOnStatusCode: false  
  }).as('response')
})

Then('não busca por assunto resumido sem autenticação retornando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Busca por todos itens de assuntos
When('envio uma requisição GET de assunto', function () {
  cy.request({
      method: 'GET',
      url: Cypress.config('baseUrl') + '/api/v1/Assunto/',
      headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },        
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 200 com itens de assuntos', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
})

// Busca por id do assunto
When('envio uma requisição GET do id assunto', function () {
  cy.request({
      method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/Assunto/${Cypress.env('ASSUNTO_ID')}`,
      headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },        
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 200 os dados do assunto', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
})

// Não busca por id do assunto sem autenticação
When('tento a requisição GET de assunto', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Assunto/${Cypress.env('ASSUNTO_ID')}`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },          
    failOnStatusCode: false  
  }).as('response')
})

Then('não busca por id do assunto sem autenticação retornando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Cria novo assunto
When('envio uma requisição POST', function () {
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
    url: Cypress.config('baseUrl') + `/api/v1/Assunto`,
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

Then('retorna o status 200 criando o novo assunto', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
})

// Nome do assunto deve ser informado
When('envio uma requisição POST sem preenchimento', function () {
  cy.request({
      method: 'POST',
      url: Cypress.config('baseUrl') + `/api/v1/Assunto`,
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

Then('retorna o status 601 o nome do assunto deve ser informado', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)
    expect(response.body).to.have.property('mensagens')
    expect(response.body).to.have.property('existemErros')
    expect(response.body.mensagens).to.include("Nome não informado")
    expect(response.body.existemErros).to.be.true
  })
})

// Não insere nome existente
When('envio uma requisição POST com o mesmo preenchimento', function () {
  cy.request({
      method: 'POST',
      url: Cypress.config('baseUrl') + '/api/v1/Assunto',
      headers: {
      accept: 'text/plain',
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: {
      nome: `${Cypress.env('ASSUNTO_NOME')}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 601 sem inserir nome existente', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601) 
  })
})

// Não cria novo assunto sem autenticação
When('tento uma requisição POST', function () { 
  return cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/Assunto`,
    headers: {
      accept: 'text/plain',
      'content-type': 'application/json',
      Authorization: 'Bearer token_invalido'
    },
    body: {
      nome: `${Cypress.env('ASSUNTO_NOME')}`
    },          
    failOnStatusCode: false  
  }).as('response')
})

Then('não cria novo assunto sem autenticação retornando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Altera o cadastro do assunto
When('envio uma requisição PUT', function () {
  const agora = new Date()
  const ano = agora.getFullYear()
  const mes = String(agora.getMonth() + 1).padStart(2, '0')
  const dia = String(agora.getDate()).padStart(2, '0')
  const hora = String(agora.getHours()).padStart(2, '0')
  const minuto = String(agora.getMinutes()).padStart(2, '0')

  const nomeDinamico = `teste-${ano}-${mes}-${dia}-${hora}-${minuto}`

  cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + '/api/v1/Assunto',
    headers: {
      accept: 'text/plain',
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: {
      id: `${Cypress.env('ASSUNTO_ID')}`,
      nome: nomeDinamico
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 alterando o cadastro do assunto', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
})

// Nome do assunto deve ser informado na alteração
When('envio uma requisição PUT sem preenchimento', function () {
  cy.request({
      method: 'PUT',
      url: Cypress.config('baseUrl') + '/api/v1/Assunto',
      headers: {
      accept: 'text/plain',
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: {
      id: `${Cypress.env('ASSUNTO_ID')}`,
      nome: ` `
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 601 que o nome do assunto deve ser informado na alteração', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)
    expect(response.body).to.have.property('mensagens')
    expect(response.body).to.have.property('existemErros')
    expect(response.body.mensagens).to.include("Nome não informado")
    expect(response.body.existemErros).to.be.true
  })
})

// Não altera nome existente
When('envio uma requisição PUT com o mesmo preenchimento', function () {
  cy.request({
      method: 'PUT',
      url: Cypress.config('baseUrl') + '/api/v1/Assunto',
      headers: {
      accept: 'text/plain',
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: {
      id: `${Cypress.env('ASSUNTO_ID')}`,
      nome: `${Cypress.env('ASSUNTO_NOME')}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 601 não alterando nome existente', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601) 
  })
})

// Não altera o cadastro do assunto sem autenticação
When('tento uma requisição PUT', function () { 
  return cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/Assunto`,
    headers: {
      accept: 'text/plain',
      'content-type': 'application/json',
      Authorization: 'Bearer token_invalido'
    },
    body: {
      id: `${Cypress.env('ASSUNTO_ID')}`,
      nome: `${Cypress.env('ASSUNTO_NOME')}`
    },          
    failOnStatusCode: false  
  }).as('response')
})

Then('não altera assunto sem autenticação retornando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Deletar o cadastro do assunto
function getMaiorIdAcimaDe757() {
  return cy.request({
    method: 'GET',
    url: `${Cypress.config('baseUrl')}/api/v1/Assunto`, 
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).then((res) => {
   
    const lista = Array.isArray(res.body) ? res.body : (res.body?.items || [])
    const ids = lista
      .map(item => item.id)
      .filter(id => typeof id === 'number' && id > 757)

    const maiorId = ids.length ? Math.max(...ids) : null
    return maiorId
  })
}

// Deletar o cadastro do assunto (busca maior id > 757 antes)
When('envio uma requisição DELETE', function () {
  getMaiorIdAcimaDe757().then((maiorId) => {
    const idParaDeletar = maiorId ?? 758

    cy.request({
      method: 'DELETE',
      url: `${Cypress.config('baseUrl')}/api/v1/Assunto/${idParaDeletar}`,
      headers: {
        accept: 'text/plain',
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      failOnStatusCode: false
    }).as('response')
  })
})

Then('retorna o status 200 deletando o cadastro do assunto', function () {
  cy.get('@response').then((response) => {   
    expect(response.status).to.eq(200)
  })
})

// Não deleta o assunto sem ID
When('envio uma requisição DELETE sem o assunto', function () {
  cy.request({
      method: 'DELETE',
      url: Cypress.config('baseUrl') + '/api/v1/Assunto/',
      headers: {
      accept: 'text/plain',
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 405 que não foi possível deletar o assunto sem ID', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(405) 
  })
})

// Não deleta o assunto com ID inválido
When('envio uma requisição DELETE com o assunto inválido', function () {
  cy.request({
      method: 'DELETE',
      url: Cypress.config('baseUrl') + `/api/v1/Assunto/${Cypress.env('ASSUNTO_ID_INVALIDO')}`,
      headers: {
      accept: 'text/plain',
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 500 que não foi possível deletar o assunto inválido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500) 
  })
})

// Não deletar o cadastro do assunto sem autenticação
When('tento uma requisição DELETE', function () { 
  return cy.request({
    method: 'DELETE',
    url: Cypress.config('baseUrl') + `/api/v1/Assunto/${Cypress.env('ASSUNTO_ID')}`,
    headers: {
      accept: 'text/plain',
      'content-type': 'application/json',
      Authorization: 'Bearer token_invalido'
    },        
    failOnStatusCode: false  
  }).as('response')
})

Then('não deleta assunto sem autenticação retornando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})