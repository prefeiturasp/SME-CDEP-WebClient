import { defineConfig } from 'cypress'
import allureWriter from '@shelex/cypress-allure-plugin/writer.js'
import { cloudPlugin } from 'cypress-cloud/plugin'
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
    watchForFileChanges: true,
    baseUrl: 'https://qa-cdep.sme.prefeitura.sp.gov.br',
    usuario_homol_admin: process.env.USUARIO_HOMOL_ADMIN,
    usuario_homol_externo: process.env.USUARIO_HOMOL_EXTERNO,   
    senha_homol: process.env.SENHA_HOMOL,
    supportFile: 'cypress/support/e2e.js',

    viewportWidth: 1920,
    viewportHeight: 1080,
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

    async setupNodeEvents(on, config) {

      allureWriter(on, config)

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

      on('file:preprocessor', preprocessor({ webpackOptions: webpackConfig }))
      on('file:preprocessor', cucumber.default())

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
        'ANO_FINAL',
        'ANO_INICIAL',
        'ARQUIVO_ARMAZENAMENTO',
        'ASSUNTO_ID',
        'ASSUNTO_ID_DELETAR',
        'ASSUNTO_ID_INVALIDO',
        'ASSUNTO_NOME',
        'CEP_INVALIDO',
        'CEP_VALIDO',
        'CPF',
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
        'EMAIL',
        'TELEFONE',
        'TERMO_PESQUISADO',
        'TEXTO_LIVRE',
        'TIPO_ACERVO',
        'TIPO_ACERVO_CODIGO',
        'TITULO_ACERVO'
      ]

      const customVariable = Object.fromEntries(
        envKeys.map((key) => [key, process.env[key] ?? ''])
      )

      config.env = { ...config.env, ...customVariable }
      config.env.db = dbConfig

      const enhancedConfig = await cloudPlugin(on, config)

      return enhancedConfig
    },
  },
})
