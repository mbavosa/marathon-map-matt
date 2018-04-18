'use strict';
module.exports = (sequelize, DataTypes) => {
  var runlist = sequelize.define('runlist', {
    username: DataTypes.STRING,
    marathon: DataTypes.STRING
  }, {});
  runlist.associate = function(models) {
    // associations can be defined here
  };
  return runlist;
};