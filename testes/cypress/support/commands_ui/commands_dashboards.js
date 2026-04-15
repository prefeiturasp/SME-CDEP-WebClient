import Dashboards_Localizadores from '../locators/dashboards_locators'

const dashboards_localizadores = new Dashboards_Localizadores()

Cypress.Commands.add('acessar_dashboard', () => {
  cy.get(dashboards_localizadores.menu_dashboards(), { timeout: 10000 })
    .should('be.visible')
    .click()

  cy.url({ timeout: 10000 }).should('include', '/indicadores')
  cy.get('body').should('contain.text', 'Painel de indicadores')
})

Cypress.Commands.add('validar_tabela_dashboards', () => {
  cy.get(dashboards_localizadores.tbl_dashboards(), { timeout: 10000 })
    .should('be.visible')

  cy.contains('Acervos cadastrados', { timeout: 10000 })
  .scrollIntoView()
  .should('be.visible') 

  cy.contains('Solicitações por situação', { timeout: 10000 })
  .scrollIntoView()
  .should('be.visible') 

  cy.contains('Controle de livros emprestados', { timeout: 10000 })
  .scrollIntoView()
  .should('be.visible') 

  cy.contains('Quantidade de solicitações e atendimentos por período', { timeout: 10000 })
  .scrollIntoView()
  .should('be.visible') 

  cy.contains('Quantidade de pesquisas mensais', { timeout: 10000 })
  .scrollIntoView()
  .should('be.visible') 

  cy.contains('Solicitações por tipo de acervo', { timeout: 10000 })
  .scrollIntoView()
  .should('be.visible') 
})

Cypress.Commands.add('navegar_tabela_dashboards', () => {
  const anoAtual = new Date().getFullYear()

  cy.contains('Quantidade de solicitações e atendimentos por período', { timeout: 10000 })
    .scrollIntoView()
    .should('be.visible')

  cy.contains(anoAtual).should('be.visible')

  cy.contains('Solicitações por tipo de acervo', { timeout: 10000 })
    .scrollIntoView()
    .should('be.visible')

  cy.contains(anoAtual).should('be.visible')
})
