'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Tables', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            tableNumber: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            idGroup: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            maxPeople: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            isEmpty: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            status: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: false,
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
        await queryInterface.dropTable('Tables');
    }
};