/**
 * Custocord Registry Backend
 * 
 * File...................index.js
 * Created on.............Thursday, 28th December 2017 8:51:07 pm
 * Created by.............Relative
 * 
 */
const config = require('config')
const db = require('./database')
const DiscordStrategy = require('passport-discord').Strategy
const express = require('express')
const logger = require('./logger')
const passport = require('passport')

const app = express()
app.set('port', config.get('server.port'))

/**
 * Passport
 */
passport.use(new DiscordStrategy({
  clientID: config.get('discord.client_id'),
  clientSecret: config.get('discord.client_secret'),
  callbackURL: config.get('server.domain') + '/auth/callback',
  scope: config.get('discord.scopes')
}, (accessToken, refreshToken, profile, cb) => {
  return cb(null, profile)
}))
app.use(passport.initialize())

const { AuthRouter } = require('./routes')
app.use('/auth', AuthRouter)

app.use((err, req, res, next) => {
  if (err.status) {
    return res.status(err.status).json({
      meta: {
        status: err.status,
        success: false,
        code: err.code || `${err.status}-UNK`,
        message: err.message || 'An unknown error'
      }
    })
  }
  logger.error({
    message: 'An unhandled error occurred',
    error: err
  })
  return res.status(500).json({
    meta: {
      status: 500,
      success: false,
      code: '500-UNK',
      message: 'An unknown error occurred, try your request later'
    }
  })
})

app.listen(config.get('server.port'), () => {
  logger.info(`Server listening on port ${config.get('server.port')}`)
})