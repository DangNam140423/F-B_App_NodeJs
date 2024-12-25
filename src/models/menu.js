'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Menu extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Menu.belongsTo(models.Allcode, { foreignKey: 'category', targetKey: 'keyMap', as: 'categoryData' })
        }
    };
    Menu.init({
        name: DataTypes.STRING,
        many_sizes: DataTypes.BOOLEAN,
        price_S: DataTypes.INTEGER,
        price_M: DataTypes.INTEGER,
        price_L: DataTypes.INTEGER,
        category: DataTypes.STRING,
        description: DataTypes.TEXT('long'),
        image: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Menu',
    });
    return Menu;
};