/**
 * Custocord Registry Backend
 * 
 * File...................Auth.js
 * Created on.............Friday, 29th December 2017 11:49:18 am
 * Created by.............Relative
 * 
 */
const config = require('config')
const jwt = require('jsonwebtoken')
const { User } = require('./database/models')

class AuthManager {
  constructor() {
    this.key = config.get('tokens.key')
  }
  generateToken(user, profile) {
    const payload = {
      user,
      discord: user.discordId,
      id: user.id,
      admin: user.admin,
      profile: profile || {
        id: user.discordId
      }
    }
    const token = jwt.sign(payload, this.key, {
      expiresIn: '1h'
    })
    return token
  }
  /**
   * Verify a token
   * @param {String} token - Token to verify
   * @returns {Boolean|Object}
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, this.key)
    } catch(err) {
      return false
    }
  }
  
}

module.exports = new AuthManager()