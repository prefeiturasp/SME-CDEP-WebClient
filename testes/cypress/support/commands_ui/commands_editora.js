import Editora_Localizadores from '../locators/editora_locators'

const editora_localizadores = new Editora_Localizadores()

Cypress.Commands.add('acessar_editora', () => {
  cy.acessar_cadastros()
  cy.contains(
    editora_localizadores.menu_editora(), 'Editora', { timeout: 10000 })
  .should('be.visible')
  .click()

  cy.url({ timeout: 10000 }).should('include', 'cadastro/editora')
  cy.get('body').should('contain.text', 'Editora')
})

Cypress.Commands.add('criar_editora', () => {
  cy.get(editora_localizadores.btn_novo(), { timeout: 15000 })
  .should('be.visible')
  .click()

  cy.get(editora_localizadores.input_titulo(), { timeout: 10000 })
  .should('be.visible')
  .type('Teste automatizado')

  cy.get(editora_localizadores.btn_salvar(), { timeout: 15000 })
  .should('be.visible')
  .click()
})

Cypress.Commands.add('excluir_editora', () => { 
  cy.get(editora_localizadores.input_nome(), { timeout: 10000 })
    .clear()
    .type('Teste automatizado')

  cy.get(editora_localizadores.tbl_nome_editora(), { timeout: 10000 })
    .should('contain.text', 'Teste automatizado')

  cy.contains(editora_localizadores.tbl_nome_editora(), 'Teste automatizado')
    .should('be.visible')
    .click()

  cy.get(editora_localizadores.btn_excluir(), { timeout: 5000 })
    .should('be.visible')
    .click()

  cy.get(editora_localizadores.btn_confimar_modal(), { timeout: 10000 })
    .should('be.visible')
    .click()

  cy.contains('Acervo excluído com sucesso', { timeout: 15000 })
    .should('be.visible')
})

Cypress.Commands.add('validar_cadastro_editora', () => {
  cy.get(editora_localizadores.msg_sucesso())
  .should('be.visible')
  .and('contain.text', 'Registro inserido com sucesso!')

  cy.excluir_editora()
})

Cypress.Commands.add('validar_cadastro_duplicado_editora', () => {
  cy.get(editora_localizadores.btn_novo(), { timeout: 15000 })
    .should('be.visible')
    .and('not.be.disabled')
    .click()

  cy.get(editora_localizadores.input_titulo(), { timeout: 10000 })
    .should('exist')
    .and('be.visible')
    .clear()
    .type('Teste automatizado')

  cy.get(editora_localizadores.btn_salvar(), { timeout: 15000 })
    .should('be.visible')
    .and('not.be.disabled')
    .click()

  cy.contains('Registro duplicado', { timeout: 10000 })
    .should('be.visible')

  cy.get(editora_localizadores.btn_voltar(), { timeout: 15000 })
    .should('be.visible')
    .click()

  cy.get(editora_localizadores.btn_confimar_modal(), { timeout: 5000 })
    .should('be.visible')
    .click()

  cy.excluir_editora()
})

Cypress.Commands.add('clicar_nova_editora', () => {
  cy.get(editora_localizadores.btn_novo(), { timeout: 15000 })
  .should('be.visible')
  .click()
})

Cypress.Commands.add('clicar_salvar_editora', () => {
  cy.get(editora_localizadores.btn_salvar(), { timeout: 15000 })
  .should('be.visible')
  .click()
})

Cypress.Commands.add('validar_campo_obrigatorio_editora', () => {
  cy.get(editora_localizadores.msg_campo_obrigatorio())
  .should('be.visible')
})

Cypress.Commands.add('cancelar_exclusao_editora', () => { 
  cy.get(editora_localizadores.input_nome(), { timeout: 10000 })
    .should('be.visible')
    .clear()
    .type('Teste automatizado')

  cy.get(editora_localizadores.tbl_nome_editora(), { timeout: 10000 })
    .should('contain.text', 'Teste automatizado')

  cy.contains(editora_localizadores.tbl_nome_editora(), 'Teste automatizado')
    .should('be.visible')
    .click()

  cy.get(editora_localizadores.btn_excluir(), { timeout: 5000 })
    .should('be.visible')
    .click()

  cy.get(editora_localizadores.btn_cancelar_exclusao(), { timeout: 10000 })
    .should('be.visible')
    .click()

  cy.get(editora_localizadores.btn_excluir(), { timeout: 5000 })
    .should('be.visible')
    .click()

  cy.get(editora_localizadores.btn_confimar_modal(), { timeout: 10000 })
    .should('be.visible')
    .click()

  cy.contains('Acervo excluído com sucesso', { timeout: 15000 })
    .should('be.visible')
})

Cypress.Commands.add('consultar_cadastro_editora', () => { 
  cy.get(editora_localizadores.input_nome(), { timeout: 10000 })
    .should('be.visible')
    .clear()

  cy.get(editora_localizadores.input_nome(), { timeout: 10000 })
    .should('be.visible')
    .type('Teste automatizado')

  cy.get(editora_localizadores.tbl_linhas())
    .contains(editora_localizadores.tbl_celulas(), 'Teste automatizado', { timeout: 10000 })
    .should('be.visible')
    .click()

  cy.url({ timeout: 10000 })
    .should('include', 'cadastro/editora')

  cy.get(editora_localizadores.btn_voltar(), { timeout: 10000 })
    .should('be.visible')
    .click()

  cy.excluir_editora()
})

Cypress.Commands.add('editar_cadastro_editora', () => { 
  cy.get(editora_localizadores.input_nome(), { timeout: 10000 })
    .should('be.visible')
    .type('Teste automatizado')

  cy.get(editora_localizadores.tbl_linhas())
    .contains(editora_localizadores.tbl_celulas(), 'Teste automatizado', { timeout: 10000 })
    .should('be.visible')
    .click()

  cy.get(editora_localizadores.btn_novo(), { timeout: 15000 })
    .should('be.visible')
    .click()

  cy.get(editora_localizadores.msg_sucesso())
  .should('be.visible')
  .and('contain.text', 'Registro alterado com sucesso!')

  cy.excluir_editora()
})

Cypress.Commands.add('editar_sem_nome_editora', () => {
  cy.get(editora_localizadores.input_nome(), { timeout: 10000 })
    .should('be.visible')
    .should('not.be.disabled')
    .clear()
    .type('Teste automatizado')

  cy.contains(
    `${editora_localizadores.tbl_linhas()} ${editora_localizadores.tbl_celulas()}`,
    'Teste automatizado',
    { timeout: 10000 }
  )
    .should('be.visible')
    .click()

  cy.url({ timeout: 10000 })
    .should('include', '/cadastro/editora/editar/')

  cy.get(editora_localizadores.btn_salvar(), { timeout: 15000 })
    .should('be.visible')
    .click()

  cy.excluir_editora()
})