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
  expect(Boolean(token), 'token de acesso foi informado').to.be.true
})

Dado('que não possuo um token de acesso', function () { 
})

// Criar evento no calendário
Quando('envio uma requisição para criar um evento', function () {
  const agora = new Date()

  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + '/api/v1/Evento',
    failOnStatusCode: false,
    headers: {
      accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: {
      justificativa: 'Teste automatizado',
      dia: agora.getDate(),
      mes: agora.getMonth() + 1,
      tipo: 3,
      descricao: 'Teste'
    }
  }).then((response) => {
    cy.log(`Status: ${response.status}`)
    cy.log(`ID evento: ${response.body}`)

    cy.wrap(response).as('response')

    cy.wrap(response.body).as('eventoId')
  })
})

Então('retorna criação do evento com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.be.a('number')
  })
})

// Não cria evento sem envio de campos obrigatório
Quando('envio uma requisição para criar um evento sem campos necesssários', function () {
  const agora = new Date()

  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + '/api/v1/Evento',
    failOnStatusCode: false,
    headers: {
      accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: {
      justificativa: 'Teste automatizado',
      dia: null,
      mes: null,
      tipo: 3,
      descricao: 'Teste'
    }
  }).then((response) => {
    cy.log(`Status: ${response.status}`)
    cy.wrap(response).as('response')
  })
})

Então('não cria evento sem envio de campos obrigatório com status 422', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
  })
})

// Não criar evento no calendário sem autenticação
Quando('tento uma requisição para criar um evento', function () {
  const agora = new Date()

  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + '/api/v1/Evento',
    failOnStatusCode: false,
    headers: {
      accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      Authorization: `Bearer token_invalido`
    },
    body: {
      justificativa: 'Teste automatizado',
      dia: agora.getDate(),
      mes: agora.getMonth() + 1,
      tipo: 3,
      descricao: 'Teste'
    }
  }).then((response) => {
    cy.log(`Status: ${response.status}`)
    cy.wrap(response).as('response')
  })
})

Então('não retorna criação do evento com status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Deletar evento criado
Quando('envio uma requisição DELETE do evento criado', function () {
  cy.get('@eventoId').then((eventoId) => {
    cy.request({
      method: 'DELETE',
      url: Cypress.config('baseUrl') + `/api/v1/Evento/${eventoId}`,
      headers: {
        accept: 'text/plain',
        Authorization: `Bearer ${token}`
      }
    }).as('responseDelete')
  })
})

Então('retorna exclusão do evento com status 200', function () {
  cy.get('@responseDelete').then((response) => {
    expect(response.status).to.eq(200)
  })
})

// Não excluir evento sem o id
Quando('envio uma requisição DELETE sem id evento', function () {  
    cy.request({
      method: 'DELETE',
      url: Cypress.config('baseUrl') + `/api/v1/Evento/`,
      headers: {
        accept: 'text/plain',
        Authorization: `Bearer ${token}`
      },        
    failOnStatusCode: false  
    }).as('responseDelete')
})

Então('não retorna exclusão do evento com status 405', function () {
  cy.get('@responseDelete').then((response) => {
    expect(response.status).to.eq(405)
  })
})

// Não excluir evento no calendário sem autenticação
Quando('tento uma requisição DELETE do evento criado', function () {  
    cy.request({
      method: 'DELETE',
      url: Cypress.config('baseUrl') + `/api/v1/Evento/0`,
      headers: {
        accept: 'text/plain',
        Authorization: `Bearer token_invalido`
      },        
    failOnStatusCode: false  
    }).as('responseDelete')
})

Então('não retorna exclusão do evento com status 401', function () {
  cy.get('@responseDelete').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Buscar com tag de dia e mês
Quando('envio uma requisição GET com tag de evento', function () {
  cy.request({
      method: 'GET',
      url: Cypress.config('baseUrl') + '/api/v1/Evento/eventos-tag?Dia=28&Mes=01',
      headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },        
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna eventos de dia e mês com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)

    expect(response.body).to.exist
    expect(response.body).to.be.an('array')

    if (response.body.length > 0) {
      expect(response.body[0]).to.have.property('tipoId')
      expect(response.body[0]).to.have.property('tipo')
    }
  })
})

// Dia e mês obrigatório na busca
Quando('envio uma requisição GET de tag sem dia e mês', function () {
  cy.request({
      method: 'GET',
      url: Cypress.config('baseUrl') + '/api/v1/Evento/eventos-tag?Dia=&Mes=01',
      headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },        
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna obrigatório nos eventos de dia e mês com status 601', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)

    expect(response.body).to.exist
    expect(response.body).to.be.an('object')

    expect(response.body).to.have.property('mensagens')
    expect(response.body.mensagens).to.be.an('array')

    expect(response.body).to.have.property('existemErros')
    expect(response.body.existemErros).to.be.a('boolean')
  })
})

// Não buscar com tag de dia e mês sem autenticação
Quando('tento uma requisição GET com tag', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Evento/eventos-tag?Dia=28&Mes=01`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('não retorna eventos de dia e mês com status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Buscar mês no calendário
Quando('envio uma requisição GET com mês', function () {
  cy.request({
      method: 'GET',
      url: Cypress.config('baseUrl') + '/api/v1/Evento/calendario/01',
      headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },        
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna eventos do mês no calendário com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)

    expect(response.body).to.exist
    expect(response.body).to.be.an('object')

    expect(response.body).to.have.property('semanas')
    expect(response.body.semanas).to.be.an('array')

    if (response.body.semanas.length > 0) {
      const semana = response.body.semanas[0]

      expect(semana).to.have.property('numero')
      expect(semana).to.have.property('dias')
      expect(semana.dias).to.be.an('array')

      if (semana.dias.length > 0) {
        const dia = semana.dias[0]

        expect(dia).to.have.property('dia')
        expect(dia).to.have.property('dayOfWeek')
        expect(dia).to.have.property('desabilitado')
        expect(dia).to.have.property('eventosTag')
        expect(dia.eventosTag).to.be.an('array')

        if (dia.eventosTag.length > 0) {
          const evento = dia.eventosTag[0]

          expect(evento).to.have.property('tipoId')
          expect(evento).to.have.property('tipo')
        }
      }
    }
  })
})

// Mês no calendário obrigatório na busca
Quando('envio uma requisição GET sem mês do evento', function () {
  cy.request({
      method: 'GET',
      url: Cypress.config('baseUrl') + '/api/v1/Evento/calendario/',
      headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },        
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna obrigatório nos eventos o mês com status 422', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)

    expect(response.body).to.exist
    expect(response.body).to.be.an('object')

    expect(response.body).to.have.property('mensagens')
    expect(response.body.mensagens).to.be.an('array')

    expect(response.body).to.have.property('existemErros')
    expect(response.body.existemErros).to.be.a('boolean')
  })
})

// Não buscar mês no calendário sem autenticação
Quando('tento uma requisição GET com mês', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Evento/calendario/01`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('não retorna mês no calendário com status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Buscar detalhes do evento do dia
Quando('envio uma requisição GET no detalhes do evento', function () {
  cy.request({
      method: 'GET',
      url: Cypress.config('baseUrl') + '/api/v1/Evento/detalhes-dia?Dia=28&Mes=01',
      headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },        
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna detalhes do evento do dia com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)

    expect(response.body).to.exist
    expect(response.body).to.be.an('array')

    if (response.body.length > 0) {
      const evento = response.body[0]

      expect(evento).to.have.property('id')
      expect(evento).to.have.property('tipoId')
      expect(evento).to.have.property('tipo')
      expect(evento).to.have.property('solicitante')
      expect(evento).to.have.property('titulo')
      expect(evento).to.have.property('codigoTombo')
      expect(evento).to.have.property('acervoSolicitacaoId')
      expect(evento).to.have.property('descricao')
      expect(evento).to.have.property('justificativa')
      expect(evento).to.have.property('situacaoSolicitacaoItemId')
      expect(evento).to.have.property('situacaoSolicitacaoItemDescricao')
      expect(evento).to.have.property('horario')
    }
  })
})

// Dia e mês obrigatório no detalhes do evento
Quando('envio uma requisição GET sem dia e mês no detalhes do evento', function () {
  cy.request({
      method: 'GET',
      url: Cypress.config('baseUrl') + '/api/v1/Evento/detalhes-dia?Dia=&Mes=01',
      headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },        
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna obrigatório nos detalhes de dia e mês com status 601', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)

    expect(response.body).to.exist
    expect(response.body).to.be.an('object')

    expect(response.body).to.have.property('mensagens')
    expect(response.body.mensagens).to.be.an('array')

    expect(response.body).to.have.property('existemErros')
    expect(response.body.existemErros).to.be.a('boolean')
  })
})

// Não buscar detalhes do evento do dia sem autenticação
Quando('tento uma requisição GET no detalhes do evento', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/Evento/detalhes-dia?Dia=28&Mes=01`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },          
    failOnStatusCode: false  
  }).as('response')
})

Então('não retorna detalhes de dia e mês com status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Buscar por id do evento
Quando('envio uma requisição GET com id de evento', function () {
   cy.get('@eventoId').then((eventoId) => {
    cy.request({
      method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/Evento/${eventoId}`,
      headers: {
      Authorization: `Bearer ${token}`
      }
    }).as('response')
  })
})

Então('retorna eventos do id com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)

    expect(response.body).to.exist  

    if (response.body.length > 0) {
      expect(response.body[0]).to.have.property('tipoId')
      expect(response.body[0]).to.have.property('tipo')
    }
  })
})

// Id do evento obrigatório na busca
Quando('envio uma requisição GET sem id de evento', function () {
  cy.request({
      method: 'GET',
      url: Cypress.config('baseUrl') + '/api/v1/Evento/0',
      headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },        
    failOnStatusCode: false  
  }).as('response')
})

Então('retorna obrigatório sem id evento com status 601', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)

    expect(response.body).to.exist
    expect(response.body).to.be.an('object')

    expect(response.body).to.have.property('mensagens')
    expect(response.body.mensagens).to.be.an('array')

    expect(response.body).to.have.property('existemErros')
    expect(response.body.existemErros).to.be.a('boolean')
  })
})

// Não buscar id do evento sem autenticação
Quando('tento uma requisição GET com id de evento', function () { 
   cy.request({
      method: 'GET',
      url: Cypress.config('baseUrl') + '/api/v1/Evento/0',
      headers: {
      accept: 'text/plain',
      Authorization: `Bearer token_invalido`
    },        
    failOnStatusCode: false  
  }).as('response')
})

Então('não retorna eventos do id com status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
