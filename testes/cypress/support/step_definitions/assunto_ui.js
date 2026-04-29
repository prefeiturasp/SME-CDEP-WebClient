import { When, Then } from 'cypress-cucumber-preprocessor/steps'

const Quando = When
const Então = Then


Quando('acesso a tela Assunto', function () {
  cy.acessar_assunto() 
})

Quando('crio cadastro de assunto {string}', function () {
  cy.criar_assunto()   
})

Então('o sistema salva o assunto', function () { 
  cy.validar_cadastro_assunto() 
})

Quando('tento cadastro o mesmo nome no assunto', function () {
})

Então('o sistema não permite salvar o assunto duplicado', function () {
  cy.validar_cadastro_duplicado_assunto()
})

Quando('clico em novo cadastro de assunto {string}', function () {
  cy.clicar_novo_assunto()
})

Quando('tento salvar sem nome do assunto', function () {
  cy.clicar_salvar_assunto()
})

Então('o sistema não permite salvar sem título do assunto', function () {
  cy.validar_campo_obrigatorio_assunto()
})

Quando('clico para excluir o assunto salvo', function () {
})

Então('o sistema exclui o assunto', function () {
  cy.excluir_assunto()
})

Então('o sistema cancela exclusão do assunto', function () {
  cy.cancelar_exclusao_assunto()
})

Quando('clico no assunto salvo', function () {
})

Então('o sistema exibe o cadastro de assunto', function () {
  cy.consultar_cadastro_assunto()
})

Quando('edito o assunto salvo', function () {
})

Então('o sistema edita o cadastro com sucesso', function () {
  cy.editar_cadastro_assunto()  
})

Quando('edito retirando o nome do assunto', function () {  
})

Então('o nome do assunto deve ser obrigatório', function () {
  cy.editar_sem_nome_assunto()  
})