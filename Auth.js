/**
 * CustomDiscord Registry Backend
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
  generateToken(user, profile, time = '1h') {
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
      expiresIn: time === 'never' ? '2y' : time
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
      User.findById(token.id).then((user) => {
        if (admin && !user.admin) throw new InvalidTokenError()
        req.token = token
        req.isAdmin = user.admin
        req.user = user
        return next()
      })
    }
  }
}
module.exports = new AuthManager()