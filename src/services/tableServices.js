import db from '../models/index';
require('dotenv').config();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;



let getAllTable = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let table = [];
            table = await db.Table.findAll({
                order: [['id', 'ASC']],
            });
            resolve(table);
        } catch (error) {
            reject(error);
        }
    });
}



let createTable = (dataTable) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!dataTable || !dataTable.tableNumber || !dataTable.maxPeople) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing inputs parameter !'
                });
            } else {
                let table = await db.Table.create({
                    tableNumber: dataTable.tableNumber,
                    maxPeople: dataTable.maxPeople,
                })
                resolve({
                    errCode: 0,
                    errMessage: "Create a new table success",
                    data: table,
                });
            }
            // let arrTable = [];
            // for (let i = 1; i <= 31; i++) {
            //     let object = {};
            //     object.id = i;
            //     object.tableNumber = i;
            //     object.maxPeople = 2;
            //     if (i <= 2) {
            //         object.idGroup = 1
            //     } else if (i > 2 && i <= 8) {
            //         object.idGroup = 2
            //     } else if (i > 8 && i <= 14) {
            //         object.idGroup = 3
            //     } else if (i > 14 && i <= 17) {
            //         object.idGroup = 4
            //     } else if (i > 17 && i <= 23) {
            //         object.idGroup = 5
            //     } else if (i > 23 && i <= 29) {
            //         object.idGroup = 6
            //     } else if (i > 29 && i <= 31) {
            //         object.idGroup = 7
            //     }
            //     arrTable.push(object);
            // }
            // let table = await db.Table.bulkCreate(arrTable);
            // resolve({
            //     errCode: 0,
            //     errMessage: "Create a new table success",
            //     data: table,
            // });
        } catch (error) {
            reject(error);
        }
    })
}




let updateTable = (arrDataTable) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!arrDataTable) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing inputs parameter !"
                })
            } else {
                if (arrDataTable && arrDataTable.length > 0) {

                    await db.Table.update(arrDataTable, {
                        where: {}
                    })
                    resolve({
                        errCode: 0,
                        errMessage: "Update table succeeds !"
                    })
                    // .then(async (deletedRows) => {
                    //     // console.log(`${deletedRows} rows deleted.`); // xóa lượng hàng đã xóa
                    //     await db.Table.bulkCreate(arrDataTable);
                    //     resolve({
                    //         errCode: 0,
                    //         errMessage: "Update table succeeds !"
                    //     })
                    // })
                    // .catch((error) => {
                    //     reject(error);
                    // });
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}




let deleteTable = (idTable) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!idTable) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing inputs parameter !'
                })
            } else {
                let table = await db.Table.findOne({
                    where: { id: idTable }
                })

                if (!table) {
                    resolve({
                        errCode: 2,
                        errMessage: `The table isn't exit!`
                    })
                } else {
                    await db.Table.destroy({
                        where: {
                            id: idTable
                        }
                    });
                    resolve({
                        errCode: 0,
                        errMessage: `Delete the table success`
                    })
                }
            }
        } catch (error) {
            reject(error);
        }
    })
}

let addTimeType = (timeType, number) => {
    // Lấy phần số từ chuỗi 'T'
    const timeNumber = parseInt(timeType.substring(1));
    // Thực hiện phép toán cộng
    const resultNumber = timeNumber + number;
    // Chuyển lại số thành chuỗi 'T'
    const resultTimeType = 'T' + resultNumber;
    return resultTimeType;
}



let getTableEmptyBySchedule = (dataSchedule) => {
    // dataSchedule ( date, timeType)
    return new Promise(async (resolve, reject) => {
        try {
            const today = new Date(dataSchedule.date);
            today.setUTCHours(0, 0, 0, 0); // Đặt giờ, phút, giây và millisecond về 0 để có thời điểm bắt đầu ngày

            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            const arrTimeType = [
                addTimeType(dataSchedule.timeType, -1),
                addTimeType(dataSchedule.timeType, -2),
                dataSchedule.timeType,
                addTimeType(dataSchedule.timeType, 1),
                addTimeType(dataSchedule.timeType, 2)
            ];

            let arrSchedule = await db.Schedule.findAll({
                where: {
                    date: {
                        [Op.between]: [today, tomorrow],
                    },
                    timeType: {
                        [db.Sequelize.Op.in]: arrTimeType
                    }
                }
            });

            let arrSheduleIdGroup = await db.Schedule.findAll({
                where: {
                    date: {
                        [Op.between]: [today, tomorrow],
                    },
                    timeType: dataSchedule.timeType
                }
            });


            // arrSchedule (id, date, timeType, idGroup)
            let arr_ticket_booked = [];
            for (let i = 0; i < arrSchedule.length; i++) {
                let ticket_booked = await db.Ticket.findAll({
                    where: { idSchedule: arrSchedule[i].id },
                    include: [
                        { model: db.Table, attributes: ['id'] },
                    ],
                    raw: true,
                    nest: true
                })
                if (ticket_booked && ticket_booked.length > 0) {
                    ticket_booked.map(item => {
                        arr_ticket_booked.push(item);
                    })
                }
            }

            let arrIdGroup = arrSheduleIdGroup.map(item => {
                return item.idGroup
            })

            let table = await db.Table.findAll({
                // where: { idGroup: arrIdGroup },
                order: [['id', 'ASC']]
            });

            if (arr_ticket_booked && arr_ticket_booked.length > 0) {
                // nếu tồn tại vé theo idSchedule
                for (let i = 0; i < arr_ticket_booked.length; i++) {
                    table.map((item) => {
                        if (item.status === true) {
                            // chỉ xử lý bàn đang hoạt động
                            if (item.id === arr_ticket_booked[i].Tables.id) {
                                item.isEmpty = false;
                            }
                        }
                    })
                }
            }


            // if (schedule) {
            //     // nếu lịch này tồn tại
            //     table = await db.Table.findAll();

            //     let ticket_booked = await db.Ticket.findAll({
            //         where: { idSchedule: idSchedule },
            //         include: [
            //             { model: db.Table, attributes: ['id'] },
            //         ],
            //         raw: true,
            //         nest: true
            //     })
            //     if (ticket_booked && ticket_booked.length > 0) {
            //         // nếu tồn tại vé theo idSchedule
            //         for (let i = 0; i < ticket_booked.length; i++) {
            //             table.map((item) => {
            //                 if (item.status === 1) {
            //                     // chỉ xử lý bàn đang hoạt động
            //                     if (item.id === ticket_booked[i].Tables.id) {
            //                         item.isEmpty = 0;
            //                     }
            //                 }
            //             })
            //         }
            //     }
            // }

            resolve(table);
        } catch (error) {
            reject(error);
        }
    });
}

let getTableEmptyByScheduleToBooking = (dataSchedule) => {
    // dataSchedule ( date, timeType)
    return new Promise(async (resolve, reject) => {
        try {
            const today = new Date(dataSchedule.date);
            today.setUTCHours(0, 0, 0, 0); // Đặt giờ, phút, giây và millisecond về 0 để có thời điểm bắt đầu ngày

            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            const arrTimeType = [
                addTimeType(dataSchedule.timeType, -1),
                addTimeType(dataSchedule.timeType, -2),
                dataSchedule.timeType,
                addTimeType(dataSchedule.timeType, 1),
                addTimeType(dataSchedule.timeType, 2)
            ];

            let arrSchedule = await db.Schedule.findAll({
                where: {
                    date: {
                        [Op.between]: [today, tomorrow],
                    },
                    timeType: {
                        [db.Sequelize.Op.in]: arrTimeType
                    }
                }
            });

            let arrSheduleIdGroup = await db.Schedule.findAll({
                where: {
                    date: {
                        [Op.between]: [today, tomorrow],
                    },
                    timeType: dataSchedule.timeType
                }
            });


            // arrSchedule (id, date, timeType, idGroup)
            let arr_ticket_booked = [];
            for (let i = 0; i < arrSchedule.length; i++) {
                let ticket_booked = await db.Ticket.findAll({
                    where: { idSchedule: arrSchedule[i].id },
                    include: [
                        { model: db.Table, attributes: ['id'] },
                    ],
                    raw: true,
                    nest: true
                })
                if (ticket_booked && ticket_booked.length > 0) {
                    ticket_booked.map(item => {
                        arr_ticket_booked.push(item);
                    })
                }
            }

            let arrIdGroup = arrSheduleIdGroup.map(item => {
                return item.idGroup
            })

            let table = await db.Table.findAll({
                where: { idGroup: arrIdGroup },
                order: [['id', 'ASC']]
            });

            if (arr_ticket_booked && arr_ticket_booked.length > 0) {
                // nếu tồn tại vé theo idSchedule
                for (let i = 0; i < arr_ticket_booked.length; i++) {
                    table.map((item) => {
                        if (item.status === true) {
                            // chỉ xử lý bàn đang hoạt động
                            if (item.id === arr_ticket_booked[i].Tables.id) {
                                item.isEmpty = false;
                            }
                        }
                    })
                }
            }

            let tableNotEmpty = table.filter(item => item.status === true && item.isEmpty === false);

            resolve(tableNotEmpty);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    createTable, updateTable, deleteTable, getAllTable, getTableEmptyBySchedule, getTableEmptyByScheduleToBooking
}