import { When, Then } from 'cypress-cucumber-preprocessor/steps'

const Quando = When
const Então = Then

Quando('acesso o menu Meus Dados', () => {
  cy.acessar_menu_meus_dados()
})

Então('os campos de Meus Dados devem estar preenchidos para {string}', (campo) => {
  cy.validar_campo_meus_dados(campo)
})

Quando('clico em alterar {string} nos meus dados', (campo) => {
  cy.clicar_alterar(campo)
})

Quando('clico em cancelar no modal de alteração', () => {
  cy.clicar_modal_cancelar()
})

Quando('clico em alterar no modal de dados', () => {
  cy.preencher_modal_senha()
})

Então('alteração do e-mail deve ser exibido', () => {
  cy.validar_modal_alteracao_visivel()
})

Então('o modal de alteração não deve estar visível', () => {
  cy.validar_modal_alteracao_nao_visivel()
})

Então('o campo {string} validar a senha inserida', (campo) => {
  cy.validar_campos_modal_senha(campo)
})

Quando('preencho o modal de senha com todos dados válidos', () => {
  cy.preencher_modal_senha()
})

Então('realiza a alteração de senha', () => {
  cy.validar_alteracao_meus_dados()
})

Então('modal de alteração dos meus dados deve fechar', () => {
  cy.validar_alteracao_meus_dados()
})