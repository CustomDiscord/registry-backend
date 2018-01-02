'use strict';
module.exports = (sequelize, DataTypes) => {
  var Plugin = sequelize.define('Plugin', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    unlisted: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    owner: {
      type: DataTypes.UUID // UUID of the User
    },
    styles: {
      type: DataTypes.STRING,
      defaultValue: 'https://gist.githubusercontent.com/FNCxPro/ba5c71e82418398f4a26c45462d00291/raw/e086eca8d9e519f6fff90fc90dc195e27ed46a20/style.css',
      validate: {
        isUrl: true
      }
    },
    isStyle: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    archive: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true
      }
    },
    version: {
      type: DataTypes.STRING,
      defaultValue: '0.1.0'
    },
    approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    downloads: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      defaultValue: []
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Plugin;
};