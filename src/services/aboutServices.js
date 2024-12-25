import db from '../models/index';

let getAbout = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let about = [];
            about = await db.About.findOne({
                where: { id: 1 }
            });
            resolve(about);
        } catch (error) {
            reject(error);
        }
    });
}

let editAbout = (dataAbout) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!dataAbout.contentHTML_en ||
                !dataAbout.contentHTML_vn ||
                !dataAbout.contentAbout_en ||
                !dataAbout.contentAbout_vn
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing inputs parameter !'
                })
            } else {
                let about_old = await db.About.findOne({
                    where: { id: 1 }
                })
                if (!about_old) {
                    resolve({
                        errCode: 2,
                        errMessage: "Data About don't exist !"
                    })
                } else {
                    let updateAbout = await db.About.update({
                        contentHTML_en: dataAbout.contentHTML_en,
                        contentHTML_vn: dataAbout.contentHTML_vn,
                        contentAbout_en: dataAbout.contentAbout_en,
                        contentAbout_vn: dataAbout.contentAbout_vn
                    }, {
                        where: { id: about_old.id }
                    });
                    if (!updateAbout) {
                        resolve({
                            errCode: 3,
                            errMessage: "Update about failed !"
                        })
                    } else {
                        resolve({
                            errCode: 0,
                            errMessage: "Update about succeeds !"
                        })
                    }
                }
            }
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    getAbout, editAbout
}