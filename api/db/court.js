var transform = require("../util").transform;
var CourtTypes = ['district', 'county', 'administrative', 'supreme', 'supreme administrative'];

module.exports = function(sequelize, DataTypes) {
    var transformer = transform.json('stats');
    var Court = sequelize.define('Court', {
        id: { type: DataTypes.INTEGER, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        type: { type: DataTypes.ENUM, values: CourtTypes },
        stats: { type: DataTypes.TEXT, allowNull: false, 
                 get: transformer.get, set: transformer.set }
    }, {
        instanceMethods: { toJSON: transformer.toJSON },
        associate: function(models) {
        }
    });

    Court.types = CourtTypes;
    
    return Court;
};
