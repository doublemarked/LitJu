var CourtTypes = ['district', 'county', 'administrative', 'supreme', 'supreme administrative'];

module.exports = function(sequelize, DataTypes) {
    var Court = sequelize.define('Court', {
        id: { type: DataTypes.INTEGER, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        type: { type: DataTypes.ENUM, values: CourtTypes }
    }, {
        associate: function(models) {
        }
    });

    Court.types = CourtTypes;
    
    return Court;
};
