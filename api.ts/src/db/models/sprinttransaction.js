'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SprintTransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.SprintTransaction.belongsTo(models.Sprint);
      models.SprintTransaction.belongsTo(models.Story);
    }
  };
  SprintTransaction.init({
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'SprintTransaction',
  });
  return SprintTransaction;
};