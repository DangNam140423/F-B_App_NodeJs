import groupServices from '../services/groupServices';

let handleGetAllGroup = async (req, res) => {
    try {
        let dataGroup = await groupServices.getAllGroup();
        return res.status(200).json({
            errCode: 0,
            message: 'OK',
            dataGroup
        });
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server..."
        })
    }

}

module.exports = {
    handleGetAllGroup
}