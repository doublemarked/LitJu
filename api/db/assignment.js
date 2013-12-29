module.exports = function(sequelize, DataTypes) {
  var Assignment = sequelize.define('Assignment', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    start: { type: DataTypes.DATE, allowNull: false },
    finish: { type: DataTypes.DATE, allowNull: true }
  }, {
    associate: function(models) {
      Assignment.belongsTo(models.Court);
      Assignment.belongsTo(models.Judge);
    }
  })
 
  return Assignment;
}
