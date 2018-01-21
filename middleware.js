/**
 * CustomDiscord Registry Backend
 * 
 * File...................middleware.js
 * Created on.............Friday, 29th December 2017 2:13:17 pm
 * Created by.............Relative
 * 
 */
const { NoBodyError, BodyParamMissingError } = require('./errors')
function bodyChecker(params) {
  return (req, res, next) => {
    if (!req.body) throw new NoBodyError()
    params.forEach((param) => {
      const isObject = (typeof param === 'object')
      const p = isObject ? param.name : param
      const type = isObject ? param.type : undefined
      if(typeof req.body[p] === 'undefined') throw new BodyParamMissingError(p)
      if(typeof type !== 'undefined' && typeof req.body[p] !== type) throw new BodyParamMissingError(p)
    })
    return next()
  }
}

module.exports = {
  bodyChecker
}