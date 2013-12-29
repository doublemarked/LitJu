module.exports = function(sequelize, DataTypes) {
    var Judge = sequelize.define('Judge', {
        id: { type: DataTypes.INTEGER, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
    }, {
        associate: function(models) {
        }
    });

    return Judge;
};
