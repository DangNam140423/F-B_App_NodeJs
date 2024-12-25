import db from '../models/index';

let getAllCodes = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (typeInput) {
                let res = {};
                let allcode = await db.Allcode.findAll({
                    where: { type: typeInput }
                })
                // if (allcode === '') {
                //     resolve({
                //         errCode: 2,
                //         message: `The type isn't exit!`
                //     });
                // } else {
                    res.errCode = 0;
                    res.data = allcode;
                    resolve(res);
                // }
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing inputs parameter !'
                });
            }

        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    getAllCodes
}
