'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Device extends Model {
        static associate(models) {
            Device.belongsTo(models.User, { foreignKey: 'idUser', targetKey: 'id', as: 'userData' })
        }
    };
    Device.init({
        idUser: DataTypes.INTEGER,
        tokenDevice: DataTypes.STRING, // thay đổi nếu ứng dụng cập nhật hoặc được xóa và cài lại
        // idDevice: DataTypes.STRING, // cố định không thay đổi, nên dùng để theo dõi tokenDevice và cập nhật lại nếu ứng dụng có cập nhật
    }, {
        sequelize,
        modelName: 'Device',
    });
    return Device;
};