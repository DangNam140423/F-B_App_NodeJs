require('dotenv').config();
import db from '../models/index';
import jwt from "jsonwebtoken";
import userServices from '../services/userServices';

const nonSecurePath = [
    '/', '/api/login', '/api/user/register', '/api/logout',
    '/api/verify-user',
    '/api/get-about',
    '/api/get-top-staff-home',
    '/webhook-chat-yesil'
];
// các path này sẽ không cần check quyền đăng nhập

const createJWT = (payload) => {
    let key = process.env.JWT_SECRET;
    let token = null
    try {
        token = jwt.sign(payload, key,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
    } catch (error) {
        console.log(error)
    }

    return token;
}

const verifyToken = (token) => {
    let key = process.env.JWT_SECRET;
    let decoded = null;
    try {
        decoded = jwt.verify(token, key);
        return { valid: true, decoded };
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return { valid: false, reason: 'TokenExpired' }; // Token đã hết hạn
            // thực hiện logout
        } else {
            console.log(error);
            return { valid: false, reason: 'InvalidToken' }; // Token không hợp lệ
        }
    }
}

const extractToken = (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
}


const checkMiddelwareUserJWT = async (req, res, next) => {
    if (nonSecurePath.includes(req.path)) {
        return next();
    }

    let cookies = req.cookies;
    let tokenFromHeader = extractToken(req);
    if (
        (cookies && cookies.jwt) ||
        tokenFromHeader
    ) {
        let token = cookies && cookies.jwt ? cookies.jwt : tokenFromHeader;
        const { valid, reason, decoded } = verifyToken(token);

        if (valid) {
            let userToImage = await db.User.findOne({
                where: { email: decoded.email },
                attributes: ['image'],
                raw: true
            });
            // lấy ảnh avatar của user
            decoded.image = userToImage.image;
            req.user = decoded;
            req.token = token;
            next();
        } else {
            if (reason === 'TokenExpired') {
                console.log('Token has expired');
                if (token) {
                    let dataToken = jwt.decode(token);
                    await db.Device.destroy({
                        where: {
                            tokenDevice: dataToken.tokenDevice,
                            idUser: dataToken.id
                        },
                    });
                }
            }
            return res.status(401).json({
                errCode: -1,
                data: '',
                errMessage: 'Not authnticated the user'
            })
        }
    } else {
        console.log("nguuuu");
        return res.status(401).json({
            errCode: -1,
            data: '',
            errMessage: 'Not authnticated the user'
        })
    }
}


const checkUserPermissonJWT = (req, res, next) => {
    if (nonSecurePath.includes(req.path) || req.path === '/api/account') {
        return next();
    }

    // req.user from checkMiddelwareUserJWT
    if (req.user) {
        let role = req.user.roleId;
        let email = req.user.email;
        let path = [];
        if (!role) {
            return res.status(403).json({
                errCode: -1,
                data: '',
                errMessage: `You don't permission to access this resource ...`
            })
        } else {
            switch (role) {
                case 'R0':
                    path = [
                        '/api/get-data-home',
                        '/api/get-all-user', '/api/create-new-user', '/api/edit-user', '/api/delete-user',
                        '/api/get-all-code',
                        '/api/get-all-menu', '/api/create-new-dish', '/api/edit-dish', '/api/delete-dish',
                        '/api/get-about', '/api/edit-about',
                        '/api/get-schedule', '/api/get-schedule2', '/api/bulk-create-schedule',
                        '/api/get-all-table', '/api/create-table', '/api/update-table', '/api/delete-table', '/api/get-table-empty',
                        '/api/get-ticket-by-id', '/api/get-all-ticket', '/api/create-ticket', '/api/update-ticket', '/api/delete-ticket', '/api/send-thanks-email',
                        '/api/verify-ticket',
                        '/api/get-data-chart',
                        '/api/get-all-group',
                        '/api/get-work-schedule', '/api/get-free-staff', '/api/create-work-schedule', '/api/cancle-work-schedule',
                        '/api/get-notification', '/api/update-notification', '/api/delete-notification'
                    ];
                    break;
                case 'R1':
                    path = [
                        '/api/get-data-home',
                        '/api/get-all-user', '/api/create-new-user', '/api/edit-user', '/api/delete-user',
                        '/api/get-all-code',
                        '/api/get-all-menu', '/api/create-new-dish', '/api/edit-dish', '/api/delete-dish',
                        '/api/get-about', '/api/edit-about',
                        '/api/get-schedule', '/api/get-schedule2', '/api/bulk-create-schedule',
                        '/api/get-all-table', '/api/create-table', '/api/update-table', '/api/delete-table', '/api/get-table-empty',
                        '/api/get-ticket-by-id', '/api/get-all-ticket', '/api/create-ticket', '/api/update-ticket', '/api/send-thanks-email',
                        '/api/verify-ticket',
                        '/api/get-data-chart',
                        '/api/get-all-group',
                        '/api/get-work-schedule', '/api/get-free-staff', '/api/create-work-schedule', '/api/cancle-work-schedule',
                        '/api/get-notification', '/api/update-notification', '/api/delete-notification'
                    ];
                    break;
                case 'R2':
                    path = [
                        '/api/get-data-home',
                        '/api/get-schedule2',
                        '/api/get-all-menu',
                        '/api/get-all-group',
                        '/api/get-all-code',
                        '/api/get-all-table', '/api/get-table-empty',
                        '/api/get-all-ticket', '/api/create-ticket', '/api/update-ticket', '/api/send-thanks-email',
                        '/api/get-data-chart',
                        '/api/get-schedule', '/api/get-schedule2', '/api/bulk-create-schedule',
                        '/api/get-schedule-of-staff',
                        '/api/get-work-schedule', '/api/get-free-staff', '/api/create-work-schedule',
                        '/api/get-notification', '/api/update-notification', '/api/delete-notification'
                    ];
                    break;
                case 'R3':
                    path = [
                        '/api/user/update-profile',
                        '/api/get-all-menu',
                        '/api/get-all-code',
                        '/api/user/create-ticket', '/api/user/get-customer-ticket',
                        '/api/user/get-schedule2',
                        '/api/user/get-all-menu',
                        '/api/user/get-table-empty',
                        '/api/user/get-top-staff-home',
                        '/api/user/get-menu-by-name',
                        '/api/user/get-ticket-by-id',
                        '/api/user/get-notification', '/api/user/update-notification', '/api/user/delete-notification',
                        '/chat-with-yesil', '/api/user/get-day-active'
                    ];
                    break;
                default:
                    break;
            }


            if (path.includes(req.path)) {
                next();
            } else {
                return res.status(403).json({
                    errCode: -1,
                    data: '',
                    errMessage: `You don't permission to access this resource ...`
                })
            }
        }

    } else {
        return res.status(401).json({
            errCode: -1,
            data: '',
            errMessage: 'Not authnticated the user'
        })
    }
}

module.exports = {
    createJWT, checkMiddelwareUserJWT, checkUserPermissonJWT
}