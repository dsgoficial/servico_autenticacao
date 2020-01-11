'use strict'

const { errorHandler } = require('./utils')
const { startServer } = require('./server')
const { db, databaseVersion } = require('./database')

db.createConn()
  .then(databaseVersion.load)
  .then(startServer)
  .catch(errorHandler)
