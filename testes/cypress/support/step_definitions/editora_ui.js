import { When, Then } from 'cypress-cucumber-preprocessor/steps'

const Quando = When
const Então = Then


Quando('acesso a tela Editora', function () {
  cy.acessar_editora() 
})

Quando('crio cadastro de editora {string}', function () {
  cy.criar_editora()   
})

Então('o sistema salva a editora', function () { 
  cy.validar_cadastro_editora() 
})

Quando('tento cadastrar o mesmo nome da editora', function () {
})

Então('o sistema não permite salvar a editora duplicada', function () {
  cy.validar_cadastro_duplicado_editora()
})

Quando('clico em novo cadastro de editora {string}', function () {
  cy.clicar_nova_editora()
})

Quando('tento salvar sem nome da editora', function () {
  cy.clicar_salvar_editora()
})

Então('o sistema não permite salvar sem título da editora', function () {
  cy.validar_campo_obrigatorio_editora()
})

Quando('clico para excluir a editora salva', function () {
})

Então('o sistema exclui a editora', function () {
  cy.excluir_editora()
})

Então('o sistema cancela exclusão da editora', function () {
  cy.cancelar_exclusao_editora()
})

Quando('clico na editora salva', function () {
})

Então('o sistema exibe o cadastro de editora', function () {
  cy.consultar_cadastro_editora()
})

Quando('edito a editora salva', function () {
})

Então('o sistema edita o cadastro de editora com sucesso', function () {
  cy.editar_cadastro_editora()  
})

Quando('edito retirando o nome da editora', function () {  
})

Então('o nome da editora deve ser obrigatório', function () {
  cy.editar_sem_nome_editora()  
})