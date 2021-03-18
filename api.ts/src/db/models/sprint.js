'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sprint extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Sprint.belongsTo(models.Project);
      models.Sprint.belongsToMany(models.Story, {through: models.SprintTransaction});
    }
  };
  Sprint.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.STRING,
    startAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    predictedPoints: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    claimedPoints: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    completedPoints: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {
    sequelize,
    modelName: 'Sprint',
  });
  return Sprint;
};
