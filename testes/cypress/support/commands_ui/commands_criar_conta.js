import Criar_Conta_Localizadores from '../locators/criar_conta_locators'
import { fakerPT_BR as faker } from '@faker-js/faker'

const criar_conta_localizadores = new Criar_Conta_Localizadores()

Cypress.Commands.add('acessar_criar_conta', () => { 
  cy.get(criar_conta_localizadores.btn_criar_conta(), { timeout: 10000 })
    .should('be.visible')
    .click()

  cy.url({ timeout: 10000 }).should('include', 'criar-conta')
})

Cypress.Commands.add('preencher_formulario_usuario', () => {

  const nome = faker.person.fullName()
  const email = faker.internet.email()
  const senha = Cypress.env('SENHA')
  const ddd = faker.string.numeric(2)
  const telefone = `9${faker.string.numeric(8)}`
  const cidade = faker.location.city()

  cy.get(criar_conta_localizadores.input_cpf())
    .type(faker.string.numeric(11))

  cy.get(criar_conta_localizadores.input_nome())
    .type(nome)

  cy.get(criar_conta_localizadores.input_email())
    .type(email)

  cy.get(criar_conta_localizadores.input_telefone())
    .type(`${ddd}${telefone}`)

  cy.get(criar_conta_localizadores.input_confirmacao_email())
    .type(email)

  cy.get(criar_conta_localizadores.inpurt_cep())
    .type(faker.string.numeric(8))

  cy.get(criar_conta_localizadores.input_endereco())
    .type(faker.location.street())

  cy.get(criar_conta_localizadores.input_numero())
    .type(faker.string.numeric(3))

  cy.get(criar_conta_localizadores.input_complemento())
    .type(`Apto ${faker.string.numeric(2)}`)

  cy.get(criar_conta_localizadores.input_bairro())
    .type(faker.location.city())

  cy.get(criar_conta_localizadores.input_cidade())
    .type(cidade)

  cy.get(criar_conta_localizadores.select_estado())
    .click()

  cy.get(criar_conta_localizadores.select_opcao(), { timeout: 10000 })
    .first()
    .click()

  cy.get(criar_conta_localizadores.input_tipo())
    .click()

  cy.get(criar_conta_localizadores.select_opcao())
    .contains('População em geral')
    .click()

  cy.get(criar_conta_localizadores.input_instituicao())
    .type('teste')

  cy.get(criar_conta_localizadores.input_senha())
    .type(senha)

  cy.get(criar_conta_localizadores.input_confirmacao_senha())
    .type(senha)
})

Cypress.Commands.add('clicar_cadastrar_usuario', () => {
  cy.get(criar_conta_localizadores.btn_cadastre_se(), { timeout: 10000 })
    .should('be.visible')
    .click()
})

Cypress.Commands.add('validar_cadastrar_usuario', () => {
  cy.url({ timeout: 10000 }).should('include', 'login')
})

Cypress.Commands.add('campo_obrigatorio_formulario_usuario', (campoIgnorado = null) => {

  const nome = faker.person.fullName()
  const email = faker.internet.email()
  const senha = Cypress.env('SENHA')
  const ddd = faker.string.numeric(2)
  const telefone = `9${faker.string.numeric(8)}`
  const cidade = faker.location.city()

  if (campoIgnorado !== 'cpf') {
    cy.get(criar_conta_localizadores.input_cpf())
      .type(faker.string.numeric(11))
  }

  if (campoIgnorado !== 'nome') {
    cy.get(criar_conta_localizadores.input_nome())
      .type(nome)
  }

  if (campoIgnorado !== 'email') {
    cy.get(criar_conta_localizadores.input_email())
      .type(email)
  }

  if (campoIgnorado !== 'telefone') {
    cy.get(criar_conta_localizadores.input_telefone())
      .type(`${ddd}${telefone}`)
  }

  if (campoIgnorado !== 'confirmacao_email') {
    cy.get(criar_conta_localizadores.input_confirmacao_email())
      .type(email)
  }

  if (campoIgnorado !== 'cep') {
    cy.get(criar_conta_localizadores.inpurt_cep())
      .type(faker.string.numeric(8))
  }

  if (campoIgnorado !== 'endereco') {
    cy.get(criar_conta_localizadores.input_endereco())
      .type(faker.location.street())
  }

  if (campoIgnorado !== 'numero') {
    cy.get(criar_conta_localizadores.input_numero())
      .type(faker.string.numeric(3))
  }

  if (campoIgnorado !== 'bairro') {
    cy.get(criar_conta_localizadores.input_bairro())
      .type(faker.location.city())
  }

  if (campoIgnorado !== 'cidade') {
    cy.get(criar_conta_localizadores.input_cidade())
      .type(cidade)
  }

  if (campoIgnorado !== 'estado') {
    cy.get(criar_conta_localizadores.select_estado())
      .click()

    cy.get(criar_conta_localizadores.select_opcao(), { timeout: 10000 })
      .first()
      .click()
  }

  if (campoIgnorado !== 'tipo') {
    cy.get(criar_conta_localizadores.input_tipo())
      .click()

    cy.get(criar_conta_localizadores.select_opcao())
      .contains('População em geral')
      .click()
  }

  if (campoIgnorado !== 'instituicao') {
    cy.get(criar_conta_localizadores.input_instituicao())
      .type('teste')
  }

  if (campoIgnorado !== 'senha') {
    cy.get(criar_conta_localizadores.input_senha())
      .type(senha)
  }

  if (campoIgnorado !== 'confirmacao_senha') {
    cy.get(criar_conta_localizadores.input_confirmacao_senha())
      .type(senha)
  }
})

Cypress.Commands.add('validar_campo_obrigatorio_cadastrar_usuario', () => {
  cy.url({ timeout: 10000 }).should('include', 'cdep')
})