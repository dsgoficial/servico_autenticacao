'use strict'

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const xss = require('xss-clean')
const hpp = require('hpp')
const rateLimit = require('express-rate-limit')
const swaggerUi = require('swagger-ui-express')
const swaggerJSDoc = require('swagger-jsdoc')

const swaggerOptions = require('./swagger_options')
const swaggerSpec = swaggerJSDoc(swaggerOptions)

const {
  errorHandler,
  sendJsonAndLogMiddleware
} = require('../utils')

const appRoutes = require('../routes')

const app = express()

// Add sendJsonAndLog to res object
app.use(sendJsonAndLogMiddleware)

app.use(bodyParser.json()) // parsear POST em JSON
app.use(hpp()) // protection against parameter polution
app.use(xss())

// CORS middleware
app.use(cors())

// Helmet Protection
app.use(helmet())
// Disables cache https://helmetjs.github.io/docs/nocache/
app.use(helmet.noCache())

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 200 // limite por minuto por IP
})

// apply limit all requests
app.use(limiter)

// All routes used by the App
app.use('/api', appRoutes)

// Serve SwaggerDoc
app.use('/api/api_docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Serve JSDocs
app.use('/api/js_docs', express.static(path.join(__dirname, '..', 'js_docs')))

// Serve Client
app.use(express.static(path.join(__dirname, '..', 'build')))

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'))
})

// Error handling
app.use((err, req, res, next) => {
  return errorHandler(err, res)
})

module.exports = app
