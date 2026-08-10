import Calendario_Localizadores from '../locators/calendario_locators'

const calendario_localizadores = new Calendario_Localizadores()

Cypress.Commands.add('acessar_calendario', () => {
  cy.contains(
  calendario_localizadores.menu_gestao(), 'Gestão', { timeout: 10000 })
  .should('be.visible')
  .click()

  cy.contains(
    calendario_localizadores.menu_calendario(), 'Calendário', { timeout: 10000 })
  .should('be.visible')
  .click()

  cy.url({ timeout: 10000 }).should('include', 'gestao/calendario')
  cy.get('body').should('contain.text', 'Calendário de visitas')
})

Cypress.Commands.add('cadastrar_calendario', () => {
  const dataAtual = new Date()

  const meses = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ]

  const mesAtual = meses[dataAtual.getMonth()]
  const diaAtual = dataAtual.getDate().toString()

  cy.contains(
    calendario_localizadores.mes_calendario(), mesAtual, { timeout: 30000 })
    .should('be.visible')
    .click()

  cy.get(calendario_localizadores.dia_calendario(), { timeout: 10000 })
    .contains(new RegExp(`^${diaAtual}$`))
    .should('be.visible')
    .click()

  cy.get(calendario_localizadores.btn_incluir(), { timeout: 10000 })
    .should('be.visible')
    .click()

  cy.get(calendario_localizadores.input_justificativa(), { timeout: 10000 })
    .should('be.visible')
    .clear()
    .type('Teste automatizado')

  cy.get(calendario_localizadores.btn_salvar(), { timeout: 10000 })
    .should('be.visible')
    .click()
})

Cypress.Commands.add('validar_cadastro_calendario', () => {
  cy.get(calendario_localizadores.msg_sucesso())
  .should('be.visible')
  .and('contain.text', 'A suspensão foi inserida com sucesso!')
})

Cypress.Commands.add('excluir_calendario', () => {
  const dataAtual = new Date()

  const meses = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ]

  const mesAtual = meses[dataAtual.getMonth()]
  const diaAtual = dataAtual.getDate().toString()

  cy.contains(
    calendario_localizadores.mes_calendario(), mesAtual, { timeout: 10000 })
    .should('be.visible')
    .click()

  cy.get(calendario_localizadores.dia_calendario(), { timeout: 10000 })
    .contains(new RegExp(`^${diaAtual}$`))
    .should('be.visible')
    .click()

  cy.get(calendario_localizadores.btn_excluir(), { timeout: 10000 })
    .should('be.visible')
    .click()

  cy.get(calendario_localizadores.btn_confirmar_exclusao(), { timeout: 10000 })
    .should('be.visible')
    .click()
})

Cypress.Commands.add('validar_exclusao_calendario', () => {
  cy.get(calendario_localizadores.msg_sucesso())
  .should('be.visible')
  .and('contain.text', 'A suspensão foi excluída com sucesso!')
})