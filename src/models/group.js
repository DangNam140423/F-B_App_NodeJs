'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Group extends Model {

        static associate(models) {
            // Group.belongsToMany(models.Ticket, {
            //     through: 'TicketTable',
            //     foreignKey: 'tableId',
            // });
            Group.hasMany(models.Table, { foreignKey: 'idGroup', as: 'tableData' })
            Group.hasMany(models.Schedule, { foreignKey: 'idGroup', as: 'scheduleData' })

            // Group.belongsToMany(models.Schedule, {
            //     through: 'ScheduleGroup',
            //     foreignKey: 'idGroup',
            // });
        }
    };
    Group.init({
        nameGroup: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Group',
    });
    return Group;
};