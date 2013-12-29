var transform = require("../util").transform;

module.exports = function(sequelize, DataTypes) {
    var transformer = transform.json('stats');

    var Judge = sequelize.define('Judge', {
        id: { type: DataTypes.INTEGER, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        stats: { type: DataTypes.TEXT, allowNull: false, 
                 get: transformer.get, set: transformer.set }
    }, {
        instanceMethods: { toJSON: transformer.toJSON },
        associate: function(models) {
        }
    });

    return Judge;
};
