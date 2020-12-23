'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Sprints', {
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
      startAt: {
        type: Sequelize.DATE
      },
      finishAt: {
        type: Sequelize.DATE
      },
      description: {
        type: Sequelize.STRING
      },
      predictedPoints: {
        type: Sequelize.INTEGER,
      },
      completedPoints: {
        type: Sequelize.INTEGER,
      },
      claimedPoints: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('Sprints');
  }
};