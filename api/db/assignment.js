var transform = require("../util").transform;

module.exports = function(sequelize, DataTypes) {
    var transformer = transform.json('stats');
    var Assignment = sequelize.define('Assignment', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        start: { type: DataTypes.DATE, allowNull: false },
        finish: { type: DataTypes.DATE, allowNull: true },
        stats: { type: DataTypes.TEXT, allowNull: false, 
                 get: transformer.get, set: transformer.set }
    }, {
        instanceMethods: { toJSON: transformer.toJSON },
        associate: function(models) {
            Assignment.belongsTo(models.Court);
            Assignment.belongsTo(models.Judge);
        }
    })

    return Assignment;
}
