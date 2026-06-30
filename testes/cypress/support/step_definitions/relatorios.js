import { When, Then } from 'cypress-cucumber-preprocessor/steps'

const Quando = When
const Então = Then


Quando('acesso a tela relatórios {string}', function (relatorio) {
  cy.acessar_relatorios(relatorio)
})

Quando('seleciono o tipo analítico em livros emprestados', function () {
  cy.selecionar_tipo_livros_emprestados()  
})

Quando('seleciono o tipo sintético em livros emprestados', function () {
  cy.selecionar_tipo_livros_emprestados()  
})

Quando('clico em gerar relatório', function () {
  cy.gerar_relatorio() 
})

Então('o sistema realiza o download do relatório {string}', function () {
  cy.validar_geracao_relatorio()  
})

Então('o sistema informa nenhum dado encontrado para download do relatório {string}', function () {
  cy.validar_geracao_relatorio()  
})


Quando('não seleciono o tipo em livros emprestados', function () {    
})

Quando('tento clicar em gerar relatório', function () {
  cy.nao_gerar_relatorio()  
})

Então('o sistema não realiza o download do relatório {string}', function () {
  cy.validar_nao_geracao_relatorio()  
})

Quando('seleciono o tipo acervo em tombo', function () {
  cy.selecionar_tipo_acervo_tombo()   
})

Quando('a situação do tombo', function () {
  cy.selecionar_situacao_tombo()   
})

Quando('não seleciono o tipo em tombo', function () {    
})

Quando('seleciono o crédito e autoria', function () {
  cy.selecionar_tipo_acervo_tombo() 
})

Quando('não seleciono editora no campo', function () { 
})

Quando('seleciono a editora no campo', function () {
  cy.selecionar_editora_controle() 
})

Quando('não seleciono filtros na devolução', function () { 
})

Quando('seleciono filtros na devolução de livros', function () { 
  cy.selecionar_devolucao_livros_atraso()
})

Quando('não seleciono filtros no controle de download', function () { 
})

Quando('seleciono filtros no controle de download', function () { 
  cy.selecionar_tipo_acervo_tombo()
})

Quando('seleciono filtros no mais pesquisados', function () {
  cy.selecionar_data_pesquisados()
  
  cy.selecionar_editora_controle()   

  cy.gerar_relatorio()
})

Quando('não seleciono filtros no mais pesquisados', function () {  
})

Quando('seleciono filtros no histórico das solicitações', function () {
  cy.selecionar_data_historico_solicitacoes()

  cy.selecionar_solicitacoes_situacao()  

  cy.gerar_relatorio()
})

Quando('não seleciono filtros no histórico das solicitações', function () {  
})