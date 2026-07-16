import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

const Dado = Given
const Quando = When
const Então = Then

Dado('eu acesso o CDEP com a visualização web', function () {
  cy.login_CDEP()
})

Quando('clico em "Esqueci minha senha"', () => {
  cy.clicar_botao_esqueci_senha()
})

Quando('clico em continuar com usuário "Admin"', () => {
  cy.clicar_botao_continuar_esqueci_senha()
})

Então('o sistema envia as orientações para recuperação de senha {string}', () => {
  cy.validar_enviado_esqueci_senha()
})

Quando('clico em continuar com usuário inválido', () => {
  cy.clicar_botao_continuar_esqueci_senha_invalido()
})

Então('o sistema informa {string} inválido para recuperação de senha', () => {
  cy.validar_enviado_esqueci_senha_invalido()
})

Quando('clico em continuar com usuário menor que o válido', () => {
  cy.clicar_botao_continuar_esqueci_senha_caracteres()
})

Então('o sistema informa {string} não contém o mínimo 5 caracteres', () => {
  cy.validar_enviado_esqueci_senha_caracteres()
})

Quando('acesso com link expirado para alterar senha', () => {
  cy.acessar_redefinir_senha()  
})

Então('o sistema informa para solicitar novamente redefinição', () => {
  cy.validar_acesso_link_expirado()  
})

Quando('clico em alterar {string} nos meus dados', (campo) => {
  cy.clicar_alterar(campo)
})

Então('o campo {string} do modal de senha deve estar visível', (campo) => {
  cy.validar_campos_modal_senha(campo)
})

Quando('preencho o modal de senha com dados válidos', () => {
  cy.preencher_modal_senha()
})