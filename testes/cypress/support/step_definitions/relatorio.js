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

// Gerar relatório de controle de acervo
When('envio uma requisição POST no controle de acervo', function () {
  cy.request({
      method: 'POST',
      url: Cypress.config('baseUrl') + '/api/v1/relatorios/controle-acervo',
      headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
  body: {
    "situacaoAcervo": 1,
    "tipoAcervo": 1
    },        
  failOnStatusCode: false  
  }).as('response')
})

Then('gera o controle de acervo com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(204)
  })
})

// Situação obrigatória ao gerar relatório de controle de acervo
When('envio uma requisição POST no controle de acervo sem situação', function () {
  cy.request({
      method: 'POST',
      url: Cypress.config('baseUrl') + '/api/v1/relatorios/controle-acervo',
      headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
  body: {
    "situacaoAcervo": null,
    "tipoAcervo": 1
    },        
  failOnStatusCode: false  
  }).as('response')
})

Then('situação é obrigatório ao gerar relatório de controle de acervo', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
  })
})

// Tipo obrigatório ao gerar relatório de controle de acervo
When('envio uma requisição POST no controle de acervo sem tipo', function () {
  cy.request({
      method: 'POST',
      url: Cypress.config('baseUrl') + '/api/v1/relatorios/controle-acervo',
      headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
  body: {
    "situacaoAcervo": 1,
    "tipoAcervo": null
    },        
  failOnStatusCode: false  
  }).as('response')
})

Then('tipo é obrigatório ao gerar relatório de controle de acervo', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
  })
})

// Não gerar relatório de controle de acervo sem autenticação
When('tento uma requisição POST no controle de acervo', function () { 
  return cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + '/api/v1/relatorios/controle-acervo',
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },
    body: {
    "situacaoAcervo": 1,
    "tipoAcervo": 1
    },           
    failOnStatusCode: false  
  }).as('response')
})

Then('não gera o controle de acervo retornando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Gerar relatório de controle de acervo autor
When('envio uma requisição POST no controle de acervo autor', function () {
  cy.request({
      method: 'POST',
      url: Cypress.config('baseUrl') + '/api/v1/relatorios/controle-acervo-autor',
      headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
  body: {
  "autores": [
    0
  ],
  "tipoAcervo": 1
  },        
  failOnStatusCode: false  
  }).as('response')
})

Then('gera o controle de acervo autor com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(204)
  })
})

// Autor obrigatório ao gerar relatório de controle de crédito 
When('envio uma requisição POST no controle de acervo sem o autor', function () {
  cy.request({
      method: 'POST',
      url: Cypress.config('baseUrl') + '/api/v1/relatorios/controle-acervo-autor',
      headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
  body: {
    "autores": 0,
    "tipoAcervo": 1
    },        
  failOnStatusCode: false  
  }).as('response')
})

Then('autor é obrigatório ao gerar relatório de controle do acervo', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
  })
})

// Tipo obrigatório ao gerar relatório de controle de acervo autor
When('envio uma requisição POST no controle de acervo autor sem tipo', function () {
  cy.request({
      method: 'POST',
      url: Cypress.config('baseUrl') + '/api/v1/relatorios/controle-acervo-autor',
      headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
  body: {
    "autores": 1,
    "tipoAcervo": null
    },        
  failOnStatusCode: false  
  }).as('response')
})

Then('tipo é obrigatório ao gerar relatório de controle de acervo autor', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
  })
})

// Não gerar relatório de controle de acervo autor sem autenticação
When('tento uma requisição POST no controle de acervo autor', function () { 
  return cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + '/api/v1/relatorios/controle-acervo-autor',
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },
    body: {
    "autores": 1,
    "tipoAcervo": 1
    },           
    failOnStatusCode: false  
  }).as('response')
})

Then('não gera o controle de acervo autor retornando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Gerar relatório de controle de devolução de livros
When('envio uma requisição POST no controle de livros', function () {
  cy.request({
      method: 'POST',
      url: Cypress.config('baseUrl') + '/api/v1/relatorios/controle-devolucao-livros',
      headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
  body: {
  "solicitante": Cypress.env('PERFIL_ADM_GERAL'),
  "somenteEmAtraso": false
  },        
  failOnStatusCode: false  
  }).as('response')
})

Then('gera o controle de devolução de livros com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(204)
  })
})

// Gerar relatório de controle de livros sem solicitante
When('envio uma requisição POST no controle de devolução de livros sem solicitante', function () {
  cy.request({
      method: 'POST',
      url: Cypress.config('baseUrl') + '/api/v1/relatorios/controle-devolucao-livros',
      headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
  body: {
    "solicitante": null,
    "somenteEmAtraso": false
  },        
  failOnStatusCode: false  
  }).as('response')
})

Then('gera relatório de controle de livros sem solicitante', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(204)
  })
})

// Campo de atraso obrigatório ao gerar relatório de controle de livros
When('envio uma requisição POST no controle de acervo autor sem atraso', function () {
  cy.request({
      method: 'POST',
      url: Cypress.config('baseUrl') + '/api/v1/relatorios/controle-devolucao-livros',
      headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
  body: {
    "solicitante": null,
    "somenteEmAtraso": null
  },           
  failOnStatusCode: false  
  }).as('response')
})

Then('campo de atraso obrigatório ao gerar relatório de controle de livros', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
  })
})

// Não gerar relatório de controle de livros sem autenticação
When('tento uma requisição POST no controle de livros', function () { 
  return cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + '/api/v1/relatorios/controle-devolucao-livros',
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },
    body: {
      "solicitante": Cypress.env('PERFIL_ADM_GERAL'),
      "somenteEmAtraso": false
  },          
  failOnStatusCode: false  
  }).as('response')
})

Then('não gera o controle de livros retornando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Gerar relatório de controle de editora
When('envio uma requisição POST no controle de editora', function () {
  cy.request({
      method: 'POST',
      url: Cypress.config('baseUrl') + '/api/v1/relatorios/controle-editora',
      headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
  body: {
  "editoraId": [
    0
  ]},        
  failOnStatusCode: false  
  }).as('response')
})

Then('gera relatório de controle de editora com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(204)
  })
})

// Editora obrigatória ao gerar relatório de controle
When('envio uma requisição POST no controle sem editora', function () {
  cy.request({
      method: 'POST',
      url: Cypress.config('baseUrl') + '/api/v1/relatorios/controle-editora',
      headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
  body: {
  "editoraId": [
    null
  ]},             
  failOnStatusCode: false  
  }).as('response')
})

Then('editora obrigatória ao gerar relatório de controle', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
  })
})

// Não gerar relatório de controle de editora sem autenticação
When('tento uma requisição POST no controle de editora', function () { 
  return cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + '/api/v1/relatorios/controle-editora',
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },
  body: {
  "editoraId": [
    0
  ]},          
  failOnStatusCode: false  
  }).as('response')
})

Then('não gera o controle de editora retornando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Gerar relatório de controle de livros emprestados
When('envio uma requisição POST no controle de emprestados', function () {
  cy.request({
      method: 'POST',
      url: Cypress.config('baseUrl') + '/api/v1/relatorios/controle-livros-emprestados',
      headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
  body: {
  "solicitante": Cypress.env('PERFIL_ADM_GERAL'),
  "tombo": Cypress.env('CODIGO_TOMBO'),
  "situacaoSolicitacaoItem": 1,
  "situacaoEmprestimo": [
    1
  ],
  "modelo": 1,
  "somenteDevolvidos": true
  },        
  failOnStatusCode: false  
  }).as('response')
})

Then('gera relatório de controle de livros emprestados com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(204)
  })
})

// Modelo é obrigatório ao gerar relatório de controle de emprestados
When('envio uma requisição POST no controle de emprestados sem modelo', function () {
  cy.request({
      method: 'POST',
      url: Cypress.config('baseUrl') + '/api/v1/relatorios/controle-livros-emprestados',
      headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
  body: {
  "solicitante": Cypress.env('PERFIL_ADM_GERAL'),
  "tombo": Cypress.env('CODIGO_TOMBO'),
  "situacaoSolicitacaoItem": 1,
  "situacaoEmprestimo": [
    1
  ],
  "modelo": null,
  "somenteDevolvidos": true
  },             
  failOnStatusCode: false  
  }).as('response')
})

Then('não gera o controle de livros emprestados retornando o status 422', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
  })
})

// Não gerar relatório de controle de editora sem autenticação
When('tento uma requisição POST no controle de emprestados', function () { 
  return cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + '/api/v1/relatorios/controle-livros-emprestados',
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },
  body: {
  "solicitante": Cypress.env('PERFIL_ADM_GERAL'),
  "tombo": Cypress.env('CODIGO_TOMBO'),
  "situacaoSolicitacaoItem": 1,
  "situacaoEmprestimo": [
    1
  ],
  "modelo": 1,
  "somenteDevolvidos": true
  },        
  failOnStatusCode: false  
  }).as('response')
})

Then('não gera o controle de livros emprestados retornando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Gerar relatório de títulos mais pesquisados
When('envio uma requisição POST no controle de títulos', function () {
  cy.request({
      method: 'POST',
      url: Cypress.config('baseUrl') + '/api/v1/relatorios/titulos-mais-pesquisados',
      headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
  body: {
  "dataInicio": Cypress.env('DATA_DEVOLUCAO'),
  "dataFim": Cypress.env('DATA_DEVOLUCAO'),
  "tipoAcervos": [ 1 ]
  },        
  failOnStatusCode: false  
  }).as('response')
})

Then('gera relatório de títulos mais pesquisados com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(204)
  })
})

// Período é obrigatório ao gerar relatório de controle de emprestados
When('envio uma requisição POST no controle de títulos sem período', function () {
  cy.request({
      method: 'POST',
      url: Cypress.config('baseUrl') + '/api/v1/relatorios/titulos-mais-pesquisados',
      headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
  body: {
  "dataInicio": null,
  "dataFim": null,
  "tipoAcervos": [ 1 ]
  },             
  failOnStatusCode: false  
  }).as('response')
})

Then('não gera de títulos mais pesquisados retornando o status 422', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
  })
})

// Não gerar relatório de títulos mais pesquisados sem autenticação
When('tento uma requisição POST no controle de títulos', function () { 
  return cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + '/api/v1/relatorios/titulos-mais-pesquisados',
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },
  body: {
  "dataInicio": Cypress.env('DATA_DEVOLUCAO'),
  "dataFim": Cypress.env('DATA_DEVOLUCAO'),
  "tipoAcervos": [ 1 ]
  },        
  failOnStatusCode: false  
  }).as('response')
})

Then('não gera o relatório de títulos mais pesquisados retornando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Gerar relatório de controle de download acervo
When('envio uma requisição POST no controle de download', function () {
  cy.request({
      method: 'POST',
      url: Cypress.config('baseUrl') + '/api/v1/relatorios/controle-download-acervo',
      headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
  body: {
  "titulo": Cypress.env('TITULO_ACERVO'),
  "tipoAcervo": 1
  },        
  failOnStatusCode: false  
  }).as('response')
})

Then('gera relatório de download acervo com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(204)
  })
})

// Não gerar relatório de controle de download acervo sem autenticação
When('tento uma requisição POST no controle de download', function () { 
  return cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + '/api/v1/relatorios/controle-download-acervo',
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },
  body: {
  "titulo": null,
  "tipoAcervo": 1
  },        
  failOnStatusCode: false  
  }).as('response')
})

Then('não gera o relatório de download acervo retornando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Gerar relatório de histórico de solicitações acervo
When('envio uma requisição POST no relatório de histórico acervo', function () {
  cy.request({
      method: 'POST',
      url: Cypress.config('baseUrl') + '/api/v1/relatorios/historico-solicitacoes-acervo',
      headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
  body: {
  "solicitante": Cypress.env('PERFIL_ADM_GERAL'),
  "dataInicio": Cypress.env('DATA_DEVOLUCAO'),
  "dataFim": Cypress.env('DATA_DEVOLUCAO'),
  "tipoAcervo": [
    1
  ],
  "situacaoSolicitacao": [
    1
  ]
},        
  failOnStatusCode: false  
  }).as('response')
})

Then('gera relatório de histórico de solicitações acervo com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(204)
  })
})

// Não gerar histórico de solicitações acervo sem período
When('envio uma requisição POST no relatório de histórico acervo sem período', function () {
  cy.request({
      method: 'POST',
      url: Cypress.config('baseUrl') + '/api/v1/relatorios/historico-solicitacoes-acervo',
      headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
  body: {
  "solicitante": Cypress.env('PERFIL_ADM_GERAL'),
  "dataInicio": null,
  "dataFim": null,
  "tipoAcervo": [
    1
  ],
  "situacaoSolicitacao": [
    1
  ]
},        
  failOnStatusCode: false  
  }).as('response')
})

Then('não gera relatório de histórico de solicitações acervo com status 422', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
  })
})

// Não gerar histórico de solicitações acervo sem autenticação
When('tento uma requisição POST no relatório de histórico acervo', function () { 
  return cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + '/api/v1/relatorios/historico-solicitacoes-acervo',
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },
   body: {
  "solicitante": Cypress.env('PERFIL_ADM_GERAL'),
  "dataInicio": Cypress.env('DATA_DEVOLUCAO'),
  "dataFim": Cypress.env('DATA_DEVOLUCAO'),
  "tipoAcervo": [
    1
  ],
  "situacaoSolicitacao": [
    1
  ]
},        
  failOnStatusCode: false  
  }).as('response')
})

Then('não gera o relatório de histórico de solicitações acervo retornando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})