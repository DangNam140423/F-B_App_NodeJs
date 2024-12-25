'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Menus', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING
            },
            category: {
                allowNull: false,
                type: Sequelize.STRING
            },
            many_sizes: {
                allowNull: false,
                type: Sequelize.BOOLEAN
            },
            price_S: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            price_M: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            price_L: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            description: {
                allowNull: true,
                type: Sequelize.TEXT('long')
            },
            image: {
                allowNull: true,
                type: Sequelize.BLOB('long')
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
        await queryInterface.dropTable('Menus');
    }
};