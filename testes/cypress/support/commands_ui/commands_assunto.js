import Assunto_Localizadores from '../locators/assunto_locators'

const assunto_localizadores = new Assunto_Localizadores()

Cypress.Commands.add('acessar_assunto', () => {
  cy.acessar_cadastros()
  cy.contains(
    assunto_localizadores.menu_assunto(), 'Assunto', { timeout: 10000 })
  .should('be.visible')
  .click()

  cy.url({ timeout: 10000 }).should('include', 'cadastro/assunto')
  cy.get('body').should('contain.text', 'Assunto')
})

Cypress.Commands.add('criar_assunto', () => {
  cy.get(assunto_localizadores.btn_novo())
  .should('be.visible')
  .click()

  cy.get(assunto_localizadores.input_titulo())
  .should('be.visible')
  .type('Teste automatizado')

  cy.get(assunto_localizadores.btn_salvar())
  .should('be.visible')
  .click()
})

Cypress.Commands.add('excluir_assunto', () => { 
  cy.get(assunto_localizadores.input_nome(), { timeout: 10000 })
    .clear()
    .type('Teste automatizado')

  cy.get(assunto_localizadores.tbl_nome_assunto(), { timeout: 10000 })
    .should('contain.text', 'Teste automatizado')

  cy.contains(assunto_localizadores.tbl_nome_assunto(), 'Teste automatizado')
    .should('be.visible')
    .click()

  cy.get(assunto_localizadores.btn_excluir(), { timeout: 5000 })
    .should('be.visible')
    .click()

  cy.get(assunto_localizadores.btn_confimar_modal(), { timeout: 10000 })
    .should('be.visible')
    .click()

  cy.contains('Acervo excluído com sucesso', { timeout: 15000 })
    .should('be.visible')
})

Cypress.Commands.add('validar_cadastro_assunto', () => {
  cy.get(assunto_localizadores.msg_sucesso())
  .should('be.visible')
  .and('contain.text', 'Registro inserido com sucesso!')

  cy.excluir_assunto()
})

Cypress.Commands.add('validar_cadastro_duplicado_assunto', () => {
  cy.intercept('POST', '**/api/v1/assunto').as('postAssunto')

  cy.get(assunto_localizadores.btn_novo(), { timeout: 10000 })
    .should('be.visible')
    .and('not.be.disabled')
    .click()

  cy.get(assunto_localizadores.input_titulo(), { timeout: 10000 })
    .should('exist')
    .and('be.visible')
    .clear()
    .type('Teste automatizado')

  cy.get(assunto_localizadores.btn_salvar())
    .should('be.visible')
    .and('not.be.disabled')
    .click()

  cy.wait('@postAssunto')

  cy.contains('Registro duplicado', { timeout: 10000 })
    .should('be.visible')

  cy.get(assunto_localizadores.btn_voltar(), { timeout: 15000 })
    .should('be.visible')
    .click()

  cy.get(assunto_localizadores.btn_confimar_modal(), { timeout: 5000 })
    .should('be.visible')
    .click()

  cy.excluir_assunto()
})

Cypress.Commands.add('clicar_novo_assunto', () => {
  cy.get(assunto_localizadores.btn_novo())
  .should('be.visible')
  .click()
})

Cypress.Commands.add('clicar_salvar_assunto', () => {
  cy.get(assunto_localizadores.btn_salvar())
  .should('be.visible')
  .click()
})

Cypress.Commands.add('validar_campo_obrigatorio_assunto', () => {
  cy.get(assunto_localizadores.msg_campo_obrigatorio())
  .should('be.visible')
})

Cypress.Commands.add('cancelar_exclusao_assunto', () => { 
  cy.get(assunto_localizadores.input_nome(), { timeout: 10000 })
    .should('be.visible')
    .clear()
    .type('Teste automatizado')

  cy.get(assunto_localizadores.tbl_nome_assunto(), { timeout: 10000 })
    .should('contain.text', 'Teste automatizado')

  cy.contains(assunto_localizadores.tbl_nome_assunto(), 'Teste automatizado')
    .should('be.visible')
    .click()

  cy.get(assunto_localizadores.btn_excluir(), { timeout: 5000 })
    .should('be.visible')
    .click()

  cy.get(assunto_localizadores.btn_cancelar_exclusao(), { timeout: 10000 })
    .should('be.visible')
    .click()

  cy.get(assunto_localizadores.btn_excluir(), { timeout: 5000 })
    .should('be.visible')
    .click()

  cy.get(assunto_localizadores.btn_confimar_modal(), { timeout: 10000 })
    .should('be.visible')
    .click()

  cy.contains('Acervo excluído com sucesso', { timeout: 15000 })
    .should('be.visible')
})

Cypress.Commands.add('consultar_cadastro_assunto', () => { 
  cy.get(assunto_localizadores.input_nome(), { timeout: 10000 })
    .should('be.visible')
    .clear()

  cy.get(assunto_localizadores.input_nome(), { timeout: 10000 })
    .should('be.visible')
    .type('Teste automatizado')

  cy.get(assunto_localizadores.tbl_linhas())
    .contains(assunto_localizadores.tbl_celulas(), 'Teste automatizado', { timeout: 10000 })
    .should('be.visible')
    .click()

  cy.url({ timeout: 10000 })
    .should('include', 'cadastro/assunto')

  cy.get(assunto_localizadores.btn_voltar(), { timeout: 10000 })
    .should('be.visible')
    .click()

  cy.excluir_assunto()
})

Cypress.Commands.add('editar_cadastro_assunto', () => { 
  cy.get(assunto_localizadores.input_nome(), { timeout: 10000 })
    .should('be.visible')
    .clear()

  cy.get(assunto_localizadores.input_nome(), { timeout: 10000 })
    .should('be.visible')
    .type('Teste automatizado')

  cy.get(assunto_localizadores.tbl_linhas())
    .contains(assunto_localizadores.tbl_celulas(), 'Teste automatizado', { timeout: 10000 })
    .should('be.visible')
    .click()

  cy.get(assunto_localizadores.btn_novo(), { timeout: 10000 })
    .should('be.visible')
    .click()

  cy.get(assunto_localizadores.msg_sucesso())
  .should('be.visible')
  .and('contain.text', 'Registro alterado com sucesso!')

  cy.excluir_assunto()
})

Cypress.Commands.add('editar_sem_nome_assunto', () => {
  cy.intercept('GET', '**/api/v1/assunto/*').as('getAssunto')

  cy.get(assunto_localizadores.input_nome(), { timeout: 10000 })
    .should('be.visible')
    .should('not.be.disabled')
    .clear()
    .type('Teste automatizado')

  cy.contains(
    `${assunto_localizadores.tbl_linhas()} ${assunto_localizadores.tbl_celulas()}`,
    'Teste automatizado',
    { timeout: 10000 }
  )
    .should('be.visible')
    .click()

  cy.wait('@getAssunto')

  cy.url({ timeout: 10000 })
    .should('include', '/cadastro/assunto/editar/')

  cy.get(assunto_localizadores.btn_salvar(), { timeout: 5000 })
    .should('be.visible')
    .click()

  cy.excluir_assunto()
})