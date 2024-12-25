import notificationServices from '../services/notificationServices';

let handleGetNotification = async (req, res) => {
    try {
        let userId = req.body.userId;
        let result = await notificationServices.getNotification(userId);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error form the server"
        });
    }
}

let handleCreateNotification = async (req, res) => {
    try {
        let userId = req.body.arrUserId;
        let content = req.body.content;
        let result = await notificationServices.createNotification(userId, content);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error form the server"
        });
    }
}


let handleUpdateNotification = async (req, res) => {
    try {
        let idNotification = req.body.idNotification;
        let result = await notificationServices.updateNotification(idNotification);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error form the server"
        });
    }
}


let handleDeleteNotification = async (req, res) => {
    try {
        let idNotification = req.body.idNotification;
        let result = await notificationServices.deleteNotification(idNotification);
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
    handleGetNotification, handleCreateNotification, handleUpdateNotification, handleDeleteNotification
}
