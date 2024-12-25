import db from '../models/index';
import menuServices from '../services/menuServices';
const cloudinary = require('cloudinary').v2;

let handleGetAllMenu = async (req, res) => {
    try {
        let categoryInput = req.query.category;  // categoryInput = 'All' or 'ten_category'
        let page = req.query.page;
        let limit = req.query.limit;
        if (page && limit) {
            if (categoryInput) {
                let menus = await menuServices.getMenuWithPagination(categoryInput, +page, +limit);
                return res.status(200).json({
                    errCode: 0,
                    message: 'OK',
                    menus
                });
            } else {
                return res.status(200).json({
                    errCode: 1,
                    errMessage: 'Missing inputs parameter !',
                    menus: []
                })
            }
        } else {
            // categoryInput = 'All' or 'ten_category'
            if (categoryInput) {
                let menus = await menuServices.getAllMenu(categoryInput);
                return res.status(200).json({
                    errCode: 0,
                    message: 'OK',
                    menus
                });
            } else {
                return res.status(200).json({
                    errCode: 1,
                    errMessage: 'Missing inputs parameter !',
                    menus: []
                })
            }
        }
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from the server"
        });
    }
}

let handleGetMenuByName = async (req, res) => {
    try {
        let input = req.body.inputSearch;
        let result = await menuServices.getMenuByName(input);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let handleCreateNewDish = async (req, res, io) => {
    try {
        let dataToCreate = req.body;
        dataToCreate.file = (req.file && req.file.path) ? req.file.path : null;

        let message = await menuServices.createNewDish(dataToCreate);
        if (message.errCode === 0) {
            let newMenu = await menuServices.getMenuWithPagination(dataToCreate.category_pre, dataToCreate.page_pre, dataToCreate.limi_pre);
            io.emit('newMenu', newMenu);
        }
        if (req.file && req.file.filename && message.errCode !== 0) {
            cloudinary.uploader.destroy(req.file.filename);
        }

        return res.status(200).json(
            message
        )
    } catch (e) {
        console.log(e);
        if (req.file && req.file.filename && message.errCode !== 0) {
            cloudinary.uploader.destroy(req.file.filename);
        }
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from the server"
        });
    }
}

let handleEditDish = async (req, res, io) => {
    try {
        let oldMenu = await menuServices.getMenuById(req.body.id);

        let dataToEdit = req.body;
        dataToEdit.file = (req.file && req.file.path) ? req.file.path : null;

        let result = await menuServices.editDish(dataToEdit);

        if (result.errCode === 0) {
            let newMenu = await menuServices.getMenuWithPagination(dataToEdit.category_pre, dataToEdit.page_pre, dataToEdit.limi_pre);
            io.emit('newMenu', newMenu);
            // update success with new image
            if (dataToEdit.file && oldMenu.dataMenu[0] && oldMenu.dataMenu[0].image) {
                // find and destroy old image
                let url = oldMenu.dataMenu[0].image;
                let urlArray = url.split("/");
                let filename = urlArray[7] + "/" + urlArray[8];
                cloudinary.uploader.destroy(filename.split(".")[0]);
            }
        }

        // update failed
        if (req.file && req.file.filename && result.errCode !== 0) {
            cloudinary.uploader.destroy(req.file.filename);
        }

        return res.status(200).json(
            result
        )
    } catch (e) {
        console.log(e);
        if (req.file && req.file.filename && result.errCode !== 0) {
            cloudinary.uploader.destroy(req.file.filename);
        }
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from the server"
        });
    }
}

let handleDeleteDish = async (req, res, io) => {
    try {
        let dataToDelete = req.body;
        let result = await menuServices.deleteDish(dataToDelete.id);
        if (result.errCode === 0) {
            let newMenu = await menuServices.getMenuWithPagination(dataToDelete.category_pre, dataToDelete.page_pre, dataToDelete.limi_pre);
            io.emit('newMenu', newMenu);
            if (result.dish && result.dish.image) {
                // find and destroy old image
                let url = result.dish.image;
                let urlArray = url.split("/");
                let filename = urlArray[7] + "/" + urlArray[8];
                cloudinary.uploader.destroy(filename.split(".")[0]);
            }
        }

        return res.status(200).json(
            result
        );
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from the server"
        });
    }
}


module.exports = {
    handleGetAllMenu, handleCreateNewDish, handleEditDish, handleDeleteDish, handleGetMenuByName
}