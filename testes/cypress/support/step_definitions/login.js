import { Given } from 'cypress-cucumber-preprocessor/steps'

const Dado = Given

Dado('eu acesso o sistema com a visualização {string}', function (visualizacao) {
	cy.configurar_visualizacao(visualizacao)
});

Dado('realizo login no sistema CDEP com perfil {string}', function (perfil) {
cy.realizar_login(perfil)
  })