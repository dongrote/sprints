'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserStoryClaims', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      SprintId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Sprints',
          key: 'id',
        },
      },
      UserStoryId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'UserStories',
          key: 'id',
        },
      },
      completedAt: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UserStoryClaims');
  }
};