import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

const Dado = Given
const Quando = When
const Então = Then

Dado('eu acesso o sistema CDEP', () => {
  cy.configurar_visualizacao() 
})

Quando('clico em entrar na tela de login', () => {
  cy.clicar_botao_acessar()
})

Então('o sistema valida o {string} no acesso', () => {
  cy.validar_acesso_cdep()
})

Então('o sistema valida {string} como obrigatório no acesso', (campo) => {
  cy.validar_campos_obrigatorios_acesso (campo)  
})

Então('o sistema valida a quantidade {string} de caracteres com o valor {string} no acesso', (campo, dado) => {
  cy.validar_caracteres_acesso(campo, dado)
})

Então('o sistema valida {string} inválido {string} no acesso', (campo, dado) => {
  cy.validar_acesso_invalido (campo, dado)  
})