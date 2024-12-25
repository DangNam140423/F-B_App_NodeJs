import { includes, reject } from 'lodash';
import db from '../models/index';
import { v4 as uuidv4 } from 'uuid';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

let getTopStaffHome = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let staff = await db.User.findAll({
                where: { roleId: 'R2', status: true },
                limit: limit,
                order: [
                    ['createdAt', 'DESC']
                ],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'roleData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                ],
                raw: true,
                nest: true
            })
            resolve({
                errCode: 0,
                errMessage: "Ok",
                data: staff,
            });
        } catch (error) {
            reject(error);
        }
    })
}

let getFreeStaff = async (date, timeType) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (date && timeType) {
                const today = new Date(Number(date));

                let scheduleofstaff = await db.User.findAll({
                    include: [{
                        model: db.WorkSchedule,
                        through: {
                            attributes: [],
                        },
                        as: 'workScheduleData',
                        attributes: ['date', 'timeType'],
                    }],
                    attributes: ['id'],
                    where: {
                        roleId: 'R2',
                        status: true,
                        '$workScheduleData.date$': today,
                        '$workScheduleData.timeType$': timeType
                    },
                    required: false,
                    raw: false
                });


                const arrBackSet = new Set(
                    scheduleofstaff.map(item => {
                        return (
                            item.id
                        )
                    })
                );


                let arrStaff = await db.User.findAll({
                    where: {
                        roleId: 'R2', status: true,
                    },
                    attributes: ['id', 'fullName', 'email', 'phone', 'roleId', 'image'],
                });

                let arrFreeStaff = arrStaff.filter(item => !arrBackSet.has(item.id));

                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                    arrFreeStaff
                })
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter!'
                })
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
}


let getWorkSchedule = (date, timeType) => {
    return new Promise(async (resolve, reject) => {
        try {
            const today = new Date(Number(date));

            let scheduleofstaff = await db.WorkSchedule.findAll({
                include: [{
                    model: db.User,
                    where: { status: true },
                    through: {
                        attributes: [],
                    },
                    attributes: ['id', 'fullName', 'email', 'phone', 'roleId', 'image', 'status'],
                    as: 'userData'
                },
                { model: db.Allcode, as: 'allCodeData', attributes: ['valueEn', 'keyMap'] },
                ],
                attributes: ['date', 'timeType', 'id'],
                where: {
                    date: today,
                    timeType: timeType ? timeType : { [Op.in]: ['SS1', 'SS2', 'SS3'] },

                },
                order: [
                    ['timeType', 'ASC'],
                ],
                raw: false
            });


            const groupedSchedule = scheduleofstaff.reduce((acc, item) => {
                const timeType = item.timeType;

                const existingGroup = acc.find(group =>
                    group.timeType === timeType
                );

                if (existingGroup) {
                    existingGroup.userData.push(...item.userData);
                } else {
                    acc.push({
                        id: item.id,
                        date: item.date,
                        timeType: item.timeType,
                        userData: [...item.userData],
                        allCodeData: item.allCodeData
                    });
                }

                return acc;
            }, []);

            const arrTimeType = await db.Allcode.findAll({
                where: { type: 'SCHEDULE_STAFF' },
                attributes: [['keyMap', 'timeType'], 'valueEn'],
                order: [
                    ['keyMap', 'ASC'],
                ],
            });

            arrTimeType.forEach(element => {
                if (!groupedSchedule.find(item => item.timeType === element.timeType)) {
                    groupedSchedule.push({
                        date: groupedSchedule && groupedSchedule[0] ? groupedSchedule[0].date : '',
                        timeType: element.timeType,
                        userData: [],
                        allCodeData: {
                            keyMap: element.timeType,
                            valueEn: element.valueEn
                        }
                    })
                }
            });

            const order = ['SS1', 'SS2', 'SS3'];

            groupedSchedule.sort((a, b) => {
                return order.indexOf(a.timeType) - order.indexOf(b.timeType);
            });


            resolve({
                errCode: 0,
                errMessage: 'Okk',
                workSchedule: groupedSchedule
            });
        } catch (error) {
            reject(error)
        }
    })
}

let getScheduleOfStaff = (date, idStaff) => {
    return new Promise(async (resolve, reject) => {
        try {
            const today = new Date(Number(date));

            let scheduleofstaff = await db.User.findOne({
                include: [{
                    model: db.WorkSchedule,
                    through: {
                        attributes: [],
                    },
                    as: 'workScheduleData',
                    attributes: ['date', 'timeType'],
                    include: [
                        { model: db.Allcode, as: 'allCodeData', attributes: ['valueEn'] },
                    ]
                }],
                attributes: ['id', 'fullName', 'email', 'phone', 'roleId', 'image'],
                where: {
                    id: idStaff,
                    roleId: 'R2',
                    status: true,
                    '$workScheduleData.date$': today,
                },
                raw: false
            });
            let flattenedResults = {
                id: scheduleofstaff.id,
                fullName: scheduleofstaff.fullName,
                email: scheduleofstaff.email,
                phone: scheduleofstaff.phone,
                roleId: scheduleofstaff.roleId,
                image: scheduleofstaff.image,
                workScheduleData: scheduleofstaff.workScheduleData.map(schedule => ({
                    date: schedule.date,
                    timeType: schedule.timeType,
                    valueEn: schedule.allCodeData.valueEn
                }))
            };

            resolve({
                errCode: 0,
                errMessage: 'Okk',
                workSchedule: flattenedResults
            });
        } catch (error) {
            reject(error)
        }
    })
}

let checkSchedule = async (date, timeType, arrStaff) => {
    const schedule = await getWorkSchedule(date, timeType);
    if (schedule && schedule.workSchedule && schedule.workSchedule.length > 0) {
        const arrStaffOld = new Set();

        schedule.workSchedule.forEach(item => {
            item.userData.forEach(staffData => {
                arrStaffOld.add(staffData.dataValues.id);
            });
        });


        let result = arrStaff.some(item => arrStaffOld.has(item));
        return result;
    }
    return false;
}

let getExistIdWorkSchedule = async (date, timeType) => {
    let scheduleofstaff = await db.WorkSchedule.findOne({
        where: {
            date: new Date(Number(date)),
            timeType: timeType ? timeType : { [Op.in]: ['SS1', 'SS2', 'SS3'] },

        },
        raw: false
    });
    return scheduleofstaff || null;
}

let createWorkSchedule = (date, timeType, arrStaff) => {
    return new Promise(async (resolve, reject) => {
        try {
            const transaction = await db.sequelize.transaction();

            if (date && timeType && arrStaff && arrStaff.length > 0) {
                const check = await checkSchedule(date, timeType, arrStaff);

                if (!check) {
                    let workSchedule = await getExistIdWorkSchedule(date, timeType);
                    if (!workSchedule?.id) {
                        workSchedule = await db.WorkSchedule.create({
                            id: uuidv4(),
                            date: new Date(date),
                            timeType: timeType
                        }, { transaction });
                    }

                    await workSchedule.addUserData(arrStaff, { transaction })
                        .then(() => {
                            transaction.commit();
                            resolve({
                                errCode: 0,
                                errMessage: 'Create work schedule success!'
                            })
                        })
                        .catch((error) => {
                            transaction.rollback();
                            resolve({
                                errCode: 3,
                                errMessage: `Error adding staff to work schedule: ${error.message}`,
                            })
                        });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'An employee has been assigned to this schedule.'
                    })
                }
            } else {
                await transaction.rollback();
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter!'
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let cancleWorkSchedule = (dataWorkSchedule) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (dataWorkSchedule.idStaff && dataWorkSchedule.idWorkSchedule) {
                await db.WorkScheduleStaff.destroy({
                    where: {
                        workScheduleId: dataWorkSchedule.idWorkSchedule,
                        staffId: dataWorkSchedule.idStaff
                    }
                });
                resolve({
                    errCode: 0,
                    errMessage: 'Success!'
                })
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter!'
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}


module.exports = {
    getTopStaffHome, getScheduleOfStaff, getWorkSchedule, createWorkSchedule, getFreeStaff, cancleWorkSchedule
}