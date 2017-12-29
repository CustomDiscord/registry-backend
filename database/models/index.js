/**
 * Custocord Registry Backend
 * 
 * File...................index.js
 * Created on.............Thursday, 28th December 2017 9:10:08 pm
 * Created by.............Relative
 * 
 */
const db = require('../')
const Plugin = require('./Plugin')(db)
const User = require('./User')(db)

module.exports = {
  Plugin,
  User
}