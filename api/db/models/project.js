'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Project.hasMany(models.Sprint);
      models.Project.hasMany(models.UserStory);
    }
  };
  Project.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Project',
  });
  return Project;
};