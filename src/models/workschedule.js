'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class WorkSchedule extends Model {
        static associate(models) {

            WorkSchedule.belongsTo(models.Allcode, { foreignKey: 'timeType', targetKey: 'keyMap', as: 'allCodeData' })
            WorkSchedule.belongsToMany(models.User, {
                through: 'WorkScheduleStaff',
                foreignKey: 'workScheduleId',
                as: 'userData'
            })
        }
    };
    WorkSchedule.init({
        date: DataTypes.DATE,
        timeType: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'WorkSchedule',
    });
    return WorkSchedule;
};