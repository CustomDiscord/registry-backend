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
const { ServerError, ParameterNotDefinedError, PackageNotFoundError, InvalidTokenError } = require('./errors')
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
  
  /**
   * Auth middleware
   * @param {Boolean} [admin = false] - Whether admin is required to access the route
   * @param {Boolean | String} [user = false] - Whether the route is locked down to a certain user
   * @returns {Function}
   */
  middleware(admin = false, user = false) {
    const self = this
    return (req, res, next) => {
      if (!req.get('Authorization')) throw new ParameterNotDefinedError('token')
      const token = self.verifyToken(req.get('Authorization'))
      if (!token) throw new InvalidTokenError()
      const user = User.findById(token.id)
      if (admin && !user.admin) throw new InvalidTokenError()
      if (typeof user === 'string' && token.id !== user) throw new InvalidTokenError()
      req.token = token
      req.isAdmin = user.admin
      req.user = user
      return next()
    }
  }
}

module.exports = new AuthManager()