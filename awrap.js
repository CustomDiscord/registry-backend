/**
 * Custocord Registry Backend
 * 
 * File...................awrap.js
 * Created on.............Friday, 29th December 2017 10:57:12 am
 * Created by.............Relative
 * 
 * Used to wrap async express handlers to send an error to our error handler
 */

/**
 * Async function converter
 * @param {Function} fn - The async function to convert
 * @returns {Function} - The new function
 */
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).then((response) => {
      if(response && response.status) {
        return res.status(response.status).json(response.obj())
      }
    }).catch((err) => {
      return next(err)
    })
  }
}
