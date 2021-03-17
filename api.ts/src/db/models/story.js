'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Story extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Story.belongsTo(models.Project);
      models.Story.belongsToMany(models.Sprint, {through: models.SprintTransaction});
    }
  };
  Story.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.STRING,
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    completedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Story',
  });
  return Story;
};
