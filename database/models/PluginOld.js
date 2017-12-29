/**
 * Custocord Registry Backend
 * 
 * File...................Plugin.js
 * Created on.............Thursday, 28th December 2017 9:09:39 pm
 * Created by.............Relative
 * 
 */
const Sequelize = require('sequelize')
/**
 * Define the Model
 * @param {Sequelize} db
 * @param {Sequelize.Model} User
 * @returns {Sequelize.Model}
 */
module.exports = (db, User) => {
  return db.define('Plugin', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    deleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    unlisted: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    verified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    owner: {
      type: Sequelize.UUID, // UUID of the User
      references: {
        model: User,
        key: 'id'
      }
    },
    styles: {
      type: Sequelize.STRING,
      defaultValue: 'https://gist.githubusercontent.com/FNCxPro/ba5c71e82418398f4a26c45462d00291/raw/e086eca8d9e519f6fff90fc90dc195e27ed46a20/style.css',
      validate: {
        isUrl: true
      }
    },
    archive: {
      type: Sequelize.STRING,
      validate: {
        isUrl: true
      }
    },
    version: {
      type: Sequelize.STRING,
      defaultValue: '0.1.0'
    },
    approved: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  })
}