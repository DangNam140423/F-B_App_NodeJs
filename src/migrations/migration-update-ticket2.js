'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn(
                'Tickets',
                'numberAdult',
                {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    defaultValue: 0,
                }
            ),
            queryInterface.addColumn(
                'Tickets',
                'numberKid',
                {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    defaultValue: 0,
                }
            ),
            queryInterface.addColumn(
                'Tickets',
                'numberAdultBest',
                {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    defaultValue: 0,
                }
            ),
            queryInterface.addColumn(
                'Tickets',
                'numberKidBest',
                {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    defaultValue: 0,
                }
            ),
            // Thêm các cột khác tương tự ở đây
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('Tickets', 'numberAdult'),
            queryInterface.removeColumn('Tickets', 'numberKid'),
            queryInterface.removeColumn('Tickets', 'numberAdultBest'),
            queryInterface.removeColumn('Tickets', 'numberKidBest'),
            // Xóa các cột khác tương tự ở đây
        ]);
    }
};
