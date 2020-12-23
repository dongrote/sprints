'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserStory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.UserStory.belongsTo(models.Project);
      models.UserStory.belongsToMany(models.Sprint, {through: models.UserStoryClaims});
    }
  };
  UserStory.init({
    ProjectId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    points: DataTypes.INTEGER,
    description: DataTypes.STRING,
    closingSprintId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserStory',
  });
  return UserStory;
};