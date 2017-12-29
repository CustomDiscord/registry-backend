/**
 * Custocord Registry Backend
 * 
 * File...................errors.js
 * Created on.............Friday, 29th December 2017 12:10:29 pm
 * Created by.............Relative
 * 
 */
class ServerError extends Error {
  constructor(message, code, status) {
    super(message || 'An unknown error occurred, try your request later')
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)

    this.status = status || 500
    this.code = code || `${this.status}-UNKWN`
  }
}

class PackageNotFoundError extends ServerError {
  constructor(pkg) {
    super(typeof pkg === 'string' ? `The package "${pkg}" was unable to be found in the database` : 'The package you were looking for was unable to be found in the database', `404-PKGNF-${pkg}`, 404)
  }
}

class ParameterNotDefinedError extends ServerError {
  constructor(param) {
    super(`The parameter "${param}" was not defined in your request. Define it and try again.`, `400-PUNDEF-${param}`, 400)
  }
}

class InvalidTokenError extends ServerError {
  constructor() {
    super('Your token is invalid', '403-BADTKN', 403)
  }
}

class PackageNotApprovedError extends ServerError {
  constructor() {
    super('That package is not approved yet, try again later', '403-PKGUAPR', 403)
  }
}

class UnauthorizedError extends ServerError {
  constructor() {
    super('You are not allowed to modify that package', '403-UNAUTH', 403)
  }
}

module.exports = {
  ServerError,
  PackageNotFoundError,
  ParameterNotDefinedError,
  InvalidTokenError,
  UnauthorizedError,
  PackageNotApprovedError
}