import Relatorios_Localizadores from '../locators/relatorios_locators'

const relatorios_localizadores = new Relatorios_Localizadores()

Cypress.Commands.add('acessar_relatorios', (relatorio) => {
  cy.contains(
    relatorios_localizadores.menu_relatorios(), 'Relatórios', { timeout: 10000 })
    .should('be.visible')
    .click()

  cy.contains(
    relatorios_localizadores.submenu_relatorios(), relatorio, { timeout: 10000 })
    .should('be.visible')
    .click()

  cy.url({ timeout: 10000 }).should('include', 'relatorios')
  cy.get('body').should('contain.text', 'Relatórios')
})

Cypress.Commands.add('selecionar_tipo_livros_emprestados', () => {
  cy.get(relatorios_localizadores.select_tipo_sintetico(), { timeout: 10000 })
    .closest('.ant-select')
    .click()

  cy.contains(relatorios_localizadores.select_opcao(), 'Sintético', { timeout: 10000 })
    .should('be.visible')
    .click()
})

Cypress.Commands.add('selecionar_tipo_acervo_tombo', () => {
  cy.get(relatorios_localizadores.select_tipo_acervo_tombo(), { timeout: 10000 })
    .closest('.ant-select')
    .click()

  cy.contains(relatorios_localizadores.select_opcao(), 'Bibliográfico', { timeout: 10000 })
    .should('be.visible')
    .click()
})

Cypress.Commands.add('selecionar_situacao_tombo', () => {
  cy.get(relatorios_localizadores.select_situacao_tombo(), { timeout: 10000 })
    .closest('.ant-select')
    .click()

  cy.contains(relatorios_localizadores.select_opcao(), 'Ativo', { timeout: 10000 })
    .should('be.visible')
    .click()
})

Cypress.Commands.add('selecionar_editora_controle', () => {
  cy.get(relatorios_localizadores.select_editora_controle(), { timeout: 10000 })
    .should('be.visible')
    .click()

  cy.get(relatorios_localizadores.select_opcao(), { timeout: 10000 })
    .should('have.length.greaterThan', 0)

  cy.get(relatorios_localizadores.select_opcao())
    .first()
    .click()
})

Cypress.Commands.add('selecionar_devolucao_livros_atraso', () => {
  cy.get(relatorios_localizadores.btn_devolucao_atraso(), { timeout: 10000 })
    .should('to.exist')
    .click()
})

Cypress.Commands.add('selecionar_data_pesquisados', () => {
  cy.get(relatorios_localizadores.select_data_inicio(), { timeout: 10000 })
    .should('to.exist')
    .type('01/01/2026')

  cy.get(relatorios_localizadores.select_data_fim(), { timeout: 10000 })
    .should('to.exist')
    .type('31/05/2026')
})

Cypress.Commands.add('selecionar_data_historico_solicitacoes', () => {
  cy.get(relatorios_localizadores.select_data_inicio_historico(), { timeout: 10000 })
    .should('to.exist')
    .type('01/01/2026')

  cy.get(relatorios_localizadores.select_data_fim_historico(), { timeout: 10000 })
    .should('to.exist')
    .type('31/05/2026')
})

Cypress.Commands.add('selecionar_solicitacoes_situacao', () => {
  cy.get(relatorios_localizadores.select_situacao_item(), { timeout: 10000 })
    .should('be.visible')
    .click()

  cy.get(relatorios_localizadores.select_opcao(), { timeout: 10000 })
    .should('have.length.greaterThan', 0)

  cy.get(relatorios_localizadores.select_opcao())
    .first()
    .click()
})

Cypress.Commands.add('gerar_relatorio', () => {
  cy.get(relatorios_localizadores.btn_gerar(), { timeout: 30000 })
    .should('to.exist')
    .click({force: true})
})

Cypress.Commands.add('validar_geracao_relatorio', () => {
  cy.get(relatorios_localizadores.modal_relatorio(), { timeout: 30000 })
    .should('be.visible')
})

Cypress.Commands.add('nao_gerar_relatorio', () => {
  cy.get(relatorios_localizadores.btn_gerar(), { timeout: 10000 })
    .should('be.disabled')
})

Cypress.Commands.add('validar_nao_geracao_relatorio', () => {
  cy.get(relatorios_localizadores.modal_relatorio(), { timeout: 10000 })
    .should('not.exist')
})
