import db from '../models/index';
import homeServices from '../services/homeServices';

let handleGetDataHome = async (req, res) => {
    try {
        let data = await homeServices.getDataHome();
        return res.status(200).json({
            errCode: 0,
            message: 'OK',
            data
        });
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error form the server"
        });
    }
}



module.exports = {
    handleGetDataHome
}