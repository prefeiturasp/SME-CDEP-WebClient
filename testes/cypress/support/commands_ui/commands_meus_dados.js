import Meus_Dados_Localizadores from '../locators/meus_dados_locators'

const meus_dados_localizadores = new Meus_Dados_Localizadores()

Cypress.Commands.add('acessar_menu_meus_dados', () => {
  cy.contains(meus_dados_localizadores.submenu_meus_dados(), 'Meus dados', { timeout: 10000 })
    .should('be.visible')
    .click()

  cy.contains(meus_dados_localizadores.item_menu_meus_dados(), 'Meus Dados', { timeout: 10000 })
    .should('be.visible')
    .click()

  cy.url({ timeout: 10000 }).should('include', '/meus-dados')
  cy.get('body').should('contain.text', 'Meus Dados')
})

Cypress.Commands.add('validar_campo_meus_dados', (campo) => {
  const campoNormalizado = String(campo).trim().toLowerCase()

  function validarInputPreenchido(selector, nomeCampo) {
    cy.get(selector, { timeout: 5000 })
      .should('be.visible')
      .should(($el) => {
        const valor =
          $el.prop('value') ||
          $el.attr('value') ||
          $el.val() ||
          $el.text()

        expect(String(valor).trim(), nomeCampo).to.not.equal('')
      })
  }

  switch (campoNormalizado) { 
    case 'email':
      validarInputPreenchido(meus_dados_localizadores.input_email(), 'Campo Email')
      break

    case 'senha':
      cy.get(meus_dados_localizadores.input_senha(), { timeout: 5000 })
        .should('be.visible')
      break

    default:
      throw new Error(`Campo de Meus Dados não tratado: ${campo}`)
  }
})

Cypress.Commands.add('clicar_alterar', (campo) => {
  const campoNormalizado = String(campo).trim().toLowerCase()

  switch (campoNormalizado) {   
    case 'email':
    case 'e-mail':
      cy.get(meus_dados_localizadores.btn_alterar_email(), { timeout: 5000 })
        .should('have.length.greaterThan', 0)
        .first()
        .should('be.visible')
        .click()
      break

    case 'senha':
      cy.get(meus_dados_localizadores.btn_alterar_senha(), { timeout: 5000 })
        .should('have.length.greaterThan', 0)
        .first()
        .should('be.visible')
        .click()
      break

    default:
      throw new Error(`Campo não tratado: ${campo}`)
  }
})

Cypress.Commands.add('clicar_modal_cancelar', () => {
  cy.get(meus_dados_localizadores.btn_modal_cancelar(), { timeout: 5000 })
    .should('be.visible')
    .click()
})

Cypress.Commands.add('validar_modal_alteracao_visivel', () => {
  cy.get(meus_dados_localizadores.btn_modal_alterar(), { timeout: 5000 })
    .should('exist')
    .should('be.visible')
    .click()
})

Cypress.Commands.add('validar_modal_alteracao_nao_visivel', () => {
  cy.get(meus_dados_localizadores.btn_modal_alterar(), { timeout: 5000 })
    .should('not.exist')
})

Cypress.Commands.add('validar_alteracao_meus_dados', () => {
  cy.get(meus_dados_localizadores.msgm_alteracao_sucesso(), { timeout: 5000 })
    .should('not.exist')
})

Cypress.Commands.add('validar_campos_modal_senha', (campo) => {
  const campoNormalizado = String(campo)
    .trim()
    .toLowerCase()

  let selector

  switch (campoNormalizado) {
    case 'senha atual':
      selector = meus_dados_localizadores.input_senha_atual()
      break

    case 'nova senha':
      selector = meus_dados_localizadores.input_nova_senha()
      break

    case 'confirmação senha':
    case 'confirmacao senha':
      selector = meus_dados_localizadores.input_confirmacao_senha()
      break

    default:
      throw new Error(`Campo não mapeado no modal: ${campo}`)
  }

  cy.get('.ant-modal-content', { timeout: 10000 })
    .should('be.visible')
    .within(() => {
      cy.get(selector)
        .should('exist')
        .and('be.visible')
    })
})

Cypress.Commands.add('preencher_modal_senha', () => {
  const senha = Cypress.env('SENHA')

  if (!senha) {
    throw new Error('SENHA não definida no Cypress.env')
  }

  cy.get('.ant-modal-content', { timeout: 10000 })
    .should('be.visible')
    .within(() => {
      cy.get(meus_dados_localizadores.input_senha_atual(), { timeout: 5000 })
        .should('be.visible')
        .clear()
        .type(senha, { log: false })

      cy.get(meus_dados_localizadores.input_nova_senha(), { timeout: 5000 })
        .should('be.visible')
        .clear()
        .type(senha, { log: false })

      cy.get(meus_dados_localizadores.input_confirmacao_senha(), { timeout: 5000 })
        .should('be.visible')
        .clear()
        .type(senha, { log: false })

      cy.get(meus_dados_localizadores.btn_modal_alterar(), { timeout: 5000 })
        .should('be.visible')
        .click({ force: true })
    })

  cy.get('.ant-modal-content', { timeout: 5000 }).should('not.exist')
})