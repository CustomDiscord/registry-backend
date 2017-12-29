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

db.authenticate().then(() => {
  logger.info('Successfully connected to database!')
}).catch((err) => {
  logger.error('Could not connect to the database.', err)
  logger.error('Exiting...')
  process.exit(0)
})

module.exports = db