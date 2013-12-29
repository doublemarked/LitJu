var fs        = require('fs')
var path      = require('path')
var Sequelize = require('sequelize')
var lodash    = require('lodash')

var config = require('../config');
var sequelize = new Sequelize(config.db.database, config.db.username, config.db.password);
var db = {};
 
fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js')
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })
 
Object.keys(db).forEach(function(modelName) {
  if (db[modelName].options.hasOwnProperty('associate')) {
    db[modelName].options.associate(db)
  }
})
 
var init = function (clear, callback) {
    sequelize
        .sync({ force: !!clear })
        .complete(function(err) {
            if (err) {
                throw err;
            } else {
                callback();
            }
        });
};

module.exports = lodash.extend({
  init: init,
  sequelize: sequelize,
  Sequelize: Sequelize
}, db)

