import Login_CDEP_Localizadores from '../locators/login_locators'

const login_CDEP_Localizadores = new Login_CDEP_Localizadores

Cypress.Commands.add('login_CDEP', (device) => {
	cy.configurar_visualizacao(device)
})

Cypress.Commands.add('realizar_login', (perfil) => {
	switch (perfil) {
		case "Admin":
			cy.get(login_CDEP_Localizadores.texto_usuario())
			  .type(Cypress.config('usuario_homol_admin'))
			cy.get(login_CDEP_Localizadores.texto_senha())
			  .type(Cypress.config('senha_homol'))
			cy.get(login_CDEP_Localizadores.botao_acessar())
			  .should('be.visible').click()

			cy.url().should('include', 'indicadores')
			break

		case "Externo":
			cy.get(login_CDEP_Localizadores.texto_usuario())
			  .type(Cypress.config('usuario_homol_externo'))
			cy.get(login_CDEP_Localizadores.texto_senha())
			  .type(Cypress.config('senha_homol'))
			cy.get(login_CDEP_Localizadores.botao_acessar())
			  .should('be.visible').click()

			cy.contains('Minhas solicitações').should('be.visible')
			break

		default:
			console.error("Perfil não encontrado!")
	}
})

Cypress.Commands.add('clicar_botao_acessar', () => {
	cy.get(login_CDEP_Localizadores.botao_acessar())
	  .should('be.visible').click()	
})

Cypress.Commands.add('validar_acesso_cdep', () => {
	cy.get(login_CDEP_Localizadores.logo_cdep())
	  .should('be.visible')
})

Cypress.Commands.add('validar_campos_obrigatorios_acesso', (campo) => {

  if (campo === 'login') {    
    cy.get(login_CDEP_Localizadores.texto_senha())
      .type(Cypress.config('senha_homol'))
  }

  if (campo === 'senha_admin') {    
    cy.get(login_CDEP_Localizadores.texto_usuario())
      .type(Cypress.config('usuario_homol_admin'))
  }

   if (campo === 'senha_externo') {    
    cy.get(login_CDEP_Localizadores.texto_usuario())
      .type(Cypress.config('usuario_homol_externo'))
  }

  cy.get(login_CDEP_Localizadores.botao_acessar())
    .should('be.visible')
    .click()

  cy.get(login_CDEP_Localizadores.texto_obrigatorio())
    .should('be.visible')

  cy.contains('Você precisa informar um usuário e senha para acessar o sistema')
    .should('be.visible')
})

Cypress.Commands.add('validar_caracteres_acesso', (campo, dado) => {

  if (campo === 'login') {
    cy.get(login_CDEP_Localizadores.texto_usuario())
      .clear()
      .type(dado)

    cy.get(login_CDEP_Localizadores.texto_senha())
      .clear()
      .type(Cypress.config('senha_homol'))
  }

  if (campo === 'senha') {
    cy.get(login_CDEP_Localizadores.texto_usuario())
      .clear()
      .type(Cypress.config('usuario_homol_admin'))

    cy.get(login_CDEP_Localizadores.texto_senha())
      .clear()
      .type(dado)
  }

  cy.get(login_CDEP_Localizadores.botao_acessar())
    .should('be.visible')
    .click()

  cy.get(login_CDEP_Localizadores.texto_obrigatorio())
    .should('be.visible')

  cy.contains('Você precisa informar um usuário e senha para acessar o sistema')
    .should('be.visible')
})

Cypress.Commands.add('validar_acesso_invalido', (campo, dado) => {

  if (campo === 'login') {
    cy.get(login_CDEP_Localizadores.texto_usuario())
      .clear()
      .type(dado)

    cy.get(login_CDEP_Localizadores.texto_senha())
      .clear()
      .type(Cypress.config('senha_homol'))
  }

  if (campo === 'senha') {
    cy.get(login_CDEP_Localizadores.texto_usuario())
      .clear()
      .type(Cypress.config('usuario_homol_admin'))

    cy.get(login_CDEP_Localizadores.texto_senha())
      .clear()
      .type(dado)
  }

  cy.get(login_CDEP_Localizadores.botao_acessar())
    .should('be.visible')
    .click()

  cy.get(login_CDEP_Localizadores.texto_obrigatorio())
    .should('be.visible')

  cy.contains('Usuário ou senha inválidos')
    .should('be.visible')
})