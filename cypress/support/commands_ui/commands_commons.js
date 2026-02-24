import Commons_Locators from '../locators/commons_locators'

const commons_locators = new Commons_Locators


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
