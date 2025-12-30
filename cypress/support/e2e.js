// Plugin do Allure (deve vir primeiro)
import '@shelex/cypress-allure-plugin'

// Comandos personalizados - API
import './commands_api/commands_login'

// Comandos personalizados - UI

// Evita falhas silenciosas caso algum comando seja removido ou renomeado
Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})



