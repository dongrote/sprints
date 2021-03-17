'use strict';
const tableName = 'Projects',
  attributeName = 'GroupId';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(tableName, attributeName, {
      type: Sequelize.INTEGER,
      references: {
        model: 'Groups',
        key: 'id',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(tableName, attributeName);
  }
};
