import Credito_Localizadores from '../locators/credito_locators'

const credito_localizadores = new Credito_Localizadores()

Cypress.Commands.add('acessar_credito', () => {
  cy.acessar_cadastros()
  cy.contains(
    credito_localizadores.menu_credito(), 'Crédito', { timeout: 10000 })
  .should('be.visible')
  .click()

  cy.url({ timeout: 10000 }).should('include', 'cadastro/credito')
  cy.get('body').should('contain.text', 'Crédito')
})

Cypress.Commands.add('criar_credito', () => {
  cy.get(credito_localizadores.btn_novo(), { timeout: 15000 })
  .should('be.visible')
  .click()

  cy.get(credito_localizadores.input_titulo(), { timeout: 10000 })
  .should('be.visible')
  .type('Teste automatizado')

  cy.get(credito_localizadores.btn_salvar(), { timeout: 15000 })
  .should('be.visible')
  .click()
})

Cypress.Commands.add('excluir_credito', () => { 
  cy.get(credito_localizadores.input_nome(), { timeout: 10000 })
    .clear()
    .type('Teste automatizado')

  cy.get(credito_localizadores.tbl_nome_credito(), { timeout: 10000 })
    .should('contain.text', 'Teste automatizado')

  cy.contains(credito_localizadores.tbl_nome_credito(), 'Teste automatizado')
    .should('be.visible')
    .click()

  cy.get(credito_localizadores.btn_excluir(), { timeout: 5000 })
    .should('be.visible')
    .click()

  cy.get(credito_localizadores.btn_confimar_modal(), { timeout: 10000 })
    .should('be.visible')
    .click()

  cy.contains('Acervo excluído com sucesso', { timeout: 15000 })
    .should('be.visible')
})

Cypress.Commands.add('validar_cadastro_credito', () => {
  cy.get(credito_localizadores.msg_sucesso())
  .should('be.visible')
  .and('contain.text', 'Registro inserido com sucesso!')

  cy.excluir_credito()
})

Cypress.Commands.add('validar_cadastro_duplicado_credito', () => {
  cy.get(credito_localizadores.btn_novo(), { timeout: 15000 })
    .should('be.visible')
    .and('not.be.disabled')
    .click()

  cy.get(credito_localizadores.input_titulo(), { timeout: 10000 })
    .should('exist')
    .and('be.visible')
    .clear()
    .type('Teste automatizado')

  cy.get(credito_localizadores.btn_salvar(), { timeout: 15000 })
    .should('be.visible')
    .and('not.be.disabled')
    .click()

  cy.contains('Registro duplicado', { timeout: 10000 })
    .should('be.visible')

  cy.get(credito_localizadores.btn_voltar(), { timeout: 15000 })
    .should('be.visible')
    .click()

  cy.get(credito_localizadores.btn_confimar_modal(), { timeout: 5000 })
    .should('be.visible')
    .click()

  cy.excluir_credito()
})

Cypress.Commands.add('clicar_novo_credito', () => {
  cy.get(credito_localizadores.btn_novo(), { timeout: 15000 })
  .should('be.visible')
  .click()
})

Cypress.Commands.add('clicar_salvar_credito', () => {
  cy.get(credito_localizadores.btn_salvar(), { timeout: 15000 })
  .should('be.visible')
  .click()
})

Cypress.Commands.add('validar_campo_obrigatorio_credito', () => {
  cy.get(credito_localizadores.msg_campo_obrigatorio())
  .should('be.visible')
})

Cypress.Commands.add('cancelar_exclusao_credito', () => { 
  cy.get(credito_localizadores.input_nome(), { timeout: 10000 })
    .should('be.visible')
    .clear()
    .type('Teste automatizado')

  cy.get(credito_localizadores.tbl_nome_credito(), { timeout: 10000 })
    .should('contain.text', 'Teste automatizado')

  cy.contains(credito_localizadores.tbl_nome_credito(), 'Teste automatizado')
    .should('be.visible')
    .click()

  cy.get(credito_localizadores.btn_excluir(), { timeout: 5000 })
    .should('be.visible')
    .click()

  cy.get(credito_localizadores.btn_cancelar_exclusao(), { timeout: 10000 })
    .should('be.visible')
    .click()

  cy.get(credito_localizadores.btn_excluir(), { timeout: 5000 })
    .should('be.visible')
    .click()

  cy.get(credito_localizadores.btn_confimar_modal(), { timeout: 10000 })
    .should('be.visible')
    .click()

  cy.contains('Acervo excluído com sucesso', { timeout: 15000 })
    .should('be.visible')
})

Cypress.Commands.add('consultar_cadastro_credito', () => { 
  cy.get(credito_localizadores.input_nome(), { timeout: 10000 })
    .should('be.visible')
    .clear()

  cy.get(credito_localizadores.input_nome(), { timeout: 10000 })
    .should('be.visible')
    .type('Teste automatizado')

  cy.get(credito_localizadores.tbl_linhas())
    .contains(credito_localizadores.tbl_celulas(), 'Teste automatizado', { timeout: 10000 })
    .should('be.visible')
    .click()

  cy.url({ timeout: 10000 })
    .should('include', 'cadastro/credito')

  cy.get(credito_localizadores.btn_voltar(), { timeout: 10000 })
    .should('be.visible')
    .click()

  cy.excluir_credito()
})

Cypress.Commands.add('editar_cadastro_credito', () => { 
  cy.get(credito_localizadores.input_nome(), { timeout: 10000 })
    .should('be.visible')
    .type('Teste automatizado')

  cy.get(credito_localizadores.tbl_linhas())
    .contains(credito_localizadores.tbl_celulas(), 'Teste automatizado', { timeout: 10000 })
    .should('be.visible')
    .click()

  cy.get(credito_localizadores.btn_novo(), { timeout: 15000 })
    .should('be.visible')
    .click()

  cy.get(credito_localizadores.msg_sucesso())
  .should('be.visible')
  .and('contain.text', 'Registro alterado com sucesso!')

  cy.excluir_credito()
})

Cypress.Commands.add('editar_sem_nome_credito', () => {
  cy.get(credito_localizadores.input_nome(), { timeout: 10000 })
    .should('be.visible')
    .should('not.be.disabled')
    .clear()
    .type('Teste automatizado')

  cy.contains(
    `${credito_localizadores.tbl_linhas()} ${credito_localizadores.tbl_celulas()}`,
    'Teste automatizado',
    { timeout: 10000 }
  )
    .should('be.visible')
    .click()

  cy.url({ timeout: 10000 })
    .should('include', '/cadastro/credito/editar/')

  cy.get(credito_localizadores.btn_salvar(), { timeout: 15000 })
    .should('be.visible')
    .click()

  cy.excluir_credito()
})