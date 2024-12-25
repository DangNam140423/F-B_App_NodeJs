'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Allcode, { foreignKey: 'roleId', targetKey: 'keyMap', as: 'roleData' })
      User.belongsTo(models.Allcode, { foreignKey: 'gender', targetKey: 'keyMap', as: 'genderData' })
      User.hasMany(models.Ticket, { foreignKey: 'idStaff', as: 'ticketData' })
      User.hasMany(models.Device, { foreignKey: 'idUser', as: 'deviceData' })
      User.belongsToMany(models.WorkSchedule, {
        through: 'WorkScheduleStaff',
        foreignKey: 'staffId',
        as: 'workScheduleData'
      });
      User.hasMany(models.Notification, { foreignKey: 'userId', as: 'NotificationData' })
    }
  };
  User.init({
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    address: DataTypes.STRING,
    gender: DataTypes.STRING,
    phone: DataTypes.STRING,
    roleId: DataTypes.STRING,
    image: DataTypes.STRING,
    token: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};