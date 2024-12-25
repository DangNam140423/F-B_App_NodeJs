'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Schedule extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Schedule.hasOne(models.Ticket, { foreignKey: 'idSchedule', as: 'ticketData' });
            Schedule.belongsTo(models.Allcode, { foreignKey: 'timeType', targetKey: 'keyMap', as: 'allCodeData' });
            Schedule.belongsTo(models.Group, { foreignKey: 'idGroup', as: 'groupData' });

        }
    };
    Schedule.init({
        // id: {
        //     type: DataTypes.UUID,
        //     allowNull: false,
        //     primaryKey: true,
        //     defaultValue: DataTypes.UUIDV4,
        // },
        date: DataTypes.DATE,
        timeType: DataTypes.STRING,
        idGroup: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Schedule'
    });

    return Schedule;
};