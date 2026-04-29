Cypress.Commands.add('configurar_visualizacao', (device) => {
	cy.visit(Cypress.config('baseUrl'))
	switch (device) {
		case 'web':
			cy.viewport(1920, 1080)
			break
		default:
			break
	}
})

Cypress.Commands.add('acessar_cadastros', () => {
  cy.get(':nth-child(2) > .ant-menu-submenu-title', { timeout: 10000 })
    .should('be.visible')
    .click()
})
