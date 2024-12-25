'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class About extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    About.init({
        contentHTML_en: DataTypes.TEXT('long'),
        contentHTML_vn: DataTypes.TEXT('long'),
        contentAbout_en: DataTypes.TEXT('long'),
        contentAbout_vn: DataTypes.TEXT('long'),
    }, {
        sequelize,
        modelName: 'About',
    });
    return About;
};