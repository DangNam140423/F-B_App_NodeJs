import tableServices from '../services/tableServices';
import db from '../models/index';

let handleGetAllTable = async (req, res) => {
    try {
        let dataTable = await tableServices.getAllTable();
        if (dataTable) {
            return res.status(200).json({
                errCode: 0,
                errMessage: "Get all table success",
                dataTable
            });
        } else {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Data table don't exist"
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

let handleCreateNewTable = async (req, res) => {
    try {
        let dataTable = req.body;
        let table = await tableServices.createTable(dataTable);
        return res.status(200).json(table);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server..."
        })
    }

}


let handleUpdateTable = async (req, res) => {
    try {
        let arrdataTable = req.body;
        let result = await tableServices.updateTable(arrdataTable);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error form the server"
        });
    }
}



let handleDeleteTable = async (req, res) => {
    try {
        let message = await tableServices.deleteTable(req.body.id);
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



let handleGetTableEmptyBySchedule = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing inputs parameter !",
            });
        } else {
            let dataTable = await tableServices.getTableEmptyBySchedule(req.body);
            if (dataTable) {
                return res.status(200).json({
                    errCode: 0,
                    errMessage: "Get table empty success",
                    dataTable
                });
            } else {
                return res.status(200).json({
                    errCode: 2,
                    errMessage: "Data table empty don't exist"
                });
            }
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
    handleCreateNewTable, handleDeleteTable, handleUpdateTable, handleGetAllTable, handleGetTableEmptyBySchedule
}