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
      models.Sprint.belongsToMany(models.UserStory, {through: models.UserStoryClaims});
    }
  };
  Sprint.init({
    ProjectId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    startAt: DataTypes.DATE,
    finishAt: DataTypes.DATE,
    description: DataTypes.STRING,
    predictedPoints: DataTypes.INTEGER,
    completedPoints: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    claimedPoints: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    }, {
    sequelize,
    modelName: 'Sprint',
  });
  return Sprint;
};