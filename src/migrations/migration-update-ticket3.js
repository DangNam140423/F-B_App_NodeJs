'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn(
                'Tickets',
                'emailCustomer',
                {
                    type: Sequelize.STRING,
                    allowNull: true,
                }
            ),
            queryInterface.addColumn(
                'Tickets',
                'payToken',
                {
                    type: Sequelize.STRING,
                    allowNull: true,
                }
            )
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('Tickets', 'emailCustomer'),
            queryInterface.removeColumn('Tickets', 'payToken'),
        ]);
    }
};
