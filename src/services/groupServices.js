import db from '../models/index';


let getAllGroup = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataGroup = await db.Group.findAll();
            resolve(dataGroup);
        } catch (error) {
            reject(error);
        }
    })
}


module.exports = {
    getAllGroup
}