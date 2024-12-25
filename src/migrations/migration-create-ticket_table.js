'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TicketTables', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      ticketId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Tickets',
          key: 'id',
        },
      },
      tableId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Tables',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('TicketTables');
  },
};