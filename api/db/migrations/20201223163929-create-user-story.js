'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserStories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ProjectId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Projects',
          key: 'id',
        },
      },
      title: {
        type: Sequelize.STRING
      },
      points: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.STRING
      },
      closingSprintId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Sprints',
          key: 'id',
        },
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
    await queryInterface.dropTable('UserStories');
  }
};