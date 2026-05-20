import { When, Then } from 'cypress-cucumber-preprocessor/steps'

const Quando = When
const Então = Then


Quando('acesso a tela Crédito', function () {
  cy.acessar_credito() 
})

Quando('crio cadastro de crédito {string}', function () {
  cy.criar_credito()   
})

Então('o sistema salva o crédito', function () { 
  cy.validar_cadastro_credito() 
})

Quando('tento cadastro o mesmo nome no crédito', function () {
})

Então('o sistema não permite salvar o crédito duplicado', function () {
  cy.validar_cadastro_duplicado_credito()
})

Quando('clico em novo cadastro de crédito {string}', function () {
  cy.clicar_novo_credito()
})

Quando('tento salvar sem nome do crédito', function () {
  cy.clicar_salvar_credito()
})

Então('o sistema não permite salvar sem título do crédito', function () {
  cy.validar_campo_obrigatorio_credito()
})

Quando('clico para excluir o crédito salvo', function () {
})

Então('o sistema exclui o crédito', function () {
  cy.excluir_credito()
})

Então('o sistema cancela exclusão do crédito', function () {
  cy.cancelar_exclusao_credito()
})

Quando('clico no crédito salvo', function () {
})

Então('o sistema exibe o cadastro de crédito', function () {
  cy.consultar_cadastro_credito()
})

Quando('edito o crédito salvo', function () {
})

Então('o sistema edita o cadastro de crédito com sucesso', function () {
  cy.editar_cadastro_credito()  
})

Quando('edito retirando o nome do crédito', function () {  
})

Então('o nome do crédito deve ser obrigatório', function () {
  cy.editar_sem_nome_credito()  
})