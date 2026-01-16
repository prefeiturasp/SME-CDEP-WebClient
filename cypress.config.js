const { defineConfig } = require('cypress')
const allureWriter = require('@shelex/cypress-allure-plugin/writer')
const dotenv = require('dotenv')
const cucumber = require('cypress-cucumber-preprocessor').default
const postgreSQL = require('cypress-postgresql')
const pg = require('pg')

// upload
const fs = require('fs')
const FormData = require('form-data')
const axios = require('axios')

dotenv.config()

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
}

module.exports = defineConfig({
  e2e: {
    async setupNodeEvents(on, config) {
      // Allure
      allureWriter(on, config)

      // Cucumber
      on('file:preprocessor', cucumber())

      // PostgreSQL
      const pool = new pg.Pool(dbConfig)
      const dbTasks = postgreSQL.loadDBPlugin(pool)

      // TASKS (Postgres + Upload)
      on('task', {
        ...dbTasks,

        async uploadFile({ method = 'POST', url, headers = {}, filePath }) {
          try {
            const form = new FormData()

            // Adiciona arquivo se existir e não estiver vazio
            if (filePath && filePath.trim() !== '') {
              form.append('file', fs.createReadStream(filePath))
            }

            const response = await axios({
              method,
              url,
              headers: {
                ...headers,
                ...form.getHeaders(),
              },
              data: form,
              maxBodyLength: Infinity,
              validateStatus: () => true, 
            })

            return {
              status: response.status,
              body: response.data,
            }
          } catch (error) {
            console.error('Erro na task uploadFile')

            if (error.response) {
              console.error('STATUS:', error.response.status)
              console.error('BODY:', error.response.data)
            } else {
              console.error(error.message)
            }

            throw error
          }
        },
      })

      // variáveis de ambiente
      const envKeys = [
        'ACERVO_SOLICITACAO_ITEM_ID',
        'ANO_FINAL',
        'ANO_INICIAL',
        'ARQUIVO_ARMAZENAMENTO',
        'ASSUNTO_ID',
        'ASSUNTO_ID_DELETAR',
        'ASSUNTO_ID_INVALIDO',
        'ASSUNTO_NOME',
        'CEP_INVALIDO',
        'CEP_VALIDO',
        'CODIGO_ACERVO',
        'CODIGO_TOMBO',
        'DATA_DEVOLUCAO',
        'DATA_DEVOLUCAO_INVALIDA',
        'IMPORTACAO_PLANILHA_ID',
        'LOGIN_ADM_GERAL',
        'PERFIL_ADM_GERAL',
        'PERFIL_INVALIDO',
        'SENHA',
        'SENHA_INVALIDA',
        'TERMO_PESQUISADO',
        'TEXTO_LIVRE',
        'TIPO_ACERVO',
        'TIPO_ACERVO_CODIGO',
        'TITULO_ACERVO',
      ]

      const customVariable = Object.fromEntries(
        envKeys.map((key) => [key, process.env[key] ?? ''])
      )

      return {
        ...config,
        env: {
          ...config.env,
          ...customVariable,
        },
      }
    },

    baseUrl: 'https://hom-cdep.sme.prefeitura.sp.gov.br',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1600,
    viewportHeight: 1050,
    video: false,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    screenshotOnRunFailure: false,
    chromeWebSecurity: false,
    experimentalRunAllSpecs: true,
    failOnStatusCode: false,

    specPattern: ['cypress/e2e/**/*.feature'],

    defaultCommandTimeout: 60000,
    requestTimeout: 60000,
    execTimeout: 60000,
    pageLoadTimeout: 60000,
    waitForAnimations: true,
    animationDistanceThreshold: 5,
  },
})
