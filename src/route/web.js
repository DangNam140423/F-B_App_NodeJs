import express from "express";
import userController from '../controller/userController';
import codeController from '../controller/codeController';
import staffController from '../controller/staffController';
import menuController from '../controller/menuController';
import aboutController from '../controller/aboutController';
import scheduleController from '../controller/scheduleController.js';
import accountController from '../controller/accountController.js'
import tableController from '../controller/tableController.js';
import ticketController from '../controller/ticketController.js'
import groupController from '../controller/groupController.js'
import homeController from '../controller/homeController.js';
import webhookChatBotController from '../controller/webhookChatBotController.js';
import chatBotController from '../controller/chatBotController.js';
import notificationController from '../controller/notificationController.js'

import { checkMiddelwareUserJWT, checkUserPermissonJWT } from '../middleware/jwtAction.js'
import uploadCloudinary from "../middleware/uploadCloudinary.js";

let router = express.Router();

// const isAdmin = require("./middlewares")


const initWebRoute = (app, io) => {
    router.get('/', userController.handleHome);



    //                            API SYSTEM ADIM
    router.all('*', checkMiddelwareUserJWT, checkUserPermissonJWT)

    router.post('/api/login', userController.handleLogin);
    router.post('/api/logout', userController.handleLogout);
    router.post('/api/register');
    router.get('/api/account', accountController.getUserAccount);


    router.get('/api/get-all-user', userController.handleGetAllUser);
    router.post('/api/create-new-user', uploadCloudinary.single('avatar'), (req, res) => userController.handleCreateNewUser(req, res, io));
    router.post('/api/verify-user', userController.handleVeriFyUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);


    // router.get('/api/get-top-staff-home', staffController.getTopStaffHome);


    router.get('/api/get-all-code', codeController.handleGetAllCode);

    // router.get('/api/get-all-category-menu', menuController.handleGetAllCategoryMenu);
    router.get('/api/get-all-menu', menuController.handleGetAllMenu);
    router.post('/api/create-new-dish', uploadCloudinary.single('image'), (req, res) => menuController.handleCreateNewDish(req, res, io));
    router.put('/api/edit-dish', uploadCloudinary.single('image'), (req, res) => menuController.handleEditDish(req, res, io));
    router.delete('/api/delete-dish', (req, res) => menuController.handleDeleteDish(req, res, io));


    // router.get('/api/get-about', aboutController.handleGetAbout);
    // router.put('/api/edit-about', aboutController.handleEditAbout);


    router.post('/api/get-schedule', scheduleController.handleGetSchedule);
    router.post('/api/get-schedule2', scheduleController.handleGetSchedule2);
    router.post('/api/bulk-create-schedule', (req, res) => scheduleController.handleSaveNewSchedule(req, res, io));


    router.get('/api/get-all-table', tableController.handleGetAllTable);
    router.post('/api/create-table', tableController.handleCreateNewTable);
    router.put('/api/update-table', tableController.handleUpdateTable);
    router.delete('/api/delete-table', tableController.handleDeleteTable);
    router.post('/api/get-table-empty', tableController.handleGetTableEmptyBySchedule);


    router.post('/api/get-all-ticket', ticketController.handleGetAllTicket);
    router.post('/api/get-ticket-by-id', ticketController.handleGetTicketById);
    router.post('/api/create-ticket', (req, res) => ticketController.handleCreateNewTicketByStaff(req, res, io));
    router.post('/api/verify-ticket', (req, res) => ticketController.handleVerifyTicket(req, res, io));
    router.put('/api/update-ticket', (req, res) => ticketController.handleUpdateTicket2(req, res, io));
    router.delete('/api/delete-ticket', (req, res) => ticketController.handleDeleteTicket(req, res, io));
    router.post('/api/send-thanks-email', ticketController.handleSendThanksMail);
    router.get('/api/get-data-chart', ticketController.handleGetDataCToChart);



    router.get('/api/get-all-group', groupController.handleGetAllGroup);


    router.get('/api/get-data-home', homeController.handleGetDataHome);

    router.get('/api/get-work-schedule', staffController.handleGetWorkSchedule);
    router.get('/api/get-free-staff', staffController.handleGetFreeStaff);
    router.post('/api/get-schedule-of-staff', staffController.handleGetScheduleOfStaff);
    router.post('/api/create-work-schedule', staffController.handleCreateWorkSchedule);
    router.post('/api/cancle-work-schedule', staffController.handleCancleWorkSchedule);

    router.post('/api/get-notification', notificationController.handleGetNotification);
    router.post('/api/create-notification', notificationController.handleCreateNotification);
    router.put('/api/update-notification', notificationController.handleUpdateNotification);
    router.delete('/api/delete-notification', notificationController.handleDeleteNotification);




    //                            API SYSTEM USER
    router.post('/api/user/register', uploadCloudinary.single('avatar'), (req, res) => userController.handleCreateNewUser(req, res, io));
    router.put('/api/user/update-profile', uploadCloudinary.single('avatar'), (req, res) => userController.handleEditUser(req, res, io));

    router.get('/api/user/get-all-menu', menuController.handleGetAllMenu);
    router.post('/api/user/get-menu-by-name', menuController.handleGetMenuByName);

    router.post('/api/user/get-ticket-by-id', ticketController.handleGetTicketById);
    router.post('/api/user/get-customer-ticket', ticketController.handleGetCustomerTicket);


    router.post('/api/user/get-schedule2', scheduleController.handleGetSchedule2);
    router.get('/api/user/get-day-active', scheduleController.handleGetDayActive);

    router.post('/api/user/get-table-empty', tableController.handleGetTableEmptyBySchedule);

    router.post('/api/user/create-ticket', (req, res) => ticketController.handleCreateNewTicketByCustomer(req, res, io));

    router.get('/api/user/get-top-staff-home', staffController.getTopStaffHome);

    router.post('/api/user/get-notification', notificationController.handleGetNotification);
    router.put('/api/user/update-notification', notificationController.handleUpdateNotification);
    router.delete('/api/user/delete-notification', notificationController.handleDeleteNotification);

    // dialogflow(được cấu hình webhook) tự động gửi thông báo đến server này thông qua request post 
    // lúc này server là 1 webhook
    // (dialogflow phải biết được Url của server này)
    router.post('/webhook-chat-yesil', webhookChatBotController.handleWebHookChatBot);

    // đây là nơi phân tích câu hỏi của người dùng và thực hiện các truy vấn
    router.post('/chat-with-yesil', chatBotController.handleChatBot);

    return app.use('/', router)
}


export default initWebRoute;
