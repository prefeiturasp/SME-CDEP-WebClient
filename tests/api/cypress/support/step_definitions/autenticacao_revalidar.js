import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'


Given('que possuo um token de acesso válido', function () {
})

// Deve revalidar o token do usuário
When('envio uma requisição POST para revalidar o token', function () {
  cy.gerar_token().then((token) => {
    cy.request({
      method: 'POST',
      url: Cypress.config('baseUrl') + '/api/v1/autenticacao/revalidar',
      headers: {
        accept: 'text/plain',
        'content-Type': 'application/json'
      },
      body: {
        token: token 
      },
      failOnStatusCode: false
    }).as('response')
  })
})

Then('retorna a expiração com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.have.property('dataHoraExpiracao')
    expect(response.body).to.have.property('token')
  })
})

// Não revalidar token inválido
When('tento a requisição POST para revalidar o token', function () { 
  return cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/autenticacao/revalidar`,
    headers: {
      accept: 'text/plain',
      'content-Type': 'application/json'
    },
     body: {
      token: 'token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('não revalida retornando o status 601 de inválido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)
    expect(response.body).to.have.property('existemErros', true)
    expect(response.body).to.have.property('mensagens').that.is.an('array').and.not.empty
    expect(response.body.mensagens[0]).to.eq("Token inválido") 
  })
})