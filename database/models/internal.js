/**
 * Custocord Registry Backend
 * 
 * File...................internal.js
 * Created on.............Friday, 29th December 2017 11:30:04 am
 * Created by.............Relative
 * 
 */
const Sequelize = require('sequelize')

/**
 * Define models on the database to use in syncing
 * @param {Sequelize} db - Sequelize database to define models on
 * @returns {Boolean}
 */
module.exports = (db) => {
  const User = require('./User')(db)
  const Plugin = require('./Plugin')(db, User)
  return true
}