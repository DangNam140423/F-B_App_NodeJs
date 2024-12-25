'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class WorkScheduleStaff extends Model {
        static associate(models) {
        }
    };
    WorkScheduleStaff.init({
        workScheduleId: DataTypes.UUID,
        staffId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'WorkScheduleStaff',
    });
    return WorkScheduleStaff;
};