/**
 * Custocord Registry Backend
 * 
 * File...................User.js
 * Created on.............Friday, 29th December 2017 10:44:47 am
 * Created by.............Relative
 * 
 */
const Sequelize = require('sequelize')
/**
 * Define the Model
 * @type {Sequelize} db
 * @returns {Sequelize.Model}
 */
module.exports = (db) => {
  return db.define('user', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    },
    discordId: {
      type: Sequelize.STRING
    },
    admin: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  })
}