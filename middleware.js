/**
 * Custocord Registry Backend
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
    for(const param in params) {
      let p = param
      let type = undefined
      if(typeof param === 'object') {
        p = param.name
        type = param.type
      }
      if(!req.body[p]) throw new BodyParamMissingError(p)
      if(typeof type !== 'undefined' && typeof req.body[p] !== type) throw new BodyParamMissingError(p)
    }
    return next()
  }
}

module.exports = {
  bodyChecker
}