import db from '../models/index';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

let getPushToken = (arrRoleId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let arrPushToken = await db.Device.findAll({
                include: [
                    { model: db.User, as: 'userData', attributes: ['roleId'] },
                ],
                where: {
                    '$userData.roleId$': { [Op.or]: arrRoleId },
                },
                attributes: ['tokenDevice'],
                raw: true,
                nest: true
            });
            const arrPushTokenNew = [];
            await arrPushToken.forEach(element => {
                arrPushTokenNew.push(element.tokenDevice);
            });
            resolve(arrPushTokenNew);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    getPushToken
}