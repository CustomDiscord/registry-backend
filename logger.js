/**
 * Custocord Registry Backend
 * 
 * File...................logger.js
 * Created on.............Thursday, 28th December 2017 9:11:04 pm
 * Created by.............Relative
 * 
 */
const config = require('config')
const path = require('path')
const winston = require('winston')

const cformat = winston.format((info) => {
  info[Symbol.for('message')] = info.level + ': ' + info.message
  return info
})

const format = winston.format.combine(
  winston.format.colorize(),
  cformat()
)



const logger = winston.createLogger({
  level: config.get('logging.level'),
  transports: [
    new winston.transports.Console({
      format: (config.get('logging.colorize') ? format : winston.format.simple())
    })
  ]
})

if (config.get('logging.file.enabled')) {
  logger.add(new winston.transports.File({
    filename: path.join(__dirname, config.get('logging.file.path'), 'error.log'),
    level: 'error'
  }))
  logger.add(new winston.transports.File({
    filename: path.join(__dirname, config.get('logging.file.path'), 'combined.log')
  }))
}

logger.verbose('Logging in verbose mode')
module.exports = logger