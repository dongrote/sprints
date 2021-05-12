'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DailyStandup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.DailyStandup.belongsTo(models.User, {foreignKey: 'createdBy'});
      models.DailyStandup.belongsTo(models.Sprint);
    }
  };
  DailyStandup.init({
    whatDidIDoYesterday: DataTypes.STRING,
    whatAmIDoingToday: DataTypes.STRING,
    whatIsInMyWay: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'DailyStandup',
  });
  return DailyStandup;
};
