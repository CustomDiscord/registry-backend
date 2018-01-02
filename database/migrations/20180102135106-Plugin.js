/**
 * Custocord Registry Backend
 * 
 * File...................20180102135106-Plugin.js
 * Created on.............Tuesday, 2nd January 2018 8:51:06 am
 * Created by.............Relative
 * 
 */
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Plugins', 'downloads', {
      type: Sequelize.ARRAY(Sequelize.UUID)
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Plugins', 'downloads')
  }
};
