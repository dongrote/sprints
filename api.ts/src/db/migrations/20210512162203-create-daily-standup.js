'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DailyStandups', {
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
      createdBy: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      whatDidIDoYesterday: {
        type: Sequelize.STRING
      },
      whatAmIDoingToday: {
        type: Sequelize.STRING
      },
      whatIsInMyWay: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('DailyStandups');
  }
};
