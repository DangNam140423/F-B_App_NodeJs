'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Table extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Table.belongsToMany(models.Ticket, {
                through: 'TicketTable',
                foreignKey: 'tableId',
            });
            Table.belongsTo(models.Group, { foreignKey: 'idGroup', as: 'groupData' })
        }
    };
    Table.init({
        tableNumber: DataTypes.INTEGER,
        maxPeople: DataTypes.INTEGER,
        isEmpty: DataTypes.BOOLEAN,
        status: DataTypes.BOOLEAN,
        idGroup: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Table',
    });
    return Table;
};