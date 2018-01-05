'use strict'
const cors = require('cors')
const path = require('path')

const swaggerOption = {
  swagger: {
    info: {
      title: 'Test swagger',
      description: 'testing the fastify swagger api',
      version: '0.1.0'
    },
    host: 'localhost',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json']
  }
}

module.exports = async function (fastify, opts) {
  fastify
    .use(cors({
      'origin': '*',
      'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
      'preflightContinue': false,
      'optionsSuccessStatus': 204,
      'allowedHeaders': ['Content-Type', 'Authorization']
    }))
    .options('*',
    async (req, reply) => {
      reply
        .code(204)
        .header('Content-Type', 'application/json')
        .send()
    })
    .register(require('./modules/user'), { prefix: '/api/user' })
    .register(require('./modules/payments'), { prefix: '/api/payments'})
    .register(require('fastify-swagger'), swaggerOption)
}
