import Solicitacao_CDEP_Localizadores from '../locators/solicitacao_locators'

const solicitacao_CDEP_Localizadores = new Solicitacao_CDEP_Localizadores

Cypress.Commands.add('clicar_nova_solicitacao', () => {
  cy.get(solicitacao_CDEP_Localizadores.btn_nova_solicitacao())
    .should('be.visible')
    .click()
})

Cypress.Commands.add('adicionar_acervo_solicitacao', () => {
  cy.get(solicitacao_CDEP_Localizadores.btn_adicionar_acervos())
    .should('be.visible')
    .click()

  cy.get(solicitacao_CDEP_Localizadores.btn_buscar_acervos())
	.should('be.visible')
	.click()

  cy.get(solicitacao_CDEP_Localizadores.check_acervos())
	.should('be.visible')
	.first()
	.click()

  cy.get(solicitacao_CDEP_Localizadores.btn_enviar_selecao())
	.should('be.visible')
	.click()
	
  cy.get(solicitacao_CDEP_Localizadores.btn_enviar_acervo_solicitacao())
	.should('be.visible')
	.click() 

  cy.get(solicitacao_CDEP_Localizadores.check_termo_solicitacao())
	.click()  

  cy.get(solicitacao_CDEP_Localizadores.btn_prosseguir_acervo_solicitacao())
	.should('be.visible')
    .should('not.be.disabled')
	.click()  
})

Cypress.Commands.add('validar_nova_acervo_solicitacao', (mensagem_confirmacao_solicitacao) => {
  cy.get(solicitacao_CDEP_Localizadores.msg_enviar_acervo_solicitacao())
      .should("be.visible")
      .and("contain", mensagem_confirmacao_solicitacao)    
})

Cypress.Commands.add('adicionar_item_acervo_solicitacao', () => {
  cy.get(solicitacao_CDEP_Localizadores.btn_adicionar_acervos())
    .should('be.visible')
    .click()

  cy.get(solicitacao_CDEP_Localizadores.btn_buscar_acervos())
	.should('be.visible')
	.click()

  cy.get(solicitacao_CDEP_Localizadores.check_acervos())
	.should('be.visible')
	.first()
	.click()  

   cy.get(solicitacao_CDEP_Localizadores.btn_enviar_selecao())
	.should('be.visible')
	.click()
})

Cypress.Commands.add('remover_item_acervo_solicitacao', () => {
  cy.get(solicitacao_CDEP_Localizadores.btn_remover_item_acervo_solicitacao())
    .should('be.visible')
    .click()
})

Cypress.Commands.add('validar_remocao_acervo_solicitacao', () => {
  cy.get(solicitacao_CDEP_Localizadores.btn_remover_item_acervo_solicitacao())
    .should('not.exist')
})

Cypress.Commands.add('retornar_acervo_solicitacao', () => {
  cy.get(solicitacao_CDEP_Localizadores.btn_retornar_acervo_solicitacao())
    .should('be.visible')
    .click()
})

Cypress.Commands.add('validar_retorno_tela_solicitacoes', () => {
  cy.get(solicitacao_CDEP_Localizadores.btn_nova_solicitacao())
    .should('be.visible')
})

Cypress.Commands.add('enviar_acervo_solicitacoes', () => {
  cy.get(solicitacao_CDEP_Localizadores.btn_adicionar_acervos())
    .should('be.visible')
    .click()

  cy.get(solicitacao_CDEP_Localizadores.btn_buscar_acervos())
	  .should('be.visible')
	  .click()

  cy.get(solicitacao_CDEP_Localizadores.check_acervos())
	  .should('be.visible')
	  .first()
	  .click()

  cy.get(solicitacao_CDEP_Localizadores.btn_enviar_selecao())
	  .should('be.visible')
	  .click()
	
  cy.get(solicitacao_CDEP_Localizadores.btn_enviar_acervo_solicitacao())
	  .should('be.visible')
	  .click()
    
  cy.get(solicitacao_CDEP_Localizadores.check_termo_solicitacao())
	.click()   
})

Cypress.Commands.add('clicar_botao_modal_pesquisador', (botao) => {
  switch (botao.toLowerCase()) {
    case 'prosseguir':
      cy.get(solicitacao_CDEP_Localizadores.btn_prosseguir_acervo_solicitacao()).click()
      break
    case 'fechar':
      cy.get(solicitacao_CDEP_Localizadores.btn_fechar_acervo_solicitacao()).click()
      break
    case 'cancelar':
      cy.get(solicitacao_CDEP_Localizadores.btn_cancelar_acervo_solicitacao()).click()
      break
    default:
      throw new Error(`Botão "${botao}" não mapeado nos localizadores`)
  }
})

Cypress.Commands.add('validar_modal_fechado_tela_solicitacoes', () => {
  cy.get(solicitacao_CDEP_Localizadores.mdl_termo_compromisso_pesquisador())
    .should('not.exist')
})

Cypress.Commands.add('adicionar_item_acervo_busca_solicitacao', () => {
  cy.get(solicitacao_CDEP_Localizadores.btn_adicionar_acervos())
    .should('be.visible')
    .click()

  cy.get(solicitacao_CDEP_Localizadores.btn_buscar_acervos())
	.should('be.visible')
	.click()
})

Cypress.Commands.add('informar_consulta_acervo_solicitacao', (campo, valor) => {
  switch (campo) {
    case 'Busca':
      cy.get(solicitacao_CDEP_Localizadores.campo_busca_tipos_acervos()).type(valor)
      break
    case 'Tipo de acervo':
      cy.get(solicitacao_CDEP_Localizadores.campo_busca_tipos_acervos()).type(valor)
      break  
    case 'Buscar':
      cy.get(solicitacao_CDEP_Localizadores.btn_buscar_acervos()).click()
      break    
    case 'Limpar busca':
      cy.get(solicitacao_CDEP_Localizadores.btn_campo_limpar_busca()).click()
      break
    default:
      throw new Error(`Campo não reconhecido: ${campo}`)
  }
})

Cypress.Commands.add('validar_consulta_acervo', (campo) => {
  if (campo === 'Limpar busca') { 
    // O botão não deve existir na tela
    cy.get(solicitacao_CDEP_Localizadores.btn_enviar_selecao()).should('not.exist') 
  } else { 
    // O botão deve estar visível 
  cy.get(solicitacao_CDEP_Localizadores.btn_enviar_selecao()).should('be.visible') } })
