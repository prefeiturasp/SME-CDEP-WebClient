import { When, Then } from 'cypress-cucumber-preprocessor/steps'

const Quando = When
const Então = Then

Quando('clico no botão "Crie a sua conta" da tela "Login"', function () { 
  cy.acessar_criar_conta()  
})

Quando('insiro os dados de usuário', function () {   
  cy.preencher_formulario_usuario()
})

Quando('clico em "Cadastre-se"', function () {
  cy.clicar_cadastrar_usuario()
})  

Então('sistema cria o usuário com sucesso', function () { 
  cy.validar_cadastrar_usuario()   
})
