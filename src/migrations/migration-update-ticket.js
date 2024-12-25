'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            'Tickets',
            'receiveStatus',
            {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: true,
            }
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('Tickets', 'receiveStatus');
    }
};
