'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserStoryClaims extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.UserStoryClaims.belongsTo(models.Sprint);
      models.UserStoryClaims.belongsTo(models.UserStory);
    }
  };
  UserStoryClaims.init({
    SprintId: DataTypes.INTEGER,
    UserStoryId: DataTypes.INTEGER,
    completedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'UserStoryClaims',
  });
  return UserStoryClaims;
};