'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupRoleBinding extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.GroupRoleBinding.belongsTo(models.Group);
      models.GroupRoleBinding.belongsTo(models.User);
    }
  };
  GroupRoleBinding.init({
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'GroupRoleBinding',
  });
  return GroupRoleBinding;
};
