/**
 * CustomDiscord Registry Backend
 * 
 * File...................20180105205039-Plugin.js
 * Created on.............Friday, 5th January 2018 3:50:39 pm
 * Created by.............Relative
 * 
 */
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Plugins', 'discordOwner', {
      type: Sequelize.STRING
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Plugins', 'discordOwner')
  }
};
