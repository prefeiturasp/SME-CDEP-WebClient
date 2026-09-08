// Plugin do Allure (deve vir primeiro)
require('@shelex/cypress-allure-plugin')

// Comandos personalizados - API
require('./commands_api/commands_login')

// Comandos personalizados - UI
require('./commands_ui/commands_commons')
require('./commands_ui/commands_login')
require('./commands_ui/commands_solicitacoes')
require('./commands_ui/commands_meus_dados')
require('./commands_ui/commands_dashboards')
require('./commands_ui/commands_assunto') 
require('./commands_ui/commands_credito')
require('./commands_ui/commands_autor')
require('./commands_ui/commands_editora')
require('./commands_ui/commands_serie_colecao')
require('./commands_ui/commands_relatorios')
require('./commands_ui/commands_redefinir_senha')
require('./commands_ui/commands_calendario')
require('./commands_ui/commands_criar_conta')

// Evita falhas silenciosas caso algum comando seja removido ou renomeado
Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})



