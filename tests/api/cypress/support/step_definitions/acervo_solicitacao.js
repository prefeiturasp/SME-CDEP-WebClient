import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

const Dado = Given
const Quando = When
const Entao = Then

Dado('clico no botão "Nova Solicitação" da tela "Minhas solicitações"', function () {
    cy.clicar_nova_solicitacao()
})

Quando('adiciono os acervos', function () {
    cy.adicionar_acervo_solicitacao()
})

Entao('sistema apresenta a {string} na tela', function (mensagem_confirmacao_solicitacao) {
    cy.validar_nova_acervo_solicitacao(mensagem_confirmacao_solicitacao)
})

Quando('tenho acervo adicionado', function () {
    cy.adicionar_item_acervo_solicitacao()
})

Quando('clico no botão de remover', function () {
    cy.remover_item_acervo_solicitacao()
})

Entao('o item não é apresentado na listagem', function () {   
    cy.validar_remocao_acervo_solicitacao() 
})

Quando('clico no botão de retornar ao lado de "Enviar solicitação"', function () { 
    cy.retornar_acervo_solicitacao()
})

Entao('retorna a tela "Minhas solicitações"', function () {
    cy.validar_retorno_tela_solicitacoes()    
})

Quando('clico em enviar a solicitação do acervo', function () {
    cy.enviar_acervo_solicitacoes()  
})

Quando('clico no {string} do TERMO DE COMPROMISSO DO PESQUISADOR CDEP', function (botao) { 
    cy.clicar_botao_modal_pesquisador(botao)
})

Entao('o modal do pesquisador é fechado', function () {
    cy.validar_modal_fechado_tela_solicitacoes()    
})

Quando('aciono o botão de adicionar acervos', function () {
    cy.adicionar_item_acervo_busca_solicitacao()

})

Quando('clico no {string} inserindo o {string} na tela de consulta acervo', function (campo, valor) { 
    this.campo = campo
    cy.informar_consulta_acervo_solicitacao(campo, valor)
})

Entao('realiza a busca do acervo', function () {
    cy.validar_consulta_acervo(this.campo)
})
