import { When, Then } from 'cypress-cucumber-preprocessor/steps'

const Quando = When
const Então = Then


Quando('acesso a tela Autor', function () {
  cy.acessar_autor() 
})

Quando('crio cadastro de autor {string}', function () {
  cy.criar_autor()   
})

Então('o sistema salva o autor', function () { 
  cy.validar_cadastro_autor() 
})

Quando('tento cadastro o mesmo nome no autor', function () {
})

Então('o sistema não permite salvar o autor duplicado', function () {
  cy.validar_cadastro_duplicado_autor()
})

Quando('clico em novo cadastro de autor {string}', function () {
  cy.clicar_novo_autor()
})

Quando('tento salvar sem nome do autor', function () {
  cy.clicar_salvar_autor()
})

Então('o sistema não permite salvar sem título do autor', function () {
  cy.validar_campo_obrigatorio_autor()
})

Quando('clico para excluir o autor salvo', function () {
})

Então('o sistema exclui o autor', function () {
  cy.excluir_autor()
})

Então('o sistema cancela exclusão do autor', function () {
  cy.cancelar_exclusao_autor()
})

Quando('clico no autor salvo', function () {
})

Então('o sistema exibe o cadastro de autor', function () {
  cy.consultar_cadastro_autor()
})

Quando('edito o autor salvo', function () {
})

Então('o sistema edita o cadastro de autor com sucesso', function () {
  cy.editar_cadastro_autor()  
})

Quando('edito retirando o nome do autor', function () {  
})

Então('o nome do autor deve ser obrigatório', function () {
  cy.editar_sem_nome_autor()  
})