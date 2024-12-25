'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Tickets', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            idSchedule: {
                allowNull: false,
                type: Sequelize.UUID,
            },
            numberPeople: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            phoneCustomer: {
                type: Sequelize.STRING
            },
            nameCustomer: {
                allowNull: true,
                type: Sequelize.STRING
            },
            ticketType: {
                allowNull: true,
                type: Sequelize.STRING
            },
            idStaff: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            bill: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            dishOrder: {
                allowNull: true,
                type: Sequelize.STRING,
                defaultValue: ''
            },
            priceOrder: {
                allowNull: true,
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            payStatus: {
                allowNull: true,
                defaultValue: false,
                type: Sequelize.BOOLEAN
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
        await queryInterface.dropTable('Tickets');
    }
};