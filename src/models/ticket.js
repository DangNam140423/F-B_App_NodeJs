'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Ticket extends Model {
        static associate(models) {
            Ticket.belongsTo(models.User, { foreignKey: 'idStaff', targetKey: 'id', as: 'staffData' })
            Ticket.belongsTo(models.Schedule, { foreignKey: 'idSchedule', targetKey: 'id', as: 'scheduleData' })
            Ticket.belongsToMany(models.Table, {
                through: 'TicketTable',
                foreignKey: 'ticketId',
            });
        }
    };
    Ticket.init({
        idSchedule: DataTypes.UUID,
        numberPeople: DataTypes.INTEGER,
        phoneCustomer: DataTypes.STRING,
        nameCustomer: DataTypes.STRING,
        emailCustomer: DataTypes.STRING,
        ticketType: DataTypes.STRING,
        numberAdult: DataTypes.INTEGER,
        numberKid: DataTypes.INTEGER,
        numberAdultBest: DataTypes.INTEGER,
        numberKidBest: DataTypes.INTEGER,
        idStaff: DataTypes.INTEGER,
        bill: DataTypes.INTEGER,
        dishOrder: DataTypes.STRING,
        priceOrder: DataTypes.INTEGER,
        payStatus: DataTypes.BOOLEAN,
        payToken: DataTypes.STRING,
        receiveStatus: DataTypes.BOOLEAN,
        createdAt: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'Ticket',
    });
    return Ticket;
};