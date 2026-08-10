import { When, Then } from 'cypress-cucumber-preprocessor/steps'

const Quando = When
const Então = Then


Quando('acesso a tela Calendário', function () {
  cy.acessar_calendario() 
})

Quando('crio cadastro no calendário {string}', function () {
  cy.cadastrar_calendario()   
})

Então('o sistema salva o registro no calendário', function () { 
  cy.validar_cadastro_calendario() 
})

Quando('tento cadastrar o mesmo dia no calendário {string}', function () {
})

Então('o sistema não permite salvar o calendário duplicado', function () {
 
})

Quando('tento salvar sem justificativa no calendário {string}', function () {
 
})

Então('o sistema não permite salvar sem preencher no calendário', function () {
  
})

Quando('excluo cadastro no calendário {string}', function () {  
  cy.excluir_calendario()   
})

Então('o sistema retira o registro no calendário', function () { 
  cy.validar_exclusao_calendario() 
})

Quando('cancelo o cadastro no calendário {string}', function () {   
})

Então('o sistema retorna todos os dias no calendário', function () {   
})

Quando('cancelo a exclusão do cadastro no calendário {string}', function () {   
})

Então('o sistema retorna para o dia de registro do calendário', function () {   
})
