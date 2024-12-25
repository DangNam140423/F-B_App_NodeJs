import db from '../models/index';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

let getDataHome = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let numberCustomers = await db.User.count({
                where: {
                    roleId: 'R3',
                    status: true
                },
            });
            let numberStaffs = await db.User.count({
                where: {
                    roleId: 'R2',
                    status: true
                },
            });
            let numberManager = await db.User.count({
                where: {
                    roleId: 'R1',
                    status: true
                },
            });
            let numberDishs = await db.Menu.count();


            let bill = await db.Ticket.sum('Ticket.bill', {
                where: {
                    payStatus: true,
                },
            });

            let priceOrder = await db.Ticket.sum('Ticket.priceOrder', {
                where: {
                    payStatus: true,
                },
            });

            let sales = bill * 1 + priceOrder * 1;

            const today = new Date();
            today.setHours(0, 0, 0, 0); // Đặt giờ, phút, giây và millisecond về 0 để có thời điểm bắt đầu ngày

            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            let arrTotalBillByStaff = await db.Ticket.findAll({
                attributes: [
                    'Ticket.idStaff',
                    [db.Sequelize.fn('MAX', db.Sequelize.col('Ticket.createdAt')), 'createdAt'],
                    [db.Sequelize.fn('COUNT', db.Sequelize.col('Ticket.id')), 'totalTicket'],
                    [db.Sequelize.fn('SUM', db.Sequelize.col('Ticket.numberAdult')), 'numberAdult'],
                    [db.Sequelize.fn('SUM', db.Sequelize.col('Ticket.numberKid')), 'numberKid'],
                    [db.Sequelize.fn('SUM', db.Sequelize.col('Ticket.numberAdultBest')), 'numberAdultBest'],
                    [db.Sequelize.fn('SUM', db.Sequelize.col('Ticket.numberKidBest')), 'numberKidBest'],
                    // [db.Sequelize.fn('SUM', db.Sequelize.col('Ticket.bill')), 'totalBill'],
                    [
                        db.Sequelize.fn(
                            'SUM',
                            db.Sequelize.literal('("bill" + "priceOrder")')
                        ),
                        'totalBill',
                    ],
                ],
                include: [
                    { model: db.User, as: 'staffData', attributes: ['fullName'] },
                ],
                where: {
                    payStatus: true,
                    // idStaff: {
                    //     [Sequelize.Op.ne]: 0 // Sử dụng Op.ne để tìm idStaff khác 0
                    // },
                    createdAt: {
                        [Sequelize.Op.between]: [today, tomorrow],
                    },
                },
                group: ['Ticket.idStaff', 'staffData.fullName',],
                order: [[db.Sequelize.col('createdAt'), 'ASC']], // Sắp xếp theo chiều giảm dần của createdAt
                raw: true,
                nest: true,
            })

            // let arrTotalBillByStaff = await db.Ticket.findAll({
            //     attributes: [
            //         'idStaff',
            //         'Ticket.createdAt',
            //         [Sequelize.fn('SUM', Sequelize.col('Ticket.bill')), 'totalBill'],
            //         [Sequelize.fn('COUNT', Sequelize.col('Ticket.id')), 'totalTicket'],
            //     ],
            //     where: {
            //         payStatus: true,
            //         createdAt: {
            //             [Sequelize.Op.between]: [today, tomorrow],
            //         },
            //     },
            //     include: [
            //         { model: db.User, as: 'staffData' },
            //     ],
            //     group: ['idStaff', 'staffData.id', 'Ticket.createdAt'], // Sử dụng 'staffData.id' để group theo id của staffData
            //     order: [[Sequelize.col('Ticket.createdAt'), 'ASC']], // Sắp xếp theo chiều giảm dần của createdAt
            //     raw: true,
            //     nest: true,
            // });
            resolve({
                numberCustomers,
                numberStaffs,
                numberManager,
                numberDishs,
                sales,
                arrTotalBillByStaff
            });
        } catch (error) {
            reject(error);
        }
    })
}


module.exports = {
    getDataHome
}