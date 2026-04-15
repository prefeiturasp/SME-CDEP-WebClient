import { When, Then } from 'cypress-cucumber-preprocessor/steps'

const Quando = When
const Então = Then

Quando('acesso o Painel de indicadores', () => {
  cy.acessar_dashboard()
})

Então('consulta os dados do dashboard {string}', () => {
  cy.validar_tabela_dashboards()
})

Então('navega até o dashboard {string}', () => {
  cy.navegar_tabela_dashboards()
})