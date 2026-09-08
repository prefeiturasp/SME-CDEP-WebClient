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

When('preencho o formulário de usuário sem informar o campo {string}', (caso) => {
  cy.campo_obrigatorio_formulario_usuario(caso)
})

Então('o sistema exibe a mensagem de campo obrigatório de usuário', function () { 
  cy.validar_campo_obrigatorio_cadastrar_usuario()
})