'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Abouts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            contentHTML_en: {
                allowNull: false,
                type: Sequelize.TEXT('long')
            },
            contentHTML_vn: {
                allowNull: false,
                type: Sequelize.TEXT('long')
            },
            contentAbout_en: {
                allowNull: false,
                type: Sequelize.TEXT('long')
            },
            contentAbout_vn: {
                allowNull: false,
                type: Sequelize.TEXT('long')
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
        await queryInterface.dropTable('Abouts');
    }
};