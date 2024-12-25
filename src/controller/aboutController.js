import aboutServices from '../services/aboutServices';

let handleGetAbout = async (req, res) => {
    try {
        let dataAbout = await aboutServices.getAbout();
        if (dataAbout) {
            // setTimeout(async () => {
            return res.status(200).json({
                errCode: 0,
                dataAbout
            });
            // }, 4000);
        } else {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Data About don't exist"
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

let handleEditAbout = async (req, res) => {
    try {
        let dataAbout = req.body;
        let result = await aboutServices.editAbout(dataAbout);
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
    handleGetAbout, handleEditAbout
}
