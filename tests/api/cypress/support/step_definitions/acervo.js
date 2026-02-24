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

// Retornar os tipos de acervos
When('envio uma requisição GET para acervos tipos', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Acervo/tipos`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    }, 
    timeout: 3000,          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 200 com os tipos de acervos cadastrados', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.be.an('array').and.to.have.length.greaterThan(0)

    response.body.forEach((item) => {
      expect(item).to.have.property('id').and.to.be.a('number')
      expect(item).to.have.property('nome').and.to.be.a('string').and.not.be.empty
    })
  })
})

// Retornar todos os acervos
When('envio uma requisição GET para o cadastro de acervos', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Acervo`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    }, 
    timeout: 3000,          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 200 com todos os acervos cadastrados', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)

    const body = response.body
    const items = Array.isArray(body) ? body : body.items

    expect(items).to.be.an('array').and.to.have.length.greaterThan(0)

    items.forEach((item) => {
      expect(item).to.have.property('acervoId').and.to.be.a('number')
      expect(item).to.have.property('tipoAcervo').and.to.be.a('string')
      expect(item).to.have.property('tipoAcervoId')
      expect(item).to.have.property('titulo')
      expect(item).to.have.property('creditoAutoria')
      expect(item).to.have.property('codigo')
      expect(item).to.have.property('data')
      expect(item).to.have.property('capaDocumento')
      expect(item).to.have.property('editora')
    })

    if (!Array.isArray(body)) {
      expect(body).to.have.property('totalPaginas')
      expect(body).to.have.property('totalRegistros')
      expect(body.totalPaginas).to.be.a('number')
      expect(body.totalRegistros).to.be.a('number')
    }
  })
})

// Busca por tipo, título e código
When('envio uma requisição GET com os dados do acervos', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Acervo?TipoAcervo=${Cypress.env('TIPO_ACERVO')}&Titulo=${Cypress.env('TITULO_ACERVO')}&Codigo=${Cypress.env('CODIGO_ACERVO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    }, 
    timeout: 3000,          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 200 e tipo, título e código', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)

    const body = response.body
    const items = Array.isArray(body) ? body : body.items

    expect(items).to.be.an('array').and.to.have.length.greaterThan(0)

    items.forEach((item) => {
      expect(item).to.have.property('acervoId').and.to.be.a('number')
      expect(item).to.have.property('tipoAcervo').and.to.be.a('string')
      expect(item).to.have.property('tipoAcervoId')
      expect(item).to.have.property('titulo')
      expect(item).to.have.property('creditoAutoria')
      expect(item).to.have.property('codigo')
      expect(item).to.have.property('data')
      expect(item).to.have.property('capaDocumento')
      expect(item).to.have.property('editora')
    })

    if (!Array.isArray(body)) {
      expect(body).to.have.property('totalPaginas')
      expect(body).to.have.property('totalRegistros')
      expect(body.totalPaginas).to.be.a('number')
      expect(body.totalRegistros).to.be.a('number')
    }
  })
})

// Busca por tipo
When('envio uma requisição GET com o id do tipo', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Acervo?TipoAcervo=${Cypress.env('TIPO_ACERVO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    }, 
    timeout: 3000,          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 200 mostrando os acervos do código', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)

    const body = response.body
    const items = Array.isArray(body) ? body : body.items

    expect(items).to.be.an('array').and.to.have.length.greaterThan(0)

    items.forEach((item) => {
      expect(item).to.have.property('acervoId').and.to.be.a('number')
      expect(item).to.have.property('tipoAcervo').and.to.be.a('string')
      expect(item).to.have.property('tipoAcervoId')
      expect(item).to.have.property('titulo')
      expect(item).to.have.property('creditoAutoria')
      expect(item).to.have.property('codigo')
      expect(item).to.have.property('data')
      expect(item).to.have.property('capaDocumento')
      expect(item).to.have.property('editora')
    })

    if (!Array.isArray(body)) {
      expect(body).to.have.property('totalPaginas')
      expect(body).to.have.property('totalRegistros')
      expect(body.totalPaginas).to.be.a('number')
      expect(body.totalRegistros).to.be.a('number')
    }
  })
})

// Busca por título
When('envio uma requisição GET com a descrição do título', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Acervo?Titulo=${Cypress.env('TITULO_ACERVO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    }, 
    timeout: 3000,          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 200 mostrando os acervos da descrição', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)

    const body = response.body
    const items = Array.isArray(body) ? body : body.items

    expect(items).to.be.an('array').and.to.have.length.greaterThan(0)

    items.forEach((item) => {
      expect(item).to.have.property('acervoId').and.to.be.a('number')
      expect(item).to.have.property('tipoAcervo').and.to.be.a('string')
      expect(item).to.have.property('tipoAcervoId')
      expect(item).to.have.property('titulo')
      expect(item).to.have.property('creditoAutoria')
      expect(item).to.have.property('codigo')
      expect(item).to.have.property('data')
      expect(item).to.have.property('capaDocumento')
      expect(item).to.have.property('editora')
    })

    if (!Array.isArray(body)) {
      expect(body).to.have.property('totalPaginas')
      expect(body).to.have.property('totalRegistros')
      expect(body.totalPaginas).to.be.a('number')
      expect(body.totalRegistros).to.be.a('number')
    }
  })
})

// Busca por código
When('envio uma requisição GET com o código do acervo', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Acervo?Codigo=${Cypress.env('CODIGO_ACERVO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    }, 
    timeout: 3000,          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 200 referente aos cadastrados', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)

    const body = response.body
    const items = Array.isArray(body) ? body : body.items

    expect(items).to.be.an('array').and.to.have.length.greaterThan(0)

    items.forEach((item) => {
      expect(item).to.have.property('acervoId').and.to.be.a('number')
      expect(item).to.have.property('tipoAcervo').and.to.be.a('string')
      expect(item).to.have.property('tipoAcervoId')
      expect(item).to.have.property('titulo')
      expect(item).to.have.property('creditoAutoria')
      expect(item).to.have.property('codigo')
      expect(item).to.have.property('data')
      expect(item).to.have.property('capaDocumento')
      expect(item).to.have.property('editora')
    })

    if (!Array.isArray(body)) {
      expect(body).to.have.property('totalPaginas')
      expect(body).to.have.property('totalRegistros')
      expect(body.totalPaginas).to.be.a('number')
      expect(body.totalRegistros).to.be.a('number')
    }
  })
})

// Não retornar os tipos de acervos sem autenticação
When('tento a requisição GET para acervos tipos', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Acervo`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 401 sem os tipos de acervos cadastrados', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Pesquisar acervos
When('envio uma requisição GET para endpoint de pesquisar', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Acervo/pesquisar-acervos`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    }, 
    timeout: 3000,          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 200 pesquisando o acervo com sucesso', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.have.property('items')
    expect(response.body).to.have.property('totalPaginas')
    expect(response.body).to.have.property('totalRegistros')
    expect(response.body.items[0]).to.have.property('codigo')
    expect(response.body.items[0]).to.have.property('tipo')
    expect(response.body.items[0]).to.have.property('titulo')
    expect(response.body.items[0]).to.have.property('editora')
    expect(response.body.items[0]).to.have.property('creditoAutoria')
    expect(response.body.items[0]).to.have.property('assunto')
    expect(response.body.items[0]).to.have.property('descricao')
    expect(response.body.items[0]).to.have.property('tipoAcervoTag')
    expect(response.body.items[0]).to.have.property('enderecoImagem')
    expect(response.body.items[0]).to.have.property('dataAcervo')
    expect(response.body.items[0]).to.have.property('ano')
    expect(response.body.items[0]).to.have.property('acervoId')
    expect(response.body.items[0]).to.have.property('enderecoImagemPadrao')
    expect(response.body.items[0]).to.have.property('situacaoDisponibilidade')
    expect(response.body.items[0]).to.have.property('estaDisponivel')
    expect(response.body.items[0]).to.have.property('temControleDisponibilidade')
  })
})

// Pesquisar por tipo de acervo
When('envio uma requisição GET pesquisando pelo tipo', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Acervo/pesquisar-acervos?TipoAcervo=${Cypress.env('TIPO_ACERVO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    }, 
    timeout: 3000,          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 200 através do tipo de acervo', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.have.property('items')
    expect(response.body).to.have.property('totalPaginas')
    expect(response.body).to.have.property('totalRegistros')
    expect(response.body.items[0]).to.have.property('codigo')
    expect(response.body.items[0]).to.have.property('tipo')
    expect(response.body.items[0]).to.have.property('titulo')
    expect(response.body.items[0]).to.have.property('editora')
    expect(response.body.items[0]).to.have.property('creditoAutoria')
    expect(response.body.items[0]).to.have.property('assunto')
    expect(response.body.items[0]).to.have.property('descricao')
    expect(response.body.items[0]).to.have.property('tipoAcervoTag')
    expect(response.body.items[0]).to.have.property('enderecoImagem')
    expect(response.body.items[0]).to.have.property('dataAcervo')
    expect(response.body.items[0]).to.have.property('ano')
    expect(response.body.items[0]).to.have.property('acervoId')
    expect(response.body.items[0]).to.have.property('enderecoImagemPadrao')
    expect(response.body.items[0]).to.have.property('situacaoDisponibilidade')
    expect(response.body.items[0]).to.have.property('estaDisponivel')
    expect(response.body.items[0]).to.have.property('temControleDisponibilidade')
  })
})

// Pesquisar por tipo e texto livre do acervo
When('envio a requisição GET filtrando a pesquisa', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Acervo/pesquisar-acervos?TipoAcervo=${Cypress.env('TIPO_ACERVO_CODIGO')}&TextoLivre=${Cypress.env('TEXTO_LIVRE')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    }, 
    timeout: 3000,          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 200 através do tipo e texto livre do acervo', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.have.property('items')
    expect(response.body).to.have.property('totalPaginas')
    expect(response.body).to.have.property('totalRegistros')
    expect(response.body.items[0]).to.have.property('codigo')
    expect(response.body.items[0]).to.have.property('tipo')
    expect(response.body.items[0]).to.have.property('titulo')
    expect(response.body.items[0]).to.have.property('editora')
    expect(response.body.items[0]).to.have.property('creditoAutoria')
    expect(response.body.items[0]).to.have.property('assunto')
    expect(response.body.items[0]).to.have.property('descricao')
    expect(response.body.items[0]).to.have.property('tipoAcervoTag')
    expect(response.body.items[0]).to.have.property('enderecoImagem')
    expect(response.body.items[0]).to.have.property('dataAcervo')
    expect(response.body.items[0]).to.have.property('ano')
    expect(response.body.items[0]).to.have.property('acervoId')
    expect(response.body.items[0]).to.have.property('enderecoImagemPadrao')
    expect(response.body.items[0]).to.have.property('situacaoDisponibilidade')
    expect(response.body.items[0]).to.have.property('estaDisponivel')
    expect(response.body.items[0]).to.have.property('temControleDisponibilidade')
  })
})

// Pesquisar por tipo, texto livre do acervo e ano inicial
When('envio a requisição GET filtrando o pesquisar', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Acervo/pesquisar-acervos?TipoAcervo=${Cypress.env('TIPO_ACERVO_CODIGO')}&TextoLivre=${Cypress.env('TEXTO_LIVRE')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    }, 
    timeout: 3000,          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 200 através do tipo, texto livre do acervo e ano inicial do acervo', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.have.property('items')
    expect(response.body).to.have.property('totalPaginas')
    expect(response.body).to.have.property('totalRegistros')
    expect(response.body.items[0]).to.have.property('codigo')
    expect(response.body.items[0]).to.have.property('tipo')
    expect(response.body.items[0]).to.have.property('titulo')
    expect(response.body.items[0]).to.have.property('editora')
    expect(response.body.items[0]).to.have.property('creditoAutoria')
    expect(response.body.items[0]).to.have.property('assunto')
    expect(response.body.items[0]).to.have.property('descricao')
    expect(response.body.items[0]).to.have.property('tipoAcervoTag')
    expect(response.body.items[0]).to.have.property('enderecoImagem')
    expect(response.body.items[0]).to.have.property('dataAcervo')
    expect(response.body.items[0]).to.have.property('ano')
    expect(response.body.items[0]).to.have.property('acervoId')
    expect(response.body.items[0]).to.have.property('enderecoImagemPadrao')
    expect(response.body.items[0]).to.have.property('situacaoDisponibilidade')
    expect(response.body.items[0]).to.have.property('estaDisponivel')
    expect(response.body.items[0]).to.have.property('temControleDisponibilidade')
  })
})

// Pesquisar por tipo, texto livre do acervo e ano inicial/final
When('envio a requisição GET filtrando todos os campos', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Acervo/pesquisar-acervos?TipoAcervo=${Cypress.env('TIPO_ACERVO_CODIGO')}&TextoLivre=${Cypress.env('TEXTO_LIVRE')}&AnoInicial=${Cypress.env('ANO_INICIAL')}&AnoFinal=${Cypress.env('ANO_FINAL')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    }, 
    timeout: 3000,          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 200 do tipo, texto livre do acervo e ano inicial e final do acervo', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.have.property('items')
    expect(response.body).to.have.property('totalPaginas')
    expect(response.body).to.have.property('totalRegistros')
    expect(response.body.items[0]).to.have.property('codigo')
    expect(response.body.items[0]).to.have.property('tipo')
    expect(response.body.items[0]).to.have.property('titulo')
    expect(response.body.items[0]).to.have.property('editora')
    expect(response.body.items[0]).to.have.property('creditoAutoria')
    expect(response.body.items[0]).to.have.property('assunto')
    expect(response.body.items[0]).to.have.property('descricao')
    expect(response.body.items[0]).to.have.property('tipoAcervoTag')
    expect(response.body.items[0]).to.have.property('enderecoImagem')
    expect(response.body.items[0]).to.have.property('dataAcervo')
    expect(response.body.items[0]).to.have.property('ano')
    expect(response.body.items[0]).to.have.property('acervoId')
    expect(response.body.items[0]).to.have.property('enderecoImagemPadrao')
    expect(response.body.items[0]).to.have.property('situacaoDisponibilidade')
    expect(response.body.items[0]).to.have.property('estaDisponivel')
    expect(response.body.items[0]).to.have.property('temControleDisponibilidade')
  })
})

// Retornar o termo de compromisso
When('envio uma requisição GET das condições aceitas', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Acervo/termo-compromisso`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    }, 
    timeout: 3000,          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 200 do termo de compromisso', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
})

// Não retornar o termo de compromisso sem autenticação
When('tento a requisição GET das condições aceitas', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Acervo/termo-compromisso`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 401 sem o termo de compromisso', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Pesquisa por código tombo
When('envio uma requisição GET de pesquisa', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Acervo/pesquisar?CodigoTombo=${Cypress.env('CODIGO_TOMBO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    }, 
    timeout: 3000,          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 200 a pesquisa por código tombo', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.have.property('id')
    expect(response.body.id).to.be.a('number').and.to.be.greaterThan(0)
    expect(response.body).to.have.property('nome').and.not.be.empty
    expect(response.body).to.have.property('codigo').and.not.be.empty
  })
})

// Código tombo é obrigatório na pesquisa
When('envio uma requisição GET de pesquisar sem código tombo', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Acervo/pesquisar?CodigoTombo=`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    }, 
    timeout: 3000,          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 422 informando que o código tombo é obrigatório', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    expect(response.body).to.have.property('existemErros', true)
    expect(response.body).to.have.property('mensagens').that.is.an('array').and.not.empty
  })
})

// Não pesquisa por código tombo sem autenticação
When('tento a requisição GET de pesquisa', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Acervo/pesquisar?CodigoTombo=${Cypress.env('CODIGO_TOMBO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 401 sem a pesquisa por código tombo', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Detalhar o acervo
When('envio uma requisição GET de pesquisa com código e tipo', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Acervo/detalhar-acervo?Codigo=${Cypress.env('CODIGO_ACERVO')}&Tipo=${Cypress.env('TIPO_ACERVO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    }, 
    timeout: 3000,          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 200 detalhando o acervo', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
})

// Código tombo é obrigatório para detalhar
When('envio uma requisição GET de pesquisar sem código', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Acervo/detalhar-acervo?Codigo=&Tipo=${Cypress.env('TIPO_ACERVO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    }, 
    timeout: 3000,          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 422 informando sem código ao detalhar', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    expect(response.body).to.have.property('existemErros', true)
    expect(response.body).to.have.property('mensagens').that.is.an('array').and.not.empty
    expect(response.body.mensagens[0]).to.eq("The Codigo field is required.") 
  })
})

// Tipo é obrigatório para detalhar
When('envio uma requisição GET de pesquisar sem o tipo', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Acervo/detalhar-acervo?Codigo=${Cypress.env('CODIGO_ACERVO')}&Tipo=`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    }, 
    timeout: 3000,          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 422 informando que o código tombo é obrigatório', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    expect(response.body).to.have.property('existemErros', true)
    expect(response.body).to.have.property('mensagens').that.is.an('array').and.not.empty
    expect(response.body.mensagens[0]).to.eq("The value '' is invalid.") 
  })
})

// Autocompletar o termo pesquisado
When('envio uma requisição GET de pesquisa com o texto', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Acervo/autocompletar-titulo?termoPesquisado=${Cypress.env('TERMO_PESQUISADO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    }, 
    timeout: 3000,          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 200 autocompletando a pesquisa', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
})

// Termo é obrigatório para autocompletar
When('envio uma requisição GET de pesquisa sem o texto', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Acervo/autocompletar-titulo?termoPesquisado=`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    }, 
    timeout: 3000,          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 422 informando que o termo é obrigatório', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    expect(response.body).to.have.property('existemErros', true)
    expect(response.body).to.have.property('mensagens').that.is.an('array').and.not.empty
    expect(response.body.mensagens[0]).to.eq("The termoPesquisado field is required.") 
  })
})

// Não autocompletar o termo sem autenticação
When('tento a requisição GET de pesquisa com o texto', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Acervo/autocompletar-titulo?termoPesquisado=${Cypress.env('TERMO_PESQUISADO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 401 sem autocompletar', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})