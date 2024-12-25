import codeServices from '../services/codeServices';

let handleGetAllCode = async (req, res) => {
    try {
        // setTimeout(async () => {
        let type = req.query.type;
        let data = await codeServices.getAllCodes(type);
        return res.status(200).json(data);
        // }, 3000);
    } catch (error) {
        console.log('get all code error: ', error)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from Server !',
        })
    }
}

module.exports = {
    handleGetAllCode
}
