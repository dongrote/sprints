'use strict';
const tableName = 'Projects',
  attributeName = 'GoldenStoryId';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(tableName, attributeName, {
      type: Sequelize.INTEGER,
      references: {
        model: 'Stories',
        key: 'id',
      },
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(tableName, attributeName);
  }
};
