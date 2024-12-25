import staffServices from '../services/staffServices';
import db from '../models/index';

let getTopStaffHome = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) {
        limit = 10;
    }
    try {
        // setTimeout(async () => {
        let staff = await staffServices.getTopStaffHome(+limit); //dấu + để convert từ kiểu string sang nố nguyên
        return res.status(200).json(staff);
        // }, "10000");
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server..."
        })
    }
}

let handleGetWorkSchedule = async (req, res) => {
    try {
        const result = await staffServices.getWorkSchedule(req.query.date, req.query.timeType && req.query.timeType);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server..."
        })
    }
}


let handleGetScheduleOfStaff = async (req, res) => {
    try {
        const result = await staffServices.getScheduleOfStaff(req.body.date, req.body.idStaff);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server..."
        })
    }
}

let handleCreateWorkSchedule = async (req, res) => {
    try {
        const result = await staffServices.createWorkSchedule(req.body.date, req.body.timeType, req.body.arrStaff);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from server..."
        })
    }
}

let handleGetFreeStaff = async (req, res) => {
    try {
        const result = await staffServices.getFreeStaff(req.query.date, req.query.timeType);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from server..."
        })
    }
}

let handleCancleWorkSchedule = async (req, res) => {
    try {
        let result = await staffServices.cancleWorkSchedule(req.body);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error form the server"
        });
    }
}

module.exports = {
    getTopStaffHome,
    handleGetFreeStaff,
    handleGetScheduleOfStaff,
    handleGetWorkSchedule,
    handleCreateWorkSchedule,
    handleCancleWorkSchedule
}