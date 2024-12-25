'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class TicketTable extends Model {
        static associate(models) {
        }
    }

    TicketTable.init({
        ticketId: DataTypes.INTEGER,
        tableId: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'TicketTable',
    });

    return TicketTable;
};
