import { When, Then } from 'cypress-cucumber-preprocessor/steps'

const Quando = When
const Então = Then


Quando('acesso a tela Série e Coleção', function () {
  cy.acessar_serie_colecao() 
})

Quando('crio cadastro de série {string}', function () {
  cy.criar_serie_colecao()   
})

Então('o sistema salva a série', function () { 
  cy.validar_cadastro_serie() 
})

Quando('tento cadastro o mesmo nome na série', function () {
})

Então('o sistema não permite salvar a série duplicada', function () {
  cy.validar_cadastro_duplicado_serie()
})

Quando('clico em novo cadastro de série {string}', function () {
  cy.clicar_nova_serie()
})

Quando('tento salvar sem nome da série', function () {
  cy.clicar_salvar_serie()
})

Então('o sistema não permite salvar sem título da série', function () {
  cy.validar_campo_obrigatorio_serie()
})

Quando('clico para excluir a série salva', function () {
})

Então('o sistema exclui a série', function () {
  cy.excluir_serie_colecao()
})

Então('o sistema cancela exclusão da série', function () {
  cy.cancelar_exclusao_serie_colecao()
})

Quando('clico na série salva', function () {
})

Então('o sistema exibe o cadastro da série', function () {
  cy.consultar_cadastro_serie_colecao()
})

Quando('edito a série salva', function () {
})

Então('o sistema edita o cadastro da série com sucesso', function () {
  cy.editar_cadastro_serie_colecao()  
})

Quando('edito retirando o nome da série', function () {  
})

Então('o nome da série deve ser obrigatório', function () {
  cy.editar_sem_nome_serie_colecao()  
})