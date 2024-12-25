import db from '../models/index';

let getNotification = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter!'
                })
            }
            let arrNotifi = await db.Notification.findAll({
                where: { userId: userId },
                order: [
                    ['createdAt', 'DESC'],
                ],
            })
            resolve({
                errCode: 0,
                errMessage: 'Ok',
                arrNotifi
            })
        } catch (error) {
            reject(error);
        }
    });
}

let createNotification = (arrUserId, content) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!arrUserId && arrUserId.length <= 0 && !content && !content.title && !content.body) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter!'
                })
            } else {
                let arrDataToCreate = arrUserId.reduce((arr, item) => {
                    let objectData = {
                        userId: item,
                        title: content.title,
                        body: content.body,
                        data: content.data ? content.data : null
                    }
                    arr.push(objectData);
                    return arr;
                }, [])

                await db.Notification.bulkCreate(arrDataToCreate);

                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }
        } catch (error) {
            reject(error);
        }
    });
}

let getNotifiNotRead = (arrRole) => {
    return new Promise(async (resolve, reject) => {
        try {

        } catch (error) {
            reject(error);
        }
    });
}

let updateNotification = (idNotification) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Notification.update(
                { isRead: true },
                {
                    where: {
                        id: idNotification,
                    },
                }
            );
            resolve({
                errCode: 0,
                errMessage: 'Ok',
            })
        } catch (error) {
            reject(error);
        }
    });
}

let deleteNotification = (idNotification) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Notification.destroy(
                {
                    where: {
                        id: idNotification,
                    },
                }
            );
            resolve({
                errCode: 0,
                errMessage: 'Ok',
            })
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    getNotification, createNotification, updateNotification, deleteNotification
}