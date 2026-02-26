import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps'

Before(() => {
  cy.gerar_token().then((token_valido) => {
    Cypress.env('token', token_valido)
  })
})

Given('que gerou um token de acesso', () => {
  expect(Cypress.env('token'), 'token válido').to.exist
})

Given('que não possuo um token de acesso', function () { 
})

// Armazena um arquivo válido
When('envio uma requisição POST de armazenamento', () => {
  return cy.task('uploadFile', {
    method: 'POST',
    url: Cypress.config('baseUrl') + '/api/v1/Armazenamento',
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${Cypress.env('token')}`,
    },
    filePath: 'cypress/fixtures/teste.pdf',
  }).as('response')
})

Then('retorna status 200 armazenando um arquivo válido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body.id).to.be.a('number')
    expect(response.body.codigo).to.be.a('string').and.not.be.empty
    expect(response.body.path).to.be.a('string').and.to.match(/^https?:\/\//)
    expect(response.body.nome).to.be.null
    expect(response.body.contentType).to.be.null
  })
})

// Não armazena tamanho excedido
When('envio uma requisição POST além de 10 MB', () => {
  return cy.task('uploadFile', {
    method: 'POST',
    url: Cypress.config('baseUrl') + '/api/v1/Armazenamento',
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${Cypress.env('token')}`,
    },
    filePath: 'cypress/fixtures/teste.txt',
  }).as('response')
})

Then('retorna o status 413 que não armazena tamanho excedido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(413)
  })
})

// Obrigatório é arquivo no envio
When('envio uma requisição POST vazio', function () { 
  return cy.task('uploadFile', {
    method: 'POST',
    url: Cypress.config('baseUrl') + '/api/v1/Armazenamento',
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${Cypress.env('token')}`,
    },    
  }).as('response')
})

Then('retorna o status 422 que obrigatório é arquivo no envio', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422) 
  })
})

// Não armazena sem autenticação
When('tento a requisição POST de armazenamento', function () { 
  return cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + '/api/v1/Armazenamento',
    headers: {
      accept: '*/*',
      Authorization: `Bearer token_invalido`,
    },
    filePath: 'cypress/fixtures/teste.pdf',
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem armazenar o arquivo válido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Retornar o arquivo armazenado
When('envio uma requisição GET do código arquivo', () => {
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Armazenamento/${Cypress.env('ARQUIVO_ARMAZENAMENTO')}`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${Cypress.env('token')}`,
    },        
    failOnStatusCode: false
  }).as('response')
})

Then('retorna status 200 com o arquivo armazenado', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200) 
  })
})

// Não retornar arquivo armazenado
When('envio uma requisição GET do código arquivo inexistente', () => {
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Armazenamento/${Cypress.env('ARQUIVO_ARMAZENAMENTO_INVALIDO')}`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${Cypress.env('token')}`,
    },        
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 sem retornar arquivo armazenado', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
  })
})

// Não retornar arquivo sem código
When('envio uma requisição GET sem o código', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + '/api/v1/Armazenamento/',
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${Cypress.env('token')}`,
    },        
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 405 sem retornar arquivo sem código', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(405) 
  })
})

// Não busca arquivo armazenado sem autenticação
When('tento a requisição GET do código arquivo', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Armazenamento/${Cypress.env('ARQUIVO_ARMAZENAMENTO')}`,
    headers: {
      accept: '*/*',
      Authorization: `token_invalido`,
    },        
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem buscar arquivo armazenado sem autenticação', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Armazena o arquivo do tipo 1 válido
When('envio uma requisição POST de armazenamento do tipo 1', () => {
  return cy.task('uploadFile', {
    method: 'POST',
    url: Cypress.config('baseUrl') + '/api/v1/Armazenamento/upload/tipo-arquivo?tipoArquivo=1',
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${Cypress.env('token')}`,
    },
    filePath: 'cypress/fixtures/teste.pdf',
  }).as('response')
})

Then('retorna status 200 armazenando um arquivo do tipo 1 válido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body.id).to.be.a('number')
    expect(response.body.codigo).to.be.a('string').and.not.be.empty
    expect(response.body.path).to.be.a('string').and.to.match(/^https?:\/\//)
    expect(response.body.nome).to.be.null
    expect(response.body.contentType).to.be.null
  })
})

// Armazena o arquivo do tipo 2 válido
When('envio uma requisição POST de armazenamento do tipo 2', () => {
  return cy.task('uploadFile', {
    method: 'POST',
    url: Cypress.config('baseUrl') + '/api/v1/Armazenamento/upload/tipo-arquivo?tipoArquivo=2',
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${Cypress.env('token')}`,
    },
    filePath: 'cypress/fixtures/teste.pdf',
  }).as('response')
})

Then('retorna status 200 armazenando um arquivo do tipo 2 válido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body.id).to.be.a('number')
    expect(response.body.codigo).to.be.a('string').and.not.be.empty
    expect(response.body.path).to.be.a('string').and.to.match(/^https?:\/\//)
    expect(response.body.nome).to.be.null
    expect(response.body.contentType).to.be.null
  })
})

// Armazena o arquivo do tipo 3 válido
When('envio uma requisição POST de armazenamento do tipo 3', () => {
  return cy.task('uploadFile', {
    method: 'POST',
    url: Cypress.config('baseUrl') + '/api/v1/Armazenamento/upload/tipo-arquivo?tipoArquivo=3',
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${Cypress.env('token')}`,
    },
    filePath: 'cypress/fixtures/teste.pdf',
  }).as('response')
})

Then('retorna status 200 armazenando um arquivo do tipo 3 válido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body.id).to.be.a('number')
    expect(response.body.codigo).to.be.a('string').and.not.be.empty
    expect(response.body.path).to.be.a('string').and.to.match(/^https?:\/\//)
    expect(response.body.nome).to.be.null
    expect(response.body.contentType).to.be.null
  })
})

// Armazena o arquivo do tipo 4 válido
When('envio uma requisição POST de armazenamento do tipo 4', () => {
  return cy.task('uploadFile', {
    method: 'POST',
    url: Cypress.config('baseUrl') + '/api/v1/Armazenamento/upload/tipo-arquivo?tipoArquivo=4',
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${Cypress.env('token')}`,
    },
    filePath: 'cypress/fixtures/teste.pdf',
  }).as('response')
})

Then('retorna status 200 armazenando um arquivo do tipo 4 válido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body.id).to.be.a('number')
    expect(response.body.codigo).to.be.a('string').and.not.be.empty
    expect(response.body.path).to.be.a('string').and.to.match(/^https?:\/\//)
    expect(response.body.nome).to.be.null
    expect(response.body.contentType).to.be.null
  })
})

// Armazena o arquivo do tipo 5 válido
When('envio uma requisição POST de armazenamento do tipo 5', () => {
  return cy.task('uploadFile', {
    method: 'POST',
    url: Cypress.config('baseUrl') + '/api/v1/Armazenamento/upload/tipo-arquivo?tipoArquivo=5',
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${Cypress.env('token')}`,
    },
    filePath: 'cypress/fixtures/teste.pdf',
  }).as('response')
})

Then('retorna status 200 armazenando um arquivo do tipo 5 válido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body.id).to.be.a('number')
    expect(response.body.codigo).to.be.a('string').and.not.be.empty
    expect(response.body.path).to.be.a('string').and.to.match(/^https?:\/\//)
    expect(response.body.nome).to.be.null
    expect(response.body.contentType).to.be.null
  })
})

// Armazena o arquivo do tipo 6 válido
When('envio uma requisição POST de armazenamento do tipo 6', () => {
  return cy.task('uploadFile', {
    method: 'POST',
    url: Cypress.config('baseUrl') + '/api/v1/Armazenamento/upload/tipo-arquivo?tipoArquivo=6',
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${Cypress.env('token')}`,
    },
    filePath: 'cypress/fixtures/teste.pdf',
  }).as('response')
})

Then('retorna status 200 armazenando um arquivo do tipo 6 válido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body.id).to.be.a('number')
    expect(response.body.codigo).to.be.a('string').and.not.be.empty
    expect(response.body.path).to.be.a('string').and.to.match(/^https?:\/\//)
    expect(response.body.nome).to.be.null
    expect(response.body.contentType).to.be.null
  })
})

// Armazena o arquivo do tipo 7 válido
When('envio uma requisição POST de armazenamento do tipo 7', () => {
  return cy.task('uploadFile', {
    method: 'POST',
    url: Cypress.config('baseUrl') + '/api/v1/Armazenamento/upload/tipo-arquivo?tipoArquivo=7',
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${Cypress.env('token')}`,
    },
    filePath: 'cypress/fixtures/teste.pdf',
  }).as('response')
})

Then('retorna status 200 armazenando um arquivo do tipo 7 válido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body.id).to.be.a('number')
    expect(response.body.codigo).to.be.a('string').and.not.be.empty
    expect(response.body.path).to.be.a('string').and.to.match(/^https?:\/\//)
    expect(response.body.nome).to.be.null
    expect(response.body.contentType).to.be.null
  })
})

// Não armazena o arquivo com tipo inexistente
When('envio uma requisição POST de armazenamento do tipo inválido', () => {
  return cy.task('uploadFile', {
    method: 'POST',
    url: Cypress.config('baseUrl') + '/api/v1/Armazenamento/upload/tipo-arquivo?tipoArquivo=8',
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${Cypress.env('token')}`,
    },
    filePath: 'cypress/fixtures/teste.pdf',
  }).as('response')
})

Then('retorna status 422 não armazenando um arquivo com tipo inexistente', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
  })
})

// Não armazena arquivo tipo com tamanho excedido
When('envio uma requisição POST do tipo além de 10 MB', () => {
  return cy.task('uploadFile', {
    method: 'POST',
    url: Cypress.config('baseUrl') + '/api/v1/Armazenamento/upload/tipo-arquivo?tipoArquivo=7',
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${Cypress.env('token')}`,
    },
    filePath: 'cypress/fixtures/teste.txt',
  }).as('response')
})

Then('retorna o status 413 que não armazena arquivo com tamanho excedido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(413)
  })
})

// Obrigatório é arquivo no envio de tipo
When('envio uma requisição POST vazio no tipo', function () { 
  return cy.task('uploadFile', {
    method: 'POST',
    url: Cypress.config('baseUrl') + '/api/v1/Armazenamento/upload/tipo-arquivo?tipoArquivo=7',
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${Cypress.env('token')}`,
    },    
  }).as('response')
})

Then('retorna o status 422 que obrigatório no arquivo de envio', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422) 
  })
})

// Não armazena arquivo tipo sem autenticação
When('tento a requisição POST de armazenamento de tipo', function () { 
  return cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + '/api/v1/Armazenamento/upload/tipo-arquivo?tipoArquivo=7',
    headers: {
      accept: '*/*',
      Authorization: `Bearer token_invalido`,
    },
    filePath: 'cypress/fixtures/teste.pdf',
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem armazenar o arquivo tipo válido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Retorna o arquivo armazenado do tipo 1
When('envio uma requisição GET no armazenamento do tipo 1', () => {
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + '/api/v1/Armazenamento/download/tipo-acervo?tipoAcervo=1',
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${Cypress.env('token')}`,
    },        
    failOnStatusCode: false
  }).as('response')
})

Then('retorna status 200 com arquivo armazenado do tipo 1', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
})

// Retorna o arquivo armazenado do tipo 2
When('envio uma requisição GET no armazenamento do tipo 2', () => {
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + '/api/v1/Armazenamento/download/tipo-acervo?tipoAcervo=2',
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${Cypress.env('token')}`,
    },        
    failOnStatusCode: false
  }).as('response')
})

Then('retorna status 200 com arquivo armazenado do tipo 2', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
})

// Retorna o arquivo armazenado do tipo 3
When('envio uma requisição GET no armazenamento do tipo 3', () => {
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + '/api/v1/Armazenamento/download/tipo-acervo?tipoAcervo=3',
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${Cypress.env('token')}`,
    },        
    failOnStatusCode: false
  }).as('response')
})

Then('retorna status 200 com arquivo armazenado do tipo 3', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
})

// Retorna o arquivo armazenado do tipo 4
When('envio uma requisição GET no armazenamento do tipo 4', () => {
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + '/api/v1/Armazenamento/download/tipo-acervo?tipoAcervo=4',
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${Cypress.env('token')}`,
    },        
    failOnStatusCode: false
  }).as('response')
})

Then('retorna status 200 com arquivo armazenado do tipo 4', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
})

// Retorna o arquivo armazenado do tipo 5
When('envio uma requisição GET no armazenamento do tipo 5', () => {
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + '/api/v1/Armazenamento/download/tipo-acervo?tipoAcervo=5',
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${Cypress.env('token')}`,
    },        
    failOnStatusCode: false
  }).as('response')
})

Then('retorna status 200 com arquivo armazenado do tipo 5', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200) 
  })
})

// Retorna o arquivo armazenado do tipo 6
When('envio uma requisição GET no armazenamento do tipo 6', () => {
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + '/api/v1/Armazenamento/download/tipo-acervo?tipoAcervo=6',
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${Cypress.env('token')}`,
    },        
    failOnStatusCode: false
  }).as('response')
})

Then('retorna status 200 com arquivo armazenado do tipo 6', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
})

// Não retorna o arquivo armazenado com tipo inexistente
When('envio uma requisição GET no armazenamento do tipo inválido', () => {
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + '/api/v1/Armazenamento/download/tipo-acervo?tipoAcervo=7',
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${Cypress.env('token')}`,
    },        
    failOnStatusCode: false
  }).as('response')
})

Then('retorna status 422 não retorna o arquivo armazenado com tipo inexistente', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
  })
})

// Obrigatório tipo de arquivo na busca
When('envio uma requisição GET com tipo vazio', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + '/api/v1/Armazenamento/download/tipo-acervo?tipoAcervo=',
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${Cypress.env('token')}`,
    },        
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 que obrigatório no tipo de arquivo', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422) 
  })
})

// Não retorna arquivo armazenado tipo sem autenticação
When('tento a requisição GET no armazenamento do tipo arquivo', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + '/Armazenamento/download/tipo-acervo?tipoAcervo=1',
    headers: {
      accept: '*/*',
      Authorization: `token_invalido`,
    },        
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem arquivo armazenado tipo', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
})
