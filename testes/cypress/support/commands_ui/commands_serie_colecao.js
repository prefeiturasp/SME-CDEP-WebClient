import Serie_Colecao_Localizadores from '../locators/serie_colecao_locators'

const serie_colecao_localizadores = new Serie_Colecao_Localizadores()

Cypress.Commands.add('acessar_serie_colecao', () => {
  cy.acessar_cadastros()
  cy.contains(
    serie_colecao_localizadores.menu_serie_colecao(), 'Série/Coleção', { timeout: 10000 })
  .should('be.visible')
  .click()

  cy.url({ timeout: 10000 }).should('include', 'cadastro/serie-colecao')
  cy.get('body').should('contain.text', 'Série/Coleção')
})

Cypress.Commands.add('criar_serie_colecao', () => {
  cy.get(serie_colecao_localizadores.btn_novo(), { timeout: 15000 })
  .should('be.visible')
  .click()

  cy.get(serie_colecao_localizadores.input_titulo(), { timeout: 10000 })
  .should('be.visible')
  .type('Teste automatizado')

  cy.get(serie_colecao_localizadores.btn_salvar(), { timeout: 15000 })
  .should('be.visible')
  .click()
})

Cypress.Commands.add('excluir_serie_colecao', () => { 
  cy.get(serie_colecao_localizadores.input_nome(), { timeout: 10000 })
    .clear()
    .type('Teste automatizado')

  cy.get(serie_colecao_localizadores.tbl_nome_serie(), { timeout: 10000 })
    .should('contain.text', 'Teste automatizado')

  cy.contains(serie_colecao_localizadores.tbl_nome_serie(), 'Teste automatizado')
    .should('be.visible')
    .click()

  cy.get(serie_colecao_localizadores.btn_excluir(), { timeout: 5000 })
    .should('be.visible')
    .click()

  cy.get(serie_colecao_localizadores.btn_confimar_modal(), { timeout: 10000 })
    .should('be.visible')
    .click()

  cy.contains('Acervo excluído com sucesso', { timeout: 15000 })
    .should('be.visible')
})

Cypress.Commands.add('validar_cadastro_serie', () => {
  cy.get(serie_colecao_localizadores.msg_sucesso())
  .should('be.visible')
  .and('contain.text', 'Registro inserido com sucesso!')

  cy.excluir_serie_colecao()
})

Cypress.Commands.add('validar_cadastro_duplicado_serie', () => {
  cy.get(serie_colecao_localizadores.btn_novo(), { timeout: 15000 })
    .should('be.visible')
    .and('not.be.disabled')
    .click()

  cy.get(serie_colecao_localizadores.input_titulo(), { timeout: 10000 })
    .should('exist')
    .and('be.visible')
    .clear()
    .type('Teste automatizado')

  cy.get(serie_colecao_localizadores.btn_salvar(), { timeout: 15000 })
    .should('be.visible')
    .and('not.be.disabled')
    .click()

  cy.contains('Registro duplicado', { timeout: 10000 })
    .should('be.visible')

  cy.get(serie_colecao_localizadores.btn_voltar(), { timeout: 15000 })
    .should('be.visible')
    .click()

  cy.get(serie_colecao_localizadores.btn_confimar_modal(), { timeout: 5000 })
    .should('be.visible')
    .click()

  cy.excluir_serie_colecao()
})

Cypress.Commands.add('clicar_nova_serie', () => {
  cy.get(serie_colecao_localizadores.btn_novo(), { timeout: 15000 })
  .should('be.visible')
  .click()
})

Cypress.Commands.add('clicar_salvar_serie', () => {
  cy.get(serie_colecao_localizadores.btn_salvar(), { timeout: 15000 })
  .should('be.visible')
  .click()
})

Cypress.Commands.add('validar_campo_obrigatorio_serie', () => {
  cy.get(serie_colecao_localizadores.msg_campo_obrigatorio())
  .should('be.visible')
})

Cypress.Commands.add('cancelar_exclusao_serie_colecao', () => { 
  cy.get(serie_colecao_localizadores.input_nome(), { timeout: 10000 })
    .should('be.visible')
    .clear()
    .type('Teste automatizado')

  cy.get(serie_colecao_localizadores.tbl_nome_serie(), { timeout: 10000 })
    .should('contain.text', 'Teste automatizado')

  cy.contains(serie_colecao_localizadores.tbl_nome_serie(), 'Teste automatizado')
    .should('be.visible')
    .click()

  cy.get(serie_colecao_localizadores.btn_excluir(), { timeout: 5000 })
    .should('be.visible')
    .click()

  cy.get(serie_colecao_localizadores.btn_cancelar_exclusao(), { timeout: 10000 })
    .should('be.visible')
    .click()

  cy.get(serie_colecao_localizadores.btn_excluir(), { timeout: 5000 })
    .should('be.visible')
    .click()

  cy.get(serie_colecao_localizadores.btn_confimar_modal(), { timeout: 10000 })
    .should('be.visible')
    .click()

  cy.contains('Acervo excluído com sucesso', { timeout: 15000 })
    .should('be.visible')
})

Cypress.Commands.add('consultar_cadastro_serie_colecao', () => { 
  cy.get(serie_colecao_localizadores.input_nome(), { timeout: 10000 })
    .should('be.visible')
    .clear()

  cy.get(serie_colecao_localizadores.input_nome(), { timeout: 10000 })
    .should('be.visible')
    .type('Teste automatizado')

  cy.get(serie_colecao_localizadores.tbl_linhas())
    .contains(serie_colecao_localizadores.tbl_celulas(), 'Teste automatizado', { timeout: 10000 })
    .should('be.visible')
    .click()

  cy.url({ timeout: 10000 })
    .should('include', 'cadastro/serie-colecao')

  cy.get(serie_colecao_localizadores.btn_voltar(), { timeout: 10000 })
    .should('be.visible')
    .click()

  cy.excluir_serie_colecao()
})

Cypress.Commands.add('editar_cadastro_serie_colecao', () => { 
  cy.get(serie_colecao_localizadores.input_nome(), { timeout: 10000 })
    .should('be.visible')
    .type('Teste automatizado')

  cy.get(serie_colecao_localizadores.tbl_linhas())
    .contains(serie_colecao_localizadores.tbl_celulas(), 'Teste automatizado', { timeout: 10000 })
    .should('be.visible')
    .click()

  cy.get(serie_colecao_localizadores.btn_novo(), { timeout: 15000 })
    .should('be.visible')
    .click()

  cy.get(serie_colecao_localizadores.msg_sucesso())
  .should('be.visible')
  .and('contain.text', 'Registro alterado com sucesso!')

  cy.excluir_serie_colecao()
})

Cypress.Commands.add('editar_sem_nome_serie_colecao', () => {
  cy.get(serie_colecao_localizadores.input_nome(), { timeout: 10000 })
    .should('be.visible')
    .should('not.be.disabled')
    .clear()
    .type('Teste automatizado')

  cy.contains(
    `${serie_colecao_localizadores.tbl_linhas()} ${serie_colecao_localizadores.tbl_celulas()}`,
    'Teste automatizado',
    { timeout: 10000 }
  )
    .should('be.visible')
    .click()

  cy.url({ timeout: 10000 })
    .should('include', '/cadastro/serie-colecao/editar/')

  cy.get(serie_colecao_localizadores.btn_salvar(), { timeout: 15000 })
    .should('be.visible')
    .click()

  cy.excluir_serie_colecao()
})