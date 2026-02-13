import { defineConfig } from 'cypress'
import allureWriter from '@shelex/cypress-allure-plugin/writer.js'
import dotenv from 'dotenv'
import cucumber from 'cypress-cucumber-preprocessor'
import preprocessor from '@cypress/webpack-preprocessor'
import postgreSQL from 'cypress-postgresql'
import pg from 'pg'
import fs from 'fs'
import FormData from 'form-data'
import axios from 'axios'

dotenv.config()

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
}

export default defineConfig({
  e2e: {
    async setupNodeEvents(on, config) {
      const webpackConfig = {
        module: {
          rules: [
            {
              test: /\.js$/,
              use: {
                loader: 'babel-loader',
                options: {
                  plugins: ['@babel/plugin-transform-modules-commonjs'],
                },
              },
            },
          ],
        },
      }

      // Allure
      allureWriter(on, config)

      // Cucumber + Webpack
      on('file:preprocessor', preprocessor({ webpackOptions: webpackConfig }))
      on('file:preprocessor', cucumber.default())

      // PostgreSQL
      const pool = new pg.Pool(dbConfig)
      const dbTasks = postgreSQL.loadDBPlugin(pool)

      on('task', {
        ...dbTasks,
        async uploadFile({ method = 'POST', url, headers = {}, filePath }) {
          const form = new FormData()
          if (filePath && filePath.trim() !== '') {
            form.append('file', fs.createReadStream(filePath))
          }

          const response = await axios({
            method,
            url,
            headers: { ...headers, ...form.getHeaders() },
            data: form,
            maxBodyLength: Infinity,
            validateStatus: () => true,
          })

          return { status: response.status, body: response.data }
        },
      })

      const envKeys = [
        'ACERVO_SOLICITACAO_ITEM_ID',
        'ACESSO_DOCUMENTO_NOME',
        'ACESSO_DOCUMENTO_ID',
        'ACESSO_DOCUMENTO_INVALIDO_ID',
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
        env: { ...config.env, ...customVariable },
      }
    },

    baseUrl: 'https://hom-cdep.sme.prefeitura.sp.gov.br',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1600,
    viewportHeight: 1050,
    video: false,
    retries: { runMode: 2, openMode: 0 },
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