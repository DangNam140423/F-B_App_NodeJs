import accountServices from '../services/accountServices';

const getUserAccount = async (req, res) => {
    return res.status(200).json({
        errCode: 0,
        message: 'Okk',
        data: {
            jwtData: req.token,
            user: req.user
            // req.user and req.token from (checkMiddelwareUserJWT) in jwtAction.js
        }
    })
}

module.exports = {
    getUserAccount
}
