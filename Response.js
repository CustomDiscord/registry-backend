/**
 * CustomDiscord Registry Backend
 * 
 * File...................Response.js
 * Created on.............Friday, 29th December 2017 12:33:28 pm
 * Created by.............Relative
 * 
 */
class Response {
  /**
   * Construct a new Response
   * @param {Boolean} [success = true] - Did the request succeed 
   * @param {String} [message = "OK"] - Message for the meta
   * @param {Number} [status = 200] - Status code
   * @param {Object} payload - Payload
   */
  constructor(success = true, message, status, payload) {
    if (typeof success === 'object') {
      this.success = true
      this.message = 'OK'
      this.status = 200
      this.payload = success
    }
    if (typeof message === 'object') {
      this.message = 'OK'
      this.status = 200
      this.payload = message
    }
    if (typeof message === 'string') this.message = message
    if (typeof status === 'object') {
      this.status = 200
      this.payload = status
    }
    if (typeof payload === 'object') {
      this.success = success
      this.status = status
      this.message = message
      this.payload = payload
    }
    if (typeof this.payload !== 'object') { // Sanity checks
      this.success = success || true
      this.status = status || 200
      this.message = message || 'OK'
      this.payload = payload || {}
    }
  }
  obj() {
    const obj = Object.assign({
      meta: {
        success: this.success || true,
        status: this.status || 200,
        message: this.message || 'OK'
      }
    }, this.payload)
    return obj
  }
}
module.exports = Response