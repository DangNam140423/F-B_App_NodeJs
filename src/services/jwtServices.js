import db from '../models/index';

const getGroupWithRoles = (user) => {
    return new Promise(async (resolve, reject) => {
        try {
            let roleId = user.roleId
            console.log("check role jwt: ", roleId);
            if (roleId) {
                resolve(roleId);
            }
        } catch (error) {
            reject(error);
        }
    })
}
module.exports = {
    getGroupWithRoles
}