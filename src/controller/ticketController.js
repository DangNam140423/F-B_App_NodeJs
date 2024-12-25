import ticketServices from '../services/ticketServices';
import homeServices from '../services/homeServices';
import db from '../models/index';
import axios from 'axios';
const { Kafka, logLevel } = require('kafkajs');


let handleGetAllTicket = async (req, res) => {
    try {
        let dataTicket = await ticketServices.getAllTicket(req.body);
        let summaryTicket = await ticketServices.getSummaryTicket(req.body.date);
        if (dataTicket) {
            return res.status(200).json({
                errCode: 0,
                errMessage: "Get all ticket success",
                dataTicket,
                summaryTicket
            });
        } else {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Data ticket don't exist"
            });
        }
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error form the server"
        });
    }
}


let handleGetCustomerTicket = async (req, res) => {
    try {
        let arrTicket = await ticketServices.getCustomerTicket(req.body.emailCustomer);
        if (arrTicket) {
            return res.status(200).json({
                errCode: 0,
                errMessage: "Get all ticket success",
                arrTicket
            });
        } else {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Data ticket don't exist"
            });
        }
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error form the server"
        });
    }
}

let handleGetTicketById = async (req, res) => {
    try {
        let result = await ticketServices.getTicketById(req.body.id);

        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server..."
        })
    }
}

// const sendKafkaMessage = async (producerKafka, message) => {
//     try {
//         await producerKafka.connect();
//         await producerKafka.send({
//             topic: 'ticket-notifications',
//             messages: [
//                 { value: JSON.stringify(message) },
//             ],
//         });
//     } catch (errorKafka) {
//         console.error("Failed to connect to Kafka broker:", errorKafka.message);
//         if (errorKafka.retriable) {
//             console.log("This error is retriable, Kafka will attempt to reconnect.");
//         } else {
//             console.log("This error is non-retriable. Please check your Kafka configuration.");
//         }
//     } finally {
//         await producerKafka.disconnect();
//     }
// }

let handleCreateNewTicketByCustomer = async (req, res, io) => {
    try {
        let dataTicket = req.body;
        let result = await ticketServices.createTicketByCustomer(dataTicket);

        // if (result.errCode === 0) {
        //     let ticketNew = await ticketServices.getTicketById(result.ticketId);
        //     result.ticketNew = ticketNew.ticket;

        //     let arrUserManager = await userServices.getAllUserByRole(['R0', 'R1']);
        //     const message = {
        //         title: "Confirm Ticket",
        //         body: "New order needs confirmation",
        //         data: { idTicket: result.ticketId },
        //         // badge: 1
        //     }

        //     await notificationServices.createNotification(arrUserManager, message);
        //     // let badge = await notificationServices.getNotifiNotRead(['R0', 'R1']);
        //     // lấy số lượng thông báo chưa đọc của từng manager ( badge )

        //     // lấy arr pushToken của user có role là R0 và R1
        //     let arrPushToken = await deviceServices.getPushToken(['R0', 'R1']);
        //     message.to = await arrPushToken;

        //     sendKafkaMessage(producerKafka, message);
        //     // await axios.post('https://exp.host/--/api/v2/push/send', {
        //     //     to: message.to,
        //     //     body: message.body,
        //     //     title: message.title,
        //     //     data: { data: message.data }
        //     // });

        //     // axios.post('https://app.nativenotify.com/api/indie/notification', {
        //     //     subID: "R0",
        //     //     appId: 23684,
        //     //     appToken: "Wuaq0f7zMq3lJxql3cEVrq",
        //     //     title: "Xác nhận đặt vé",
        //     //     message: "Có lịch đặt mới trên hệ thống cần xác nhận"
        //     // });



        //     // axios.post('https://app.nativenotify.com/api/indie/notification', {
        //     //     subID: `${dataTicket.email}`,
        //     //     appId: 23684,
        //     //     appToken: "Wuaq0f7zMq3lJxql3cEVrq",
        //     //     title: "Xác nhận đặt vé",
        //     //     message: "Đặt vé thành công"
        //     // });

        //     // let newTicket = await ticketServices.getAllTicket({ dataSearch: '', date: dataTicket.date });
        //     // let newSummaryTicket = await ticketServices.getSummaryTicket(dataTicket.date);
        //     // io.emit('newTicket', { newTicket, newSummaryTicket, date: dataTicket.date });

        //     // let newDataHome = await homeServices.getDataHome();
        //     // io.emit('newDataHome', { newDataHome });

        //     // let newDataChart = await ticketServices.getDataCToChart();
        //     // io.emit('newDataChart', { newDataChart });
        // }
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server..."
        })
    }

}

let handleCreateNewTicketByStaff = async (req, res, io) => {
    try {
        let dataTicket = req.body;
        let ticket = await ticketServices.createTicketByStaff(dataTicket);

        if (ticket.errCode === 0) {
            let newTicket = await ticketServices.getAllTicket({ dataSearch: '', date: dataTicket.date });
            let newSummaryTicket = await ticketServices.getSummaryTicket(dataTicket.date);
            io.emit('newTicket', { newTicket, newSummaryTicket, date: dataTicket.date });

            let newDataHome = await homeServices.getDataHome();
            io.emit('newDataHome', { newDataHome });

            let newDataChart = await ticketServices.getDataCToChart();
            io.emit('newDataChart', { newDataChart });
        }
        return res.status(200).json(ticket);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server..."
        })
    }

}

let handleVerifyTicket = async (req, res, io) => {
    try {
        let ticketId = req.body.ticketId;
        let ticketFind = await db.Ticket.findOne({
            include: [
                { model: db.User, as: 'staffData', attributes: ['id', 'fullName'] },
                { model: db.Schedule, as: 'scheduleData', attributes: ['id', 'date', 'timeType'] },
                // { model: db.Table },
            ],
            where: { id: ticketId },
            raw: true,
            nest: true
        });

        let info;
        if ('cancle' in req.body) {
            info = await ticketServices.verifyTicketCancle(req.body);
        } else {
            info = await ticketServices.verifyTicket(req.body);
        }

        if (info.errCode === 0) {
            let newTicket = await ticketServices.getAllTicket({ dataSearch: '', date: ticketFind.scheduleData.date.getTime() });
            let newSummaryTicket = await ticketServices.getSummaryTicket(ticketFind.scheduleData.date.getTime());
            io.emit('newTicket', { newTicket, newSummaryTicket, date: ticketFind.scheduleData.date.getTime() });

            let newDataHome = await homeServices.getDataHome();
            io.emit('newDataHome', { newDataHome });

            let newDataChart = await ticketServices.getDataCToChart();
            io.emit('newDataChart', { newDataChart });
        }

        return res.status(200).json(
            info
        )
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the Server'
        })
    }
}

let handleUpdateTicket = async (req, res, io) => {
    try {
        let dataTicket = req.body.dataTicket;
        let arrOrder = req.body.arrOrder;
        let message = '';
        const infoUser = req.user;

        if (arrOrder.length > 0) {
            message = await ticketServices.updateTicketOrder(dataTicket, arrOrder);

            if (message.errCode === 0) {
                let newTicket = await ticketServices.getAllTicket({ dataSearch: '', date: dataTicket.date });
                let newSummaryTicket = await ticketServices.getSummaryTicket(dataTicket.date);
                io.emit('newTicket', { newTicket, newSummaryTicket, date: dataTicket.date });

                let newDataHome = await homeServices.getDataHome();
                io.emit('newDataHome', { newDataHome });

                let newDataChart = await ticketServices.getDataCToChart();
                io.emit('newDataChart', { newDataChart });
            }
        } else {
            message = await ticketServices.updateTicket(dataTicket, infoUser);

            if (message.errCode === 0) {
                let newTicket = await ticketServices.getAllTicket({ dataSearch: '', date: dataTicket.date });
                let newSummaryTicket = await ticketServices.getSummaryTicket(dataTicket.date);

                let newTicket_oldDate = await ticketServices.getAllTicket({ dataSearch: '', date: dataTicket.date_old });
                let newSummaryTicket_oldDate = await ticketServices.getSummaryTicket(dataTicket.date_old);
                io.emit('newTicket_2',
                    { newTicket, newSummaryTicket, date: dataTicket.date },
                    { newTicket: newTicket_oldDate, newSummaryTicket: newSummaryTicket_oldDate, date: dataTicket.date_old }
                );

                let newDataHome = await homeServices.getDataHome();
                io.emit('newDataHome', { newDataHome });

                let newDataChart = await ticketServices.getDataCToChart();
                io.emit('newDataChart', { newDataChart });
            }
        }

        return res.status(200).json(
            message
        )
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error form the server"
        });
    }
}

let handleUpdateTicket2 = async (req, res, io) => {
    try {
        let dataTicket = req.body.dataTicket;
        let typeUpdate = req.body.type;
        let message;
        if (typeUpdate === 'active') {
            message = await ticketServices.updateActive(dataTicket);
        } else if (typeUpdate === 'pay') {
            message = await ticketServices.updatePayStatus(dataTicket);
        }

        return res.status(200).json(
            message
        )
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error form the server"
        });
    }
}


let handleDeleteTicket = async (req, res, io) => {
    try {
        let message = await ticketServices.deleteTicket(req.body.id);

        // if (message.errCode === 0) {
        //     let newTicket = await ticketServices.getAllTicket({ dataSearch: '', date: req.body.date });
        //     let newSummaryTicket = await ticketServices.getSummaryTicket(req.body.date);
        //     io.emit('newTicket', { newTicket, newSummaryTicket, date: req.body.date });

        //     let newDataHome = await homeServices.getDataHome();
        //     io.emit('newDataHome', { newDataHome });

        //     let newDataChart = await ticketServices.getDataCToChart();
        //     io.emit('newDataChart', { newDataChart });
        // }

        return res.status(200).json(
            message
        );
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error form the server"
        });
    }
}


let handleSendThanksMail = async (req, res) => {
    try {
        let info = await ticketServices.sendThanksMail(req.body.arrEmail);
        return res.status(200).json(
            info
        );
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error form the server"
        });
    }
}


let handleGetDataCToChart = async (req, res) => {
    try {
        let dataChart = await ticketServices.getDataCToChart();
        if (dataChart) {
            return res.status(200).json({
                errCode: 0,
                errMessage: "Get all dataChart success",
                dataChart
            });
        } else {
            return res.status(200).json({
                errCode: 1,
                errMessage: "DataChart don't exist"
            });
        }
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error form the server"
        });
    }
}



module.exports = {
    handleGetAllTicket, handleCreateNewTicketByCustomer, handleCreateNewTicketByStaff, handleUpdateTicket2,
    handleVerifyTicket, handleUpdateTicket, handleDeleteTicket, handleSendThanksMail, handleGetDataCToChart,
    handleGetTicketById, handleGetCustomerTicket
}