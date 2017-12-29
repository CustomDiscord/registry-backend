/**
 * Custocord Registry Backend
 * 
 * File...................index.js
 * Created on.............Thursday, 28th December 2017 8:58:21 pm
 * Created by.............Relative
 * 
 */
const config = require('config')
const logger = require('../logger')
const Sequelize = require('sequelize')

const db = new Sequelize(
  config.get('database.database'), 
  config.get('database.username'), 
  config.get('database.password'),
  {
    host: config.get('database.host'),
    port: config.get('database.port'),
    dialect: 'postgres',
    operatorsAliases: false,
    logging: false
  }
)
require('./models/internal')(db)

db.authenticate().then(() => {
  logger.info('Successfully connected to database!')
  logger.log('verbose', 'Syncing models to the database')
  db.sync().then(() => {
    logger.log('verbose', 'Models synchronized with the database successfully')
  }).catch((err) => {
    logger.error({
      message: 'Failed to sync models to the database! Exiting...',
      error: err
    })
    process.exit(0)
  })
  
}).catch((err) => {
  logger.error({
    message: 'Could not connect to the database. Exiting...',
    error: err
  })
  process.exit(0)
})

module.exports = db